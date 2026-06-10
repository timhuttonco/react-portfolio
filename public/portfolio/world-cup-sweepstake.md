<img src="/images/works/world-cup-sweepstake.png" alt="World Cup Sweepstake Generator" width="100%">


### World Cup Sweepstake Generator

The <a href="https://github.com/timhuttonco/easy-world-cup-sweepstake" target="_blank" title="World Cup Sweepstake Generator on GitHub">World Cup Sweepstake Generator</a> is a single-file, zero-dependency web app for running a fair automated sweepstake draw for the FIFA World Cup. The entire application lives in one `index.html` — no server, no database, no install. You download the file, double-click it, and it runs in any browser.

#### The Problem

Every World Cup, the same thing happens in offices and group chats: someone tries to organise a sweepstake, pulls out a spreadsheet, and spends half an hour manually assigning 48 teams across however many players have entered. The result is almost always uneven — some players end up with two strong seeds, others get none, and the manual process is both tedious and easy to get wrong.

I wanted something I could just send to people: open it, paste in the names, click draw, done.

#### How It Works

The app's core logic is a two-round distribution engine that handles the awkward maths of dividing 48 teams across an arbitrary number of players fairly.

**Round 1** gives every player their baseline share: ⌊48 ÷ N⌋ teams each, drawn at random from a shuffled deck.

**Round 2** handles the remainder — the teams left over when 48 doesn't divide evenly. Rather than handing those extra teams out randomly (which would give some players two teams while others only get one, with no regard for seed quality), the app ranks all players by the best seed they received in Round 1. The players who drew the strongest teams are frozen and excluded from Round 2. The leftover teams go only to the players who drew weaker allocations in Round 1, giving them a second team as a balancing offset.

The result is that no player ends up with both a top-seeded team and a second-draw team — the players with the weakest first draws are the ones who benefit from the remainder.

#### Player Input

Players can be added either by bulk paste (a list of names from Notepad or an Excel column, split on newlines and commas) or one at a time via a text input, which was useful for live draws where people confirm on the day.

#### Tech

Built as a single self-contained HTML file — HTML, CSS, and vanilla JavaScript, no external dependencies. The draw logic runs entirely client-side. Because there is no persistence layer, the app prominently warns users to screenshot or print their results before closing the tab.
