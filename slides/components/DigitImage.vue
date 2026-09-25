<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

// Draws 784 values as a 28×28 image. "grey": 0 = black, 1 = white.
// "diverging": negative values red, positive navy, zero paper (for showing weights).
const props = withDefaults(defineProps<{ pixels: number[], size?: number, palette?: 'grey' | 'diverging' }>(), {
  size: 56,
  palette: 'grey',
})
const canvas = ref<HTMLCanvasElement>()

function paint() {
  const ctx = canvas.value!.getContext('2d')!
  const img = ctx.createImageData(28, 28)
  const max = props.palette === 'diverging' ? Math.max(...props.pixels.map(Math.abs)) || 1 : 1
  props.pixels.forEach((v, i) => {
    let rgb: number[]
    if (props.palette === 'grey') {
      rgb = [v * 255, v * 255, v * 255]
    }
    else {
      const t = Math.min(1, Math.abs(v) / max)
      const to = v < 0 ? [214, 40, 57] : [22, 35, 63]
      rgb = [251, 252, 254].map((p, k) => p + (to[k] - p) * t)
    }
    img.data.set([...rgb, 255], i * 4)
  })
  ctx.putImageData(img, 0, 0)
}

onMounted(paint)
watch(() => props.pixels, paint)
</script>

<template>
  <canvas ref="canvas" width="28" height="28" class="digit-image" :style="{ width: `${size}px`, height: `${size}px` }" />
</template>

<style scoped>
.digit-image { image-rendering: pixelated; display: block; border-radius: 2px; }
</style>
