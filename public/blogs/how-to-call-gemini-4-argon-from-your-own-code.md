---
title: "How to Call Gemini 4 Argon From Your Own Code"
description: "Gemini 4 Argon's documented API is the Interactions API, a newer endpoint than the generateContent call most existing Gemini integrations still use. This is the second article in our Gemini 4 Argon series. The first covered what the model is and what independent testing found; this one covers the actual code, verified directly against Google's own documentation."
image: "/images/blog/gemini-4-argon-code.png"
---

<img src="/images/blog/gemini-4-argon-code.png" alt="How to Call Gemini 4 Argon From Your Own Code" width="100%">

### How to Call Gemini 4 Argon From Your Own Code

Gemini 4 Argon's documented API is the Interactions API, a newer endpoint than the `generateContent` call most existing Gemini integrations still use. This is the second article in our Gemini 4 Argon series. The <a href="/blogs/gemini-4-argon-released" target="_blank" rel="noopener">first covered what the model is and what independent testing found</a>; this one covers the actual code, verified directly against Google's own documentation.

#### Authentication and Your First Call

Get an API key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener">Google AI Studio</a> and store it in a `GEMINI_API_KEY` environment variable.

```bash
pip install -U google-genai
```

```python
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-4-argon",
    input="Write a three.js script that renders a realistic 3D black hole with gravitational lensing."
)

print(interaction.output_text)
```

This request uses the default thinking level (`medium`) and the default 65,536-token output limit.

#### Setting How Hard It Thinks

`thinking_level` controls how much the model reasons before it answers, and it's your main lever for quality, latency, and cost:

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Level</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Token use</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">When to use</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>low</code></td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Fewest tokens, lowest latency</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Simpler tasks and cost-sensitive work, including light analysis and writing. Quality can drop on hard tasks.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>medium</code> (default)</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Balanced</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Recommended for most tasks, including complex code and agentic use.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>high</code></td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Most tokens, slowest first token</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Multi-file root-cause debugging, security vulnerability patching, formal maths, upfront architecture design. Pairs well with long decode for long outputs.</td>
</tr>
</tbody>
</table>
</div>

```python
interaction = client.interactions.create(
    model="gemini-4-argon",
    input="Analyse this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely.",
    generation_config={
        "thinking_level": "high"
    }
)
print(interaction.output_text)
```

Google's own advice is to run your evaluations at all three levels and pick the lowest one that clears your quality bar, rather than defaulting to `high` on everything. If you're migrating code that used the old `thinking_budget` parameter, drop it entirely: it's deprecated and returns a warning rather than approximating a level from the number you'd set. `temperature`, `top_p`, and `top_k` are still accepted if your existing code sets them, but Argon ignores them and returns a deprecation warning, which is worth knowing before you spend time tuning a value that isn't doing anything. One caveat if you're calling through Vertex AI rather than the direct Gemini API: independent testing found Vertex returns a hard 400 error for `thinking_budget` and for the unsupported `minimal` thinking level, rather than the warning the direct API gives.

#### Getting Past the 65,536-Token Output Cap (Long Decode)

By default, both streaming and non-streaming requests cap output at 65,536 tokens, which covers nearly everything, such as chat, Q&A, summarisation, classification, extraction. Long decode exists for the minority of requests where one response genuinely needs more thinking and output than that, such as hard maths and science proofs, the hardest coding and agentic tasks, or an evaluation tool that's cutting answers off because the model spent its whole response thinking.

A single model call generates up to 64K tokens. When a response needs more, the server generates it in hops of up to 64K tokens each, where each hop continues from exactly where the last one stopped. Every hop adds a `model_output` step to `interaction.steps` under the same interaction ID, so reading the full response means joining the text across all of those steps, not just reading the last one:

```python
import time
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-4-argon",
    input="Write a complete, rigorous proof of the prime number theorem.",
    background=True,
    generation_config={
        "max_output_tokens": 262144,
        "thinking_level": "high",
    },
)

while interaction.status in ("in_progress", "queued"):
    time.sleep(5)
    interaction = client.interactions.get(id=interaction.id)

# Each hop adds a model_output step, so join the text of all of them.
text = "".join(
    content.text
    for step in interaction.steps
    if step.type == "model_output"
    for content in step.content
    if content.type == "text"
)
print(text)
print("Status:", interaction.status)
print("Usage:", interaction.usage)
```

