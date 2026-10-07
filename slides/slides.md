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

# Have you heard of AI?

Let me know what you have used

- **Chat** <span class="eg">ChatGPT · Claude · Gemini</span>
- **Specialists** <span class="eg">Midjourney · Suno · NotebookLM</span>
- **Agents** <span class="eg">Claude Code · OpenAI Codex · Google Antigravity</span>

What I use

- 2023 – **ChatGPT**, **Gemini**
- April 2026 – **Claude Code**

<!--
Ask one at a time and look at the hands.
Chat: you type, it answers, in a browser or app. Expect most hands.
Specialists: each does one job very well. Midjourney makes pictures, Suno makes songs, NotebookLM answers
from the notes you upload (good for study).
Agents: it works on your computer: creates files, runs programs. Expect few hands.
That gap is the bridge to Claude Code.
What I use: the old slide had May 2023 ChatGPT, January 2026 Gemini, April 2026 Claude Code.
-->

---
routeAlias: claude-code
---

# Claude Code

- Claude Code runs on your own computer, either in a terminal or as a desktop app <span class="eg">(from here on, we'll just call it Claude)</span>
- It is still a chat window, but you can give it access to your computer, e.g. it can create files
  - <span class="eg note">(to be clear: the AI itself still runs on Anthropic's servers, not on your computer)</span>
- We start it in a folder: by default, it works and saves its files there
- To demonstrate, let's build a simple app

<!--
The basics. Claude Code is the bulk of the talk: its sub-sections on the map are Wordle, Context and Memory and
Skills.
Remote: the Claude Code program runs on my laptop and does the file work here, but the model runs on Anthropic's
servers: what I type, and the files it reads, are sent there. That's why context costs money.
Still a chat: you type, it answers. The difference is access: it can open, create and change files and run
programs, and it asks before it does (you'll see that when it asks to push Wordle).
A terminal is a text window where you type instructions instead of clicking. The desktop app is the same Claude
Code in an ordinary app window. Today I'll use the terminal.
The folder: Claude Code works in the folder you start it from. Going outside it needs your permission, and you
can give it access to more folders (/add-dir). For Wordle: the wordle-demo folder, which holds only words.js.
To demonstrate, let's build a simple app: hand over to the Wordle demo (next on the map).
-->

---
routeAlias: beyond
---

# So am I still coding?

- I still make the important decisions
- I need to be able to explain it to the AI agent <span class="eg">e.g. the hub page</span>
- I decide how AI should evaluate the end result
- "I'm still coding, I'm just not typing"

<!--
Opens Beyond Coding, straight after the Claude Code demos. Wordle, the CLAUDE.md note, the skill, the save and the
push: all automated. Say it: "I didn't write a single line of code." Ask the question and let them answer, then:
director, not typist.
The hub page (this deck's map): bring up the transparency issue here, the known bug kept for a live fix (a visited
branch's faded line and circle overlap, so the join looks darker). To direct the fix I have to understand the
problem and explain it: fade the whole branch once, not each part.
Coding ≠ Typing: the title of the talk.
-->

---

# Making AI videos

- Higgsfield
- Using prompts to create videos
  - "A family dinner in a modern kitchen…" <span class="eg">a different kitchen in every shot</span>
- Using prompts backed up with reference material
  - "Use these photos of the kitchen as the setting" <span class="eg">the same kitchen in every shot</span>
- Know filmmaking (sets, lighting, camera angles)? You'll get far better results

<!--
Higgsfield, an AI video tool. Text alone: each generated shot gets a different kitchen ("A cozy kitchen with
morning light" gives a different kitchen each time: Higgsfield's own guide). Within one clip it's fairly stable; the
change shows between shots. A reference picture of the kitchen keeps it the same; for people, photos from several
angles and expressions keep the same face (Higgsfield's Soul ID trains from 5+ photos).
Same idea as CLAUDE.md: give the AI the real thing instead of describing it and hoping.
Last point: knowing the craft (production design, lighting, camera work) is what makes the result good: the same
message as 100 vs 50 vs 20, and as "I'm still the director".
Screenshots or clips to add (real Higgsfield output, not mock-ups).
-->

---
routeAlias: close
---

# Closing remarks

- To use AI well, you still need to understand computing concepts
- Learn how to use AI

<!--
The close. Back to the title: Coding ≠ Typing. Then questions.
Still to add: the QR code.
-->

---
routeAlias: wordle
---

# Wordle

<PromptCard>Make a Wordle-style game called "Guess the Word" as a single web page in this folder: five-letter words, six guesses, green, yellow and grey tiles that handle repeated letters correctly, and an on-screen keyboard that changes colour too. Use the word lists in words.js for answers and allowed guesses. Don't run any tests.</PromptCard>

<!--
Sub-section of Claude Code. Live: cd ~/repos/uni/2026-ai-talk/wordle-demo (holds only words.js), claude --effort low,
type the prompt (or press Copy), then open index.html. Measured 2026-10-08: 40 s with the big word lists (see
CLAUDE.md); it may ask once to run a command.
Point out what the prompt decides: the name, one file, the rules, the word list I prepared. That's directing.
For contrast: the vague prompt "Make a Wordle clone that runs in the browser" took 97 s (2026-10-06) and decided
things for me: it accepted any five letters (XQZZV) and called itself "Wordle".
Delete index.html between rehearsals; keep words.js.
-->

---
routeAlias: memory
---

# Context and Memory

- Every Claude session starts from (almost) zero: it knows very little
- As it works, everything it reads adds to its <span class="key">context</span>
- Context is measured in tokens (pieces of words): more tokens, more cost
- There is a limit on how big a context can be <span class="eg">it can only hold so much at once</span>
- When we close the process, it forgets everything again

<!--
(Almost) zero: the model itself remembers nothing between sessions; Claude Code reads memory files in at the start
(CLAUDE.md in the project, a personal ~/.claude/CLAUDE.md, notes it keeps per project). The wordle-demo folder has
none of these, so there it really starts from nothing.
Context: not memory. It's the text Claude reads with every reply: the conversation so far, plus every file it has
opened. Like papers on a desk, cleared away when the session ends.
Tokens: small chunks of text, about 3/4 of a word on average in English; prices and the context limit (1M on my
model) are counted in them. Cost: the whole context is sent with every message, so a big context costs money again
and again (caching makes the repeated part much cheaper, but it still adds up).
Show /context here (cue: the word "context" in teal). A built-in command (not a skill) that shows what's in the
context right now. In a long session
building this deck (2026-10-07): 352k of 1M tokens used, of which this deck's CLAUDE.md was 5.3k and the conversation
315k. Everything it reads is something you pay for again on every message.
The limit: 1M tokens for the model I use (Opus 5.5, as /context shows). Near the limit, Claude Code summarises the
older conversation to make room (auto-compact; /context showed 33k tokens kept free for it), and details can be
lost in the summary.
-->

---

# Memory

- So does it have to read everything in the folder again, every time?
- That takes a long time, and a big project won't even fit in its context
- The trick: leave it a note it reads every time it starts <span class="eg">CLAUDE.md</span>
- A summary of what the project is, and anything important to know

<!--
Ask the question and let it land: it would be slow and costly, and you'd pay for it in context every time.
Like briefing a new colleague on day one, every day.
Without the note, Claude has to explore the project (open files, read code) before it can do anything, every
session. A short summary instead: Claude reads the note, then goes straight to the one file it needs.
The note is tiny next to everything Claude would otherwise read again (5.3k tokens here, see /context).
A real example of a "don't": an earlier Wordle project's note said "words.js is over 1 MB: don't read it whole",
and in the six-letter run (2026-10-06) Claude didn't open that file. Next slide: this deck's own CLAUDE.md.
-->

---

# A real CLAUDE.md

<ClaudeMdViewer />

<!--
This deck's own note: the project I've been building these slides in. Scroll through it: it's plain English,
no code. Use the buttons: what the project is, where things are, the don'ts (lessons learned).
Every new session reads this first, instead of working the whole project out again.
-->

---
routeAlias: skills
---

# Skills

- If there's a complex task we do again and again, we can teach Claude how to do it
- We call this a <span class="key">skill</span>: the steps, written in plain English, with a name
- Whenever we need it, we just tell Claude the name of the skill to use

<!--
A skill is a short written instruction file with a name and a description. To keep it simple, the slide only says
"tell Claude the name" (e.g. /add-phrases ...). Claude can also pick a skill on its own when the request matches its
description: in the measured run it chose add-phrases unprompted. Either name it in the demo so it matches the slide,
or let it choose and say "it can even work out which skill to use by itself". Like a recipe card for one job: written once, used every time.
add-phrases: adds phrases the way the book does them (its collections, its style, its punctuation).
CLAUDE.md is about the project; a skill is about a task.
Students can write one on day one: it's just writing down how you want something done.
Demo: japanese-phrasebook-demo (npm start, http://localhost:4173; npm run demo:reset between rehearsals).
Measured 2026-10-07: "Add some phrases for buying medicine at a pharmacy" → Claude chose add-phrases on its own and
added 6 phrases in a new Pharmacy collection in 24 s. It ended questions with 「。」 instead of 「？」, so that rule was
added to the skill: a real example of what a skill is for. Live, it shows the phrases and waits for my OK.
-->

---

# Skill Example

<SkillViewer />

<!--
The real add-phrases skill from my Japanese phrasebook (a copy in slides/examples/; re-copy if the skill changes).
The description: the top block is all Claude reads up front; it decides from this when to use the skill.
Show me first: it shows the phrases and waits for my OK before adding anything.
Never: the don'ts, the same idea as in CLAUDE.md.
Plain English throughout: anyone who knows how they want a job done can write one.
-->

---
routeAlias: not-just-coding
---

# Coding is not just coding

- Documentation
- Tests
- Source Control
- Monitoring
- Learning

<!--
Sub-section of Beyond Coding, after "So am I still coding?": the rest of the job, beyond the code.
Documentation: AI writes my documentation (wiki entries, issues, pull requests), so it's much cleaner.
Possibly the biggest change in my day-to-day work, more than AI writing code.
Tests: small programs that check the real program still works, run every time something changes. Claude writes
these too.
Source control: one line: a save point for your code, like a save game, and one push puts it online.
Monitoring: once an app is running, it keeps a diary of everything it does (the logs), far more than anyone wants
to read. When something breaks, someone has to read them to find out why. AI reads the logs for me now.
Learning: lead into Learning with AI (learning backwards).
-->


---

# 100 vs 50 vs 20

- In my field I'm still better than Claude (I hope): if I'm 100, Claude is maybe a 50
- But in many jobs that don't need deep thinking, Claude is better than me
- There I'm maybe a 20, so even a 50 is much better than me
- Don't try to be 100 at everything; be 100 at something, and Claude won't make you obsolete

<!--
After "Coding is not just coding": apart from those parts of the job, there are other things I have to do, outside
my field. There Claude is better than me, and I'm fine if it takes control. (A real example from work to add.)
Claude makes mistakes; in my own field I catch them.
Earlier version, if useful: "at 0 you can't tell when the 50 is wrong; that's what your degree is for: 0 to 100".
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

- Blender can be controlled with Python
- Blender MCP server allows Claude to send it Python code to run
- For this demonstration, I pre-built some python scripts so that things run faster

<!--
Optional sub-section of Beyond Coding. Demo set up in ../blender (its own Blender MCP), with pre-built Python scripts
so it runs faster on stage.
On stage: Blender is already open (not a cold start).
Same lesson as Wordle: the more precisely you direct, the better the result. "Make a room" vs "a 4 m wall, a
window on the left, the sofa facing it".
Python: a programming language; Blender has one built in, so almost anything you can click, a script can do.
Why not just an API? An MCP server is an interface designed for the AI: you choose what it may do (read, not
delete). "The API is the kitchen, MCP is the menu."
-->
