---
title: "Adobe's September CJA Release Roundup"
description: "Adobe's Customer Journey Analytics (CJA) shipped a handful of smaller items through September 2026 that are worth knowing about if you run reporting on the platform, even if none of them are big enough to carry their own announcement."
image: "/images/blog/adobe-cja.png"
---

<img src="/images/blog/adobe-cja.png" alt="Adobe's September CJA Release Roundup" width="100%">

### Adobe's September CJA Release Roundup

Adobe's <a href="https://business.adobe.com/products/experience-platform/adobe-analytics/customer-journey-analytics.html" target="_blank" rel="noopener">Customer Journey Analytics</a> (CJA) shipped a handful of smaller items through September 2026 that are worth knowing about if you run reporting on the platform, even if none of them are big enough to carry their own announcement.

#### Consent Policy Filtering

Released September 21, 2026. You can now report on which visitors match a given Experience Platform consent policy, and exclude non-consenting visitors from a dataset before it is even ingested.

That is a meaningful difference from filtering consent out at report time. Filtering at ingestion means the excluded data never becomes part of the dataset at all, which matters if your compliance team cares about where consent gets enforced in the pipeline, not just whether a report happens to respect it.

#### Segment Date Range Limiting

Released September 9, 2026. A new option restricts segment results strictly to the reporting date range, even when the segment itself contains its own date components.

This closes a subtle reporting trap. A segment built with its own internal date logic could previously return results that quietly extended beyond the date range you thought you were reporting on. If you have ever had a segment-based number look slightly off compared to a non-segmented one covering the same period, this is worth checking against.

#### Data Usage Labels

Released September 3, 2026. CJA added C2 and C3 data usage labels, which restrict third-party data export and restrict combining identifiable data, respectively. A further label, C9, is planned for a later release.

These slot into Adobe's existing data governance labelling system rather than introducing a new one. If your organisation already uses usage labels elsewhere in <a href="https://business.adobe.com/products/experience-platform/adobe-experience-platform.html" target="_blank" rel="noopener">Adobe Experience Platform</a>, this extends the same governance model into CJA specifically.

#### The One Worth Watching: An MCP Server Plugin

Released September 1, 2026. CJA now has its own MCP server plugin, letting tools like ChatGPT and Claude connect directly to your CJA data.

This is the one we'd flag hardest of the four. It is a small, unglamorous release note, but it is also a direct, vendor-shipped example of the exact shift we keep writing about: analytics data becoming something AI tools query directly, not just something a person exports into a deck. Whether your team is ready for that depends entirely on whether the data underneath is clean and well-governed enough to hand to an AI agent in the first place. A consent-aware, properly labelled dataset is a reasonable thing to query with an AI tool. A messy one is not, and this plugin will not tell you which one you have.

#### What to Actually Do About It

None of these four needs an urgent response. But if you run CJA reporting for a client or your own brand, it is worth a short pass through each one: confirm consent filtering is enforced where your compliance team expects it, check any date-sensitive segments against the new range-limiting option, and have a real conversation before anyone connects an AI tool to your CJA data through the new plugin, not after.
