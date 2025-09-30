---
title: "Machine Learning Research Notes 1 - Autoencoders and NMF"
date: "2025-09-30"
tags: ["university", "ML", "research", "autoencoders", "NMF", "SAE"]
excerpt: "Compiled knowledge from papers and research on autoencoders and NMF."
---
This is the first post in a series where I plan to improve my writing abilities, as well as compile some of the knowledge I gather from reading papers, performing experiments and doing research on various machine learning topics.

# Papers and Notes

## The dynamics of representation learning in shallow, non-linear autoencoders - Maria Refinetti, Sebastian Goldt

https://proceedings.mlr.press/v162/refinetti22a/refinetti22a.pdf

The main question of this paper I take out is the investigation whether nonlinear autoencoders can reach the PCA error, which the linear AE do by learning the principal components sequentially. With that said, as this is a paper that focuses on training of autoencoders, understanding (or at least attempting to) the decisions and the math behind it is a good learning opportunity to get the intuition for my own experiments later.

### Definitions

**Autoencoders (AE)** - class of neural networks trained to reconstruct their inputs.

**Vanilla SGD** - selects only single point/batch of points to estimate the gradient at each step.

**Bottleneck** - usually called the intermediate layer, as it often is significantly smaller than the input dimension. Forces the learning of compressed representation of inputs.

**Shallow AE** - having single hiddden layer.

**Tied AE** - where encoder and decoder weights are equal.

**Teacher-Student setup** - smaller model learns to mimick larger pre-trained one.


### Shallow Autoencoder - used in a paper

Given a $D$-dimensional input $\bold{x} = (x_i)$ the output of the autoencoder is given by

$$
\hat{x} = \sum_k^Kv_i^kg(\lambda^k)\text{, } \lambda^k\equiv\frac{\bold{w}^k\bold{x}}{\sqrt{D}}
$$

where:

- $\bold{w}^k, \bold{v}^k \in \mathbb{R}^D$ are the encoder and decoder weight of the $k$th hidden neurons respectively.
- $g(\cdot)$ is a function (either linear or non-linear).

Note, this is not a general form, but a mathematical one specific to the paper's investigation.

![image.png](assets/image.png)

The performance of a given autoencoder is measured by the **population reconstruction mean-squared error**:

$$
\text{psme} \equiv \frac{1}{D}\sum_i \mathbb{E}(x_i - \hat{x}_i)^2
$$



### Practical Implications

The paper investigates the sequential learning of principal components ir order of eigenvalue magnitude phenomenon. It shows the learning occurs in phases - the alignment phase where weights align to principal component directions, and the rescaling phase, where weight norms adjust to achieve PCA error.

Some critical requirements mentioned are that sigmoidal AE with tied weights fail to achieve PCA error, and ReLU autoencoders require trainable biases to perform well. It is a readers (also mine) task to investigate why.

Furthermore, the research notes the result hold remarkably well on real datasets like (CIFAR-10), as the derived models usesd synthetic Gaussian data.


# Disentangling Dense Embeddings with Sparse Autoencoders - Charles O'Neill, Christine Ye, Kartheik Iyer, John F. Wu

https://arxiv.org/abs/2408.00657

This is my starting point with Sparse Autoencoders, both delving deeper mathematically, as well as learning the practical application of disentangling features.

### Practical Implications

The paper analyzes the effect of the nonlinear activation in the middle layer of an autoencoder. The math is too wild, but getting some of their intuition about what happens when we train autoencoders might be useful

https://arxiv.org/abs/2408.00657
This paper is probably a good starting point for getting familiar with the sparse AE.

https://www.cs.columbia.edu/~blei/fogm/2020F/readings/LeeSeung1999.pdf
The paper where they show the parts-based representation of NMF (easy to make a small experiment here, just load the olivetti face dataset, load some library that computes NMF, compute the NMF on the faces dataset, visualize the vectors that correspond to the nonnegative principal components - you get the parts based representations).
