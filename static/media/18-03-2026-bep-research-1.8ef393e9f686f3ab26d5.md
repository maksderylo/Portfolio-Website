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