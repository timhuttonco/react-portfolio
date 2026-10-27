---
title: "We Built a Small Chrome Extension to Duplicate Tealium Event Specs"
description: "Open Tealium's Validate section, go to Event Specs, and open any spec you've already built. Look for a Duplicate button. There isn't one. Tealium's own documentation confirms it: an event spec can be created, edited or deleted, and that's the full list."
image: "/images/blog/tealium-event-spec-duplicate2.png"
---

<img src="/images/blog/tealium-event-spec-duplicate2.png" alt="We Built a Small Chrome Extension to Duplicate Tealium Event Specs" width="100%">

### We Built a Small Chrome Extension to Duplicate Tealium Event Specs

Open <a href="https://tealium.com/" target="_blank" rel="noopener">Tealium</a>'s Validate section, go to Event Specs, and open any spec you've already built. Look for a Duplicate button. There isn't one. <a href="https://docs.tealium.com/server-side/event-health/manage-event-specifications/" target="_blank" rel="noopener">Tealium's own documentation</a> confirms it: an event spec can be created, edited or deleted, and that's the full list.

That's a problem the moment you need a second spec that's almost identical to one you already have. A new event with the same attributes, the same required fields, the same validation rules, just a different `tealium_event` name. The only official route is rebuilding it by hand, attribute by attribute, and then rebuilding the filtered stream rule underneath it too.

We didn't want to keep doing that by hand, so we built a small Chrome extension that adds the missing button.

#### What Is an Event Spec?

An event spec looks like one thing in the UI: a definition with a name, a set of attributes, and some notes. Underneath, it's two separate records in Tealium's own in-browser data model:

- An event definition: the `tealium_event` name, the attribute definitions (name, required, example value), labels and notes.
- A linked filtered stream, named `Event Specification: <event>`, whose rule is `tealium_event equals <event>`. This is what actually routes live events to the spec for validation.

Duplicating a spec properly means cloning both records, giving them new IDs, and rewriting the event name everywhere it appears in the stream's rule logic, not just copying the visible attribute list.

#### How the Extension Works

<img src="/images/blog/tealium-event-spec-duplicate2.png" alt="We Built a Small Chrome Extension to Duplicate Tealium Event Specs" width="100%">

The extension is a single content script that runs inside Tealium's own page, in the page's JavaScript world rather than an isolated extension sandbox. It needs to reach Tealium's own in-memory profile data (`gApp.inMemoryModels`), the same Backbone.js collections the platform itself reads from and writes to.

When you click Duplicate, it:

1. Finds the event definition and its linked filtered stream.
2. Clones both, using Tealium's own model classes rather than plain objects, since Tealium's save logic calls methods on them directly.
3. Rewrites every `tealium_event equals <old event>` condition in the cloned stream's rule logic to point at the new event name you typed in.
4. Adds both clones to Tealium's in-memory collections and marks the profile dirty.

Nothing reaches Tealium's servers at that point. The clone exists only in your browser's memory until you click Save or Publish yourself, the same as any other unsaved change in the platform. Reload without saving and the duplicate disappears, which is the same as working with other Tealium features but has caught us out a few times!

<img src="/images/blog/tealium-event-spec-duplicate4.png" alt="We Built a Small Chrome Extension to Duplicate Tealium Event Specs" width="100%">

#### Installing It

Because it's such a niche use case, the extension isn't on the Chrome Web Store yet. It's a small, unpacked extension you load yourself:

1. Download or clone the code from <a href="https://github.com/timhuttonco/tealium-event-spec-duplicator" target="_blank" rel="noopener">GitHub</a>.
2. Open `chrome://extensions`, turn on Developer mode.
3. Click Load unpacked, select the folder.
4. Reload your Tealium tab.

Open an event spec and the Duplicate button appears next to Close, in the same place Tealium puts the equivalent button on its own Audience slideout. Type a new event name, press Enter, and the copy appears in your spec list with Tealium's own dirty-state indicator showing you have unsaved changes to review. Save or publish as normal to keep it.

This is built against Tealium's internal, undocumented UI models, not a published API. It works today because we tested it against the current version of the platform's Validate section. A future Tealium release could change the model structure underneath and break it, and there's no guarantee it won't. If the Duplicate button stops appearing after a Tealium update, that's the likely cause.

It also doesn't validate anything beyond the new event name: it checks the name isn't blank, doesn't contain spaces, and isn't already in use, the same constraints Tealium's own event spec names are subject to. Everything else about the duplicate, every attribute and validation rule, comes across exactly as it was on the source spec, which is the point.

The code is open on <a href="https://github.com/timhuttonco/tealium-event-spec-duplicator" target="_blank" rel="noopener">GitHub</a> if you want to use it, read it, or adapt it for your own Tealium instance.
