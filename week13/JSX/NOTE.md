### Markup的使用 - JSX搭建

#### 初始环境搭建
1. npm init 初始化package.json文件
2. webpack-cli webpack babel-loader 安装
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