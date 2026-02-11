TypeScript 与 JavaScript 类似，支持 Number 对象。
在 TypeScript 中，Number 对象用于包装数值类型。
Number 对象是原始数值的包装对象。
类似于 String 对象，Number 对象是引用类型，与基本的 number 类型有所不同。
尽管 Number 对象提供了一些额外的属性和方法，但在 TypeScript 中更推荐直接使用基本的 number 类型，因为 Number 对象会带来性能开销和类型混淆。

### 语法
```ts
var num = new Number(value);
```
需要注意的是，这会创建一个引用类型的对象，而非基本的 number 类型。
**注意：** 如果一个参数值不能转换为一个数字将返回 NaN (非数字值)。

**Number对象与基本number类型的区别**
- 基本类型number：原始数据类型，用于存储数值。
- Number对象：引用类型，是一个包装对象，用于包装基本数值。

实例：
```ts
let numLiteral: number = 42;
let numObject: Number = new Number(42);

console.log(typeof numLiteral);   // 输出："number"
console.log(typeof numObject);    // 输出："object"
```

### Number对象属性
1. `MAX_VALUE` 可表示的最大的数，`MAX_VALUE` 属性值接近于 1.79E+308。大于 `MAX_VALUE` 的值代表 "Infinity"。
2. `MIN_VALUE` 可表示的最小的数，即最接近 0 的正数 (实际上不会变成 0)。最大的负数是-`MIN_VALUE`，`MIN_VALUE` 的值约为 5e-324。小于 `MIN_VALUE` ("underflow values") 的值将会转换为 0。
3. `NaN` 非数字值（Not-A-Number）。
4. `NEGATIVE_INFINITY` 负无穷大，溢出时返回该值。该值小于 `MIN_VALUE`。
5. `POSITIVE_INFINITY` 正无穷大，溢出时返回该值。该值大于 `MAX_VALUE`。
6. `prototype` Number 对象的静态属性。使您有能力向对象添加属性和方法。
7. `constructor` 返回对创建此对象的 Number 函数的引用。

```ts
console.log("TypeScript Number 属性: "); 
console.log("最大值为: " + Number.MAX_VALUE); 
console.log("最小值为: " + Number.MIN_VALUE); 
console.log("负无穷大: " + Number.NEGATIVE_INFINITY); 
console.log("正无穷大:" + Number.POSITIVE_INFINITY);
```


### `NaN`实例

```ts
var month = 0
if (month <= 0 || month > 12){
    month = Number.NaN
    console.log("月份是："+ month)
}else{
    console.log("输入月份数值正确。")
}
```

### prototype实例

```ts
function employee(id:number, name:string){
    this.id = id
    this.name = name
}

var emp = new employee(123, "admin")
employee.prototype.email = "admin@momoko.com"

console.log("员工号: "+emp.id) 
console.log("员工姓名: "+emp.name) 
console.log("员工邮箱: "+emp.email)
```

### Number对象方法
1. `toExponential()` 把对象的值转换为指数计数法。
```ts
var num1 = 1225.30
var val = num1.toExponential();
console.log(val)    // 输出： 1.2253e+3
```

2. `toFixed()` 把数字转换为字符串，并对小数点指定位数。
```ts
var num3 = 177.234 
console.log("num3.toFixed() 为 "+num3.toFixed())    // 输出：177
console.log("num3.toFixed(2) 为 "+num3.toFixed(2))  // 输出：177.23
console.log("num3.toFixed(6) 为 "+num3.toFixed(6))  // 输出：177.234000
```

3. `toLocalString()` 把数字转换为字符串，使用本地数字格式顺序。
```ts
var num = new Number(177.1234); 
console.log( num.toLocaleString());  // 输出：177.1234
```

4. `toPrecision()` 把数字格式化为指定的长度。
```ts
var num = new Number(7.123456); 
console.log(num.toPrecision());  // 输出：7.123456 
console.log(num.toPrecision(1)); // 输出：7
console.log(num.toPrecision(2)); // 输出：7.1
```

5. `toString()` 把数字转换为字符串，使用指定的基数。数字的基数是 2 ~ 36 之间的整数。若省略该参数，则使用基数 10。
```ts
var num = new Number(10); 
console.log(num.toString());  // 输出10进制：10
console.log(num.toString(2)); // 输出2进制：1010
console.log(num.toString(8)); // 输出8进制：12
```

6. `valueOf()` 返回一个 Number 对象的原始数字值。
```ts
var num = new Number(10); 
console.log(num.valueOf()); // 输出：10
```

### Number对象的使用建议
在TypeScript中，通常更推荐使用基本的number类型，而不是Number对象。原因如下：
- 性能：基本类型更轻量，性能更好。
- 类型一致性：TypeScript的类型系统更倾向于基本类型，使用Number对象可能导致意外的类型不匹配。
- 最佳实践：基本类型的number更符合TypeScript的最佳实践，避免了对象包装带来的不必要复杂性。

如果确实需要使用Number对象的特定方法，可以通过`valueOf()`方法将Number对象转换为基本的number类型。
总之，TypeScript更推荐使用基本类型number而不是Number对象，以保持代码的简洁，高效和一致性。

实例：
```ts
let numLiteral:number = 123.456;
let numObject:Number = new Number(123.456);

console.log(numLiteral.toFixed(2));    // 输出："123.46"
console.log(numObject.valueOf());      // 输出：123.456
```
