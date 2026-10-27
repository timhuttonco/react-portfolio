---
title: "Gemini in Google Sheets can now query your whole BigQuery dataset, not just what's on the sheet"
description: "Google started rolling out a change to Google Sheets on October 19, 2026. Once a spreadsheet is connected to BigQuery through Connected Sheets, the Gemini side panel can answer questions against the entire underlying dataset, not just the rows that happen to be visible in the sheet."
image: "/images/blog/gemini-sheets.gif"
---

<img src="/images/blog/gemini-sheets.gif" alt="Gemini in Google Sheets can now query your whole BigQuery dataset, not just what's on the sheet" width="100%">

### Gemini in Google Sheets can now query your whole BigQuery dataset, not just what's on the sheet

Google started rolling out a change to <a href="https://workspace.google.com/products/sheets/" target="_blank" rel="noopener">Google Sheets</a> on October 19, 2026. Once a spreadsheet is connected to <a href="https://cloud.google.com/bigquery" target="_blank" rel="noopener">BigQuery</a> through Connected Sheets, the Gemini side panel can answer questions against the entire underlying dataset, not just the rows that happen to be visible in the sheet.

#### What It Does

Google's own examples give a sense of the range this covers. A user can ask a connected spreadsheet things like:

- "What were total sales in the Northeast last quarter?"
- "How does that compare to the same quarter last year?"
- "Which products drove the increase?"
- "Build a quarterly sales review with revenue by region, a monthly trend, and our top 10 products."

For that last kind of request, Gemini proposes a plan first, then builds a new tab with connected, refreshable pivot tables, charts, and formulas, the sort of thing that used to mean manually rebuilding a reporting tab every quarter.

The rollout covers Business Standard and Plus, Enterprise Standard and Plus, Google AI Pro and Ultra, and the AI-add-on tiers for education and other accounts. It's a gradual rollout across both Rapid Release and Scheduled Release domains, and Google's own notes say full visibility can take up to fifteen days to reach everyone on an eligible plan.

Tarak Parekh, the Google product manager who announced the feature, puts the scale in concrete terms: Gemini can build live pivot tables and charts "over billions of rows in BigQuery, without writing SQL." That's the point of routing the question into BigQuery itself rather than the sheet. A connected spreadsheet might show a few thousand rows at most, but the question Gemini answers runs against the full table behind it.

#### How to Set It Up

**Connect the sheet to BigQuery first**, if it isn't already:

1. Open a new or existing Google Sheet.
2. From the top menu, go to **Data > Data connectors > Connect to BigQuery**.
3. In the panel that opens, choose the Google Cloud project with the data you need.
4. Browse to the dataset and table, use the Join Builder, or choose **Write custom query** to open a SQL editor.
5. Click **Insert results**. Sheets runs the query in BigQuery and drops the results into a new tab.

You'll need access to a Google Cloud project with the relevant <a href="https://cloud.google.com/bigquery" target="_blank" rel="noopener">BigQuery</a> data, and a billing account attached if your queries go beyond the free tier.

**Then open the Gemini side panel:**

1. In the connected spreadsheet, click the **Ask Gemini** ✨ icon at the top right.
2. Select a suggested prompt, or write your own in the prompt box at the bottom.
3. Press Enter. Gemini runs the question against the full connected BigQuery dataset, not just what's on the visible sheet.

Anyone who already has permission to query the connected data can use this. The permission check happens at the BigQuery layer, the same place it would for any other query against that data, which is worth noting in the governance section below.

#### Two Different Ways AI Can Touch the Same Data

It's worth being precise about what this is and isn't. BigQuery already has native functions like <a href="/blogs/bigquery-working-examples-ai-agg" target="_blank" rel="noopener">AI.AGG</a> that run inside the warehouse, called from SQL, governed entirely by BigQuery's own permission model. This Gemini-in-Sheets feature is a different layer. It runs from the spreadsheet, translates a plain-English question into a query against BigQuery behind the scenes, and hands the answer back into the sheet. Both end up touching the same underlying data. Only one of them lives inside a query someone wrote and can read back later.

That difference matters more than it sounds like it should. An AI.AGG call sits in SQL, in a script or a scheduled query, where it's visible to anyone reviewing the pipeline. A question typed into a Gemini side panel by whoever has sheet access doesn't leave that kind of trail in the same obvious way.

#### The Governance Question This Raises

This update allows someone who isn't an SQL writer to get a real answer from the actual warehouse, rather than a one-time export, and can turn that into a refreshable dashboard tab themselves.

The catch is what's missing between "ask a question" and "get a confident-looking answer". There's no semantic layer in the middle telling Gemini what a metric is actually supposed to mean. If "revenue" is defined three different ways across three different tables in a warehouse, nothing here stops Gemini from picking one, answering fluently, and never mentioning that a choice was made. The same goes for anything a defined metric would normally guard against: a discontinued product category still counted in a total, a test environment's rows mixed in with production, a currency field that isn't what the column name implies.

This makes it even more important to ensure that the groundwork, clear naming, documented metric definitions, a cleaned-up schema, needs to happen before this kind of tool is turned loose on a warehouse. Google's own announcement of the feature is careful to say the same thing from the other direction, stating plainly that "your existing BigQuery access controls still apply". Given this is the case, it isn't ungoverned in the sense of "anyone can see anything". It is ungoverned in the narrower sense that matters here: nothing stops someone with legitimate access from getting a wrong answer stated with total confidence.

#### What This Is Useful For

For a brand with clean, well-documented BigQuery tables, this is a genuinely good shortcut. It turns "can someone pull me a quick number" into something a marketing or ops person can do themselves, without learning SQL or waiting on an analyst.

For a brand whose warehouse has grown the way most warehouses actually grow, several teams, several naming conventions, a few tables nobody's fully sure are still correct, it's a reason to do the unglamorous audit work sooner rather than later. The feature doesn't wait for that audit to happen. It's already rolling out, on by default, to anyone with Connected Sheets access.
