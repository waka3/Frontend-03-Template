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
