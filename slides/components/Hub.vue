<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useNav } from '@slidev/client'
import { branchPath, labelAbove, lastTopic, ROOT_Y, TOPICS, TRUNK_X, useTopicSlides, visited } from '../topics'
import type { Topic } from '../topics'

const W = 980
const H = 552
const { go } = useNav()
const { ranges } = useTopicSlides()

const core = TOPICS.filter(t => t.kind === 'core')
const subs = TOPICS.filter(t => t.kind === 'sub')
const byId = Object.fromEntries(TOPICS.map(t => [t.id, t]))
const bottom = Math.max(...core.map(t => t.y))

// Decoration only: short traces near the root and crown that make it read as a circuit.
const decor = [
  { d: `M ${TRUNK_X - 24} ${ROOT_Y} V 38 L 452 52 H 340`, dot: [340, 52] },
  { d: `M ${TRUNK_X + 24} ${ROOT_Y} V 38 L 528 52 H 640`, dot: [640, 52] },
]

// The trunk lights up from the root to the furthest core topic visited so far.
const litY = computed(() => {
  const ys = core.filter(t => visited.has(t.id)).map(t => t.y)
  return ys.length ? Math.max(...ys) : null
})

// The tree grows once per session; after that it's just there.
const grown = ref(sessionStorageGet())
onMounted(() => setTimeout(() => { grown.value = true; sessionStorageSet() }, 2600))
function sessionStorageGet() { try { return sessionStorage.getItem('hub-grown') === '1' } catch { return false } }
function sessionStorageSet() { try { sessionStorage.setItem('hub-grown', '1') } catch {} }

const hovered = ref<string | null>(null)

// Sub-sections stay folded away until you hover their main point, then radiate out.
// They stay out while the pointer is on the point, its traces or its sub-sections, and fold back shortly after.
const open = ref<string | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | undefined
function openBranches(id: string) { clearTimeout(closeTimer); open.value = id }
function closeSoon() { clearTimeout(closeTimer); closeTimer = setTimeout(() => { open.value = null }, 350) }

// Details card: sub-sections only (main points just grow and open their branches).
const hoveredTopic = computed(() => (hovered.value && byId[hovered.value].kind === 'sub' ? byId[hovered.value] : null))

function slidesIn(id: string) {
  const n = ranges.value.find(r => r.id === id)?.count
  return n ? `${n} slide${n > 1 ? 's' : ''}` : ''
}
function meta(t: Topic) {
  const part = t.parent ? `${t.optional ? 'Optional · part' : 'Part'} of ${byId[t.parent].title}` : ''
  return [t.kind === 'core' ? (t.minutes ? `~${t.minutes} min` : '') : part, slidesIn(t.id)]
    .filter(Boolean).join(' · ')
}
</script>

