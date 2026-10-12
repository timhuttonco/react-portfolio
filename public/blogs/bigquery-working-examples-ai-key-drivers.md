---
title: "BigQuery Working Examples: AI.KEY_DRIVERS"
description: "We've already covered AI.KEY_DRIVERS reaching General Availability in BigQuery at the end of September. This piece is the practical follow-up: a worked example you can run yourself, against a dataset built to show both what the function is good at, and a real limitation worth knowing about before you trust its top row."
image: "/images/blog/bq-key-drivers.png"
---

<img src="/images/blog/bq-key-drivers.png" alt="BigQuery Working Examples: AI.KEY_DRIVERS" width="100%">

### BigQuery Working Examples: AI.KEY_DRIVERS

We've already covered <a href="/blogs/bigquery-ai-key-drivers-security-center" target="_blank" rel="noopener">`AI.KEY_DRIVERS` reaching General Availability</a> in BigQuery at the end of September. This piece is the practical follow-up: a worked example you can run yourself, against a dataset built to show both what the function is good at, and a real limitation worth knowing about before you trust its top row.

<a href="https://cloud.google.com/bigquery/docs/introduction" target="_blank" rel="noopener">BigQuery</a>'s <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-key-drivers" target="_blank" rel="noopener">`AI.KEY_DRIVERS`</a> function takes a metric that changed and works out which data segments are statistically responsible for the change. You call it like any other table-valued function, directly in SQL. No model to train first, no separate tool to open.

#### The Scenario

We built a synthetic e-commerce orders dataset that tells a specific story: a two-week tracking issue that quietly under-counts orders from Paid Social on mobile, then gets fixed. It's the kind of problem this practice gets called in to find in real client data, just compressed into something you can load and query in an afternoon.

Setup instructions, the full column list, and the story the data tells are in our <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">dataset setup guide</a>. You'll need the table loaded as `bq_ai_demo.ecommerce_orders` before running the query below.

#### The Query

This compares revenue during the affected two weeks (2026-07-13 to 2026-07-26) against an equal-length window immediately before it, and asks AI.KEY_DRIVERS which combination of channel, device, region, and product category explains the difference.

```sql
WITH order_segments AS (
 SELECT
 channel,
 device_category,
 region,
 product_category,
 revenue,
 IF(order_date >= '2026-07-13', TRUE, FALSE) AS during_incident
 FROM `bq_ai_demo.ecommerce_orders`
 WHERE order_date BETWEEN '2026-06-29' AND '2026-07-26'
)
SELECT
 drivers,
 metric_interest,
 metric_reference,
 difference,
 relative_difference,
 unexpected_difference,
 contribution
FROM AI.KEY_DRIVERS(
 (SELECT * FROM order_segments),
 metric_col => 'revenue',
 interest_label_col => 'during_incident',
 dimension_cols => ['channel', 'device_category', 'region', 'product_category'],
 top_k => 10
)
ORDER BY contribution DESC;
```

A few points on the parameters. `metric_col` has to be summable. Revenue qualifies; a rate or ratio doesn't, and needs a different approach. `interest_label_col` is a boolean column splitting your rows into the group you're asking about (`TRUE`) and everything else (`FALSE`). `dimension_cols` is the list of columns the function is allowed to combine when looking for a segment. `top_k` caps how many ranked results come back. The `ORDER BY contribution DESC` is there to make the sort order explicit in the output — the function already ranks its results this way internally, but SQL doesn't guarantee that order survives downstream without you asking for it.

#### What Each Column in the Result Means

- **`drivers`**: The segment being described: either `all` (the whole comparison, with no dimension filter) or one or more `dimension=value` pairs.
- **`metric_interest`** / **`metric_reference`**: The summed metric (revenue, here) for that segment, in the group you flagged as `TRUE` via `interest_label_col` versus the group left as `FALSE`. In our query that's "during the incident" versus "the two weeks before it."
- **`difference`**: `metric_interest` minus `metric_reference`. The raw, unadjusted change in pounds.
- **`relative_difference`**: `difference` divided by `metric_reference`. The percentage change, which is what actually tells you how *severely* a segment moved, independent of its size.
- **`unexpected_difference`**: The part of this segment's `difference` that isn't already accounted for by its parent/overlapping segments. For a segment nested under another (like a two-dimension combination drilled from a single-dimension one), this is the bit of extra movement that combination adds beyond what the broader segment alone already explains.
- **`contribution`**: In practice, this is `ABS(difference)`, and it's what BigQuery's contribution analysis (the engine behind `AI.KEY_DRIVERS`) sorts its output by, largest first. It's a measure of raw dollar impact, not of how unusual or severe a segment's change was relative to its own size.

