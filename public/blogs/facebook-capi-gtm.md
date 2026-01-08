<img src="/images/blog/fb_capi6.jpg" alt="Implementing Facebook Conversions API Using Google Tag Manager Server-Side" width="100%">

### Implementing Facebook Conversions API Using Google Tag Manager Server-Side
While most marketing pixels now have their own server-side equivalents to mitigate against the decline in pixel effectiveness, Facebook (or Meta if you prefer) were one of the first to set the trend for this with <a href="https://en-gb.facebook.com/business/help/2041148702652965?id=818859032317965" target="_blank" title="About Conversions API
">Facebook Conversions API</a>. Despite being aware of the benefits, many brands have still yet to implement the server-side solution. The below guide takes you through how to set this up using <a href="https://tagmanager.google.com/" target="_blank" title="Google Tag Manager">Google Tag Manager (GTM)</a> server-side.

If you are starting completely from scratch, I would advise reading my previous articles on <a href="https://timhutton.co/blogs/google-tag-manager-cloud-run" target="_blank" title="Implementing Google Tag Manager Server-Side Using Cloud Run
">configuring Google Tag Manager server-side</a>, and <a href="https://timhutton.co/blogs/google-tag-manager-server-side-data" target="_blank" title="Sending Data To and From Google Tag Manager Server-Side Using GA4 Tags
">how to send data to and from a server-side container</a>. The below article will assume you have already followed these steps, along with already having the Facebook pixel implemented. See <a href="https://en-gb.facebook.com/business/help/952192354843755?id=1205376682832142" target="_blank" title="How to set up and install a Meta pixel">How to set up and install a Meta pixel</a> for more information on configuring this part.

#### Starting with Variables
As per the <a href="https://developers.facebook.com/docs/marketing-api/conversions-api/guides/gtm-server-side/" target="_blank" title="Conversions API for Server-Side Google Tag Manager (GTM)">Meta for Developers</a> documentation, there are a few parameters that need adding to your client-side Facebook pixel and the GA4 tag which is used to send data into the server-side container.

These include the Meta Browser and Click IDs that are set as cookies by the pixel. If you have your server-side tracking set up to use a custom domain that is first-party, then these values are actually passed by default. However, for the purposes of this article, we are going to configure these. In your GTM client-side container, head to *Variables > Create > 1st Party Cookie*, and from here you want to create a variable to track the value of the _fbp and _fbc cookies, so create a variable for each.

The way that we can get Facebook CAPI to work on both client and server-side simultaneously is to use **deduplication**. This means that we are able to recover events that potentially aren't received by the pixel, and can send the same event from both client and server-side without it being counted twice.

The best way to implement deduplication is to use a matching **event ID** for client and server-side events. This should be unique to the user and that particular event, but must be sent as the same value for both the client and server-side event. You can find out more about deduplication <a href="https://en-gb.facebook.com/business/help/823677331451951?id=818859032317965" target="_blank" title="About deduplication for Meta pixel and Conversions API events">here</a>.

There are many ways that we can configure an event ID. You can use a timestamp-based value, add a unique event ID to your data layer, use a random number generator, or use Facebook's recommendation: a combination of gtmData values, which we are going to do here. Head to **Variables**, ensure that *Container ID* is enabled from within Built-In Variables, and then create a user-defined variable using Custom JavaScript, and copy the below.

```javascript
function() {
var gtmData = window.google_tag_manager[{{Container ID}}].dataLayer.get('gtm');
return gtmData.start + '.' + gtmData.uniqueEventId;
}
```

> If you are using a time-stamp based ID, be very careful to ensure that this is the same for your client and server-side events.

Once created, we can now add this to our client-side Facebook pixel, such as in the image below. You will need to ensure that this is sent as **eventID**.

![Adding an Event ID to your client-side Facebook pixel](/images/blog/fb_capi1.jpg)

Facebook also recommends sending as much first-party data as possible (of course they do!) as part of their Event Match Quality (EMQ). Now, this article is not going to cover what you should and should not send, however, will show you how you can. Always liaise with your internal compliance teams when it comes to data sharing with third-parties.