What actually controls the output limit:

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">How you create the interaction</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Output limit</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>background: false</code> (streaming or non-streaming)</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">65,536 tokens. A higher <code>max_output_tokens</code> returns a 400 error.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>background: true</code>, <code>max_output_tokens</code> not set</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">65,536 tokens</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>background: true</code>, <code>max_output_tokens</code> greater than 65,536</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Your <code>max_output_tokens</code>, up to 1,048,576 minus your input</td>
</tr>
</tbody>
</table>
</div>

Two easy mistakes: setting `background: true` without also raising `max_output_tokens` just gets you the normal 64K limit, the background flag alone doesn't unlock long decode. Plus, setting `max_output_tokens` too low, with Google's own warning example being 8,192, can stop the model mid-thought before it's written anything useful, since thinking tokens draw from the same budget as the output.

Background interactions can run for up to 24 hours server-side, and `background: true` requires `store: true` (the default). If you need finer control over retries and backoff than polling gives you, client-side continuation on the older `generateContent` API lets your own code drive each hop instead, at a cost of 32K tokens per non-streaming request and a 20-minute run time per hop.

##### Status Values

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Status</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Meaning</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">What to do</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>completed</code></td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">The model finished.</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Join the <code>model_output</code> steps and read <code>usage</code>. Pass this interaction's <code>id</code> as <code>previous_interaction_id</code> to continue the conversation.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>requires_action</code></td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">The model asked for a tool call.</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Run the tool, then send the result referencing this interaction's <code>id</code>.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>incomplete</code></td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">The model used all of <code>max_output_tokens</code>. Text can be empty if it was still thinking.</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Send the request again with a higher <code>max_output_tokens</code>.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>failed</code></td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">The server couldn't finish, or the interaction ran past 24 hours.</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Retry. If it fails again, share the interaction ID with support.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>cancelled</code></td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">You cancelled it.</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Read <code>usage</code> to see what was billed.</td>
</tr>
</tbody>
</table>
</div>

##### Streaming and Reconnecting

To stream output and thought summaries as they arrive, add `stream: true` and `thinking_summaries: "auto"`. Long streams can drop, so your client needs to reconnect using the last `event_id` it saw (these arrive on status-update events too, not just on text). After reconnecting, read the stream through to the end before checking status, the server replays missed events even after the interaction has actually completed. Set HTTP read timeouts to 15-20 minutes per stream. After the first 64K tokens (roughly the first ten minutes), expect output in chunks of around 5,000 tokens with pauses between them.

##### Counting Tokens

`interaction.usage` reports totals across every hop, `total_input_tokens`, `total_cached_tokens`, `total_output_tokens`, `total_thought_tokens`, and `total_tokens`. The thing to watch: `total_input_tokens` adds up every hop's input, and each hop resends the prompt plus everything generated so far. A 1,000-token prompt that produces 200,000 tokens of thinking and output takes four hops, and `total_input_tokens` ends up reporting roughly 397,000 tokens even though the actual context size at the end is only about 201,000 tokens. Don't use `total_input_tokens` to decide when to summarise or trim conversation history, add your prompt size to `total_output_tokens` and `total_thought_tokens` instead to estimate real context size. **To note**: The repeated input is discounted 95% by implicit caching, so you're not billed the full rate on it four times over, but it still inflates that one field.

##### Troubleshooting

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Symptom</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Cause and fix</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Output stops at 64K</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)"><code>background</code> is false, or <code>max_output_tokens</code> isn't set. Set <code>background: true</code> and <code>max_output_tokens</code> above 65,536.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">400: "max_output_tokens greater than 65536 is not yet supported with background=false"</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Long decode without background execution isn't available yet. Set <code>background: true</code>.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">400: "store=true is required for background interactions"</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Background execution needs <code>store: true</code>.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Status <code>incomplete</code> with empty text</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">The model used all its tokens on thinking. Raise <code>max_output_tokens</code> or lower <code>thinking_level</code>.</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Context compaction starts too early</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Your agent framework is reading <code>total_input_tokens</code> to decide. See above.</td>
</tr>
</tbody>
</table>
</div>

