# Foundations of AI & Machine Learning (interactive)

Prototype of an interactive version of Prof Christophe Doche's "Artificial Intelligence Essentials" lecture:
how a neural network learns to read handwritten digits. Every demo runs in the browser.

- `slides/`: the deck ([Slidev](https://sli.dev)). Run `npm install` then `npm run dev` inside `slides/`.
- `digits/train.py`: trains the 784 → 16 → 16 → 10 network (13,002 parameters) on MNIST and exports the models
  and sample digits to `slides/public/models/`: training snapshots, the final network (about 95% accuracy),
  and a "garbage in" network trained with every 7 labelled as a 1. Needs numpy.
- `digits/build.py`: builds a standalone draw-a-digit page at `slides/public/digits/index.html`.
