---
title: "The model does what the model does"
date: "2026-05-07"
tags: ["university", "ML", "research", "CNN", "Interpretability"]
excerpt: "Comparing MNIST ante-hoc visual decoder with and without pushing for decoding into digit patterns"
---

This post will summarize the behavior of encoder-decoder architecture which I have worked on [here](www.maksderylo.com/blog/29-03-2026-bep-research-2), where the encoder is a pretrained for classification CNN and the decoder is trained to decode the activations into images so they classify the same.


## Architecture Simplification
From that point the architecture was simplified to a simple 3 layer CNN and a visual decoder on MNIST.

``` python
# Backbone model
self.features = nn.Sequential(
    nn.Conv2d(in_channels, 32, kernel_size=3, padding=1),
    nn.ReLU(inplace=True),
    nn.MaxPool2d(2),  # 28 -> 14
    nn.Conv2d(32, 64, kernel_size=3, padding=1),
    nn.ReLU(inplace=True),
    nn.MaxPool2d(2),  # 14 -> 7
    nn.Conv2d(64, feature_dim, kernel_size=3, padding=1),
    nn.ReLU(inplace=True),
)

# Simple one-stage upsampling decoder
self.visual_decoder = nn.Sequential(
    nn.Upsample(scale_factor=4, mode='bilinear', align_corners=False),  # 7 -> 28
    nn.Conv2d(self.feature_dim, image_channels, kernel_size=3, padding=1),
)
```

The simplification follows from the previous work failing to stabilize on more complex Imagenet, and hopefully the preliminary results will generalize to more complex data.

Crucially, the backbone CNN and classifier with a quick pretraining achieve $>99\%$ accuracy, and the training with visual decoder no longer overfits.



