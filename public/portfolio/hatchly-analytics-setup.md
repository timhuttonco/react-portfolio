<img src="/images/works/hatchly.png" alt="Analytics & Tracking Setup for Hatchly" width="100%">


### Analytics & Tracking Setup — Hatchly

<a href="https://hatchly.co.uk/" target="_blank" title="Hatchly">Hatchly</a> is a UK-based design agency running Google Ads campaigns to a <a href="https://webflow.com/" target="_blank" title="Webflow">Webflow</a> landing page. The project involved building a complete, GDPR-compliant analytics and conversion tracking stack from scratch — covering <a href="https://support.google.com/analytics/answer/10089681" target="_blank" title="Google Analytics 4">GA4</a>, <a href="https://ads.google.com/" target="_blank" title="Google Ads">Google Ads</a>, <a href="https://www.facebook.com/business/tools/meta-pixel" target="_blank" title="Meta Pixel">Meta Pixel</a>, and <a href="https://business.linkedin.com/marketing-solutions/insight-tag" target="_blank" title="LinkedIn Insight Tag">LinkedIn Insight Tag</a> — all managed through <a href="https://marketingplatform.google.com/about/tag-manager/" target="_blank" title="Google Tag Manager">Google Tag Manager</a>.

#### What Was Built

**Consent & GDPR compliance.** The foundation of the setup was integrating <a href="https://cookiefirst.com/" target="_blank" title="CookieFirst">CookieFirst</a> with GTM to ensure all tags fire only after a user has given the appropriate consent. This also required implementing <a href="https://developers.google.com/tag-platform/security/concepts/consent-mode" target="_blank" title="Google Advanced Consent Mode V2">Advanced Consent Mode V2</a> to correctly pass consent signals through to Google's ad platforms — ensuring that conversion modelling and audience features continued to function in compliance with EU consent requirements. This included testing the blocking and unblocking behaviour across all tag types and confirming full GDPR compliance across the stack.

**GA4 configuration.** With GTM already in place, I validated and completed the GA4 setup, configured enhanced measurement (scroll depth, time on page, outbound clicks), and created multiple custom events to track submissions on key conversions such as the "Book a Call" button — which redirects to a Calendly booking page. The conversion goal was configured in GA4 and imported into Google Ads for campaign optimisation.

**Google Ads conversion tracking.** I verified that conversion tracking was firing correctly end-to-end, and set up the connection between GA4 and Google Ads for audience sharing and unified reporting. This included confirming the Tracking Template and Final URL Suffix configuration.

**Retargeting audiences.** Retargeting audiences were built across all three platforms — Google, Meta, and LinkedIn — with segments targeting high-intent users (e.g. scrolled 90% of the page, did not convert). Audiences were synced where possible across platforms to create a consistent cross-channel retargeting strategy.

**Meta Pixel and LinkedIn Insight Tag.** Both were implemented via GTM with consent-gated firing rules, and matched retargeting audiences were created in each platform's ad manager to mirror the Google Ads setup.

**Handover documentation.** The project was delivered with full documentation and a Loom video walkthrough covering how the setup works, what fires where, and how to add new events and campaigns independently in the future — giving the Hatchly team full autonomy to extend the setup without needing ongoing support.

#### Tech Stack

- <a href="https://marketingplatform.google.com/about/tag-manager/" target="_blank" title="Google Tag Manager">Google Tag Manager</a>
- <a href="https://support.google.com/analytics/answer/10089681" target="_blank" title="Google Analytics 4">Google Analytics 4</a>
- <a href="https://ads.google.com/" target="_blank" title="Google Ads">Google Ads</a> conversion tracking and audience sharing
- <a href="https://www.facebook.com/business/tools/meta-pixel" target="_blank" title="Meta Pixel">Meta Pixel</a> and Ads Manager retargeting
- <a href="https://business.linkedin.com/marketing-solutions/insight-tag" target="_blank" title="LinkedIn Insight Tag">LinkedIn Insight Tag</a> and Campaign Manager retargeting
- <a href="https://cookiefirst.com/" target="_blank" title="CookieFirst">CookieFirst</a> consent management
- <a href="https://developers.google.com/tag-platform/security/concepts/consent-mode" target="_blank" title="Google Advanced Consent Mode V2">Advanced Consent Mode V2</a>
- <a href="https://webflow.com/" target="_blank" title="Webflow">Webflow</a>
