
## 3.1 初始化设置
首先进行基础配置，包括导入必要的库，加载环境变量以及下载嵌入模型。
```python
import os
from dotenv import load_dotenv
from langchain_community.doucument_loaders import UnstructuredMarkdownLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

load_dotenv()
```

## 3.2 数据准备
- 加载原始文档：先定义Markdown文件的路径，然后使用TextLoader加载该文件作为知识源。
```python
markdown_path = "../../data/C1/markdown/easy-r1-chapter1.md"

# import local markdown File
loader = UnstructuredMarkdownLoader(markdown_path)
docs = loader.load()
```

- 文本分块（Chunking）：便于后续的嵌入和检索，长文档被分割成较小的，可管理的文本块（chunks）。这里采用了递归字符分割策略，使用其默认参数进行分块。
	当不指定参数初始化`RecursiveCharacterTextSplitter()` 时，其默认行为旨在最大程度保留文本的语义结构：
	- 默认分隔符与语义保留：按顺序尝试使用一系列预设的分隔符`["\n\n" (段落), "\n" (行), " " (空格), "" (字符)]` 来递归分割文本。这种策略的目的时尽可能保持段落，句子和单词的完整性，因为他们通常时语义上最相关的文本单元，直到文本块达到目标大小。
	- 保留分隔符：默认情况下（`keep_separator = True`），分隔符本身会被保留在分割后的文本块中。
	- 默认块大小与重叠：使用其基类`TextSplitter`中定义的默认参数`chunk_size=4000`（块大小）和`chunk_overlap=200` （块重叠）。这些参数确保文本块符合预定的大小限制，并通过重叠来减少上下文信息的丢失。

```python
	text_splitter = RecursiveCharacterTextSplitter()
	chunks = text_splitter.split_documents(docs)
```

### 3.3 索引构建
数据准备完成后，接下来构建向量索引：
- 初始化中文嵌入模型：使用`HuggingFaceEmbeddings`加载之前在初始化设置中下载的中文嵌入模型。配置模型在CPU上运行，并启用嵌入归一化（`normalize_embeddings: True`）。
```python
embeddings = HuggingFaceEmbeddings(
    model_name = "BAAI/bge-small-zh-v1.5",
    model_kwargs = {'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)
```
- 构建向量存储：将分割后的文本块（`texts`）通过初始化好的嵌入模型转换为向量表示，然后使用`InMemeoryVectorStore`将这些向量及其对应的原始文本内容添加进去，从而在内存中构建出一个向量索引。
```python
vectorstore = InMemoryVectorStore(embeddings)
vectorstore.add_doucuments(texts)
```
这个过程完成后，便构建了一个可供查询的知识索引。

### 3.4 查询与检索
索引构建完毕后，便可以针对用户问题进行查询与检索：
- 定义用户查询：设置一个具体的用户问题字符串。
```python
question = "文中举了哪些例子？"
```
- 在向量存储中查询相关文档：使用向量存储的`similarity_search`方法，根据用户问题再索引中查找最相关的`k`（此处示例中`k=3`）个文本块。
```python
retrieved_docs = vectorstore.similarity_search(question, k=3)
```
- 准备上下文：将检索到的多个文本块的页面内容（`doc.page_content`）合并成一个单一的字符串，并使用双换行符（`\n\n`）分隔各块，形成最终的上下文信息（`docs_content`）供大预言模型参考。
```python
docs_content = "\n\n".join(doc.page_content for doc in retrieved_docs)
```

### 3.5 生成集成
最后一步是将检索到的上下文与用户问题结合，利用大语言模型（LLM）生成答案：
- 构建提示词模板：使用`ChatPromptTemplate.from_template`创建一个结构话的提示模板。此模板指导LLM根据提供的上下文（`context`）回答用户的问题（`question`），并明确之处再信息不足时应如何回应。
```python
# 提示词模板
prompt = ChatPromptTemplate.from_template(
"""
请根据下面提供的上下文信息来回答问题。请确保你的回答完全基于这些上下文。
如果上下文中没有足够的信息来回答问题，请直接告知：“抱歉，我无法根据提供的上下文招到相关信息来回答此问题。”
  
上下文：
{context}
问题：{question}
回答：

"""                                    
                                    )
```
- 配置大语言模型：初始化`ChatOpenAI` 客户端，配置所用模型（`glm-4.7-flash-free`）、生成答案的温度参数（`temperature=0.7`）、最大Token数 (`max_tokens=2048`) 以及API密钥（从环境变量加载）和 url。
```python
llm = ChatOpenAI(
    model = "glm-4.7-flash-free",
    temperature = 0.7,
    max_tokens = 4096,
    api_key = os.getenv("DEEPSEEK_API_KEY"),
    base_url = "https://aihubmix.com/v1"
)
```

- 调用LLM生成答案并输出：将用户问题 (`question`) 和先前准备好的上下文 (`docs_content`) 格式化到提示模板中，然后调用ChatDeepSeek的`invoke`方法获取生成的答案。
```python
answer = llm.invoke(prompt.format(question=question, context=docs_content))
print(answer)
```

#### 低代码（基于LlamaIndex）
在RAG方面，LlamaIndex提供了更多封装好的API接口，这无疑降低了上手门槛。下面是一个简单实现：
```python
import os
from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.llms.openai_like import OpenAILike
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

load_dotenv()

Settings.llm = OpenAILike(
	model="glm-4.7-flash-free",
	api_key = os.getenv("DEEPSEEK_API_KEY"),
	api_base = "https://aihubmix.com/v1",
	is_chat_model = True
)

Settings.embed_model = HuggingFaceEmbedding("BAAI/bge-small-zh-v1.5")
documents = SimpleDirectoryReader(input_files=["../../data/C1/markdown/easy-rl-chapter1.md"]).load_data()

index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
print(query_engine.get_prompts())
print(query_engine.query("文中举了哪些例子?"))
```