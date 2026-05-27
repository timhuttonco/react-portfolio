---
title: "How to Secure Gemini API Keys in Google Cloud & Firebase"
description: "Anyone who follows Google Cloud on LinkedIn has likely seen countless posts tagging them to discuss the fact that billing has surged on accounts because of Gemini API keys being discovered and used maliciously. Whilst I do, of course, find sympathy, it does reiterate the importance of keeping APIs and infrastructure secure."
image: "/images/blog/securing-gemini-api-keys-in-firebase.png"
---

<img src="/images/blog/securing-gemini-api-keys-in-firebase.png" alt="How to Secure Gemini API Keys in Google Cloud & Firebase" width="100%">

### How to Secure Gemini API Keys in Google Cloud & Firebase
Anyone who follows <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> on <a href="https://www.linkedin.com/" target="_blank" title="LinkedIn">LinkedIn</a> has likely seen countless posts tagging them to discuss the fact that billing has surged on accounts because of <a href="https://ai.google.dev/gemini-api/docs" target="_blank" title="Gemini API">Gemini API</a> keys being discovered and used maliciously. Whilst I do, of course, find sympathy, it does reiterate the importance of keeping APIs and infrastructure secure.

With that in mind, I decided to put a quick guide together on how to secure these when building projects using <a href="https://firebase.google.com/docs/hosting" target="_blank" title="Firebase Hosting">Firebase Hosting</a>, <a href="https://firebase.google.com/docs/functions" target="_blank" title="Firebase Cloud Functions">Firebase Cloud Functions</a>, and <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> <a href="https://cloud.google.com/security/products/secret-manager" target="_blank" title="Google Cloud Secret Manager">Secret Manager</a>. The example code can also be found in Github <a href="https://github.com/timhuttonco/gemini-api-key-blog-example" target="_blank" title="gemini-api-key-blog-example">here</a>.

If your front-end JavaScript looks similar to this:

```js
const ai = new GoogleGenAI({ apiKey: "AIzaSyYourSecretKey..." });
```

Anyone can open the browser's <a href="https://developer.chrome.com/docs/devtools" target="_blank" title="DevTools">DevTools</a>, head to the Network tab, and steal your key instantly.

Instead, we use a backend proxy. Your website’s front-end, deployed securely via <a href="https://firebase.google.com/docs/hosting" target="_blank" title="Firebase Hosting">Firebase Hosting</a>, talks directly to a <a href="https://firebase.google.com/docs/functions" target="_blank" title="Firebase Cloud Function">Firebase Cloud Function</a>. This cloud function safely retrieves the API key from <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> <a href="https://cloud.google.com/security/products/secret-manager" target="_blank" title="Google Cloud Secret Manager">Secret Manager</a> at runtime, makes the request to <a href="https://gemini.google.com/" target="_blank" title="Gemini">Gemini</a> server-side, and passes the parsed answer back to your front-end.

#### Step 1: Build a Standalone Vault Project & Restrict the Key
As well as never exposing your API on the client-side, you also don’t want to store your API secrets in the same <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> project where your production <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> website lives.

Instead, you should adopt the following model:

* **Project A (The Vault):** A locked-down, standalone <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> project used only for <a href="https://cloud.google.com/security/products/secret-manager" target="_blank" title="Google Cloud Secret Manager">Secret Manager</a> and your <a href="https://ai.google.dev/gemini-api/docs" target="_blank" title="Gemini API">Gemini API</a> keys.
* **Project B (Your Firebase App):** Your operational project handling front-end web hosting and backend cloud functions.

By isolating the key into a standalone project, you ensure that even if your main web application deployment is somehow compromised, an attacker cannot tamper with, view, or delete your foundational API credentials. As always, you should ensure that you are using two-factor authentication on all of your accounts.

***Setting up the Vault and Locking Down the API Scope:***
1. Create a brand new <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> Project called something like *api-vault* (you can, obviously, be more inventive than me!).
2. Navigate to <a href="https://cloud.google.com/security/products/secret-manager" target="_blank" title="Google Cloud Secret Manager">Secret Manager</a> inside this project and enable the API.
3. Click **Create Secret**.
4. Name your secret *GEMINI_API_KEY* (again, you can change this name if you wish).
5. In the Secret value box, paste your live <a href="https://ai.google.dev/gemini-api/docs" target="_blank" title="Gemini API">Gemini API</a> key from <a href="https://ai.google.dev/aistudio" target="_blank" title="Google AI Studio">Google AI Studio</a>.
6. Click **Create**.

<img src="/images/blog/securing-gemini-api-keys-in-firebase1.png" alt="How to Secure Gemini API Keys in Google Cloud & Firebase" width="100%">

#### Step 2: Initialise Firebase & Connect Cross-Project IAM
Next, let's minimise risks by setting up your local project environment and connecting your <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> app to your standalone vault project.

For your reference, I have previously created an article on <a href="/blogs/deploying-firebase-websites" target="_blank" title="Deploying Websites Using Firebase">how to deploy websites using Firebase</a>.

