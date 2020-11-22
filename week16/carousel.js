import { Component, STATE, ATTRIBUTE } from './framework.js';
import { enableGesture } from './gesture';
import { Timeline, Animation } from './animation';
import { ease } from './ease';

export { STATE, ATTRIBUTE } from './framework.js';

class Carousel extends Component{
  constructor() {
    super();
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let item of this[ATTRIBUTE].src) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url(${item.img})`;
      this.root.appendChild(child);
    }

    const children = this.root.children;
    const width = 500; // 图片宽度
    const duration = 500; // 动画持续时间

    enableGesture(this.root);

    let timeline = new Timeline();
    timeline.start();

    const template = (v) => `translateX(${v}px)`;

    let hander; // 自动轮播定时

    this[STATE].position = 0; // 组件当前的图片位置
    let t = 0;
    let ax = 0; // 动画便宜时间

    this.root.addEventListener('start', (event) => { 
      timeline.pause();
      clearInterval(hander);
      if (Date.now() - t < duration) {
        let progress = (Date.now() - t) / duration; // 动画播放的进程;
        ax = ease(progress) * width - width;
      } else {
        ax = 0;
      }
    })

    this.root.addEventListener('tap', (event) => { 
      this.triggerEvent('click', {
        data: this[ATTRIBUTE].src[this[STATE].position],
        position: this[STATE].position
      });
    })

    this.root.addEventListener('pan', (event) => {
      const moveX = event.clientX - event.startX - ax;
      const current = this[STATE].position - ((moveX - moveX % width) / width);
      // 当前图片的左右两侧的图片位置计算
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = (pos % children.length + children.length) % children.length;
        const child = children[pos];
        child.style.transition = 'none';
        child.style.transform = `translateX(${-pos * width + offset * width + moveX % width }px)`;
      }
    });

    this.root.addEventListener('end', (event) => {
      timeline.reset();
      timeline.start();

      hander = setInterval(nextPicture, 3000);
      
      const moveX = event.clientX - event.startX - ax;

      const current = this[STATE].position - ((moveX - moveX % width) / width);
      
      let direction = Math.round((moveX % width) / width);

      if (event.isFlick) {
        if (event.speed < 0) {
          direction = Math.ceil((moveX % width) / width);
        } else {
          direction = Math.floor((moveX % width) / width);
        }
      }

      // 当前图片的左右两侧的图片位置计算
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = (pos % children.length + children.length) % children.length;
        const child = children[pos];
        child.style.transition = 'none';
        timeline.add(new Animation(child.style,
          'transform',
          -pos * width + offset * width + moveX % width,
          -pos * width + offset * width + direction % width,
          duration,
          0,
          ease,
          template));
      }

      this[STATE].position = this[STATE].position - ((moveX - moveX % width) / width) - direction;
      this[STATE].position = (this[STATE].position % children.length + children.length) % children.length; // 避免负数问题
      this.triggerEvent('change', { position: this[STATE].position });
    });


    // 给 root 添加轮播逻辑
    const nextPicture = () => {
      const children = this.root.children;
      const nextIndex = (this[STATE].position + 1) % children.length;
      const currentChild = children[this[STATE].position];
      const nextChild = children[nextIndex];

      t = Date.now(); // 动画开始时间

      timeline.add(new Animation(currentChild.style,
        'transform',
        -this[STATE].position * width,
        -width - this[STATE].position * width,
        duration,
        0,
        ease,
        template));
      timeline.add(new Animation(nextChild.style,
        'transform',
        width - nextIndex * width,
        - nextIndex * width,
        duration,
        0,
        ease,
        template));
      this[STATE].position = nextIndex;
      this.triggerEvent('change', { position: this[STATE].position });
    }

    hander = setInterval(nextPicture, 3000);
    return this.root;
  }
}

export default Carousel;