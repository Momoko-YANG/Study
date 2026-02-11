在 TypeScript 中，字符串（String）是用于表示文本数据的基本数据类型，它继承并扩展了 JavaScript 的字符串特性，同时增加了静态类型校验。

语法：
```
var txt = new String("string");
```

或者更简单的方式：
```
var txt = "string";
```

**两种创建方式及核心区别**
1. 字符串字面量（推荐）
这是 TypeScript/JavaScript 中最常用、性能最优的方式，创建的是原始字符串类型（string），也是 TypeScript 类型系统中默认的字符串类型。
```ts
const txt1: string = "Hello TypeScript"; // 显式指定类型
const txt2 = "Hello JavaScript";   // 类型推导为 string
```

2. String对象（不推荐）
通过 `new String()` 创建的是包装对象类型（String），本质是一个对象，而非原始值，会带来类型混淆和性能损耗。
```ts
// String对象
const txtObj: String = new String("Hello object"); // 类型为 String（对象）
```

String对象和字符串字面量在类型上是不同的：
- 字符串字面量是解百纳数据类型string，用于直接存储字符串值。
- String对象是String类型，实际上是一个对象，而非原始的字符串值。

```ts
let strLiteral: string = "Hello";
let strObject: string = new String("Hello");

console.log(typeof strLiteral);  // 输出："string"
console.log(typeof strObject);   // 输出："object"
```

| 特性               | 字符串字面量（string） | String对象（String）               |
| ---------------- | -------------- | ------------------------------ |
| 类型本质             | 原始值            | 引用类型（对象）                       |
| 性能               | 高效，无额外内存开销     | 低效，创建对象实例                      |
| 类型校验(TypeScript) | 符合TS基础类型规范     | 类型不匹配（如string类型变量无法赋值String对象） |
| 比较方式             | 直接比较值          | 比较引用地址（需要valueOf()取原始值）        |

### 字符串字面量和 String 对象的类型兼容性
在 TypeScript 中，string 字面量类型和 String 对象类型不完全兼容。
例如，string 类型的变量无法直接使用 String 对象的方法，反之亦然。因此，通常情况下不需要使用 String 对象。

```ts
let strLiteral:string = "Test";
let strObject: String = new String("Test");

console.log(strLiteral === strObject);  // 输出：false，内容相同，类型不同
console.log(strLiteral === strObject);  // 输出：true，内容相同
console.log(strLiteral === strObject.valueOf()); // 输出：true，将对象转为原始字符串后比较
```

`strLiteral` 是原始字符串类型（`string`），而 `strObject` 是 `String` 对象类型（`String`）。这意味着它们的类型不同。

#### String对象属性
1. `constructor` 对创建该对象的函数
```ts
var str = new String( "This is string" ); 
console.log("str.constructor is:" + str.constructor)
```

2. `length` 返回字符串的长度。
```ts
var uname = new String("Hello World")
console.log("Length " + uname.length)  // 输出 11   
```

3. `prototype` 允许向对象添加属性和方法。
```ts
function employee(id:number, name:string){
     this.id = id;
     this.name = name;
}

var emp = new employee(123, "admin")
employee.rpototype.emmail = "admin@momoko.com"  // 添加属性 email
console.log("员工号: "+emp.id)
console.log("员工姓名: "+emp.name)
console.log("员工邮箱: "+emp.email)
```

### String方法
下表列出了String对象支持的方法：
1. `charAt()` 返回在指定位置的字符。
```ts
var str = new String("RUNOOB"); 
console.log("str.charAt(0) 为:" + str.charAt(0)); // R
console.log("str.charAt(1) 为:" + str.charAt(1)); // U 
console.log("str.charAt(2) 为:" + str.charAt(2)); // N 
console.log("str.charAt(3) 为:" + str.charAt(3)); // O 
console.log("str.charAt(4) 为:" + str.charAt(4)); // O 
console.log("str.charAt(5) 为:" + str.charAt(5)); // B
```

2. `charCodeAt()` 返回在指定的位置的字符的 Unicode 编码。
```ts
var str = new String("RUNOOB"); 
console.log("str.charCodeAt(0) 为:" + str.charCodeAt(0)); // 82
console.log("str.charCodeAt(1) 为:" + str.charCodeAt(1)); // 85 
console.log("str.charCodeAt(2) 为:" + str.charCodeAt(2)); // 78 
console.log("str.charCodeAt(3) 为:" + str.charCodeAt(3)); // 79 
console.log("str.charCodeAt(4) 为:" + str.charCodeAt(4)); // 79
console.log("str.charCodeAt(5) 为:" + str.charCodeAt(5)); // 66
```

3. `concat()` 连接两个或更多字符串，并返回新的字符串。
```ts
var str1 = new String( "RUNOOB" ); 
var str2 = new String( "GOOGLE" ); 
var str3 = str1.concat( str2 ); 
console.log("str1 + str2 : "+str3) // RUNOOBGOOGLE
```

4. `indexOf()` 返回某个指定的字符串值在字符串中首次出现的位置。
```ts
var str1 = new String( "RUNOOB" ); 

var index = str1.indexOf( "OO" ); 
console.log("查找的字符串位置 :" + index );  // 3
```

