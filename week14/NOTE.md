学习笔记

### 轮播图动画与手势
#### 动画
> **每帧**去执行了什么样的事件;
> 人眼能识别的最高帧率是60帧, 1000ms 1s, 因此计时器的执行周期为 1000 / 60 ~ 16ms; 
1. 属性动画 (js实现的动画类型)
2. 帧动画(手绘每一帧动画类型)
如何用 js 实现 animation
```js
// 方式一
setInterval(() => {
}, 16);
// 方式二
let tick = () => {
  setTimeout(tick, 16);
};
// 方式三
let tick = () => {
  requestAnimationFrame(tick);
};
```
> **requestAnimationFrame**是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按帧对网页进行重绘。
>> requestAnimationFrame(callback); callback 下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)
#### JS实现动画效果
1. Timeline: 时间线类
2. Animation: 动画类
