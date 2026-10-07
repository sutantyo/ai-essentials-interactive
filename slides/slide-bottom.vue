<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { TOPICS, useTopicSlides } from './topics'

// Drawn underneath each slide (not the whole page), so each slide keeps its own background during a transition.
// Slides in an optional section get a warm paper background (--optional-bg in style.css).
const { $page } = useSlideContext()
const { ranges } = useTopicSlides()

const optional = computed(() => {
  const r = ranges.value.find(r => $page.value >= r.no && $page.value <= r.end)
  return !!(r && TOPICS.find(t => t.id === r.id)?.optional)
})
</script>

<template>
  <div v-if="optional" class="optional-bg" />
</template>

<style scoped>
/* z-index -1: behind every part of the slide, positioned or not, but still above the page. */
.optional-bg { position: absolute; inset: 0; z-index: -1; background: var(--optional-bg); pointer-events: none; }
</style>
