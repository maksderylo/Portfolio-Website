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
I built the decoder not to mix the concepts so they can be visualized independently (same as not using the neural layer from activation). By setting `groups=concept_dim` the concepts don't mix with each other. It's a 5-stage upsample making the output of the decoder same as the input image resolution.

Although each channel of the decoder is not mixing with each other, I found the simple visualization of when one channel for a concept is active while zeroing the rest out (one-hot probes) pretty meaningless - I was getting just the same color for each channel marginally changing throughout the training:
![img.png](assets/onecolor.png)
(Though do note, the validation of the model is still just random guessing at this point)

The visualizations are constant without any spatial features by construction, as the input was spatially flat, which yielded with the depthwise convolution:

$$out_k[x,y] = \sum_{dx,dy}W_k[dx,dy] \cdot 1.0 = \text{sum}(W_k) = const$$

And another problem is that the decoder never learns these one-hot probes since the output of the visualization layer is a dense vector making it an OOD problem. With that, we change the `visualize_concept` method to use a precomputed `mean_activation` - the average feature map over the training images for a baseline. Then for a concept `k`:
1. **Img High** - Take the mean activation, add a constant `delta` to the channel `k` $\to$ decode $to$ get RGB image.
2. **Img Low** - Take the mean activation, subtract a constant `delta` to the channel `k` $\to$ decode $to$ get RGB image.
3. Take the difference of `img_high` and 'img_low' and normalize.
The idea being, that we extract the contribution of a concept to a mean image activations.
```python
@torch.no_grad()
def visualize_concept(self, k, mean_activation, delta=3.0, device="cuda"):
    """
    Visualize neuron k by perturbing it around the mean activation.
    Uses realistic background (mean activation) instead of one-hot input.
    
    Args:
        k: Neuron index to visualize
        mean_activation: Precomputed mean activation map [1, feature_dim, 7, 7]
        delta: Amount to perturb the neuron (default: 3.0)
        device: Device to run on
        
    Returns:
        diff: Visualization showing neuron k's contribution [1, 3, 224, 224]
    """
    assert 0 <= k < self.feature_dim
    base = mean_activation.clone().to(device)
    
    # Perturb neuron k upward
    high = base.clone()
    high[0, k, :, :] += delta
    img_high = self.visual_decoder(high)  # Direct RGB output
    
    # Perturb neuron k downward
    low = base.clone()
    low[0, k, :, :] -= delta
    img_low = self.visual_decoder(low)  # Direct RGB output
    
    # Difference shows neuron k's visual contribution
    diff = img_high - img_low
    
    # Normalize to [0,1] for display
    diff = (diff - diff.min()) / (diff.max() - diff.min() + 1e-8)
    
    return diff.cpu()
```

## Losses
