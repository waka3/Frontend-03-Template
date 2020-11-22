学习笔记

### YEOMAN 搭建工具链
#### 初始化
1. npm init 初始化项目
2. npm install yeoman-generator
3. 根据 yeoman-generator 基础 构建项目结构
4. npm link 将 generator 构建结构 链接到 本地node_modules中
5. npx yo toolchain 运行当前初始化构建的工具链

> tips: npm link 我们可以使用npm link命令，将 本地开发模块链接到对应的运行项目中去。
> tips: [yeoman-generator](http://yeoman.io) 项目 package.json文件的 name 要求必须是 generator 开头才有效;
