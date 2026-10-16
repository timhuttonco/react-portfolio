---
title: "ChatGPT Stops Tagging Outbound Links"
description: "Check your GA4 channel report for the week of October 9, 2026. If ChatGPT referral traffic dropped by 30% or more, it probably isn't gone. It's just not labelled as ChatGPT anymore."
image: "/images/blog/chatgpt-phone.png"
---

<img src="/images/blog/chatgpt-phone.png" alt="ChatGPT Stops Tagging Outbound Links" width="100%">

### ChatGPT Stops Tagging Outbound Links

Check your <a href="https://analytics.google.com/" target="_blank" rel="noopener">GA4</a> channel report for the week of October 9, 2026. If ChatGPT referral traffic dropped by 30% or more, it probably isn't gone. It's just not labelled as ChatGPT anymore.

#### What Changed

<a href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT</a> began rolling out GPT-6 and a new interface called Intelligent UI on October 7, 2026, first to Plus, Pro, Business and Enterprise accounts, then to Free and Go plans the next day. Intelligent UI mixes interactive elements, charts, buttons, calculators, into answers where OpenAI judges that format fits the question.

Somewhere in that same rollout, most of the links ChatGPT cites in its answers stopped carrying a `utm_source=chatgpt.com` tag. OpenAI had actually added that tag to more ChatGPT links back in June 2026. As of mid-October, it's missing from the majority of citation links again. OpenAI hasn't said whether this is intentional or a side effect of the new interface.

#### Why It Shows Up as Direct, Not as Missing

Cedric Huesler at <a href="https://www.adobe.com/" target="_blank" rel="noopener">Adobe</a> looked at the actual link code and found the mechanism. GPT-6 opens citation links with `window.open(url, "_blank", "noopener,noreferrer")`. The `noreferrer` part strips the referrer header, so the destination site never sees that the click came from ChatGPT. Combined with the missing UTM parameter, there's no signal left at all.

Analytics tools have always handled this case the same way. No campaign parameters and no recognised referrer means the visit gets filed as Direct.

#### How Big the Gap Is

<a href="https://www.tryprofound.com/" target="_blank" rel="noopener">Profound</a>, which tracks how brands show up in AI answers, measured the drop day by day against the Intelligent UI rollout:

<div style="overflow-x:auto">
<table style="width:100%; border-collapse:collapse">
<thead>
<tr>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Date</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Answers with a tagged cited link</th>
<th style="text-align:left; padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Intelligent UI share of answers</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Oct 8</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">~98%</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">~2%</td>
</tr>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Oct 9</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">75%</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">26%</td>
</tr>
<tr>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">Oct 14</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">66%</td>
<td style="padding:6px 10px; border:1px solid rgba(128,128,128,0.4)">~35%</td>
</tr>
</tbody>
</table>
</div>

The two lines move almost exactly in opposite directions. Profound's own scatter of the data shows close to a one-for-one trade-off: for every point Intelligent UI's share rises, tagged-link share falls by about the same amount. Profound frames this as a correlation worth acting on, not a confirmed root cause, since OpenAI hasn't published anything explaining the change.

There's one exception. Links opened from a secondary panel inside an Intelligent UI answer, rather than the main citation in the answer text, sometimes still carry the tag. Which link a user clicks can change whether that visit gets attributed correctly.

#### What It Looks Like on the Receiving End

Huesler's second piece of analysis is the one that matters for reading your own reports. He compared October 9 to 13 against the prior week across roughly 500 pages where ChatGPT had been driving at least 5% of traffic:

- ChatGPT-attributed visits fell by about 31,000 a day across those pages.
- Direct visits rose by about 26,000 a day on the same pages.
- Direct traffic rose on two-thirds of the pages that lost ChatGPT traffic. The week before, that was close to a coin flip.
- Search traffic fell 7% on the same pages, a separate and smaller decline.

He also found a behavioural tell. Among the new Direct visitors on mobile, the share seeing a cookie consent banner, a reasonable proxy for a first-time visit, rose from 36% to 44%. ChatGPT visitors show a 55% consent-banner rate. The new Direct traffic behaves much more like a ChatGPT visitor than like a returning Direct visitor.

#### What This Isn't

This isn't a drop in how often your brand gets cited in ChatGPT answers. Visibility or citation share, tracked through a tool like Profound, isn't affected, because it doesn't depend on a tag surviving the click. The website still records the visit and, if it converts, the sale. What's broken is only the label on where that visit came from.

Don't read a sudden fall in your GA4 ChatGPT channel as your content losing ground in AI search. Treat it as a tagging outage, the same way you'd treat a UTM parameter breaking on a paid campaign, and check the numbers that actually tell you whether performance changed before concluding anything did.

#### What to Actually Do About It

**Annotate your reports around October 9, 2026:** Anyone reading a channel trend line later needs to know why ChatGPT's number dropped and Direct's number rose at the same time, on the same date.

**Look at Direct alongside ChatGPT on your highest-exposure pages:** A landing page that used to get real ChatGPT referral traffic showing a correlated rise in Direct from early October is very likely the same traffic, just unlabelled.

**Check first-visit signals on Direct traffic if you track them:** A spike in consent-banner rate, or any other new-visitor signal, among Direct sessions is a useful confirming check, the same one Huesler used.

**Test your own ChatGPT sessions periodically:** Click through from a real ChatGPT answer every so often and check what the landing URL actually looks like. That's a simple canary for whether tagging has come back.

**Keep using visibility and citation tracking as your leading indicator for ChatGPT's reach**: Not UTM-based referral counts, for as long as this gap lasts. Visibility tells you whether and how often you're being cited. Referral counts only tell you that if the tag survives the click, which right now it mostly doesn't.

There's nothing to fix on your own site or in your own analytics setup. The signal that would identify a ChatGPT visit never arrives, so no tool on your end can reconstruct it after the fact. If OpenAI restores the tag, that only fixes future traffic. The data already lost during the gap stays lost.
