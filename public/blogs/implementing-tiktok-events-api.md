<img src="/images/blog/tiktok-events-api.png" alt="Implementing TikTok Events API" width="100%">


### Implementing TikTok Events API
Joining the list of vendors branching out into server-side tracking capabilities over the last few years is <a href="https://www.tiktok.com/en/" target="_blank" title="TikTok">TikTok</a>, the short-form video hosting service that has been impressively adding feature after feature to its business suite of tools.

The <a href="https://ads.tiktok.com/help/article/events-api?lang=en" target="_blank" title="TikTok Events API">Events API</a> can be implemented through most server-side tracking tools such as <a href="https://tealium.com/" target="_blank" title="Tealium">Tealium</a> and <a href="https://tagmanager.google.com/" target="_blank" title="Google Tag Manager">Google Tag Manager</a>, along with direct server API integrations using <a href="https://business-api.tiktok.com/portal/docs?id=1739584855420929" target="_blank" title="TikTok Marketing API">Marketing API</a>. The below article will take you through the setup of this implementation using <a href="https://www.commandersact.com/en/products/tag-management/server-side/" target="_blank" title="CommandersAct server-side">CommandersAct's server-side version of TagCommander</a>, and it is advised to do this in parallel with the <a href="https://ads.tiktok.com/help/article/tiktok-pixel?lang=en" target="_blank" title="TikTok pixel">client-side TikTok pixel</a>.

#### Client-Side Changes
If implementing Events API alongside your client-side pixel, it is important to ensure that the client-side TikTok pixel events, and their corresponding server-side events, include a matching Event ID. This will ensure that the events can be deduplicated in TikTok. Without a matching Event ID, the two events will be treated individually, and you will double your event count each time. More information about deduplication can be found <a href="https://ads.tiktok.com/help/article/event-deduplication?lang=en/" target="_blank" title="TikTok Event Deduplication">here</a>. The Event ID should be added to your code using *event_id*, such as in the example below. You will need to ensure that this same event ID value is passed for the server-side event also.

```
<script>
ttq.track('Search',{ 
    query: 'Hats'
},
{event_id: 12345});
</script>

```
#### Server-Side Setup
In the below section, we won't cover off the setting up of client-side <a href="https://www.commandersact.com/en/" target="_blank" title="CommandersAct">CommandersAct</a> tags (a topic for another article), we'll simply cover off the server-side part. CommandersAct provide articles on how to configure this via both <a href="https://community.commandersact.com/tagcommander/user-manual/serverside-v2/facebook-conversion-api/facebook-capi-through-gtm" target="_blank" title="Facebook CAPI through GTM">Google Tag Manager</a> and <a href="https://community.commandersact.com/tagcommander/user-manual/serverside-v2/facebook-conversion-api/facebook-capi-through-web-container" target="_blank" title="Facebook CAPI through web container">TagCommander</a>. You will note that the articles are titled Facebook CAPI but the logic applies for all destinations available in the platform.

Before starting, you should load up <a href="https://www.commandersact.com/en/" target="_blank" title="CommandersAct">CommandersAct</a> and <a href="https://ads.tiktok.com/i18n/login?" target="_blank" title="TikTok Events Manager">TikTok Events Manager</a>. You will need admin access to the relevant TikTok pixel that you are configuring this for.

To get started in <a href="https://ads.tiktok.com/i18n/login?" target="_blank" title="TikTok Events Manager">Events Manager</a>, head to the relevant pixel to set up, then the *Settings* tab and scroll down to *Events API* where you can click *Generate Access Token*. This will provide you with the token, which will then disappear on page refresh, so ensure you make a copy of it. If you have not already, this may also be a good point at which to enable <a href="https://ads.tiktok.com/help/article/advanced-matching-web?lang=en" target="_blank" title="TikTok Advanced Matching for Web">Advanced Matching</a>.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api1.png)

In <a href="https://www.commandersact.com/en/" target="_blank" title="CommandersAct">CommandersAct</a> head to *Destinations* and *Overview*. From here, click *Add Destination*, and then search for TikTok. In the first page of the integration, you will see the below.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api2.png)

You can paste the access token you have generated into the Access Token field. The TikTok Pixel ID can be found from within the pixel code itself, or inside <a href="https://ads.tiktok.com/i18n/login?" target="_blank" title="TikTok Events Manager">TikTok Events Manager</a> under ID at the top of the page. Before moving any further, I would advise adding your Test Event Code at this point to ensure any events that are sent do not impact data if there is anything set up incorrectly. TikTok will not process any events that have a test event code.

