---
title: "Checkout Page Tracking Scripts Disabled on Some Shopify Stores"
description: "If you manage Shopify for a store on the Basic, Shopify, or Advanced plan, your checkout page tracking may have stopped working on August 26, 2026. There was no warning banner. If nobody on your team was watching for this specific date, there's a good chance it's already affected your numbers."
image: "/images/blog/shopify-analytics.png"
---

<img src="/images/blog/shopify-analytics.png" alt="Checkout Page Tracking Scripts Disabled on Some Shopify Stores" width="100%">

### Checkout Page Tracking Scripts Disabled on Some Shopify Stores

If you manage <a href="https://www.shopify.com/" target="_blank" rel="noopener">Shopify</a> for a store on the Basic, Shopify, or Advanced plan, your checkout page tracking may have stopped working on August 26, 2026. There was no warning banner. If nobody on your team was watching for this specific date, there's a good chance it's already affected your numbers.

#### What Changed

Shopify has been retiring `checkout.liquid`, the old theme layout for checkout pages, in favour of its newer Checkout Extensibility model. Plus stores went through this first. `checkout.liquid`, the "Additional Scripts" field, and script tags on the Thank You and Order Status pages were sunset for Plus merchants on August 28, 2025.

The same cutoff reached every non-Plus store, meaning Basic, Shopify, and Advanced plans, on August 26, 2026. From that date, script tags and additional scripts stop running on the Thank You and Order Status pages for those stores too.

#### Why Tracking Stopped Working

The scripts that ran on checkout pages were doing a specific job. They fired <a href="https://analytics.google.com/" target="_blank" rel="noopener">GA4</a> purchase events, <a href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads</a> conversion pixels, the <a href="https://www.facebook.com/business/tools/meta-pixel" target="_blank" rel="noopener">Meta Pixel</a>, and affiliate tracking tags, usually dropped in through a raw script tag or a <a href="https://tagmanager.google.com/" target="_blank" rel="noopener">Google Tag Manager</a> container.

Once Shopify turns script tags off on those pages, none of that code runs. It isn't a bug and it doesn't throw an error anywhere you'd notice. The script simply never executes, so the purchase event it would have sent never fires.

The `tracking_code` object inside `checkout.liquid`, the piece that rendered the Google Analytics and Facebook Pixel code, is removed along with the rest of the layout. Any pixel firing through that route is affected the same way.

#### What Still Works

Shopify's replacement is the <a href="https://shopify.dev/docs/api/web-pixels-api" target="_blank" rel="noopener">Web Pixels API</a>. It's a standardised interface for tracking events in checkout, and it runs tracking code in a sandbox rather than as a script tag on the page.

A pixel registered through the Web Pixels API subscribes to events like `checkout_completed`, `payment_info_submitted`, and `page_viewed`, and receives a structured payload with the order ID, line items, revenue, and customer data. These pixels keep working after the sunset because they were never relying on `checkout.liquid` in the first place.

The sandbox has a real limitation though. A Web Pixels integration has no direct DOM access and no `window.dataLayer`. Tracking code that read values off the page, or pushed into the dataLayer the way a GTM container usually does, has to be rebuilt against the Web Pixels API's own event payload instead of moved across as-is.

#### How to Check If This Hit You

Start with an audit. Look for raw `<script>` tags, `gtag` or `fbq` calls, or a GTM snippet sitting in your old `checkout.liquid` template or in the Additional Scripts field. If you find any, they stopped running on August 26, 2026 if you're not on Shopify Plus.

Then confirm what's actually registered under Customer events in Shopify admin. If your GA4, Google Ads, or Meta tracking isn't showing up there as a Web Pixel, it was depending on the old method and needs rebuilding.

Compare your GA4 purchase count against your actual Shopify order count over the same period. A gap that opened up around late August is the signal to look for. Do the same check in Google Ads, using the purchase conversion action's diagnostics to look for missing transaction data, and in Meta's Events Manager test events tool, checking that the Purchase event still carries a `value`.

Shop Pay and other accelerated checkout flows skip parts of the standard checkout, so they're worth checking separately rather than assuming the same fix covers them.

#### What to Do About It

Rebuild affected tracking as a Web Pixels integration rather than trying to patch the old script tag back in, since that route is gone for good on non-Plus stores. Shopify's native Google and Meta channel integrations cover a lot of standard setups. Where you need something custom, a Web Pixels-based app or a custom pixel built against the API's event payload is the supported path.

Server-side forwarding is also unaffected by this sunset. If you're already sending order data from a webhook or the Admin API straight to GA4's Measurement Protocol, Google Ads, or Meta's Conversions API, that keeps working regardless of what happens on the checkout page itself.

Test each rebuilt pixel against a real order before trusting it, not just a staging order. Then go back and check the GA4-versus-Shopify order count comparison again once it's live, to confirm the gap has actually closed.
