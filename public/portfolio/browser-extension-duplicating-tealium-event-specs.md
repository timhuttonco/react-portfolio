<img src="/images/works/tealium-event-spec-duplicate2.png" alt="Browser Extension: Duplicating Tealium Event Specs" width="100%">

### Browser Extension: Duplicating Tealium Event Specs

**Platform:** <a href="https://tealium.com/" target="_blank" rel="noopener">Tealium</a> (Validate, Event Health)

**What it is:** A Chrome extension that adds a missing Duplicate action to Tealium's Event Specs panel.

**Code:** <a href="https://github.com/timhuttonco/tealium-event-spec-duplicator" target="_blank" rel="noopener">github.com/timhuttonco/tealium-event-spec-duplicator</a>

#### The Problem

An event spec in Tealium validates incoming event data against an expected structure: attribute names, data types, which attributes are required. Teams running more than a few events end up with specs that are closely related to each other, a family of checkout events, several variants of a video-interaction event, and so on.

<a href="https://docs.tealium.com/server-side/event-health/manage-event-specifications/" target="_blank" rel="noopener">Tealium's own documentation</a> confirms the platform only supports creating, editing and deleting an event spec. There's no way to duplicate one. Building a near-identical spec means re-entering every attribute by hand.

#### What We Built

A small, unpacked Chrome extension (Manifest V3, a single content script, no build step, no dependencies) that adds a Duplicate button to the Event Spec Edit Details panel, in the same position Tealium puts the equivalent button on its own Audience slideout.

Clicking it clones the event definition and its linked filtered stream, rewrites the event name through the stream's rule logic wherever it appears, and marks the profile dirty. Nothing is sent to Tealium until the user clicks Save or Publish themselves, so the duplicate behaves exactly like any other unsaved edit in the platform.

#### How It Works

- **Runs in the page's own JavaScript world**, not an isolated extension sandbox, so it can reach Tealium's live in-memory profile data directly.
- **Reads and writes Tealium's own Backbone.js models and collections**, not a parallel copy. The clones keep Tealium's own model classes at every level, since the platform's save logic calls methods on them (iterating attributes, checking stream conditions) that a plain object clone wouldn't support.
- **Rewrites rule logic structurally**, walking the stream's condition tree (including a JSON-encoded logic blob) to replace every `tealium_event equals <old event>` clause, rather than a blind find-and-replace on text.
- **Builds the UI against stable attributes**, Tealium's own `data-testid` hooks, rather than generated class names that change between releases, and watches the DOM with a `MutationObserver` so the button appears and disappears correctly as the user opens and closes different specs in the same slideout.
- **Validates the new event name** against Tealium's own naming constraints (no spaces, no duplicate names) before attempting the clone.

#### Why This Is the Kind of Work We Do

This isn't a big build, and we haven't added it to the Chrome extension store yet, but that's the point. Most of the value in analytics and tagging work isn't in the strategy deck, it's in the unglamorous detail: making sure a spec actually matches the data layer it validates, keeping a family of related specs consistent with each other, and removing the exact kind of manual, repetitive step where a typo quietly creeps in.

A tool like this is a direct, practical response to a real gap in a platform we work in daily, not a demo built to show off. It's also a reasonable proxy for how we approach a client's own custom tooling needs: read the platform's actual behaviour closely enough to extend it safely, be upfront about the limits (this depends on Tealium's internal, undocumented data model and could break on a future release), and ship something that does one thing correctly rather than something broad and half-finished.

This does rely on Tealium's internal UI models rather than a published API. A Tealium platform update could change that structure and break the extension without warning. It's shared as-is on GitHub for anyone running Tealium who wants the same fix, not as a supported product.
