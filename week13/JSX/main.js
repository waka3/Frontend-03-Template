function createElement(tagName, attributes, ...children) {
  let element;
  if (typeof tagName === 'string') {
    element = document.createElement(tagName);
  } else {
    element = new tagName; // 非 HTML 标签的返回的的tagName 为 function
  }
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

// document.body.appendChild(dom);
// 反向思路：把节点塞到某个节点下
dom.mountTo(document.body);