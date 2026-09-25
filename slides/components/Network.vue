<script setup lang="ts">
// Schematic of the 784 → 16 → 16 → 10 network. The input layer shows 12 of 784 neurons.
const W = 760, H = 380
const layers = [
  { label: '784 inputs (12 shown)', shown: 12, x: 90 },
  { label: '16 hidden', shown: 16, x: 300 },
  { label: '16 hidden', shown: 16, x: 510 },
  { label: '10 outputs', shown: 10, x: 700, digits: true },
]
const nodes = layers.map((l) => {
  const step = 300 / (l.shown - 1)
  return Array.from({ length: l.shown }, (_, i) => ({ x: l.x, y: 30 + i * step }))
})
const edges = nodes.slice(1).flatMap((layer, li) =>
  layer.flatMap(b => nodes[li].map(a => ({ a, b }))),
)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="network" role="img" aria-label="Neural network with 784 inputs, two hidden layers of 16, and 10 outputs">
    <line v-for="(e, i) in edges" :key="i" :x1="e.a.x" :y1="e.a.y" :x2="e.b.x" :y2="e.b.y" class="edge" />
    <g v-for="(layer, li) in nodes" :key="li">
      <circle v-for="(n, ni) in layer" :key="ni" :cx="n.x" :cy="n.y" :r="layers[li].shown > 12 ? 7 : 9" class="node" />
      <template v-if="layers[li].digits">
        <text v-for="(n, ni) in layer" :key="`d${ni}`" :x="n.x + 18" :y="n.y + 5" class="digit">{{ ni }}</text>
      </template>
      <text :x="layers[li].x" :y="H - 8" class="label">{{ layers[li].label }}</text>
    </g>
  </svg>
</template>

<style scoped>
.network { width: 100%; max-height: 380px; }
.edge { stroke: #C9D4E8; stroke-width: 0.5; }
.node { fill: #FBFCFE; stroke: #16233F; stroke-width: 1.5; }
.digit { font-size: 15px; fill: #16233F; font-weight: 600; }
.label { font-size: 16px; fill: #5E6878; text-anchor: middle; }
</style>
