---
title: "Safari 27 Blocks Identity Resolution Vendors"
description: "Apple shipped Safari 27 alongside macOS, iPadOS, iOS and visionOS 27 in September. Within weeks, agencies running campaigns through The Trade Desk, ID5 and LiveRamp started seeing those vendors' requests fail on Safari and on every other browser on an iPhone or iPad, since Apple requires all of them to run on WebKit. On October 19, WebKit's own blog confirmed why, in a post called \"Blocking Identity Resolution Infrastructure\"."
image: "/images/blog/safari-27.png"
---

<img src="/images/blog/safari-27.png" alt="Safari 27 Blocks Identity Resolution Vendors" width="100%">

### Safari 27 Blocks Identity Resolution Vendors

Apple shipped <a href="https://www.apple.com/safari/" target="_blank" rel="noopener">Safari</a> 27 alongside macOS, iPadOS, iOS and visionOS 27 in September. Within weeks, agencies running campaigns through <a href="https://www.thetradedesk.com/" target="_blank" rel="noopener">The Trade Desk</a>, <a href="https://id5.io/" target="_blank" rel="noopener">ID5</a> and <a href="https://liveramp.com/" target="_blank" rel="noopener">LiveRamp</a> started seeing those vendors' requests fail on Safari and on every other browser on an iPhone or iPad, since Apple requires all of them to run on <a href="https://webkit.org/" target="_blank" rel="noopener">WebKit</a>. On October 19, <a href="https://webkit.org/blog/18438/blocking-identity-resolution-infrastructure/" target="_blank" rel="noopener">WebKit's own blog</a> confirmed why, in a post called "Blocking Identity Resolution Infrastructure".

We've had a few conversations this week about what this actually means for a brand's own tracking setup, separate from what it means for the ad tech vendors named in the coverage.

#### What WebKit Said

<a href="https://webkit.org/blog/18438/blocking-identity-resolution-infrastructure/" target="_blank" rel="noopener">WebKit's post</a>, signed by John Wilander, Charlie Wolfe and Matthew Finkel, describes a network-level block. Safari and WebKit on the 27 releases check every third-party domain a page calls against a list WebKit maintains. If that domain is classified as identity resolution infrastructure, the connection is terminated before any data passes. The page's own console shows "Blocked by tracking protections".

WebKit's own framing: email addresses collected at login or newsletter sign-up get turned into a persistent ID that a vendor can match across sites and devices. That ID survives a user logging out or unsubscribing. Apple blocked third-party cookies outright back in 2020, and this is Apple's account of what the industry built instead. The post is explicit that first-party personalisation, a brand matching its own visitors on its own site, isn't the target. A central resolver handling one company's data is still a third party in WebKit's eyes, even if it's only ever matching that one company's customers.

WebKit names no companies and publishes no domain list in the post itself. However, a bug report filed by The Trade Desk's Ian Meyers on September 21 listed nine domains, including `uidapi.com` (Unified ID 2.0), `id5-sync.com` and `eu-1-id5-sync.com` (ID5), `rlcdn.com` and `pippio.com` (LiveRamp), `permutive.com` (<a href="https://permutive.com/" target="_blank" rel="noopener">Permutive</a>), and `ad.gt` (<a href="https://audigent.com/" target="_blank" rel="noopener">Audigent</a>). The Trade Desk's own ad-serving domain, `adsrvr.org`, was also blocked, then appeared to come back in an iOS 27.2 beta. Nobody, including WebKit, has explained why.

<a href="https://www.adexchanger.com/" target="_blank" rel="noopener">AdExchanger</a> reported something larger sitting behind that initial list: a remotely updated register covering, by their sources' account, hundreds of companies, including CDPs, DSPs, data brokers and other identity vendors, held in a private repository Apple controls. Apple can add or remove a domain without shipping a new iOS version, and a vendor may not know it's listed until its requests start failing. We haven't seen that list, nobody we've read has, and Apple hasn't confirmed its scope publicly. Treat the five or six named vendors as confirmed and the "hundreds" figure as credibly reported but unverified.

#### The Industry's Response

ID5's co-founder and chief executive, Mathieu Roche, called the move "an attack on the web's ad-funded business model" and asked regulators to examine it. He also said the EU has already found Apple "guilty of weaponising privacy." That claim needs qualifying: the rulings he's referring to are national competition decisions about <a href="https://developer.apple.com/documentation/apptrackingtransparency" target="_blank" rel="noopener">App Tracking Transparency</a>, not a finding against Safari's web tracking rules, and Germany's case closed on commitments rather than a fine. The underlying grievance, that a platform which runs its own ad business gets to decide unilaterally what counts as a tracker for everyone else, is a real one. The specific legal claim attached to it here isn't as settled as the quote implies.

