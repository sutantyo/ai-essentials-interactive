# CLAUDE.md

Context for Claude sessions working in this repo: Daniel's talk on how he uses Claude day to day as a
software engineer. The deck is at the placeholder stage. The plan is agreed: the full design is in
`docs/superpowers/specs/2026-10-06-coding-not-typing-design.md` (two earlier session plans, reconciled with Daniel
on 2026-10-06). Next step: an implementation plan for the first build (hub skeleton + starter slides).

## Repo

Public repo `sutantyo/ai-talk-2026` (renamed from `ai-essentials-interactive` on 2026-10-07). Live at
https://sutantyo.github.io/ai-talk-2026/.

Everything for the talk lives under one parent folder (a plain folder, not a repo); on Daniel's MacBook,
the one he presents from, that's `~/repos/uni/2026-ai-talk/`:

```
2026-ai-talk/
├── slides/                     this repo (sutantyo/ai-talk-2026): the deck, the spec, this file
└── japanese-phrasebook-demo/   sutantyo/japanese-phrasebook-demo: the skills demo (see below)
```

Wordle has no folder here: it's built live on stage.

| Path | What it is |
|---|---|
| `slides/slides.md` | The deck ([Slidev](https://sli.dev) v53, Vue 3 + Vite): title, the map, then one skeleton slide per topic. Design in `docs/superpowers/specs/` |
| `slides/topics.ts` | **Every node on the map**: title, teaser, main point or sub-section, `optional`, position. Also the visited state and talk order |
| `slides/components/Hub.vue` | The map: circuit tree, sub-sections radiating out on hover, details card, visited dots |
| `slides/components/TitleTree.vue` | Title-slide decoration: an L-shaped circuit in the bottom-right corner (fixed drawing, not from `topics.ts`) |
| `slides/global-top.vue` | On every slide: section marker top-right, Map button bottom-right, end-of-section nudge |
| `slides/setup/shortcuts.ts` | Keys: arrows run along a main point's chain of pages and stop at its ends; `H` = map; → / ← on the map |
| `slides/style.css` | Colours (`--deep`, `--teal`, `--orange`), heading underline, bullets |
| `slides/public/` | (to create) static files, e.g. screenshots, videos |
| `.github/workflows/pages.yml` | Builds and deploys to GitHub Pages on every push to `main` |

Commands: `cd slides && npm install && npm run dev` (http://localhost:3030, presenter view at `/presenter/`);
`cd slides && npx slidev build` (production build, also run by CI).

History: the repo previously held an interactive machine learning deck for Prof Christophe Doche's lecture.
It was removed deliberately; it's preserved at the `ml-deck` tag. Machine learning is out of scope for this talk.

### Lessons learned with this stack

- Every claim and number on a slide must come from something actually run or checked.
- Slidev class-name clashes: don't use `statement` (a built-in layout class) or `slider` as class names.
  The default theme greys out the first `p` after an `h1`; override with `.slidev-layout h1 + p { opacity: 1 }`.
- Fetch files in `public/` via `import.meta.env.BASE_URL` so the site works under `/<repo>/`.
- Pages: the workflow builds with `--base /<repo>/` and copies `index.html` to `404.html` so direct slide
  links (`/12`) load. They return HTTP 404 but render the deck, which is expected.
- Turn off code-font ligatures (`font-variant-ligatures: none`); `==` and `->` otherwise render as symbols.
- Browser checks: Playwright from inside `slides/` (`playwright-chromium` is a dev dependency). Slidev keeps
  neighbouring slides in the DOM, hidden, so use `>> visible=true` locators. "Wake Lock permission denied"
  in headless Chromium is harmless. `npx slidev export --format png` renders every slide for a visual check.
- Commit and push only when Daniel asks.

## The talk: agreed plan (summary of the spec)

**Audience:** university students with **little to no coding background**. No code on slides beyond plain-English
prompts; explain terms like file, terminal, app. **Length:** 25 minutes core, plus up to 5 flexible minutes
covered by optional sub-sections. **Main message:** software engineering is still worth learning, because the skill has
moved from typing to directing and judging. Secondary: use AI well for your own learning.

**Daniel's own lines (keep his wording):**

- **Coding ≠ Typing.** "I'm still coding, I'm just not typing." The title and headline.
- **Claude is a smart Google.** Google gives you ten links; Claude reads *your* code and answers *your* question.
- **100 vs 50.** In his field he's 100 and Claude is 50 (it makes mistakes). In fields where he's 0, a 50 is a big help.
  **The catch, used as the pivot:** at 0 you can't tell when the 50 is wrong, which is why the degree matters:
  it takes you from 0 to 100.
- **The biggest change is the writing, not the code.** AI writes his documentation, so it's much cleaner: wiki
  entries, issues, pull requests. He sees this as a bigger change than AI writing code. Say it without jargon
  (team handbook, to-do and bug list, "what I changed and why" notes for review).

**Structure: a map.** The hub slide is a circuit-tree map: the trunk is the main points in order; each point's
**sub-sections** branch off it in orange and radiate out on hover (scattered above and below, left to right in talk
order); an **optional** one has a dashed halo. A main point and its sub-sections form one chain: the arrow keys run
along it and stop at its ends. `H` or the Map button goes to the map, and → on the map opens the next part of the
talk. Current map (source of truth: `slides/topics.ts`):

```
Main point (trunk)   Sub-sections, left to right = talk order (* = optional)
Introduction         (none)                       slides: Who am I? · Have you heard of AI? (Chat vs Agents)
Claude Code          Wordle · Claude's memory · Skills · Keeping records*      <- the bulk of the talk
Beyond Coding        So what is coding now? · Learning with AI* · MCP (Blender)*
Wrap-up
```

**Demo pattern:** a kick-off slide with the simple prompt, which Daniel runs live and leaves running; screenshot
slides of a detailed, well-directed build done earlier (can't be done live); a check-back slide to look at the live
result.

**The demo project: Wordle (decided 2026-10-06).** A Wordle-style browser game called "Guess the Word" (not
"Wordle", which is a New York Times trademark). Repo `sutantyo/wordle-demo` (public), live at
https://sutantyo.github.io/wordle-demo/ via GitHub Pages straight from `main`; local copy `C:\repos\uni\doche\wordle`
(not cloned into `2026-ai-talk`; see the 2026-10-07 decision below). Plain HTML/CSS/JS, no build step: `index.html` is the whole game, `words.js` holds
word lists for 4 to 8 letters (answers from Google's 10,000 most common words, guesses from dwyl/english-words),
and its own short `CLAUDE.md` is written to be shown on a slide. On stage, Daniel starts `claude` in that folder,
makes a change, and pushes; the audience can watch it go live on their phones.

**Measured on 2026-10-06** (Claude Code 2.1.290, headless runs; quote these, don't round them up):

- **The hook, Wordle from scratch.** Empty folder, prompt *"Make a Wordle clone that runs in the browser, in this
  folder."*: **97 s**, 8 steps, about US$0.43, 4 files and about 440 lines. It works and scores repeated letters
  correctly, but Claude decided things nobody asked it to: it **accepts any five letters** (`XQZZV` is taken as a
  guess), uses a 542-word list typed from memory, and calls itself "Wordle". That's the director point: a vague
  prompt gets *something*, with the decisions made for you. It was quick because Wordle is small and one of the
  most-cloned toy projects around (no web access in that run); novel twists are slower and riskier.
- **A live change.** In `wordle-demo`, prompt *"Change the game so words are 6 letters instead of 5."*: **39 s**,
  about US$0.28, one line (`WORD_LENGTH`) plus the matching line in its `CLAUDE.md`. It didn't open the 1 MB word
  file, as its `CLAUDE.md` asks. GitHub Pages served it **about 44 s** after the push, so roughly 1.5 minutes from
  prompt to the audience's phones. Reverted to 5 letters for the demo.
- **Framing:** a one-line change is unimpressive on its own; it's one line *because the project was designed for
  it* (Coding ≠ Typing). For a meatier live change, ask for something the design didn't anticipate, e.g. "let the
  player pick 4 to 8 letters before each game". Rehearse it first.
- **Stage setup:** run Claude Code without Daniel's personal plugins. In both runs the impeccable design hook
  made Claude spend its final message on design warnings instead of the change. The laptop needs `gh auth login`;
  Claude asks permission before pushing, which can be an audience moment.

`C:\repos\uni\wordle-clone-dev` is Daniel's separate Java Wordle teaching project for first-years; not used here.

**Decisions that changed from the earlier plan:** audience (none rather than a little coding), length (25 not 20),
demos (one simple live prompt plus screenshots, not a session replay), skills (optional, not core), Blender
(revisit later, not an embedded recording).

**Later ideas (not in the first build):**

- **Session replay:** a real recorded Claude Code session (JSONL under `~/.claude/projects/`), stepped through on
  clicks, terminal on one side and a plain-English line per step on the other. Could upgrade the screenshot slides.
- **Agent loop diagram** lit up with the replay: request → decide → use a tool → look at result → repeat.
- **Context meter:** fills with labelled blocks as Claude reads files. Pairs well with topic 3 and skills.
- **App growing beside the code**, **spot the bug** (Wordle's repeated-letter rule: answer `ABIDE`, guess `SPEED`,
  only one E coloured), **"Allow this?"** permission prompt vote, **you be Claude**.
- **"Why not just use an API?"** backup slide for MCP: an MCP server is an interface designed for the agent; you
  choose what it can do (reads, no delete) and can combine several API calls into one tool. APIs have
  authentication too; the difference is who it's designed for. Analogies: USB-C; "the API is the kitchen, MCP is
  the menu".

**Slide content status (2026-10-07):** written (light, since demos carry the detail): Who am I?, Have you heard of
AI?, Claude's memory, Skills, Keeping records, Beyond Coding, So what is coding now?, Learning with AI, MCP.
Still placeholders: Claude Code (basics), Wordle, Wrap-up. Font is Nunito (pinned in the headmatter so Macs don't
switch to Avenir Next).

**Decided 2026-10-07:** no rehearsed "meatier" live change on Wordle (dropped). The skill demo: Daniel will likely use
a skill from another project of his (to pick up on his laptop). Ideas discussed and not taken: Wordle-specific skills
(theme, word packs, ship, playtest) felt like poor uses of skills. Commonly used kinds, for reference: document
skills (Word, PowerPoint, Excel, PDF), ways-of-working skills (e.g. Superpowers: brainstorming, debugging, code
review, TDD; this talk was planned with the brainstorming skill), team conventions, and skill-creator.

**Decided 2026-10-07 (later): Wordle is built live** on stage, so there's no local Wordle folder in `2026-ai-talk`
for now.

**Decided 2026-10-07: the skills demo is `japanese-phrasebook-demo`** (public, `sutantyo/japanese-phrasebook-demo`).
A local, offline version of Daniel's online Japanese phrasebook (whose real version uses an MCP connector, which
is why it couldn't host skills): Svelte 5 page + Fastify + SQLite (`node:sqlite`), a `phrase` command with no
delete, and three project skills (`add-phrases`, `add-variation`, `review-phrases`) written in plain English to
show on screen, plus its own `CLAUDE.md` (rules: only change phrases through `phrase`, never reset). The page
updates live when the command writes, so the audience sees phrases arrive; seals speak with the Mac's Japanese
voice (Kyoko). Run: `npm start` → http://localhost:4173; `npm run demo:reset` between rehearsals.
Measured 2026-10-07 (headless, Claude Code 2.1.287): *"Add some phrases for buying medicine at a pharmacy"*
→ Claude chose `add-phrases` on its own and added 6 phrases in a new Pharmacy collection in **24 s**. It ended
questions with 「。」 where the book uses 「？」; that rule was then added to the skill (a real "this is what a skill
is for" example). Live, the skill shows the phrases and waits for Daniel's OK before adding.

**Open questions for Daniel:**

- Where the hook goes: Wordle from scratch is inside Claude Code → Wordle; the talk opens with "Who am I?".
- "Claude is a smart Google" isn't on any slide yet.
- Which real story from his work to tell in the intro.
- Learning with AI is optional now, and its dependency-graph visual isn't built; Higgsfield visuals not chosen.
- Wrap-up content and the QR code; merging into `main` so the deck goes live.
- Blender MCP demo (nothing installed or tested); screenshots for any pre-recorded parts.
- Stage setup: Claude Code without personal plugins, `gh auth login`; a timed rehearsal (Claude Code ~10 min is
  tight).
