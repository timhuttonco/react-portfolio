<img src="/images/blog/proxyman.png" alt="Using Proxyman to Debug App Analytics" width="100%">

### Using Proxyman to Debug App Analytics
<a href="https://proxyman.io/" target="_blank" title="Proxyman">Proxyman</a> is an incredibly useful network debugging tool that can be used to debug analytics traffic on a mobile application. More information on Proxyman can be found on their website <a href="https://proxyman.io/" target="_blank" title="Proxyman">here</a>.

One of the upsides (or drawbacks, depending on who you ask!) of <a href="https://proxyman.io/" target="_blank" title="Proxyman">Proxyman</a> is that it enables you to debug and see the results directly on the mobile device that you are testing, rather than relying on having a separate mobile and desktop device. The below instructions have been compiled to cover the installation and configuration of Proxyman on an <a href="https://www.apple.com/uk/ios" target="_blank" title="iOS">iOS</a> mobile device.

#### Installation and First-Use Configuration
To begin, search for <a href="https://proxyman.io/" 
target="_blank" title="Proxyman">Proxyman</a> from the <a href="https://www.apple.com/uk/app-store/" target="_blank" title="App Store">App Store</a>. The full name of the app at the time of writing is **Proxyman - Network Debug Tool** (link <a href="https://apps.apple.com/us/app/proxyman-network-debug-tool/id1551292695" target="_blank" title="Proxyman - Network Debug Tool">here</a>). Download this app to your device and open it. You should be taken to the *Home* screen which should say *No Requests*. From here, click on **Start Capturing HTTP(s) Traffic**, or go to **More** in the bottom menu and then click on the warning that says *VPN is not ready*. Both of these options should take you to the Setup screen.

<img class="blog-image" src="/images/blog/proxyman/proxyman1.png" alt="Using Proxyman to Debug App Analytics">

Select **Install VPN Extension** which will create a local VPN on the device that will proxy the traffic. Next select **Allow** when prompted in *"Proxyman" Would Like to Add VPN Configurations*. This will take you to your phone's VPN Settings where you will be asked to provide your phone's passcode. Once done, you will be returned to the app, where *VPN Extension Enabled* will now be ticked. 

Next, select **Generate Proxyman Certificate**, followed by **Show me** which will guide you through how to install the certificate, although I have included the instructions below.

In Safari, head to <a href="http://proxy.man/ssl" target="_blank" title="Proxyman SSL Certificate">http://proxy.man/ssl</a>, where you should be prompted to download a configuration profile. Select **Allow**.

You should then see a prompt saying that the Profile was downloaded. Now go to Settings in your phone, where you should see *Profile Downloaded*. Click this, followed by **Install**. You'll need to put in your phone's passcode again. Select **Install** on the *Warning* screen. You should now see the profile has been successfully installed.

<img class="blog-image" src="/images/blog/proxyman/proxyman2.png" alt="Using Proxyman to Debug App Analytics">

Still in Settings, search for *Trusted Certificates* which can also be found in Settings > About. In *Certificate Trust Settings*, you should see your Proxyman certificate such as in the image below. You will see numbers in the Version fields, these have simply been hidden in the below image. Switch the toggle to ensure that this is **On** and then **Continue** when prompted.

Head back to Proxyman where you should see an **All good** message on the setup screen.

<img class="blog-image" src="/images/blog/proxyman/proxyman3.png" alt="Using Proxyman to Debug App Analytics">

You're now good to go! In future, any time you wish to check if the Proxyman settings are configured correctly, simply head to *More* in the bottom menu, where you will either see a *Not Ready* or *Ready to intercept* message.

#### Debugging Network Calls
At this point, your device should be ready to go to view network calls, and you should already see a list of domains on the home screen. At this point, I would advise clearing the logs using the bin icon in the top left-hand corner, before opening the app that you wish to debug. Upon opening the app in question, I begin to see the requests that are made.

In the below example, I am interested in calls made to the <a href="https://tealium.com/" target="_blank" title="Tealium">Tealium</a> Tag Management System, so I can either use the search bar or scroll down to find *collect.tealiumiq.com*. Selecting this then shows me the calls sent to Tealium.

If you select any domain the first time you are using <a href="https://proxyman.io/" target="_blank" title="Proxyman">Proxyman</a>, you will typically get the message *This HTTPS Response is encrypted*, because SSL proxying has not been enabled for this domain. Select **Enable SSL Proxying** which will allow you to see new requests for that domain. It is worth noting that the free version of <a href="https://proxyman.io/" target="_blank" title="Proxyman">Proxyman</a> is limited to allowing only two domains at a time, while the paid version allows for unlimited. More information on pricing can be found <a href="https://proxyman.io/pricing" target="_blank" title="Proxyman Pricing">here</a>.

<img class="blog-image" src="/images/blog/proxyman/proxyman4.png" alt="Using Proxyman to Debug App Analytics">

Once enabled, create another request in the app to see this in Proxyman and you should see more information shown for this source. Select one of the requests. In the below example we are selecting the most recent Tealium /event/. 

Then go to the *Request* tab and select **View Body** where you will be able to see the content of the request. You can see this in standard form in the *Body* tab, or can view in JSON format (which includes a handy search bar!) by selecting the *JSON* tab.

<img class="blog-image" src="/images/blog/proxyman/proxyman5.png" alt="Using Proxyman to Debug App Analytics">

#### Disabling VPN/Testing
Once you have finished your testing, head to *More* in the bottom menu and then switch the *Enable VPN* toggle **off**. You can also disable the Proxyman root certificate when not required by going to Settings and searching for *Trusted Certificates*. Then go to Certificate Trust Settings and toggle the Proxyman certificate **off**.

I hope you find the article useful. If you have any questions or comments on the above article, or need any assistance in using <a href="https://proxyman.io/" target="_blank" title="Proxyman">Proxyman</a>, please do not hesitate to reach out. I can be found on <a href="https://www.linkedin.com/in/timhuttonco" target="_blank" title="Tim Hutton LinkedIn
">LinkedIn</a>, or you can email me at <a href="mailto:me@timhutton.co" title="Tim Hutton Email">me@timhutton.co</a>.

