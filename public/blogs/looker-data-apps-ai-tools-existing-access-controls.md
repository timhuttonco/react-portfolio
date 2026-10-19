---
title: "Looker Data Apps Build AI Tools on Top of Your Existing Access Controls"
description: "Google added two features to Looker this month. One lets an AI agent build an entire interactive app from a plain-language prompt. The other lets a dashboard's AI agent configuration sit in version control like any other code change. Both can be seen in the \"What's new with Google Data Cloud\" roundup."
image: "/images/blog/looker.png"
---

<img src="/images/blog/looker.png" alt="Looker Data Apps Build AI Tools on Top of Your Existing Access Controls" width="100%">

### Looker Data Apps Build AI Tools on Top of Your Existing Access Controls

Google added two features to <a href="https://cloud.google.com/looker" target="_blank" rel="noopener">Looker</a> this month. One lets an AI agent build an entire interactive app from a plain-language prompt. The other lets a dashboard's AI agent configuration sit in version control like any other code change. Both can be seen in the <a href="https://cloud.google.com/blog/products/data-analytics/whats-new-with-google-data-cloud" target="_blank" rel="noopener">"What's new with Google Data Cloud" roundup</a>.

#### Looker Data Apps Build on Your Existing Semantic Model

Looker Data Apps entered Preview this month. Describe what you want in natural language, or prompt for it directly from Antigravity or Claude Code, and the result is a working, interactive web app built against your actual data.

What's exciting about this is that a Data App is built on top of LookML, Looker's modelling layer, so it inherits the semantic model, row-level security, and access controls you've already set up. The AI doesn't get a separate path into your data that bypasses what you've already configured.

There's also a practical cost detail worth knowing: once a Data App is built, it runs with no runtime LLM token cost. The AI does the work of building it. Using it afterwards doesn't keep spending on model calls.

#### Dashboard Agent Configs Can Now Live in Version Control

The second piece: an agent's parameters, configuration, and prompt instructions for a LookML dashboard can now be declared and version-controlled alongside the dashboard's own files.

Before this, an agent's configuration was typically a setting inside the tool, changed by whoever had access, with no review step and no history of what changed or why. Now it can go through the same Git review, branching, and CI/CD validation as any other code change in the project. If someone changes what an AI agent is allowed to say about a dataset, or what it's allowed to query, that change is visible and reviewable before it ships.

#### A Related Detail: BigQuery's AI Functions Are Now Documented Agent Skills

The same roundup confirmed a third point worth folding in here. <a href="https://cloud.google.com/bigquery/docs/introduction" target="_blank" rel="noopener">BigQuery's</a> augmented-analytics functions, `AI.KEY_DRIVERS`, `AI.CAUSAL_EFFECT`, `ML.CORRELATION`, `ML.DETECT_CHANGE_POINTS`, `ML.TREND`, and `ML.SEASONALITY`, are confirmed chainable, and <a href="https://cloud.google.com/blog/products/data-analytics/bigquery-augmented-analytics-tvfs" target="_blank" rel="noopener">published as AI-agent skills</a> in Google's own <a href="https://github.com/google/skills" target="_blank" rel="noopener"><code>google/skills</code></a> GitHub repository.

That's a small but genuine extension of the same idea. An agent doesn't just get access to these functions, it gets a documented, versioned recipe for using them together, sitting in a public repository anyone can read, fork, or audit, rather than a black-box prompt pattern nobody outside Google can inspect.

#### Why These All Belong Together

None of these three made a big announcement on its own. Together, they're a clean example of what "AI-ready data" should actually look like in practice: the AI layer getting more capable, and the access-control and documentation layers underneath it keeping pace, rather than being bolted on after something goes wrong.

This is also the opposite of the more common pattern worth watching for. A lot of "AI on your data" features treat governance as a separate step, added if someone remembers to ask for it. Here, the access control came first, by construction, because the AI feature was built on top of a modelling layer that already had it.

#### What to Do About It

If your team uses Looker, this is worth two checks. First, if anyone starts building Data Apps, confirm the underlying LookML model's row-level security actually matches what you'd expect, since the app's own security is only as good as that model's. Second, check whether any dashboard's agent configuration is sitting in version control yet, or whether it's still a setting one person changed once with nobody else aware of it. Moving it into the same review process as everything else is a small change that closes a real gap.
