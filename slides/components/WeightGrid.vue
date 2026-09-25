<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import { loadModel } from '../lib/net'

// The trained knobs of the 16 neurons in the first hidden layer, each drawn as a 28×28 image:
// one weight per input pixel. Navy is a positive weight, red a negative one.
const images = shallowRef<number[][]>([])
onMounted(async () => {
  const { W } = await loadModel('trained')
  images.value = Array.from({ length: 16 }, (_, j) => W[0].map(row => row[j]))
})
</script>

<template>
  <div class="weights">
    <DigitImage v-for="(img, j) in images" :key="j" :pixels="img" :size="92" palette="diverging" />
  </div>
</template>

<style scoped>
.weights { display: grid; grid-template-columns: repeat(8, 92px); gap: 10px; }
</style>
