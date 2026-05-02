pm---
title: "Clarification questions post midterm thesis mark"
date: "2026-04-30"
tags: ["university", "ML", "research", "CNN", "Interpretability"]
excerpt: ""
---

Since the last post I have adapted the research question to be **To what extent can a CNN produce coherent representation layer concept decompositions that support classification?**

I imagine it is not the final report question, but instead a good guiding question to what I will be doing before the finally formalizing the thesis. After the break and a meeting with the supervisor I decided to answer some foundational questions regarding this research which I briefly do in this post to summarize the intuition.

### What do we mean for a neuron to "encode a concept"?

The encoding process and the difficulty in disentangling the representation space (making the concepts/features separate from each other), faces few critical problems. In the ideal scenario, when a concept is present in an image we would have a single corresponding neuron which activates for that image - there exists a binjective function between the concept space and the neurons.

#### Privileged Basis argument

"A privileged basis is a meaningful basis for a vector space. That is, the coordinates in that basis have some meaning, that coordinates in an arbitrary basis do not have. It does not, necessarily, mean that this is an interpretable basis." [ref](https://www.neelnanda.io/mechanistic-interpretability/glossary)

The argument for alignment of features to the privileged basis (individual neurons have meaning) is that we are aware of the types of operations performed which suggest a certain information structure, as otherwise it would lead to less capacity.

In neural networks the operations between layers are just linear transformations followed by ReLU, hence each neuron can only activate positively. This encourages features to align with the neuron coordinate basis, because it can fit the most features without interference under the assumption of sparse features (rarely co-activating) [ref](https://transformer-circuits.pub/2022/toy_model/index.html). Conversely, the following **Polysemanticity** and **Superposition** argue against the thinking that one might recover concept=neuron alignment via rotation.

#### Monosemanticiy vs Polysemanticity
Simply, if there are fewer neurons than concepts that need to be encoded the concepts can become polysemantic, which has been shown to happen for concepts that are usually unrelated e.g.:
![2026-04-30_12-47.png](assets/2026-04-30_12-47.png)
From visualization from [link](https://openaccess.thecvf.com/content/CVPR2025W/MIV/papers/Hesse_Disentangling_Polysemantic_Channels_in_Convolutional_Neural_Networks_CVPRW_2025_paper.pdf), where a CNN channel is activated by concepts of both cauliflower and digital clock.

#### Superposition
It's a bit confusing because different people might think of different things. I have encountered two main ones: the Anthropic "Toy Models of Superposition" [ref](https://transformer-circuits.pub/2022/toy_model/index.html) blog post/paper, which formalates the superposition based on the capacity argument similar to the polysemanticity and Smolensky superposition formalized in "From superposition to sparse codes: interpretable representations in neural networks" [ref](https://ar5iv.labs.arxiv.org/html/2503.01824).

Anthropic researchers argue and show superposition based on the capacity argument:
![2026-04-30_15-20.png](assets/2026-04-30_15-20.png) 
basically if there are many important features, the model will geometrically have to pack them in a not perfect orthogonal manner, and thus, resulting in interference.

The second superposition theorem is the **Smolensky superposition**:
![2026-04-30_15-28.png](assets/2026-04-30_15-28.png)
which is about how composite concepts are represented by the model.

#### Linear Combination of Neurons
What makes this whole problem even worse is that two neurons might encode some concept, while the individual ones are meaningless. The early work focused on the idea that neuron=concept and there are a bunch of papers just visualizing the one-hot neuron activation. This combined with polysemanticity of neurons (breaking bijection) and superposition (showing the neurons cannot always be aligned with individual neurons when number of features exceeds the number of dimensions) is a lackluster approach which can be already seen in the Anthropic visualization above. 

Features are instead represented by directions in the activation space. The actual neurons (non-individual) being scalar projections in the activation space to the concept vectors e.g. [ref](https://openreview.net/pdf/61d48dbd0dbde4667e2db287913ca916bc44d290.pdf). The last adaptation to mention is the view of the individual neurons as a linear combination of concepts instead. The paper that shows this nicely is "Linear Explanations for Individual Neurons" [ref](https://openreview.net/pdf/df744e36afaf0640f1c021dc0b06fbf36fe57c0e.pdf).
![2026-04-30_16-34.png](assets/2026-04-30_16-34.png)

A "neuron" or a "feature" is a direction in the activation space, while "circuits" are computational subgraphs of those features [ref](https://distill.pub/2020/circuits/zoom-in/).

### What are the structural transformer - neural network differences affecting mechanistic interpretability?

### Does the LLM interpretability research applicable in visual domain?
A subquestion would be - is the Linear Representation Hypothesis also a CNN thing?

### What is the final direction of my thesis? 

___This post is a work in progress___
