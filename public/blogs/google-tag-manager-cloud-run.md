<img src="/images/blog/google-tag-manager-cloud-run.png" alt="Implementing Google Tag Manager Server-Side Using Cloud Run" width="100%">


### Implementing Google Tag Manager Server-Side Using Cloud Run
Server-side tagging has been a hot topic for a while now in the analytics implementation space for several reasons. With browser privacy restrictions, more platforms pushing their APIs and the sheer number of marketing tags on a website growing all the time, the need to improve tracking has pushed many brands to consider this alternative.

There are a number of very good server-side products including <a href="https://developers.google.com/tag-platform/tag-manager/server-side" target="_blank" title="Google Tag Manager Server Side">Google Tag Manager (GTM) Server-Side</a>, <a href="https://tealium.com/products/tealium-eventstream/" target="_blank" title="Tealium EventStream">Tealium EventStream</a> and the recently updated <a href="https://www.commandersact.com/en/solutions/tagcommander/server-side/" target="_blank" title="Commanders Act">Commanders Act</a>. The upside of the latter two in comparison to Google Tag Manager is that they handle the server setup on your behalf, unlike GTM. There is an automatic provisioning option available in GTM, but it’s not recommended for large traffic websites. In the below article, I will take you through setting up Google Tag Manager server-side using their <a href="https://cloud.google.com/run" target="_blank" title="Cloud Run">Cloud Run</a> product.

The first step, similar to when setting up GTM client-side, is to create a tagging container. From the GTM start page or in Admin, select **Create Container**. Give the container a name and then select **Server** from the *Target Platform*, followed by **Create**. 

![Select Server From The Target Platform](/images/blog/server-side/server-side-setup1.jpg)

Select **Manually provision tagging server** from the next step, and make a note of the *Container Config* as this will be needed in the server setup.

![Make a note of the Container Config as this will be needed for the server-setup](/images/blog/server-side/server-side-setup2.jpg)

The <a href="https://developers.google.com/tag-platform/tag-manager/server-side/cloud-run-setup-guide" target="_blank" title="Set up server-side tagging with Cloud Run">following article</a> from Google is a useful resource for setting up Cloud Run, along with containing the prerequisites such as needing a <a href="https://cloud.google.com/" target="_blank" title="Dream, build, and transform with Google Cloud">Google Cloud Platform</a> Billing Account as well as Project Creator (if you are not using an existing project) and Billing Account <a href="https://cloud.google.com/iam/docs/understanding-roles" target="_blank" title="IAM basic and predefined roles reference">User Roles</a>.

If you need to create a new project, head to <a href="https://console.cloud.google.com/welcome" target="_blank" title="Google Cloud Platform Home">Cloud Platform Home</a> and click **New Project**. Give the project a suitable name such as GTM Server Side or similar and click **Create**. 

![Give the project a suitable name such as GTM Server Side](/images/blog/server-side/server-side-setup3.jpg)

Now, whether you have created a new project or are utilising an existing one, ensure that you are inside the relevant project – you may need to click the Projects drop-down at the top of the screen - and head to <a href="https://console.cloud.google.com/run" target="_blank" title="Cloud Run">Cloud Run</a>, either from <a href="https://console.cloud.google.com/run" target="_blank" title="Cloud Run">this link</a> or the left-hand navigation menu.

> **Note:** *If you are working with multiple websites or across mutliple regions, you will likely need to create multiple servers. See the <a href="https://console.cloud.google.com/run" target="_blank" title="Serve traffic from multiple regions">following article</a> for more information on how to set up Cloud Run multi-region. For the below example, we will simply use one region.*

Click **Create Service** and we will start by creating the *Preview Server* first. Select *Deploy one revision from an existing container image*, and paste the following URL in: *gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable*

You will then provide the server with a *Service name*, typically something descriptive. <a href="https://developers.google.com/tag-platform/tag-manager/server-side/cloud-run-setup-guide?provisioning=ui" target="_blank" title="Set up server-side tagging with Cloud Run">Google's documentation</a> suggests naming it *server-side-tagging-preview*, but if you are working across multiple brands, perhaps include a brand abbreviation. Also select a region here. For the purposes of testing, I have picked London. You can then follow the steps under *Provision a new preview and tagging server* in the <a href="https://developers.google.com/tag-platform/tag-manager/server-side/cloud-run-setup-guide?provisioning=ui#provisioning" target="_blank" title="Provision a new preview and tagging server">following article</a> for the most part, but I will also cover them below.

