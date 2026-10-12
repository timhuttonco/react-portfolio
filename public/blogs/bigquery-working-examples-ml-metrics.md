---
title: "BigQuery Working Examples: ML.METRICS"
description: "Last in our series of BigQuery AI function examples, alongside AI.KEY_DRIVERS, AI.FORECAST, AI.CAUSAL_EFFECT, and ML.CORRELATION. ML.METRICS scores any predicted-versus-actual pair of columns, classification or regression, without needing a stored BigQuery ML model behind it."
image: "/images/blog/bq-ml-metrics.png"
---

<img src="/images/blog/bq-ml-metrics.png" alt="BigQuery Working Examples: ML.METRICS" width="100%">

### BigQuery Working Examples: ML.METRICS

Last in our series of BigQuery AI function examples, alongside <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a>, <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a>, <a href="/blogs/bigquery-working-examples-ai-causal-effect" target="_blank" rel="noopener">AI.CAUSAL_EFFECT</a>, and <a href="/blogs/bigquery-working-examples-ml-correlation" target="_blank" rel="noopener">ML.CORRELATION</a>. <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-metrics" target="_blank" rel="noopener">`ML.METRICS`</a> scores any predicted-versus-actual pair of columns, classification or regression, without needing a stored BigQuery ML model behind it.

<a href="https://cloud.google.com/bigquery/docs/introduction" target="_blank" rel="noopener">BigQuery</a>'s `ML.METRICS` is also currently in Preview, same as ML.CORRELATION, worth checking the current support terms before relying on it for anything production-critical.

#### The Dataset

Same synthetic e-commerce orders table as the rest of this series. Setup instructions are in our <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">dataset setup guide</a>; you'll need it loaded as `bq_ai_demo.ecommerce_orders` before running the query below.

#### The Query

This scores the simplest possible prediction you could make for an order's revenue: just use the average revenue for that product category. It's a genuine baseline, the kind of thing worth checking before reaching for a proper forecasting model, so you have a number to say whether the model actually earned its complexity.

```sql
WITH baseline AS (
 SELECT
 revenue,
 AVG(revenue) OVER (PARTITION BY product_category) AS predicted_revenue
 FROM `bq_ai_demo.ecommerce_orders`
)
SELECT *
FROM ML.METRICS(
 (SELECT * FROM baseline),
 predicted_col => 'predicted_revenue',
 actual_col => 'revenue',
 task_type => 'regression'
);
```

`predicted_col` and `actual_col` just need to be two numeric columns of the same type, actual and predicted. There's no model object involved, which is the point: you can score any prediction, including a deliberately simple one like this, without setting anything up first. `task_type` set to `regression` returns error metrics; set it to `classification` instead and it returns precision, recall, accuracy, and F1 score for a predicted-versus-actual label pair.

#### What the Result Shows

The output is a single row: `mean_absolute_error`, `mean_squared_error`, `mean_squared_log_error`, `median_absolute_error`, `r2_score`, and `explained_variance`. For this baseline, expect a low `r2_score`, close to zero or even slightly negative. That's expected. Predicting every order in a category as the category average ignores all the genuine order-to-order variation in the data, which is exactly what `r2_score` is measuring the absence of.

![Using BigQuery's ML.METRICS](/images/blog/bq-ml-metrics.png)

#### Why Scoring a Bad Prediction on Purpose Is Useful

The point of this example isn't that the baseline is good. It's that you now have a number for how not-good it is, before building anything more sophisticated. If someone on a team later builds a proper forecasting model, or uses AI.FORECAST from earlier in this series, this is the number that model needs to beat to justify the extra complexity. Without it, "the model seems better" is a feeling. With it, it's a comparison.

That's the pattern across this whole series. Each function answers a specific, checkable question: which segment moved a metric, where a series is headed, whether a change caused an effect, whether two metrics correlate, how good a prediction is. None of them replace judgement. All of them turn a question that used to take a person an afternoon of manual work into a query that comes back in seconds, provided the data underneath is clean enough to trust the answer.

#### All Articles in This Series

- <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">Example dataset setup guide</a>
- <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a>
- <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a>
- <a href="/blogs/bigquery-working-examples-ai-causal-effect" target="_blank" rel="noopener">AI.CAUSAL_EFFECT</a>
- <a href="/blogs/bigquery-working-examples-ml-correlation" target="_blank" rel="noopener">ML.CORRELATION</a>
- <a href="/blogs/bigquery-working-examples-ml-metrics" target="_blank" rel="noopener">ML.METRICS</a>
