---
title: "Convolutional Neural Net Interpretable Visual Layer"
date: "2025-10-14"
tags: ["university", "ML", "research", "SAE", "NMF"]
excerpt: "Under what conditions do SAE and NMF converge to similar solutions?"
---

I don't know where to start, but to the point. What if we could train the model to be interpretable by construction? That is, to avoid the neural collapse due to overoptimization of a cross entropy objective, we design a network which learns to decompose its activations into part-based concepts which then instead are classified.

![img5.png](assets/img5.png)
_Idea and drawing of dr. Sibylle Hess_

Taking either a pretrained, or already trained CNN, call it a backbone model, I attach a new layer at the end called "Visual Layer". During training the activations for an input are taken and pass through an additional layer with each neuron having a corresponding input sized image. For the actual classification the idea is to feed the linear combination i.e. the sum of neuron times corresponding image, back through the backbone model. Let's try to define it in terms of optimization:

Let's say $\omega: l\to m$ is the backbone model ($l$ is the input space), $V \in \mathcal{R}^{m \times n}$ the matrix of activation to neuron transformation, next though not necessary we'd like an activation function, its either:
- Nothing, though this would permit negative weights.
- ReLU
- Sigmoid
- Softmax - $\sigma(z_i) = \frac{e^{z_i}}{\sum_{j=1}^{n} e^{z_j}}$, which was my choice for simplicity, as then when we make the neurons add to each other the created image from linear combination will be in the correct scale.

and lastly, the model own representations $W \in \mathcal{R}^{n\times l}$. The optimization becomes:

The hypothesis is, the visual layer architecture will push the model to extract its own concepts, as it will have to learn additive parts-based images to capture the input space.

This is _almost_ exactly what I implement. 

## Core Implementation


- Custom PyTorch layer with 100 trainable images (3×224×224 each)
- Architecture: Input → MobileNet features → weighted sum of trainable images → MobileNet features →
classifier
- Two-pass forward: first pass gets weights, second pass classifies generated image

    - ✅ Used torch.einsum for memory-efficient weighted sum
    - ✅ Initialized neurons with class examples from dataset (cyclic: Cone, Cube, Cylinder, etc.)
    - ✅ Added softmax on activations (proper weighted average)
    - ✅ Froze backbone (only train: neuron_activations, visual_layer, classifier)
    - ✅ Added L2 regularization on trainable images
    - ✅ Model returns generated images during training


Issues:
1. training and validation losses and accuracies are far away from each other
2. The model doesn't update the actual concept images just seems to work on the linear layer