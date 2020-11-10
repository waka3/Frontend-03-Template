// 保证为私有变量，外部不可用
const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations'); // 动画组

export class Timeline{
  constructor() {
    this[ANIMATIONS] = new Set();
  }
  start() {
    let startTime = new Date(); // 开始执行动画的时间
    this[TICK] = () => {
      let t = new Date() - startTime; // 每帧动画开始的时间与start()方法运行的时间差
      for (let animation of this[ANIMATIONS]) {
        let v = t;
        if (animation.duration < v) {
          this[ANIMATIONS].delete(animation);
          v = animation.duration; // 避免出现 t 的值 > duration
        }
        animation.receive(v);
      }
      requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }
  // 暂停
  pause() {}
  // 恢复
  resume() {}
  // 重置
  reset() { }
  add(animation) {
    this[ANIMATIONS].add(animation);
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
 * @{function} timingFunction 时间函数
 */
export class Animation{
  constructor(object, property, startValue, endValue, duration, timingFunction) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  // 接收执行时间
  receive(time) {
    // console.log(time);
    const range = this.endValue - this.startValue; // 100
    this.object[this.property] = this.startValue + range * time / this.duration;
    console.log('%c %s', 'color: red;', this.object[this.property]);
  }
}