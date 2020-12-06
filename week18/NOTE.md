学习笔记

### 工具链 - 单元测试工具 [mocha] [jest]

#### tips
1. npm install 无法下载与项目名(package.json -> name)  一致的 package, 因此尽量避免项目名与包名重复
2. mocha 是 node 的构建工具，默认只支持 commonJS 的模块系统，即 require, exports, 默认是不兼容 ES6 的模块 import, export的
  > node.js 默认使用 commonJS 模块系统
  > node.js 启用 ES模块的方法：package.json -> type: 'module'

#### mocha 配置 es 模块支持
1. npm install @babel/core @babel/register @babel/preset-env
2. .babelrc 配置 babel presets
3. 执行mocha --require @babel/register

#### mocha 增加单元测试 code coverage
commonjs模块测试覆盖率支持
1. npm install nyc
2. 执行nyc mocha --require @babel/register
  > Stmts(statements)

mocha 配置 es 模块支持后的测试覆盖率支持 (低版本node需要)
1. babel 插件拓展 npm install babel-plugin-istanbul
2. nyc 插件拓展 npm install @istanbuljs/nyc-config-babel
3. .babelrc 增加 plugins配置
4. 增加 .nycrc 配置文件

#### 使用 mocha 测试 toy-browser 的 html 的编译文件 parser.js
1. 配置 mocha 单元测试 和 nyc code coverage
2. 复制 parser.js 文件
3. parser.spec.js 进行 parseHTML 测试
4. 利用 vscode 实现 parser.js 文件的 debugger 测试
    - 环境
      - vscode 1.47.3
      - Node: 12.17.1
    - vscode lanuch.json 配置:
      - program: 项目 mocha 运行程序的绝对路径
      - cwd: 配置在此目录中启动要调试的程序 (***如果.vscode不在项目目录下，则需要指定具体的调试程序的路径,否则args等配置无效***)
      - args (传递给程序 program 的参数, 可在process.argv拿到): mocha参数配置, 配置 babel 运行 支持 mocha 内 import export 使用
    - .babelrc: 增加 sourceMaps: 'inline'

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






















