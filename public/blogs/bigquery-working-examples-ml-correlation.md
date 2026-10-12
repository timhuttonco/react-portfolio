---
title: "BigQuery Working Examples: ML.CORRELATION"
description: "Fourth in our series of BigQuery AI function examples. The first three covered AI.KEY_DRIVERS, AI.FORECAST, and AI.CAUSAL_EFFECT. This one is smaller in scope but just as useful day to day: ML.CORRELATION checks whether two numeric metrics actually move together, sliced by whatever dimensions you give it, in one call."
image: "/images/blog/bq-correlation.png"
---

<img src="/images/blog/bq-correlation.png" alt="BigQuery Working Examples: ML.CORRELATION" width="100%">

### BigQuery Working Examples: ML.CORRELATION

Fourth in our series of BigQuery AI function examples. The first three covered <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a>, <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a>, and <a href="/blogs/bigquery-working-examples-ai-causal-effect" target="_blank" rel="noopener">AI.CAUSAL_EFFECT</a>. This one is smaller in scope but just as useful day to day: <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-correlation" target="_blank" rel="noopener">`ML.CORRELATION`</a> checks whether two numeric metrics actually move together, sliced by whatever dimensions you give it, in one call.

<a href="https://cloud.google.com/bigquery/docs/introduction" target="_blank" rel="noopener">BigQuery</a>'s `ML.CORRELATION` is currently in Preview, so it's worth checking the current support terms before relying on it for anything production-critical. It still works well for exploratory analysis, which is what this example covers.

#### The Dataset

Same synthetic e-commerce orders table as the rest of this series. Setup instructions are in our <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">dataset setup guide</a>; you'll need it loaded as `bq_ai_demo.ecommerce_orders` before running the query below.

This example doesn't use the tracking-incident thread the other articles in this series build on. It asks a more everyday question: does revenue actually correlate with either of two things people often assume it does, being a new customer, or ordering on a weekend.

#### The Query

```sql
WITH orders_numeric AS (
 SELECT
 revenue,
 CAST(new_customer AS INT64) AS new_customer_flag,
 IF(EXTRACT(DAYOFWEEK FROM order_date) IN (1, 7), 1, 0) AS weekend_flag,
 channel,
 product_category
 FROM `bq_ai_demo.ecommerce_orders`
)
SELECT *
FROM ML.CORRELATION(
 (SELECT * FROM orders_numeric),
 target_col => 'revenue',
 target_correlation_cols => ['new_customer_flag', 'weekend_flag'],
 dimension_cols => ['channel']
)
ORDER BY segment_size DESC, corr_col;
```

`target_col` is the metric everything else gets compared against. `target_correlation_cols` takes one or more numeric columns to correlate against it, here two flags cast to `INT64` since `ML.CORRELATION` needs numeric inputs. `dimension_cols` slices the result by channel, so you get a correlation per channel as well as the overall figure, without writing a separate query for each one. The default method is Pearson, which is the right starting point for this kind of check; Spearman and Kendall are available for data that doesn't fit a linear relationship as well.

#### What the Result Shows

Expect the correlation values here to sit close to zero, for both flags, across every channel. That's not a failed query, it's the honest answer. In this dataset, an order's revenue is drawn from its product category regardless of whether the customer was new or the order landed on a weekend. Weekend trading affects how many orders come in, not how much any single order is worth, and the data reflects that.

![BigQuery's ML.CORRELATION](/images/blog/bq-correlation.png)

#### Why a Near-Zero Result Is Still a Useful One

It's tempting to only screenshot a function when it finds something dramatic. That undersells what `ML.CORRELATION` is actually for. Being able to check, in one query, that a relationship people assume exists genuinely doesn't, is just as valuable as finding one that does. It means the next report doesn't quietly imply new customers are worth more per order when the data doesn't support it, and it means ruling that out took one query instead of a debate.

The same discipline applies here as the rest of this series. The function is only useful if the underlying columns mean what they say. A `new_customer` flag that's inconsistently set, or a revenue figure that's secretly net of returns in some rows and gross in others, will produce a correlation number that looks precise and means nothing.

#### All Articles in This Series

- <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">Example dataset setup guide</a>
- <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a>
- <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a>
- <a href="/blogs/bigquery-working-examples-ai-causal-effect" target="_blank" rel="noopener">AI.CAUSAL_EFFECT</a>
- <a href="/blogs/bigquery-working-examples-ml-correlation" target="_blank" rel="noopener">ML.CORRELATION</a>
- <a href="/blogs/bigquery-working-examples-ml-metrics" target="_blank" rel="noopener">ML.METRICS</a>
