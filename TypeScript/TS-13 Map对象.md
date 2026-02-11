Map 对象保存键值对，并且能够记住键的原始插入顺序。
任何值(对象或者原始值) 都可以作为一个键或一个值。

### 创建Map
TypeScript使用Map类型和new关键字来创建Map：
```ts
let myMap = new Map();
```

初始化Map，可以以数组的格式来传入键值对：
```ts
let myMap = new Map([
    ["key1", "value1"],
    ["key2", "value2"]
]);
```

Map相关的函数与属性：
- `map.clear()` - 移除Map对象的所有键值对。
- `map.set()` - 设置键值对，返回该Map对象。
- `map.get()` - 返回键对应的值，如果不存在，则返回undefined。
- `map.has()`  - 返回一个布尔值，用于判断 Map 中是否包含键对应的值。
- `map.detete()` - 删除Map中的元素，删除成功返回true，失败返回false。
- `map.size` - 返回Map对象键/值对的数量。
- `map.keys()` - 返回一个Iterator对象，包含了Map对象中每个元素的键。
- `map.values()` - 返回一个新的Iterator对象，包含了Map对象中每个元素的值。
- `map.entries()` - 返回一个包含Map中所有键值对的迭代器。

### 常用函数

**set(key: K, value: V): this** - 向 Map 中添加或更新键值对。
```ts
map.set('key1', 'value1');
```

**get(key: K): V | undefined** - 根据键获取值，如果键不存在则返回 undefined。
```ts
const value = map.get('key1');
```

**has(key: K): boolean** - 检查 Map 中是否存在指定的键。
```ts
const exists = map.has('key1');
```

**delete(key: K): boolean** - 删除指定键的键值对，成功删除返回 true，否则返回 false。
```ts
const removed = map.delete('key1');
```

**clear(): void** - 清空 Map 中的所有键值对。
```ts
map.clear();
```

**size: number** - 返回 Map 中键值对的数量。
```ts
const size = map.size;
```

### 迭代方法
`keys(): IterableIterator<K>`  - 返回一个包含 Map 中所有键的迭代器。
```ts
for (const key of map.keys()){
    console.log(key);
}
```

`values(): IterableIterator<V>`  - 返回一个包含 Map 中所有值的迭代器。
```ts
for (const value of map.values()){
    console.log(value);
}
```

`entries(): IterableIterator<[K, V]>` - 返回一个包含 Map 中所有键值对的迭代器，每个元素是一个 `[key, value]` 数组。
```ts
for (const [key, value] of map.entries()){
    console.log(key, value);
}
```

`forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void` - 对 Map 中的每个键值对执行一次提供的回调函数。
```ts
map.forEach((value, key)) => {
    console.log(key, value);
});
```

实例：
```ts
const map = new Map<string, number>();

map.set('one', 1);
map.set('two', 2);

console.log(map.get('one'));  // 输出: 1
console.log(map.has('two'));  // 输出: true

map.delete('one');
console.log(map.size);   // 输出: 1

map.forEach((value, key)) => {
    console.log(key, value);  // 输出: two 2
});

map.clear();

console.log(map.size); // 输出: 0
```


实例：
```ts
// test.ts文件
let nameSiteMapping = new Map();

// 设置Map对象
nameSiteMapping.set("Google", 1);
nameSiteMapping.set("Momoko", 2);
nameSiteMapping.set("Taobao", 3);

// 获取键对应的值
console.log(nameSiteMapping.get("Momoko"));   // 2

// 判断Map中是否包含键对应的值
console.log(nameSiteMapping.has("Taobao"));    // true
console.log(nameSiteMapping.has("Zhihu")) ;    // false

// 返回Map对象键值对的数量
console.log(nameSiteMapping.size);     // 3

// 删除 Momoko
console.log(nameSiteMapping.delete("Momoko"));  // true
console.log(nameSiteMapping);

// 移除Map对象的所有键值对
nameSiteMapping.clear();   // 清除 Map
console.log(nameSiteMapping);
```


### 迭代Map
Map对象中的元素是按顺序插入的，我们可以迭代Map对象，每一次迭代返回`[key, value]`数组。
TypeScript中使用`for...of`来实现迭代。

```ts
// test.ts
let nameSiteMapping = new Map();
 
nameSiteMapping.set("Google", 1);
nameSiteMapping.set("Runoob", 2);
nameSiteMapping.set("Taobao", 3);
 
// 迭代 Map 中的 key
for (let key of nameSiteMapping.keys()) {
    console.log(key);                  
}
 
// 迭代 Map 中的 value
for (let value of nameSiteMapping.values()) {
    console.log(value);                 
}
 
// 迭代 Map 中的 key => value
for (let entry of nameSiteMapping.entries()) {
    console.log(entry[0], entry[1]);   
}
 
// 使用对象解析
for (let [key, value] of nameSiteMapping) {
    console.log(key, value);            
}
```

执行上述代码，输出结果为：
```
Google
Runoob
Taobao
1
2
3
Google 1
Runoob 2
Taobao 3
Google 1
Runoob 2
Taobao 3
```
