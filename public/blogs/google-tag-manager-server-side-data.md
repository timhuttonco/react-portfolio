<img src="/images/blog/gtm-server-side-ii.png" alt="Sending Data To and From Google Tag Manager Server-Side Using GA4 Tags" width="100%">


<a href="" target="_blank" title="">

### Sending Data To and From Google Tag Manager Server-Side Using GA4 Tags
In my previous <a href="../blogs/google-tag-manager-cloud-run" target="_blank" title="Implementing Google Tag Manager Server-Side Using Cloud Run
">Google Tag Manager (GTM) article</a>, we looked at how to set up a server-side container, and how to run this container using <a href="https://cloud.google.com/run" target="_blank" title="Cloud Run">Google Cloud Run</a>. Now that we have the container in place, the next step is to send data to and from there, just like we would with a client-side container.

#### Configure A Client-Side Google Analytics 4 Tag To Send Data To A Server-Side Container
To send data in, you first need to set up a **Client** in your server-side container. It is worth noting that you will see <a href="https://support.google.com/analytics/answer/2790010?hl=en" target="_blank" title="Universal Analytics">Universal Analytics</a> and <a href="https://support.google.com/analytics/answer/10089681?hl=en" target="_blank" title="GA4">GA4</a> already having been set up as Clients – these are enabled by default and are often the simplest way of sending data into the container, and the below article will make use of the GA4 tag. We will make use of the *Google Tag Manager: Web Container* in a later article, along with covering serving GTM from your own domain.

We will begin in our *client-side container* which will be used to deploy the initial tag onto our website in order to send data into our *server-side container*. In **Tags**, select New to add a Tag as you would usually do so. In this example, we are going to use a GA4 tag for both the Configuration and Page View. In *Tag Configuration*, select **Google Analytics: GA4 Configuration**.

![Begin by adding a GA4 Config Tag on your client-side container](/images/blog/server-side/ii/gtm-server-side-ii-1.png)

Now, as we want to send the Configuration and a Page View at the same time, we ensure that **Send a page view event when this configuration loads** is enabled. The important part here is to also ensure that **Send to server container** is enabled – this will fire the tag on your website, and send the data into your server-side container.

> **Note:** If you want to run client-side and server-side GA4 at the same time, or want to utilise the *Send to server container* feature to send data to a platform other than Google Analytics, you must have a *separate* GA4 tag configured inside your client-side container. You cannot run client-side and server-side from the same tag. 

With *Send to server container* enabled, you will now see a *Server Container URL*. This is the URL of the server that we set up previously when creating the server-side container. You can either find this inside Cloud Run or in *Container Settings* within the Admin section of your server-side container. In the below example, we have added the *Measurement ID*, *Server Container URL* and an example parameter that we can view when testing. We have also set this to trigger on the All Pages trigger. For the purpose of this test, we will simply use the basic Page View tag and trigger, however, in future articles, we will cover using events and variables in more detail.

![GA4 Configuration Tag with Send to server container enabled](/images/blog/server-side/ii/gtm-server-side-ii-2.png)

With the Configuration tag enabled, you can now create any events and link them to the Configuration tag to ensure that these are also sent to the server-side container, such as in the example below. You will notice that you do not have to put in the Server Container URL in each event tag.

![Additional GA4 event tag linked to server-side configuration tag](/images/blog/server-side/ii/gtm-server-side-ii-3.png)

#### Using Preview Mode To Validate Sending Data To Server-Side
As usual when working with GTM, you can use Preview Mode to test the data that is being sent by clicking *Preview* from within your client-side container. As below, we can see that our Configuration tag has fired as expected, and we can also see all of the data that is sent along with it such as the "first_parameter" that we set up earlier.

![GA4 tag firing as expected in Preview Mode](/images/blog/server-side/ii/gtm-server-side-ii-4.png)

Now when we test on the live website to see the tag firing as expected, you will notice that the server-side GA4 tag is served from the *Server Container URL* that you added earlier, rather than the usual analytics.google.com domain. This is the URL that all of the GA4 server-side tags will be deployed from and also makes it easier to distinguish between client-side and server-side when testing in the network console. We will cover serving GTM from a custom domain in a future article.

![GA4 tag firing on website with server domain](/images/blog/server-side/ii/gtm-server-side-ii-5.png)