<template>
  <div class="hub" :class="{ grown }">
    <svg :viewBox="`0 0 ${W} ${H}`" class="tree" aria-label="Talk map">
      <defs>
        <!-- sized from the whole picture: a straight vertical line has zero width, which would hide it -->
        <filter id="glow" filterUnits="userSpaceOnUse" :x="0" :y="0" :width="W" :height="H">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <!-- base and decoration -->
      <rect :x="TRUNK_X - 70" :y="ROOT_Y - 9" width="140" height="9" rx="4.5" class="base" />
      <g v-for="(p, i) in decor" :key="'d' + i" class="decor">
        <path :d="p.d" pathLength="1" class="trace" :style="{ animationDelay: `${0.2 + i * 0.15}s` }" />
        <circle :cx="p.dot[0]" :cy="p.dot[1]" r="5" class="pop" :style="{ animationDelay: `${0.9 + i * 0.15}s` }" />
      </g>

      <!-- sub-sections: folded away until you hover their main point, then they radiate out.
           Drawn first, so the orange always sits underneath the trunk and the talking points. -->
      <g
        v-for="t in subs" :key="'b' + t.id"
        class="branch-group" :class="{ open: open === t.parent, visited: visited.has(t.id) }"
        @mouseenter="openBranches(t.parent!)" @mouseleave="closeSoon"
      >
        <!-- optional: a thin dashed halo, drawn under the line so the line meets a solid ring -->
        <circle v-if="t.optional" :cx="t.x" :cy="t.y" r="19" class="halo" :style="{ transformOrigin: `${t.x}px ${t.y}px` }" />
        <path :d="branchPath(t)" class="branch-hit" />
        <path :d="branchPath(t)" pathLength="1" class="branch" />
        <g
          class="node sub" :class="{ 'is-optional': t.optional, visited: visited.has(t.id), here: lastTopic === t.id, hover: hovered === t.id }"
          tabindex="0" role="link" :aria-label="t.title"
          @mouseenter="hovered = t.id" @mouseleave="hovered = null"
          @focus="openBranches(t.parent!); hovered = t.id" @blur="hovered = null; closeSoon()"
          @click="go(t.alias)" @keydown.enter="go(t.alias)"
        >
          <circle :cx="t.x" :cy="t.y" r="26" class="hit" />
          <g class="pop" :style="{ transformOrigin: `${t.x}px ${t.y}px` }">
            <circle :cx="t.x" :cy="t.y" r="12" class="ripple" />
            <g class="dot" :style="{ transformOrigin: `${t.x}px ${t.y}px` }">
              <circle :cx="t.x" :cy="t.y" r="12" class="ring" />
              <circle :cx="t.x" :cy="t.y" r="5" class="core-dot" />
            </g>
          </g>
          <text :x="t.x" :y="labelAbove(t) ? t.y - (t.optional ? 30 : 22) : t.y + (t.optional ? 41 : 33)" text-anchor="middle" class="label opt-label">{{ t.title }}</text>
        </g>
      </g>

      <!-- the trunk: the core talk -->
      <path :d="`M ${TRUNK_X} ${ROOT_Y} V ${bottom}`" pathLength="1" class="trace trunk" />
      <path v-if="litY !== null" :d="`M ${TRUNK_X} ${ROOT_Y} V ${litY}`" class="lit" filter="url(#glow)" />

      <!-- the talking points -->
      <g
        v-for="(t, i) in core" :key="t.id"
        class="node core" :class="{ visited: visited.has(t.id), here: lastTopic === t.id, hover: hovered === t.id }"
        :style="{ animationDelay: `${0.3 + i * 0.12}s` }"
        tabindex="0" role="link" :aria-label="t.title"
        @mouseenter="hovered = t.id; openBranches(t.id)" @mouseleave="hovered = null; closeSoon()"
        @focus="hovered = t.id; openBranches(t.id)" @blur="hovered = null; closeSoon()"
        @click="go(t.alias)" @keydown.enter="go(t.alias)"
      >
        <circle :cx="t.x" :cy="t.y" r="26" class="hit" />
        <g class="dot" :style="{ transformOrigin: `${t.x}px ${t.y}px` }">
          <circle :cx="t.x" :cy="t.y" r="15" class="ring" />
          <circle :cx="t.x" :cy="t.y" r="6" class="core-dot" />
        </g>
        <text :x="t.x + 28" :y="t.y + 7" class="label core-label">{{ t.title }}</text>
      </g>
    </svg>

    <!-- details of whatever you're pointing at, in the empty top-right corner so it never covers the tree -->
    <Transition name="card">
      <div v-if="hoveredTopic" :key="hoveredTopic.id" class="card" :class="hoveredTopic.kind">
        <div class="card-title">{{ hoveredTopic.title }}</div>
        <div class="card-teaser">{{ hoveredTopic.teaser }}</div>
        <div class="card-meta">{{ meta(hoveredTopic) }}</div>
      </div>
    </Transition>

    <div class="title">Coding ≠ Typing</div>
    <div class="legend">
      <span><i class="key core" /> main points</span>
      <span><i class="key sub" /> sections</span>
      <span><i class="key sub is-optional" /> optional</span>
    </div>
    <div class="hint">Press <kbd>H</kbd> to return here</div>
  </div>
</template>

