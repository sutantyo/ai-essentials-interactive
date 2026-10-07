<script setup lang="ts">
import DocViewer from './DocViewer.vue'
// A copy of the add-phrases skill from japanese-phrasebook-demo (.claude/skills/add-phrases/SKILL.md). It's copied,
// not read from there, because the deck's CI build only has this repo; re-copy it if the skill changes.
import raw from '../examples/add-phrases-SKILL.md?raw'

const sections = [
  { label: 'The description', from: (l: string) => l === '---' },
  { label: 'Show me first', from: (l: string) => l.startsWith('## 4.') },
  { label: 'Never', from: (l: string) => l === '## Never' },
]
</script>

<template>
  <DocViewer :text="raw" filename="add-phrases / SKILL.md" :sections="sections" caption="A skill from my Japanese phrasebook" />
</template>
