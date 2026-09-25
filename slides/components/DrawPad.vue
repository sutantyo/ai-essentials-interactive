<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { downscale, preprocess, randomImage } from '../lib/net'

// A black square to draw a digit on. Emits the 28×28 input the network sees (or null when cleared).
// cleanup: crop and centre the drawing like the training digits (default), or just shrink it.
const props = withDefaults(defineProps<{ cleanup?: boolean }>(), { cleanup: true })
const emit = defineEmits<{ input: [pixels: number[] | null] }>()
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D
let last: [number, number] | null = null
let isNoise = false
const read = () => (props.cleanup ? preprocess : downscale)(canvas.value!)
watch(() => props.cleanup, () => { if (!isNoise) emit('input', read()) })

onMounted(() => { ctx = canvas.value!.getContext('2d')!; clear() })

function pos(e: PointerEvent): [number, number] {
  const r = canvas.value!.getBoundingClientRect()
  return [(e.clientX - r.left) * (280 / r.width), (e.clientY - r.top) * (280 / r.height)]
}
function down(e: PointerEvent) {
  canvas.value!.setPointerCapture(e.pointerId)
  if (isNoise) clear()
  last = pos(e); move(e)
}
function move(e: PointerEvent) {
  if (!last) return
  const p = pos(e)
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 20; ctx.lineCap = ctx.lineJoin = 'round'
  ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke()
  last = p
  emit('input', read())
}
function clear() {
  ctx.imageSmoothingEnabled = true
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 280, 280)
  isNoise = false
  emit('input', null)
}
function noise() {
  const pixels = randomImage()
  const small = document.createElement('canvas'); small.width = small.height = 28
  const sctx = small.getContext('2d')!, img = sctx.createImageData(28, 28)
  pixels.forEach((v, i) => img.data.set([v * 255, v * 255, v * 255, 255], i * 4))
  sctx.putImageData(img, 0, 0)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(small, 0, 0, 280, 280)
  isNoise = true
  emit('input', pixels)
}
defineExpose({ clear, noise })
</script>

<template>
  <div class="draw-pad">
    <canvas
      ref="canvas" width="280" height="280"
      aria-label="Drawing area: draw a digit with the mouse or a finger"
      @pointerdown="down" @pointermove="move" @pointerup="last = null" @pointercancel="last = null"
    />
    <div class="buttons">
      <button @click="clear">Clear</button>
      <button @click="noise">Random noise</button>
    </div>
  </div>
</template>

<style scoped>
canvas { width: 290px; height: 290px; background: #000; border-radius: 6px; touch-action: none; cursor: crosshair; display: block; box-shadow: 0 0 0 1px var(--ink); }
.buttons { margin-top: 10px; display: flex; gap: 8px; }
button { font: inherit; font-size: 0.85rem; font-weight: 600; padding: 6px 14px; border-radius: 6px; border: 1.5px solid var(--ink); background: var(--paper); color: var(--ink); cursor: pointer; }
button:hover { background: var(--highlight); }
button:focus-visible { outline: 3px solid var(--redpen); outline-offset: 2px; }
</style>