To get this from <a href="https://ads.tiktok.com/i18n/login?" target="_blank" title="TikTok Events Manager">TikTok Events Manager</a>, head to the Test Events tab inside the relevant pixel you are working on and scroll down under *Test Server Events* to get your test ID - it is worth noting that this changes per <a href="https://ads.tiktok.com/i18n/login?" target="_blank" title="TikTok Events Manager">Events Manager</a> session, so if you run some testing and come back to it later, you may need to update the Test Event Code. Once you have this, paste it into the Test Event Code field in CommandersAct.

![Tiktok Events API Generating Test Event Code](/images/blog/tiktok/tiktok-events-api3.png)

Back in <a href="https://www.commandersact.com/en/" target="_blank" title="CommandersAct">CommandersAct</a>, under *Advanced Settings*, you can decide the mapping of the ViewContent event that is passed server-side. This was actually a feature that was added after I made a feature request to the incredibly responsive team at CommandersAct, as by default, CommandersAct sends the page_view client-side event to TikTok as the ViewContent event - although as per the <a href="https://ads.tiktok.com/help/article/standard-events-parameters?lang=en" target="_blank" title="TikTok Standard and Custom Events">TikTok pixel documentation</a>, and from speaking to the team there about best practice, it is recommended that this event is used for important pages such as a product page. Personally, I would recommend ensuring that view_item is selected here, although it is dependent on your client-side implementation.

The destination also allows for Smart Mapping - meaning you can update the mapping of parameters sent to <a href="https://www.tiktok.com/en/" target="_blank" title="TikTok">TikTok</a>, such as changing what you want sent for event_id, user_id etc., something that is particularly useful if you are using <a href="https://community.commandersact.com/tagcommander/user-manual/serverside-v2/facebook-conversion-api/facebook-capi-through-gtm" target="_blank" title="Facebook CAPI through GTM">Google Tag Manager</a> to integrate with CommandersAct. Smart Mapping is also a feature that is not yet present for all destinations in <a href="https://www.commandersact.com/en/" target="_blank" title="CommandersAct">CommandersAct</a>.

Click *Save* to move to the next step. Ensure the Data Source is correct in the next tab - this should match the source that you are sending data *into* <a href="https://www.commandersact.com/en/" target="_blank" title="CommandersAct">CommandersAct server-side</a> from. For example, if you were using <a href="https://community.commandersact.com/tagcommander/user-manual/serverside-v2/facebook-conversion-api/facebook-capi-through-gtm" target="_blank" title="Facebook CAPI through GTM">Google Tag Manager</a>, you would need to ensure that is selected as a Data Source.

Now in *Filters*, you want to ensure that the *User Consent Category* matches the same category that the TikTok pixel is managed by. You can also add additional filters at this point such as event_name, if you only want to send particular events to TikTok server-side. If you are using <a href="https://www.commandersact.com/en/" target="_blank" title="CommandersAct">CommandersAct server-side</a> for multiple destinations, it is worth adding the events you wish to send to TikTok as a filter here, because otherwise any new events will automatically send on which could cause issues if there is not a matching client-side implementation, or the correct parameters are not present.

Another thing to note at this point is that the event name filter is applied to the **client-side event name**, not the TikTok server-side event name. For example, if you wanted to filter the event of a user purchasing, the client-side event name is *purchase*, but the TikTok event name is *CompletePayment*. So you need to ensure you use *purchase* as the event name in the filter.

Now, because the Destination will forward all events by default that match the filter you have in place, debugging when first setting this up or using <a href="https://support.google.com/tagmanager/answer/6107056?hl=en" target="_blank" title="Google Tag Manager Preview Mode">Google Tag Manager Preview Mode</a> for changes can be quite difficult without taking preventative measures. What I typically do when first setting up the integration is add an additional filter that will be exclusive to my session. The available filters for this aren't fantastic in <a href="https://www.commandersact.com/en/" target="_blank" title="CommandersAct">CommandersAct</a>, but I find it best to use either user.id (you will obviously need to be logged in and passing a user identifier to CommandersAct for this), or if you have implemented <a href="https://developers.facebook.com/videos/2020/conversion-api-capi-overview/" target="_blank" title="Facebook CAPI">Facebook CAPI</a>, you can use one of the Facebook IDs which can be found in the CommandersAct client-side network call under *integrations.facebook*. The below example shows the *event_name* and *user.id* filters in place. Note that these are **and** conditions.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api4.png)

