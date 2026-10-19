---
title: "What Google Built With Gemini 4 Argon: The Showcase Apps and the Workflow Behind Them"
description: "Google's own developer relations team used Gemini 4 Argon to turn a real employee's desk into a playable go-kart track. It's called Desk Racer, it's a real, playable Three.js game, and Google published the exact prompts used to build it."
image: "/images/blog/gemini-4-argon-showcase.png"
---

<img src="/images/blog/gemini-4-argon-showcase.png" alt="What Google Built With Gemini 4 Argon: The Showcase Apps and the Workflow Behind Them" width="100%">

### What Google Built With Gemini 4 Argon: The Showcase Apps and the Workflow Behind Them

Google's own developer relations team used Gemini 4 Argon to turn a real employee's desk into a playable go-kart track. It's called Desk Racer, it's a real, playable Three.js game, and Google published the exact prompts used to build it.

#### The Showcase

<a href="https://aistudio.google.com/learn/gemini-4-argon-showcase" target="_blank" rel="noopener">Google's showcase</a> splits into two groups. Browser-based 3D games and scenes, built in <a href="https://threejs.org/" target="_blank" rel="noopener">Three.js</a> and playable directly in <a href="https://aistudio.google.com/" target="_blank" rel="noopener">Google AI Studio</a> Build.

- **Desk Racer:** A miniature desk-coaster racing game built from photos of a real desk.
- **Wizard Chess 3D:** An interactive Gothic-cathedral chess set with stone-shatter capture physics.
- **Chaco Canyon 3D Ruins:** An architectural reconstruction of a 1,000-year-old Pueblo site, built from 0.5m airborne LiDAR and archival survey data.
- **Pocket World Terrarium**, **3D GPU Fur Simulation**, **Island Builder**, **Cozy Plow**, **Argon Tennis**, and **Isometric Town Builder**, covering procedural landscapes, physics simulation, and pixel-art world building.

Plus hosted Managed Agent apps, which turn unstructured input into something usable rather than rendering a scene.

- **Pixel Arcade:** Interviews you with a few questions and generates a custom playable pixel-art game.
- **Finance Story:** Turns a Google Drive folder, spreadsheet, or CSV ledger into an interactive financial narrative and natural-language query tool.
- **Audio Storybooks:** Illustrated video audiobooks of classic novels with synchronised narration and consistent character art.
- **Shoebox:** Takes photos of receipts and extracts, categorises, and flags anomalies in the line items.

Shoebox is definitely worth looking at if you work with data rather than code. It's a small, clean demonstration of turning genuinely unstructured input (a photo) into structured, categorised output.

Remixing any of them is a three-step loop: open the app in AI Studio Build to see its full source and a live preview, ask the built-in code assistant in plain language to change something (swap the visual theme, connect your own data, add a control etc.), then test live and either share a link or export the project to your own repository.

#### The Workflows Behind 3D Builds

Google published a <a href="https://aistudio.google.com/learn/building-3d-games-and-worlds-with-gemini-4-argon" target="_blank" rel="noopener">companion guide</a> to the 3D showcase apps, written to be handed to a coding agent directly as well as read by a person. Six patterns recur across it.

**1. Align on creative direction before writing any 3D code.** Feed Argon reference photos or a short video, ask it to generate concept mocks with Google's <a href="https://ai.google.dev/gemini-api/docs/image-generation" target="_blank" rel="noopener">Nano Banana</a> image model, and review those before any geometry gets written. In Antigravity, `/grill-me` has the agent interview you on gameplay mechanics, lighting, and object handling first:

```
/grill-me We're going to build a 3D miniature racing game set on top of an
office desk using these photos of my desk.

Do NOT write any 3D code yet:
- Ask me clarifying questions about the gameplay mechanics, lighting, and
  how we should handle the objects.
- Use Nano Banana to generate sample concept renders of the scene so we can
  lock in the visual style. Show me these renders for my review, don't
  proceed until I've signed off.
- Once I approve and have answered your questions, write a comprehensive
  PLAN.md with clear milestones and give me a ready-to-run /goal command.
```

**2. Have Argon orchestrate parallel subagents.** A 3D world has distinct pieces, terrain, props, lighting, physics, that don't need to be built one after another by a single agent:

```
Split the work across parallel subagents, so each one builds a separate
part of the world at the same time. Each should execute to the highest
possible standard.
```

**3. Add an adversarial critic subagent.** Telling a model to "keep iterating until it looks amazing" tends to produce a model that declares victory after round two. Google's fix is a separate critic subagent that scores rendered screenshots against a bar and sends the work back until it clears it:

```
Build this 3D scene over iterative rounds by invoking a strict Art Director
Critic subagent after each round. At the end of every round, render 4
screenshots: a 3/4 overview, a close-up of surface detail, a low angle
checking nothing floats above the ground, and a wireframe view checking for
clean geometry. Have the Critic inspect all 4, list at least 3 specific
visual flaws to fix, and rate the scene out of 10. Keep iterating until the
Critic rates it 9/10 or higher.
```

**4. Build small tools that keep you in the art director's seat.** A screenshot gallery (`progress.html`) saved after each milestone, and an on-screen control panel for lighting, textures, and camera angle with a "copy settings as JSON" button, let you tune the result by eye rather than by guessing at numbers, then have Argon bake your chosen values in as defaults and remove the controls before shipping.

**5. Use an image model to set a concrete visual target.** Pushing a 3D scene toward photorealism by adjusting lighting and material values blind tends to stall. Instead, take a clean screenshot (UI hidden), pass it to Nano Banana to generate a photorealistic version at the same camera angle, then have Argon compare its current render against that target and iteratively close the gap:

```
Compare our current 3D screenshots side by side against the new 2K Nano
Banana target renders. Identify the differences across lighting, shadows,
textures, and atmosphere, then iteratively upgrade our real 3D geometry,
shaders, and materials until the live scene matches the target renders
across every viewpoint.
```

**6. Ground proportions with a 2D plan first, for anything spatially exact.** Most projects don't need this. For a multi-room interior or an accurate recreation of a real place, have Argon generate a top-down 2D floorplan with real measurements, or overlay a numbered grid on reference photos, before it writes a single 3D mesh.

#### How Desk Racer Got Built

The developer relations engineer behind it uploaded photos of her desk, ran `/grill-me`, and let Argon interview her, generate Nano Banana mocks of the track design, and draft a `/goal` command. Once she approved the concept renders, she set the `/goal` and let it run: Argon orchestrated subagents across a headless Blender pipeline and Three.js, including running mathematical intersection checks so 68 coaster pillars landed flush on the desk and props without clipping through the surface.

The build then went through repeated rounds of more ambitious goals, each one verified against automated screenshots before being handed back for review. One correction stood out: early screenshots showed the kart felt cramped at the scale Argon had originally chosen, and a single prompt asking it to rescale and reposition the camera was executed correctly in one pass.

#### Why This Is Worth Reading Even if You'll Never Build a 3D Game

The actual discipline here, give the model a concrete way to verify its own output, use an adversarial check rather than letting it self-grade, and set a visual or numeric target before asking for a result, is the same discipline that makes any AI-assisted data pipeline trustworthy rather than merely plausible-looking. A model that can hold a huge amount of context and work autonomously for a long stretch is only as good as the feedback loop you give it to check its own work against. That's as true of a BigQuery pipeline as it is of a go-kart track.
