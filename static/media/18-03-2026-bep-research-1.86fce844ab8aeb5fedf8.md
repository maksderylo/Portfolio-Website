---
title: "Convolutional Neural Net Interpretable Visual Layer"
date: "2026-03-22"
tags: ["university", "ML", "research", "SAE", "NMF"]
excerpt: "Attempt at a custom CNN interpretable layer"

---
I don't know where to start, but to the point. What if we could train the model to be interpretable by construction? That is, to avoid the neural collapse due to overoptimization of a cross entropy objective, we design a network which learns to decompose its activations into part-based concepts which then instead are classified.
![2026-03-22_22-07.png](assets/2026-03-22_22-07.png)

## The Idea

![img5.png](assets/img5.png)
_Idea and drawing of dr. Sibylle Hess_

Taking either a pretrained, or already trained CNN, call it a backbone model, I attach a new layer at the end called "Visual Layer". During training the activations for an input are taken and pass through an additional layer with each neuron having a corresponding input sized image. For the actual classification the idea is to feed the linear combination i.e. the sum of neuron times corresponding image, back through the backbone model. Let's try to define it in terms of optimization:

Let's say $\omega: l\to m$ is the backbone model ($l$ is the input space), $V \in \mathcal{R}^{m \times n}$ the matrix of activation to neuron transformation, next though not necessary we'd like an activation function, its either:

- Nothing, though this would permit negative weights.
- ReLU
- Sigmoid
- Softmax - $\sigma(z_i) = \frac{e^{z_i}}{\sum_{j=1}^{n} e^{z_j}}$ ([link](https://www.geeksforgeeks.org/deep-learning/the-role-of-softmax-in-neural-networks-detailed-explanation-and-applications/), which was my choice for simplicity, as then when we make the neurons add to each other the created image from linear combination will be in the correct scale.

and lastly, the model own representations $W \in \mathcal{R}^{n\times l}$ and a classification head $g: \mathcal{R}^m \to \mathcal{R}^C$. The optimization becomes:

$$
\min_{V, W, g} \frac{1}{N} \sum_{j=1}^N \mathcal{L}_{CE}(g(\omega (W^T \sigma(V^T \omega(x^{(j)})))), y^{(j)})
$$

The hypothesis is, the visual layer architecture will push the model to extract its own concepts, as it will have to learn additive parts-based images to capture the input space. This is _almost_ exactly what I implement.

## Core Implementation

The architecture is:

```python
class VisualLayerModel(nn.Module):
    def __init__(self, num_neurons, num_classes, pretrain=False, init_dataset=None):
        super().__init__()

        # core architecture of mobilenet
        if pretrain:
            model_backbone = models.mobilenet_v2(weights='IMAGENET1K_V1')
        else:
            model_backbone = models.mobilenet_v2(weights=None)
        self.features = model_backbone.features

        for param in self.features.parameters():
            param.requires_grad = False

        # pooling from the backbone features
        self.avgpool = nn.AdaptiveAvgPool2d((1,1))

        # Visual Layer components
        self.num_neurons = num_neurons
        self.num_classes = num_classes

        self.neuron_activations = nn.Linear(1280, num_neurons)

        if init_dataset is not None:
            self.visual_layer = self.initialize_from_data(init_dataset, num_neurons, num_classes)
        else:
            self.visual_layer = nn.Parameter(
                torch.randn(num_neurons, 3, 224, 224) * 0.01
            )
        # first is the amount of neurons, second channels, then pixels
        self.images = None
        self.model_reconstruction = None
        self.classifier = nn.Linear(1280, num_classes)

    def forward(self, x, use_visual_layer=True):
        # visual pass
        backbone_activations = self.features(x)
        backbone_activations = self.avgpool(backbone_activations)
        backbone_activations = backbone_activations.flatten(1)

        if not use_visual_layer:
            output = self.classifier(backbone_activations)
            return output

        # additive params of images
        activations = self.neuron_activations(backbone_activations)
        # otherwise, sigmoid, softmax or relu
        activations = torch.softmax(activations, dim=1)
        self.sample_activation = activations
      
        # now the reconstructed image
        generated_img = torch.einsum('bn,nchw->bchw', activations, self.visual_layer)

        # classification pass
        final_activations = self.features(generated_img)
        final_activations = self.avgpool(final_activations)
        final_activations = final_activations.flatten(1)

        # output of classification
        output = self.classifier(final_activations)
      
        # Return generated images during training for consistency loss
        if self.training:
            return output, generated_img
        else:
            return output
```

- Custom PyTorch layer with 100 trainable images (3×224×224 each)
- Architecture: Input → MobileNet features → weighted sum of trainable images → MobileNet features →
  classifier
- Two-pass forward: first pass gets weights, second pass classifies generated image

## Results

This architecture, _so far_, is not successful. I have attempted many tweaks, and ideas, such as:

- Initializing the images to random noise or data samples.
- Adding secondary loss terms, e.g. initial image reconstruction(of activations), sort of sparsity.
- Instead of linear combination, directly smaller the visual layer learnable space by optimizing patches instead.

With the bottom line currently being:

1. training and validation losses and accuracies are far away from each other. Either the dataset is too small and is learning the data, or something else is happening, regardless of the tweaks the accuracy on the validation dataset was either random or oscillating.
2. The model doesn't update the actual concept images just seems to work on the linear layer. This seems to show that the sheer amount of pixels being optimized makes them invariant to the optimization and a double backbone pass causing gradient to vanish.

## What next:

- fix the classifier,
- investigate vanishing gradient
- remove the linear layer to make it into direct investigation of representation layer
- potentially look into adversarial perturbation

## Related work

1. ProtoPNet [link](https://arxiv.org/pdf/1806.10574) is a most similar architecture I could find that also does the interpretability by design and not post-hoc in a k-nearest neighbours sort of way.

Instead of a visual layer, they implement a "prototype" one. At an output of a convolutional layer, the network learns prototypical activations of a patch of the output. With that, each of the extracted activations are later matched with patches from the original input space to represent that patch in a visualizable way.
![2026-03-24_13-21.png](assets/2026-03-24_13-21.png)
This idea is further expanded with Deformable ProtoPNet [link](https://arxiv.org/pdf/2111.15000) giving the prototypes more freedom to adapt, and PIP-Net [link](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=10204807) [code](https://github.com/M-Nauta/PIPNet)

2. Concept bottleneck models [link](https://dl.acm.org/doi/10.5555/3524938.3525433)
3. Self Explaining Neural Networks (SENN) [link](https://www.geeksforgeeks.org/deep-learning/self-explaining-neural-networks/)

## Open-ended questions:
1. how does the training the model with autoencoder already in the middle change the global optimum?
2. should the concepts be protected against adversarial perturbations?
