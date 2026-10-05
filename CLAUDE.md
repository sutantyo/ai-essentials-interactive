# CLAUDE.md

Context for Claude sessions working in this repo: Daniel's talk on how he uses Claude day to day as a
software engineer. The deck is at the placeholder stage. The plan is agreed: the full design is in
`docs/superpowers/specs/2026-10-06-coding-not-typing-design.md` (two earlier session plans, reconciled with Daniel
on 2026-10-06). Next step: an implementation plan for the first build (hub skeleton + starter slides).

## Repo

Public repo `sutantyo/ai-essentials-interactive` (name left over from an earlier deck; renaming changes the
Pages URL). Live at https://sutantyo.github.io/ai-essentials-interactive/.

| Path | What it is |
|---|---|
| `slides/slides.md` | The deck ([Slidev](https://sli.dev) v53, Vue 3 + Vite). Currently one placeholder slide; design in `docs/superpowers/specs/` |
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

## The talk: agreed plan (summary of the spec)

**Audience:** university students with **little to no coding background**. No code on slides beyond plain-English
prompts; explain terms like file, terminal, app. **Length:** 25 minutes core, plus up to 5 flexible minutes
covered by optional topics. **Main message:** software engineering is still worth learning, because the skill has
moved from typing to directing and judging. Secondary: use AI well for your own learning.

**Daniel's own lines (keep his wording):**

- **Coding ≠ Typing.** "I'm still coding, I'm just not typing." The title and headline.
- **Claude is a smart Google.** Google gives you ten links; Claude reads *your* code and answers *your* question.
- **100 vs 50.** In his field he's 100 and Claude is 50 (it makes mistakes). In fields where he's 0, a 50 is a big help.
  **The catch, used as the pivot:** at 0 you can't tell when the 50 is wrong, which is why the degree matters:
  it takes you from 0 to 100.

**Structure: a hub.** A table-of-contents slide Daniel can return to (`H`) and start the next topic from. The linear
order is the core talk; optional topics sit after the closing slide and double as "after the talk" extras
reached by QR code.

| Topic | | Content |
|---|---|---|
| 1. Coding ≠ Typing | core ~3 | The hook; his working day; smart Google |
| 2. Beyond the chat box | core ~8 | Web chat vs Claude Code doing the work on your machine; the live demo |
| 3. Director, not typist | core ~7 | Higgsfield analogy: reference pictures beat a long prompt; context beats description |
| 4. Learning backwards | core ~6 | Dependency graph: top-down reading (BFS) vs working back from the goal; then 100 vs 50 |
| Close | core ~1–2 | Coding ≠ Typing again, QR code, Q&A |
| 5. Skills | optional | The recipe card: written context handed over up front |
| 6. Demo, round two | optional | More screenshots of the detailed-prompt build |
| 7. Blender | optional | Directing a 3D scene via `blender-mcp`; details deferred, placeholder for now |

**Demo pattern:** a kick-off slide with the simple prompt, which Daniel runs live and leaves running; screenshot
slides of a detailed, well-directed build done earlier (can't be done live); a check-back slide to look at the live
result. What gets built live is still to be chosen (small, visual, a few minutes).

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
- **Wordle** as a demo app; `~/repos/uni/wordle-clone` may be Daniel's hand-written version (not confirmed).
- **"Why not just use an API?"** backup slide for MCP: an MCP server is an interface designed for the agent; you
  choose what it can do (reads, no delete) and can combine several API calls into one tool. APIs have
  authentication too; the difference is who it's designed for. Analogies: USB-C; "the API is the kitchen, MCP is
  the menu".

**Open questions for Daniel:**

- What to build in the live demo, and which real build to screenshot.
- Which real story from his work to tell in topic 1.
- The dependency graph's example (a real book or course?) and how it animates.
- Blender details; visual design (not started); whether to rename the repo.
