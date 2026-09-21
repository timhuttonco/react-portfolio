---
title: "BigQuery's AI Agents, August to September 2026: A Timeline of Access and Guardrails"
description: "If you've been waiting for one big Google announcement that says \"AI agents are now safe to point at your data warehouse\", you're going to be waiting a long time. It hasn't arrived as one announcement, but as a steady drip of small release-notes entries since August."
image: "/images/blog/google-sessionstart-issues.png"
---

<img src="/images/blog/google-sessionstart-issues.png" alt="BigQuery's AI Agents, August to September 2026: A Timeline of Access and Guardrails" width="100%">

### BigQuery's AI Agents, August to September 2026: A Timeline of Access and Guardrails

If you've been waiting for one big Google announcement that says "AI agents are now safe to point at your data warehouse", you're going to be waiting a long time. It hasn't arrived as one announcement, but as a steady drip of small release-notes entries since August, each one giving <a href="https://cloud.google.com/bigquery/docs/introduction" target="_blank" rel="noopener">BigQuery's</a> AI agents a bit more capability, and most of them paired with a bit more governance to go with it.

We've been tracking BigQuery's release notes since late August, and it's worth laying the whole sequence out in one place, because no single entry looks like much on its own. Together, they're the clearest evidence we've seen this year of what "AI-ready data" actually requires in practice: not one big decision, but a lot of small, deliberate ones about access, visibility, and control.

#### The Timeline

**August 20**: BigQuery's <a href="https://docs.cloud.google.com/bigquery/docs/use-bigquery-mcp" target="_blank" rel="noopener">MCP server</a> (the interface tools like <a href="https://gemini.google.com" target="_blank" rel="noopener">Gemini</a> or <a href="https://www.anthropic.com/claude" target="_blank" rel="noopener">Claude</a> use to talk to a warehouse) added a `run_bq_command` tool. Agents could now run the full `bq` command-line tool, including job and reservation management, not just SQL queries. The same release added <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-trend" target="_blank" rel="noopener">`ML.TREND`</a>, <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-seasonality" target="_blank" rel="noopener">`ML.SEASONALITY`</a>, and <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-detect-change-points" target="_blank" rel="noopener">`ML.DETECT_CHANGE_POINTS`</a>, turning basic forecasting into a SQL function call.

**August 24**: BigQuery added observability for data agents: performance, adoption, latency, and cost, visible through <a href="https://cloud.google.com/products/observability" target="_blank" rel="noopener">Google Cloud Observability</a>. This is the direct answer to the access the August 20 update handed out. Agents could suddenly do more. Now there was a dashboard for what they were actually doing.

**August 25**: Column-level security tags, used to mask sensitive columns like PII or financial data, could now be defined in <a href="https://developer.hashicorp.com/terraform" target="_blank" rel="noopener">Terraform</a> instead of clicked together by hand in the console. Governance that lives in a file you can review and roll out identically across environments, rather than a setting one person configured once and half-remembers.

**August 26**: Google's <a href="https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing" target="_blank" rel="noopener">Open Knowledge Format</a>, the markdown standard for giving AI agents business context, started inheriting the same access controls as the BigQuery tables it describes. A 9-concept bundle expands into 17 catalog entries, each with its own ACL. Documentation about your data finally gets governed the way the data itself already is.

**August 26**: <a href="https://docs.cloud.google.com/bigquery/docs/use-knowledge-catalog" target="_blank" rel="noopener">Knowledge Catalog</a> began importing metadata directly from <a href="https://docs.getdbt.com" target="_blank" rel="noopener">dbt Core</a> and <a href="https://docs.getdbt.com/docs/build/about-metricflow" target="_blank" rel="noopener">MetricFlow</a>. If your data model already lives in dbt, that context (what a metric means, how a table's built, its quality checks) becomes visible to whatever queries BigQuery next, agent included, instead of staying locked inside the dbt project.

**September 3**: The <a href="https://docs.cloud.google.com/gemini/data-agents/conversational-analytics-api/release-notes" target="_blank" rel="noopener">Conversational Analytics API</a>, the interface Gemini and other agents use to ask a warehouse questions in plain English, picked up four things at once: agent observability through <a href="https://cloud.google.com/monitoring" target="_blank" rel="noopener">Cloud Monitoring</a> and <a href="https://cloud.google.com/trace" target="_blank" rel="noopener">Cloud Trace</a>, a "Deep Dive" mode where an agent breaks a question into sub-questions and investigates each one, HIPAA compliance, and formal Access Transparency and Access Approval controls for the underlying agent and conversation objects.

**September 8**: Conversational Analytics gained an <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-predict" target="_blank" rel="noopener">`AI.PREDICT`</a> function, letting an agent generate predictive model output directly through natural language, not just descriptive answers.

**September 9**: The <a href="https://docs.cloud.google.com/gemini/data-agents/data-engineering-agent/agent-overview" target="_blank" rel="noopener">Data Engineering Agent</a> integrated with <a href="https://docs.cloud.google.com/bigquery/docs/graph-overview" target="_blank" rel="noopener">BigQuery Graph</a>, improving how it maps schema automatically.

**September 10**: Three new functions arrived together: <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-correlation" target="_blank" rel="noopener">`ML.CORRELATION`</a> (statistical correlation between a target column and one or more metrics), <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-metrics" target="_blank" rel="noopener">`ML.METRICS`</a> (evaluating classification or regression tasks without needing a stored model), and <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-causal-effect" target="_blank" rel="noopener">`AI.CAUSAL_EFFECT`</a>, which quantifies the impact of a specific intervention on a time series. That last one landed the same day Google separately gave its <a href="https://blog.google/products/ads-commerce/meridian/" target="_blank" rel="noopener">Meridian</a> marketing mix model new agentic data-quality auditing and causal-measurement features on the advertising side. This implies the same idea within the Google product team, that causal inference is becoming a key, built-in capability.

**September 14**: Three new Gemini model versions became available for BigQuery's generative AI functions.

#### Summary

Observability, Terraform-managed masking, access-controlled documentation, and formal approval workflows are the sort of controls any large organisation already demands for a human employee with database access. Google appears to be building the assumption that an AI agent querying your warehouse should meet the same bar.

That's the practical version of "AI-ready data". It isn't a separate skill from good data governance. It's the same discipline that's always mattered, applied to a new kind of user that happens to be a model instead of a person.

If you've already got an AI agent pointed at a BigQuery warehouse, or you're about to, go through this list and check which of these features are actually switched on. Observability and access controls that shipped in preview don't turn themselves on.

If you're advising a client on this, the useful question isn't "should we connect AI to our data". It's "if we do, will we actually be able to see what it did, and who's allowed to see the documentation about what it's looking at". Every feature in this timeline exists because that second question matters as much as the first.
