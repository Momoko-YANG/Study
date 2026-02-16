**多模态嵌入 (Multimodal Embedding)** 的目的是将不同类型的数据（如图像和文本）映射到**同一个共享的向量空间**。在这个统一的空间里，一段描述“一只奔跑的狗”的文字，其向量会非常接近一张真实小狗奔跑的图片向量。

### CLIP模型浅析
在图文多模态领域，OpenAI 的 **CLIP (Contrastive Language-Image Pre-training)** 是一个很有影响力的模型，它为多模态嵌入定义了一个有效的范式。

CLIP 的架构清晰简洁。它采用**双编码器架构 (Dual-Encoder Architecture)**，包含一个图像编码器和一个文本编码器，分别将图像和文本映射到同一个共享的向量空间中。


### 常用多模态嵌入模型（以bge-visualized-m3为例）
在技术架构上，bge-visualized-m3 会先用视觉编码器提取图像的 **patch token**，再将其映射到与文本同维度的“图像 token”，与文本 token 一起送入 BGE 的 Transformer 编码器进行联合建模，最终得到可用于图文检索的统一向量表示。

## 代码示例
1. 环境准备
	 步骤1：安装`visual_bge`模块
```bash
# 进入visual_bge目录
cd code/C3/visual_bge

# 安装visual_bge模块及其依赖
pip sintall -e .

# 返回上级目录
cd ..

```

下载模型权重：
```bash
# 运行模型下载脚本
python download_model.py
```

基础示例：
```python
import os
import torch
from visual_bge.visual_bge.modeling import Visualized_BGE

model = Visualized_BGE(model_name_bge="BAAI/bge-base-en-v1.5",
                       model_weight="../../models/bge/Visualized_base_en_v1.5.pth")
model.eval()

with torch.no_grad():
    text_emb = model.encode(text="datawhale开源组织的logo")
    img_emb_1 = model.encode(image="../../data/C3/imgs/datawhale01.png")
    multi_emb_1 = model.encode("../../data/C3/imgs/datawhale01.png", text="datawhale开源组织的logo")
    img_emb_2 = model.encode(image="../../data/C3/imgs/datawhale02.png")
    multi_emb_2 = model.encode(image="../../data/C3/imgs/datawhale02.png", text="datawhale开源组织的logo")

# 计算相似度
sim_1 = img_emb_1 @ img_emb_2.T
sim_2 = img_emb_1 @ multi_emb_1.T
sim_3 = text_emb @ multi_emb_1.T
sim_4 = multi_emb_1 @ multi_emb_2.T

print("=== 相似度计算结果 ===")
print(f"纯图像 vs 纯图像: {sim_1}")
print(f"图文结合1 vs 纯图像: {sim_2}")
print(f"图文结合1 vs 纯文本: {sim_3}")
print(f"图文结合1 vs 图文结合2: {sim_4}")
```


代码解读：
- 模型架构：`Visualized_BGE`是通过将图像token嵌入集成到BGE文本嵌入框架中构建的通用多模态嵌入模型，具备处理超越文本的多模态数据的灵活性。
- 模型参数：
	- `model_name_bge`: 指定底层BGE文本嵌入模型，继承其强大的文本表示能力。
	- `model_weight`: Visual BGE的预训练权重文件，包含视觉编码器参数。
- 多模态编码能力： Visual BGE提供了编码多模态数据的多样性，支持纯文本、纯图像或图文组合的格式：
	- 纯文本编码：保持原始BGE模型的强大文本嵌入能力。
	- 纯图像编码：使用基于EVA-CLIP的视觉编码器处理图像。
	- 图文联合编码：将图像和文本特征融合到统一的向量空间。
- 应用场景：主要用于混合模态检索任务，包括多模态知识检索，组合图像检索，多模态查询的知识检索等。
- 相似度计算：使用矩阵乘法计算余弦相似度，所有嵌入向量都被标准化到单位长度，确保相似度值在合理范围内。