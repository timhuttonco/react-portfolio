---
title: "Google Adds Diagnostics, a New Uplift Metric and Meridian Integration to Data Manager"
description: "If you've ever set up Enhanced Conversions or a first-party data import in Google Ads, things are about to get easier thanks to Google's latest measurement update in Data Manager."
image: "/images/blog/google-ads-data-manager.png"
---

<img src="/images/blog/google-ads-data-manager.png" alt="Google Adds Diagnostics, a New Uplift Metric and Meridian Integration to Data Manager" width="100%">

### Google Adds Diagnostics, a New Uplift Metric and Meridian Integration to Data Manager

If you've ever set up Enhanced Conversions or a first-party data import in Google Ads, things are about to get easier thanks to Google's latest measurement update in Data Manager.

#### What Google Announced

Google published the update on its own blog on <a href="https://blog.google/products/ads-commerce/data-strength-updates/" target="_blank" rel="noopener noreferrer">10 September 2026</a>, written by Nipoon Malhotra, VP of Ads Analytics, Insights, and Measurement. It was picked up the same day by <a href="https://www.searchenginejournal.com/google-expands-data-manager-and-adds-uplift-measurement/589025/" target="_blank" rel="noopener noreferrer">Search Engine Journal</a>, and again a few days later by <a href="https://www.socialmediatoday.com/news/google-updates-data-manager-platform/830234/" target="_blank" rel="noopener noreferrer">Social Media Today</a>. Google frames the release around three things it says good measurement needs: strong data infrastructure, more than one measurement signal, and causal proof that a campaign actually worked. In practice it's a bundle of updates to <a href="https://support.google.com/google-ads-data-manager/answer/13761872?hl=en" target="_blank" rel="noopener noreferrer">Data Manager</a>, Enhanced Conversions, and Meridian.

#### Data Manager Now Feeds Google Analytics and DV360 Directly

Data Manager has until now mainly been a Google Ads tool, a way to connect your CRM, offline sales data or app events into the platform. Google is extending it so the same connection feeds Google Analytics and Display & Video 360 too, rather than needing a separate setup in each. Enhanced Conversions is expanding into GA and DV360 alongside it, so the same offline and app data used to improve conversion matching in Ads can now do the same job in those two platforms.

Google also says Data Manager's API is moving onto the IAB Tech Lab's <a href="https://github.com/InteractiveAdvertisingBureau/ecapi" target="_blank" rel="noopener noreferrer">Event and Conversions API standard (ECAPI)</a>, rather than a Google-specific format. If you've built a server-side pipeline that sends the same conversion event to more than one ad platform, this is the bit worth paying attention to. A shared industry standard means one integration can plausibly feed several platforms instead of a bespoke pipeline per platform, though it's early days for how many platforms actually support it in practice.

#### Built-in Diagnostics for Data Quality Problems

The other addition to Data Manager is built-in diagnostics, described as identifying and addressing data issues automatically before they affect a campaign. Google hasn't published much detail yet on exactly what it checks for or how it surfaces a problem. Worth treating as a genuine QA layer to test properly once it's visible in your own account rather than assuming it replaces a manual audit.

![Google Data Manager diagnostic updates](/images/blog/google-ads-data-manager2.png)

#### A New Metric for What Your First-Party Data Setup Is Actually Worth, and Why It Doesn't Hold Up on Its Own

The most concrete new thing here is the **Data Strength Uplift Metric**, live in Google Ads now. It estimates how many extra conversions you're recovering because of your first-party data setup, whether that's Enhanced Conversions, better tagging, or an additional connected data source. It's Google's attempt to put a number on the question every analytics person gets asked eventually: was the tagging work actually worth it.

Google has published a few headline figures alongside the launch. It says advertisers who connect offline and app data to Data Manager see an average 26% increase in incremental ROAS, that Enhanced Conversions delivers an average 11% increase in Search conversions compared with standard conversion imports, and that advertisers using Google tag gateway see a 14% conversion uplift, with some Demand Gen campaigns seeing uplift over 20%.

