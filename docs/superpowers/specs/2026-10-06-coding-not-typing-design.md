# Coding ≠ Typing: talk and deck design

Status: agreed with Daniel on 2026-10-06; ready for an implementation plan.
Supersedes the two separate plans (the earlier session's and this one's); `CLAUDE.md` now summarises this spec.

## Purpose

A talk for university students with **little to no coding background** about how a software engineer uses AI
(Claude Code in particular) day to day, and how AI is used more generally.

**What students should leave with (in priority order):**

1. **Software engineering is still worth learning.** The skill has moved from typing code to directing the work
   and judging the result. "I'm still coding, I'm just not typing."
2. **A bit of: use AI better in your own learning.** Give it context, not just long prompts; learn backwards from
   what you want to do.

Success: students think "I could direct an AI to build something, and I'd need to understand it to do it well",
not "AI is magic" or "coding isn't for me".

## Constraints

- **Length:** 25 minutes of core content, plus up to 5 flexible minutes covered by optional sections.
- **Audience:** no code on slides beyond the plain-English prompts themselves. Explain any term used
  (file, terminal, app). No machine learning content.
- **Stack:** keep the existing Slidev deck in `slides/`, auto-deployed to GitHub Pages by
  `.github/workflows/pages.yml`. Follow the "Lessons learned" in `CLAUDE.md`.
- **Accuracy:** every claim, number and screenshot on a slide comes from something actually run.

## Structure: a hub, not just a stream

The deck has a **hub slide** (table of contents) that Daniel can return to at any time and use to start the next
topic, or to jump into an optional topic if time allows.

### Slide order

The linear order is the core talk, so pressing → from start to finish delivers it without touching the hub.
Optional topics sit **after** the closing slide, so they never get in the way of the core path; they double as
the "after the talk" extras that students can browse later via the QR code.

```
Title
Hub
  1. Coding ≠ Typing            core
  2. Beyond the chat box        core   (live demo kicked off here)
  3. Director, not typist       core
  4. Learning backwards         core
Close (Coding ≠ Typing again, QR code to the deck, Q&A)
--- optional / after the talk ---
  5. Skills: the recipe card    optional
  6. Demo, round two            optional (more screenshots of the detailed-prompt build)
  7. Blender                    optional, content to be revisited later
```

### Hub behaviour (built 2026-10-06)

The hub is a **circuit-board tree** (inspired by "tree of circuit traces" images), drawn as SVG by
`slides/components/Hub.vue` from the list in `slides/topics.ts`:

- **Trunk = the core talk**, top to bottom in talk order (root bar at the top; teal ring nodes, labels to the right).
- **Branches = optional side trips** (orange ring nodes). Each grows out of the centre of the core topic it belongs
  to: 45 degrees down and outwards, sideways, then 45 degrees down into its node (labels under the node). Orange is
  drawn underneath the trunk and the talking points.
- **Side trips are folded away** at rest (the legend says "hover a point"). Hovering (or
  focusing) a talking point makes its side trips **radiate out**: the trace draws from the trunk, the dot pops in with
  a ripple, then the label fades in. They stay out while the pointer is on the point, its traces or its side trips,
  and fold back 350 ms after it leaves. Side trips already visited stay out, faded.
- **Hover details** (title, teaser, time / slide count) appear in a fixed card in the top-right corner, so they never
  cover the tree. **Click** a node to go to that topic's first slide.
- **Progress:** visited nodes fill in; the trunk glows from the root to the furthest core topic visited; the topic
  you were last in pulses. In-memory only, so a page reload resets it.
- **First view** of the session: the traces draw themselves down from the root and the nodes pop in (~2.5 s);
  afterwards the tree is shown straight away (flag in `sessionStorage`).
