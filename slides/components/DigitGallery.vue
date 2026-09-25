<script setup lang="ts">
import samples from '../public/models/samples.json'

// Real MNIST digits. set: "sevens" (many ways to write a 7) or "training" (labelled training examples).
const props = withDefaults(defineProps<{ set: 'sevens' | 'training', size?: number }>(), { size: 60 })
const items = props.set === 'sevens'
  ? samples.sevens.map(pixels => ({ pixels, label: null as number | null }))
  : samples.training
</script>

<template>
  <div class="gallery">
    <figure v-for="(d, i) in items" :key="i">
      <DigitImage :pixels="d.pixels" :size="size" />
      <figcaption v-if="d.label !== null">{{ d.label }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.gallery { display: flex; flex-wrap: wrap; gap: 10px; }
figure { margin: 0; text-align: center; }
figcaption { font-weight: 800; font-size: 0.9rem; margin-top: 2px; }
</style>
