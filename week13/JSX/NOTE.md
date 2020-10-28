### Markup的使用 - JSX搭建

#### 初始环境搭建
1. npm init 初始化package.json文件
2. webpack-cli webpack babel-loader(依赖与@babel/core @babel/preset-env)  安装
3. 新建webpack.config.js 配置文件
```JS
module.exports = {
  entry: "./main.js",
}
```
4. 新建入口文件main.js
5. 执行webpack打包 (测试环境安装是否成功)
  - 选择一： 全局安装webpack-cli的 直接执行webpack
  - 选择二： 局部安装webpack-cli的，在package.json scripts中配置webpack的执行命令
6. @babel/core @babel/preset-env 安装
7. webpack.config.js 配置 babel对js文件的编译;
```JS
module.exports = {
  entry: "./main.js",
  mode: 'development',
  module: {
    rules: [
      {
        test: /.js$/, // <
        use: { // < 
          loader: "babel-loader", // <
          options: { // <
            presets: ["@babel/preset-env"] // <
          }
        }
      }
    ]
  }
}
```
8. 执行webpack打包查看效果
 
#### JSX支持
1. @babel/plugin-transform-react-jsx 安装
2. webpack.config.js 配置 babel 对js文件内的 html 的编译;
```JS
module.exports = {
  entry: "./main.js",
  mode: 'development',
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-react-jsx"]  // <
          }
        }
      }
    ]
  }
}
```
```JS
编译前：
const a = <a href="//m.taobao.com">链接</a>
编译后：
React.createElement(\"a\", {\n  href: \"//m.taobao.com\"\n}
```

