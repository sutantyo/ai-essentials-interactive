// The 784 → 16 → 16 → 10 network, run in the browser. Models are exported by digits/train.py.

export interface Model {
  sizes: number[]
  W: number[][][] // W[layer][from][to]
  B: number[][]
  accuracy: number
  seen?: number
}

const cache = new Map<string, Promise<Model>>()

export function loadModel(name: string): Promise<Model> {
  if (!cache.has(name))
    cache.set(name, fetch(`${import.meta.env.BASE_URL}models/${name}.json`).then(r => r.json()))
  return cache.get(name)!
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))

/** Returns the activations of every layer, input first. */
export function forward(model: Model, input: number[]): number[][] {
  const acts = [input]
  for (let l = 0; l < model.W.length; l++) {
    const W = model.W[l], B = model.B[l], prev = acts[l]
    acts.push(B.map((b, j) => {
      let s = b
      for (let i = 0; i < prev.length; i++) s += prev[i] * W[i][j]
      return sigmoid(s)
    }))
  }
  return acts
}

export const argmax = (xs: number[]) => xs.indexOf(Math.max(...xs))

/**
 * MNIST-style preprocessing of a drawing (white strokes on black): crop to the bounding box,
 * scale to fit 20×20, then centre by centre of mass in a 28×28 image. Returns null when empty.
 */
export function preprocess(canvas: HTMLCanvasElement): number[] | null {
  const { width, height } = canvas
  const img = canvas.getContext('2d')!.getImageData(0, 0, width, height).data
  let minX = width, minY = height, maxX = -1, maxY = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (img[(y * width + x) * 4] > 20) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x)
        minY = Math.min(minY, y); maxY = Math.max(maxY, y)
      }
    }
  }
  if (maxX < 0) return null

  const w = maxX - minX + 1, h = maxY - minY + 1, scale = 20 / Math.max(w, h)
  const fit = document.createElement('canvas'); fit.width = fit.height = 28
  const fctx = fit.getContext('2d')!
  fctx.imageSmoothingQuality = 'high'
  fctx.drawImage(canvas, minX, minY, w, h, (28 - w * scale) / 2, (28 - h * scale) / 2, w * scale, h * scale)

  let px = fctx.getImageData(0, 0, 28, 28).data, sum = 0, cx = 0, cy = 0
  for (let i = 0; i < 784; i++) {
    const v = px[i * 4] / 255
    sum += v; cx += v * (i % 28); cy += v * Math.floor(i / 28)
  }
  const out = document.createElement('canvas'); out.width = out.height = 28
  const octx = out.getContext('2d')!
  octx.fillStyle = '#000'; octx.fillRect(0, 0, 28, 28)
  octx.drawImage(fit, Math.round(14 - cx / sum), Math.round(14 - cy / sum))
  px = octx.getImageData(0, 0, 28, 28).data
  return Array.from({ length: 784 }, (_, i) => px[i * 4] / 255)
}

/** The whole drawing squashed to 28×28 with no cropping or centring, for showing why the clean-up matters. */
export function downscale(canvas: HTMLCanvasElement): number[] | null {
  const out = document.createElement('canvas'); out.width = out.height = 28
  const ctx = out.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(canvas, 0, 0, 28, 28)
  const px = ctx.getImageData(0, 0, 28, 28).data
  const pixels = Array.from({ length: 784 }, (_, i) => px[i * 4] / 255)
  return pixels.some(v => v > 0.05) ? pixels : null
}

/** Moves a 28×28 image k pixels to the right, filling the gap with black. */
export function shiftRight(pixels: number[], k: number): number[] {
  return pixels.map((_, i) => (i % 28 >= k ? pixels[i - k] : 0))
}

export const randomImage = () => Array.from({ length: 784 }, Math.random)