#### Testing Your Implementation
You can now save the integration and begin testing by performing events on your site. In <a href="https://ads.tiktok.com/i18n/login?" target="_blank" title="TikTok Events Manager">TikTok Events Manager</a>, head back to the *Test Events* tab. Here you can test both client and server-side events. One thing to note when testing for client-side is that it will ask you, rather annoyingly, to scan a QR code. The problem with this, of course, is if you're testing both client-side and server-side events in parallel, so if you're using <a href="https://support.google.com/tagmanager/answer/6107056?hl=en" target="_blank" title="Google Tag Manager Preview Mode">Google Tag Manager Preview Mode</a> for example, you likely won't be doing that on a mobile device. If you want to test both at the same time, scan the QR code on your mobile and share the link back to your desktop PC, where you can then test the client-side events in the same session as your server-side events.

Another important note here is that unlike <a href="https://en-gb.facebook.com/business/help/898185560232180?id=1205376682832142" target="_blank" title="Facebook Events Manager">Facebook Events Manager</a>, the test events do not show if an event has been de-duplicated successfully, and do not show the event ID that has sent as part of the event. An example of the two events can be seen below.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api5.png)

Whilst you can also look inside the event content and will not see an Event ID.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api6.png)

The best way to test this is to review the client-side event ID that is sent to TikTok in the network console, and then use <a href="https://doc.commandersact.com/features/destinations/live-event-inspector" target="_blank" title="CommandersAct Event Inspector">Event Inspector</a> in Commanders Act to verify the event ID sent to TikTok. <a href="https://doc.commandersact.com/features/destinations/live-event-inspector" target="_blank" title="CommandersAct Event Inspector">Event Inspector</a> is also incredibly useful to debug issues that are flagged inside <a href="https://ads.tiktok.com/help/article/test-tiktok-pixel-events-video-walkthrough?lang=en" target="_blank" title="TikTok Test Events">TikTok Events Manager's Test Events</a>, or to view if the event is not being sent as expected/if it gets rejected.

Head to the *Event Inspector* tab, which will look like the below. If you have only set up your own events to pass to TikTok in the filters, then this is a lot easier to use, otherwise you may be looking through hundreds of events trying to find your own.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api7.png)

From here, you can see the payload that is received by CommandersAct and then sent on to TikTok. Click the arrow next to the relevant request (you will often see on the first line that it will say the event name next to "event"). You can see the full payload in Table or JSON format from here, but I actually find it easier to copy the JSON request into a platform such as <a href="https://visualstudio.microsoft.com/" target="_blank" title="Microsoft Visual Studio">Visual Studio</a> for easier visibility. Simply click JSON and then Copy to clipboard.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api8.png)

You can then easily see all of the information of the payload, and investigate any issues if they arise, such as in the image below. Some of the values have been removed from parameters in screenshots.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api9.png)

The first part of the payload is the data that is sent to CommandersAct. An example of how to read this is to look at line 14 which is the event_name of view_item - this is what is sent client-side. You can scroll down and see all parameters such as session IDs, user parameters, item parameters etc.
Further down, you can then see the request made to TikTok. You can see the request starts from line 116 below. You can see on line 125 that the event is sent as ViewContent - a simple example of seeing the difference between data sent in and data sent out.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api10.png)

A quick way to find issues with the integration is to scroll further down to the response section, shown from line 160 onwards. This is typically where you will find information on issues. In the below example we've got a statusCode of 200, which is a good sign. Typically, issues will show in the body (line 181), which will often give warnings or errors here if there are any. As per the below image, all is working as expected.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api11.png)

Once we're happy with the integration, we can go ahead and enable this. You'll need to go back to Filters and remove any reference to your session/User ID, and then go back to Settings and ensure that the Test Event Code is removed also.

#### Verifying Post-Deployment
After 24 hours, you should be able to use <a href="https://ads.tiktok.com/i18n/login?" target="_blank" title="TikTok Events Manager">TikTok Events Manager</a> to validate the integration. The graph at the top of the page enables you to easily see the quantity of events received from the browser, server and a combination of the two. This is an easy way to quantify the success of deduplication, and the number of additional events you are receiving from the server-side.  If your integration has been successful, you should see Server & Browser under the Connection Method of the events that you have set up. 

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api12.png)

Click *View details* next to the relevant event and then *Deduplication* where you can see the deduplication details of each event. If this is below an acceptable threshold or issues are identified, they will be shown here.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api13.png)

For the Complete Payment event, you are also able to see the <a href="https://ads.tiktok.com/help/article/advanced-matching-web?lang=en" target="_blank" title="TikTok Advanced Matching for Web">Advanced Matching</a> health, such as in the image below.

![Tiktok Events API Generating Access Token](/images/blog/tiktok/tiktok-events-api14.png)

And that's it - that's all you need to successfully implement <a href="https://ads.tiktok.com/help/article/events-api?lang=en" target="_blank" title="TikTok Events API">TikTok Events API</a>!