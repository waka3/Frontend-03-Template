import { Component,  createElement, STATE, ATTRIBUTE } from './framework.js';
export { STATE, ATTRIBUTE } from './framework.js';

class Button extends Component {
  constructor() {
    super();
  }
  render() {
    this.childContainer = <span />
    this.root = (<div>{this.childContainer}</div>).render();
    return this.root;
  }
  appendChild(child) {
    if (!this.childContainer) {
      this.render();
    }
    this.childContainer.appendChild(child);
  }
}

export default Button;