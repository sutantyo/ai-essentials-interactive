<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { argmax, forward, loadModel, type Model } from '../lib/net'

// Draw a digit and watch the whole network respond.
// models: the networks to choose between; control picks how the choice is shown.
interface Choice { name: string, label: string }
const props = withDefaults(defineProps<{ models?: Choice[], control?: 'none' | 'slider' | 'toggle' }>(), {
  models: () => [{ name: 'trained', label: 'Trained' }],
  control: 'none',
})

const selected = ref(0)
const model = shallowRef<Model>()
const input = shallowRef<number[] | null>(null)

async function load() { model.value = await loadModel(props.models[selected.value].name) }
onMounted(() => { load(); props.models.forEach(m => loadModel(m.name)) })
watch(selected, load)

const acts = computed(() => (model.value && input.value ? forward(model.value, input.value) : null))
const output = computed(() => acts.value?.[3] ?? Array(10).fill(0))
const top = computed(() => (acts.value ? argmax(output.value) : -1))
const hidden = computed(() => [1, 2].map(l => acts.value?.[l] ?? Array(16).fill(0)))
const pct = (v: number) => `${Math.round(v * 100)}%`
</script>

<template>
  <div class="live">
    <div v-if="control === 'slider'" class="control">
      <input v-model.number="selected" type="range" min="0" :max="models.length - 1" step="1" aria-label="Training progress">
      <div class="control-text">
        <strong>{{ models[selected].label }}</strong>
        <span v-if="model">Correct on {{ pct(model.accuracy) }} of 10,000 test digits it has never seen</span>
      </div>
    </div>
    <div v-else-if="control === 'toggle'" class="control" role="radiogroup">
      <button
        v-for="(m, i) in models" :key="m.name" role="radio" :aria-checked="selected === i"
        :class="{ on: selected === i }" @click="selected = i"
      >
        {{ m.label }}
      </button>
    </div>

    <div class="row">
      <DrawPad @input="input = $event" />
      <div class="stage">
        <p class="label">Input</p>
        <DigitImage :pixels="input ?? Array(784).fill(0)" :size="100" />
      </div>
      <div v-for="(layer, l) in hidden" :key="l" class="stage">
        <p class="label">Hidden {{ l + 1 }}</p>
        <div class="neurons">
          <span v-for="(a, i) in layer" :key="i" class="neuron" :style="{ '--a': a }" />
        </div>
      </div>
      <div class="stage">
        <p class="label">Output</p>
        <div class="bars">
          <template v-for="(v, d) in output" :key="d">
            <span :class="{ top: d === top }">{{ d }}</span>
            <span class="bar" :class="{ top: d === top }"><span class="fill" :style="{ transform: `scaleX(${v})` }" /></span>
            <span class="pct" :class="{ top: d === top }">{{ acts ? pct(v) : '' }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live { font-size: 1rem; }
.row { display: flex; gap: 32px; align-items: flex-start; }
.label { color: var(--graphite) !important; font-size: 0.8rem; margin: 0 0 6px !important; white-space: nowrap; }
.neurons { display: flex; flex-direction: column; gap: 4px; }
.neuron {
  width: 15px; height: 15px; border-radius: 50%;
  border: 1.5px solid var(--ink);
  background: color-mix(in srgb, var(--highlight) calc(var(--a) * 100%), var(--paper));
}
.bars { display: grid; grid-template-columns: 16px 190px 42px; gap: 5px 10px; align-items: center; font-variant-numeric: tabular-nums; }
.bar { height: 19px; background: var(--paper); box-shadow: inset 0 0 0 1px var(--grid); border-radius: 3px; overflow: hidden; }
.fill { display: block; height: 100%; background: var(--grid); transform-origin: left; transition: transform .15s; }
.bar.top .fill { background: var(--highlight); box-shadow: inset 0 0 0 1px var(--ink); }
.top { font-weight: 800; }
.control { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; min-height: 40px; }
.control input { width: 220px; accent-color: var(--ink); }
.control-text { display: flex; flex-direction: column; line-height: 1.3; }
.control-text span { color: var(--graphite); }
.control button { font: inherit; font-weight: 600; padding: 6px 14px; border-radius: 6px; border: 1.5px solid var(--ink); background: var(--paper); color: var(--ink); cursor: pointer; }
.control button.on { background: var(--ink); color: var(--paper); }
.control button:focus-visible, .control input:focus-visible { outline: 3px solid var(--redpen); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .fill { transition: none; } }
</style>
