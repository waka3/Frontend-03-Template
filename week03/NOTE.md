学习笔记

# 浏览器工作原理 - HTML 由 parse 转DOM树, DOM树 css 计算

### 利用FSM实现HTML分析
1. 三种标签
  - 开始标签 tagOpen
  - 结束标签 endTagOpen
  - 自封闭标签 selfClosingStartTag

2. 根据状态进行状态机处理
3. 状态机中对开始状态和结束状态进行标记
4. 属性处理：单双引号、无引号等 处理状态较多

### CSS 计算
1. npm install css, 使用现有的css parser
2. 当dom构建在startTag时即判断css规则匹配

### css属性
1. 优先级：[0, 0, 0, 0] - [inline-style, id, class, tag] 对应个数的样式 * 优先级 再累加

### 疑问
- server.js response.send('')内不能包含中文字符，否则client运行报错，疑问：当前配置解析格式不支持中文字符造成错误吗？
- 东西太多，还未消化