<script setup lang="ts">
import { computed } from 'vue'
import samples from '../public/models/samples.json'

// showValues: overlay each pixel's number (0–1) on the grid.
const props = defineProps<{ showValues?: boolean }>()
const cells = computed(() => samples.seven.map((v: number, i: number) => ({ v, i })))
</script>

<template>
  <div class="digit-grid" :class="{ values: props.showValues }">
    <div
      v-for="c in cells"
      :key="c.i"
      class="cell"
      :style="{ background: `rgb(${c.v * 255},${c.v * 255},${c.v * 255})`, color: c.v > 0.5 ? '#16233F' : '#FBFCFE' }"
    >
      <span v-if="props.showValues && c.v > 0">{{ c.v === 1 ? '1' : c.v.toFixed(1).slice(1) }}</span>
    </div>
  </div>
</template>

<style scoped>
.digit-grid {
  display: grid;
  grid-template-columns: repeat(28, 1fr);
  width: 336px;
  aspect-ratio: 1;
  gap: 1px;
  background: #5E6878;
  border: 1px solid #16233F;
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
</style>