That last point matters more than it looks like it should, because of what actually happens when you run this.

#### What the Result Shows

Run the query above, and the top rows look like this (we ran it ourselves against this exact dataset to check):

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Rank</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>drivers</code></th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>difference</code></th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>relative_difference</code></th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">1</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>all</code></td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−3,743.17</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−8.58%</td>
</tr>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">2</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>region=United Kingdom</code></td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−3,021.98</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−13.70%</td>
</tr>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">3</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>device_category=mobile, region=United Kingdom</code></td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−2,610.07</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−25.57%</td>
</tr>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">4</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>device_category=desktop</code></td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−2,090.84</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−11.21%</td>
</tr>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">5</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>device_category=mobile</code></td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−1,511.62</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−7.77%</td>
</tr>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">6</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>product_category=Outerwear</code></td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−1,378.19</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−13.02%</td>
</tr>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">7</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>channel=Paid Search</code></td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−1,263.07</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">−11.88%</td>
</tr>
</tbody>
</table>
</div>

![AI.KEY_DRIVERS example query](/images/blog/bq-key-drivers.png)

Notice what's missing: `channel=Paid Social` combined with `device_category=mobile`, the exact segment we planted the tracking break in, isn't in the top 7. It isn't even in the top 10 as a combined segment at all. `channel=Paid Social` on its own shows up further down the list (rank 8, around a −15% relative difference), but the specific `Paid Social` + `mobile` interaction never gets generated as a candidate segment in this run.

That's not a mistake in the query or the data. We checked directly:

```sql
SELECT
 IF(order_date >= '2026-07-13', 'during_incident', 'reference_window') AS period,
 SUM(revenue) AS revenue
FROM `bq_ai_demo.ecommerce_orders`
WHERE order_date BETWEEN '2026-06-29' AND '2026-07-26'
 AND channel = 'Paid Social'
 AND device_category = 'mobile'
GROUP BY period;
```

![AI.KEY_DRIVERS missing biggest relative change in the dataset](/images/blog/bq-key-drivers2.png)

That returns roughly £1,474 during the incident versus £2,970 in the reference window, a 50% drop, by far the most severe relative change of any segment in the dataset. The planted anomaly is genuinely there. `AI.KEY_DRIVERS` just didn't surface it, because of how it ranks and generates candidates.

#### Why the Biggest Row Isn't Always the Real Story

`contribution` is just `ABS(difference)`, sorted largest first. The United Kingdom is half of all traffic in this dataset by design, so over any given two-week window, ordinary sampling noise in a segment that big produces a larger raw-pound swing than a genuine, severe problem confined to one channel-and-device combination that's a much smaller slice of total revenue. The function isn't wrong to rank it that way, that is what "contribution" means, but it means the top row answers "which segment moved the most money," not "which segment is actually broken."

There's a second limitation behind this specific result: `AI.KEY_DRIVERS` doesn't exhaustively test every combination of every dimension you give it. It drills one level deeper from whichever single segment ranks top overall, here that's `region=United Kingdom`, drilled by device, which is how `device_category=mobile, region=United Kingdom` made the list. It never tried combining `channel` with `device_category` directly, because `channel` didn't win the first round.

In practice, this means you can't just trust row one. Two things actually work:

1. **Look at `relative_difference`, not row position**, for any segment that does show up. A segment with a modest `contribution` but a severe `relative_difference` is worth a second look even if it's near the bottom of the list.
2. **Verify a suspected segment directly**, the way we just did above. If you already have a hypothesis (a channel, a device, a region someone's flagged), a two-line `GROUP BY` query answers it more reliably than scanning down a ranked list hoping the function tried that exact combination.

That second point is really the same discipline this whole series keeps coming back to. `AI.KEY_DRIVERS` is a genuinely fast way to screen a lot of candidate segments at once and a reasonable first pass when you have no hypothesis yet. It isn't a substitute for checking the specific thing you suspect, and treating its top row as a verdict rather than a lead is exactly the kind of mistake "AI-ready" data practice is supposed to prevent.

#### All Articles in This Series

- <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">Example dataset setup guide</a>
- <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a>
- <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a>
- <a href="/blogs/bigquery-working-examples-ai-causal-effect" target="_blank" rel="noopener">AI.CAUSAL_EFFECT</a>
- <a href="/blogs/bigquery-working-examples-ml-correlation" target="_blank" rel="noopener">ML.CORRELATION</a>
- <a href="/blogs/bigquery-working-examples-ml-metrics" target="_blank" rel="noopener">ML.METRICS</a>
