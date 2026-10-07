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
and Save and Ship (optional).
-->

---
routeAlias: beyond
---

# So am I still coding?

I didn't write a single line of code, but I'm still the director

- I still make the important decisions
- I need to be able to explain it to the AI agent <span class="eg">e.g. the hub page</span>
- I decide how AI should evaluate the end result
- "I'm still coding, I'm just not typing"

<!--
Opens Beyond Coding, straight after the Claude Code demos. Wordle, the CLAUDE.md note, the skill, the save and the
push: all automated. Ask the question first and let them answer, then: director, not typist.
The hub page (this deck's map): bring up the transparency issue here, the known bug kept for a live fix (a visited
branch's faded line and circle overlap, so the join looks darker). To direct the fix I have to understand the
problem and explain it: fade the whole branch once, not each part.
Coding ≠ Typing: the title of the talk.
-->

---

# Making AI videos

- Higgsfield
- Using prompts to create videos
- Using prompts backed up with reference material

<!--
Higgsfield, an AI video tool: a very long prompt is worse than a short one with real reference pictures of the
actor (expressions, the set from several angles). Screenshots to add.
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

# Save and Ship

- **Save** <span class="eg">a save point for your code, like in a game</span>
- **Explain** <span class="eg">each save says what changed, and why</span>
- **Ship** <span class="eg">one push, and the website updates by itself</span>
- Claude does all three; I just ask

<!--
Optional sub-section of Claude Code: source control. Engineers use it to save their code.
Plain words first, names second: the save point is a commit, the tool is git, sending it up is a push.
Call back to Wordle: the change that appeared on your phones was a commit and a push; GitHub Pages did the rest.
AI writes the "what changed and why" notes, so they actually get written.
-->

---
routeAlias: not-just-coding
---

# Coding is not just coding

- Documentation
- Tests
- Source Control
- Learning

<!--
Sub-section of Beyond Coding, after "So am I still coding?": the rest of the job, beyond the code.
Documentation: AI writes my documentation (wiki entries, issues, pull requests), so it's much cleaner.
Possibly the biggest change in my day-to-day work, more than AI writing code.
Tests: small programs that check the real program still works, run every time something changes. Claude writes
these too.
Source control: if we did Save and Ship, "you've seen this one"; if we skipped it, one line: a save point for
code, like a save game.
Learning: lead into Learning with AI (learning backwards).
-->


---

# 100 vs 50

- In my field I'm 100, Claude is 50
- Other jobs come up too, where I'm 0
- There, Claude's 50 beats my 0: I'm happy to let it take over
- The catch: at 0, you can't tell when the 50 is wrong
- That's what your degree is for: 0 to 100

<!--
After "Coding is not just coding": apart from those four, there are other things I have to do, outside my field.
There Claude is better than me, and I'm fine if it takes control. (A real example from work to add.)
Claude makes mistakes; in my own field I catch them.
The catch is the pivot: why software engineering is still worth learning.
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
The next slide shows it.
-->

---

# Learning backwards

<LearningGraph />

<!--
A book as a map of what needs what: each chapter leans on the ones above it.
Read it like a book: breadth-first, tier by tier. To reach chapter 13 you read 13 chapters.
Work backwards: I only want one thing from chapter 13. It leans on a bit of chapter 10, which leans on a bit of
chapter 7. Three chapters, and only the parts I need. That's how I learn with AI: start from the question, ask
what I'm missing, and fill only that gap.
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
