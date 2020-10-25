/**
 * new Map()
 * 监听对象作为key
 * value也为new Map对象
 * value的 Map key为：监听对象的属性， value为属性绑定的事件
 */ 
const callbacks = new Map();

// reactive 缓存
const reactivities = new Map();

let usedReactives = [];

let object = {
  a: {
    l:1
  },
  b: 2
}

let po = reactive(object);

// 给po添加监听时间
// 代替事件监听
effect(() => {
  // proxy_3 监听不到po.b.a这样子的变化
  console.log(po.a.l);
})

function effect(callback) {
  usedReactives = [];
  callback();
  console.log('usedReactives', JSON.stringify(usedReactives));

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
  if (reactivities.has(object)) { // 存在返回缓存的对象
    return reactivities.get(object);
  }
  const proxy = new Proxy(object, {
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
      const _toString = Object.prototype.toString.call(obj[prop]).slice(8, -1);
      if (_toString === 'Object') { // 属性为对象，则再包裹一层reactive
        return reactive(obj[prop]);
      }
      return obj[prop];
    },
  })

  reactivities.set(object, proxy);

  return proxy;
}

po.a.l = 100;
po.b = 4;