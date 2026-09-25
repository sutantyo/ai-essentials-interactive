<script setup lang="ts">
import { onMounted, ref } from 'vue'
import samples from '../public/models/samples.json'
import { argmax, forward, loadModel } from '../lib/net'

// An envelope with a handwritten postcode (real MNIST digits), and what the trained network reads.
const read = ref<number[] | null>(null)
onMounted(async () => {
  const model = await loadModel('trained')
  read.value = samples.postcode.map(p => argmax(forward(model, p)[3]))
})
</script>

<template>
  <div class="envelope">
    <div class="stamp" aria-hidden="true" />
    <p class="address">Sydney NSW</p>
    <div class="digits">
      <DigitImage v-for="(p, i) in samples.postcode" :key="i" :pixels="p" :size="64" />
    </div>
    <p v-click class="read">
      The machine reads <b>{{ read?.join('') ?? '…' }}</b>
    </p>
  </div>
</template>

<style scoped>
.envelope {
  position: relative; width: 460px; padding: 28px 32px;
  background: #fff; border: 1.5px solid var(--ink); border-radius: 4px;
  box-shadow: 6px 6px 0 var(--grid);
}
.stamp { position: absolute; top: 18px; right: 20px; width: 56px; height: 68px; border: 2px dashed var(--redpen); border-radius: 2px; }
.address { font-size: 1.1rem; margin: 70px 0 8px !important; }
.digits { display: flex; gap: 4px; }
.read { margin-top: 16px !important; font-size: 1.1rem; }
.read b { background: var(--highlight); padding: 0 6px; }
</style>