#### Migrating from an Earlier Gemini Model

Google's own checklist, condensed:

- **Update the model ID** to `gemini-4-argon`.
- **Review `max_output_tokens`.** If you'd set it explicitly, raise it to at least 32,768, Argon can spend more of the budget on thinking than earlier models did.
- **Configure `thinking_level`** and test your workload at all three levels before picking one.
- **Move off explicit context caching.** `cachedContents` and `caches.create` aren't supported. Remove anything that creates or references `cached_content`. Implicit caching is on automatically for prompts of 4,096 tokens or more, at a 95% discount on cache hits.
- **Remove `temperature`, `top_p`, and `top_k`.** They're ignored and return a deprecation warning.
- **Use background execution for long outputs.** Anything that needs more than 64K tokens needs `background: true` and `max_output_tokens` above 65,536.
- **Increase client timeouts.** Hard prompts can take several minutes even without long decode.
- **Keep conversation state server-side.** Use `previous_interaction_id` for multi-turn and function-calling conversations rather than reconstructing history yourself.

If you use a coding agent that supports skills, Google publishes a `gemini-api-dev` skill that automates this migration end to end, you install it and ask the agent to "migrate my app to Gemini 4 Argon."

#### Calling It from a Node or TypeScript Stack

If your stack is already on Vercel's <a href="https://ai-sdk.dev/" target="_blank" rel="noopener">AI SDK</a>, Argon is just another model string:

```bash
pnpm add ai @ai-sdk/google
```

```ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const { text } = await generateText({
  model: google('gemini-4-argon'),
  prompt: 'Summarise the water cycle in two sentences.',
});
```

Authentication reads from a `GOOGLE_GENERATIVE_AI_API_KEY` environment variable rather than `GEMINI_API_KEY`, worth checking if a call fails with an auth error and the key looks right. Thinking level is set through `providerOptions`:

```ts
providerOptions: {
  google: {
    thinkingConfig: { thinkingLevel: 'high', includeThoughts: true },
  },
},
```

`includeThoughts: true` surfaces the model's reasoning summary on the result's `reasoning` field. The AI SDK's own migration note matches what's in Google's docs: a lower `maxOutputTokens` ends the response early without reducing how much the model thinks first, so to get shorter reasoning, lower `thinkingLevel` rather than the token cap.

#### Calling It Through Google Vertex AI

If your infrastructure runs through Google Cloud rather than a direct Gemini API key, <a href="https://opencode.ai/" target="_blank" rel="noopener">opencode</a>'s Vertex AI provider is one path in. It needs a Google Cloud project with the Vertex AI API enabled, and authenticates either with a service account key file or `gcloud auth application-default login`:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
export GOOGLE_CLOUD_PROJECT=your-project-id
export VERTEX_LOCATION=global
```

Check the Model Garden in your Google Cloud project to confirm Argon is available in your chosen region before building against it. `global` is Google's own recommendation for better availability and fewer errors, at no extra cost over a regional endpoint; pick a specific region like `us-central1` only if you have a data residency requirement that needs it.

#### Limitations on Previous Agents

Google agents trained before October 2026 will confidently suggest `gemini-1.5`, the old `google-generativeai` SDK, or `generateContent` instead of the Interactions API. In terms of how you can prevent that from happening in your setup:

- **A `gemini-api-dev` skill:** Your coding agent can install and load only when it's actually working on Gemini API code, rather than stuffing your prompts with instructions every time. Install it with `npx skills add google-gemini/gemini-skills --skill gemini-api-dev --global`.
- **A Gemini Docs MCP server:** That gives the agent live search and full-page reads across the real documentation. For Claude Code specifically: `claude mcp add --transport http geminiDocs https://gemini-api-docs-mcp.dev`.
- **Machine-readable docs on every page:** Send `Accept: text/markdown` to any `aistudio.google.com/docs/...` URL, or add `.md` to the path, and you get clean Markdown back instead of a rendered page. `aistudio.google.com/docs/llms.txt` indexes every page; `llms-full.txt` bundles the lot into one file.

Worth adding a line to your own project's `AGENTS.md` or `CLAUDE.md` either way: use the current `google-genai` SDK, use the Interactions API for new work, and check current model names before writing anything that calls Gemini.