***Initialise Firebase locally***

In an empty directory on your machine, initialise your <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> project:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Select **Hosting** and **Functions** from the setup menu. Choose *JavaScript* or *TypeScript* for Functions.

***Grant Cross-Project Access to Firebase***

You don't need to generate long-lived JSON service account keys to let your backend read from your vault. Instead, you grant IAM permissions directly to your <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> application's computing identity.

1. Find your Firebase project's default compute service account. It typically follows this format: *YOUR-FIREBASE-PROJECT-ID@appspot.gserviceaccount.com*
2. Switch back to your Standalone Vault Project in the <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> Console that you used to setup the API key.
3. Go to <a href="https://console.cloud.google.com/security/secret-manager/secrets" target="_blank" title="Secret Manager">Secret Manager</a> and click on your GEMINI_API_KEY secret.
4. In the right-hand Permissions panel, click Add Principal.
5. Paste that <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> service account email as the new principal.
6. Assign the precise role: *Secret Manager Secret Accessor (roles/secretmanager.secretAccessor)*.
7. Click Save.

#### Step 3: Write Your Secure Firebase Cloud Function
Navigate into your generated functions directory and install the <a href="https://github.com/googleapis/python-genai" target="_blank" title="Gen AI SDK">Gen AI SDK</a> and Secret Manager package:

```bash
cd functions
npm install @google/genai
npm install @google-cloud/secret-manager
```

Open *functions/index.js* and export an **HTTPS Callable Function**. Callable functions are perfect here because they automatically handle body parsing, authorisation, and CORS restrictions out of the box. There is also a link to GitHub below for each file to make it easier to copy.

<a href="https://github.com/timhuttonco/gemini-api-key-blog-example/blob/main/functions/index.js" target="_blank" title="Github | timhuttonco | gemini-api-key-blog-example">index.js</a>

```js
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { GoogleGenAI } from "@google/genai";

const secretClient = new SecretManagerServiceClient();

export const askGemini = onCall({
  // Enforce App Check to prevent unauthorised domain or bot usage
  enforceAppCheck: true 
}, async (request) => {
  
  // The user prompt is automatically parsed and found in request.data
  const { prompt } = request.data;
  
  if (!prompt) {
    throw new HttpsError("invalid-argument", "The function must be called with a 'prompt'.");
  }

  try {
    // Pull the secret from your standalone Vault Project at runtime
    const vaultProjectId = 'company-api-vault-12345'; // <-- Use your actual Vault Project ID
    const name = `projects/${vaultProjectId}/secrets/GEMINI_API_KEY/versions/latest`;
    
    const [version] = await secretClient.accessSecretVersion({ name });
    const apiKey = version.payload.data.toString('utf8');

    // Initialise the Gemini SDK with the fetched key
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Request content generation from the model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Return the response object back to the front-end website
    return { text: response.text };

  } catch (error) {
    console.error("Gemini Backend Error:", error);
    throw new HttpsError("internal", "Failed to generate content from Gemini.");
  }
});
```

#### Step 4: Build Your Firebase Hosting Front-End
With your backend Cloud Function acting as a secure gateway, your front-end code remains lightweight and entirely oblivious to the actual API credentials.

Inside your project's *public/* folder, save the following code as *index.html*. It provides a responsive chat interface and utilises the client-side Firebase SDK to call your backend function.

