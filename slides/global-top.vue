<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import { deadEnd, deadEndAt, lastClicks, lastSlideNo, lastTopic, TOPICS, useTopicSlides, visited } from './topics'

// Drawn on top of every slide. It:
// - records which topic you're in (for the hub's filled dots and lit trunk),
// - marks sub-sections by switching the accent colour to orange (style.css),
// - shows the section name top-right and a small "Map" button bottom-right.
const { go, clicks, currentSlideNo, currentSlideRoute } = useNav()
const { currentTopic } = useTopicSlides()

const topic = computed(() => TOPICS.find(t => t.id === currentTopic.value) ?? null)
// "Claude Code · Skills" on a sub-section, with "Optional · " in front if it's optional.
const crumb = computed(() => {
  const t = topic.value
  if (!t) return ''
  const parent = TOPICS.find(p => p.id === t.parent)
  return [t.optional ? 'Optional' : '', parent?.title, t.title].filter(Boolean).join(' · ')
})

watch(currentTopic, id => {
  if (id) { visited.add(id); lastTopic.value = id }
}, { immediate: true })

watch(topic, t => {
  if (typeof document !== 'undefined')
    document.documentElement.dataset.topicKind = t?.kind ?? 'core'
}, { immediate: true })

const onHub = computed(() => currentSlideRoute.value?.meta.slide?.frontmatter.routeAlias === 'hub')

// Remember the last slide outside the map (and how far into its reveals), so ← on the map can go back to it.
watch([currentSlideNo, clicks], ([no, c]) => {
  if (!onHub.value) { lastSlideNo.value = no; lastClicks.value = c }
}, { immediate: true })

// At a section's edge the keys do nothing; the Map button pulses and a note says why.
const nudging = ref(false)
let nudgeTimer: ReturnType<typeof setTimeout> | undefined
watch(deadEnd, () => {
  nudging.value = false
  requestAnimationFrame(() => { nudging.value = true })
  clearTimeout(nudgeTimer)
  nudgeTimer = setTimeout(() => { nudging.value = false }, 1600)
})
</script>

<template>
  <!-- section marker: name, ring node, and a trace running off the edge -->
  <div v-if="!onHub && topic" class="crumb" :class="topic.kind">
    <span class="crumb-label">{{ crumb }}</span>
    <svg width="132" height="40" viewBox="0 0 132 40" aria-hidden="true">
      <path d="M 18 12 H 64 L 84 32 H 132" class="trace" />
      <path d="M 70 4 H 132" class="trace faint" />
      <circle cx="10" cy="12" r="6.5" class="ring" />
      <circle cx="98" cy="32" r="3.5" class="pip" />
    </svg>
  </div>

  <Transition name="note">
    <div v-if="nudging && !onHub" class="edge-note">{{ deadEndAt === 'end' ? 'End' : 'Start' }} of section · <kbd>H</kbd> for the map</div>
  </Transition>

  <button v-if="!onHub" class="to-hub" :class="{ nudge: nudging }" title="Back to the map (H)" @click="go('hub')">
    <!-- a mini version of the hub tree: trunk, two branches, ring nodes -->
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M10 19V4M10 14H6L4 12M10 9h4l2-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="10" cy="3" r="2.2" fill="#fff" stroke="currentColor" stroke-width="1.8" />
      <circle cx="3.5" cy="11.5" r="2" fill="#fff" stroke="#f28c38" stroke-width="1.8" />
      <circle cx="16.5" cy="6.5" r="2" fill="#fff" stroke="#f28c38" stroke-width="1.8" />
    </svg>
    <span>Map</span>
  </button>
</template>

<style scoped>
.crumb { position: absolute; top: 22px; right: 0; z-index: 5; display: flex; align-items: flex-start; gap: 8px;
  pointer-events: none; --c: #13a89e; }
.crumb.sub { --c: #f28c38; }
.crumb-label { margin-top: 2px; font-size: 13px; font-weight: 600; letter-spacing: 0.03em; color: #58737a; }
.crumb .trace { fill: none; stroke: var(--c); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.crumb .trace.faint { opacity: 0.3; }
.crumb .ring { fill: #fff; stroke: var(--c); stroke-width: 3.5; }
.crumb .pip { fill: var(--c); opacity: 0.6; }

.to-hub { position: absolute; right: 16px; bottom: 14px; z-index: 10; display: flex; align-items: center; gap: 6px;
  padding: 5px 11px 5px 9px; border: 1px solid #cfe3e1; border-radius: 999px; background: rgba(255, 255, 255, 0.7);
  color: #13a89e; font-family: inherit; font-size: 13px; font-weight: 600; line-height: 1; letter-spacing: 0.02em;
  cursor: pointer; opacity: 0.6; transition: opacity 0.2s, background 0.2s, border-color 0.2s; }
.to-hub:hover { opacity: 1; background: #e9f7f5; border-color: #13a89e; }
.to-hub.nudge { opacity: 1; border-color: #13a89e; animation: nudge 0.8s ease-out 2; }
@keyframes nudge { 0% { box-shadow: 0 0 0 0 rgba(19, 168, 158, 0.55); } 100% { box-shadow: 0 0 0 12px rgba(19, 168, 158, 0); } }

.edge-note { position: absolute; right: 100px; bottom: 19px; z-index: 10; font-size: 13px; color: #58737a;
  pointer-events: none; }
.edge-note kbd { font: inherit; font-weight: 700; padding: 0 5px; border: 1px solid #c9d6d8; border-radius: 4px;
  background: #fff; }
.note-enter-active, .note-leave-active { transition: opacity 0.25s, transform 0.25s; }
.note-enter-from, .note-leave-to { opacity: 0; transform: translateX(8px); }
</style>
