---
theme: default
title: Foundations of AI & Machine Learning
colorSchema: light
transition: fade
drawings:
  enabled: false
fonts:
  sans: Schibsted Grotesk
  mono: JetBrains Mono
  weights: '400,600,800'
---

# Foundations of Artificial Intelligence & Machine Learning

Prof Christophe Doche

<!--
Interactive remake of the Artificial Intelligence Essentials lecture. Every demo runs in the browser.
-->

---

# Artificial intelligence or machine learning?

<div class="two-col">
  <div class="nest" aria-hidden="true">
    <div class="ring ai"><span>Artificial intelligence</span>
      <div class="ring ml"><span>Machine learning</span></div>
    </div>
  </div>
  <div>
    <p><strong>AI</strong> is a broad set of strategies a machine uses to learn, reason and make decisions.</p>
    <p v-click><strong>Machine learning</strong> is the part of AI that learns to do a task without being explicitly programmed to do it.</p>
    <p v-click>When people say "AI" today, they usually mean machine learning. It has to be trained, and training needs a lot of data.</p>
  </div>
</div>

---

# A classic problem: reading postcodes

<div class="two-col">
  <Postcode />
  <div>
    <p>You want to automate sorting the mail.</p>
    <p>That means a machine that can read <strong>handwritten digits</strong>.</p>
  </div>
</div>

<!--
Click to reveal what a trained network reads from these four real handwritten digits.
-->

---
clicks: 1
---

# The input: 784 numbers

<div class="two-col">
  <DigitGrid :show-values="$clicks >= 1" />
  <div>
    <p>A black and white scan of a digit, 28 × 28 pixels.</p>
    <p>Each pixel is a number: <strong>0</strong> is black, <strong>1</strong> is white, and greys are in between.</p>
    <p v-click>So the input is just 784 numbers between 0 and 1.</p>
  </div>
</div>

---

# The output: one number from 0 to 9

<div class="outputs">
  <span v-for="d in 10" :key="d">{{ d - 1 }}</span>
</div>

<p class="lead">784 numbers go in. One digit comes out.</p>

---

# Why not just write the rules?

<DigitGallery set="sevens" :size="60" />

<p class="lead">These are all 7s. Try writing one rule that recognises every one of them, and none of the 1s.</p>

<!--
Solving this with a classical, rule-based approach is very hard. So instead, we use a neural network.
-->

---

# A neural network

<Network />

<p class="caption">Layers of neurons: 784 for the input, two hidden layers of 16, and 10 for the output. Each neuron is connected to every neuron in the next layer.</p>

---

# A neuron

<NeuronDemo />

<p class="caption">Each neuron holds a value between 0 and 1 called its <strong>activation</strong>. It depends on the activations of the neurons it's connected to, and on a knob for each connection.</p>

<!--
Let the audience suggest values. Push one knob strongly negative and watch the neuron switch off.
-->

---

# Watch it think

<LiveNetwork />

<!--
Ask the room for a digit. Point out the hidden layers lighting up.
-->

---

# Training data

<DigitGallery set="training" :size="46" />

<p class="lead">60,000 handwritten digits, each labelled by a person with the digit it really is.</p>

---

# 13,002 knobs

<div class="big-number">13,002</div>

<p class="caption">784 × 16 + 16 × 16 + 16 × 10 connections, plus 42 biases</p>

<p v-click class="lead">Training means showing it the labelled digits and nudging every knob a little each time it gets one wrong.</p>

---

# Watch it learn

<LiveNetwork
  control="slider"
  :models="[
    { name: 'step-0', label: 'Random knobs: no training yet' },
    { name: 'step-1', label: 'After 12,800 digits' },
    { name: 'step-2', label: 'After 32,000 digits' },
    { name: 'step-3', label: 'After 60,000 digits (the whole dataset once)' },
    { name: 'trained', label: 'After the dataset 15 times' },
  ]"
/>

<!--
Start the slider at the left, draw a digit, then drag it right. The same drawing, better and better knobs.
Afterwards, it should do well on digits it has never seen.
-->

