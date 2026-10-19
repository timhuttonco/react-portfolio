---
title: "Diving into the Antigravity Agent with the Gemini API"
description: "Google ships two different things called Antigravity. The previous article in this series covered the Antigravity IDE and app, built for a human developer working alongside an agent. This article covers the other one: the Antigravity agent, a hosted Managed Agent you call through the Gemini API, with no IDE, no app, and no human in the loop by default at all."
image: "/images/blog/google-antigravity-agent.png"
---

<img src="/images/blog/google-antigravity-agent.png" alt="Diving into the Antigravity Agent with the Gemini API" width="100%">

### Diving into the Antigravity Agent with the Gemini API

Google ships two different things called Antigravity. The <a href="/blogs/getting-started-with-google-antigravity-and-gemini-4-argon" target="_blank" rel="noopener">previous article in this series</a> covered the Antigravity IDE and app, built for a human developer working alongside an agent. This article covers the other one: the Antigravity agent, a hosted Managed Agent you call through the Gemini API, with no IDE, no app, and no human in the loop by default at all.

#### What Is It?

A single API call gives you an agent that reasons, executes code, manages files, and browses the web inside its own secure Linux sandbox, hosted by Google. It's built on Gemini 3.8 Flash by default, and you can point it at Gemini 4 Argon instead through configuration, covered below.

```python
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    input="Read Hacker News, summarise the top 10 stories, and save the results as a PDF.",
    environment="remote",
)

print(interaction.output_text)
```

That single call provisions a sandbox and starts a plan-act-observe loop that runs until the task is actually done, not just until the model's next turn.

#### What It Can Do Out of the Box

- **Code execution**: Bash, Python, and Node.js, including installing packages, running tests, and building apps.
- **File management**: read, write, edit, search, and list files, which persist across interactions in the same environment.
- **Web access**: Google Search and direct URL fetching.
- **Automatic context compaction**: triggered at roughly 135,000 tokens, so long multi-turn sessions don't lose context or hit a wall.

By default the agent has `code_execution`, `google_search`, and `url_context`. Filesystem tools switch on automatically the moment you set an `environment`. You only need to touch the `tools` parameter to restrict that default set or add your own custom functions:

```python
interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    input="Search for the latest AI research papers on reasoning and summarise them.",
    environment="remote",
    tools=[
        {"type": "google_search"},
        {"type": "url_context"},
    ],
)
```

#### Running It on Gemini 4 Argon

Set the model inside `agent_config` to swap the reasoning engine for something heavier than the Flash default:

```python
interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    input="Summarise the key differences between functional and object-oriented programming.",
    environment="remote",
    agent_config={
        "type": "antigravity",
        "model": "gemini-4-argon",
    },
)
```

This step is worth reviewing for anything that's a complex software-engineering or reasoning task, and probably not worth it for something a fast model handles fine. The whole point of the default being Flash is that most agent turns don't need Argon's depth.

#### Giving It Your Own Tools

**Custom functions** work the same way as standard Gemini function calling, but statefully: the agent requests a call, you execute it, and you send the result back referencing the same interaction rather than reconstructing the whole history yourself.

```python
get_weather_tool = {
    "type": "function",
    "name": "get_weather",
    "description": "Gets the current weather for a given location.",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {"type": "string", "description": "The city and country"}
        },
        "required": ["location"],
    },
}

interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    input="What is the weather in Tokyo?",
    environment="remote",
    tools=[{"type": "code_execution"}, get_weather_tool],
)

if interaction.status == "requires_action":
    pending = [s for s in interaction.steps if s.type == "function_call"]
    fc = pending[0]
    result = {"temperature": 23, "unit": "celsius"}
    final = client.interactions.create(
        agent="antigravity-preview-09-2026",
        previous_interaction_id=interaction.id,
        environment=interaction.environment_id,
        input=[{"type": "function_result", "name": fc.name, "call_id": fc.id, "result": result}],
    )
    print(final.output_text)
```

**Remote MCP servers** connect the agent to any tool that speaks streamable HTTP MCP, note the server name has to be lowercase and alphanumeric or you'll get a generic 400 back:

```python
interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    input="What is the weather in Tokyo?",
    environment="remote",
    tools=[{
        "type": "mcp_server",
        "name": "weather",
        "url": "https://gemini-api-demos.uc.r.appspot.com/mcp",
    }],
)
```

