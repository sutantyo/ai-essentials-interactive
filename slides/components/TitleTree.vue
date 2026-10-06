<script setup lang="ts">
import { branchPath, ROOT_Y, TOPICS, TRUNK_X } from '../topics'

// A small, label-free copy of the hub tree for the title slide: same shape, same colours.
const core = TOPICS.filter(t => t.kind === 'core')
const optional = TOPICS.filter(t => t.kind === 'optional')
const bottom = Math.max(...core.map(t => t.y))
</script>

<template>
  <svg class="title-tree" viewBox="150 0 680 500" aria-hidden="true">
    <rect :x="TRUNK_X - 70" :y="ROOT_Y - 9" width="140" height="9" rx="4.5" fill="#c9d6d8" />
    <!-- branches first, so the orange sits underneath the trunk -->
    <path v-for="(t, i) in optional" :key="t.id" :d="branchPath(t)" pathLength="1" class="trace branch"
      :style="{ animationDelay: `${0.6 + i * 0.12}s` }" />
    <path :d="`M ${TRUNK_X} ${ROOT_Y} V ${bottom}`" pathLength="1" class="trace trunk" />
    <g v-for="(t, i) in TOPICS" :key="'n' + t.id" class="node" :class="t.kind"
      :style="{ animationDelay: `${0.4 + i * 0.1}s` }">
      <circle :cx="t.x" :cy="t.y" :r="t.kind === 'core' ? 15 : 12" class="ring" />
      <circle :cx="t.x" :cy="t.y" :r="t.kind === 'core' ? 6 : 5" class="pip" />
    </g>
  </svg>
</template>

<style scoped>
.title-tree { position: absolute; right: 24px; top: 50%; transform: translateY(-50%); width: 46%; height: auto; }
.trace { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: draw 1s ease-out forwards; }
.trunk { stroke: #0f4c5c; stroke-width: 9; }
.branch { stroke: #f28c38; stroke-width: 4; opacity: 0.85; }
.node { opacity: 0; animation: appear 0.35s ease-out forwards; }
.ring { fill: #fff; stroke-width: 5; }
.core .ring { stroke: #13a89e; }
.optional .ring { stroke: #f28c38; }
.core .pip { fill: #13a89e; }
.optional .pip { fill: #f28c38; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes appear { to { opacity: 1; } }
</style>
