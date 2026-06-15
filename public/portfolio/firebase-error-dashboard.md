<img src="/images/works/firebase-error-dashboard.png" alt="Firebase Analytics Error Tracking Dashboard" width="100%">

### Firebase Analytics Error Tracking Dashboard

An internal monitoring dashboard for tracking <a href="https://firebase.google.com/docs/analytics/errors" target="_blank" title="Firebase Analytics Error Codes">Firebase Analytics SDK implementation errors</a> across multiple <a href="https://support.google.com/analytics/answer/10089681" target="_blank" title="Google Analytics 4">GA4</a> properties over time. Data flows from <a href="https://cloud.google.com/bigquery" target="_blank" title="Google BigQuery">BigQuery</a> through <a href="https://firebase.google.com/docs/functions" target="_blank" title="Firebase Cloud Functions">Cloud Functions</a> into <a href="https://firebase.google.com/docs/firestore" target="_blank" title="Cloud Firestore">Firestore</a>, with a Tailwind/Chart.js frontend pulling directly from Firestore via the Firebase JS SDK.

The dashboard code is available on <a href="https://github.com/timhuttonco/firebase-error-dashboard" target="_blank" title="Firebase Error Dashboard on GitHub">GitHub</a>.

#### The Problem

Firebase Analytics logs SDK errors — invalid event names, oversized parameter values, reserved property names — as `firebase_error` events. The raw data is accessible in BigQuery, but there is no built-in view for spotting trends across multiple properties simultaneously or detecting when a particular error code starts spiking. The only way to catch a regression early is to query BigQuery manually, which this aims to solve.

#### How It Works

**Data pipeline**

A BigQuery SQL query scans each property's `events_*` table for `firebase_error` events and groups the results by date and error code to produce daily counts. The date range is passed in as a variable, so the same query works for both the daily sync and longer backfills. Two <a href="https://firebase.google.com/docs/functions/get-started" target="_blank" title="Cloud Functions v2">Cloud Functions</a> run it:

- A **scheduled function** runs at 4am daily, syncing a rolling 3-day window (to capture late-arriving Firebase export data) and writing results to Firestore using batch `merge: true` writes keyed by `date_propertyName_errorCode`.
- A **callable function** is triggered from the dashboard and runs a configurable historical backfill — up to 30 days — useful for initial setup or recovering from sync gaps.

<img src="/images/blog/firebase-error-dashboard2.png" alt="Firebase Analytics Error Tracking Dashboard" width="100%">

**Frontend**

The dashboard provides four main features:

- **Date range filter** with a Firestore date-range query on apply.
- **Error trend chart** — a <a href="https://www.chartjs.org/" target="_blank" title="Chart.js">Chart.js</a> line chart per property, with click-to-isolate so any error code tag in the table updates the chart to show just that property/code combination.
- **Breakdown table** — togglable between a *By Property* hierarchy (property → error code → date) and a *By Error Code* hierarchy (error code → property → date), with expand/collapse tree rows at each level and totals throughout.
- **Error code glossary** — an inline reference panel covering all Firebase Analytics SDK error codes with plain-English descriptions, so there is no need to leave the dashboard to interpret a code.

<img src="/images/blog/firebase-error-dashboard3.png" alt="Firebase Analytics Error Tracking Dashboard" width="100%">

#### Tech Stack

- <a href="https://firebase.google.com/docs/functions/get-started" target="_blank" title="Firebase Cloud Functions v2">Cloud Functions v2</a> (Node.js, scheduled + callable)
- <a href="https://cloud.google.com/bigquery" target="_blank" title="Google BigQuery">BigQuery</a> (Firebase Analytics export, parameterised queries)
- <a href="https://firebase.google.com/docs/firestore" target="_blank" title="Cloud Firestore">Firestore</a> (flat document store, batch writes)
- <a href="https://firebase.google.com/docs/hosting" target="_blank" title="Firebase Hosting">Firebase Hosting</a>
- Firebase Auth (access control)
- <a href="https://tailwindcss.com/" target="_blank" title="Tailwind CSS">Tailwind CSS</a>
- <a href="https://www.chartjs.org/" target="_blank" title="Chart.js">Chart.js</a>

The dashboard code is available on <a href="https://github.com/timhuttonco/firebase-error-dashboard" target="_blank" title="Firebase Error Dashboard on GitHub">GitHub</a>.