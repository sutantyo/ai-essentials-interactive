<script setup lang="ts">
// The digit network's output bars, reused for "which token comes next?". Probabilities are illustrative.
const props = defineProps<{ context: string, options: { token: string, p: number }[] }>()
const top = Math.max(...props.options.map(o => o.p))
</script>

<template>
  <div class="next-token">
    <pre class="context"><code>{{ context }}<span class="cursor">▌</span></code></pre>
    <div class="bars">
      <template v-for="o in options" :key="o.token">
        <code :class="{ top: o.p === top }">{{ o.token.replace(/ /g, '·') }}</code>
        <span class="bar" :class="{ top: o.p === top }"><span class="fill" :style="{ transform: `scaleX(${o.p})` }" /></span>
        <span class="pct" :class="{ top: o.p === top }">{{ Math.round(o.p * 100) }}%</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.next-token { display: flex; gap: 48px; align-items: center; }
.context { margin: 0; padding: 18px 22px; background: var(--paper); border: 1.5px solid var(--ink); border-radius: 6px; font-size: 1.3rem; line-height: 1.5; }
.context code { font-size: inherit; }
.cursor { color: var(--redpen); }
.bars { display: grid; grid-template-columns: auto 240px 48px; gap: 8px 14px; font-size: 1.1rem; align-items: center; font-variant-numeric: tabular-nums; }
.bars code { font-size: 1.15rem; background: none; padding: 0; }
.bar { height: 20px; background: var(--paper); box-shadow: inset 0 0 0 1px var(--grid); border-radius: 3px; overflow: hidden; }
.fill { display: block; height: 100%; background: var(--grid); transform-origin: left; }
.bar.top .fill { background: var(--highlight); box-shadow: inset 0 0 0 1px var(--ink); }
.top { font-weight: 800; }
</style>
