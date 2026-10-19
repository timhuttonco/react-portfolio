---
title: "Getting Started With Google Antigravity and Gemini 4 Argon"
description: "This article covers the Antigravity IDE and app, Google's agent-first development environment for human developers, which shipped Gemini 4 Argon support on October 13, 2026."
image: "/images/blog/google-antigravity.png"
---

<img src="/images/blog/google-antigravity.png" alt="Getting Started With Google Antigravity and Gemini 4 Argon" width="100%">

### Getting Started With Google Antigravity and Gemini 4 Argon

This article covers the Antigravity IDE and app, Google's agent-first development environment for human developers, which shipped Gemini 4 Argon support on October 13, 2026.

#### What Is Antigravity?

<a href="https://antigravity.google/" target="_blank" rel="noopener">Antigravity</a> is five pieces that share the same agent runtime:

- **The Antigravity app:** A command centre for running multiple local agents in parallel, grouped into projects, that can also schedule routine tasks to run on their own.
- **The Antigravity CLI:** A terminal-first way to run the same autonomous agents, execute shell commands, and manage background subagents without a GUI.
- **The Antigravity IDE:** A full agentic code editor with an agent manager and an understanding of your whole codebase.
- **The Antigravity SDK:** For prototyping your own custom agents on the same harness with a small amount of Python, including support for running evaluations against them.
- **Antigravity Extensions:** Add the same agent capability into other editors.

It's free for individual developers, whilst organisations get a separate enterprise setup, with its own documentation and pricing.

#### Getting Started

Before you install anything, you'll need: macOS, Windows, or a supported Linux distribution, Google Chrome installed (the browser sub-agent drives it directly), and a personal Google account to sign in with.

1. Download the Antigravity app for your OS from the Antigravity download page and run the installer.
2. Choose "Continue with Google" and sign in. Antigravity's own getting-started guide covers personal Google accounts, with business account setup handled separately.
3. Once signed in, pick a theme, optionally add any Google plugins offered, accept the terms, and finish setup.
4. If you want the full IDE rather than just the app, install it separately from the same download page and sign in with the same account.

#### Your First Project and Task

Antigravity organises work into projects, each pointed at a real folder on disk. To get started:

1. Create a local folder for the project, for example `my-first-project` under a working directory of your choice.
2. In the app's Projects section, choose Create New Project, then New Project, and select that folder.
3. If the work spans more than one folder, for example a separate frontend and backend, add the extra folders in Project Settings. Each project inherits your global settings but can override them, including security presets, how closely it checks in before taking an action, and which MCP tools it's allowed to use.
4. Start your first conversation, and begin with something low-stakes, a greeting, or a simple question, before handing it a real task.
5. Select Gemini 4 Argon (`gemini-4-argon`) as your active model if you're on a Google AI Ultra plan and want its reasoning depth for complex planning or multi-agent orchestration, rather than whatever Antigravity defaults to.

#### Slash Commands

Google's own teams use a specific set of commands inside Antigravity to keep a long agent run on track, rather than prompting turn by turn, which are super useful to know:

- **`/grill-me`:** Before writing any code, has the agent interview you with clarifying questions about edge cases, success criteria, and approach, so a long autonomous run starts pointed at the right target.
- **`/plan`:** For anything non-trivial, opens an Implementation Plan in the Auxiliary Pane before any code gets written, which you approve, or send back for changes, before the agent proceeds.
- **`/goal`:** Once you've aligned on a plan, sets the agent to work autonomously for an extended stretch on a measurable target, writing code, running checks, and iterating across files on its own, while still pausing for your confirmation before anything irreversible.
- **`/browser`:** Followed by a request, drives an actual browser sub-agent. This needs Chrome set as your default browser and a one-time permission grant.

When a task finishes, review the Walkthrough and the actual file diffs it produced before merging anything. You can open any changed file and comment directly on specific lines if something needs adjusting.

#### When to Use Antigravity + Gemini 4 Argon

Not every task belongs in an agentic IDE. Antigravity, and Argon underneath it, are built for long-horizon work: multi-file migrations, a feature that touches several parts of a codebase, or a task where the planning step matters as much as the code itself. A one-line fix or a quick lookup doesn't need an implementation plan and a walkthrough, there are much simpler tools for that sort of use case.

One note to be aware of is that Argon's benchmark performance and its real-world coding reliability aren't the same measurement. One hands-on test had it write Kubernetes manifests that passed every lint check but crash-looped on an actual cluster, fixed only once shown the real error. It's a nice reminder to always review the walkthrough and the diff Antigravity shows you before merging anything, which is why Google's own developer guide recommends giving the agent a concrete way to verify its own work (a test suite, runtime logs, a screenshot check) rather than letting it declare victory on its own say-so. We'll cover worked examples in some future articles.

#### Where This Fits Next to a Direct API Integration

If you're building a product feature that calls Argon, the direct API approach from the <a href="/blogs/how-to-call-gemini-4-argon-from-your-own-code" target="_blank" rel="noopener">second article in this series</a> is the right tool, as you need control over exactly what gets sent and how the result gets used. If you're the one doing the coding work yourself, day to day, inside a real codebase, Antigravity is built for that instead, and it's free to try before deciding whether it earns a permanent place in your workflow.
