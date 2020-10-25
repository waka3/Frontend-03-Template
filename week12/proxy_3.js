/**
 * new Map()
 * 监听对象作为key
 * value也为new Map对象
 * value的 Map key为：监听对象的属性， value为属性绑定的事件
 */ 
let callbacks = new Map();

let usedReactives = [];

let object = {
  a: 1,
  b: 2
}

let po = reactive(object);

// 给po添加监听时间
// 代替事件监听
effect(() => {
  console.log(po.b);
})

function effect(callback) {
  usedReactives = [];
  callback();
  console.log('usedReactives', usedReactives);

  for (let value of usedReactives) {
    // 防止多次监听的重复添加
    if (!callbacks.has(value[0]))  // 已存在对象重复添加
      callbacks.set(value[0], new Map());
    if (!callbacks.get(value[0]).has(value[1])) // 已存在对象的key重复添加
      callbacks.get(value[0]).set(value[1], []);
    // 监听的事件加入到回调函数数组内
    callbacks.get(value[0]).get(value[1]).push(callback);
  }
}

function reactive(object) {
  return new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val;
      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          // 存在监听事件分别执行
          for (let callback of callbacks.get(obj).get(prop)) {
            callback();
          }
        }
      }
      return obj[prop];
    },
    get(obj, prop) {
      // 注册usedReactives 了解哪些变量被使用
      usedReactives.push([obj, prop]);
      return obj[prop];
    },
  })
}

po.a = 3
po.b = 4