---
theme: default
title: Coding ≠ Typing
colorSchema: light
# Within a section, content slides (left going forward, right going back; the heading stays put, see style.css).
# Moves to or from the map fade: setup/main.ts marks them, since Slidev picks forward transitions by deck order.
transition: fade
defaults:
  transition: slide-left
drawings:
  enabled: false
fonts:
  sans: Nunito
  weights: '400,600,700'
layout: default
class: title-slide
---

# Coding <span class="neq">≠</span> Typing

<p class="subtitle">How I use AI as a software engineer</p>

<p class="byline">Daniel Sutantyo</p>

<TitleTree />

<!--
Title slide.
-->

---
layout: full
routeAlias: hub
transition: fade
---

<Hub />

<!--
The talk map. The trunk (top to bottom) is the talk in order. → here opens the next section you haven't done;
← goes back to where you were. Sections are dead ends: press H (or Map) to come back here.
Orange branches are sub-sections (dashed ring = optional). Hover a node to peek, click to go there, press H anywhere to come back.
Topics, teasers and positions live in slides/topics.ts.
-->

---
routeAlias: intro
---

# Who am I?

- Software Engineer – .NET stack (C#)
- Tutor / Lecturer – Macquarie University

<!--
Part of the ~3 min intro. Keep it short.
-->

---

# Have you heard of AI?

Let me know what you have used

- **Chat** <span class="eg">ChatGPT · Claude · Gemini</span>
- **Specialists** <span class="eg">Midjourney · Suno · NotebookLM</span>
- **Agents** <span class="eg">Claude Code · OpenAI Codex · Google Antigravity</span>

<!--
Ask one at a time and look at the hands.
Chat: you type, it answers, in a browser or app. Expect most hands.
Specialists: each does one job very well. Midjourney makes pictures, Suno makes songs, NotebookLM answers
from the notes you upload (good for study).
Agents: it works on your computer: creates files, runs programs. Expect few hands.
That gap is the bridge to Claude Code.
-->

---

# What I use

- May 2023 – **ChatGPT**
- January 2026 – **Gemini**
- April 2026 – **Claude Code**

<!--
Part of the intro.
-->

---
routeAlias: claude-code
---

# Claude Code

- **[Placeholder]** Chat window vs an AI on your computer
- **[Placeholder]** The terminal

<!--
The basics. Claude Code is the bulk of the talk: its sub-sections on the map are Wordle, Claude's memory, Skills,
and Keeping records (optional).
-->

---
routeAlias: beyond
---

# Beyond Coding

- What coding is now
- Learning with AI <span class="eg">optional</span>
- AI driving other apps <span class="eg">optional</span>

<!--
Light page: a signpost for the section. Its sub-sections on the map: So what is coding now?,
Learning with AI (optional), MCP (Blender, optional).
-->

---
routeAlias: close
---

# Coding ≠ Typing

**[Placeholder]** One line per section, then questions.

<!--
Skeleton for the close. Add the QR code to the deck here.
-->

---
routeAlias: wordle
---

# Wordle

- **[Placeholder]** One sentence, 97 seconds, a working game
- **[Placeholder]** …but it accepts any five letters
- **[Placeholder]** A live change, live on your phone

<!--
Sub-section of Claude Code. From-scratch build and live change; numbers measured 2026-10-06, see CLAUDE.md.
Live demo: https://sutantyo.github.io/wordle-demo/
-->

---
routeAlias: memory
---

# Claude's memory

- Every session starts from zero
- So we leave it a note <span class="eg">CLAUDE.md</span>
- What the project is, the rules, the don'ts

<!--
Like briefing a new colleague on day one, every day.
Demo: open CLAUDE.md in the Wordle project and read a few lines out loud.
A real example of a "don't": "words.js is over 1 MB: don't read it whole". In the six-letter run
(2026-10-06) Claude didn't open that file, as the note asked.
-->

---
routeAlias: skills
---

# Skills

- A recipe card for one job
- Written once, used every time
- Claude reads it when the job comes up

<!--
A skill is a short written instruction file with a name and a description; Claude loads it when a task matches,
or you call it by name.
CLAUDE.md is about the project; a skill is about a task.
Students can write one on day one: it's just writing down how you want something done.
Demo: invoke a skill live (which one: to decide).
-->

---
routeAlias: records
---

# Keeping records

- Every change saved <span class="eg">rewind to any point</span>
- Every change explained <span class="eg">what changed, and why</span>
- The team's handbook, kept up to date
- AI writes the notes, so they actually get written

<!--
Optional sub-section of Claude Code: source control and documentation.
Plain words first, names second: the saved history is git; the explanations are commit messages and pull requests;
the handbook is the wiki.
Possibly the biggest change in my day-to-day work, more than AI writing code.
Demo idea: ask Claude to write the commit message / pull request description for the Wordle change.
-->

---
routeAlias: coding-now
---

# So what is coding now?

- Director, not typist
- A few good pictures beat a long description
- In my field I'm 100, Claude is 50
- At 0, you can't tell when the 50 is wrong

<!--
Sub-section of Beyond Coding, and the argument of the talk: after the audience has watched Claude build and
change Wordle.
Director, not typist: "I'm still coding, I'm just not typing."
Higgsfield: a very long prompt to an AI video tool is worse than a short one with real reference pictures of the
actor (expressions, the set from several angles). Code is the same: give Claude examples and context.
100 vs 50: in my field I'm 100 and Claude is 50 (it makes mistakes); where I'm 0, a 50 is a big help.
The catch: at 0 you can't tell when the 50 is wrong. That's why the degree matters: it takes you from 0 to 100.
-->

---
routeAlias: learning
---

# Learning with AI

- A book starts at chapter 1
- AI starts from what you want to do
- Then fills in only the gaps you need

<!--
Optional sub-section of Beyond Coding. Learning backwards: to learn chapter 31, a book makes you read top-down
(like a breadth-first search) through things you don't need yet. With AI you start from the leaf, work out the path
back to what you already know, and fill only those gaps.
The dependency-graph visual comes later.
-->

---
routeAlias: mcp
---

# MCP (Blender)

- Claude driving another app
- "Make a room" <span class="eg">vs</span> "a 4 m wall, a window on the left, the sofa facing it"
- MCP: a menu of what Claude is allowed to do

<!--
Optional sub-section of Beyond Coding. Blender demo details still to be decided.
Same lesson as Wordle: the more precisely you direct, the better the result.
Why not just an API? An MCP server is an interface designed for the AI: you choose what it may do (read, not
delete). "The API is the kitchen, MCP is the menu."
-->
