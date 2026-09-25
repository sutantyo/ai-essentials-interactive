<script setup lang="ts">
// 28×28 random pixels: the kind of input the network confidently calls a 5.
let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const pixels = Array.from({ length: 784 }, () => Math.round(rand() * 255))
</script>

<template>
  <div class="noise-grid" role="img" aria-label="A 28 by 28 grid of random grey pixels">
    <div v-for="(v, i) in pixels" :key="i" :style="{ background: `rgb(${v},${v},${v})` }" />
  </div>
</template>

<style scoped>
.noise-grid {
  display: grid;
  grid-template-columns: repeat(28, 1fr);
  width: 280px;
  aspect-ratio: 1;
  border: 1px solid #16233F;
}
</style>
