## 1. 上下文扩展

句子窗口检索（Sentence Window Retrieval）：在检索是聚焦于高度精确的单个句子，在送入LLM生成答案前，又将上下文扩展回一个更宽的窗口，从而同时保证检索的准确性和生成的质量。

主要思路：为检索精确性而索引小块，为上下文丰富性而检索大块。

工作流程如下：
1. 索引阶段：在构建索引时，文档被分割成单个句子，每个句子都作为一个独立的节点存入向量数据库。同时，每个句子节点都会在元数据中存储其上下文窗口，即改句子原文中的前N个和后N个句子。这个窗口内的文本不会被索引，仅仅是作为元数据存储。
2. 检索阶段：当用户发起查询时，系统会在所有单一句子节点上执行相似度搜索。因为句子时表达完整语义的最小单位，所以这种方式可以非常精确地定位到与用户问题最相关地核心信息。
3. 后处理阶段：在检索到最相关的句子节点后，系统会使用一个名为`MetadataReplacementPostProcessor`的后处理模块，该模块会读取到检索到句子节点的元数据，并用元数据中存储完整上下文窗口来替换节点中原来的单一句子的内容。
4. 生成阶段：最后，这些被替换了内容的，包含丰富上下文节点被传递给LLM，用于生成最终的答案。


## 2. 代码实现
下面通过 LlamaIndex 官网的示例，来演示如何实现句子窗口检索，并与常规的检索方法进行对比。该示例将加载一份PDF格式的IPCC气候报告，并就其中的专业问题进行提问。

```Python
# 假设 Settings.llm 和 Settings.embed_model 已经预先配置好

# 1. 加载文档
documents = SimpleDirectoryReader(
	input_files=["../../data/C3/pdf/IPCC_AR6_WGII_Chapter03.pdf"]
).load_data()

# 2. 创建节点与构建索引 
# 2.1 句子窗口索引
node_parser = SentenceWindowNodeParser.from_defaults(
	window_size = 3,
	window_metadata_key="window",
	original_text_metadata_key="original_text",
)

sentence_nodes=node_parser.get_nodes_from_documnets(documents)
sentence_index=VectorStoreIndex(sentence_nodes)
```

根据 LlamaIndex 的底层源码，`SentenceWindowNodeParser` 的核心逻辑位于 `build_window_nodes_from_documents` 方法中。其实现过程可以分解为以下几个关键步骤：

1. 句子切分（`sentence_splitter`）：解析器首先接受一个文档（`Document`），然后调用`self.sentence_splitter(doc.text)`方法。这个 `sentence_splitter` 是一个可配置的函数，默认为 `split_by_sentence_tokenizer`，它负责将文档的全部文本精确地切分成一个句子列表（`text_splits`）。
2. 创建基础节点（`build_nodes_from_splits`）：切分出的`text_splits`列表被传递给`build_nodes_from_splits`工具函数。这个函数会为列表中的每一个句子都创建一个独立的`TextNode`。此时，每个`TextNode`的`text`属性就是这个句子的内容。
3. 构建窗口并填充元数据（主要循环）：接下来，解析器会遍历所有新创建的`TextNode`。对于位于第 `i` 个位置的节点，它会执行以下操作：
	- 定位窗口：通过列表切片 `nodes[max(0, i - self.window_size) : min(i + self.window_size + 1, len(nodes))]` 来获取一个包含中心句子及其前后 `window_size`（默认为3）个邻近节点的列表（`window_nodes`）。
	- 组合窗口文本：将`window_nodes`列表中所有节点的`text`（即所有在窗口内的句子）用空格拼接成一个长字符串。
	- 填充元数据：将上一步生成的长字符串（完整的上下文窗口）存入当前节点（第`i`个节点）的元数据中，键为 `self.window_metadata_key`（默认为 `"window"`）。同时，也会将节点自身的文本（原始句子）存入元数据，键为 `self.original_text_metadata_key`（默认为 `"original_text"`）。