It also takes images, as inline base64, alongside text, "analyse this chart and summarise the trends" with an attached PNG is a one-call request. Audio, video, and document inputs aren't supported yet, only text and images.

#### Background Execution and Picking Up Where It Left Off

Agent tasks involving real tool use can take minutes. `background=True` returns an interaction ID immediately and you poll it:

```python
import time

interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    input="Run a complex analysis on the repository.",
    environment="remote",
    background=True,
)

while interaction.status == "in_progress":
    time.sleep(5)
    interaction = client.interactions.get(id=interaction.id)

print(interaction.output_text if interaction.status == "completed" else interaction.status)
```

Background execution requires `store=True` (the default). For a stateful tool like code execution, continuing a conversation in the same sandbox means passing the completed interaction's `environment_id` into the next call, that's what keeps files and state intact between turns rather than starting a fresh sandbox each time.

#### Running It on a Schedule

Triggers bind an agent, an environment, a prompt, and a cron schedule into a persistent resource that fires on its own, reusing the same environment every time so files from one run are visible to the next:

```python
trigger = client.triggers.create(
    schedule="0 9 * * *",
    time_zone="America/Argentina/Buenos_Aires",
    display_name="issue-solver",
    interaction={
        "agent": "antigravity-preview-09-2026",
        "input": "Review open PRs for new comments and address feedback. Close issues whose PRs were merged.",
        "environment": {
            "type": "remote",
            "network": {"allowlist": [{"domain": "api.github.com", "credential": "github-production"}]},
        },
    },
)
```

Because it runs unattended, reference a stored credential rather than an inline token, so you can rotate the secret without touching the trigger. Triggers can be paused, resumed, run immediately on demand, and queried for their full execution history with the interaction ID of each run.

#### Keeping It on Budget

`max_total_tokens` inside `agent_config` caps total token spend (input, output, and thinking) for an interaction. Cached tokens don't count against it. Hit the limit and the interaction stops with `status: "incomplete"`, rather than failing outright, and you can send a follow-up referencing the same interaction and environment to pick up exactly where it stopped, with a fresh budget for the continuation.

Rough cost ranges Google's own data shows, useful for sizing a budget before you set one blind:

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Task category</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Input tokens</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Output tokens</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Typical cost</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Research &amp; information synthesis</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">100k-500k</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">10k-40k</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$0.30-$1.00</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Document &amp; content generation</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">100k-500k</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">15k-50k</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$0.30-$1.30</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Process &amp; system design</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">100k-400k</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">10k-30k</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$0.25-$0.80</td>
</tr>
<tr>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Data processing &amp; analysis</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">300k-3M</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">30k-150k</td>
<td style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">$0.70-$3.25</td>
</tr>
</tbody>
</table>
</div>

50-70% of input tokens are typically cached on a real run. A complex agentic workflow with heavy tool use can still run up several million tokens and several dollars in a single interaction. Compute itself (CPU, memory, sandbox execution) isn't billed during the current preview.

#### Limitations Worth Knowing

- **Preview status**: the agent and the Interactions API can both still change.
- **No sampling or length controls**: `temperature`, `top_p`, `top_k`, `stop_sequences`, and `max_output_tokens` all return a 400 if you pass them.
- **No structured outputs.**
- **Some tools aren't available yet**: `file_search`, `computer_use`, and `google_maps`.
- **MCP is HTTP-only**: no Server-Sent Events transport, and an uppercase letter in a server name triggers a generic 400 rather than a clear error.
- **Function calling is stateful only**: you must use `previous_interaction_id` to continue a turn; reconstructing history yourself isn't supported.
- **Only text and image input**, no audio, video, or documents yet.

#### Where This Gets Used

The Finance Story and Shoebox apps from the <a href="/blogs/what-google-built-with-gemini-4-argon-showcase-apps-and-workflow" target="_blank" rel="noopener">showcase article earlier in this series</a> are both built using this. A hosted agent with file and web access, pointed at messy input (a spreadsheet, a photo of a receipt), before turning it into something structured. If you're weighing whether to build an internal tool on this versus the direct model API from the second article in this series, the difference is really whether the task needs an agent that plans its own steps and uses tools, or a single well-specified request.
