<script setup lang="ts">
import DocViewer from './DocViewer.vue'
// This repo's own CLAUDE.md, read at build time, so the slide always shows the current note.
import raw from '../../CLAUDE.md?raw'

const sections = [
  { label: 'What it is', from: (l: string) => l.startsWith('Context for Claude') },
  { label: 'Where things are', from: (l: string) => l === '## Repo' },
  { label: "The don'ts", from: (l: string) => l.startsWith('### Lessons learned') },
]
</script>

<template>
  <DocViewer :text="raw" filename="CLAUDE.md" :sections="sections" caption="The note this deck's own project leaves for Claude" />
</template>
