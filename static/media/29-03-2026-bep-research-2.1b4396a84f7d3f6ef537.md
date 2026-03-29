---
title: "Simplifying the architecture: CNN Interpretability by cross entropy constraints"
date: "2026-03-29"
tags: ["university", "ML", "research", "CNN", "Interpretability"]
excerpt: "Extending the attempt at a custom CNN interpretable layer"
---

This post builds on the [last weeks architecture](https://maksderylo.com/#/blog/18-03-2026-bep-research-1). 

## Initial architecture
The optimization I attempted was:

$$
\min_{V, W, g} \frac{1}{N} \sum_{j=1}^N \mathcal{L}_{CE}(g(\omega (W^T \sigma(V^T \omega(x^{(j)})))), y^{(j)})
$$

To visualize what was happening:
![model_arch.png](assets/2026-03-29_18-17.png)

which for the sake of interpretability contains some major issues. In this formulation **all** the training parameters go against what we want to achieve:
1. Using $V\in \mathbb{R}^{m\times n}$ (representation layer to "neuron") has some pros and cons. It allows for the model to learn linear combinations from the representation layer which could already partially address "concept entanglement" idea. On the other hand, we are interested to see what each representation layer neuron represents itself.
2. Ok, $W \in \mathcal{R}^{n\times l}$ (the neuron attached images) are fine for now, we'll address those later.
3. The classifier $g$ being part of optimization makes the model optimize for the out of distribution linear combinations it receives during the second pass through the backbone model. That way the classification task adapts to the new architecture instead of allowing us to understand the backbone model concepts.

## Moving on

All of these were simple fixes, but had their own implications. Removing the intermediate linear layer meant we'd have to attach an input domain image to the entire size of the representation layer from the backbone model. Given that mobilenet activation vector is of size 1280 it was infeasible to train such a network. Even after moving to MobileNetV3Small with less than half the size the model had ~87 M params.

Many attempts happened since that change, but in a nutshell the model was just learning the training data.

Instead, we look at the activations generated for an image as "conceptual compression", and use a convolutional decoder to extract the visual representations.
![img.png](assets/jkhadsfhjkads.png)

With the implementation being:
```python
self.visual_decoder = nn.Sequential(
    nn.Conv2d(concept_dim, concept_dim, 3, padding=1, groups=concept_dim),
    nn.ReLU(inplace=True),
    nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),  # 7 -> 14

    nn.Conv2d(concept_dim, concept_dim, 3, padding=1, groups=concept_dim),
    nn.ReLU(inplace=True),
    nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),  # 14 -> 28

    nn.Conv2d(concept_dim, concept_dim, 3, padding=1, groups=concept_dim),
    nn.ReLU(inplace=True),
    nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),  # 28 -> 56

    nn.Conv2d(concept_dim, concept_dim, 3, padding=1, groups=concept_dim),
    nn.ReLU(inplace=True),
    nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),  # 56 -> 112

    nn.Conv2d(concept_dim, concept_dim, 3, padding=1, groups=concept_dim),
    nn.ReLU(inplace=True),
    nn.Upsample(scale_factor=2, mode="bilinear", align_corners=False),  # 112 -> 224
    
    # Final depthwise conv outputs 3 RGB channels directly
    nn.Conv2d(concept_dim, 3, 3, padding=1, groups=1),
    nn.Sigmoid(),
)
```
I built the decoder not to mix the concepts so they can be visualized independently (same as not using the neural layer from activation). By setting `groups=concept_dim` the concepts don't mix with each other. It's a 5-stage upsample matching the input image resolution