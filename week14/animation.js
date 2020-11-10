// 保证为私有变量，外部不可用
const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations'); // 动画组
const START_TIME = Symbol('start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

export class Timeline{
  constructor() {
    this[ANIMATIONS] = new Set(); // Set 一组key 一维数组
    this[START_TIME] = new Map(); // Map 一组key value 二位数组
    this.state = 'Inited';
  }
  start() {
    if (this.state !== 'Inited') return;
    this.state = 'playing';
    let startTime = Date.now(); // 开始执行动画的时间  Date.now() 返回当前日期的毫秒数，效率更高
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      let now = Date.now(); // 每帧动画开始执行的当前时间
      for (let animation of this[ANIMATIONS]) {
        const start0 = this[START_TIME].get(animation); // 动画设置的开始时间
        if (now >= start0) {
          let t;
          if (start0 < startTime) {
            t = now - startTime - this[PAUSE_TIME] - animation.delay;
          } else {
            // 设置的动画开始时间 若大于动画开始执行的时间则出问题
            t = now - start0 - this[PAUSE_TIME]  - animation.delay;
          }
          if (animation.duration < t) {
            this[ANIMATIONS].delete(animation);
            t = animation.duration; // 避免出现 now 的值 > duration
          }
          animation.receive(t);
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }
  // 暂停
  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  // 恢复
  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }
  // 重置
  reset() { 
    if(this.state === 'playing')
      this.pause();
    this.state = 'Inited';
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[TICK_HANDLER] = null;
    this[PAUSE_TIME] = 0;
    this[PAUSE_START] = 0;
  }
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
  remove() {}
}

/**
 * 属性动画
 * @{params} object 对象
 * @{params} property 属性
 * @{params} startValue 开始值
 * @{params} endValue 结束值
 * @{params} duration 持续时间
 * @{params} delay 延迟时间
 * @{function} timingFunction 时间函数
 * @{function} template
 */
export class Animation{
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    timingFunction = timingFunction || (v => v);
    template = template || (v => v);
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
    this.template = template;
  }
  // 接收执行时间
  receive(time) {
    const range = this.endValue - this.startValue; // 动画区域值范围
    const progress = this.timingFunction(time / this.duration);
    this.object[this.property] = this.template(this.startValue + range * progress);
  }
}