An analysis from <a href="https://www.elsop.com/data-strength-uplift-metric-four-footnotes/" target="_blank" rel="noopener noreferrer">elsop.com</a> went and checked what's actually behind those four numbers, and they don't share a methodology. Each comes from a different campaign type and a different time window, and the 14% figure specifically is Google's own internal data from the finance vertical alone, comparing the second half of 2024 against the first half of 2025. As the piece puts it, a metric that quantifies recovered conversions using the same platform that benefits when you share more data with it isn't something you can independently audit. There's no external study behind any of the four figures, and Google hasn't published enough detail on how "recovered conversions" gets counted for anyone outside Google to check the maths.

None of that means the underlying idea is wrong. Weak first-party data probably does cost most advertisers conversions, and I'd expect that to hold up almost everywhere. But "probably true" and "here's a verified number" are different claims, and right now the Data Strength Uplift Metric is presented as the second while only really supporting the first. <a href="https://www.searchenginejournal.com/google-expands-data-manager-and-adds-uplift-measurement/589025/" target="_blank" rel="noopener noreferrer">Search Engine Journal's write-up</a> makes the same point from a different angle: the Uplift Metric shows you conversion volume recovered, not whether those conversions were good ones. You still need to connect it back to your own CRM and revenue data to know if the extra conversions are actually worth anything.

#### Meridian Gets an AI Assistant and GeoX Goes Fully Live

Google's Meridian tool, the open-source marketing mix modelling and geo-experimentation platform, gets two updates here. There's a new agentic layer in the Meridian data portal that can audit data quality, flag and help resolve errors, and guide you through building a model, described as working in real time rather than as a one-off report. Meridian's models also get expanded brand signal integration, including things like branded Google query volume as an input.

This is worth calling out on its own merits, separate from the uplift metric above. Most of this year's "AI and your marketing data" stories have been about AI generating a narrative on top of a number, a Google Ads dashboard explaining why your traffic moved, for instance. Meridian's data quality auditing checks the input before the model runs on it, which is a genuinely different and more useful pattern: an AI layer that looks at whether your numbers are trustworthy in the first place, rather than one that just tells a confident story about whatever numbers it's given.

Separately, Meridian's <a href="https://ppc.land/googles-meridian-geox-exits-beta-claiming-31-cheaper-geo-experiments/" target="_blank" rel="noopener noreferrer">GeoX library</a>, its tool for running proper geo-based causal experiments (does this campaign actually cause incremental sales, tested region by region) is now generally available globally, having exited beta on 9 September, the day before this wider announcement. Google's own figure here is a claimed 31% saving on the cost of running a geo experiment, again unverified and with no disclosed methodology. That timing isn't a coincidence. Google bundled the GeoX GA news into the broader measurement-suite push a day later, rather than announcing it on its own.

#### What Google Isn't Saying

Nothing here has a firm rollout date beyond "now available" or "rolling out." There's no detail yet on exactly what the Data Manager diagnostics check for, and no independent figures to weigh against Google's own uplift percentages, all four of which come from different campaign types and time windows with no shared methodology between them. It's also worth being clear-eyed about the incentive here: every one of these updates makes it easier and more attractive to hand more first-party data to Google, and the headline stats are all Google's own numbers, published to justify exactly that. None of that makes the tools not useful. It just means test them against your own data before repeating Google's percentages as fact.

#### What to Actually Do About It

If you're already using Data Manager or Enhanced Conversions in Google Ads, the Data Strength Uplift Metric is worth a look as soon as it's visible in your account, treated as a prompt to go audit your own setup rather than as a business case in itself. If someone brings you the 26%, 11% or 14% figures as justification for a data quality project, ask what campaign type and time window they came from before repeating them, since none of the four share a comparison basis. If you're running the same conversion data through more than one ad platform's server-side pipeline, keep an eye on how ECAPI adoption develops elsewhere, since a genuine shared standard would be a real simplification. Finally, if you or a client is running Meridian already, the new agentic auditing layer is worth testing on a model you understand well before trusting it on one you don't.
