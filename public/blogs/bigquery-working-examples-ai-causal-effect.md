---
title: "BigQuery Working Examples: AI.CAUSAL_EFFECT"
description: "Third in our series of BigQuery AI function examples. The first two covered AI.KEY_DRIVERS finding which segment caused a metric to move, and AI.FORECAST projecting a series forward. This one answers a different question: once you've made a change, did it actually do anything, or would the numbers have moved anyway."
image: "/images/blog/bq-causal-effect.png"
---

<img src="/images/blog/bq-causal-effect.png" alt="BigQuery Working Examples: AI.CAUSAL_EFFECT" width="100%">

### BigQuery Working Examples: AI.CAUSAL_EFFECT

Third in our series of BigQuery AI function examples. The first two covered <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a> finding which segment caused a metric to move, and <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a> projecting a series forward. This one answers a different question: once you've made a change, did it actually do anything, or would the numbers have moved anyway.

<a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-causal-effect" target="_blank" rel="noopener">`AI.CAUSAL_EFFECT`</a> takes a time series and a point in time you tell it something changed, called the intervention. It builds a counterfactual, its estimate of what would have happened without the change, and compares that against what actually happened.

#### The Dataset

Same dataset as the rest of this series: our synthetic e-commerce orders table, with a built-in story. A tracking issue under-counted Paid Social orders on mobile from 2026-07-13 to 2026-07-26. The fix went in on 2026-07-27. Setup instructions are in our <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">dataset setup guide</a>; you'll need the table loaded as `bq_ai_demo.ecommerce_orders` first.

AI.KEY_DRIVERS, in the first article in this series, is what identifies that Paid Social plus mobile is the affected segment. This function picks up from there and asks whether the July 27 fix actually moved that segment's numbers, or whether any apparent recovery is just normal variation.

#### The Query

```sql
WITH daily_segment_revenue AS (
 SELECT
 TIMESTAMP(order_date) AS order_day,
 SUM(revenue) AS daily_revenue
 FROM `bq_ai_demo.ecommerce_orders`
 WHERE channel = 'Paid Social' AND device_category = 'mobile'
 GROUP BY order_day
)
SELECT *
FROM AI.CAUSAL_EFFECT(
 (SELECT * FROM daily_segment_revenue),
 data_col => 'daily_revenue',
 timestamp_col => 'order_day',
 intervention_timestamp => '2026-07-27 00:00:00',
 output_time_series => TRUE
);
```

`data_col` and `timestamp_col` identify the series the same way they do for AI.FORECAST. `intervention_timestamp` is the point you're telling the function to treat as the change, in our case the date the tracking fix went live. `output_time_series` set to `TRUE` returns the full day-by-day comparison rather than just a summary, which is what you want if you're going to chart it.

#### What the Result Shows

Run the query and look across the full set of returned columns for the days after July 27. You're looking for two series sitting side by side for each day: what the segment's revenue actually was, and what the function estimates it would have been without the fix. The gap between those two lines after the intervention date is the effect, and it should widen rather than stay flat, since the dataset has a sustained uplift built in from the fix date onward, not a one-off bump.

![Creating a new BigQuery table for AI use](/images/blog/bq-causal-effect.png)

#### Why This Matters More Than the Forecast on Its Own

A forecast alone can't tell you whether a change worked. If revenue goes up after you ship a fix, that's consistent with the fix working, and also consistent with a good week, a seasonal lift, or a coincidence. AI.CAUSAL_EFFECT is built to separate those. It uses the pre-intervention data to estimate what normal continuation would have looked like, then measures the actual gap against that baseline rather than against last month.

That's the question that actually gets asked after a fix ships. Did this work, and by how much. Being able to answer it with a query instead of a stakeholder debate about whether the uplift is real is the useful part.

#### All Articles in This Series

- <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">Example dataset setup guide</a>
- <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a>
- <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a>
- <a href="/blogs/bigquery-working-examples-ai-causal-effect" target="_blank" rel="noopener">AI.CAUSAL_EFFECT</a>
- <a href="/blogs/bigquery-working-examples-ml-correlation" target="_blank" rel="noopener">ML.CORRELATION</a>
- <a href="/blogs/bigquery-working-examples-ml-metrics" target="_blank" rel="noopener">ML.METRICS</a>