- **Sections are closed loops** (`slides/setup/shortcuts.ts`): → past a section's last slide and last click goes
  to the hub, ← from a section's first slide goes to the hub, and → on the hub goes to the next core section not
  yet visited. So → alone still delivers the whole talk, with the hub shown between sections. (Slidev's on-screen
  arrow buttons don't go through the keyboard shortcuts, so they still move linearly.)
- **`H`** returns to the hub from any slide (`slides/setup/shortcuts.ts`); a small tree button bottom-right of every
  other slide does the same (`slides/global-top.vue`, which also records which topic you're in).
- Topics are found by their first slide's `routeAlias`; a topic runs until the next topic's first slide.
  Adding a branch = one entry in `topics.ts` plus a slide with that `routeAlias`.

## Topics

Rough timings for the core path: 4 + 7 + 7 + 6 = 24 minutes, plus 1–2 for the close.

### 1. Coding ≠ Typing (core, ~4 min)

The hook. Daniel's lines, kept in his wording: **"I'm still coding, I'm just not typing."** What his working day
actually looks like. **Claude is a smart Google:** Google gives you ten links; Claude reads *your* code and answers
*your* question.

**The biggest change isn't the code, it's the writing.** In Daniel's view this matters more than AI writing code for
him: his documentation is much cleaner because AI writes it. That covers the team's shared handbook (wiki), the
to-do and bug list (issues), and the "here's what I changed and why" note that goes with every change for a
colleague to review (pull requests). Keep it free of jargon: describe what each one is for, and name the tools only
in passing, if at all. Supports the title: much of the job is explaining and recording the work, not typing it.

### 2. Beyond the chat box (core, ~7 min)

Most of the audience has used AI only through a web chat. Claude Code works on your computer: it creates and edits
files, runs commands and builds a working app.

**Demo pattern** (also used by later topics that have demos):

1. **Kick-off slide:** the simple prompt in large text. Daniel runs it live in the terminal and leaves it running.
2. **Screenshot slides:** the same kind of build done earlier with a detailed, well-directed prompt, which could
   not be done live in the time.
3. **Check-back slide:** "Let's see how it did." Switch to the live result and compare.

What gets built live: **decided, the `wordle-demo` project** (see `CLAUDE.md`, "The demo project", for the repo,
live URL and the timings measured on 2026-10-06).

### 3. Director, not typist (core, ~7 min)

The heart of the talk. The **Higgsfield analogy:** a very long text prompt to an AI video tool is worse than a
shorter request with real reference pictures of the actor (several facial expressions, the set from several angles).
With code it's the same: Daniel decides what gets built and how, and gives Claude the context (examples, existing
code, a sketch) instead of only describing it. Tie back to the live demo: vague prompt vs directed build.

### 4. Learning backwards (core, ~6 min)

A **dependency graph** of knowledge. A book makes you read top-down: to learn chapter 31 you work through the
chapters in order (like a breadth-first search from the root) and read things you don't need yet. With AI you start
from the thing you want to do (the leaf) and work out the path back to what you already know, filling only those
gaps. Shown as the same graph explored both ways.

Pivot to the **100 vs 50** line: in his own field Daniel is 100 and Claude is 50 (it makes mistakes); where he's 0,
a 50 is a big help. **The catch:** at 0 you can't tell when the 50 is wrong. That's why the degree matters, it takes
you from 0 to 100, and why "coding ≠ typing" doesn't mean "no need to learn".

### Close (core, ~1–2 min)

Coding ≠ Typing again, one line per topic. QR code to the deployed deck, pointing at the optional topics.
Q&A.

### 5. Skills: the recipe card (optional)

Claude starts every session knowing nothing; a skill is written instructions handed over up front, like a recipe
card. It's the "reference photos" from topic 3, written once and reused. Students can do this on day one.

### 6. Demo, round two (optional)

Extra screenshots from the detailed-prompt build in topic 2, for when there's time or interest.

### 7. Blender (optional, revisit later)

Claude controlling Blender through MCP (community `blender-mcp` server + Blender add-on): directing a scene
("a 4 m wall here, a window on the left, the sofa facing it") rather than "make a room". Planned as a simple prompt
kicked off live with screenshots of a detailed run, but the details are deferred; for now the topic is a
placeholder slide.

## First build: scope

The first implementation delivers the **skeleton with starter slides**, not the finished talk:

- The hub and its navigation (tiles, aliases, `H`, visited ticks, back-to-hub link).
- Title, hub, and close slides.
- For each topic: its opening slide plus one or two starter slides holding the points above as short text, with
  clearly marked placeholders for screenshots, the dependency graph and demo prompts.
- Minimal styling that's readable on a projector; visual design comes later.

Out of scope for now: the dependency-graph visual, real screenshots, the live-demo choice, Blender content,
visual design, and the earlier session's ideas (session replay, agent-loop diagram, context meter, spot the bug,
"Allow this?", Wordle build). Those are kept in `CLAUDE.md` as later ideas.

## Checking it works

- `npx slidev build` succeeds (CI runs it).
- Playwright from `slides/` (use `>> visible=true` locators): clicking each hub tile lands on that topic's first
  slide; `H` returns to the hub from a slide in each topic; visited ticks appear after visiting; → from the title
  walks the core path in order to the close slide.
- `npx slidev export --format png` for a visual check of every slide.
