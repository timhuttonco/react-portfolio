---
title: "Updating Google Tag Manager Server Side Tagging Servers"
description: "Google Tag Manager’s server-side infrastructure requires updating from time to time as the Docker image that is used in your Cloud Run setup gets updated for security fixes and new features. Thankfully, it’s an incredibly simple task to update and the below article shows you how."
image: "/images/blog/google-tag-manager-cloud-run.png.png"
---

<img src="/images/blog/google-tag-manager-cloud-run.png" alt="Updating Google Tag Manager Server Side Tagging Servers" width="100%">

### Updating Google Tag Manager Server Side Tagging Servers
<a href="https://tagmanager.google.com/" target="_blank" title="Google Tag Manager">Google Tag Manager’s</a> server-side infrastructure requires updating from time to time as the Docker image that is used in your <a href="https://cloud.google.com/run" target="_blank" title="Cloud Run">Cloud Run</a> setup gets updated for security fixes and new features. Thankfully, it’s an incredibly simple task to update and the below article shows you how.

Before we begin, it’s worth sharing that the *Server-side tagging release notes* can be found <a href="https://developers.google.com/tag-platform/tag-manager/server-side/release-notes" target="_blank" title="Server-side tagging release notes">here</a>.

You will likely be alerted to the need to make an update to your tagging server in a few different ways. The first method of alerting is the warning message that you see below inside your <a href="https://tagmanager.google.com/" target="_blank" title="Google Tag Manager">Google Tag Manager</a> server-side container.

<img src="/images/blog/sgtm-server-version-update1.png" alt="Updating Google Tag Manager Server Side Tagging Servers" width="100%">

However, you will also be able to see this in the server-side container’s *Preview Mode Console* when sending requests to the server-side container, such as in the image below.

<img src="/images/blog/sgtm-server-version-update2.png" alt="Updating Google Tag Manager Server Side Tagging Servers" width="100%">

To see the version that you are currently using versus the latest version that is available, head to the **Admin** tab in your server-side container, followed by **Container Settings**. In here you will be able to see the versions in question. Those despairing at how outdated the version is in the image below will be pleased to know that this container is not actually in use!

<img src="/images/blog/sgtm-server-version-update3.png" alt="Updating Google Tag Manager Server Side Tagging Servers" width="100%">

Thankfully, updating the version is a relatively straightforward process. Head to your <a href="https://console.cloud.google.com/run/" target="_blank" title="Cloud Run">Cloud Run Console</a> in Google Cloud. You need to ensure you have *Cloud Run Developer* and *Service Account User* permissions to make these changes. More information on Google Cloud permissions can be found <a href="https://docs.cloud.google.com/iam/docs/roles-permissions" target="_blank" title="Google Cloud Permissions">here</a>.

You will need to do the following steps for your Preview server and any live servers that are used by <a href="https://tagmanager.google.com/" target="_blank" title="Google Tag Manager">Google Tag Manager</a>.

Click on the service you want to update and then **Edit & Deploy new revision**, then click **Deploy** without making any changes. Do this for each service and you’re good to go!

<img src="/images/blog/sgtm-server-version-update4.png" alt="Updating Google Tag Manager Server Side Tagging Servers" width="100%">

A quick note to say that if you have alerts configured for going over your maximum container amount, these will likely trigger in the few minutes after deployment. This is because <a href="https://console.cloud.google.com/run/" target="_blank" title="Cloud Run">Cloud Run</a> starts new containers and scales down the old ones simultaneously.

You will also likely see the warning message remain in <a href="https://tagmanager.google.com/" target="_blank" title="Google Tag Manager">Google Tag Manager</a> for up to 24 hours after making this update. Similarly, in the *Container Settings*, it can take up to 24 hours for the tagging server version to update.

The best way to confirm that this update has worked immediately is to restart your server-side Preview Mode and send new requests in from your client-side container. In the Console, if your update has worked successfully, you should see no warning messages such as in the image below.

<img src="/images/blog/sgtm-server-version-update5.png" alt="Updating Google Tag Manager Server Side Tagging Servers" width="100%">

Success! Hopefully you found the above useful - do not hesitate to reach out with any questions. I have also written an article about <a href="/blogs/automate-sgtm-cloud-run-updates" target="_blank" title="Automate Server-Side Google Tag Manager Updates on Cloud Run">how to automatically be alerted to new versions, and how to auto-update</a>.