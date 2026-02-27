
## 1. 稀疏向量vs密集向量

稀疏向量，也常被称为“词法向量”，是基于词频统计的传统信息检索方法的数学表示。它通常是一个维度极高（与词汇表大小相当）但绝大多数元素为零的向量。

其核心公式如下：

$$
Score(Q, D) = \sum^{n}_{i=1}IDF(q_i) \cdot \frac{f(q_i, D)\cdot(k_1 + 1)}{f(q_i, D) + k_1 \cdot(1-b+b\cdot\frac{|D|}{avgdl})}
$$

其中：
- $IDF(q_i)$：查询词$q_i$的逆文档频率，用于衡量一个词的普遍程度。越常见的词，$IDF$值越低。
- $f(q_i, D)$：查询词$q_i$在文档$D$中的词频。
- $|D|$：文档$D$的长度。
- $avgdl$： 集合中所有文档的平均长度。
- $k_1, b$: 可调节的超参数。$k_1$ 用于控制词频饱和度（一个词在文档中出现10次和100次，其重要性增长并非线性）， $b$用于控制文档长度归一化的程度。


密集向量，也常被称为“语义向量”，是通过深度学习模型学习到的数据（如文本、图像）的低维、稠密的浮点数表示。这些向量旨在将原始数据映射到一个连续的、充满意义的“语义空间”中来捕捉“语义”或“概念”。在理想的语义空间中，向量之间的距离和方向代表了它们所表示概念之间的关系。

优点：能理解同义词，近义词和上下文关系，泛化能力强，在语义搜索任务中表现卓越。
缺点：可解释性差，需要大量数据和算力进行模型训练，对于未登录词汇的处理相对困难。

### 示例
**稀疏向量表示** 
核心思想是只储存非0值。例如，一个8维的向量 `[0, 0, 0, 5, 0, 0, 0, 9]`，其大部分元素都是零。用稀疏格式表示，可以极大地节约空间。常见的稀疏表示法有两种：

1. 字典/键值对（Dictionary/Key-Value）：这种方式将非0元素的索引作为键值，值作为值。
```
// {索引: 值}
{
  "3": 5,
  "7": 9
}
```

2. 坐标列表（Coordinate list - COO）：这种方式通常选用一个元组 `(维度, [索引列表], [值列表])` 来表示。上面的向量可以表示为：
```
(8, [3, 7], [5, 9])
```


**密集向量表示**
与稀疏向量不同，密集向量的所有维度都有值，因此使用**数组 `[]`** 来表示是最直接的方式。

## 2. 混合检索

### 倒数排序融合（Reciprocal Rank Fusion）

RRF不关心不同检索系统的原始得分，只关心每个文档在各自结果中的排名。

计分公式为：
$$
RRF_{score}(d)=\sum^{k}_{i=1} \frac{1}{rank_i(d)+c}
$$
其中：
- $d$是待评分的文档。
- $k$是检索系统的数量（这里是2，即稀疏和密集）。
- $rank_i(d)$是文档$d$在第$i$个检索系统中的排名。
- $c$是一个常数（通常设为60），用于降低排名靠前文档的相对权重，实现更稳健的排名组合。

### 加权线性组合

这种方法需要将不同检索系统的得分进行归一化（例如，统一到0-1区间），然后通过一个权重参数$\alpha$ 来进行线性组合。

$$
Hybrid_{score} = \alpha \cdot Dense_{score} + (1-\alpha) \cdot Sparse_{score}
$$
通过调整 $\alpha$ 的值，可以灵活地控制语义相似性与关键词匹配在最终排序中地贡献比例。


