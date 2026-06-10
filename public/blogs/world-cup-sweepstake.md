---
title: "World Cup Sweepstake Generator"
description: "A single-page, responsive web application engineered to run a fair, automated sweepstake draw for the FIFA World Cup. No spreadsheets, no databases, no installs — just open the file and draw."
image: "/images/blog/world-cup-sweepstake.png"
---

<img src="/images/blog/world-cup-sweepstake.png" alt="World Cup Sweepstake Generator" width="100%">

### 🏆 World Cup Sweepstake Generator

Welcome to the **World Cup Sweepstake Generator** — a single-page, responsive web application engineered to run a fair, automated sweepstake draw for the FIFA World Cup.

Built specifically to give those who aren't interested in football a compelling reason to get involved (and for those who have left it really last minute!), this eliminates spreadsheet mathematics and replaces it with a dynamic, logic-driven distribution engine.

The code is available on <a href="https://github.com/timhuttonco/easy-world-cup-sweepstake" target="_blank" title="World Cup Sweepstake Generator on GitHub">GitHub</a>.

---

#### Quick Start Guide

This is all completely self-contained within a single file. It requires no databases, external server dependencies, or framework installation packages.

1. **Get the Code:** Copy the entire source code from `index.html`.
2. **Save the File:** Open a plain text editor (such as Notepad, TextEdit, or VS Code), paste the code inside, and save the file locally as `index.html`.
3. **Launch the Draw:** Double-click the saved `index.html` file to instantly open and execute the sweepstake app directly inside any desktop or mobile web browser.

---

#### How to Populate Players

The generator provides two methods for compiling your participant lobby:

**Massive Bulk Copy/Paste:** You can copy a complete roster of names directly out of a Notepad text file or an Excel column spreadsheet and paste it directly into the **Full Player List** textarea box. The app reads hidden linebreak carriage returns (`\n`) and commas as distinct entry splits.

**One-by-One Additions:** For running live draws or handling late-joiners, type a name into the **Add Players One-by-One** input block and tap **Enter** or click the **Add Player** button to cleanly append them into the master drawing pool.

---

#### The Maths Behind the Draw

To ensure fairness across an unpredictable number of participants, the app handles team distributions across two distinct calculation rounds.

**Round 1: Baseline Quota Assignment**

This evaluates the total number of qualified teams (48) against your live participant count (N) to calculate the maximum equal base share: every player gets ⌊48 ÷ N⌋ teams.

**Round 2: The "Hangover" Remainder Exclusion**

If 48 is not perfectly divisible by the number of players, a leftover remainder pool ("hangover teams") exists. To prevent standard sweepstake biases where lucky players double up on premium seeds, this applies an exclusionary fallback ruleset:

1. It assesses the highest-quality seed position currently held by every participant following Round 1.
2. It ranks the players from best team drawn to worst team drawn.
3. The players holding the absolute highest-tier premium seeds matching the exact count of leftover teams are **frozen and excluded**.
4. The leftover teams are distributed exclusively to the remaining players who drew weaker teams, giving them a second team as a balancing fallback asset.

**Example Walkthrough (30-Player Roster)**

When **30 players** are inputted:

- **Round 1:** 48 ÷ 30 = 1 with a remainder of **18**. Every participant receives exactly 1 baseline team.
- **Round 2:** The remaining **18 leftover teams** must be assigned. The system identifies the 12 players who drew the strongest premium tournament seeds (#1 to #12) and locks their assignment at exactly 1 team. The remaining 18 players are handed a second team from the deck.

---

#### 📸 Important: Saving Your Draw Results

> ⚠️ **NOTE:** This app is engineered to run completely client-side in your browser. It **does not save data locally** or sync to an external database.

If you accidentally click refresh, hit the **Clear List** button, or close your active browser tab, **all current player names and draw allocations will be permanently wiped out.** Once you have generated your final sweepstake draw, you **MUST immediately take a screenshot** of the results window grid (or print the page to a PDF file) to permanently lock in and document the prize allocations for the tournament.