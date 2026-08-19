---
title: "The GA4 session_start Conundrum: How to Work With Impacted Data"
description: "Ever since Google Analytics 4 was first released, session and attribution issues caused by problems with the session_start event have been a constant topic of conversation. Here's a practical BigQuery toolkit to diagnose and quantify the impact while the root cause gets fixed."
image: "/images/blog/google-sessionstart-issues.png"
---

<img src="/images/blog/google-sessionstart-issues.png" alt="The GA4 session_start Conundrum: How to Work With Impacted Data" width="100%">

### The GA4 session_start Conundrum: How to Work With Impacted Data
Ever since <a href="https://support.google.com/analytics/answer/10089681" target="_blank" title="Google Analytics 4">Google Analytics 4</a> was first released, I have seen countless conversations and articles relating to session and attribution issues that are caused by problems with the *session_start* event.

Now, of course, the main priority is to fix this at source. However, if your data has already been impacted, I have created the below guide to help you fix inaccuracies in the short-term.

All of the queries below are available in a public GitHub repo, along with a README covering usage notes and caveats: <a href="https://github.com/timhuttonco/google-sessionstart-issues" target="_blank" title="google-sessionstart-issues on GitHub">google-sessionstart-issues</a>.

#### The Impacted Session Audit
**Purpose:** Identify sessions impacted by inaccurate *session_start* events.

This script reconstructs GA4 sessions from raw event data using the 30-minute inactivity rule, since the native session ID can't be trusted for this particular check. It flags any reconstructed session that never had a *session_start* event fire, and for each one, reports the URL of the first event that did arrive. We're using *user_pseudo_id* here because that remains consistent across fragmented sessions. This then gives you a list of landing pages where the *session_start* hit is most likely being dropped, and enough information to manually re-attribute the session.

**Why it's useful:** If a small number of landing pages account for most of the missing hits, that's usually a sign the page itself is causing it, whether that's from heavy third-party scripts delaying the tag, a consent banner blocking it, or a redirect firing before the hit can send, or any of the other myriad of issues that users have identified over the last few years. Because sessions missing a start event tend to fall back to "(direct)" or "(not set)" in GA4's attribution, this also shows you how much of your traffic is quietly sitting in that attribution black hole.

```sql
/* Impacted Session Audit — finds sessions where GA4 never fired
   session_start, and pulls the URL of the first event we did capture
   so we can spot which pages are dropping the hit. */
WITH event_base AS (
  -- Pull the fields we need per event, plus the previous event's timestamp
  -- so we can measure the gap between hits later.
  SELECT
    user_pseudo_id,
    event_timestamp,
    event_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location' LIMIT 1) AS page_location,
    LAG(event_timestamp) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) AS prev_event_ts
  FROM
    `your-googlecloud-project.analytics_12345678.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN '20260812' AND '20260815'
),
session_definitions AS (
  -- A gap of more than 30 minutes (GA4's default timeout) starts a new session.
  SELECT
    user_pseudo_id,
    event_timestamp,
    page_location,
    IF(prev_event_ts IS NULL OR (event_timestamp - prev_event_ts) > 1800000000, 1, 0) AS is_new_session,
    IF(event_name = 'session_start', 1, 0) AS is_session_start
  FROM
    event_base
),
session_ids AS (
  -- Running total of new-session flags gives each reconstructed session a stable ID.
  SELECT
    *,
    SUM(is_new_session) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) AS reconstructed_session_id
  FROM
    session_definitions
),
session_summary AS (
  -- Collapse to one row per session: did session_start fire, and what URL
  -- was on the first event we actually received?
  SELECT
    reconstructed_session_id,
    user_pseudo_id,
    MIN(event_timestamp) AS session_start_time,
    MAX(is_session_start) AS has_session_start_event,
    MIN_BY(page_location, event_timestamp) AS first_session_url
  FROM
    session_ids
  GROUP BY
    reconstructed_session_id,
    user_pseudo_id
)
-- Sessions with no session_start at all — the ones GA4 dropped.
SELECT
  reconstructed_session_id,
  user_pseudo_id,
  TIMESTAMP_MICROS(session_start_time) AS session_start_time,
  first_session_url
FROM
  session_summary
