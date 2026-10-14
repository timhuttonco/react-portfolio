---
title: "Google Tag Manager's New Destination Tags and Optimisations"
description: "If you manage a Google Tag Manager container, you've probably got a GA4 tag in there, maybe a Google Ads tag, maybe Floodlight. Each one has, until now, loaded its own copy of the Google tag (gtag.js) to actually get data to Google. As of October 12, 2026, that extra script load is going away for containers that opt in."
image: "/images/blog/gtm-optimize-container.png"
---

<img src="/images/blog/gtm-optimize-container.png" alt="Google Tag Manager's New Destination Tags and Optimisations" width="100%">

### Google Tag Manager's New Destination Tags and Optimisations

If you manage a <a href="https://marketingplatform.google.com/about/tag-manager/" target="_blank" rel="noopener">Google Tag Manager</a> container, you've probably got a <a href="https://marketingplatform.google.com/about/analytics/" target="_blank" rel="noopener">GA4</a> tag in there, maybe a <a href="https://ads.google.com/home/" target="_blank" rel="noopener">Google Ads</a> tag, maybe <a href="https://marketingplatform.google.com/about/campaign-manager-360/" target="_blank" rel="noopener">Floodlight</a>. Each one has, until now, loaded its own copy of the <a href="https://support.google.com/tagmanager/answer/11994839?hl=en" target="_blank" rel="noopener">Google tag</a> (`gtag.js`) to actually get data to Google. As of October 12, 2026, that extra script load is going away for containers that opt in.

Per Google's own release note: "This release introduces a new capability to Google Tag Manager containers to send data directly to Google measurement products. This results in faster website performance, improved data collection, centralised settings management and user access directly in your GTM container." Previously, that extra `gtag.js` load carried its own settings and permissions, separate from the container, which Google says "sometimes made troubleshooting difficult, and could result in fragmented diagnostics."

October's release note confirms this is now live under the name "destination tags," and <a href="https://www.simoahava.com/analytics/optimized-tagging-experience-google-tag-manager/" target="_blank" rel="noopener">Simo Ahava's</a> (brilliant as always) hands-on walkthrough of the actual UI adds detail Google's own pages don't spell out.

#### What a Destination Tag Actually Is

Google's own benefits list, quoted directly:

* Better tag performance: Send data directly to your Google destinations without loading gtag.js.
* Easier settings management: Configure your container settings in one location with the new Settings tab.
* Simplified team access: Promote better visibility and collaboration across Google products.

The container now holds the destination's settings directly, rather than loading a separate script that carries its own. Per Google's own destinations page, four destination types are currently supported: a GA4 web data stream, a Google Ads account, a Floodlight configuration, and a Merchant Center conversion source. Your existing event tags and triggers aren't affected. Google is explicit about that: "Your event tags and triggers that you have set are maintained when you upgrade."

#### How the Migration Actually Runs

Google documents two paths, depending on whether your Google tags already share identical settings.

If every Google tag in the container already has the same settings, you can go straight to the simpler flow. There are three ways into it: click **Review details** in the Overview page's banner (at the time of writing not all containers have this banner yet), select a destination from the Overview page's map view and click **Get Started**, or go to the Settings page, find the "Google Destinations" section, hover over "No" in the "Optimized" column, and click **Get Started** from the popup.

If your Google tags have conflicting settings, the Overview page banner instead offers **Get started**, which walks you through choosing and confirming which tags' settings to use during consolidation.

Either way, the remaining steps are the same:

1. (Optional) Click **Preview changes** to see everything that will change in your workspace.
2. Click **Add to workspace** to consolidate your Google tags into the container.
3. Test the change in Preview mode.
4. If something's wrong, undo it in your workspace, or roll back to a prior version if you've already published.
5. Click **Submit** to publish.