As we have now established that the tag is firing as expected on the web page, we need to verify that this data is passing as expected into our server-side container. Simply head to your server-side container and select **Preview**. Keep the client-side Preview also open and perform some actions on the website to send data. You will start to see the left-hand timeline column populate with events as these are fired, as seen in the image below. 

> It is important to note that the event names you see here are the event names you are passing from the GA4 tags, not the name of data layer events as you would see on the client-side preview. These GA4 event names are what you will also need to use for **Triggers** when setting these up in your server-side container.

Just like in the client-side Preview Mode, you can see the Tags that are fired on any event, along with the Variables that are set up in GTM server-side, and the Event Data itself that is passed in.

There are a few things to note at this point. Currently, no tags fire from any of these events. This means that although I am firing a GA4 tag on the website, no data is actually being sent to GA4 until I set this up in the server-side container.

![Google Tag Manager Server-Side Preview Mode](/images/blog/server-side/ii/gtm-server-side-ii-6.png)

We can also select the **Event Data** tab to see all of the data that was passed into the server-side container with this event. This is a good way to test that variables have passed in as expected. In the below example, we can see that my *first_parameter* has passed in.

![Google Tag Manager Server-Side Preview Mode](/images/blog/server-side/ii/gtm-server-side-ii-7.png)

However, when we look at the **Variables** tab in the below image, we cannot see this first_parameter. This is because, similar to client-side, in order for a Variable to be modified in your container, you need to create this as a Variable in the container itself. You can see Event Name because this is a *Built-In Variable*.

> Note: If you do not want to modify any Variables and are only passing data straight on to GA4, you do not actually need to set up the Variables inside the server-side container. When adding the GA4 tag, you can simply select **All** from *Default Parameters to Include*, and all Variables will be included in the GA4 server-side request.

![Google Tag Manager Server-Side Preview Mode](/images/blog/server-side/ii/gtm-server-side-ii-8.png)

#### Sending Data From Google Tag Manager Server-Side to GA4
After validating that data is coming into our server-side container as expected, the next step is to send data from the container into your relevant platform, in this case, GA4. This is actually quite a straightforward step if you want to forward everything that you send from the client-side tag.

Simply go to *Tags* and then *New* in your Server-Side Container. From **Tag Configuration** select *Google Analytics: GA4*. You can leave the **Measurement ID** blank if you have already configured it in your client-side tag. Similarly, as per the image below, if you want to forward on all parameters, you simply ensure that *All* is selected from **Default Parameters to Include** and you do not then have to create Variables for each parameter that you are sending. Neat! You can also then use the **Parameters to Exclude** rows to prevent parameters being sent to GA4, and can do the same for User Properties. In this example, I am firing the tag on the All Pages trigger.

![Configuring your GA4 server-side tag](/images/blog/server-side/ii/gtm-server-side-ii-9.png)

#### Testing Data Being Sent from GTM Server-Side
To test this is working as expected, we again open Preview Mode for both our client-side and server-side containers. In the server-side Preview Mode under Tags for the particular event, in this case page_view, we can see the GA4 tag shown under **Tags Fired**.

![Google Tag Manager Server-Side Preview Mode](/images/blog/server-side/ii/gtm-server-side-ii-10.png)

We can then click on the relevant tag to see the status of this and if it has fired as expected. Debugging is a bit trickier on server-side Preview Mode as you do not get the full list of parameters sent in a neat format like you do on client-side. Instead, you have to look at the **Outgoing HTTP Requests from Server** to see exactly what has been sent. This will look very similar to the calls that you will see made in the network console by GA tags on client-side, and allows you to see all of the parameters that get sent to GA, or your server end-point of choice, along with the Response code given by the receiving server.

![Google Tag Manager Server-Side Preview Mode Reviewing Tag Details](/images/blog/server-side/ii/gtm-server-side-ii-11.png)

Because GTM Preview Mode automatically adds a debug flag to your GA4 calls, you can also use <a href="https://support.google.com/analytics/answer/7201382?hl=en" target="_blank" title="[GA4] Monitor events in DebugView">DebugView</a> in GA4 to test this is sending as expected. Simply head to **Admin** in GA4 and then **DebugView** where you will be able to see the data being sent as part of your session. We can see here that my first_parameter is sent on to GA4 even though I have not configured it in my server-side container, or added it to the GA4 server-side tag configuration, because we selected to forward all parameters.

![Using GA4 DebugView to validate data](/images/blog/server-side/ii/gtm-server-side-ii-12.png)

We can now confirm that we are successfully sending data from our website into Google Analytics 4 via server-side calls!