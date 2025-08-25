## 编码

默认情况下，Python3源码文件以UTF-8编码，所有字符串都是unicode字符串。

## 标识符

- 第一个字符必须以字母（a-z，A-Z）或下划线`_`。
- 标识符的其他部分由字母，数字和下划线组成。
- 标识符对大小写敏感，count和Count是不同的标识符。
- 标识符对长度无硬性限制
- 禁止使用关键字，如if，for，class等不能作为标识符。

测试标识符是否合法：
```python

def is_valid_identifier(name):
   try:
      exec(f"{name}= None")
      return True
   except:
      return False

print(is_valid_identifier("2var")) # False
print(is_valid_identifier("var2")) # True

```

## Python保留关键字

保留字即关键字，我们不能把它们用作任何标识名称。Python的标准库提供了一个keyword模块，可以输出当前版本的所有关键字。

```
>>> import keyword
>>> keyword.kwlist
```

逻辑值 True 布尔真值
        False 布尔假值
        None 空值 无运算
        ……
循环控制 for 迭代循环
        while 条件循环
        break 跳出循环
         continue 跳过当前循环的部分，进入下一次迭代
 异常处理 try 尝试执行代码块
       except 捕获异常
       finally 无论是否发生异常都会执行的代码块
       raise 抛出异常
   函数定义 def 定义函数
          return 从函数返回值
          lambda 创建匿名函数
  类与对象  class 定义类
          del 删除对象引用

作用域  global 声明全局变量
        nonlocal 声明非局部变量，用于嵌套函数

异步编程 async 声明异步函数
        await 等待异步操作完成
其他  assert 断言，用于测试条件是否为真
      in 检查成员关系 
      is 检查对象身份 （是否是同一个对象）
      pass 空语句，用于占位
      with 上下文管理器，用于资源管理
      yield 从生成器函数返回值

## 注释
Python中单行注释以#开头，实例如下：
```python
# 第一个注释
print("Hello, Python!")
```
多行注释可以用多个`#`，还有`'''` `"""` 

## 行与缩进
pyhton使用缩进来表示代码块，不需要使用其他符号
缩进的空格数是可变的，但是同一个代码块的语句必须包含相同的缩进空格数。例如：

```python
if True:
   print("True")
else:
   print("False")
```

缩进不一致会导致运行错误

## 多行语句
python通常是一行写完一条语句，但如果语句很长，我们可以使用反斜杠`\` 来实现多行语句。

例如：
```python
item_one = 1
item_two = 2
item_three = 3
total = item_one + \
        item_two + \
        item_three

print(total)
```

在`[]` ，`{}` 或者`()` 中的多行语句，不需要使用反斜杠。例如：
```python
total = ['item_one', 'item_two', 'item_three',
         'item_four','item_five']
```

## 数字（Number）类型
python中数字有四种类型：整数，布尔型，浮点数和复数。

- int 整数，表示为长整型
- bool 布尔值，如True
- float 浮点数，如1.23，3E-2
- complex 复数，由实部和虚部组成，形式为 a + bj，其中a是实部，b是虚部，j表示虚数单位。

## 字符串（String）
