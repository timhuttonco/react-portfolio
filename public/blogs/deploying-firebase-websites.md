---
title: "Deploying Websites Using Firebase"
description: "Following some previous guides on utilising Google Cloud, I have been working closely with Firebase on apps lately, along with deploying a number of website projects there. The below is a quick guide on how to deploy websites to Firebase."
image: "/images/blog/firebase-web.png"
---

<img src="/images/blog/firebase-web.png" alt="Deploying Websites Using Firebase" width="100%">

### Deploying Websites Using Firebase
Following some previous guides on utilising <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a>, I have been working closely with <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> on apps lately, along with deploying a number of website projects there. The below is a quick guide on how to deploy websites to <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a>.

And before you ask why - beyond the impressive infrastructure, <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> is a natural choice for those already in the 'Google House.' If you rely on the Google stack, particularly for analytics and ads, <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> offers multiple easy integrations with products like <a href="https://cloud.google.com/bigquery" target="_blank" title="BigQuery">BigQuery</a> and <a href="https://developers.google.com/analytics/devguides/reporting/data/v1" target="_blank" title="Google Analytics API">Analytics APIs</a>, along with Google's own AI tools which might come in handy as your projects grow. It is also incredibly handy for deploying quick projects internally.

#### Create Your Firebase Project
Before you can begin to host anything, you’ll need a <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> project for your data and hosting. Head to the <a href="https://console.firebase.google.com" target="_blank" title="Firebase Console">Firebase console</a>. A few things to note here: if you already have a <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> account, you can create your <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> project in there, or alternatively if you do not have a <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> account or project, creating a <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> project will automatically create a <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> account.

In the <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> console, click **Add Project** and give it a name (in my example I am going to call it *timhutton-firebase-blog* - this will typically be the name that <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> uses for the domain unless you want to set up <a href="https://firebase.google.com/docs/hosting/custom-domain" target="_blank" title="Connecting a custom domain - Firebase">Custom Domains</a>) before clicking **Continue**. On the next step you can choose to enable <a href="https://developers.google.com/analytics" target="_blank" title="Google Analytics">Google Analytics</a> for the project, this is completely optional. It will create a new <a href="https://developers.google.com/analytics" target="_blank" title="Google Analytics">Google Analytics</a> account if you do enable this.

Once created, you will be taken to the Project Overview page. Click the **+ Add app** button and then select the **Web icon (</>)** as shown in the image below.

<figure><img src="/images/blog/firebase-web1.png" alt="Firebase Project Overview" width="100%">  <figcaption align="center"><i>Firebase Project Overview</i></figcaption></figure> 

Next you will want to give your app a nickname - this is what it will be referred to within <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> and isn’t seen by external users. Ensure you tick the checkbox that says *Also set up <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> Hosting for this app* and then select your project from the drop down. Now click **Register app**.

<figure><img src="/images/blog/firebase-web2.png" alt="The first step in creating your Firebase web app" width="100%">  <figcaption align="center"><i>The first step in creating your <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> web app</i></figcaption></figure> 

#### Add Firebase to Your Code
You will then be taken to the next step which is **Add Firebase SDK**. The below example will show working on a project in <a href="https://code.visualstudio.com/" target="_blank" title="Visual Studio Code">Visual Studio Code</a>, so I will use the *Use npm* option, however, if you do not want to use <a href="https://nodejs.org/en" target="_blank" title="Node.js">Node.js</a>, then you can choose the *Use a *&lt;script&gt;* tag* option.

If starting from scratch, create a folder on your device and open this folder in <a href="https://code.visualstudio.com/" target="_blank" title="Visual Studio Code">Visual Studio Code</a>. Now in the terminal paste the below and hit Enter.

```bash
npm install firebase
```

You can copy this directly from the <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> screen. This will run and then show once it has installed packages. You will also see new files and folders in the *Explorer* on the left-hand side.

<figure><img src="/images/blog/firebase-web3.png" alt="Successful Firebase install" width="100%">  <figcaption align="center"><i>Successful Firebase install</i></figcaption></figure> 

Now you can start to work on the site itself, and will need to paste the config object provided to you in <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a>, it should look something like this, obviously replaced with the correct info.

```javascript
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

I have also included a basic screenshot below of it inside some code, again with dummy credentials. It is advisable to move these credentials into a separate file as you can then include that file in a <a href="https://git-scm.com/docs/gitignore" target="_blank" title="gitignore">*.gitignore*</a> if you are hosting on <a href="https://github.com/" target="_blank" title="Github">Github</a>.

<figure><img src="/images/blog/firebase-web4.png" alt="Example of the Firebase credentials in a HTML file" width="100%">  <figcaption align="center"><i>Example of the <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> credentials in a HTML file</i></figcaption></figure> 

#### Deploy!
The next step is where you get to see your finished (or in my case, barely started) project in the wild! There are a few steps to be achieved here but they do not take very long. You’ll first need to install the *Firebase CLI* (Command Line Interface). To install this, simply paste the following in the Terminal and hit Enter:

```bash
npm install -g firebase-tools
```

Once that is done, you will then want to paste the below. This will prompt a Google sign-in window to open in your browser. Sign in with the same Google account you used for the creation of the <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> project.

```bash
firebase login
```

You’ll then need to initialise hosting with the below in the terminal and pressing Enter - make sure you do this in the project’s root folder.

```bash
firebase init hosting
```

You will be provided with a few options.

Firstly, for **Project Setup**, select *Use an existing project* and pick the one you created earlier. You navigate by using the *Up* and *Down* keys on your keyboard and then pressing Enter on the option you want.

<figure><img src="/images/blog/firebase-web5.png" alt="Select Use an existing project" width="100%">  <figcaption align="center"><i>Select Use an existing project</i></figcaption></figure> 

You will then be asked what you want to use as your public directory. If using a framework such as <a href="https://react.dev/" target="_blank" title="React">React</a>, this is usually *dist* or *build*. For simple HTML, you can use *public* and simply hit Enter without typing anything, unless you want to use a specific folder. 

A note that this will create a folder called public where the index.html file will be placed, so if you have already created an index.html file, you will need to move it there after this step - I have made that mistake a few times!

Finally, you will be asked about Single Page Apps. Again, if using a framework such as <a href="https://react.dev/" target="_blank" title="React">React</a> or <a href="https://vuejs.org/" target="_blank" title="Vue">Vue</a>, select *Yes* to rewriting all URLs to index.html. If using standard HTML, you can set this to *No*.

Once this is done, you should see **Firebase initialization complete!**, meaning we’re nearly there. Paste the following and hit Enter.

```bash
firebase deploy
```

<figure><img src="/images/blog/firebase-web6.png" alt="The final step in deployment" width="100%">  <figcaption align="center"><i>The final step in deployment</i></figcaption></figure> 

This will give you a *Hosting URL* such as in the image below. You can either click this or type it into your browser to see your work. Et voilà - our website is live!

<figure><img src="/images/blog/firebase-web7.png" alt="Et voilà - our website is live!" width="100%">  <figcaption align="center"><i>Et voilà - our website is live!</i></figcaption></figure> 

You can obviously expand on this and integrate any number of Google, or third-party, features such as <a href="https://gemini.google.com/" target="_blank" title="Gemini">Gemini</a> into your website. The possibilities are endless!

Hopefully you found the above useful - do not hesitate to reach out with any questions. I intend on publishing more helpful <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> guides in the near future.