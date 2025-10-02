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

**Shallow AE** - having single hidden layer.

**Tied AE** - where encoder and decoder weights are equal.

**Teacher-Student setup** - smaller model learns to mimic larger pre-trained one.

### Shallow Autoencoder - used in a paper

Given a $D$-dimensional input $\bold{x} = (x_i)$ the output of the autoencoder is given by

$$
\hat{x} = \sum_k^K v_i^k g(\lambda^k)\text{, } \lambda^k\equiv\frac{\bold{w}^k\bold{x}}{\sqrt{D}}
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

Furthermore, the research notes the result hold remarkably well on real datasets like (CIFAR-10), as the derived models use synthetic Gaussian data.

# Disentangling Dense Embeddings with Sparse Autoencoders - Charles O'Neill, Christine Ye, Kartheik Iyer, John F. Wu

https://arxiv.org/abs/2408.00657

This is my starting point with Sparse Autoencoders, both delving deeper mathematically, and learning the practical application of disentangling features. Specifically, due to operations on relatively small latent spaces, activations of neurons are tangled leading to the "everything activates everything" problem. Using sparse AE, having larger latent space than the input and output, as well as adding sparsity to the objective, allow to retrieve the meaning behind encoded features.

![image.png](assets/image5.png)

This paper aims to fill the gap by analyzing the application of SAE to dense text embeddings developing a model for interoperability, (or as above - autointerpretability - which I less focus on) of features and relationships between them. Importantly, it provides background on embedding representation and sparse autoencoders, thus .

## Definitions

**Sparse autoencoder (SAE)** - class of autoencoders with a sparse set of features (semantic concepts) in a higher-dimensional space, potentially disentangling superposed features.

**One-hot encodings** - vectors with a single 1 for category and 0 for the rest - equidistant.

**Dense vector embedding** - continuous, low-dimensional vectors.

**Ablation** - systematic removal or modification of a component (such as a layer, feature, or module) in a model to evaluate its impact on overall performance.

## Sparse Autoencoders

Let $\bold{x} \in \mathbb{R}^d$ be an input vector, and $\bold{h} \in \mathbb{R}^n$ be the hidden representation, where typically $n \gg d$ (much greater than). The encoder and decodder functions are defined as:

$$
\begin{aligned}
\text{Encoder: }\quad \bold{h} &= f_\theta(\bold{x}) = \sigma(W_e \bold{x} + \bold{b}_e) \\
\text{Decoder: }\quad \hat{\bold{x}} &= g_\phi(\bold{h}) = W_d \bold{h} + \bold{b}_d
\end{aligned}
$$

where $W_e \in \mathbb{R}^{n \times d}$ and $W_d \in \mathbb{R}^{d \times n}$ are encoding and decoding weight matrices and their corresponding bias vectors $b_e \in \mathbb{R}^n$ and $b_d \in \mathbb{R}^d$, $\sigma(\cdot)$ is a non-linear activation function (like ReLU or sigmoid).

The training objective of SAE combines three components:

- Reconstruction loss
- Sparsity constraint
- Sometimes (here) auxiliary loss

$$
\mathcal{L}(\theta,\phi) = \frac{1}{d} \Vert \bold{x-\hat{x}} \Vert_2^2 + \lambda \mathcal{L}_{sparse}(h) + \alpha \mathcal{L}_{aux}(x,\hat{x})
$$

where $\lambda > 0$ and $\alpha > 0$ are hyperparameters controlling the trade-off between reconstruction fidelity, sparsity, and the auxiliary loss.

As the sparsity constraint, they use a $k$-sparse constraint - only $k$ largest activations in $\bold{h}$ are retained.

As the auxiliary loss, they use a technique to remove non activating "dead" latents. Latents are flagged as dead during training if they have not activated for a predetermined number of tokens. Given the reconstruction error of the main model $\bold{e = x -\hat{x}}$, they define the auxiliary loss as:

$$
\mathcal{L}_{aux}(\bold{x,\hat{x}}) = \Vert \bold{e - \hat{e}} \Vert_2^2
$$

where $\bold{\hat{e}} =W_d\bold{z}$ is the reconstruction using the top $k_{aux} = 2k$ (twice the number of active latents) dead latents, and $\bold{z}$ is the sparse representation using only these dead latents. This additional loss term helps to revive dead features and improve overall representational capacity of the model.

# Learning the parts of object by non-negative matrix factorization - Daniel D. Lee, H. Sebastian Seung

https://www.cs.columbia.edu/~blei/fogm/2020F/readings/LeeSeung1999.pdf


The paper where they show the parts-based representation of NMF (easy to make a small experiment here, just load the olivetti face dataset, load some library that computes NMF, compute the NMF on the faces dataset, visualize the vectors that correspond to the nonnegative principal components - you get the parts based representations).
