var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  initProject() {
    const pkgJson = {
      "name": "vue-demo",
      "version": "1.0.0",
      "description": "",
      "main": "./src/main.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
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
      'vue-loader',
      'webpack@4.44.1',
      'webpack-cli',
      'vue-template-compiler',
      'css-loader',
      'vue-style-loader',
      'copy-webpack-plugin'
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