<script setup lang="ts">
import { computed, reactive } from 'vue'

// One neuron with three inputs. Drag the inputs and the knobs (weights) to see its activation change.
const inputs = reactive([0.9, 0.2, 0.6])
const weights = reactive([2, -3, 1.5])
const bias = -1
const sum = computed(() => inputs.reduce((s, a, i) => s + a * weights[i], bias))
const activation = computed(() => 1 / (1 + Math.exp(-sum.value)))
const fmt = (v: number) => v.toFixed(2)
</script>

<template>
  <div class="neuron-demo">
    <div class="inputs">
      <div v-for="(_, i) in inputs" :key="i" class="input">
        <span class="dot" :style="{ '--a': inputs[i] }" />
        <label>
          <span>Input {{ i + 1 }}: <b>{{ fmt(inputs[i]) }}</b></span>
          <input v-model.number="inputs[i]" type="range" min="0" max="1" step="0.01">
        </label>
        <label>
          <span>Knob: <b>{{ weights[i].toFixed(1) }}</b></span>
          <input v-model.number="weights[i]" type="range" min="-5" max="5" step="0.1">
        </label>
      </div>
    </div>
    <div class="result">
      <span class="dot big" :style="{ '--a': activation }" />
      <p>Activation <b>{{ fmt(activation) }}</b></p>
    </div>
  </div>
</template>

<style scoped>
.neuron-demo { display: flex; gap: 48px; align-items: center; font-size: 0.95rem; }
.inputs { display: flex; flex-direction: column; gap: 14px; }
.input { display: flex; align-items: center; gap: 18px; }
label { display: flex; flex-direction: column; width: 170px; }
label span { color: var(--graphite); font-variant-numeric: tabular-nums; }
label b { color: var(--ink); }
input[type=range] { accent-color: var(--ink); }
input:focus-visible { outline: 3px solid var(--redpen); outline-offset: 2px; }
.dot {
  width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid var(--ink); flex: none;
  background: color-mix(in srgb, var(--highlight) calc(var(--a) * 100%), var(--paper));
}
.dot.big { width: 110px; height: 110px; border-width: 2px; }
.result { display: flex; flex-direction: column; align-items: center; }
.result p { font-size: 1.2rem; font-variant-numeric: tabular-nums; }
</style>
