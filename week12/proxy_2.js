let object = {
  a: 1,
  b: 2
}

function reactive(object) {
  return new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val;
      console.log('set: ', obj, prop, val);
      return obj[prop];
    },
    get(obj, prop) {
      console.log('get: ', obj, prop);
      return obj[prop];
    },
  })
}

let po = reactive(object);

po.a = 3;
po.o = 4;

console.log(po.a);

console.log(object);