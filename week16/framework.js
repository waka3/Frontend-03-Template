export function createElement(tagName, attributes, ...children) {
  let element;
  console.log('type: ', tagName);
  if (typeof tagName === 'string') {
    element = new ElementWrapper(tagName);
  } else {
    element = new tagName; // 非 HTML 标签的返回的的tagName 为 function
  }
  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  const processChild = (children) => {
    for (let child of children) {
      if ((typeof child === 'object') && (child instanceof Array)) {
        processChild(child);
        continue;
      }
      if (typeof child === 'string') { // 文本节点解析
        child = new TextWrapper(child);
      }
      console.log(child);
      element.appendChild(child);
    }
  }
  processChild(children);
  return element;
}

export const STATE = Symbol('state');
export const ATTRIBUTE = Symbol('attribute');

export class Component{
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }
  render() {
    return this.root;
  }
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root);
  }
  triggerEvent(type, args) {
    const event = type.replace(/^[\s\S]/, s => s.toUpperCase());
    this[ATTRIBUTE]['on' + event](new CustomEvent(event, { detail: args }));
  }
}

class ElementWrapper extends Component{
  constructor(tag) {
    super();
    this.root = document.createElement(tag);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
}

class TextWrapper extends Component{
  constructor(content) {
    super();
    this.root = document.createTextNode(content);
  }
}