![Google Tag Manager's Destinations Section](/images/blog/gtm-destinations.png)

#### Permissions Aren't Automatic, and They Aren't Versioned

This is the detail most worth getting right, and it's more specific than it first sounds. Google's own text: "Permissions are not versioned. Google Tag Manager admins specify the level of access each destination has to their container during the optimisation." The admin running the migration chooses the access level at that point. It isn't something that happens to you by default.

"Not versioned" matters separately. If you later roll back to an earlier container version, that rollback won't undo a permission change you made during optimisation. Permissions sit outside normal version history. You adjust them at any time, separately, in the External Account Links section of the container's admin settings.

Simo Ahava's own testing adds a sharper point here that Google's documentation doesn't spell out as plainly: in his walkthrough, linking a destination granted Read access to the container to users who already had access to that destination account, and the access only ran in that one direction. Treat that as a real, tested behaviour worth checking for yourself in your own container during the migration, rather than something Google's pages confirm in writing.

#### The Google Tag Has Its Own, Separate User Management

This is a different permission layer from the one above, and easy to mix up. The Google tag itself, configured from inside GA4, Google Ads, or Campaign Manager 360 rather than from GTM, has its own Admin tab. Per Google's documentation, this "let[s] you manage user access to your tag settings separately from access to your other products." That controls who can edit the Google tag's settings. It has nothing to do with who can see your GTM container.

Worth noting too: the Google tag covers GA4, Google Ads, and Campaign Manager 360 specifically. It's described as "currently only accessible and configurable from Google Ads, Google Analytics, and Campaign Manager 360." The fourth GTM destination type, Merchant Center conversion source, sits on the container side rather than being a product with its own Google tag screen.

#### What Simo Ahava's Walkthrough Adds

A few pieces of the actual experience don't show up in Google's own pages, at least not yet, but come from Simo's hands-on use of the feature.

The old Google Tag type is marked Legacy once you migrate, alongside the Conversion Linker, whose job the new destination tags take over. Shared settings at the container level set a ceiling for every linked destination. A destination tag can make its own settings stricter than the shared baseline, but not looser. Preview mode has a new "Hits sent" tab, useful for the specific case where a tag looks like it fired but the data never reached the destination, plus a deferred-hit icon marking a hit that's waiting on consent before it sends.

#### Consent and Remarketing Data

Google's "About the Google tag" documentation repeats a compliance note worth keeping in view, quoted directly: "If you haven't obtained users' consent for the collection, sharing, and use of personal data for personalisation of ads where legally required, be sure to deactivate the collection of remarketing data." That's not new to this release, but it's worth rereading in the same breath as a migration that's about to centralise your consent-relevant settings in one place. Centralising a setting makes it easier to manage. It also means getting it wrong once can affect every destination linked to it, not just one tag.

#### A Second Change Is Coming, but Not Yet Live

Google's documentation on the optimise page includes a forward-looking line, repeated twice: "We will soon also update the Google tag (gtag.js) to include all the capabilities of Google Tag Manager. Websites that only use the Google tag now have the ability to use the existing UI-driven tagging features, debugging, and version control that make GTM such a powerful tool."

That's a different audience than the destination tags release above. It's aimed at sites running only a bare `gtag.js` snippet, with no GTM container installed at all. When it ships, those sites would get GTM's UI-driven tagging, debugging, and version history, without actually adding GTM. It hasn't happened yet. Worth watching for, nothing to act on today.

#### If You Already Optimised Your Container in August

The August version of this feature consolidated Google tags into the container and skipped the extra `gtag.js` load. If you migrated back then, you already have most of the performance benefit. What's confirmed as new since then, per Google's own pages, is the "destination tags" naming and the Settings page's "Google Destinations" section with its Optimised column. What Simo's walkthrough adds on top, the Legacy tag marking, the stricter-only settings inheritance, and the updated Preview mode, is also worth a look even if you don't need to redo anything.

#### What to Do About It

Before running the migration, decide which tag's settings should win if your existing Google tags don't already match. That decision happens either way during the process, so make it deliberately rather than by default. Check who has access to each destination account you're about to link, and set the access level you actually want during the optimisation flow itself, since Google's documentation is explicit that this isn't handled automatically and isn't covered by rolling back a container version afterward.

Test in Preview mode before publishing, same as any other GTM change. If your container runs server-side as well as client-side, this affects how your browser-side tags reach Google.
