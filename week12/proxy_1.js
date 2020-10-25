let object = {
  a: 1,
  b: 2
}

let po = new Proxy(object, {
  set(obj, prop, val) {
    console.log('set: ', obj, prop, val);
  }
})

po.a = 3;
po.o = 4;

console.log(object);