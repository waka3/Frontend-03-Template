学习笔记

### TicTacToe游戏

1. 规则
  - 棋盘：3 * 3
  - 双方分别为：圆圈和叉 两种棋子
  - 双方交替下棋
  - 率先连成三子直线获胜
2. 棋盘的数据表示: 
```js
  // 1: 圆圈 ⭕
  // 2: 叉 ❌
  // 0: 空
  let pattern = [
    [2,0,0],
    [0,1,0],
    [0,0,0]
  ]
```
3. 棋盘的数据展示 show()
4. 棋盘格子增加点击事件： 下棋 move()
5. 判断游戏输赢 check()
6. 下一步胜利提示AI willWin()
7. 博弈最优结果给出
8. AI对弈

### 红绿灯异步编程
1. 规则
  - 绿灯10秒、黄灯2秒、红灯5秒无限循环

### 五子棋游戏
1. 规则
  - 棋盘: 5 * 5 
  - 双方分别为: 黑、白 两色棋子
  - 双方交替下棋
  - 率先连成五子直线获胜
  
2. 棋盘的数据表示: 
```js
  // 1: 黑子
  // 2: 白子
  // 0: 空
  let pattern = [
    [2,0,0,0,0],
    [0,1,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ]
```