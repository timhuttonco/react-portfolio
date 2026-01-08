<img src="/images/blog/gtm-server-side-ii.png" alt="Using Medallia Digital Experience Analytics Real-Time Triggering" width="100%">


### Using Medallia Digital Experience Analytics Real-Time Triggering
I have recently had the pleasure of diving back into the [Medallia Digital Experience Analytics (DXA)](https://www.medallia.com/products/digital-experience-analytics/) platform as part of my work with Experiement Management Experts [Higher Oak Consulting](https://higheroak.com/).

It has been great to see the progress that [DXA](https://www.medallia.com/products/digital-experience-analytics/), formerly known as Decibel before [acquisition by Medallia](https://www.medallia.com/press-release/medallia-to-acquire-decibel-leader-in-digital-experience-analytics/), has made over the last few years, in particular with the launch of its [Real-Time Web SDK](https://developer.medallia.com/medallia-dxa/docs/real-time-web-sdk-new), which allows clients to utilise the Digital Experience Score (DXS) and all of its accompanying behaviours as triggers during a session. The beauty of this is that you can effectively change the course of a users session based on these triggers. For example, if a user is clearly struggling with navigation such as going back and forth between the same pages, or a set of unresponsive multi-clicks are perhaps implying an issue on site, you could trigger live chat to support the user, put them into the other version of an A/B test if they happen to be in one, or even trigger an event to your email marketing tool to contact them about their issue and potentially offer a discount. There are countless opportunities opened up by this feature!

You can familiarise yourself with DXS, its pillars and behaviours [here](https://www.medallia.com/products/digital-experience-analytics/behavior-intelligence/)

From the [Medallia documentation](https://developer.medallia.com/medallia-dxa/docs/introduction), it appears that this is currently only available on web, but word on the street is that there are plans for this to come to app in the future.

The below guide takes you through setting it up and testing using [Google Tag Manager](https://tagmanager.google.com/), although the SDK is completely Tag Manager agnostic, along with some use cases that can be utilised with this.

#### Getting Started
Before starting, I would advise installing the Digital Experience Analytics (DXA) browser extension, which can be found in [Chrome](https://chrome.google.com/webstore/detail/decibel/iadffjigiclimjimlfcpfedjomjapnhf?hl=en-GB) and [Firefox](https://portal.decibel.com/firefox/decibel_insight_ext.xpi?_=1651864638603). This will enable you to see in real-time when the scores are being updated or if behaviours are being detected. Full instructions on installing the extension and enabling real-time DXS logging can be found [here](https://developer.medallia.com/medallia-dxa/docs/debugging-and-testing), where the below gif is also taken from.

![DXA Real Time](/images/blog/dxa-real-time/dxa-real-time-2.gif "Console log warning when trying to utilise real-time without it being enabled on the account")

The [Real-Time Web SDK documentation](https://developer.medallia.com/medallia-dxa/docs/real-time-web-sdk-new) implies that you need to enable the `decibelInsight.enableRealTime()` JavaScript end-point, however, when I first attempted to test this, I received the following console log warning which would imply that there is something that needs to be enabled first. You can also see where I have attempted to trigger it too "early" in GTM in the console error.

![DXA Real Time](/images/blog/dxa-real-time/dxa-real-time-1.png "Console log warning when trying to utilise real-time without it being enabled on the account")

When discussing this with the team at Medallia, they were required to enable a setting on the property that I was using, so it is likely that you will need to speak with your Customer Success Manager to get this feature enabled. Once it is enabled, you will still need to utilise the .enableRealTime() end-point to turn on this feature on the page.

> At this point when using [GTM](https://tagmanager.google.com/), it's important to note that you cannot simply set a trigger for the script to fire *after* the DXA base script as there may still be occassions where the decibelInsight variable is not set yet. With this in mind, it is best to wrap any scripts in a ready function, which you can see below, along with as part of all code examples.

```
<script type="text/javascript">
function decibelInit() {
  // code to run on ready goes here!
  decibelInsight.enableRealTime();
}
if (typeof window.decibelInsight !== 'undefined') {
  window.decibelInsight('ready', decibelInit);
} else {
  window._da_readyArray = window._da_readyArray || [];
  window._da_readyArray.push(decibelInit);
};
</script>
```

You can choose to add additional code for subscriptions and triggers inside this tag, or alternatively can set up in separate tags.

#### Available Subscriptions
Now that we have the real-time function enabled, we now have to choose what we want to subscribe to. Subscriptions are defined as the type of data you want to listen out for on a page, and the choices are very flexible - ranging from all updates of scores and behaviours, individual [behaviours](https://developer.medallia.com/medallia-dxa/docs/behavior-signals) such as [reading](https://developer.medallia.com/medallia-dxa/docs/behavior-signals#reading), [comparison browsing](https://developer.medallia.com/medallia-dxa/docs/behavior-signals#comparison-browsing) and [multi-click behaviour](https://developer.medallia.com/medallia-dxa/docs/behavior-signals#multi-click---responsive), or [individual pillars](https://developer.medallia.com/medallia-dxa/docs/scores) of the Digital Experience Score.

If you wanted to subscribe to all real-time updates, you would trigger the following:

```
document.addEventListener('decibel.ks.realtime', function(e) {
  console.log(e.detail)
});
```

The below example, meanwhile, starts with us using the ready function mentioned earlier, and pushes to the data layer every time there is an update to a [score](https://developer.medallia.com/medallia-dxa/docs/scores).

```
<script type="text/javascript">
function decibelInit() {
  decibelInsight.enableRealTime();
  document.addEventListener('decibel.ks.realtime', function(e) {
  dataLayer.push(e.detail);
});
}
if (typeof window.decibelInsight !== 'undefined') {
  window.decibelInsight('ready', decibelInit);
} else {
  window._da_readyArray = window._da_readyArray || [];
  window._da_readyArray.push(decibelInit);
};
</script>
```

This will mean that event listener is triggered on any score change, or when a behaviour is detected. An example of the output can be seen below, where we......

Altenatively, you can subscribe to just scores (decibel.ks.realtime.dxp), just behaviours (decibel.ks.realtime.behaviours) or even specific scores and behaviours, such as only the Technical Experience Score (decibel.ks.realtime.txs) a Multi-Click Responsive (decibel.ks.realtime.behaviours.unresponsiveMulticlick).