Under *CPU allocation and pricing*, select **CPU is always allocated** and for *Autoscaling* set the minmum number of instances to 0, and maximum to 1. For a preview server, setting this to more than 1 will break the preview feature.

![Cloud Run Preview Server Setup](/images/blog/server-side/server-side-setup4.jpg)

For *Ingress* select *Allow all traffic* and then for *Authentication* select *Allow unauthenticated invocations*. Expand the *Container, Networking, Security* header and under *Capacity* set Memory to 512 MiB, CPU to 1 and Request timeout to 60. These are the advised values by Google, but you are welcome to change these if you have particular knowledge/confidence of doing so.

Under *Environment variables*, add *RUN_AS_PREVIEW_SERVER* with the value of true and *CONTAINER_CONFIG* as the config value we saw earlier when choosing manual setup on the container creation (see image 2 of this article). Click **Create** – and you now have a preview server!

![Cloud Run Preview Server Setup](/images/blog/server-side/server-side-setup5.jpg)

Wait for this to be created and then make a note of the URL that is shown, as this will be required when you create the tagging server, which we will do next. Next to *Service Details*, click the back arrow to be taken back to the Cloud Run console and again click **Create Service**. The steps are very similar to the above.

![Cloud Run Preview Server Setup](/images/blog/server-side/server-side-setup6.jpg)

Again, select *Deploy one revision from an existing container image* and then *gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable*. Set the service name to something memorable and select the relevant region. 

> One thing to note when creating the name is that if you do not <a href="https://cloud.google.com/run/docs/mapping-custom-domains" target="_blank" title="Mapping custom domains">map your own custom domains</a>, the Service name will be included in the domain that the server runs from on your website. If one of your aims is to use server-side to attempt to bypass ad blockers, you are probably better off avoiding using words like “google”, “ga” or “gtm” in this name. 

In this example I have called it timhuttonco-shop. Select **CPU is always allocated** as before. For autoscaling, Google advises a minimum of 2 instances and maximum of 10. Again, this depends on the amount of traffic you receive – you may need even more than 10 for high traffic sites. For the sake of testing and this article, I have a maximum of 2.

![Cloud Run Tagging Server Setup](/images/blog/server-side/server-side-setup7.jpg)

As before, for *Ingress* select *Allow all traffic*, and for *Authentication* select *Allow unauthenticated invocations*. Again, expand *Container, Connections, Security*. Under *Capacity*, set Memory to 512 MiB, CPU to 1 and Request timeout to 60. Now in *Environment variables*, add PREVIEW_SERVER_URL and provide this with the URL of the preview server that you created earlier, and add CONTAINER_CONFIG as the config value we saw earlier when choosing manual setup on the container creation (see image 2 of this article). Once done, click **Create**.

![Cloud Run Tagging Server Setup](/images/blog/server-side/server-side-setup8.jpg)

Your tagging server is ready. As before, make a note of the URL of this server as it will be needed in the GTM configuration. Also – if you ever want to make changes to a server, for example to amend the number of instances, click on **Edit & Deploy New Revision**.

![Cloud Run Tagging Server Setup](/images/blog/server-side/server-side-setup9.jpg)

Now return to GTM and go to **Admin > Container Settings**. Under *Server Container URLs*, click **Add URL** and add the URL of your Tagging Server (the second server that we set up, not your Preview Server) and click **Save**. 

![Cloud Run Tagging Server Setup](/images/blog/server-side/server-side-setup11.png)

The final step, and to make sure everything has been setup as expected, click **Preview** from inside your GTM Server-Side container to open *Preview Mode*. If Preview Mode opens as expected, such as in the image below, you have successfully set everything up correctly and are ready to go!

![Cloud Run Tagging Server Setup](/images/blog/server-side/server-side-setup10.jpg)

In my next article, I dive deeper into <a href="../blogs/google-tag-manager-server-side-data" target="_blank" title="Sending Data To and From Google Tag Manager Server-Side">sending data to and from your server-side container</a>.
