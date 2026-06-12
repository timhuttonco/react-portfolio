<img src="/images/works/layer-lens.png" alt="Layer Lens Chrome Extension" width="100%">


### Layer Lens — Chrome Extension

<a href="https://chromewebstore.google.com/detail/layer-lens/fhmgghjjjfminjjobiibekgcnhggnpmb?authuser=0&hl=en" target="_blank" title="Layer Lens - Chrome Extensions">Layer Lens</a> is a <a href="https://developer.chrome.com/docs/extensions/" target="_blank" title="Chrome Extensions">Chrome extension</a> for searching <a href="https://marketingplatform.google.com/about/tag-manager/" target="_blank" title="Google Tag Manager">GTM</a> <a href="https://developers.google.com/tag-platform/tag-manager/datalayer" target="_blank" title="GTM dataLayer"><code>dataLayer</code></a> pushes and <a href="https://support.google.com/analytics/answer/10089681" target="_blank" title="Google Analytics 4">GA4</a> network hits on any website in real time. Type any value — a product ID, event name, user property, EAN — and it finds exactly where that value appears in the tracking layer and Google Analytics requests, showing the parameter path and matched value in a clean popup UI.

The extension code can be found on Github <a href="https://github.com/timhuttonco/LayerLens" target="_blank" title="Layer Lens on GitHub">here</a>.

#### The Problem

Analytics implementations can be hard to verify quickly - especially if all you want to do is understand where you can find a particular value. When a new data point is added, the standard approach is to open <a href="https://developer.chrome.com/docs/devtools/" target="_blank" title="Chrome DevTools">DevTools</a>, go to the Network tab, filter by <code>collect</code>, and manually inspect individual requests. For GA4, this means decoding compact tilde-delimited item strings like <code>pr1=id46376~nmJacket~brVERSACE~caClothing~pr5530~qt1</code> by hand - an arduous task at the best of times.

The problem is not that the information is unavailable — it is that the workflow is slow, error-prone, and does not match the way people actually think about tracking. An analyst verifying a product page fires the right data has a specific value in mind (usually something visible on the page) and wants to know: *is this value in the data?* The DevTools workflow forces them to work the other way around — browse all the data and search for the value manually.

Layer Lens inverts that: search first, starting from the value you can see on the page.

<img src="/images/blog/layer-lens-screenshot-1.png" alt="Layer Lens search results showing matched dataLayer and GA4 events" width="100%">

#### How It Works

The extension is built entirely in vanilla JavaScript with no external dependencies, as a <a href="https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3" target="_blank" title="Chrome Extension Manifest V3"><strong>Manifest V3</strong></a> Chrome extension.

The core challenge in building a dataLayer/GA4 inspector is that Chrome extensions run in an isolated JavaScript world that cannot access a page's own <code>window</code> object. Intercepting <code>dataLayer.push()</code> requires code running in the <strong>MAIN world</strong> — the same execution context as the page itself. Layer Lens solves this with a two-script architecture:

- **<code>injected.js</code> (MAIN world)** — runs at <code>document_start</code>, before any page scripts execute. It wraps five APIs: <code>window.dataLayer.push</code>, <code>window.gtag()</code>, <code>window.fetch</code>, <code>XMLHttpRequest.send</code>, and <code>navigator.sendBeacon</code>. All captured events are stored in memory arrays inside the page tab. Because it runs at document start, it also handles SPAs that reset <code>window.dataLayer</code> mid-session by intercepting future property assignments via <code>Object.defineProperty</code>.

- **<code>content.js</code> (ISOLATED world)** — bridges the gap between the popup and <code>injected.js</code>. Because the two worlds share a DOM but not JavaScript variables, they communicate via <code>CustomEvent</code> dispatched on <code>window</code>. <code>content.js</code> also renders the in-page hover-to-search tooltip and listens to <a href="https://developer.chrome.com/docs/extensions/reference/api/storage" target="_blank" title="chrome.storage API"><code>chrome.storage.onChanged</code></a> to respond to the user toggling the tooltip preference in the popup.

When the user searches, the message flow is: popup → <code>chrome.tabs.sendMessage</code> → <code>content.js</code> → <code>CustomEvent</code> → <code>injected.js</code> → recursive value search → <code>CustomEvent</code> response → <code>content.js</code> → popup render.

The search itself is a recursive depth-first walk of each captured event object, returning an array of <code>{ path, value }</code> descriptors for every leaf whose string representation contains the search term (case-insensitive). Paths are expressed in dot/bracket notation (e.g. <code>ecommerce.items[0].item_id</code>) so the result is immediately actionable.

<img src="/images/blog/layer-lens-screenshot-2.png" alt="Layer Lens hover-to-search tooltip in action" width="100%">

#### GA4 Ecommerce Decoding

GA4 sends ecommerce item data in a compact network format to reduce payload size. There are two variants: a legacy dotted format (<code>pr1.nm=Jacket</code>) and a modern tilde-delimited format (<code>pr1=id46376~nmJacket~brVERSACE</code>). Both use two-character short codes that map to GA4 field names.

Layer Lens decodes both formats automatically using a short-code lookup table and a custom parser for the tilde-delimited segments, including support for custom parameters serialised as <code>k0&lt;name&gt;~v0&lt;value&gt;</code> pairs. The result is that all item fields appear in search results under their full GA4 names (<code>item_name</code>, <code>item_brand</code>, <code>item_category</code>, etc.) without any manual cross-referencing.

#### Server-Side GTM Detection

Standard GA4 hits go to <code>google-analytics.com/g/collect</code>. However, many sites proxy GA4 hits through a first-party domain via <a href="https://developers.google.com/tag-platform/tag-manager/server-side" target="_blank" title="Server-side Google Tag Manager">server-side GTM</a> for privacy compliance and improved hit delivery. These hits look identical at the network level but arrive at a domain like <code>analytics.net-a-porter.com/g/collect</code> or <code>t.example.com/g/collect</code>.

Layer Lens uses a three-tier detection strategy: first match by Google's own domain, then by the <code>/g/collect</code> path on any domain, then by GA4 payload fingerprint (<code>tid=G-</code> combined with <code>en=</code>). This means it catches GA4 hits reliably regardless of where the tagging server is hosted.

#### Permissions

The extension requests only what it needs: <code>activeTab</code> and <code>scripting</code> for tab communication, <code>contextMenus</code> for the right-click search, <code>storage</code> to persist the last search and tooltip preference, and <code>&lt;all_urls&gt;</code> host permission to inject content scripts across all pages. No data is ever sent externally — all captured events live only in the tab's memory.

#### Tech Stack

- Vanilla JavaScript (ES2020) — no build step, no frameworks, no dependencies
- <a href="https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3" target="_blank" title="Chrome Extension Manifest V3">Chrome Extension Manifest V3</a>
- Two-world content script architecture (MAIN + ISOLATED)
- <a href="https://developer.chrome.com/docs/extensions/reference/api/storage" target="_blank" title="chrome.storage API"><code>chrome.storage.local</code></a> for persistent preferences
- <a href="https://developer.chrome.com/docs/extensions/reference/api/action" target="_blank" title="chrome.action API"><code>chrome.action.openPopup()</code></a> for programmatic popup triggering (requires Chrome 99+)
- HTML/CSS popup UI with collapsible result cards