<style scoped>
.hub {
  --trunk: #0f4c5c; --core: #13a89e; --sub: #f28c38; --decor: #a7d7d4; --lit: #2ee6d6; --ink: #12313a;
  position: absolute; inset: 0; background: radial-gradient(circle at 50% 60%, #f4fbfa 0%, #ffffff 70%);
  font-family: inherit;
}
.tree { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }

.base { fill: #c9d6d8; }
.decor path { stroke: var(--decor); stroke-width: 3; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.decor circle { fill: none; stroke: var(--decor); stroke-width: 3; }

.trace { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: draw 0.9s ease-out forwards; }
.trunk { stroke: var(--trunk); stroke-width: 9; animation-duration: 1.1s; }
.branch { fill: none; stroke: var(--sub); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 0.2s ease-in, opacity 0.2s; }
/* opacity 0 while folded: Safari still paints a round cap for the zero-length dash, leaving a stray dot. */
.branch-hit { fill: none; stroke: transparent; stroke-width: 26; }
.branch-group .pop { transform-box: view-box; transform: scale(0); transition: transform 0.15s ease-in, opacity 0.2s; }
.branch-group .opt-label { opacity: 0; transition: opacity 0.12s; }
.ripple { fill: none; stroke: var(--sub); stroke-width: 3; opacity: 0; transform-box: fill-box; transform-origin: center; }

/* Radiating out: the trace draws from the trunk, then the dot pops in with a ripple, then the label. */
.branch-group.open .branch { stroke-dashoffset: 0; opacity: 1; transition: stroke-dashoffset 0.45s cubic-bezier(0.2, 0.7, 0.3, 1); }
.branch-group.open .pop { transform: scale(1); opacity: 1; transition: transform 0.32s cubic-bezier(0.3, 1.6, 0.5, 1) 0.36s; }
.branch-group.open .ripple { animation: ripple 0.7s ease-out 0.42s; }
.branch-group.open .opt-label { opacity: 1; transition: opacity 0.25s 0.5s; }

/* Sub-sections already done stay out, faded, so the map remembers them. */
.branch-group.visited:not(.open) .branch { stroke-dashoffset: 0; opacity: 0.35; }
.branch-group.visited:not(.open) .pop { transform: scale(1); opacity: 0.5; }
.branch-group.visited:not(.open) .opt-label { opacity: 0.5; }

/* Folded-away sub-sections can't be hovered or clicked. */
.branch-group:not(.open):not(.visited) .node,
.branch-group:not(.open):not(.visited) .branch-hit { pointer-events: none; }
.lit { stroke: var(--lit); stroke-width: 4; fill: none; stroke-linecap: round; }

.node { cursor: pointer; outline: none; opacity: 0; animation: appear 0.35s ease-out forwards; }
.hit { fill: transparent; }
.dot { transform-box: view-box; transition: transform 0.2s cubic-bezier(0.3, 1.6, 0.5, 1); }
.node.hover .dot { transform: scale(1.45); }
.ring { fill: #fff; stroke-width: 5; }
.core .ring { stroke: var(--core); }
.sub .ring { stroke: var(--sub); }
.halo { fill: none; stroke: var(--sub); stroke-width: 2; stroke-dasharray: 3 3.6; transform-box: view-box;
  transform: scale(0); transition: transform 0.15s ease-in, opacity 0.2s; }
.branch-group.open .halo { transform: scale(1); transition: transform 0.32s cubic-bezier(0.3, 1.6, 0.5, 1) 0.4s; }
.branch-group.visited:not(.open) .halo { transform: scale(1); opacity: 0.5; }
.core-dot { fill: currentColor; }
.core .core-dot { color: var(--core); }
.sub .core-dot { color: var(--sub); }
.node.visited.core .ring { fill: var(--core); }
.node.visited.sub .ring { fill: var(--sub); }
.node.visited .core-dot { fill: #fff; }
.node.here .ring { animation: pulse 1.6s ease-in-out infinite; }

.label { fill: var(--ink); font-weight: 700; transition: fill 0.2s; }
.core-label { font-size: 21px; }
.opt-label { font-size: 15px; font-weight: 600; fill: #6b4a2e; }
.node.hover .label { fill: #000; }

.grown .trace { animation: none; stroke-dashoffset: 0; }
.grown .node { animation: none; opacity: 1; }

.card { position: absolute; top: 22px; right: 26px; width: 270px; padding: 10px 14px; border-radius: 10px; background: #fff;
  box-shadow: 0 8px 24px rgba(15, 76, 92, 0.18); border-top: 4px solid var(--core); pointer-events: none; z-index: 2; }
.card.sub { border-top-color: var(--sub); }
.card-title { font-weight: 700; font-size: 16px; color: var(--ink); }
.card-teaser { font-size: 13.5px; line-height: 1.35; color: #34515a; margin-top: 3px; }
.card-meta { font-size: 12px; color: #7a9198; margin-top: 6px; }
.card-enter-active, .card-leave-active { transition: opacity 0.15s, margin-top 0.15s; }
.card-enter-from, .card-leave-to { opacity: 0; margin-top: -6px; }

.title { position: absolute; left: 32px; top: 24px; font-size: 26px; font-weight: 800; color: var(--trunk);
  letter-spacing: 0.01em; }
.legend { position: absolute; left: 32px; bottom: 18px; display: flex; gap: 18px; align-items: center;
  font-size: 12.5px; color: #58737a; }
.legend span { display: flex; align-items: center; gap: 6px; }
.key { display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 3px solid; background: #fff; }
.key.core { border-color: var(--core); }
.key.sub { border-color: var(--sub); }
.key.is-optional { outline: 1.5px dashed var(--sub); outline-offset: 2px; }
.hint { position: absolute; right: 32px; bottom: 18px; font-size: 12.5px; color: #8aa0a6; }
kbd { font: inherit; font-weight: 700; padding: 0 5px; border: 1px solid #c9d6d8; border-radius: 4px; background: #fff; }

@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes appear { from { opacity: 0; } to { opacity: 1; } }
@keyframes ripple { from { opacity: 0.8; transform: scale(1); } to { opacity: 0; transform: scale(2.6); } }
@keyframes pulse { 0%, 100% { stroke-opacity: 1; } 50% { stroke-opacity: 0.35; } }
.decor circle.pop { opacity: 0; animation: appear 0.3s ease-out forwards; }
.grown .decor circle.pop { animation: none; opacity: 1; }
</style>
