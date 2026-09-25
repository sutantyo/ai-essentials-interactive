<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import samples from '../public/models/samples.json'
import shiftStats from '../public/models/shift-stats.json'
import { forward, loadModel, shiftRight, type Model } from '../lib/net'

// Slide a real test digit sideways and watch the trained network lose track of it.
const k = ref(0)
const model = shallowRef<Model>()
onMounted(async () => { model.value = await loadModel('trained') })
const pixels = computed(() => shiftRight(samples.seven, k.value))
const output = computed(() => (model.value ? forward(model.value, pixels.value)[3] : null))
const overall = computed(() => Math.round((shiftStats as Record<string, number>)[String(k.value)] * 100))
</script>

<template>
  <div class="shift-demo">
    <div>
      <DigitImage :pixels="pixels" :size="200" />
      <label class="shift-control">
        <span>Moved <b>{{ k }}</b> {{ k === 1 ? 'pixel' : 'pixels' }} to the right</span>
        <input v-model.number="k" type="range" min="0" max="6" step="1">
      </label>
    </div>
    <OutputBars :values="output" />
    <div class="overall">
      <p>All 10,000 test digits, moved the same amount</p>
      <p class="score">{{ overall }}% correct</p>
    </div>
  </div>
</template>

<style scoped>
.shift-demo { display: flex; gap: 48px; align-items: flex-start; font-size: 1rem; }
.shift-control { display: flex; flex-direction: column; margin-top: 12px; width: 200px; }
.shift-control span { color: var(--graphite); }
.shift-control b { color: var(--ink); }
input[type=range] { accent-color: var(--ink); }
input:focus-visible { outline: 3px solid var(--redpen); outline-offset: 2px; }
.overall p { margin: 0 !important; color: var(--graphite) !important; max-width: 16ch; }
.overall .score { font-size: 2.6rem; font-weight: 800; color: var(--ink) !important; line-height: 1.1; margin-top: 8px !important; max-width: none; font-variant-numeric: tabular-nums; }
</style>