4. 设置元数据排除项：在填充完元数据后，代码会执行 `node.excluded_embed_metadata_keys.extend(...)` 和 `node.excluded_llm_metadata_keys.extend(...)`。这行代码的作用是告诉后续的嵌入模型和LLM，在处理这个节点时，**应当忽略** `"window"` 和 `"original_text"` 这两个元数据字段。这确保了只有单个句子的纯净文本被用于生成向量嵌入，从而保证了检索的高精度。而 `"window"` 字段仅供后续的 `MetadataReplacementPostProcessor` 使用。


```Python
# 2.2 常规分块索引（基准）
base_parser = SentenceSplitter(chunk_size=512)
base_nodes = base_parser.get_nodes_from_documents(documents)
base_index = VectorStoreIndex(base_nodes)

# 3. 构建查询引擎
sentence_query_engine = sentence_index.as_query_engine(
	similarity_top_k = 2,
	node_postprocessors=[
		MetadataReplacementPostProcessor(target_metadata_key="window")
	],
)
base_query_engine= base_index.as_query_engine(similarity_top_k=2)

# 4. 执行查询并对比结果
query = "What are the concerns surrounding the AMOC?" 
print(f"查询: {query}\n") 

print("--- 句子窗口检索结果 ---") 
window_response = sentence_query_engine.query(query) 
print(f"回答: {window_response}\n") 

print("--- 常规检索结果 ---") 
base_response = base_query_engine.query(query) 
print(f"回答: {base_response}\n") 
```


### 结构化索引

在检索文本块的同时，为其附加结构化的元数据（Metadata），包括：
- 文件名
- 文档创建日期
- 章节标题
- 作者
- 任何自定义的分类标签
通过这种方式，可以在检索时实现“元数据过滤”和“向量搜索”的结合。


### 代码实现
更复杂的场景下，结构化数据可能分布在多个来源中，例如一个包含多个工作表（Sheet）的Excel文件。这种情况下需要进行递归检索。它能实现“路由”功能，先将查询引导至正确的知识来源，然后再在该来源的内部执行精确查询。

```Python
# 1. 为每个工作表创建查询引擎和摘要节点
excel_file = '../../data/C3/excel/movie.xlsx'
xls = pd.ExcelFile(excel_file)

df_query_engines = {}
all_nodes = []

for sheet_name in xls.sheet_names:
	df = pd.read_excel(xls, sheet_name=sheet_name)
	# 为当前工作表创建一个 PandasQueryEngine
	query_engine = PandasQueryEngine(df=df, llm=Settings.llm, verbose=True)
	# 为当前工作表创建一个摘要节点（IndexNode）
	year = sheet_name.replace('年份_', '')
	summary = f"这个表格包含了年份为 {year} 的电影信息，可以用来回答关于这一年电影的具体问题。"
	node = IndexNode(text=summary, index_id=sheet_name)
	all_nodes.append(node)
	# 存储工作表名称到其查询引擎的映射
	df_query_engines[sheet_name] = query_engine
	
# 2. 创建顶层索引（只包含摘要节点）
vector_index=VectorStoreIndex(all_nodes)

# 3. 创建递归检索器
vector_retriever = vector_index.as_retriever(similarity_top_k = 1)
recursive_retriever = RecursiveRetriever(
	"vector",
	retriever_dict={"vector": vector_retriever},
	query_engine_dict=df_query_engines,
	verbose=True,
)

# 4. 创建查询引擎
query_engine = RetrieverQueryEngine.from_args(recursive_retriever)

# 5. 执行查询
query = "1994年评分人数最多的电影是哪一部？" 
print(f"查询: {query}") 
response = query_engine.query(query) 
print(f"回答: {response}")
```

1. **创建 PandasQueryEngine** ：遍历 Excel 中的每个工作表，为每个工作表（即一个独立的 DataFrame）都实例化一个 `PandasQueryEngine`。其强大之处在于，它能将关于表格的自然语言问题（如“评分人数最多的是哪个”）转换成实际的 Pandas 代码（如 `df.sort_values('评分人数').iloc[-1]`）来执行。
2. **创建摘要节点 (`IndexNode`)** ：对每个工作表，都创建一个 `IndexNode`，其内容是关于这个表格的一段摘要文本。这个节点将作为顶层检索的“指针”。
3. **构建顶层索引** ：使用所有创建的 `IndexNode` 构建一个 `VectorStoreIndex`。这个索引不包含任何表格的详细数据，只包含指向各个表格的“指针”信息。
4. **创建 `RecursiveRetriever`** ：这是实现递归检索的核心。将其配置为：
    - `retriever_dict`: 指定顶层的检索器，即在摘要节点中进行检索的 `vector_retriever`。
    - `query_engine_dict`: 提供一个从节点 ID（即工作表名称）到其对应查询引擎的映射。当顶层检索器匹配到某个摘要节点后，递归检索器就知道该调用哪个 `PandasQueryEngine` 来处理后续查询。

