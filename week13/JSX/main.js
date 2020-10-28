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

class DIV{
  constructor() {
    this.root = document.createElement('div');
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

const dom = <DIV id="a">
  <span class="name">test</span>
  <span>b</span>
  <span>c</span>
  <span>d</span>
</DIV>

dom.mountTo(document.body);