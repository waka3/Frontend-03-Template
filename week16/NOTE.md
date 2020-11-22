学习笔记

### 手势与动画的结合应用
1. 给 root 添加 enableGesture(this.root) 手势方法;
2. 把轮播内原本用 鼠标按下、移动、松开的逻辑用 分发的事件处理
   - 给 root 增加 pan、 panend 事件监听;
3. 创建动画时间线 new Timeline() 并 start()
4. 把轮播内原本自动轮播的逻辑 用 Animation 类去处理;
5. 自动轮播与手势拖拽轮播结合
   - root 增加 鼠标开始 start 事件的监听用于的暂停动画时间线;
   - panend 重启时间线，并恢复自动轮播
6. Component 组件增加事件派发
7. position 变化的位置 分发 change 事件
8. tap 事件内 增加 分发 click 的处理