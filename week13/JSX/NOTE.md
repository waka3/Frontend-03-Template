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