WHERE
  has_session_start_event = 0
ORDER BY
  session_start_time DESC;
```

Example output:

```
reconstructed_session_id  user_pseudo_id                    session_start_time       first_session_url
4                          8f3a1c9d2b7e4f61a0c9d3e5b2f7a891  2026-08-15 18:42:07 UTC  https://www.example.com/checkout/basket?utm_source=affiliate&utm_campaign=spring_sale
2                          1e7b45c8a9f3d2016b8e4a7c9f1d3e56  2026-08-15 09:14:33 UTC  https://www.example.com/product/garden-furniture-set
1                          3c9f8a1d2e5b7f4906a1c8d3e9f2b715  2026-08-14 21:03:51 UTC  https://www.example.com/landing/bank-holiday-offers
7                          2a6d9c4b1f8e3705c2b9f4a1d8e6c390  2026-08-14 12:27:19 UTC  https://www.example.com/product/garden-furniture-set
5                          5d2f9a3c8b1e6704a9f2c5b8e1d4a672  2026-08-13 16:55:02 UTC  https://www.example.com/
3                          9b4e1c7a2f8d5306b1e4a9c7f2d8e153  2026-08-12 08:31:44 UTC  https://www.example.com/checkout/basket?utm_source=affiliate&utm_campaign=spring_sale
```

It's one row per session, not per event, so a real *session_start* problem shows up as far fewer rows than raw event volume might suggest. The pattern to point at is repetition in *first_session_url*. In the above example, the affiliate checkout link and the furniture product page both appear twice here, which is the kind of evidence that lets you point a developer at a specific page instead of a vague "some hits are missing."

#### The Session Fragmentation Audit
**Purpose:** Explain inflated session counts in the GA4 UI.

Where the first script looks for a missing *session_start*, this one looks for the opposite problem: *session_start* firing correctly, just too often. It compares GA4's native *ga_session_id* against a time-based reconstruction of the same visit, and flags any reconstructed session that actually contains more than one native session ID — a "fragmented" journey, where GA4 split one continuous visit into two or more sessions.

**Why it's useful:** When you or your stakeholders spot a jump in sessions that isn't matched by a jump in users, this is usually where to look. GA4's session ID can reset mid-visit for reasons that have nothing to do with real user behaviour; a cookie cleared by <a href="https://webkit.org/tracking-prevention/" target="_blank" title="Intelligent Tracking Prevention">ITP</a>, a subdomain handover losing session state, or a client-side re-initialisation on an SPA route change. Each reset gets counted as a brand new session in the UI, even though the person never left. Or it can simply be an implementation problem. Comparing the native ID against a time-based reconstruction puts a number on exactly how much of that inflation is happening, and the event-level detail gives you somewhere concrete to start troubleshooting.

```sql
/* Session Fragmentation Audit — compares GA4's native ga_session_id against
   a time-based reconstruction of the same visit, to find cases where GA4
   split one continuous visit into multiple sessions. */
WITH event_base AS (
  -- Pull the native session ID GA4 assigned, plus the previous event's
  -- timestamp so we can measure real elapsed time between hits.
  SELECT
    user_pseudo_id,
    event_timestamp,
    event_name,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id' LIMIT 1) AS ga_session_id,
    LAG(event_timestamp) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) AS prev_event_ts
  FROM
    `your-googlecloud-project.analytics_12345678.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN '20260812' AND '20260815'
),
session_definitions AS (
  -- Reconstruct sessions purely on elapsed time, using the same 30-minute
  -- rule GA4 itself uses — this is our "ground truth", independent of
  -- whatever ga_session_id says.
  SELECT
    user_pseudo_id,
    event_timestamp,
    ga_session_id,
    IF(prev_event_ts IS NULL OR (event_timestamp - prev_event_ts) > 1800000000, 1, 0) AS is_new_session
  FROM
    event_base
),
session_ids AS (
  SELECT
    *,
    SUM(is_new_session) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) AS reconstructed_session_id
  FROM
    session_definitions
),
fragmentation_check AS (
  -- For each reconstructed (time-based) session, how many different native
  -- ga_session_id values does it actually contain?
  SELECT
    user_pseudo_id,
    reconstructed_session_id,
    MIN(event_timestamp) AS session_start_time,
    MAX(event_timestamp) AS session_end_time,
    COUNT(*) AS event_count,
    COUNT(DISTINCT ga_session_id) AS native_session_id_count,
    ARRAY_AGG(DISTINCT ga_session_id ORDER BY ga_session_id) AS native_session_ids
  FROM
    session_ids
  GROUP BY
    user_pseudo_id,
    reconstructed_session_id
)
-- Fragmented sessions: GA4 split one continuous visit into more than one session.
SELECT
  user_pseudo_id,
  reconstructed_session_id,
  TIMESTAMP_MICROS(session_start_time) AS session_start_time,
  TIMESTAMP_MICROS(session_end_time) AS session_end_time,
  event_count,
  native_session_id_count,
  native_session_ids
FROM
  fragmentation_check
WHERE
  native_session_id_count > 1
ORDER BY
  native_session_id_count DESC,
  session_start_time DESC;
```