In the image shared above of our Add to Cart event, you may have noticed that there was no user data being shared. That is because it is recommended to be included in the core script within the <a href="https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching" target="_blank" title="">init function call</a>, rather than at event level. An example of this can be seen below which shares a hashed email and an internal ID to the em and external_id parameters.

```javascript
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '123456789', {
  'em':{{DL - SHA256 Email}},
  'external_id':{{DL - Internal User ID}}
});
</script>
<!-- End Facebook Pixel Code -->
```

Now that we have the event ID in the client-side Facebook pixel tag, we need to ensure that the client-side GA4 tag, which is used to send data into our server-side container, is set up with all of the required variables. 

If you don't have a Google tag currently set up, select **New Tag** and select **Google Tag**. Typically, you would put your GA4 tracking ID in Tag ID but *techinically*, you can actually put any value. Ensure *server_container_url* matches the URL of the server-side container, as this is the parameter needed to send the data into your container, and have this fire on all pages using the trigger that you would typically use for a page view.

If you wish to share user data with Facebook CAPI, you will need to set the *first_party_collection* to true. Now under *Shared Event Settings* in your Google configuration tag, click **New Variable** in the dropdown to add the parameters that you wish to send with this tag. In this you need to add the cookies that we created earlier, along with any user properties such as hashed email, external ID etc., under Google Analytics User Properties. These should match the variable values used on the pixel, and need to match the name required by GA4 as shown in the table <a href="https://developers.facebook.com/docs/marketing-api/conversions-api/guides/gtm-server-side/" target="_blank" title="Conversions API for Server-Side Google Tag Manager (GTM)">here</a>. In the example below we use email and external ID, using the names required, which is what we have used in the pixel. Once created and saved, you should see this newly created variable under **Event Settings Variable** in your Google tag. 

![Google Tag Event Settings](/images/blog/fb_capi2.jpg)

You should not add your event ID here as this needs to be added to individual events, otherwise it will be the same event ID across all events on a single page. You should also add your event ID in the GA4 tag using the *event_id* parameter, **not** the *x-fb-event_id* parameter that is mentioned in the Facebook documentation.

#### Create Events to Send Server-Side
Now you can go ahead and set up the individual GA4 event tags on the client-side container, adding any events that you wish to track. Typically, these will match the events that you have on your client-side Facebook pixel. Given we used add to cart in our earlier example, that is what we will use here. Create a new tag, select *Google Analytics: GA4 Event*, making sure the Measurement ID matches the one used in your Configuration tag earlier. For the event name, you can use either the Meta Standard Event Name, or the Google Analytics Event Name. If you plan on using GA4 server-side, or any other server-side integrations for that matter, I'd advise using GA4 event names as this will make it easier in future. In the example, we provide the name *add_to_cart* and add the *event_id* parameter. You will also now want to add the parameters that you are passing on such as product IDs etc., and, if relevant, any additional user parameters. If these are already in the configuration settings variable of the Google tag, you do not need to add these again.

![Google Analytics 4 Server-Side Add To Cart Event Including Event ID](/images/blog/fb_capi2_carteid.jpg) 

#### Testing Collection
We are now in a position to test that we are sending data successfully through our relevant tags. To do this, open Preview Mode inside your Google Tag Manager client-side container. Once the website has loaded, open the network console and search for your Facebook pixel - this can typically be done just by searching for "facebook". As we have multiple events on the website that we are testing in the image below, I have searched specifically for the *AddToCart* event by including "add" in my search. You firstly want to check simply that the pixel event is firing, and if so, check the parameters are sending successfully. The key one to check here is the *Event ID* which sends through the parameter **eid**.

![Network console showing Event ID successfully passing in eid parameter of the Facebook pixel](/images/blog/fb_capi2eid.jpg)

It's now time to test what you are sending to your server-side container, which will then be used to send the data on to Facebook. You can either test this within client-side Preview Mode, within the network console, or in Preview Mode of the server-side container, which is what we have done in the image below. With Preview Mode still open in your client-side container, open Preview Mode in your server-side container and trigger the relevant event on your site. You should then see a list of events on the left-hand side. Click on the event that you triggered, and you will then see an *Incoming Request* from */g/collect* - which is the GA4 tag that you have configured to pass data into this container. Within this payload, simply search for the parameter (or parameters) that you are testing and check that these are what you expect. The key thing to check here is that the value of your Event ID matches the value that was being passed client-side for the same event.

