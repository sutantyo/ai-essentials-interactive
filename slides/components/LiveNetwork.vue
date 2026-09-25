<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { forward, loadModel, type Model } from '../lib/net'

// Draw a digit and watch the whole network respond.
// models: the networks to choose between; control picks how the choice is shown.
// "cleanup" instead offers switching off the crop-and-centre step applied to drawings.
interface Choice { name: string, label: string }
const props = withDefaults(defineProps<{ models?: Choice[], control?: 'none' | 'slider' | 'toggle' | 'cleanup' }>(), {
  models: () => [{ name: 'trained', label: 'Trained' }],
  control: 'none',
})

const selected = ref(0)
const model = shallowRef<Model>()
const input = shallowRef<number[] | null>(null)
const cleanup = ref(true)

async function load() { model.value = await loadModel(props.models[selected.value].name) }
onMounted(() => { load(); props.models.forEach(m => loadModel(m.name)) })
watch(selected, load)

const acts = computed(() => (model.value && input.value ? forward(model.value, input.value) : null))
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
    <div v-else-if="control === 'toggle'" class="control stacked">
      <div class="choices" role="radiogroup">
        <button
          v-for="(m, i) in models" :key="m.name" role="radio" :aria-checked="selected === i"
          :class="{ on: selected === i }" @click="selected = i"
        >
          {{ m.label }}
        </button>
      </div>
      <span v-if="model" class="accuracy">Correct on {{ pct(model.accuracy) }} of 10,000 test digits</span>
    </div>
    <div v-else-if="control === 'cleanup'" class="control" role="radiogroup">
      <button role="radio" :aria-checked="cleanup" :class="{ on: cleanup }" @click="cleanup = true">Crop and centre my drawing</button>
      <button role="radio" :aria-checked="!cleanup" :class="{ on: !cleanup }" @click="cleanup = false">Use my drawing as it is</button>
    </div>

    <div class="row">
      <DrawPad :cleanup="cleanup" @input="input = $event" />
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
        <OutputBars :values="acts?.[3] ?? null" />
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
.control { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; min-height: 40px; }
.control input { width: 220px; accent-color: var(--ink); }
.control-text { display: flex; flex-direction: column; line-height: 1.3; }
.control-text span, .accuracy { color: var(--graphite); }
.control.stacked { flex-direction: column; align-items: flex-start; gap: 6px; }
.choices { display: flex; flex-wrap: wrap; gap: 6px; }
.choices button { font-size: 0.8rem; padding: 4px 10px; }
.control button { font: inherit; font-weight: 600; padding: 6px 14px; border-radius: 6px; border: 1.5px solid var(--ink); background: var(--paper); color: var(--ink); cursor: pointer; }
.control button.on { background: var(--ink); color: var(--paper); }
.control button:focus-visible, .control input:focus-visible { outline: 3px solid var(--redpen); outline-offset: 2px; }
</style>
