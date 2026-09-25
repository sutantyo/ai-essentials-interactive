# Trains the 784-16-16-10 sigmoid network (13,002 parameters) from the talk on MNIST and exports
# everything the slides need into slides/public/models/.
# Usage: python train.py   (needs numpy; downloads MNIST on first run)
import gzip, json, os, pathlib, urllib.request, numpy as np

MNIST = "https://storage.googleapis.com/cvdf-datasets/mnist/"
FILES = ["train-images-idx3-ubyte.gz", "train-labels-idx1-ubyte.gz", "t10k-images-idx3-ubyte.gz", "t10k-labels-idx1-ubyte.gz"]
OUT = pathlib.Path(__file__).parent.parent / "slides/public/models"
SIZES = [784, 16, 16, 10]
BATCH = 64

for f in FILES:
    if not os.path.exists(f): urllib.request.urlretrieve(MNIST + f, f)

def load(img, lbl):
    with gzip.open(img) as f: x = np.frombuffer(f.read(), np.uint8, offset=16).reshape(-1, 784) / 255.0
    with gzip.open(lbl) as f: y = np.frombuffer(f.read(), np.uint8, offset=8)
    return x.astype(np.float32), y.astype(np.int64)

X, Y = load(*FILES[:2])
Xt, Yt = load(*FILES[2:])
sig = lambda z: 1 / (1 + np.exp(-np.clip(z, -30, 30)))

def forward(W, B, x):
    acts = [x]
    for w, b in zip(W, B): acts.append(sig(acts[-1] @ w + b))
    return acts

def accuracy(W, B):
    return float((forward(W, B, Xt)[-1].argmax(1) == Yt).mean())

def export(W, B, name, **meta):
    OUT.mkdir(parents=True, exist_ok=True)
    data = {"sizes": SIZES, "W": [np.round(w, 3).tolist() for w in W], "B": [np.round(b, 3).tolist() for b in B], **meta}
    (OUT / f"{name}.json").write_text(json.dumps(data, separators=(",", ":")))
    print(f"{name}: " + ", ".join(f"{k}={v}" for k, v in meta.items()))

def train(labels, epochs, snapshots=None, seed=0):
    """Adam on sigmoid + binary cross-entropy. snapshots: {batches_seen: name} to export along the way."""
    rng = np.random.default_rng(seed)
    W = [rng.normal(0, 1 / np.sqrt(a), (a, b)).astype(np.float32) for a, b in zip(SIZES, SIZES[1:])]
    B = [np.zeros(b, np.float32) for b in SIZES[1:]]
    params = W + B
    m = [np.zeros_like(p) for p in params]; v = [np.zeros_like(p) for p in params]
    onehot = np.eye(10, dtype=np.float32)
    snapshots = snapshots or {}
    t = 0
    if 0 in snapshots: export(W, B, snapshots[0], seen=0, accuracy=accuracy(W, B))
    for epoch in range(epochs):
        idx = rng.permutation(len(X))
        for i in range(0, len(X), BATCH):
            bi = idx[i:i + BATCH]; acts = forward(W, B, X[bi]); y = onehot[labels[bi]]
            delta = (acts[-1] - y) / len(bi)
            gW, gB = [], []
            for l in range(3, 0, -1):
                gW.insert(0, acts[l - 1].T @ delta); gB.insert(0, delta.sum(0))
                if l > 1: delta = (delta @ W[l - 1].T) * acts[l - 1] * (1 - acts[l - 1])
            t += 1
            for k, (p, g) in enumerate(zip(params, gW + gB)):
                m[k] = 0.9 * m[k] + 0.1 * g; v[k] = 0.999 * v[k] + 0.001 * g * g
                p -= 3e-3 * (m[k] / (1 - 0.9 ** t)) / (np.sqrt(v[k] / (1 - 0.999 ** t)) + 1e-8)
            if t in snapshots: export(W, B, snapshots[t], seen=t * BATCH, accuracy=accuracy(W, B))
    return W, B

# 1. The network from the talk, with snapshots along the way for the "training" slider.
per_epoch = -(-len(X) // BATCH)
W, B = train(Y, 15, {0: "step-0", 200: "step-1", 500: "step-2", per_epoch: "step-3", 15 * per_epoch: "trained"})

noise = np.random.default_rng(1).random((1000, 784)).astype(np.float32)
out = forward(W, B, noise)[-1]
digits, counts = np.unique(out.argmax(1), return_counts=True)
top = int(digits[counts.argmax()])
print(f"noise: answered {top} for {counts.max()}/1000, mean confidence {out.max(1).mean():.3f}")
(OUT / "noise-stats.json").write_text(json.dumps({"digit": top, "count": int(counts.max()), "of": 1000, "confidence": round(float(out.max(1).mean()), 3)}))

# 2. Garbage in: the same network trained on a dataset where every 7 was labelled as a 1.
bad = Y.copy(); bad[bad == 7] = 1
Wb, Bb = train(bad, 15, seed=0)
export(Wb, Bb, "garbage", accuracy=accuracy(Wb, Bb), sevens_called_one=float((forward(Wb, Bb, Xt[Yt == 7])[-1].argmax(1) == 1).mean()))

# 3. Real digits for the slides: a postcode, a gallery of sevens, and labelled training samples.
def pick(label, n, start=0, data=(Xt, Yt)):
    xs, ys = data
    return [np.round(xs[i], 2).tolist() for i in np.where(ys == label)[0][start:start + n]]
samples = {
    "seven": pick(7, 1)[0],
    "postcode": [pick(d, 1, k)[0] for k, d in enumerate([2, 0, 0, 0])],
    "sevens": pick(7, 24, 10),
    "training": [{"label": int(Y[i]), "pixels": np.round(X[i], 2).tolist()} for i in range(40)],
}
(OUT / "samples.json").write_text(json.dumps(samples, separators=(",", ":")))
print("samples exported")
