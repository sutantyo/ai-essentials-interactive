import { computed, reactive, ref } from 'vue'
import { useNav } from '@slidev/client'

// Every node on the hub tree. Core topics form the trunk (top to bottom, in talk order);
// optional topics branch off the core topic they belong to.
// `alias` is the `routeAlias` in the frontmatter of the topic's first slide.
// `x`, `y` place the node on the hub, in slide pixels (the slide is 980 x 552).
export interface Topic {
  id: string
  title: string
  teaser: string
  kind: 'core' | 'optional'
  alias: string
  x: number
  y: number
  parent?: string
  minutes?: number
}

export const TRUNK_X = 490
export const ROOT_Y = 26

export const TOPICS: Topic[] = [
  // The trunk: the talk, in order.
  { id: 'intro', kind: 'core', alias: 'intro', x: TRUNK_X, y: 100, minutes: 3,
    title: 'Introduction', teaser: 'Who I am, and have you heard about AI lately?' },
  { id: 'claude-code', kind: 'core', alias: 'claude-code', x: TRUNK_X, y: 192, minutes: 10,
    title: 'Claude Code', teaser: 'An AI that works on your computer, and a live change to a real game' },
  { id: 'beyond', kind: 'core', alias: 'beyond', x: TRUNK_X, y: 284, minutes: 5,
    title: 'Beyond coding', teaser: 'Directing a 3D scene in Blender' },
  { id: 'learning', kind: 'core', alias: 'learning', x: TRUNK_X, y: 376, minutes: 5,
    title: 'Learning backwards', teaser: 'Start from what you want, then fill in the gaps. And: 100 vs 50' },
  { id: 'close', kind: 'core', alias: 'close', x: TRUNK_X, y: 468, minutes: 2,
    title: 'Wrap-up', teaser: 'Coding ≠ Typing, one more time. Then your questions' },

  // The branches: optional side trips.
  { id: 'writing', kind: 'optional', alias: 'writing', parent: 'intro', x: 190, y: 160,
    title: 'The biggest change', teaser: 'Wiki pages, to-do lists and change notes, written by AI' },
  { id: 'scratch', kind: 'optional', alias: 'scratch', parent: 'claude-code', x: 200, y: 262,
    title: 'Wordle from scratch', teaser: 'A whole game from one sentence, in 97 seconds' },
  { id: 'skills', kind: 'optional', alias: 'skills', parent: 'claude-code', x: 790, y: 260,
    title: 'Skills', teaser: 'Recipe cards: instructions Claude reads before it starts' },
  { id: 'api', kind: 'optional', alias: 'api', parent: 'beyond', x: 210, y: 356,
    title: 'Why not just an API?', teaser: 'What MCP adds: a menu, not the whole kitchen' },
  { id: 'spot-bug', kind: 'optional', alias: 'spot-bug', parent: 'learning', x: 790, y: 448,
    title: 'Spot the bug', teaser: 'Can you tell when the 50 is wrong?' },
]

// How far below its talking point a branch runs sideways, so it passes under the point's label.
export const BRANCH_OFFSET = 30

// A branch grows out of the centre of its talking point: 45 degrees down and outwards,
// sideways, then 45 degrees down into the side-trip node (circuit-board style).
export function branchPath(t: Topic) {
  const parent = TOPICS.find(p => p.id === t.parent)!
  const side = t.x > TRUNK_X ? 1 : -1
  const runY = parent.y + BRANCH_OFFSET
  const drop = t.y - runY
  return `M ${TRUNK_X} ${parent.y} L ${TRUNK_X + side * BRANCH_OFFSET} ${runY} H ${t.x - side * drop} L ${t.x} ${t.y}`
}

// --- What's been visited (shared by the hub and the back-to-hub button) ----------------------

export const visited = reactive(new Set<string>())
export const lastTopic = ref<string | null>(null)

// For each topic: its first slide number, and how many slides it has.
// A topic runs from its first slide up to the next topic's first slide.
export function useTopicSlides() {
  const { slides, currentSlideNo } = useNav()

  const ranges = computed(() => {
    const starts = TOPICS
      .map(t => ({ id: t.id, no: slides.value.find(s => s.meta.slide?.frontmatter.routeAlias === t.alias)?.no }))
      .filter((s): s is { id: string, no: number } => s.no !== undefined)
      .sort((a, b) => a.no - b.no)
    const hubNo = slides.value.find(s => s.meta.slide?.frontmatter.routeAlias === 'hub')?.no
    return starts.map((s, i) => {
      let end = (starts[i + 1]?.no ?? slides.value.length + 1) - 1
      if (hubNo && hubNo > s.no && hubNo <= end) end = hubNo - 1
      return { ...s, count: end - s.no + 1, end }
    })
  })

  const currentTopic = computed(() =>
    ranges.value.find(r => currentSlideNo.value >= r.no && currentSlideNo.value <= r.end)?.id ?? null)

  return { ranges, currentTopic }
}