If you just want the single headline number for stakeholders (as in the "inflation factor" across the whole window) swap the final `SELECT` above for this, which reuses the same *session_ids* CTE:

```sql
SELECT
  ROUND(
    COUNT(DISTINCT ga_session_id) /
    COUNT(DISTINCT CONCAT(user_pseudo_id, '-', CAST(reconstructed_session_id AS STRING))),
  2) AS session_inflation_factor
FROM
  session_ids;
```

A factor of, say, 1.3 means GA4 is reporting roughly 30% more sessions than actually happened.

Example output:

```
user_pseudo_id                    reconstructed_session_id  session_start_time       session_end_time         event_count  native_session_id_count  native_session_ids
8f3a1c9d2b7e4f61a0c9d3e5b2f7a891  3                          2026-08-13 11:02:04 UTC  2026-08-13 11:19:47 UTC  14           3                         [1744538512, 1744538890, 1744539201]
1e7b45c8a9f3d2016b8e4a7c9f1d3e56  6                          2026-08-14 20:11:32 UTC  2026-08-14 20:24:58 UTC  9            2                         [1744661492, 1744661810]
2a6d9c4b1f8e3705c2b9f4a1d8e6c390  1                          2026-08-12 07:45:19 UTC  2026-08-12 08:01:03 UTC  11           2                         [1744443919, 1744444260]
9b4e1c7a2f8d5306b1e4a9c7f2d8e153  5                          2026-08-15 14:33:07 UTC  2026-08-15 14:47:52 UTC  6            2                         [1744727587, 1744727901]
```

The first row is the strongest example to lead with: 14 events inside a 17-minute window (well within the 30-minute timeout) split across three native session IDs. *event_count* is worth keeping in the output for exactly this reason: a two-event session with two native IDs is a much weaker example than one with 14.

Example output:

```
session_inflation_factor
1.34
```

A figure of 1.34 here means GA4 is reporting roughly 34% more sessions than the time-based reconstruction says actually happened.

#### Revenue Attribution & Health Audit
**Purpose:** Quantify the financial impact of tracking gaps.

This is the "so what" script. It isolates sessions that ended in a purchase, splits them into Normal and Impacted depending on whether *session_start* actually fired, and totals the revenue sitting in each bucket.

**Why it's useful:** If impacted sessions turn out to be 20% of your revenue, the fix stops being a nice-to-have and becomes something everyone cares about. Because it uses the raw *page_location* rather than a cleaned URL, it also lets you check whether specific marketing parameters such as long affiliate strings, for example, show up more often in the broken sessions, which can point to a conflict between a marketing tag and core tracking.

