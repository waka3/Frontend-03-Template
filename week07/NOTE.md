学习笔记

## HTML
HTML演变
- SGML 子集
- XML 
- XHTML
- HTML4
- HTML5

### DTD 和 XML namespace

#### Character entity set [字符实体集](./xhtml-lat1.html)

**空格显示**
1. 空格键：多个空格键最后仅显示出一个空格的效果, 文字首尾的空格键均会被忽略;
2. nbsp;: no-break space:  用nbsp;连接两个词的时候会被识别成一个词, 无法换行, 在遇到换行时会出现问题，同时会破坏HTML的语义;
3. 建议使用css white-space 不要使用 nbsp;
```CSS
p{
  white-space: inherit;  /** 继承 */
  white-space: normal;   /** 常规的, 处理方法跟空格键一致 */
  white-space: nowrap;   /** 常规的, 空格处理方法跟空格键一致, 但是字符不换行 */
  white-space: pre;      /** 预格式化处理, 处理方式同 pre 标签, 保持文本内的全部内容, 但不会换行 */
  white-space: pre-wrap; /** 预格式化处理, 处理方式同 pre 标签, 保持文本内的全部内容 */
  white-space: pre-line; /** 预格式化行, 保留换行符, 除了换行符会原样输出，其他都与white-space:normal规则一致 */
}
```
```HTML
<p style="width: 90px;"> Hello      WorldHello </p>
```
[空格键](./images/space.jpg)
```HTML
<p style="width: 90px;">&nbsp;Hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WorldHello&nbsp;</p>
```
[&nbsp;](./images/nbsp.jpg)
```HTML
<p style="width: 90px; white-space: normal;"> Hello      WorldHello </p>
```
[white-space: normal](./images/normal.jpg)
```HTML
<p style="width: 90px; white-space: nowrap;"> Hello      WorldHello </p>
```
[white-space: nowrap](./images/nowrap.jpg)
```HTML
<p style="width: 90px; white-space: pre;"> Hello      WorldHello </p>
```
[white-space: pre](./images/pre.jpg)
```HTML
<p style="width: 90px; white-space: pre-wrap;"> Hello      WorldHello </p>
```
[white-space: pre-wrap](./images/pre-wrap.jpg)

#### Special characters for XHTML [XHTML的特殊字符](./xhtml-special.html)L
1. quot; 双引号
2. amp; &
3. lt; <
4. gt; >

### 语义化
> em：重语气强调、 strong: 单纯的内容强调

## 浏览器API
### DOM API
- Node
  - Element: 元素型节点, 跟标签相对应
    - HTMLElement
    - SVGElement
  - Document: 文档根节点
  - CharacterData：字符数据
    - Text：文本节点
    - Comment: 注释
    - ProcessingInstruction: 处理信息
  - DocumentFragment：文档片段
  - DocumentType：文档类型
- 导航类操作 - 通过父子关系和邻接关系查找元素
  - parentNode / parentElement
  - childNodes / children
  - firstNode / firstElementChild
  - lastNode / lastElementChild
  - previousSibling / previousElemntSibling
  - nextSibling / nextElementSibling
- 修改操作
  - appendChild
  - insertBefore
  - removeChild
  - replaceChild
- 高级操作
  - compareDocumentPosition: 比较两个节点关系, 返回值如下：
    - 1：没有关系，两个节点不属于同一个文档。
    - 2：第一节点（P1）位于第二个节点后（P2）。
    - 4：第一节点（P1）定位在第二节点（P2）前。
    - 8：第一节点（P1）位于第二节点内（P2）。
    - 16：第二节点（P2）位于第一节点内（P1）。
    - 32：没有关系，或是两个节点是同一元素的两个属性。
    > 注释：返回值可以是值的组合。例如，返回 20 意味着在 p2 在 p1 内部（16），并且 p1 在 p2 之前（4）。
  - contains: 检查一个节点是否包含另一个节点, 返回true/false
  - isEqualNode: 检查两个节点是否完全相等
  - cloneNode: 复制节点， 入参true 会进行复制子元素的深拷贝
### 事件API
- target.addEventListener(type, listener, [options, useCapture]): options: 事件的处理模式(冒泡/捕获等...)
- Event: 冒泡与捕获, 默认为冒泡事件

### Range API (比DOM API更精确)
1. 创建Range: (表示一个包含节点与文本节点的‘一部分’的文档片段。 可以是多个Range, 但每个Range是个连续的范围。)
  1. Document.createRange 方法创建 Range
  2. 还可以通过 Document 对象的构造函数 Range() 来得到 Range: new Range();
  3. setStart() / setEnd() 中间出现被截断的节点，会自动补上封闭标签;
2. 获取Range:
  1. range.extractContents()  → 返回的fragment对象;
  2. insertNode 插入心节点;

> tips: node.appendChild(node) 方法将一个节点附加到指定父节点的子节点列表的末尾处。
> 如果将被插入的节点已经存在于当前文档的文档树中，那么 appendChild() 只会将它从原先的位置移动到新的位置（不需要事先移除要移动的节点）

## CSSOM
**document.styleSheets**
1. style
3. link rel="stylesheet" 标签

### styleSheets子类 - styleSheets代表一个样式表, cssRules代表每一条具体样式的内容
1. document.styleSheets[0].cssRules;
2. document.styleSheets[0].insertRule("p {color: pink}", 0);
2. document.styleSheets[0].removeRule(0);
### styleSheets Rule
1. 普通rule: *CSSStyleRule*
  - selectorText String
  - style K-V 结构
2. At-rules: 
  - CSSCharsetRule
  - CSSImportRule
  - CSSImportRule
  - ...
### window.getComputedStyle(elt, [pseudoElt]), elt: 需要获取的元素， pseudoElt: 伪元素

### CSSOM View
#### Window
1. window.innerHeight, window.innerWidth :  实际视图区
2. window.outerWidth, window.outerHeight : 浏览器的总宽高(包含浏览器工具栏等的占比)
3. window.devicePixelRadio: 设备的物理像素 与 代码px 的比值
4. window.screen: window.screen.width/height (屏幕实际宽高)  window.screen.availWidth/availHeight (屏幕实际可用宽高)

#### Window API
1. window.open(URL, target, specs);  target (窗口打开模式) : [_blank, _parent, _self, _top, name], specs: 窗口显示效果。
用window.open创建了新窗口, 可用下列API 控制：
2. moveTo(x,y)
3. moveBy(x,y)
4. resizeTo(x,y)
5. resizeBy(x,y)

#### Scroll

#### layout
1. getClientRects() 获取每个盒子的边界
2. getBoundingClientRect() 只会获取一个，获取整个盒模型的边界

## 其他API
来源：
Khronos: WebGL标准
ECMA: ECMAScript
WHATWG: HTML
W#C: webaudio CG/WG

API获取：
```js
let names = Object.getOwnPropertyNames(window); // 获取windows的全部属性
/**
* 过滤
*/
function filterOut(names, props){
  let set = new Set();
  props.forEach(o=> set.add(o));
  return names.filter(e=> !set.has(e));
}
```


> 相关连接
>> [DTD](https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)
>> [字符实体集](http://www.w3.org/TR/xhtml1/DTD/xhtml-lat1.ent)
>> [XHTML的特殊字符](http://www.w3.org/TR/xhtml1/DTD/xhtml-special.ent)
>> [HTML标签](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5/HTML5_element_list)