![Testing Event ID successfully being received by your server-side Google Tag Manager container](/images/blog/fb_capi3.jpg)

If we have been successful up to this point, it is time to configure things within the server-side container. We will start by creating a *Trigger* which shall be used to fire a server-side call to Facebook when a user adds a product to their cart. Remember, you need to use the name of the event that is triggered in the GA4 client-side tag, not the name of the data layer event. So here we will select *Custom Event*, use the Event Name of *add_to_cart* and set it to fire on *Some Custom Events* when the *Client Name* equals GA4. You will need to ensure that this matches the Client Name that you have configured, although this is called GA4 by default. You will want to set this up for each event that you want to send to Facebook.

![Configuring Triggers Within your Google Tag Manager Server-Side Container](/images/blog/fb_capi5.jpg)

Now that we have the Triggers set up, it's time to add the tags to send the data to Facebook. Head to *Tags* and then select *New*, followed by *Discover more tag types in the Community Template Gallery*. You'll want to search for **Conversions API Tag** by *facebookincubator*. There are a number of other Facebook CAPI templates there, including the excellent stapeio template which I have used previously, but for now, we're going to keep it official. The upside of using the facebookincubator template is that it is pre-built to parse GA4 events and parameters into the format that Facebook requires, so you don't have to do any re-mapping if you have set up the collection tag correctly.

You will need to add your pixel ID, which will match the ID of your client-side pixel tag, along with an API Access Token. To get this, head to <a href="https://business.facebook.com/events_manager2" target="_blank" title="About Conversions API
">Facebook Business Events Manager</a>, select the pixel in question, click the *Settings* tab and then under *Conversions API* click on **Generate Access Token**. You'll need to keep a copy of this as it will not be shown to you again. Set *Action Source* to *Website*.

![Configuring the Facebook Server-Side Tag](/images/blog/fb_capi4.jpg)

In order to efficiently test the server-side events and see if they are working correctly, you'll need to add a Test Event Code. This will allow you to see the events in question within the Facebook platform whilst testing. Head to the *Test Events* tab where you will be given a *Test Event Code*. Add this back in Google Tag Manager (**Note:** *You must delete the Test Event Code before publishing*), and add any triggers to the tag in question.

You'll now want to re-open your server-side Preview Mode (with client-side Preview Mode still running). Trigger the event you wish to test on your website, and you should see the event showing within Test Events in Facebook, such as in the image below. The key thing that you want to check here is whether the event has been successfully de-duplicated - which will happen if you have used the same Event ID for the event. The Facebook UI is rather helpful in that it shows you the two events grouped together, with a *Deduplicated* badge added to the event if this has happened successfully. If you are not seeing your event here, then you should check in server-side Preview Mode that there is an *Outgoing Request* when the relevant event is triggered.

![Testing Events Using Facebook Business Manager](/images/blog/fb_capi6.jpg)

You can then dive into each event to see the full parameters that are sent. This is a great way of reviewing any differences between your client and server-side tags, ensuring not only that you send the same parameters, but also that you send the same values in those parameters. As we have just been testing the basics, we have not implemented any item parameters in our server-side event, so this is a great example of Facebook showing you the differences between the two events. It is worth noting that Facebook will always prioritise the client-side event, so if any event is to be deduplicated, it will be your server-side event.

![Validating Event Parameters inside Facebook Business Manager Test Events](/images/blog/fb_capi7.jpg)

That's it - success! When you are ready to go live, you should publish your client-side container first, followed by your sever-side container, ensuring that you have removed the *Test Event Code* from each server-side tag.

I hope you find the article useful. If you have any questions or comments on the above article, or need any assistance in setting up Facebook Conversions API, please do not hesitate to reach out. I can be found on <a href="https://www.linkedin.com/in/timhuttonco" target="_blank" title="Tim Hutton LinkedIn
">LinkedIn</a>, or you can email me at <a href="mailto:me@timhutton.co" title="Tim Hutton Email">me@timhutton.co</a>.