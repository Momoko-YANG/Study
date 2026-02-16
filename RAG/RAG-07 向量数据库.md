### 1. 主要功能
1. 高效的相似性搜索：利用专门的索引技术（如HNSW，IVF），能够在数十亿级别的向量中实现毫秒级的近似最近邻（ANN）查询，快速找到与给定查询最相似的数据。
2. 高维数据存储与管理：专门为存储高维向量而优化，支持对向量数据进行增删查改等基本操作。
3. 丰富的查询能力：除了基本的相似性搜索，还支持按标量字段过滤查询，范围查询和聚类分析等，满足业务复杂度。
4. 可扩展与高可用：现代向量数据库通常采用分布式架构，具备良好的水平扩展能力和容错性，能够通过增加节点来对应数据的增长，并确保服务的稳定可靠。
5. 数据与模型生态集成：与主流的AI框架（LangChain，LlamaIndex）和机器学习工作流无缝集成，简化了从模型训练到向量检索的应用开发流程。

## 2. 向量数据库与传统数据库
传统的数据库擅长处理结构化数据的精确匹配查询（WHERE age = 25），但它们并非为处理高维向量的相似性搜索而设计的。在庞大的向量集合中进行暴力，线性的相似度计算，其计算成本和时间延迟无法接受。

向量数据库（Vector Database）很好地解决了这一问题，它是一种专门设计用于高效存储，管理和查询高维向量的数据库系统。在RAG流程中，它扮演着知识库的角色，是连接数据库与大语言模型的关键桥梁。

向量数据库与传统数据库的主要差异如下：

| 维度     | 向量数据库                 | 传统数据库                   |
| ------ | --------------------- | ----------------------- |
| 核心数据类型 | 高维向量（Embeddings）      | 结构化数据（文本，数字，日期）         |
| 查询方式   | 相似性搜索（ANN）            | 精确匹配                    |
| 索引机制   | HNSW，IVF，LSH等ANN索引    | B-Tree，Hash Index       |
| 主要应用场景 | AI应用，RAG，推荐系统，图像/语音识别 | 业务系统（ERP，CRM），金融交易，数据报表 |
| 数据规模   | 轻松对应千亿级向量             | 通常在千万到亿级行数据，更大规模需复杂分库分表 |
| 性能特点   | 高维数据检索性能极高，计算密集型      | 结构化数据查询快，高维数据查询性能呈指数级下降 |
| 一致性    | 通常为一致性                | 强一致性（ACID事务）            |

## 3. 工作原理
向量数据库的核心是高效处理高维向量的相似性搜索。向量是一组有序数值，可以表示文本，图像，音频等复杂数据的特征或属性。
在RAG系统中，向量一般通过嵌入模型将原始数据转换为高维向量表示。

向量数据库通常采用四层架构，通过存储层，索引层，查询层和服务层的协同工作来实现高效相似性搜索，其中存储层负责向量数据和元数据，优化存储效率并支持分布式存储；索引层维护索引算法（HNSW，LSH，PQ等），负责索引的创建与优化，并支持索引调整；查询层处理查询请求，支持混合查询并实现查询优化，服务层管理客户端连接，提供监控和日志能力，并实现安全管理。

主要技术手段包括：
- 基于树的方法：如Annoy使用的随机投影树，通过树形结构实现对数复杂度的搜索。
- 基于哈希的方法：如LSH（局部敏感哈希），通过哈希函数将相似向量映射到同一“桶”
- 基于图的方法：如NHSW（分层可导航小世界图），通过多层临近图结构实现快速搜索
- 基于量化的方法：如Faiss的IVF和PQ，通过聚类和量化压缩向量

主流向量数据库：
![[Pasted image 20260216102934.png]]

## 4. 本地向量存储：以FAISS为例
FAISS本质上是一个算法库，它将索引直接保存为本地文件（一个`.faiss`索引文件和一个`.pkl`映射文件），而非运行一个数据库服务。

```python
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

# 1. 示例文本和嵌入模型
texts = [
	"张三是法外狂徒", 
	"FAISS是一个用于高效相似性搜索和密集向量聚类的库。", 
	"LangChain是一个用于开发由语言模型驱动的应用程序的框架。"
]
docs = [Document(page_content=t) for t in texts]
embeddings = HuggingFaceEmbeddings(model_name = "BAAI/bge-small-zh-v1.5")

# 2. 创建向量存储并保存到本地
vectorstore = FAISS.from_documents(docs, embeddings)

local_faiss_path = "./faiss_index_store"
vectorstore.save_local(local_faiss_path)

print(f"FAISS index has been saved to {local_faiss_path}")

# 3. 加载索引并执行查询
# 加载时需指定相同的嵌入模型，并允许反序列化
loaded_vectorstore = FAISS.load_local(
	local_faiss_path,
	embeddings,
	allow_dangerous_deserialization=True)
	
# 相似性搜索
query="FAISS是做什么的？"
results=loaded_vectorstore.similarity_search(query, k=1)

print(f"\n查询：'{query}' ")
print("相似度最高的文档：")
for doc in results:
	print(f"- {doc.page_content}")
```

索引创建实现细节：
1. `from_documents`（封装层）：
	- 这是我们直接调用的方法。职责：从输入的`Document` 对象列表中提取出纯文本内容（`page_content`）和元数据（`metadata`）。
	- 然后，它将这些提取出的信息传递给核心的`from_texts`方法。
2. `from_texts`（向量化入口）：
	- 这个方法是面向用户的入口。它接受文本列表，并执行`embedding.embed_documents(texts)`，将所有文本批量转换为向量。
	- 完成向量化后，它并不直接处理索引构建，而是将生成的向量和其他所有信息（文本，元数据等）传递给一个内部的辅助方法`__from`。
3. `__from`（构建索引框架）：
	- 一个内部方法，负责搭建FAISS向量存储的“空框架”。
	- 它会根据指定的距离策略（默认为L2欧式距离）初始化一个空的FAISS索引结构（如`faiss.IndexFlatL2`）。
	- 同时，它也准备好了用于存储文档原文的`docstore`和用于连接FAISS索引与文档的`index_to_docstore_id`映射。
	- 最后，它调用另一个内部方法`__add`来完成数据的填充。
4. `__add`（填充数据）：
	- 真正执行数据添加操作的核心。它接受到向量，文本和元数据后，执行以下关键操作：
		- 添加向量：将向量列表转换为FAISS需要的`numpy`数组，并调用`self.index.add(vector)`将其批量添加到FAISS索引中。
		- 存储文档：将文本和元数据打包成`Document` 对象，存入`docstore`。
		- 建立映射：更新`index_to_docstore_id`字典，建立起FAISS内部的整数ID（如0，1，2...）到文档唯一ID的映射关系。