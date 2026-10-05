---
title: "BigQuery Adds AI.KEY_DRIVERS and a New Security Center"
description: "BigQuery shipped two features at the end of September that are worth becoming familiar with. One gives an AI agent a new way to dig through your data on its own. The other gives you a dedicated place to decide who's allowed to see which rows and columns before that digging happens."
image: "/images/blog/bigquery.png"
---

<img src="/images/blog/bigquery.png" alt="BigQuery Adds AI.KEY_DRIVERS and a New Security Center" width="100%">

### BigQuery Adds AI.KEY_DRIVERS and a New Security Center

<a href="https://cloud.google.com/bigquery/docs/introduction" target="_blank" rel="noopener">BigQuery</a> shipped two features at the end of September that are worth becoming familiar with. One gives an AI agent a new way to dig through your data on its own. The other gives you a dedicated place to decide who's allowed to see which rows and columns before that digging happens.

This continues a pattern we've been tracking since August. See our <a href="/blogs/bigquery-ai-agents-timeline-august-september-2026" target="_blank" rel="noopener">BigQuery AI-agent timeline</a> for the earlier stretch, from command-line access for agents through to HIPAA compliance and formal access approval. These two latest additions are the next two entries in that same story, and a clean example of how the pattern keeps repeating.

#### AI.KEY_DRIVERS Finds Why a Metric Moved

<a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-key-drivers" target="_blank" rel="noopener">`AI.KEY_DRIVERS`</a> reached General Availability on September 29, 2026. Point the function at a metric and it identifies which data segments are statistically responsible for the change, called directly from SQL.

That's the step that normally takes a person an afternoon. Conversion rate drops 12%, and someone starts slicing by channel, then device, then region, then landing page, until the actual cause shows up. AI.KEY_DRIVERS turns that search into a single query.

It doesn't replace knowing the business. A segment the function flags as statistically responsible still needs a human to work out whether that's the real cause or just where the data happened to move first. But as a first pass before anyone goes digging by hand, it's a genuinely useful shortcut.

#### BigQuery Security Center Centralises Access Control

The next day, September 30, 2026, Google launched a new <a href="https://docs.cloud.google.com/bigquery/docs/security-center-overview" target="_blank" rel="noopener">BigQuery Security Center</a>. It brings row-level and column-level security policy management and policy tag configuration into one dedicated hub, instead of those controls sitting across separate console screens.

On its own, that's a welcome piece of housekeeping. Next to AI.KEY_DRIVERS, it reads as something more deliberate. The more capable BigQuery's AI layer gets at finding patterns across a dataset without anyone pointing it at a specific table, the more it matters who's allowed to see which rows and columns in the first place. A function that automatically goes looking for the segment behind a metric change is, by design, touching data a person might not have thought to query directly. Having one place to actually check and set those permissions is the right feature to ship alongside it.

#### A Smaller, Related Update

Also on the AI side, <a href="https://docs.cloud.google.com/gemini/data-agents/conversational-analytics-api/release-notes" target="_blank" rel="noopener">Conversational Analytics</a> reached General Availability for combining <a href="https://docs.cloud.google.com/bigquery/docs/graph-overview" target="_blank" rel="noopener">BigQuery Graph</a> data with regular tables, views, and UDFs in a single conversational data source. An agent can query a graph on its own, or alongside relational data, using Graph Query Language or the `GRAPH_EXPAND` function depending on the question asked. The main BigQuery release notes date this October 1.

#### What to Actually Do About It

If you're running BigQuery for a client or your own reporting, two checks are worth five minutes each.

First, if AI.KEY_DRIVERS is something your team or an agent might start using, check who already has query access to the tables it would run against. The function makes it easier to surface a pattern nobody went looking for, which is the kind of access that's worth confirming is intentional rather than inherited from six months ago.

Second, open the new Security Center and see what it actually shows for your project. Row and column-level security policies that were set up piecemeal over time often look different once they're all in one view. This is a good moment to check they still match what you'd set up today.
