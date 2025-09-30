python中的变量不需要声明。每个变量在使用前都必须赋值，变量赋值之后该变量才会被创建。
在python中，变量没有类型，即变量所指的内存中对象的类型。等号`=` 用来给变量赋值。
`=` 运算符左边是一个变量名，等号`=` 运算符右边是存储在变量中的值。
例如：

```Python

#!/usr/bin/python3

counter = 100          #整型变量
miles   = 1000.0       #浮点型变量
name    = "momoko"     #字符串

print(counter)
print(miles)
print(name)

```

##  多个变量赋值

python允许同时为多个变量赋值。例如：

 ```python
 a = b = c = 1
 ```

以上实例，创建一个整型对象，值为1，从后向前赋值，三个变量被赋予相同的数值。

```python
a, b, c = 1, 2, "momoko"
```

以上实例，两个整型对象1和2分配给变量a和b，字符串对象"momoko"分配给变量c。可以通过`type()`函数查看变量的类型：

```python
#变量定义
x = 10                #整数
y = 3.14              #浮点数
name = "momoko"       #字符串
is_active = True      #布尔值

#多变量赋值
a, b, c = 1, 2, "three"

#查看数据类型
print(type(x))
print(type(y))
print(type(name))
print(type(is_active))

```


## 标准数据类型

Python3中常见的数据类型有：
- Number（数字）
- String（字符串）
- bool（布尔类型）
- List（列表）
- Tuple（元组）
- Set（集合）
- Dictionary（字典）

Python3的六个标准数据类型中：
- **不可变数据** ： Number，String，Tuple
- **可变数据** ：List，Dictionary, Set

## Number

Python3支持int，float，bool，complex。
内置的`type()` 函数可以用来查询变量所指的对象类型。

```python
>>> a, b, c, d = 20, 5.5, True, 4+3j
>>> print(type(a), type(b), type(c), type(d))
<class 'int'> <class 'float'> <class 'bool'> <class 'complex'>
```

此外还可以使用isinstance来判断：

```python
a = 111
isinstance(a, int)

True
```

isinstance和type的区别在于：
- `type()` 不会认为子类是一种父类类型。
- `isinstance()` 会认为子类是一种父类类型

```python
>>> class A:
...     pass
... 
>>> class B(A):
...     pass
... 
>>> isinstance(A(), A)
True
>>> type(A()) == A 
True
>>> isinstance(B(), A)
True
>>> type(B()) == A
False
```

在Python3中，bool是int的子类，True和False可以和数字相加，`True == 1, False == 0` 会返回`True` ，但是可以通过`is` 来判断类型。

```python
>>> issubclass(bool, int) 
True
>>> True==1
True
>>> False==0
True
>>> True+1
2
>>> False+1
1
>>> 1 is True
<python-input-12>:1: SyntaxWarning: "is" with 'int' literal. Did you mean "=="?
  1 is True
False
>>> 0 is False
<python-input-13>:1: SyntaxWarning: "is" with 'int' literal. Did you mean "=="?
  0 is False
False

```

*为什么会出现SyntaxWarning？*
Python检测到在用`is` 比较一个字面量整数和True，这通常是代码错误（因为 `is` 比较的是身份，而不是值）。

当指定一个值的时候，Number对象就会被创建：
```python
var1 = 1
var2 = 10
```

可以使用del语句删除一些对象引用：

```python
del var1[, var2[,var3[....,varN]]]
```

也可以通过使用`del` 语句删除单个或多个对象。例如：
 ```python
 del var
 del var_a, var_b
 ```
## 数值运算

```python
>>> 5 + 4  # 加法
9
>>> 4.3 - 2 # 减法
2.3
>>> 3 * 7  # 乘法
21
>>> 2 / 4  # 除法，得到一个浮点数
0.5
>>> 2 // 4 # 除法，得到一个整数
0
>>> 17 % 3 # 取余 
2
>>> 2 ** 5 # 乘方
32
```

**注意**
- Python可以同时为多个变量赋值，如a, b = 1, 2。
- 一个变量可以通过赋值指向不同类型的对象。
- 数值的除法包含两个运算符：`/` 返回一个浮点数，`//` 返回一个整数。
- 在混合计算时，Python会把整型转换成为浮点数。
- Python支持复数，复数由实数部分和虚数部分构成，可以用`a+bj` ，或者`complex(a,b)` 表示，复数的实部和虚部都是浮点型。

## String（字符串）

Python中的字符串用单引号`'`或者双引号`"` 括起来，同时使用