### 代码实践
```Python
import json
import os
import numpy as np
from pymilvus import connections, MilvusClient, FieldSchema, CollectionSchema, DataType, Collection, AnnSearchRequest, RRFRanker
from pymilvus.model.hybrid import BGEM3EmbeddingFunction

# 1. 初始化设置
COLLECTION_NAME = "dragon_hybrid_demo"
MILVUS_URI = "http://localhost:19530"              # 服务器模式
DATA_PATH = "../../data/C4/metadata/dragon.json"   # 相对路径
BATCH_SIZE = 50

# 2. 连接 Milvus 并初始化嵌入模型
print(f"--> 正在连接到 Milvus: {MILVUS_URI}")
connections.connect(uri=MILVUS_URI)

print("--> 正在初始化 BGE-M3 嵌入模型...")
ef = BGEM3EmbeddingFunction(use_fp16=False, device="cpu")
print(f"--> 嵌入模型初始化完成。密集向量维度: {ef.dim['dense']}")

# 3. 创建 Collection
milvus_client = MilvusClient(uri=MILVUS_URI)
if milvus_client.has_collection(COLLECTION_NAME):
	print(f"--> 正在删除已存在的 Collection '{COLLECTION_NAME}'...")
	milvus_client.drop_collection(COLLECTION_NAME)
	

fields = [
	FieldSchema(name="pk", dtype=DataType.VARCHAR, is_primary=True, auto_id=True, max_len),
	FieldSchema(name="img_id", dtype=DataType.VARCHAR, max_length=100),
	FieldSchema(name="path", dtype=DataType.VARCHAR, max_length=256),
	FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=256),
	FieldSchema(name="description", dtype=DataType.VARCHAR, max_length=4096),
	FieldSchema(name="category", dtype=DataType.VARCHAR, max_length=64),
	FieldSchema(name="location", dtype=DataType.VARCHAR, max_length=128),
	FieldSchema(name="environment", dtype=DataType.VARCHAR, max_length=64),
	FieldSchema(name="sparse_vector", dtype=DataType.SPARSE_FLOAT_VECTOR),
	FieldSchema(name="dense_vector", dtype=DataType.FLOAT_VECTOR, dim=ef.dim["dense"])
]

# 如果集合不存在，则创建它及索引
if not milvus_client.has_collection(COLLECTION_NAME):
	print(f"--> 正在创建 Collection '{COLLECTION_NAME}'...")
	schema = CollectionSchema(fields, description="关于龙的混合检索示例")
	# 创建集合
	collection = Collection(name=COLLECTION_NAME,schema=schema, consistency_level="Strong")
	print("--> Collection 创建成功。")
	
	# 创建索引
	print("--> 正在为新集合创建索引...")
	sparse_index = {"index_type": "SPARSE_INVERTED_INDEX", "metric_type": "IP"}
	collection.create_index("sparse_vector", sparse_index)
	print("稀疏向量索引创建成功。")
	
	dense_index={"index_type": "AUTOINDEX", "metric_type": "IP"}
	collection.create_index("dense_vector", dense_index)
	print("密集向量索引创建成功。")

collection = Collection(COLLECTION_NAME)
collection.load()
print(f"--> Collection '{COLLECTION_NAME}' 已加载到内存。")
```

**fields字段类型分析：**

- **pk**: 主键设计，`auto_id=True` 让 Milvus 自动生成唯一标识，避免主键冲突
- **标量字段**: 7个VARCHAR字段用于存储元数据，`max_length` 根据实际数据分布优化存储
- **稀疏向量**: `SPARSE_FLOAT_VECTOR` 类型，存储关键词权重
- **密集向量**: `FLOAT_VECTOR` 类型，固定1024维，存储语义特征



#### BGE-M3双向量生成

##### 数据加载与预处理
```python
if collection.is_empty:
	print(f"--> Collection 为空，开始插入数据...")
	with open(DATA_PATH, 'r', encoding='utf-8') as f:
		dataset = json.load(f)
	
	doc, metadata = [], []
	for item in dataset:
		parts = [
			item.get('title', ''),
			item.get('description', ''),
			item.get('location', ''),
			item.get('environment', ''),
		]
		docs.append('  '.join(filter(None, parts)))
		metadata.append(item)
		
```