The <a href="https://iabtechlab.com/" target="_blank" rel="noopener">IAB Tech Lab</a>'s Rowena Lam made a narrower, more checkable argument: there's no published list and no formal appeal process, so Apple can block a vendor with no warning and no recourse. Her recommendation was to move identity and bidding infrastructure off the browser entirely, onto IAB Tech Lab's own Trusted Server edge software. Trusted Server's own chief executive called it "production ready" the same week Lam described it as still piloting, and its public repository had no published release as of early October.

#### What This Potentially Touches in Your Own Stack

To clarify, this isn't a block on <a href="https://marketingplatform.google.com/about/analytics/" target="_blank" rel="noopener">GA4</a> or <a href="https://marketingplatform.google.com/about/tag-manager/" target="_blank" rel="noopener">GTM</a> as platforms. It's a block on a specific, named set of third-party domains. If nothing in your tagging setup calls ID5, LiveRamp, Unified ID 2.0, Permutive, Audigent or The Trade Desk directly, the block itself doesn't touch you.

Most brands we've worked with aren't that clean, however. We've seen CDP enrichment steps reading an ID5 envelope, pixels passing a Trade Desk identifier, and an audience sync running through a GTM tag. Any of those calls start failing on Safari and every iOS browser, with no visible error for anyone outside a browser console.

There's a second, separate mechanism in the same 27 release worth knowing about, reported so far against the beta rather than confirmed on the stable build. Safari's Link Tracking Protection, which already strips `gclid`, `fbclid` and `msclkid` from shared links, is reportedly being extended to more parameters (`twclid`, `si`, `xmt` among them). Its Advanced Fingerprinting Protection has reportedly flagged some tag managers and CDPs, <a href="https://www.tealium.com/" target="_blank" rel="noopener">Tealium</a> and <a href="https://segment.com/" target="_blank" rel="noopener">Segment</a> among the names mentioned, restricting their access to cookies, local storage and referrer data. If that holds on the stable release, a tag deployed through a flagged CDP inherits the restriction even if the tag itself has nothing to do with identity resolution.

The practical consequence for GA4 specifically: a cross-domain or cross-device journey that depended on one of the blocked vendors to stitch sessions together stops stitching. A returning visitor who used to get matched back to their original channel can show up as a fresh, unattributed session instead, and GA4 will often classify that second session as Direct, because there's no referrer and no persistent ID left to connect it to anything earlier.

#### Why Moving to Server-Side Doesn't Completely Solve This

The instinct, understandably, is to route around a browser-side block by moving the call server-side. That only works if the identity the server-side call depends on never passed through a blocked domain in the first place. Most Conversion APIs still need a client-side step to establish who the visitor is before the server-side call can attach a value to them. If that client-side step was a request to `id5-sync.com` or `rlcdn.com`, it's already blocked, and the server-side call downstream has nothing to work with.

Safari has also inspected CNAME-cloaked subdomains for several years now, a defence against exactly the trick of disguising a third party as a first-party request. Routing a blocked vendor's call through your own subdomain isn't a new idea, and it's one Safari is already built to see through. Apple's ability to update the block list remotely, without a new OS release, makes this a weaker bet than it might have looked a year ago.

None of this rules out server-side tracking. It rules out treating a server-side rebuild as a quick patch for a block that's actually about where an identifier came from, not which side of the network it's processed on. Genuinely first-party identity, a login your own site collects, a newsletter address someone gave you directly, data that never leaves your own domain before you act on it, isn't touched by any of this.

#### What We'd Suggest Doing About It This Quarter

Audit your tag and pixel inventory for the domains named above, and for anything routed through a CDP that might inherit a fingerprinting restriction once the stable release lands.

Before anyone reallocates budget off a channel that looks like it stopped converting, check whether it stopped converting or whether it stopped being measurable.

If marketing asks whether the consent banner caused this, the answer is no. WebKit's block runs regardless of what a visitor clicks on a cookie prompt. That's worth saying plainly and early, before someone proposes rebuilding a CMP to fix something a CMP never touched.

Treat this as one more reason to build identity on what you actually collect yourself, rather than on an ID bought in from a vendor whose domain Apple can add to a list it controls, at a time it chooses, with no notice. That's the slower, less exciting answer. It's also the only one that doesn't depend on guessing right about what gets blocked next.

#### Our Take

This reads less like a single dramatic event and more like the next instalment of something that started with Intelligent Tracking Prevention in 2017 and the full third-party cookie block in 2020. Apple's stated rationale is consistent with that history, and on its own terms it holds up: an identifier that outlives a logout is the thing the 2020 policy was meant to stop, and email-based resolution became the industry's way around it rather than a change of practice.

The part that doesn't get resolved by that rationale is the mechanism. A privately held, remotely updatable list with no published criteria and no appeal process is a legitimate governance concern on its own, separate from whether the underlying practice deserved to be stopped. It's another chapter in the battle between Martech and Apple.
