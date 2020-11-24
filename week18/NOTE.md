学习笔记

### 工具链 - 单元测试工具 [mocha] [jest]

#### tips
1. npm install 无法下载与项目名(package.json -> name)  一致的 package, 因此尽量避免项目名与包名重复
2. mocha 是 node 的构建工具，默认只支持 commonJS 的模块系统，即 require, exports, 默认是不兼容 ES6 的模块 import, export的
  > node.js 默认使用 commonJS 模块系统
  > node.js 启用 ES模块的方法：package.json -> type: 'module'

#### [commonJS模块](http://nodejs.cn/api/modules.html#modules_modules_commonjs_modules)
- exports/ module.exports 导出模块方法和变量; require() 导入exports导出的模块方法
```js
// add.js
module.exports = function add(a, b) {
  return a + b;
}
module.exports = function multi(a, b) {
  return a * b;
}
// 第二个module.exports覆盖第一个module.exports

// index.js
const add = require('./add.js');
console.log(add) // [Function: multi];
```
```js
// add.js
exports.add = function add(a, b) {
  return a + b;
}
exports.multi = function multi(a, b) {
  return a * b;
}
// 文件顶层默认执行了 exports = module.exports
// index.js
const add = require('./add.js');
console.log(add) // { add: [Function: add], multi: [Function: multi] } 
```

```js
exports.add = function add(a, b) {
  return a + b;
}

exports.multi = function multi(a, b) {
  return a * b;
}

module.exports = function test() {  }
// 文件顶层默认执行了 module.exports = exports
// 最后的 module.export 被重新赋值
// index.js
const add = require('./add.js');
console.log(add) // [Function: test]
```

#### [ES模块](https://www.yuque.com/ostwind/es6/docs-module#699b94e1)
- export / export default 提供模块对外的接口，可以是方法和变量; import 输入 export 暴露的接口, 
- **import 输入的接口名需要与export暴露的接口存在一一对应的关系，用户需要知道所要加载的变量名或函数名，否则无法加载**
- export default 暴露了默认名为 default 的对外接口, import 可以为 default 接口任意命名, 因此无需知道接口的具体名称
```js
// test.js
export function add(a, b) {
  return a + b;
}

export function multi(a, b) {
  return a * b;
}
// index.js
import test from './test.js';
console.log(test); 
//mport test from './test.js';
       ^^^^
// SyntaxError: The requested module './test.js' does not provide an export named 'default'

// index.js
import * as test from './test.js';
console.log(test);
// [Module] { add: [Function: add], multi: [Function: multi] }

// index.js
import { add } from './test.js';
console.log(add);
// [Function: add]
```

```js
// test.js
export function add(a, b) {
  return a + b;
}

export function multi(a, b) {
  return a * b;
}

export default {
  add,
  multi
}

// index.js
import test from './test.js';
console.log(test);
// { add: [Function: add], multi: [Function: multi] }

// index.js
import * as test from './test.js';
console.log(test);
// [Module] {
//   add: [Function: add],
//   default: { add: [Function: add], multi: [Function: multi] },
//   multi: [Function: multi]
// }

// index.js
import { add } from './test.js';
console.log(add);
// [Function: add]
```