```sql
/* Revenue Attribution & Session Health Audit — reconstructs sessions to
   attribute revenue back to the entry page, and flags which of those
   sessions were missing a session_start event, so broken tracking and
   its financial impact can be compared side by side. */
WITH event_base AS (
  -- Pull the URL and purchase value per event, plus the previous event's
  -- timestamp so we can measure the gap between hits later.
  SELECT
    user_pseudo_id,
    event_timestamp,
    event_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location' LIMIT 1) AS page_location,
    -- Revenue only exists on purchase events; NULL everywhere else.
    -- Note: this doesn't adjust for currency — if the property tracks
    -- multiple currencies, convert to a common one before trusting the sum.
    (SELECT value.double_value FROM UNNEST(event_params) WHERE key = 'value' LIMIT 1) AS purchase_revenue,
    LAG(event_timestamp) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) AS prev_event_ts
  FROM
    `your-googlecloud-project.analytics_12345678.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN '20260812' AND '20260815'
),
session_definitions AS (
  -- A gap of more than 30 minutes (GA4's default timeout) starts a new session.
  SELECT
    user_pseudo_id,
    event_timestamp,
    page_location,
    purchase_revenue,
    IF(prev_event_ts IS NULL OR (event_timestamp - prev_event_ts) > 1800000000, 1, 0) AS is_new_session,
    IF(event_name = 'session_start', 1, 0) AS is_session_start,
    IF(event_name = 'purchase', 1, 0) AS is_purchase
  FROM
    event_base
),
session_ids AS (
  -- Running total of new-session flags gives each reconstructed session a stable ID.
  SELECT
    *,
    SUM(is_new_session) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) AS reconstructed_session_id
  FROM
    session_definitions
),
session_summary AS (
  -- Collapse to one row per session: entry URL, total revenue, and
  -- whether session_start actually fired.
  SELECT
    reconstructed_session_id,
    user_pseudo_id,
    MIN(event_timestamp) AS session_start_time,
    MAX(is_session_start) AS has_session_start_event,
    MAX(is_purchase) AS session_had_purchase,
    SUM(IFNULL(purchase_revenue, 0)) AS total_revenue,
    MIN_BY(page_location, event_timestamp) AS first_session_url
  FROM
    session_ids
  GROUP BY
    reconstructed_session_id,
    user_pseudo_id
)
-- Every session that resulted in a purchase, flagged as Normal or Impacted.
SELECT
  reconstructed_session_id,
  user_pseudo_id,
  TIMESTAMP_MICROS(session_start_time) AS session_start_time,
  first_session_url,
  total_revenue,
  IF(has_session_start_event = 0, 'Impacted Session', 'Normal Session') AS session_status
FROM
  session_summary
WHERE
  session_had_purchase = 1
ORDER BY
  total_revenue DESC;
```

Example output:

```
reconstructed_session_id  user_pseudo_id                    session_start_time       first_session_url                                                                        total_revenue  session_status
12                         4d8f2a1c9b7e3506a2c9f4b1d8e3a765  2026-08-14 19:22:41 UTC  https://www.example.com/checkout/basket?utm_source=affiliate&utm_campaign=spring_sale  284.99         Impacted Session
8                          7c1e9a4b2f8d6503c9a1e4b7f2d9c360  2026-08-13 10:07:15 UTC  https://www.example.com/product/garden-furniture-set                                   199.50         Normal Session
15                         2b6d4c9a1f8e5307b4c1a9d6f2e8b451  2026-08-15 21:44:02 UTC  https://www.example.com/checkout/basket?utm_source=affiliate&utm_campaign=spring_sale  176.20         Impacted Session
3                          9f3a7c1d2e8b5604a3c8f1d5e9b2a716  2026-08-12 15:19:33 UTC  https://www.example.com/                                                                89.99          Normal Session
21                         1e5b8c4a9f2d6703a8b1c4f9d2e6a390  2026-08-14 08:52:47 UTC  https://www.example.com/product/garden-furniture-set                                   64.75          Impacted Session
```

This is the row-level view; a `SUM(total_revenue) GROUP BY session_status` on top of it is what actually gets quoted to a stakeholder. In this example, three of the five purchases are Impacted (£284.99 + £176.20 + £64.75 = £525.94), against £289.49 in Normal sessions — so roughly 64% of this sample's revenue is sitting in sessions with broken attribution. The affiliate checkout URL showing up twice, both times Impacted, is also a concrete example worth naming in the write-up of the "marketing tag conflicting with core tracking" pattern.

#### Revenue Recovery by Channel
**Purpose:** Show which channels are under-reported today, and by how much.

The Revenue Audit above tells you the total cost of the problem. This one splits that cost by channel, because "your data is wrong" doesn't move budget on its own. "The paid social channel is under-reporting revenue by 18%" does. Every impacted session currently shows up as Direct / (not set) in GA4, regardless of what actually brought that visitor to the site. This script parses the campaign parameters (or *gclid*) off *first_session_url* for every purchasing session, impacted or not, and compares the channel GA4 is showing today against the channel that revenue should be sitting in.

**Why it's useful:** This is usually the version of the numbers that actually gets a fix prioritised. "We think we're losing some revenue to tracking gaps" is easy to shrug off; "Paid Social's reported revenue is understated by £3,400 this month because its landing page is dropping session_start" is a specific, ownable problem with a specific budget attached to it. A channel showing no *current_revenue* at all but a non-zero *recovered_revenue* is the strongest version of this story as it means that channel isn't visibly generating any revenue in GA4 right now, when it actually is.

A caveat worth stating plainly here: the channel classification this script uses is a simplified stand-in for GA4's own default channel grouping rules, not an exact match. It doesn't cover every case GA4's own logic does (organic search referrer matching, cross-channel campaign rules, and so on), so the numbers won't tie out precisely if someone tries to reconcile them against GA4's own channel report. Say so up front if you're presenting this alongside the GA4 UI, and extend the `CASE` statement if closer parity matters for your use case, or you want to set up your own channel grouping here.

```sql
/* Revenue Recovery by Channel — compares the channel GA4 is currently
   crediting each purchase to against the channel it should be credited
   to, based on the campaign parameters on the entry URL. Impacted
   sessions always show as Direct in GA4 today, no matter what's in the
   URL, so this shows exactly how much revenue each channel is losing
   to that misattribution. */