### 另一种实现方式
将路由和检索彻底分离
```Python
import os
import pandas as pd
from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, Document, Settings
from llama_index.core.retrievers import VectorIndexRetirever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
from llama_index.llms.deepseek import DeepSeek
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

load_dotenv()

# 配置模型
Settings.llm = DeepSeek(model="deepseek-chat", api_key=os.getenv("DEEPSEEK_API_KEY"))
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-zh-v1.5")

# 1. 加载和预处理数据
excel_file = '../../data/C3/excel/movie.xlsx'
xls = pd.ExcelFile(excel_file)

summary_docs = []
content_docs = []

print("开始加载和处理Excel文件...")
for sheet_name in xls.sheet_names:
	df = pd.read_excel(xls, sheet_name=sheet_name)
	
	# 数据清洗
	if '评分人数' in df.columns:
		df[df['评分人数'] = df['评分人数'].astype(str).str.replace('人评价', '').str.strip()
        df['评分人数'] = pd.to_numeric(df['评分人数'], errors='coerce').fillna(0).astype(int)
    
    # 创建摘要文档（用于路由）
    year = sheet_name.replace('年份_','')
    summary_text = f"这个表格包含了年份为 {year} 的电影信息，包括电影名称、导演、评分、评分人数等。"
    summary_doc = Document(
	    text=summary_text,
	    metadata={"sheet_name": sheet_name}
    )
    summary_docs.append(summary_doc)
    
    # 创建内容文档 (用于最终问答)
    content_text = df.to_string(index=False)
    content_doc = Document(
	    text=content_text,
	    metadata={"sheet_name": sheet_name}
    )
    content_docs.append(content_doc)
    
print("数据加载和处理完成。\n")

# 2. 构建向量索引
# 使用默认的内存SimpleVectorStore，它支持元数据过滤

# 2.1 为摘要创建索引
summary_index = VectorStoreIndex(summary_docs)

# 2.2 为内容创建索引
content_index = VectorStoreIndex(content_docs)

print("摘要索引和内容索引构建完成。\n")

# 3. 定义两步式查询逻辑
def query_safe_recursive(query_str):
	print(f"--- 开始执行查询 ---")
    print(f"查询: {query_str}")
    
    # 第一步：路由 - 在摘要索引中找到最相关的表格
    print("\n第一步：在摘要索引中进行路由...")
    summary_retriever = VectorIndexRetirever(index=summary_index, similarity_top_k=1)
    retrieved_nodes = summary_retriever.retrieve(query_str)
    
    if not retireved_nodes:
	    return "抱歉，未能找到相关的电影年份信息。"
	    
	# 获取匹配到的工作表名称
	matched_sheet_name = retrieved_nodes[0].node.metadata['sheet_name']
	print(f"路由结果：匹配到工作表 -> {matched_sheet_name}")
	
	# 第二步：检索 - 在内容索引中根据工作表名称过滤并检索具体内容
	print("\n第二步：在内容索引中检索具体信息...")
	content_retriever = VectorIndexRetriever(
		index = content_index,
		similarity_top_k=1, # 通常只返回最匹配的整个表格即可
		filters=MetadataFilters(
			filters=[ExactMacthFilter(key="sheet_name", value=matched_sheet_name)]
		)
	)
	
	# 创建查询引擎并执行查询
	query_engine=RetrieverQueryEngine.from_args(content_retriever)
	response=query_engine.query(query_str)
	
	print("---查询执行结束---\n")
	return response
	

# 4. 执行查询
query = "1994年评分人数最少的电影是哪一部？"
response = query_safe_recursive(query)

print(f"最终回答: {response}")
```