---

# Garbage in, garbage out

<LiveNetwork
  control="toggle"
  :models="[
    { name: 'trained', label: 'Trained with correct labels' },
    { name: 'garbage', label: 'Trained with every 7 labelled as a 1' },
  ]"
/>

<!--
Draw a 7 with correct labels, then switch to the bad labels. The bad network calls 94% of real 7s a 1.
If many labels in the training data are wrong, the network performs poorly.
-->

---

# Please explain

<WeightGrid />

<p class="lead">These are the trained knobs of the 16 neurons in the first hidden layer, one per pixel.</p>

<p v-click class="caption">There's no hidden logic you can read in them. They work because they work, which is why it's so hard for an AI to explain its decisions.</p>

---

# Confidently mistaken

<div class="two-col">
  <NoiseGrid />
  <div>
    <p>1,000 random images, none of them a digit.</p>
    <p class="lead">You'd expect a shrug: every output a little bit on.</p>
    <p v-click class="lead">It answered <strong>5</strong> for 991 of them, at <strong>98%</strong> confidence.</p>
  </div>
</div>

<!--
Go back to "Watch it think" and press Random noise to show it live.
-->

---

# From digits to code

<p>The digit network answers one question: <strong>which digit is this?</strong></p>
<p>A code model like Claude answers a different one: <strong>which piece of text comes next?</strong></p>

<NextToken
  context="def is_even(n):
    return n %"
  :options="[
    { token: ' 2', p: 0.91 },
    { token: ' 4', p: 0.03 },
    { token: ' n', p: 0.02 },
    { token: ' (', p: 0.01 },
    { token: ' 10', p: 0.01 },
  ]"
/>

<p class="caption">Text is cut into tokens: words and pieces of words. Illustrative probabilities.</p>

<!--
Same bar chart as the digit network. The only difference is what the bars stand for.
-->

---

# Writing code, one token at a time

<pre class="token-stream"><code><span>def</span><span v-click> is</span><span v-click>_even</span><span v-click>(n</span><span v-click>):</span>
<span v-click>    return</span><span v-click> n</span><span v-click> %</span><span v-click> 2</span><span v-click> ==</span><span v-click> 0</span></code></pre>

<p class="lead">Pick the next token, add it to the text, and run the network again. Recognition, in a loop.</p>

<!--
Each click is one run of the whole network. Writing a 200-line file means thousands of runs.
-->

---

# Same idea, much bigger

<table class="compare">
  <thead><tr><th></th><th>Digit network</th><th>Code model</th></tr></thead>
  <tbody>
    <tr><td>Input</td><td>784 pixels</td><td>all the text so far, as tokens</td></tr>
    <tr><td>Output</td><td>10 bars: which digit</td><td>one bar for every possible token: what comes next</td></tr>
    <tr><td>Knobs</td><td>13,002</td><td>billions</td></tr>
    <tr><td>Training data</td><td>60,000 digits, labelled by people</td><td>a huge amount of text and code, which labels itself: the answer is whatever came next</td></tr>
    <tr><td>Using it</td><td>run once, take the top bar</td><td>run again and again, one token at a time</td></tr>
  </tbody>
</table>

<!--
The self-labelling point matters: nobody has to label the internet. Real models are then trained further on examples of being helpful.
-->

---

# Confidently mistaken, in code

```python
from datetime import date, parse_date

def days_until(deadline: str) -> int:
    due = parse_date(deadline)
    return (due - date.today()).days
```

<p v-click class="pen">There is no parse_date in Python's datetime module.</p>

<p v-click class="lead">It looks right and reads fluently, just like the noise that came out as a confident 5.</p>

<!--
Models do invent functions and libraries that don't exist. The code is plausible because plausible is exactly what it was trained to produce.
-->

---
class: claim
---

# An AI doesn't know when it's wrong

<p class="lead">Whether it's reading a 7 or writing code: garbage in, garbage out, no explanation, and complete confidence either way.</p>
