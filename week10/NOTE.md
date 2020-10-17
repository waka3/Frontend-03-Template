学习笔记

1. exec():
```js
const regex = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)/g;
// [1]...[n] 括号中的分组捕获
// regex 7个()捕获组，所以[1] - [7]为正则匹配出的内容
// ['匹配的全部字符串内容', undefined, " ", undefined, undefined, undefined, undefined, undefined, {index: '索引'}, {input: '内容'}, {groups: undefined}]
const result = regex.exec(expression);
```

2. LL算法 - 四则运算(词法分析)
  - TokenNumber (数字)
  - Operator (运算符) + - * /
  - Whitespace <SP>
  - LineTerminator 行终止符 <LF>: \n <CR>:\r

3. LL算法 - 语法分析 
  > 每一个产生式代表一个函数
  - 加法
  - 减法
  - 乘法
  - 除法