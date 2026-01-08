<img src="/images/blog/debugging-google-analytics-ios-charles.png" alt="Debugging Google Analytics in iOS Applications with Charles" width="100%">

### Debugging Google Analytics in iOS Applications with Charles

The role of an analyst is constantly changing, and as <a href="https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-web-traffic-statistics/" target="_blank" title="Think With Google">more traffic moves to mobile</a>, it becomes even more important to be able to implement and diagnose your mobile applications. Most will be familiar with using the <a href="https://developer.chrome.com/docs/devtools/network/" target="_blank" title="Inspect network activity
">network console</a>, or tools such as <a href="https://omnibug.io/" target="_blank" title="Omnibug">Omnibug</a> or <a href="https://dataslayer.org/" target="_blank" title="dataslayer">dataslayer</a>, to implement and debug on web, while the below is a guide to using <a href="https://www.charlesproxy.com/" target="_blank" title="Charles Proxy">Charles Proxy</a> in order to debug <a href="https://analytics.google.com/analytics/web/" target="_blank" title="Google Analytics">Google Analytics</a> traffic on an iOS app.

Note that this refers to the standard/legacy implementation of <a href="https://analytics.google.com/analytics/web/" target="_blank" title="Google Analytics">Google Analytics</a> and not <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a>.

So what (or who, as I have been asked numerous times) is Charles? It’s a HTTP debugging proxy server application that enables you to view traffic from a device. In short, think of it as an equivalent of the network console but for your mobile apps.

It is important to note that firstly, Charles is a software application that you will need to download, and you will also need to make changes to network settings which may require device privileges that you do not have on a corporate device and require permission for.

To begin, head to <a href="https://www.charlesproxy.com/download/" target="_blank" title="Charles Proxy Download">charlesproxy.com/download</a> to download Charles. The latest version at the time of writing is 4.6.2 and is available as a 30-day free-trial download. Your sessions are limited to a maximum of 30 minutes, and Charles will simply need to be re-opened after this time. The paid version starts at $20 for 1-4 users, and lowers in price the more users you provide licenses for.

Download the Charles version for your relevant OS. This examples below are taken from a Mac but will be very similar for other operating systems. Once installed, open Charles and head to Proxy > SSL Proxy Settings, such as in the image below.

![Open Charles and head to Proxy > Proxy Settings](/images/blog/charles-2.png)

Under SSL Proxying, ensure **Enable SSL Proxying** is *enabled*, and then click **Add** under *Include*. From the prompt you are provided, add *.google-analytics.com – this will ensure that Charles is able to show the contents of the Google Analytics requests. Without doing this, you will be able to see that requests are made to Google Analytics, but not what their contents are. Click **OK** once done.

> The above step can be repeated for other platforms that you wish to debug such as <a href="https://tealium.com/" target="_blank" title="Tealium">Tealium</a> or <a href="https://business.adobe.com/uk/products/analytics/adobe-analytics.html" target="_blank" title="Adobe Analytics">Adobe Analytics</a>.

![Open Charles and head to Proxy > Proxy Settings](/images/blog/charles-3.png)

The next step is to now set your mobile device up for Charles to be able to view requests. In Charles, select **Help**, hover over **SSL Proxying** and then select **Install Charles Root Certificate on a Mobile Device or Remote Browser**.

![Install Charles Root Certificate on a Mobile Device or Remote Browser](/images/blog/charles-4.png)

You will be shown a dialog box such as the below with an IP address that you will need to use in your proxy settings on your mobile device. Keep this open and head to the Wi-Fi Settings on your iOS device (Settings > Wi-Fi), ensuring that you are connected to the same network on both devices.

![Install Charles Root Certificate on a Mobile Device or Remote Browser](/images/blog/charles-5.png)

Click the **i** icon next to the relevant network (step 1 in the image below) and scroll down to *Configure Proxy* (step 2). Select *Manual* and then enter the IP address shown in the dialog box, along with 8888 in Port as shown in step 3 below.

![](/images/blog/charles-wifi.png)

Now open the Safari browser on your phone and head to <a href="http://chls.pro/ssl" target="_blank" title="Charles SSL">chls.pro/ssl</a> where, if you have set things up correctly, you will be shown a dialog box such as the below. Click **Allow**. If you have multiple devices, such as an Apple Watch, connected to your phone, you may see a prompt asking you which device to install it on. Select iPhone. You will then see a prompt confirming the download of the profile and advising you to head to Settings to install it.

> If you get to this stage and the page does not load, check you have followed the settings correctly above and you have added the IP address correctly in the Proxy Settings. Alternatively, you may need to <a href="https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/" target="_blank" title="SSL Certificates">install a Root certificate</a> on the laptop that you have installed the Charles software on.

![](/images/blog/charles-web-install.png)

In Settings, head to *General > VPN & Device Management* (or simply search in Settings for “VPN” and select it from the results). You should then see Charles Proxy in the Downloaded Profile list (1). Tap on this and then hit **Install** (2). You will be prompted for your phone passcode at this point. Once past that step, tap **Install** (3) where you will then be taken to a screen confirming the successful installation of the profile (4). 

![](/images/blog/charles-cert-mobile.png)

Still within Settings, head to *General > About > Certificate Trust Settings* (again, you can simply search in Settings for “cert” and select it from the results). Ensure the Charles Proxy certificate is set to on/green. In the left-hand image below, it is not enabled. When enabling, you will be shown a warning as shown below. Hit **Continue**.

![](/images/blog/charles-cert2.png)

You’re now good to go!

Load up the relevant application on your phone and head back to Charles. In the filter text field, input *google-analytics* which will filter only for calls made to GA. Note in the below that I have selected *Sequence* view in the top left-hand corner. The below images are taken from the <a href="https://www.thetrainline.com/" target="_blank" title="Trainline">Trainline</a> app which is a good example as it uses different GA request types. To see the content inside any GA hit, simply click on a hit and select **Contents**. In the first example, we select *Query String* at the bottom to see all of the contents of the hit (the parameters have been hidden from the image), while in the second example, we select *Form* to see the parameters.

![](/images/blog/charles-debug1.png)
<em><div align="center">Example 1</div></em>

![](/images/blog/charles-debug2.png)
<em><div align="center">Example 2</div></em>

Fortunately, you do not need to go through all of the above steps every time you want to test on a mobile application. Most of the time, you will simply need to amend your Proxy Settings. Once done testing, remember to turn off the Proxy in your Wi-Fi settings, and you can also disable the root certificate following the same steps as you performed above to enable it.