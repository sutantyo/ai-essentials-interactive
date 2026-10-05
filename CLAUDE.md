# CLAUDE.md

Context for Claude sessions working in this repo: Daniel's talk on how he uses Claude day to day as a
software engineer. The deck is at the placeholder stage. The plan below came from one Claude session;
another session has its own plan. Reconcile the two with Daniel before building anything.

## Repo

Public repo `sutantyo/ai-essentials-interactive` (name left over from an earlier deck; renaming changes the
Pages URL). Live at https://sutantyo.github.io/ai-essentials-interactive/.

| Path | What it is |
|---|---|
| `slides/slides.md` | The deck ([Slidev](https://sli.dev) v53, Vue 3 + Vite). Currently one placeholder slide |
| `slides/components/` | (to create) Vue 3 + TypeScript components, used as tags in slides |
| `slides/public/` | (to create) static files, e.g. recorded sessions as JSON, videos |
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

## The talk: plan so far

**Audience:** prospective or entry-level university students who have done a little coding
(short snippets are fine; "function", "bug" need no explanation). **Length:** 20 minutes, which is tight.
**Story:** a realistic day. Daniel makes the decisions and checks the work; Claude speeds him up.
Honest about where it goes wrong.

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
- Visual design (not started), and whether to rename the repo.
