---
title: "Gemini 4 Argon Released"
description: "Google released Gemini 4 Argon on October 13, 2026. It's Google's new frontier model, built to solve the hardest problems with depth and precision across real-world software engineering, enterprise knowledge work, and cybersecurity defense. It's also the first Gemini model to ship with a context window that covers input, thinking, and output in a single shared pool of 1,048,576 tokens."
image: "/images/blog/gemini-argon.png"
---

<img src="/images/blog/gemini-argon.png" alt="Gemini 4 Argon Released" width="100%">

### Gemini 4 Argon Released

Google released <a href="https://aistudio.google.com/docs/latest-model" target="_blank" rel="noopener">Gemini 4 Argon</a> on October 13, 2026. It's Google's new frontier model, built to solve the hardest problems with depth and precision across real-world software engineering, enterprise knowledge work, and cybersecurity defense. It's also the first Gemini model to ship with a context window that covers input, thinking, and output in a single shared pool of 1,048,576 tokens.

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Model</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Model ID</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Default thinking level</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Pricing (per 1M tokens)</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Gemini 4 Argon</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>gemini-4-argon</code></td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">medium</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Through Nov 30, 2026: $2 input, $10 output (95% off cached input). From Dec 1: $4 input, $20 output.</td>
</tr>
</tbody>
</table>
</div>

A basic call looks like this:

```python
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-4-argon",
    input="Write a three.js script that renders a realistic 3D black hole with gravitational lensing."
)

print(interaction.output_text)
```

That's the whole request. No separate model-loading step, no context caching to configure first. We'll cover the code side in full, including the parameters that changed from earlier Gemini models, in later articles.

#### What's Actually New

Google's own list of what changed, condensed to the parts that matter:

- **Unified 1M input-output token limit:** Input, thinking, and output now share one window of 1,048,576 tokens, rather than output being capped separately from input.
- **Long decode:** A single response can go past the usual 64K-token output limit, up to 1M tokens minus whatever input you sent.
- **Agentic video understanding, now generally available:** The model can scrub across timestamps in a video, inspect individual frames, and connect what's on screen with spoken narration or console audio.
- **Support in Managed Agents:** Google's hosted "Antigravity agent" can now run on Gemini 4 Argon.

Two smaller details worth knowing if you're moving existing code over: `temperature`, `top_p`, and `top_k` are still accepted as parameters, but Argon ignores them and returns a deprecation warning rather than failing the request. Also, implicit caching turns on automatically for prompts of at least 4,096 tokens, discounting the cached portion by 95%.

#### What It Costs

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"></th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Input</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Output (thinking included)</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Cached input</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Until November 30, 2026</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$2.00</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$10.00</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$0.10</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">From December 1, 2026</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$4.00</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$20.00</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$0.20</td>
</tr>
</tbody>
</table>
</div>

Batch and Flex requests run at half the standard rate in both windows, whilst there's no free tier for API access. If your team is building anything against this model, budget for the December price before you commit to it.

#### How to Actually Get at It

Google's own developer guide is specific about this: you can build with Argon on the paid tier of the <a href="https://ai.google.dev/" target="_blank" rel="noopener">Gemini API</a> in <a href="https://aistudio.google.com/" target="_blank" rel="noopener">Google AI Studio</a>, and separately, if you're a Google AI Ultra subscriber, in AI Studio and in <a href="https://antigravity.google/" target="_blank" rel="noopener">Google Antigravity</a>. That's two paths in: pay for API usage as you go, or hold an Ultra subscription and use it inside Google's own tools. Google's pricing documentation explicitly rules out the Free tier and the Google AI Pro plan, so if you're on Pro rather than Ultra, the API key is your route in rather than your subscription.

#### What People Have Actually Built with It

Google's own showcase is a better answer to "what's this actually good for" than any spec sheet. <a href="https://aistudio.google.com/learn/gemini-4-argon-showcase" target="_blank" rel="noopener">The launch showcase</a> includes browser-based 3D games (a go-kart track built on top of a real employee's desk, a 3D wizard chess set, an architectural reconstruction of a 1,000-year-old Pueblo site from LiDAR scans) and hosted agent apps that turn unstructured input into something usable: a tool called Shoebox that takes photos of receipts and extracts, categorises, and flags anomalies in the line items, and one called Finance Story that turns a spreadsheet or CSV ledger into an interactive, queryable financial narrative. All very cool use cases.

#### What Independent Testing Found

Google's own benchmark table has Argon leading on 13 of 19 published comparisons against GPT-6 Astra, Claude Fable 5.1, and Claude Opus 5.5, including a large gap on long-context retrieval (GraphWalks BFS at 256K-1M tokens: 84.2% versus 66.8% for Opus 5.5). It trails on others, Terminal-bench 4.0 has Argon at 57.4% against Opus 5.5's 66.4%.

Independent scoring tells a less clean story. Artificial Analysis put Argon's Intelligence Index score at 53, tied with GPT-6 Astra rather than ahead of it, and no higher. Where Argon does stand out independently is hallucination rate: 15% on AA-Omniscience, against 51% for GPT-6 Astra and 54% for a newer OpenAI model.

Bloomberg reported that Google's own employees who tested the model found strong benchmark results didn't hold up on real-world coding and front-end design work, and <a href="https://www.surgehq.ai/" target="_blank" rel="noopener">Surge AI</a> founder Edwin Chen described it as the AI equivalent of a student who tests well without the underlying skill, sometimes called "benchmaxxing." Google disputes that its coding performance is weaker in practice.

Two hands-on tests back up the mixed picture rather than resolving it either way. One <a href="https://computingforgeeks.com/gemini-4-argon-released-features-benchmarks/" target="_blank" rel="noopener">DevOps-focused comparison</a> had Argon write 12 Kubernetes manifests that all passed linting but crash-looped on a real k3s cluster, an nginx image failed under a `runAsUser` restriction Argon hadn't accounted for. Claude Opus 5.5 and a competing OpenAI model got the same task right first time; Argon fixed it once shown the actual error, and was cheaper and faster doing so at default settings. A separate <a href="https://www.creativeainews.com/articles/gemini-4-argon-launch-price-3d-test-2026/" target="_blank" rel="noopener">3D product-scene test</a> had Argon build a Three.js sneaker render faster and cheaper than Gemini 3.1 Pro, with a more complete-looking result, but a boxier toe and slower rotation than intended.

#### Why This Is Worth Tracking if You Work with Data

A model with a million-token shared context and genuinely agentic tool use changes what's practical to build on top of a data stack, an agent that can hold an entire schema catalog, a full set of tagging specs, or a quarter's worth of query history in context at once is a different proposition to one that needs everything chunked and retrieved. The Shoebox example above is a small, clean version of unstructured input (a photo) turned into structured, categorised output.

Later articles will cover calling Argon from your own code, the workflow behind the 3D showcase builds and the actual prompts used, getting started with the Antigravity IDE, and the separate Antigravity agent you call through the API.