##### 向量生成
```python
print("--> 正在生成向量嵌入...")
embeddings = ef(docs)
print("--> 向量生成完成。")

# 获取两种向量
sparse_vectors = embeddings["sparse"]   # 稀疏向量：词频统计
dense_vectors = embeddings["dense"]     # 密集向量：语义编码
```

##### Collection批量数据插入
```python
# 为每个字段准备批量数据
img_ids = [doc["img_id"] for doc in metadata]
paths = [doc["path"] for doc in metadata]
titles = [doc["title"] for doc in metadata]
descriptions = [doc["description"] for doc in metadata]
categories = [doc["category"] for doc in metadata]
locations = [doc["location"] for doc in metadata]
environments = [doc["environment"] for doc in metadata]

# 插入数据
collection.insert([
	img_ids, paths, titles, descriptions, categories, locations, environments, sparse_vectors, dense_vectors
])

collection.flush()
```

- **字段映射**: 严格按照 Schema 定义的字段顺序插入，9个字段（7个标量+2个向量）
- **`flush()` 作用**: 强制将内存缓冲区数据写入磁盘，使数据立即可搜索
- **最终状态**: Collection 包含6个Entity，索引层使用稀疏向量的 `SPARSE_INVERTED_INDEX` 和密集向量的 `AUTOINDEX`


#### 实现混合检索
##### 查询向量生成
```python
# 6. 执行搜索
search_query = "悬崖上的巨龙"
search_filter = 'category in ["western_dragon", "chinese_dragon", "movie_character"]'
top_k = 5

print(f"\n{'='*20} 开始混合搜索 {'='*20}") 
print(f"查询: '{search_query}'") 
print(f"过滤器: '{search_filter}'")

# 生成查询向量
query_embeddings = ef([search_query])
dense_vec = query_embeddings["dense"][0]
sparse_vec = query_embeddings["sparse"]._getrow(0)
```


##### 混合检索执行

使用 RRF 算法进行混合检索，通过 milvus 封装的 RRFRanker 实现。RRFRanker 的核心参数是 `k` 值（默认60），用于控制 RRF 算法中的排序平滑程度。

其中 `k` 值越大，排序结果越平滑；越小则高排名结果的权重越突出

```python
# 定义搜索参数
search_params = {"metric_type": "IP", "params":{}}

# 先执行单独的搜索
print("\n--- [单独] 密集向量搜索结果 ---")
dense_results = collection.search(
	[dense_vec],
	anns_filed="dense_vector",
	param=search_params,
	limit=top_k,
	expr=search_filter,
	output_field=["title", "path", "description", "category", "location", "environment"]
)[0]

for i, hit in enumerate(dense_results):
	print(f"{i+1}. {hit.entity.get('title')} (Score: {hit.distance:.4f})")
	print(f" 路径: {hit.entity.get('path')}") 
	print(f" 描述: {hit.entity.get('description')[:100]}...")
	
print("\n--- [单独] 稀疏向量搜索结果 ---")
sparse_results = collection.search(
	[sparse_vec],
	anns_field="sparse_vector",
	param=search_params,
	limit=top_k,
	expr=search_filter,
	output_fields=["title", "path", "description", "category", "location", "environment"]
)[0]

for i, hit in enumerate(sparse_results):
	print(f"{i+1}. {hit.entity.get('title')} (Score: {hit.distance:.4f})")
	print(f" 路径: {hit.entity.get('path')}") 
	print(f" 描述: {hit.entity.get('description')[:100]}...")
	
print("\n--- [混合] 稀疏+密集向量搜索结果 ---")
# 创建 RRF 融合器
rerank = RRFRanker(k=60)

# 创建搜索请求
dense_req = AnnSearchRequest([dense_vec], "dense_vector", search_params, limit=top_k)
sparse_req = AnnSearchRequest([sparse_vec], "sparse_vector", search_params, limit=top_k)

# 执行混合搜索
```