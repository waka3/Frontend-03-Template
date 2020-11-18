let contexts = new Map();
let hander;
// listen => recognize => dispatch

/**
 * 事件监听
 */
export class Listener {
  constructor(element, recognizer) {
    let isListeningMouse = false;
    element.addEventListener('mousedown', e => {
      /**
       * 把 e.button的值转为 e.buttons 的结构
       * e.button: 0, 1, 2, 3, 4  1:中键, 2: 右键
       * 1 << e.button
       * e.button: 1, 2, 4, 8, 16 2:右键, 4: 中键
       */
      let context = Object.create(null);
      contexts.set('mouse' + (1 << e.button), context);
      recognizer.start(e, context);

      const mousemove = e => {
        /**
         * mousemove 的 e.button 始终为0
         * e.buttons 值为多个键按位与结果;
         * 为了在 contexts 内 获得 鼠标按下时 使用的鼠标按键值
         */
        let button = 1;
        while (button <= e.buttons) {
          if (button & e.buttons) {
            // e.button和e.buttons 中键和左键相反处理
            let key = button;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            }
            let context = contexts.get('mouse' + key);
            recognizer.move(e, context);
          }
          button = button << 1;
        }
      }
      const mouseup = e => {
        // 多个键按下是 up 事件被处理多次
        let context = contexts.get('mouse' + (1 << e.button));
        recognizer.end(e, context);
        contexts.delete('mouse' + (1 << e.button));
        if (e.buttons === 0) {
          document.removeEventListener('mouseup', mouseup);
          document.removeEventListener('mousemove', mousemove);
          isListeningMouse = false;
        }
      }
      if (!isListeningMouse) {
        document.addEventListener('mouseup', mouseup);
        document.addEventListener('mousemove', mousemove);
        isListeningMouse = true;
      }
    })

    element.addEventListener('touchstart', e => {
      for (let touch of e.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    })

    element.addEventListener('touchmove', e => {
      for (let touch of e.changedTouches) {
        const context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    })

    element.addEventListener('touchend', e => {
      for (let touch of e.changedTouches) {
        const context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    })

    // touched事件被打断如弹窗，此时触发cancel事件
    element.addEventListener('touchcancel', e => {
      for (let touch of e.changedTouches) {
        const context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
        contexts.delete(touch.identifier);
      }
    })
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start(point, context) {
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.isPan = false;
    context.isTap = true;
    context.isPress = false;
    context.isFlick = false;
    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      }
    ];
    hander = setTimeout(() => {
      context.isPress = true;
      context.isPan = false;
      context.isTap = false;
      hander = null;
      this.dispatcher.dispatch('pressstart', {});
    }, 500);
  }
  move(point, context) {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true;
      context.isTap = false;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
      clearTimeout(hander);
    }

    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
    }

    context.points = context.points.filter(point => Date.now() - point.t < 500); // 过滤掉移动时间间隔超过 0.5s 的点

    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    })
    
  }
  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {});
      clearTimeout(hander);
    }
    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {});
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    let d, v;
    if (!context.points.length) {
      v = 0;
    } else {
      d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
      v = d / (Date.now() - context.points[0].t);
    }
    if (v > 1.5) {
      context.isFlick = true;
      this.dispatcher.dispatch('flick', {});
    } else {
      context.isFlick = false;
    }

    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick
      });
    }
  }
  cancel(point, context) {
    clearTimeout(hander);
    console.log('touchcancel', point.clientX, point.clientY);
  }
}

/**
 * 事件派发
 * @param {*} type 事件类型 
 * @param {*} properties 属性值
 */
export class Dispatcher{
  constructor(element){
    this.element = element;
  }
  dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}