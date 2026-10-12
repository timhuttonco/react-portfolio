---
title: "How to Use BigQuery's AI Functions"
description: "BigQuery has added a run of AI-native functions you can call straight from SQL: finding why a metric moved, forecasting a series forward, testing whether a change actually caused an effect, checking a correlation, scoring a prediction. No model to train first, no separate tool to open."
image: "/images/blog/bigquery.png"
---

<img src="/images/blog/bigquery.png" alt="How to Use BigQuery's AI Functions" width="100%">

### How to Use BigQuery's AI Functions

<a href="https://cloud.google.com/bigquery/docs/introduction" target="_blank" rel="noopener">BigQuery</a> has added a run of AI-native functions you can call straight from SQL: finding why a metric moved, forecasting a series forward, testing whether a change actually caused an effect, checking a correlation, scoring a prediction. No model to train first, no separate tool to open.

We're publishing a short series of articles showing how to actually use five of them: AI.KEY_DRIVERS, AI.FORECAST, AI.CAUSAL_EFFECT, ML.CORRELATION, and ML.METRICS. Each article has a worked example you can run yourself, a real query against real data, and real output to screenshot.

To make that possible, we built one sample dataset that all five articles share, rather than five disconnected toy examples. This doc has that dataset and the instructions to load it into your own BigQuery project, so you can follow along with any article in the series.

#### The Dataset

The dataset and all relevant queries can be found in Github <a href="https://github.com/timhuttonco/bigquery-ai-features" target="_blank" rel="noopener">here</a>.

`ecommerce_orders.csv` — a synthetic e-commerce orders dataset, 11,238 rows, one row per order, 2026-01-05 to 2026-10-04. Generated, not real customer data, built specifically so the signal types these functions look for are genuinely present and checkable against the generation logic, not invented after the fact.

Columns:

- `order_id` - string, e.g. `ORD-000123`
- `order_date` - date
- `channel` - string: Paid Search, Paid Social, Organic Search, Direct, Email, Affiliate
- `device_category` - string: desktop, mobile, tablet
- `region` - string: United Kingdom, United States, Germany, France, Ireland
- `product_category` - string: Footwear, Outerwear, Accessories, Electronics, Homeware
- `new_customer` - boolean
- `revenue` - numeric, GBP

#### The Story the Data Tells

- Baseline trading runs throughout, with normal weekly seasonality (weekends up, Tuesdays down) and a mild seasonal arc (an August dip, a September/October lift).
- From 2026-07-13 to 2026-07-26, a tracking issue under-counts orders from Paid Social on mobile specifically, about two-thirds of that segment's real orders don't make it into the data for those two weeks. This is the dip AI.KEY_DRIVERS is built to isolate.
- From 2026-07-27, the issue is fixed. Paid Social + mobile recovers, plus a sustained uplift representing the previously-missed conversions now being captured correctly. This is the step-change AI.CAUSAL_EFFECT is built to measure.
- The full nine months of daily history is what AI.FORECAST projects forward from.
- Order-level revenue doesn't depend on new-customer status or weekend timing by design, which is what ML.CORRELATION should find when checking those two assumptions.

This mirrors a relatively common analytics failure mode: a tag-firing or consent-mode issue that drops a slice of conversions for a specific channel/device combination, gets fixed, and then nobody goes back to quantify what it cost or whether the fix actually worked. That's deliberate. It's the kind of problem Bird & Bear gets called in for, and it's a cleaner demo of "why AI-ready data matters" than a generic dataset would be.

#### Loading It into BigQuery

1. In the BigQuery console, open the project you want to demo in.
2. Create a dataset: click your project → Create dataset → name it `bq_ai_demo` → choose a region → Create dataset.
3. In `bq_ai_demo`, click Create table.
4. Source: Upload. Select `ecommerce_orders.csv`. File format: CSV.
5. Destination table name: `ecommerce_orders`.
6. Schema: tick "Auto-detect". BigQuery will infer `order_date` as DATE, `new_customer` as BOOLEAN, `revenue` as FLOAT, the rest as STRING.
7. Leave partitioning/clustering unset for this demo. Create table.

![Creating a new BigQuery table for AI use](/images/blog/bq-create-table.png)

8. Sanity check with:

```sql
SELECT COUNT(*) AS row_count, MIN(order_date) AS first_day, MAX(order_date) AS last_day
FROM `bq_ai_demo.ecommerce_orders`;
```

Expect 11,238 rows, 2026-01-05 to 2026-10-04.

![Verifying your BigQuery dataset upload](/images/blog/bq-query-results.png)

Every example query in the article series references `bq_ai_demo.ecommerce_orders`. Swap in your own project ID when you run them (`your-project.bq_ai_demo.ecommerce_orders`).

#### All Articles in This Series

- <a href="/blogs/how-to-use-bigquerys-ai-functions" target="_blank" rel="noopener">Example dataset setup guide</a>
- <a href="/blogs/bigquery-working-examples-ai-key-drivers" target="_blank" rel="noopener">AI.KEY_DRIVERS</a>
- <a href="/blogs/bigquery-working-examples-ai-forecast" target="_blank" rel="noopener">AI.FORECAST</a>
- <a href="/blogs/bigquery-working-examples-ai-causal-effect" target="_blank" rel="noopener">AI.CAUSAL_EFFECT</a>
- <a href="/blogs/bigquery-working-examples-ml-correlation" target="_blank" rel="noopener">ML.CORRELATION</a>
- <a href="/blogs/bigquery-working-examples-ml-metrics" target="_blank" rel="noopener">ML.METRICS</a>