#### JSX编译 React.createElement()方法模拟
1. **@babel/plugin-transform-react-jsx** 编译内容查看：
  - webpack.config.js 配置 pragma 修改 JSX 编译的函数; ["@babel/plugin-transform-react-jsx"](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#options)
  ```JS
  plugins: [["@babel/plugin-transform-react-jsx", {pragma: 'createElement'}]]
  ```
  - 测试: dist内新建.html文件，并引入main.js, 不存在createElement 使用报错
  - main.js新增函数createElement()
  - pragma 解析结构：createElement(tagName, attribute, ...children);
  > children 为非文本节点时为：createElement(tagName, attribute, createElement(tagName, attribute, content));
  ```JS
  const a = <div id="a">
    <span class="name">a</span>
    <span>b</span>
    <span>c</span>
    <span>d</span>
  </div>
  // 解析结果
  var a = createElement("div",
    {
      id: "a"
    },
    createElement("span",
      {
        "class": "name",
      },
      "a"),
    createElement("span", null, "b"),
    createElement("span", null, "c"),
    createElement("span", null, "d"));
  ```
2. **createElement()** 普通 HTML 标签解析并显示
  ```JS
  function createElement(tagName, attributes, ...children) {
    const element = document.createElement(tagName);
    for (let name in attributes) {
      element.setAttribute(name, attributes[name]);
    }
    for (let child of children) {
      if (typeof child === 'string') { // 文本节点解析
        child = document.createTextNode(child);
      }
      element.appendChild(child);
    }
    return element;
  }

  const dom = <div id="a">
    <span class="name">test</span>
    <span>b</span>
    <span>c</span>
    <span>d</span>
  </div>

  document.body.appendChild(dom);
  ```
  > 踩坑：在head头引入了<script>内引入main.js, 执行编译后文件，报错：Uncaught TypeError: Cannot read property 'appendChild' of null
  >> 把js放在了head中, 而document.body的是在body中的东西; html整体上是至上而下的流程，因此需要将js从head中放置到body中才可以

3. **createElement(tagName, attribute, ...children)** 非 HTML 标签解析并显示
  > 普通的 HTML 标签 tagName 为字符串， 非 HTML 标签时 tagName 为 function;
  - 反向思路：用方法(mountTo)把节点添加到父节点下
  ```js
  createElement(){ // 仅修改 tagName 的处理
    let element;
    if (typeof tagName === 'string') {
      element = document.createElement(tagName);
    } else {
      element = new tagName; // 非 HTML 标签的返回的的tagName 为 function
    }
    ...
  }
  class DIV{
    constructor() {
      this.root = document.createElement('div');
    }
    setAttribute(name, value) {
      this.root.setAttribute(name, value);
    }
    appendChild(child) {
      this.root.appendChild(child);
    }
    mountTo(parent) {
      parent.appendChild(this.root);
    }
  }

  const dom = <DIV id="a">
    <span class="name">test</span>
    <span>b</span>
    <span>c</span>
    <span>d</span>
  </DIV>

  dom.mountTo(document.body);
  ```

4. 普通标签 和 自定义标签均可以用 mountTo 添加到并展示
  ```js
  function createElement(tagName, attributes, ...children) {
    let element;
    if (typeof tagName === 'string') {
      element = new ElementWrapper(tagName);
    } else {
      element = new tagName; // 非 HTML 标签的返回的的tagName 为 function
    }
    for (let name in attributes) {
      element.setAttribute(name, attributes[name]);
    }
    for (let child of children) {
      if (typeof child === 'string') { // 文本节点解析
        child = new TextWrapper(child);
      }
      element.appendChild(child);
    }
    return element;
  }
  // 创建 HTML 元素
  class ElementWrapper{
    constructor(tag) {
      this.root = document.createElement(tag);
    }
    setAttribute(name, value) {
      this.root.setAttribute(name, value);
    }
    appendChild(child) {
      child.mountTo(this.root);
    }
    mountTo(parent) {
      parent.appendChild(this.root);
    }
  }

  // 创建 Content 元素
  class TextWrapper{
    constructor(tag) {
      this.root = document.createTextNode(tag);
    }
    setAttribute(name, value) {
      this.root.setAttribute(name, value);
    }
    appendChild(child) {
      child.mountTo(this.root);
    }
    mountTo(parent) {
      parent.appendChild(this.root);
    }
  }
  ```

5. 创建一个轮播组件 **class Carousel** 标签
  - 提取公共代码作为框架 framework.js
  - main.js 内 创建 Carousel 类 实现基础编译
  - 新建 main.html 文件, 引入main.js 
  - webpack-dev-server 安装(依赖于webpack-cli) 并运行, 方便开发环境调试. 
  > 踩坑一：Error: Cannot find module ‘webpack-cli/bin/config-yargs’
  >> 安装的 webpack-cli 默认为最新 ^4.0.1 执行 webpack-dev-server 无法通过, 报错排查为 webpack-cli 版本与 webpack-dev-server版本不兼容;
  >> 直接安装教学视频版本 ^3.3.12 执行通过
  - **解析传入 Carousel 的轮播图片data数组, 执行逻辑解析：**
    - 使用 const swipper = <Carousel data={images} /> 编译执行为：
    ```js
    var swipper = (0,_framework_js__WEBPACK_IMPORTED_MODULE_0__.createElement)(Carousel, {
      data: images
    });
    ```
    - 执行 createElement 方法
    - 调用了 new Carousel ;
    - 执行 super() 调用 Component 跑入 constructor;
    - 继续执行  createElement , Carousel 的 setAttribute 被执行 this.attributes 值设置成功
    ```js
    for (let name in attributes) {
      element.setAttribute(name, attributes[name]);
    }
    ```
    > tips: 由于 this.attributes 在此时才执行, 原 Component constructor内的 render 方法需要移除, 否则 render 先于 this.attributes 的值设置, 轮播图片资源获取失败;
    >> `constructor(type) { this.root = this.render();}`
    - createElement 执行完成
    - 执行 swipper.mountTo(document.body);
    - mountTo内调用 render 函数, 创建图片节点 完成返回
    - Carousel 节点创建成功 图片正常展示;