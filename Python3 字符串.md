
## Python3 字符串

字符串是Python中最常用的数据类型。我们可以使用`'` 或`"` 来创建字符串

创建字符串只需要为变量分配一个值即可。

```python
var1 = 'hello world!'
var2 = "momoko!"
```

## Python访问字符串中的值

python不支持单字符串，单字符串在Python中也是作为一个字符串使用。
Pyhton 访问子字符串，可以使用方括号`[]` 来截取字符串，字符串的截取语法格式如下：
 ```
 变量[头下标:尾下标]
 ```

索引值以0为开始值，-1为从末尾的开始位置。

例：
```python
var1 = 'hello world!'
var2 = "momoko!"

print("var1[0]:", var1[0])
print("var2[1:5]:", var2[1:5])
```

## Python 字符串更新

```python
var1 = 'hello world!'

print("update string:", var1[:6] + 'momoko!')
```

## Python 转义字符
在需要在字符中使用特殊字符时，python用反斜杠`\` 转义字符。如下表：

| 转义字符 | 描述                                                     | 实例  |
| ---- | ------------------------------------------------------ | --- |
|      | 续行符                                                    | 工程师 |
|      | 反斜杠符号                                                  | 设计师 |
| 王芳   | 单引号                                                    | 教师  |
|      | 双引号                                                    |     |
|      | 响铃                                                     |     |
|      | 退格（backspace）                                          |     |
|      | 空                                                      |     |
|      | 换行                                                     |     |
|      | 纵向制表符                                                  |     |
|      | 横向制表符                                                  |     |
|      | 回车，将`\r` 后面的内容移到字符串开头，并逐一替换开头部分的字符，直至将`\r`后面的内容完全替换完成。 |     |
|      | 换页                                                     |     |
|      | 八进制数，y代表0-7的字符。                                        |     |
|      | 十六进制数，以`\x` 开头，y代表字符。                                  |     |
|      | 其他的字符以普通格式输出。                                          |     |

使用`\r` 实现百分比进度：

```python
#实例
import time

for i in range(101): #添加进度条图形和百分比
    bar = '[' + '=' * (i // 2) + ' '*(50-i//2) + ']'
    print(f"\r{bar} {i:3}%", end='', flush = True)
    time.sleep(0.05)
print()
```

以下实例，我们使用了不同的转义字符来演示单引号、换行符、制表符、退格符、换页符、ASCII、二进制、八进制数和十六进制数的效果：

```python

print('\'Hello, world!\'')  # 输出：'Hello, world!'

print("Hello, world!\nHow are you?")  # 输出：Hello, world!
                                        #       How are you?

print("Hello, world!\tHow are you?")  # 输出：Hello, world!    How are you?

print("Hello,\b world!")  # 输出：Hello world!

print("Hello,\f world!")  # 输出：
                           # Hello,
                           #  world!

print("A 对应的 ASCII 值为：", ord('A'))  # 输出：A 对应的 ASCII 值为： 65

print("\x41 为 A 的 ASCII 代码")  # 输出：A 为 A 的 ASCII 代码

decimal_number = 42
binary_number = bin(decimal_number)  # 十进制转换为二进制
print('转换为二进制:', binary_number)  # 转换为二进制: 0b101010

octal_number = oct(decimal_number)  # 十进制转换为八进制
print('转换为八进制:', octal_number)  # 转换为八进制: 0o52

hexadecimal_number = hex(decimal_number)  # 十进制转换为十六进制
print('转换为十六进制:', hexadecimal_number) # 转换为十六进制: 0x2a
```
