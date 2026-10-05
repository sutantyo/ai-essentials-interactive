# CLAUDE.md

Context for Claude sessions working in this repo. There are two talks in play:

1. **This repo's deck** (done, live): an interactive remake of Prof Christophe Doche's
   "Artificial Intelligence Essentials" lecture on how a neural network learns to read digits.
2. **Daniel's own talk** (planning, not started): how he uses Claude day to day as a software engineer.
   Planned as a separate deck, probably a separate repo, built with the same stack.
   The plan below came from one Claude session; another session has its own plan. Reconcile the two
   with Daniel before building anything.

## This repo

Live at https://sutantyo.github.io/ai-essentials-interactive/ (public repo `sutantyo/ai-essentials-interactive`).

| Path | What it is |
|---|---|
| `slides/slides.md` | The deck ([Slidev](https://sli.dev) v53, Vue 3 + Vite), 24 slides |
| `slides/components/` | Vue 3 + TypeScript components used as tags in slides (`<LiveNetwork />`, `<ShiftDemo />`, …) |
| `slides/lib/net.ts` | The 784 → 16 → 16 → 10 network in plain TypeScript: forward pass, MNIST-style preprocessing, helpers |
| `slides/public/models/` | Trained models and sample digits as JSON, fetched at runtime |
| `slides/style.css` | Design tokens and global slide styles |
| `digits/train.py` | Python + NumPy training on MNIST; exports everything in `slides/public/models/` and prints the stats the slides quote |
| `digits/build.py` | Builds the standalone draw-a-digit page at `slides/public/digits/index.html` |
| `.github/workflows/pages.yml` | Builds and deploys to GitHub Pages on every push to `main` |

Commands:

- `cd slides && npm install && npm run dev` (deck at http://localhost:3030, presenter view at `/presenter/`)
- `cd slides && npx slidev build` (production build, also run by CI)
- `cd digits && python train.py` (needs numpy; downloads MNIST on first run; retrains all models in seconds)

Deck order: title → AI vs ML → postcodes → input (784 numbers) → output → why not rules → network →
neuron (sliders) → watch it think (draw) → training data → 13,002 knobs → watch it learn (training snapshots) →
garbage in, garbage out (5 networks) → how we trained it → pixels not shapes (shift slider) → the clean-up →
only knows what it learned from → please explain (weights) → confidently mistaken (noise) →
from digits to code → one token at a time → same idea, much bigger → confidently mistaken in code → close.

### Design

Graph-paper background (intentional: the lecture is about digits on a 28×28 grid; a design-check plugin flags
it and Daniel chose to keep it). Tokens in `style.css`: paper `#FBFCFE`, grid `#E3EAF6`, ink `#16233F`,
graphite `#5E6878`, highlighter `#FFD93B` (strongest activation / top answer), red pen `#D62839`
(only for "wrong" moments, in the Caveat font). Body font Schibsted Grotesk, code JetBrains Mono.

### Lessons learned (read before editing)

- Every number on a slide must come from a real run. `train.py` prints them; re-check after retraining.
  Claims were wrong twice before testing: a crossed 7 was read correctly (example dropped), and MNIST's
  test digits come from *different* writers than the training digits.
- Slidev class-name clashes: don't use `statement` (a built-in layout class) or `slider` as class names.
  The default theme greys out the first `p` after an `h1`; `style.css` overrides it.
- Fetch public files via `import.meta.env.BASE_URL` so the site works under `/ai-essentials-interactive/`.
- Pages: the workflow builds with `--base /<repo>/` and copies `index.html` to `404.html` so direct slide
  links (`/12`) load. They return HTTP 404 but render the deck, which is expected.
- Code font ligatures are turned off (`==` and `->` render as symbols otherwise, confusing beginners).
- Browser checks: Playwright from inside `slides/` (`playwright-chromium` is a dev dependency). Slidev keeps
  neighbouring slides in the DOM, hidden, so use `>> visible=true` locators. "Wake Lock permission denied"
  in headless Chromium is harmless.
- Commit and push only when Daniel asks.

## Daniel's talk: plan so far

**Audience:** prospective or entry-level university students who have done a little coding
(short snippets are fine; "function", "bug" need no explanation). **Length:** 20 minutes, which is tight.
**Story:** a realistic day. Daniel makes the decisions and checks the work; Claude speeds him up.
Honest about where it goes wrong. Machine learning theory is out of scope (that's Doche's deck).

**Daniel's own lines (keep his wording):**

- **Coding ≠ Typing.** "I'm still coding, I'm just not typing." Proposed as the headline.
- **Claude is a smart Google.** Google gives you ten links; Claude reads *your* code and answers *your* question.
- **100 vs 50.** In his field he's 100 and Claude is 50 (it makes mistakes). In fields where he's 0, a 50 is a big help.
  **The catch, used as the pivot:** at 0 you can't tell when the 50 is wrong, which is why the degree matters:
  it takes you from 0 to 100.

**Sections and decisions:**

- **Skills: keep as a real section.** Claude starts every session knowing nothing, so a skill is written
  instructions handed over up front (a recipe card). Students can do this on day one.
- **MCP: cut to a demo.** A full MCP section is too advanced. Keep the **Blender MCP** demo
  (community server `blender-mcp` + Blender add-on; check current install steps): Claude builds a 3D scene
  from plain English, then a follow-up ("make the mug red, add a plant"). Message: Claude plugs into other
  programs, not just code. Likely an embedded screen recording, since live it's slow and needs Blender running.
- **Backup slide for "why not just use an API?"** In Daniel's framing, an MCP server is an interface built
  for the agent: you choose what it can do (expose reads, no delete) and can combine several API calls into
  one tool (orchestration). Careful wording: APIs have authentication too; the difference is who it's
  designed for, and the limits exist only because you design them in. Analogies: USB-C (one standard plug);
  "the API is the kitchen, MCP is the menu".
- **The deck is a website, so use it:** an "after the talk" section past the closing slide, reached by QR code,
  holds what doesn't fit (MCP details, setup guide, first skill, prompts Daniel uses, extra stories).

**Ideas for showing how Claude Code works** (the slides can run real code, so they can *show* it):

1. **Session replay:** a real recorded Claude Code session (sessions are saved as JSONL under
   `~/.claude/projects/`), stepped through on clicks: the terminal on one side, a plain-English line per step
   on the other. Faithful, and can't fail on stage.
2. **Agent loop diagram** lit up in step with the replay: request → decide → use a tool → look at result → repeat.
   "Inside, the model writes one token at a time in a loop; outside, Claude Code uses one tool at a time in a loop."
3. **Context meter:** starts empty and fills with labelled blocks as Claude reads files (CLAUDE.md, a skill,
   source files, test output). Shows why skills and context matter.
4. **App growing beside the code:** for a build like Wordle, the app as it was at each step.
5. **Spot the bug:** pause on a real edit and let the room find the mistake, then reveal the test.
   Good candidate: Wordle's repeated-letter rule (answer `ABIDE`, guess `SPEED`: only one E is coloured).
6. **"Allow this?"** stop at a permission prompt and let the room decide.
7. **You be Claude:** the room picks the next tool to use.

Suggested core: 1 + 2 + 3 as one component, plus 4 and 5.

**Wordle as the demo app:** build it from scratch with Claude and use it to show vague vs precise prompts,
the repeated-letter check, and that Claude handles famous tasks easily but struggles with novel twists.
`~/repos/uni/wordle-clone` may be Daniel's own hand-written version, which would allow a before/after
("this took me hours; this took two minutes; the checking still took me"). Not yet confirmed.

**Draft 20-minute budget:** 2 hook (Coding ≠ Typing) · 2 smart Google · 6 how Claude Code works (replay,
spot the bug) · 3 skills · 2 Blender · 3 100 vs 50 and the catch · 2 close + QR to extras.

**Open questions for Daniel:**

- Demos: replay in the slides, live in the terminal, or both (one live run that can be skipped)? He first chose
  live terminal demos, then leaned towards showing Claude Code inside the slides.
- The one thing students should remember (Coding ≠ Typing proposed), and which real story from his work to tell.
- Which recorded session to replay: Wordle from scratch, or a small change to an existing project.
- Repo name and whether the new deck lives in its own repo (recommended).

Earlier context: Doche (a possible co-speaker) wrote the theory lecture this repo remakes; whether the two
talks are combined, and how time is split, is undecided.
