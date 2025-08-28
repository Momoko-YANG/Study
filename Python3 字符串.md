
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
在需要在字符中使用特殊字符时，python用反斜杠

