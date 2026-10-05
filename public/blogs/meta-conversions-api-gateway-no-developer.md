---
title: "\"Finally, a Conversions API Setup That Doesn't Require Web Developers\" - Read This Before Acting"
description: "You may have received an email recently from Meta with the subject line \"New: Set up the Conversions API without a developer.\" It points to a short video tutorial introducing the Conversions API Gateway, a hosted way to get server-side conversion data flowing to Meta without building your own server container. However, it is worth reading the below before you get started."
image: "/images/blog/meta-conversions-api.png"
---

<img src="/images/blog/meta-conversions-api.png" alt="&quot;Finally, a Conversions API Setup That Doesn't Require Web Developers&quot; - Read This Before Acting" width="100%">

### "Finally, a Conversions API Setup That Doesn't Require Web Developers" - Read This Before Acting

You may have received an email recently from Meta with the subject line "New: Set up the Conversions API without a developer." It points to a short video tutorial introducing the <a href="https://developers.facebook.com/docs/marketing-api/conversions-api/guides/gateway" target="_blank" rel="noopener">Conversions API Gateway</a>, a hosted way to get server-side conversion data flowing to Meta without building your own server container. However, it is worth reading the below before you get started.

#### What the Email Says

The pitch is simple. The <a href="https://developers.facebook.com/docs/marketing-api/conversions-api" target="_blank" rel="noopener">Conversions API</a> (CAPI) normally means setting up server-side infrastructure to send conversion events to Meta directly from your backend, rather than relying only on the browser pixel. That's traditionally an engineers job. The Gateway skips that: Meta frames it as a two-step process that takes under ten minutes, faster than either a direct integration or building your own <a href="https://marketingplatform.google.com/about/tag-manager/" target="_blank" rel="noopener">server-side GTM</a> setup.

You can set it up directly, or through one of three named Business Partners: <a href="https://stape.io/" target="_blank" rel="noopener">Stape</a>, <a href="https://www.datahash.com/" target="_blank" rel="noopener">Datahash</a> and <a href="https://madgicx.com/" target="_blank" rel="noopener">Madgicx</a>. The email's two headline numbers are a 13% lower cost per result and a 33% lift in incremental purchase events, both cited to Meta's own studies.

#### Why This Is Genuinely Useful for Some Businesses

For a business with no CAPI integration at all today, running on browser-pixel tracking alone, this closes a real gap. Pixel-only tracking keeps losing ground to ad blockers, iOS restrictions and cookie consent opt-outs, and a lot of advertisers simply don't have the resource to build a server-side integration, let alone maintain one. A hosted gateway that gets some server-side signal flowing, even through a partner, is a real improvement over nothing.

#### Where It's Not That Simple

"Without a developer" means the setup is quick. It doesn't mean there's nothing to think about.

Choosing the partner route means a third party now sits between your website or CRM and Meta, handling your customer and conversion data on an ongoing basis, not as a one-off job. That's a new data processor relationship. Each of the three partners will have its own data handling, retention and security practices, and the email says nothing about any of them. That's worth checking before connecting live customer data, the same as you'd check any new vendor touching personal data, not after you've already turned it on.

The two performance numbers are also worth reading past the headline. The 13% cost-per-result figure comes from 28 global A/B tests run between May and August 2022. The 33% incremental-purchase-events figure comes from lift studies run earlier the same year, and Meta's own footnote says the actual improvement depends on your <a href="https://www.facebook.com/business/help/765081237991954" target="_blank" rel="noopener">Event Match Quality (EMQ) score</a>, measured specifically between a score of 5.0 and 7.0. Both numbers are now roughly four years old, and both come from Meta measuring its own product. That's useful context, not a guarantee of what you'll see on your account in 2026. If your current EMQ score is low, a quick gateway setup won't automatically fix that. Match quality depends on what identifiers you're actually passing through, not just on which pipe you use to send them. If the data doesn't exist today in Meta, it's unlikely to be there just by switching this on and not changing the incoming source.

#### When to Build It Yourself Instead

If you've already got server-side GTM running, or the available resource, building the integration directly gives you something the gateway doesn't: control over exactly what's sent, how it's hashed, and how deduplication against the browser pixel works. You can audit it, rather than depend on a partner's implementation. We've written up that build-it-yourself version, using Meta's own `facebookincubator` template on a server-side GTM container, deduplicated against the client-side pixel on a shared event ID, in our <a href="https://timhuttonco.medium.com/implementing-facebook-conversions-api-using-google-tag-manager-server-side-fd276500b793" target="_blank" rel="noopener">guide to implementing Facebook's Conversions API using GTM server-side</a>. The same core point applies whichever route you take: loop in whoever owns data protection before you start sending customer data to Meta, hash what needs hashing, and strip test event codes before anything goes live.

#### Before You Turn This On

A short checklist, whichever route you pick:

- Check the data handling and retention terms for whichever partner you connect, not just Meta's own.
- Know your current EMQ score before you set an expectation for how much this will move, since the lift Meta cites depends on it.
- Treat the 13%/33% figures as a general direction from Meta's own testing, not a forecast for your account.
- Run it as an addition to your existing tracking for a few weeks before retiring anything else, so you can see what actually changed for you.
