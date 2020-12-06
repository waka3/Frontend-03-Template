var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  initProject() {
    const pkgJson = {
      "name": "toy-tool",
      "version": "1.0.0",
      "description": "",
      "main": "./src/main.js",
      "scripts": {
        "build": "webpack",
        "test": "mocha --require @babel/register",
        "coverage": "nyc mocha --require @babel/register"
      },
      "author": "wyj",
      "devDependencies": {
      },
      "dependencies": {
      }
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
  initInstall() {
    this.npmInstall(['vue'], {'save-dev': false});
    this.npmInstall([
      'webpack@4.44.1',
      'webpack-cli',
      'vue-template-compiler',
      'vue-loader',
      'css-loader',
      'vue-style-loader',
      'babel-loader',
      'copy-webpack-plugin',
      "@babel/core",
      "@babel/preset-env",
      "@babel/register",
      "@istanbuljs/nyc-config-babel",
      "babel-plugin-istanbul",
      "mocha",
      "nyc"
    ], { 'save-dev': true });
  }
  async copyFiles() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "title",
        message: "Your project title",
        default: this.appname
      }
    ])
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    )
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc')
    )
    this.fs.copyTpl(
      this.templatePath('template-test.spec.js'),
      this.destinationPath('test/template-test.spec.js')
    )
    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue')
    )
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    )
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    )
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      { title: answers.title }
    )
  }
};