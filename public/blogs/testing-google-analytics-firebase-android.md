<img src="/images/blog/firebase-ga4.png" alt="Testing Firebase & Google Analytics 4 Tracking on Android Apps" width="100%">


## Testing Firebase & Google Analytics 4 Tracking on Android Apps

With the impending switch from Universal Analytics to <a href="https://support.google.com/analytics/answer/10089681?hl=en" target="_blank" title="Introducing the next generation of Analytics, Google Analytics 4 (GA4)
">Google Analytics 4</a> taking place next year, it has become more important than ever to learn the new platform and how this can be tested and debugged, both across your websites and mobile apps.

In terms of learning the platform, I would advise completing the official <a href="https://skillshop.exceedlms.com/student/catalog/list?category_ids=6431-google-analytics-4" target="_blank" title="Google Analytics 4">Google Analytics 4 Certification</a>, and there are a plethora of tools that you can use to test collection on web such as the <a href="https://developer.chrome.com/docs/devtools/network/" target="_blank" title="Inspect network activity
">network console</a>, <a href="https://omnibug.io/" target="_blank" title="Omnibug">Omnibug</a> or <a href="https://dataslayer.org/" target="_blank" title="dataslayer">dataslayer</a> to name a few.

When it comes to mobile apps, I recently wrote an article on how to debug Universal Analytics traffic from apps using <a href="../blogs/debugging-google-analytics-ios-charles" target="_blank" title="Debugging Google Analytics in iOS Applications with Charles">Charles</a>. For GA4, that process becomes even easier thanks to <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> and <a href="https://support.google.com/analytics/answer/7201382?hl=en" target="_blank" title="Firebase">DebugView</a>. This will enable you to browse your app and see the events that are triggered by your activity, along with the parameters collected with this, inside the Firebase or Google Analytics platform.

To begin, you will need to ensure that there is a debug version of your app built on Firebase. More information on how debug mode can be added to an app can be found <a href="https://firebase.google.com/docs/analytics/debugview" target="_blank" title="Debug events">here</a>. You will also need to be added to the Firebase project - typically Viewer permissions is enough - and be added as a tester or provided with a test link to download the app.

The below article provides instructions on how you can test with an Android device. You can also test using an emulator in Android Studio.

### Enable Developer Mode
The first step for getting your device ready to test is to enable **Developer Options**. In your phone, simply head to *About phone > Software information > Build Number*. Alternatively, simply search for *Build number*.

Then you need to tap on the build number **8 times** to enable Developer Mode. You will see an info panel as you tap this telling you how many more times to select it.

Developer options will now be present at the bottom of Settings. Scroll down to this and open it, before scrolling down to **USB debugging** and enable it, such as in the image below. This will mean you can set your phone to debug mode whenever you have it plugged into your computer via USB.

![](/images/blog/firebase/firebase-1.png)

### Installing Apps
Once added to the app distribution list, you should receive emails for each of the apps that you are added to including a link to download them. You will also receive emails every time there is a release of these apps. Alternatively, you can get an invite link to download the app directly. This can be found in the Firebase console under *Release & Monitor > App Distribution > Invite Links*.

![](/images/blog/firebase/firebase-2.jpg)

Follow this link on your mobile device, where you should get the option to download the app by clicking **Accept Invitation**.

You will then need to open the download file which will ask you to install **App Tester**, ensure that you do this. App Tester will show you the latest versions of the app for you to be able to download, along with previous versions. Often when working with the team that will be working on an app, they will release updates in separate versions, so you will be able to exclusively test changes relevant to you in a particular release.

Select the release that you wish to download and click the *Download* button. You will then be asked to approve testing on this device. This will only appear the first time you open the test app.

![](/images/blog/firebase/firebase-3.png)

### Enabling Debug
The next step is to ensure that your test data is sent to Firebase. To do this you will need to use <a href="https://developer.android.com/studio/command-line/adb" target="_blank" title="Debug events">Android Debug Bridge (adb)</a> to setup your device as a debug device. You can either download adb from <a href="https://developer.android.com/studio/command-line/adb" target="_blank" title="Debug events">here</a>, or will already have it if you have installed <a href="https://developer.android.com/studio" target="_blank" title="Android Studio">Android Studio</a>. 

The next step is to locate where you have adb installed, and then set the app on your device to debug mode. To locate it in Android Studio, go to *Tools > SDK Manager* and look at the location that can be found under *Android SDK Location*.

#### Windows
On a Windows device, open Command Prompt (cmd) and head to platform-tools in the relevant folder, starting the command with "cd".

For example, if you have Android Studio, the command in full would be:

> cd AppData/Local/Android/Sdk/platform-tools

Inside the platform-tools folder, to test that your device is now linked, type in *adb devices* and press Enter. This should then return your device.

![](/images/blog/firebase/firebase-4.png)

The next step is now to set the device to debug mode using the below command:

> adb shell setprop debug.firebase.analytics.app appname

You will need to replace appname with the name of the app. For example, if you were running this on an app called com.exampleapp.debug, the command would be:

> adb shell setprop debug.firebase.analytics.app com.exampleapp.debug

#### Mac
Similar to above, you will need to locate the folder that you have adb installed.

Within Terminal, locate the sdk folder and set the device to debug mode using the below command, again replacing appname with the name of your app.

> adb shell setprop debug.firebase.analytics.app appname

### Viewing Events in Firebase/GA4
Once done, you will be able to see the events in either Firebase or GA4. Open the app on your device to get started.

In Firebase, ensure that you are in the correct app project. You can check this in the top drop-down menu. Head to *Analytics > DebugView* from the left-hand menu. Find your device under *Debug Device* as there may be multiple devices testing at the same time as you, and then you should start to see your events come through. There can be a 30-60 seconds delay for the events to come through so you may not see them instantly.

![](/images/blog/firebase/firebase-debug.png)

To see the same in GA4, head to *Configure* on the left-hand side within a GA4 property and then select *DebugView*, again selecting your device under *Debug Device*, where you will start to see events.

In both Firebase and GA4, click on an event to see the parameters, user properties and items (for e-commerce events) in more detail, such as in the image below.

![](/images/blog/firebase/firebase-debug2.png)