---
title: "Google Ads Customer Match Adds IP Address Matching"
description: "If you build Customer Match audiences in Google Ads, you have probably only ever uploaded two kinds of data: email addresses and phone numbers, both hashed before they leave your system. That changed on September 25, 2026. Customer Match file uploads now accept two new columns, \"User IP address\" and \"User interaction timestamp.\" Unlike email and phone, both are sent to Google unhashed."
image: "/images/blog/google-ads.png"
---

<img src="/images/blog/google-ads.png" alt="Google Ads Customer Match Adds IP Address Matching" width="100%">

### Google Ads Customer Match Adds IP Address Matching

If you build Customer Match audiences in <a href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads</a>, you have probably only ever uploaded two kinds of data: email addresses and phone numbers, both hashed before they leave your system. That changed on September 25, 2026. Customer Match file uploads now accept two new columns, "User IP address" and "User interaction timestamp." Unlike email and phone, both are sent to Google unhashed.

We think this is worth a proper look before anyone recommends switching it on, because the fine print raises real questions about what a "match" actually means here.

#### What Changed

Google added IP address as a new Customer Match signal type, the first new one in years. There was no formal announcement. A Google Ads Help Center page updated on September 25 is the only source, and it has no visible publish date. It was picked up independently within 48 hours by <a href="https://searchengineland.com/google-ads-adds-ip-address-and-timestamp-matching-to-customer-match-491517" target="_blank" rel="noopener">Search Engine Land</a>, ppc.land (<a href="https://ppc.land/google-customer-match-gains-raw-ip-matching-minus-users-in-32-countries/" target="_blank" rel="noopener">twice</a>, <a href="https://ppc.land/google-now-takes-ip-addresses-for-customer-match-but-dv360-is-left-out/" target="_blank" rel="noopener">here too</a>), <a href="https://www.elsop.com/google-customer-match-raw-ip-address-timestamp" target="_blank" rel="noopener">elsop.com</a>, <a href="https://www.contentgrip.com/google-ads-customer-match-ip/" target="_blank" rel="noopener">Content Grip</a>, and <a href="https://www.relevantaudience.com/google-ads-en/google-ads-customer-match-ip-address-timestamp-upload/" target="_blank" rel="noopener">Relevant Audience</a>, so the feature itself is not in doubt. What's less settled is how well it actually works.

IP matching is blocked in the EEA, UK, and Switzerland, 32 territories in total. That's likely tied to an unresolved case at the <a href="https://ppc.land/german-court-asks-eu-to-clarify-ip-address-data-protection-rules/" target="_blank" rel="noopener">German Federal Court of Justice</a>, which referred the question to the EU Court of Justice on August 28, 2025 (Case C-654/25), on whether a dynamic IP address counts as personal data. Google is clearly hedging on that question rather than waiting for the ruling.

#### The Part Worth Reading Twice

Per Google's own documentation, if you upload an IP address without a timestamp, the system defaults to matching it to the "latest known" user of that IP address. Not the customer you actually logged. Whoever currently holds that IP.

This matters because IP addresses get reassigned constantly. Households and offices share a single IP across everyone on the network. A customer record from six months ago, uploaded today without a timestamp, could resolve to a completely different person than the one you intended to reach.

#### What Independent Research Says About IP Matching

The coverage around this feature leans on real studies, not just scepticism for its own sake:

- <a href="https://ppc.land/ip-address-targeting-proves-87-inaccurate-for-household-advertising/" target="_blank" rel="noopener"><strong>Truthset</strong></a> (November 2025, in a joint report with CIMM and Go Addressable, benchmarking nearly a billion IP records from six data providers against ISP truth sets) found IP-to-postal-address matching accurate 13% of the time, and IP-to-email matching accurate 16% of the time.
- <a href="https://ppc.land/ip-based-ctv-targeting-fails-3-in-4-times-adstra-study-finds/" target="_blank" rel="noopener"><strong>Adstra/InterMedia Advertising</strong></a> (July 2026) found only 23% of residential IPs actually resolved to their intended geographic target, meaning standard IP targeting missed its intended household roughly three times out of four.
- A <a href="https://ppc.land/stanford-study-finds-5-of-ip-addresses-send-55-of-all-web-requests/" target="_blank" rel="noopener"><strong>Stanford-led study</strong></a> (August 2026, from researchers at Stanford and Cloudflare) found that roughly 5% of IP addresses generate more than half of all web requests, and that client operating systems commonly rotate IPv6 addresses every 24 hours by default for privacy reasons, undercutting the idea that IPv6 fixes the identification problem.

Google's own Help Center already states that match rates "aren't an indicator of list performance." That's a notable admission to include in your own documentation for a feature you're launching.

On top of the accuracy questions, the documentation itself is inconsistent. The timestamp column name appears three different ways across Google's pages: "User interaction timestamp," "User Engagement timestamp," and "User Interaction timestamp." Coverage from multiple outlets also flags contradictions in which fields are actually mandatory.

#### What This Means if You Manage Customer Match Audiences

A bigger audience is not automatically a more accurate one. If a client or your own team is being pitched this as a quick match-rate win, the question to ask first is what the match is actually built on. An IP address with no timestamp attached is a guess dressed up as a signal.

If you do test it, always include the interaction timestamp. That's the one lever you control that keeps the match tied to an actual point in time, rather than whoever holds that address today. And treat any resulting lift in Customer Match audience size as something to validate against real conversion outcomes, not as a result on its own.

This is the same underlying issue we keep coming back to with these platform "improvements": more data isn't the same thing as better data.