5. `lastIndexOf()` 从后向前搜索字符串，并从起始位置（0）开始计算返回字符串最后出现的位置。
```ts
var str1 = new String( "This is string one and again string" ); 
var index = str1.lastIndexOf( "string" );
console.log("lastIndexOf 查找到的最后字符串位置 :" + index ); // 29
    
index = str1.lastIndexOf( "one" ); 
console.log("lastIndexOf 查找到的最后字符串位置 :" + index ); // 15

```

6. `localeCompare()` 用本地特定的顺序来比较两个字符串。
```ts
var str1 = new String( "This is beautiful string" );
  
var index = str1.localeCompare( "This is beautiful string");  

console.log("localeCompare first :" + index );  // 0

```

7. `match()` 查找找到一个或多个正则表达式的匹配。
```ts
var str="The rain in SPAIN stays mainly in the plain"; 
var n=str.match(/ain/g);  // ain,ain,ain
```

8. `replace()` 替换与正则表达式匹配的子串
```ts
var re = /(\w+)\s(\w+)/; 
var str = "zara ali"; 
var newstr = str.replace(re, "$2, $1"); 
console.log(newstr); // ali, zara
```


```js
var re = /(\w+)\s(\w+)/;
```

这是一个正则表达式，结构很关键：
1️⃣ `(\w+)`
- `\w` = 字母 / 数字 / 下划线（常见单词字符）
- `+` = 一个或多个  
    👉 匹配一个“单词”
并且被 **括号包住 = 捕获组**
所以这里是：
👉 第一组：第一个单词  
👉 第二组：第二个单词

 2️⃣ `\s`
代表一个空格（空白字符）
所以整个意思是：

> 匹配：单词 + 空格 + 单词  
> 比如：`zara ali`

```js
var newstr = str.replace(re, "$2, $1");
```
重点是：
👉 `$1` = 第一个捕获组（zara）
👉 `$2` = 第二个捕获组（ali）

这种写法在：
✅ 简单文本处理很爽  
❌ 复杂姓名/多空格/多单词就容易翻车
真实项目里一般会：

```js
str.split(" ").reverse().join(", ")
```

更安全可读。

9. `search()` 检索与正则表达式相匹配的值
```ts
var re = /apples/gi; 
var str = "Apples are round, and apples are juicy.";
if (str.search(re) == -1 ) { 
   console.log("Does not contain Apples" ); 
} else { 
   console.log("Contains Apples" ); 
} 
```

10. `slice()`  提取字符串的片断，并在新的字符串中返回被提取的部分
11. `split()`  把字符串分割为子字符串数组。
```ts
var str = "Apples are round, and apples are juicy."; 
var splitted = str.split(" ", 3); 
console.log(splitted)  // [ 'Apples', 'are', 'round,' ]
```

12. `substr()` 从起始索引号提取字符串中指定数目的字符。
13. `substring()` 提取字符串中两个指定的索引号之间的字符。
```ts
var str = "RUNOOB GOOGLE TAOBAO FACEBOOK"; 
console.log("(1,2): "    + str.substring(1,2));   // U
console.log("(0,10): "   + str.substring(0, 10)); // RUNOOB GOO
console.log("(5): "      + str.substring(5));     // B GOOGLE TAOBAO FACEBOOK
```

14. `toLocaleLowerCase()` 根据主机的语言环境把字符串转换为小写，只有几种语言（如土耳其语）具有地方特有的大小写映射。
```ts
var str = "Runoob Google"; 
console.log(str.toLocaleLowerCase( ));  // runoob google
```

15. `toLocaleUpperCase()` 据主机的语言环境把字符串转换为大写，只有几种语言（如土耳其语）具有地方特有的大小写映射。
```ts
var str = "Runoob Google"; 
console.log(str.toLocaleUpperCase( ));  // RUNOOB GOOGLE
```

16. `toLowerCase()` 把字符串转换为小写。
```ts
var str = "Runoob Google"; 
console.log(str.toLowerCase( ));  // runoob google
```

17. `toString()` 返回字符串。
```ts
var str = "Runoob"; 
console.log(str.toString( )); // Runoob
```

18. `toUpperCase()` 把字符串转换为大写。
```ts
var str = "Runoob Google"; 
console.log(str.toUpperCase( ));  // RUNOOB GOOGLE
```

19. `valueOf()` 返回指定字符串对象的原始值。
```ts
var str = new String("Runoob"); 
console.log(str.valueOf( ));  // Runoob
```

#### String对象的使用建议
在TypeScript中，使用String对象通常是不必要的，直接使用string字面量会更高效且符合TypeScript的最佳实践。

- 性能：String对象是一个引用类型，会占用更多内存，且每次创建一个新对象性能开销更大。
- 类型安全：TypeScript更鼓励使用string字面量类型，保持代码的简洁和一致性。

如果确实需要使用String对象的方法，可以通过valueOf()方法将对象转为原始字符串，然后继续处理。
通常情况下，TypeScript推荐直接使用string字面量类型，以简化代码，提高性能，避免不必要的类型转换和复杂性。

```ts
let strLiteral: string = "use string literals whenever possible!";
let strObject: String = new String("Avoid using String objects.");

console.log(strLiteral);     // 输出："Use string literals whenever possible!"
console.log(strObject.valueOf());    // 输出："Avoid using String objects."
```
 