WITH event_base AS (
  -- Pull the URL and purchase value per event, plus the previous event's
  -- timestamp so we can measure the gap between hits later.
  SELECT
    user_pseudo_id,
    event_timestamp,
    event_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location' LIMIT 1) AS page_location,
    -- Revenue only exists on purchase events; NULL everywhere else.
    -- Note: this doesn't adjust for currency — convert to a common one
    -- first if the property tracks more than one.
    (SELECT value.double_value FROM UNNEST(event_params) WHERE key = 'value' LIMIT 1) AS purchase_revenue,
    LAG(event_timestamp) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) AS prev_event_ts
  FROM
    `your-googlecloud-project.analytics_12345678.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN '20260812' AND '20260815'
),
session_definitions AS (
  -- A gap of more than 30 minutes (GA4's default timeout) starts a new session.
  SELECT
    user_pseudo_id,
    event_timestamp,
    page_location,
    purchase_revenue,
    IF(prev_event_ts IS NULL OR (event_timestamp - prev_event_ts) > 1800000000, 1, 0) AS is_new_session,
    IF(event_name = 'session_start', 1, 0) AS is_session_start,
    IF(event_name = 'purchase', 1, 0) AS is_purchase
  FROM
    event_base
),
session_ids AS (
  -- Running total of new-session flags gives each reconstructed session a stable ID.
  SELECT
    *,
    SUM(is_new_session) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp) AS reconstructed_session_id
  FROM
    session_definitions
),
session_summary AS (
  -- Collapse to one row per session: did it purchase, how much, and did
  -- session_start actually fire?
  SELECT
    reconstructed_session_id,
    user_pseudo_id,
    MAX(is_session_start) AS has_session_start_event,
    MAX(is_purchase) AS session_had_purchase,
    SUM(IFNULL(purchase_revenue, 0)) AS total_revenue,
    MIN_BY(page_location, event_timestamp) AS first_session_url
  FROM
    session_ids
  GROUP BY
    reconstructed_session_id,
    user_pseudo_id
),
channel_attribution AS (
  -- Recover the likely channel from the entry URL's campaign parameters —
  -- a simplified stand-in for GA4's default channel grouping. Expand this
  -- CASE statement if you need closer parity with GA4's own rules.
  SELECT
    *,
    CASE
      WHEN REGEXP_CONTAINS(first_session_url, r'[?&]gclid=') THEN 'Paid Search'
      WHEN LOWER(IFNULL(REGEXP_EXTRACT(first_session_url, r'[?&]utm_medium=([^&]+)'), '')) IN ('cpc', 'ppc', 'paidsearch') THEN 'Paid Search'
      WHEN LOWER(IFNULL(REGEXP_EXTRACT(first_session_url, r'[?&]utm_medium=([^&]+)'), '')) LIKE '%social%' THEN 'Paid Social'
      WHEN REGEXP_EXTRACT(first_session_url, r'[?&]utm_source=([^&]+)') IS NOT NULL THEN 'Other Campaign'
      ELSE 'Direct / (not set)'
    END AS recovered_channel
  FROM
    session_summary
  WHERE
    session_had_purchase = 1
),
channel_split AS (
  -- What GA4 shows today vs. what the entry URL says it should show.
  -- Impacted sessions always default to Direct in GA4 regardless of the
  -- URL; sessions with a working session_start are assumed to already be
  -- correctly attributed, so current and recovered match for those.
  SELECT
    IF(has_session_start_event = 0, 'Direct / (not set)', recovered_channel) AS current_channel,
    recovered_channel,
    total_revenue
  FROM
    channel_attribution
),
current_revenue_by_channel AS (
  SELECT current_channel AS channel, SUM(total_revenue) AS current_revenue
  FROM channel_split
  GROUP BY current_channel
),
recovered_revenue_by_channel AS (
  SELECT recovered_channel AS channel, SUM(total_revenue) AS recovered_revenue
  FROM channel_split
  GROUP BY recovered_channel
)
-- Current vs. recovered revenue per channel, and the size of the gap.
SELECT
  COALESCE(c.channel, r.channel) AS channel,
  ROUND(IFNULL(c.current_revenue, 0), 2) AS current_revenue,
  ROUND(IFNULL(r.recovered_revenue, 0), 2) AS recovered_revenue,
  ROUND(IFNULL(r.recovered_revenue, 0) - IFNULL(c.current_revenue, 0), 2) AS revenue_increase,
  ROUND(SAFE_DIVIDE(IFNULL(r.recovered_revenue, 0) - IFNULL(c.current_revenue, 0), NULLIF(c.current_revenue, 0)) * 100, 1) AS pct_increase
FROM
  current_revenue_by_channel c
FULL OUTER JOIN
  recovered_revenue_by_channel r
ON
  c.channel = r.channel
ORDER BY
  revenue_increase DESC;
```

