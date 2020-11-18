import { Component } from './framework.js'

class Carousel extends Component{
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let item of this.attributes.data) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url(${item})`;
      this.root.appendChild(child);
    }
    const children = this.root.children;
    const width = 500;
    let position = 0;
    this.root.addEventListener('mousedown', (e) => {
      const startX = e.clientX;
      const move = (event) => {
        const moveX = event.clientX - startX;
        // let current = position - Math.round(moveX / width); // 0, -1, -2, -3
        const current = position - (( moveX - moveX % width ) / 500);
        // 当前图片的左右两侧的图片位置计算
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;
          const child = children[pos];
          child.style.transition = 'none';
          child.style.transform = `translateX(${-pos * width + offset * width + moveX % width }px)`;
        }
      }
      const up = (event) => {
        const moveX = event.clientX - startX;
        position = position - Math.round(moveX / width);
        // 当前图片的左右两侧的图片位置计算
        for (let offset of [0, -Math.sign(Math.round(moveX / width) - moveX + width/2 * Math.sign(moveX))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          const child = children[pos];
          child.style.transition = '';
          child.style.transform = `translateX(${-pos * width + offset * width}px)`;
        }
        this.root.removeEventListener('mousemove', move);
        this.root.removeEventListener('mouseup', up);
      }
      // 处理触发拖拽造成的 mouseup 失效
      this.root.ondragstart = (event) => {
        return false;
      };
      // 处理 onmouseleave 造成的 mouseup 失效
      this.root.onmouseleave = (event) => {
        up(event);
      }
      this.root.addEventListener('mousemove', move);
      this.root.addEventListener('mouseup', up);
    })
    /**
    // 给 root 添加轮播逻辑
    let currentIndex = 0;
    setInterval(() => {
      const children = this.root.children;
      const nextIndex = (currentIndex + 1) % children.length;
      const nextChild = children[nextIndex];
      const currentChild = children[currentIndex];


      
      nextChild.style.transition = "none"; // 取消动画
      nextChild.style.transform = `translateX(${ 100 - nextIndex * 100}%)`; // 提前置于显示区域左侧

      setTimeout(() => {
        nextChild.style.transition = ""; // 设置为空 style的效果失效

        currentChild.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        nextChild.style.transform = `translateX(${-nextIndex * 100}%)`;
        currentIndex = nextIndex;
      }, 16);

    }, 3000);
    */
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

export default Carousel;