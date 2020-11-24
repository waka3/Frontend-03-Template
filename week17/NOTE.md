学习笔记

### YEOMAN 搭建工具链
#### 初始化搭建
1. npm init 初始化项目
2. npm install yeoman-generator
3. 根据 yeoman-generator 基础 构建项目结构
4. npm link 将 generator 构建结构 链接到 本地node_modules中
5. npx yo toolchain 运行当前初始化构建的工具链

#### yeoman 基础
1. <code>this.log()</code>作为输出,  <code>this.prompt()</code>作为输入.
2. this.destinationPath(文件): 生成文件

#### yeoman 文件系统
1. 新建的 templates/index.html 模板文件
```js
this.fs.copyTpl(
  this.templatePath('index.html'),
  this.destinationPath('public/index.html'),
  { title: `this is template title,  such as "<%= title %>"` }
)
```
2. 生成默认的pageage.json文件
```js
initProject() {
  const pkgJson = {
    devDependencies: {
      eslint: '^3.15.0'
    },
    dependencies: {
      react: '^16.2.0'
    }
  }
  // 生成 package.json 文件
  this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
}
install() {
  // 执行 npm install
  this.npmInstall();
}
```

#### 搭建简易的 vue 脚手架
1. 新建 vue 项目基础环境的 templates文件:
  - index.html
  - 入口文件 main.js
  - 示例文件 HelloWorld.vue
  - 配置文件 webpack.config.js
2. yeoman-generator index.js 文件配置：
   - 模板文件编译
   - npm init 初始化
3. 新建文件夹, yo vue 脚手架搭建 vue 项目
  > 运行时报错： [webpack-cli] TypeError: The 'compilation' argument must be an instance of Compilation
  >> 解决：把 webpack 版本从5 降到 4 解决.  
  >> 原因: webpack ^5. 与 new VueLoaderPlugin() 版本不兼容

  > 运行时报错： [webpack-cli] Error: Compiling RuleSet failed: Unexpected property test in condition
  >> 解决：本地降低 webpack-cli 版本未解决，通过给 项目局部安装webpack-cli 运行成功
  >> 原因: 未知

### webpack & babel
1. babel 作为工具独立使用, 结合plugins使用
  > npm install --save-dev @babel/core @babel/cli @babel/preset-env
2. babel 与 webpack 搭配使用, 在 webpack 中 以 babel-loader 存在, webpack 不会默认读取 .babelrc文件, 预设的 presets 可在 loader 的 options选中中配置

> tips: npm link 我们可以使用npm link命令，将 本地开发模块链接到对应的运行项目中去。
> tips: [yeoman-generator](http://yeoman.io) 
>> 项目 package.json文件的 name 要求必须是 generator 开头才有效;
>> Generator 内的方法会依次执行