Example output:

```
channel              current_revenue  recovered_revenue  revenue_increase  pct_increase
Direct / (not set)   612.40           86.45               -525.95           -85.9
Paid Search           145.00           320.75               175.75           121.2
Paid Social            0.00           176.20               176.20           (null)
Other Campaign         58.03           232.03               174.00           299.8
```

Two things worth pointing out explicitly when you write this up. First, *revenue_increase* nets to zero across the channels (-525.95 + 175.75 + 176.20 + 174.00 = 0) — it's a reallocation of revenue that already exists, not new money, and it's worth saying so plainly so nobody reads it as "the business made more revenue." Second, the null *pct_increase* for Paid Social is the strongest row in the table: that channel shows £0 in GA4 today despite actually driving £176.20, which is exactly the "invisible channel" scenario flagged above. `SAFE_DIVIDE` returns NULL rather than a meaningless percentage when the current base is zero. (This example also reconciles with the £815.43 total from the Revenue Audit example above; it's the same illustrative purchase set, just split by channel instead of by session_status.)

#### Summary: Your Workflow
Used together, these four queries take you from "the data looks wrong" to a precise diagnosis:

* The **Impacted Session Audit** shows the scale of the problem; how many sessions are affected, and which landing pages are most implicated.
* The **Fragmentation Audit** explains the inflated session count stakeholders are seeing in the UI.
* The **Revenue Audit** puts a total figure on what it's costing.
* The **Channel Revenue Recovery** breaks that figure down by channel, turning "this is costing us money" into "this is costing the paid social budget specifically", which is usually what actually gets a fix prioritised.

Reconstructing the session logic yourself in <a href="https://cloud.google.com/bigquery" target="_blank" title="Google BigQuery">BigQuery</a> means you're not relying on GA4's black-box session counting, you're working from the raw event stream, so the numbers are as close to ground truth as you're going to get.

Hopefully you found the above useful - do not hesitate to reach out with any questions.
