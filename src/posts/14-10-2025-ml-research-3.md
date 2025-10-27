---
title: "Machine Learning Research Notes 3 - SAE and NMF comparison"
date: "2025-14-08"
tags: ["university", "ML", "research", "SAE", "NMF"]
excerpt: "Under what conditions do SAE and NMF converge to similar solutions?"
---
This week I will focus on wrapping up the knowledge gathered about NMF and SAE, while also trying to focus on the parametrization of both in order to get similar parts based representation results.

# Quick Wrap-up

## NMF

NMF decomposes a non-negative data matrix $D$ into two non-negative matrices $W$ (basis) and $H$ (coefficients) such that:

$$
D \approx WH
$$

, the standard formulation of the optimization problem is:

$$
\min_{W,H} ||D - WH||^2_F
$$

subject to $W \geq 0, H \geq 0$.

## SAE

1. Forward pass:

- Encoder: $H_{pre} = DU^T$, where $D$ is the data matrix, $U$ the encoder weights
- Activation: $H = f(H_{pre})$ (e.g. ReLU, jumpReLU, TopK)
- Reconstruction: $\hat{D} = YX^T$, where $Y$ is the decoder weights

2. Backward Pass: The model updates weights via gradient descent on the reconstruction loss:

$$
\mathcal{L} = ||D - \hat{D}||^2 + \lambda \cdot \text{sparsity\_loss}(H)
$$

where $\lambda$ is a hyperparameter controlling the influence of the sparsity loss (e.g. KL-Divergence).

Thus, for SAE without the sparsity loss, but with TopK hard constraint, the SAE in terms of optimization can be written down as

$$
\min_{U,X}||D-\hat{D}||^2_2
$$

$$
\text{s.t. }\hat{D} =HX^T,
$$

$$
H=JumpReLU(DU^T),
$$

$$
||H_{i\cdot}||_0 = k, \forall i
$$

where $D$ is the original data, $\hat{D}$ is the reconstruction, $U$ and $X$ the encoder and decoder weights respectively.

# Comparison of NMF and SAE

https://arxiv.org/pdf/1601.02733

https://arxiv.org/html/2411.02124v1

### New Definitions and Terms

- **Variational Autoencoder (VAE)**: A type of autoencoder that learns a probabilistic mapping from input data to a latent space, allowing for the generation of new data samples by sampling from the learned distribution. Also used for disentanglement - https://openreview.net/forum?id=Sy2fzU9gl
- **NNSAE** - Nonnegative Sparse Autoencoder: An autoencoder that incorporates non-negativity constraints on the weights and activations, promoting parts-based representations similar to Non-negative Matrix Factorization (NMF).
- **NCAE** - Nonnegative Constrained Autoencoder - https://arxiv.org/pdf/1601.02733
