<script setup lang="ts">
import { computed } from 'vue'
import { argmax } from '../lib/net'

// The 10 output neurons as bars. The strongest one is highlighted. values: null shows empty bars.
const props = defineProps<{ values: number[] | null }>()
const shown = computed(() => props.values ?? Array(10).fill(0))
const top = computed(() => (props.values ? argmax(props.values) : -1))
</script>

<template>
  <div class="bars">
    <template v-for="(v, d) in shown" :key="d">
      <span :class="{ top: d === top }">{{ d }}</span>
      <span class="bar" :class="{ top: d === top }"><span class="fill" :style="{ transform: `scaleX(${v})` }" /></span>
      <span :class="{ top: d === top }">{{ values ? `${Math.round(v * 100)}%` : '' }}</span>
    </template>
  </div>
</template>

<style scoped>
.bars { display: grid; grid-template-columns: 16px 190px 42px; gap: 5px 10px; align-items: center; font-variant-numeric: tabular-nums; }
.bar { height: 19px; background: var(--paper); box-shadow: inset 0 0 0 1px var(--grid); border-radius: 3px; overflow: hidden; }
.fill { display: block; height: 100%; background: var(--grid); transform-origin: left; transition: transform .15s; }
.bar.top .fill { background: var(--highlight); box-shadow: inset 0 0 0 1px var(--ink); }
.top { font-weight: 800; }
@media (prefers-reduced-motion: reduce) { .fill { transition: none; } }
</style>
