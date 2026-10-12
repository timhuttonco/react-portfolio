---
title: "BigQuery Working Examples: AI.FORECAST"
description: "This is the second in our series of worked examples for BigQuery's AI table-valued functions. The first covered AI.KEY_DRIVERS finding why a metric moved. This one covers AI.FORECAST, which projects a time series forward without you training or choosing a model first."
image: "/images/blog/bq-forecast.png"
---

<img src="/images/blog/bq-forecast.png" alt="BigQuery Working Examples: AI.FORECAST" width="100%">

### BigQuery Working Examples: AI.FORECAST

This is the second in our series of worked examples for BigQuery's AI table-valued functions. The first covered <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS finding why a metric moved</a>. This one covers <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-forecast" target="_blank" rel="noopener">`AI.FORECAST`</a>, which projects a time series forward without you training or choosing a model first.

<a href="https://cloud.google.com/bigquery/docs/introduction" target="_blank" rel="noopener">BigQuery</a> picks the forecasting approach for you based on the shape of the data you hand it. You give it a metric, a timestamp column, and how far forward to project. It works out the rest.

#### The Dataset

We're using the same synthetic e-commerce orders dataset as the rest of this series: nine months of daily order data, January to October 2026, with normal weekly and seasonal patterns built in. Setup instructions are in our <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">dataset setup guide</a>. You'll need it loaded as `bq_ai_demo.ecommerce_orders` before running the query below.

#### The Query

This forecasts daily revenue forward 30 days, broken out by product category, so you get five separate forecasts in one call rather than one blended line.

```sql
WITH daily_category_revenue AS (
 SELECT
 order_date,
 product_category,
 SUM(revenue) AS daily_revenue
 FROM `bq_ai_demo.ecommerce_orders`
 GROUP BY order_date, product_category
)
SELECT
 product_category,
 CAST(forecast_timestamp AS DATE) AS forecast_date,
 forecast_value,
 confidence_level,
 prediction_interval_lower_bound,
 prediction_interval_upper_bound,
 ai_forecast_status
FROM AI.FORECAST(
 (SELECT * FROM daily_category_revenue),
 data_col => 'daily_revenue',
 timestamp_col => 'order_date',
 id_cols => ['product_category'],
 horizon => 30
)
ORDER BY product_category, forecast_date;
```

`data_col` is the metric to forecast. `timestamp_col` is the column it uses to order the series. `id_cols` is the list of columns identifying separate series within the same table, in our case one series per product category. `horizon` is how many future periods to generate, and the function infers the period length (daily, here) from the spacing of your input timestamps.

#### What the Result Shows

Each row is one category's forecast for one future date. `forecast_value` is the point forecast. `prediction_interval_lower_bound` and `prediction_interval_upper_bound` give the range either side of it, and `confidence_level` tells you what that range represents. `ai_forecast_status` reports whether the model considers that forecast reliable, which is worth checking before you present any of these numbers, especially for a category with thinner order volume.

![Running AI.FORECAST in BigQuery](/images/blog/bq-forecast.png)

##### What Each Column Means

- **`forecast_date`**: The future date this row is predicting for. We cast `forecast_timestamp` to a `DATE` in the query above since our input is daily; the underlying column is a timestamp because `AI.FORECAST` also supports sub-daily and weekly/monthly series.
- **`forecast_value`**: The model's single best estimate for that date. This is the number people reach for first, and the one most likely to get quoted on its own without the next three columns attached.
- **`confidence_level`**: The probability the function is aiming for when it builds the interval below, not a grade of how good the forecast is. We didn't pass a `confidence_level` argument in the query above, so BigQuery uses its default (0.95, i.e. a 95% interval); pass your own value as an argument to `AI.FORECAST` if you want a narrower or wider range.
- **`prediction_interval_lower_bound`** / **`prediction_interval_upper_bound`**: The range the actual value is expected to fall within, given that confidence level. These two columns are the actual point of the function. A forecast reported without them is reported stripped of the one thing that tells you how much to trust it.
- **`ai_forecast_status`**: Whether the forecast for that specific date and series completed successfully, or came back with an error. It's a pass/fail flag on the forecasting step itself, not a nuanced confidence score; if a row's status isn't a clean success, treat that row's numbers as unusable rather than just less certain, and check whether that series (often a thinner-volume category) simply didn't have enough history to forecast from.

One pattern worth watching for across the 30 days of output: the gap between the lower and upper bound should widen the further out the forecast date is from today. That's not a flaw, it's the function being honest that day 30 is a bigger guess than day 1, since there's more time for the series to drift from where the model last saw it. If the interval stays the same width across the whole horizon, that's worth a second look.

#### What This Is Actually Useful For

The honest case for AI.FORECAST isn't that it's a better model than whatever a data team would have built anyway. It's that it removes the setup cost. No choosing between exponential smoothing and ARIMA, no separate CREATE MODEL step, no retraining schedule to maintain. For a quick directional read, five minutes and one query is a different proposition to a modelling exercise someone has to maintain going forward.

It's still a forecast, not a guarantee. The prediction interval is there because the point forecast alone invites more confidence than it deserves. If you're using this for anything a decision rests on, report the interval alongside the number, not just the number.

#### All Articles in This Series

- <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">Example dataset setup guide</a>
- <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a>
- <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a>
- <a href="/blogs/bigquery-working-examples-ai-causal-effect" target="_blank" rel="noopener">AI.CAUSAL_EFFECT</a>
- <a href="/blogs/bigquery-working-examples-ml-correlation" target="_blank" rel="noopener">ML.CORRELATION</a>
- <a href="/blogs/bigquery-working-examples-ml-metrics" target="_blank" rel="noopener">ML.METRICS</a>