<a href="https://github.com/timhuttonco/gemini-api-key-blog-example/blob/main/public/index.html" target="_blank" title="Github | timhuttonco | gemini-api-key-blog-example">index.html</a>

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemini AI Assistant</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f6f9;
            color: #333;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .container {
            width: 100%;
            max-width: 600px;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #1a73e8;
        }
        label {
            font-weight: 600;
            display: block;
            margin-bottom: 8px;
        }
        textarea {
            width: 100%;
            height: 100px;
            padding: 12px;
            border: 1px solid #dadce0;
            border-radius: 8px;
            resize: vertical;
            font-size: 16px;
            box-sizing: border-box;
            margin-bottom: 15px;
        }
        textarea:focus {
            outline: none;
            border-color: #1a73e8;
        }
        button {
            background-color: #1a73e8;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        button:hover {
            background-color: #1557b0;
        }
        button:disabled {
            background-color: #aaacb0;
            cursor: not-allowed;
        }
        .output-box {
            margin-top: 25px;
            padding: 15px;
            background-color: #f8f9fa;
            border-left: 4px solid #1a73e8;
            border-radius: 4px;
            min-height: 50px;
            white-space: pre-wrap;
        }
        .error {
            border-left-color: #d93025;
            color: #c5221f;
            background-color: #fce8e6;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Gemini AI Assistant</h1>
    
    <label for="user-prompt">What would you like to ask?</label>
    <textarea id="user-prompt" placeholder="Type your prompt here..."></textarea>
    
    <button id="submit-btn" onclick="askGemini()">Send to Gemini</button>
    
    <label style="margin-top: 25px;">Response:</label>
    <div id="ai-response" class="output-box">The AI's response will appear here...</div>
</div>

<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-functions.js";

    // Your Firebase configuration object from the Firebase Console
    const firebaseConfig = {
        apiKey: "abcd1234-your-api-key", 
        authDomain: "your-app-id.firebaseapp.com",
        projectId: "your-app-id",
        storageBucket: "your-app-id.appspot.com",
        messagingSenderId: "1234567890",
        appId: "1:123456:web:abcdef"
    };

    // Initialise Firebase Services
    const app = initializeApp(firebaseConfig);
    const functions = getFunctions(app);
    
    // Create a pointer directly to our secure Cloud Function
    const askGeminiCloudFunction = httpsCallable(functions, 'askGemini');

    window.askGemini = async function() {
        const userInput = document.getElementById('user-prompt').value.trim();
        const outputDiv = document.getElementById('ai-response');
        const submitBtn = document.getElementById('submit-btn');
        
        if (!userInput) {
            alert('Please enter a prompt first.');
            return;
        }

        outputDiv.classList.remove('error');
        outputDiv.innerText = "Thinking...";
        submitBtn.disabled = true;

        try {
            // Securely execute the Cloud Function. 
            // The browser never directly touches the Gemini API or its private key.
            const result = await askGeminiCloudFunction({ prompt: userInput });
            
            outputDiv.innerText = result.data.text;
            
        } catch (error) {
            console.error("Failed to reach Cloud Function:", error);
            outputDiv.classList.add('error');
            outputDiv.innerText = "An error occurred while connecting to the secure backend.";
        } finally {
            submitBtn.disabled = false;
        }
    }
</script>

</body>
</html>
```

To deploy your entire ecosystem (both your web assets and your backend function), run this command from your root directory:

```bash
firebase deploy
```

#### Step 5: Activate Firebase App Check
Hiding your key in a <a href="https://firebase.google.com/docs/functions" target="_blank" title="Firebase Cloud Functions">Cloud Function</a> prevents people from stealing it, but it doesn't stop malicious actors from finding your <a href="https://firebase.google.com/docs/functions" target="_blank" title="Firebase Cloud Functions">Cloud Function</a> URL and spamming it directly with scripts. This would still run up your Gemini bill and cause unauthorised usage of your budget.

Because we added *enforceAppCheck: true* inside our <a href="https://firebase.google.com/docs/functions" target="_blank" title="Firebase Cloud Functions">Cloud Function</a> code, Firebase will instantly reject any traffic that doesn't originate from your actual web application.

1. Go to the <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> Console and select your project.
2. In the left-hand menu under *Security*, click on **App Check**.
3. Go to the *Apps* tab and click **Register** next to your Web App.
4. Select an attestation provider: *reCAPTCHA Enterprise* is the typical choice for web apps. Information can be found <a href="https://docs.cloud.google.com/recaptcha/docs/create-key-website?authuser=0" target="_blank" title="Create reCAPTCHA keys for websites">here</a> on how to create the keys needed.
5. Follow the quick onscreen prompts to add the reCAPTCHA keys to your frontend script. <a href="https://firebase.google.com/" target="_blank" title="Firebase">Firebase</a> provides a simple copy-paste snippet to initialise App Check right next to your existing *firebaseConfig*.
6. Click *Save* and you're ready to go.

Now, anyone attempting to trigger your <a href="https://firebase.google.com/docs/functions" target="_blank" title="Firebase Cloud Functions">Cloud Function</a> using standalone <a href="https://www.python.org/" target="_blank" title="Python">Python</a> scripts, <a href="https://www.postman.com/" target="_blank" title="Postman">Postman</a> clones, or <a href="https://curl.se/" target="_blank" title="curl">curl</a> commands will be blocked at the door with a *401 Unauthorized* error before your code even executes.

The image below is taken from the example project built with the above code. I can neither confirm nor deny whether I edited the response...!

<img src="/images/blog/securing-gemini-api-keys-in-firebase2.png" alt="How to Secure Gemini API Keys in Google Cloud & Firebase" width="100%">

#### Final Production Checklist
Before final completion, I would advise going through these final checks:

* **Verify API Scope Restrictions:** Double check that your <a href="https://gemini.google.com/" target="_blank" title="Gemini">Gemini</a> key inside your Vault Project is explicitly restricted only to the <a href="https://ai.google.dev/gemini-api/docs" target="_blank" title="Gemini API">Gemini API</a>. Never leave a key set to "Unrestricted".
* **Enable Firebase App Check:** Ensure App Check is registered in your console as outlined in Step 5 so rogue scripts are instantly blocked from spamming your functions.
* **Clean Git History:** Ensure no hardcoded strings starting with AIzaSy were accidentally committed to your repo history. If they were, delete and rotate the key immediately.
* **Establish Billing Caps:** Set up budget alerts and hard cost limits in your <a href="https://cloud.google.com/" target="_blank" title="Google Cloud">Google Cloud</a> Billing console to automatically shut down services if an unexpected traffic spike occurs.

Hopefully you found the above useful - do not hesitate to reach out with any questions.