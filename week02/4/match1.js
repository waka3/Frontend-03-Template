// 使用状态机 查找字符串abababx
function match(str) {
  let state = start
  for (let c of str) {
    state = state(c)
  }
  return state === end
}


function start(c) {
  if (c === 'a') return foundB
  return start
}

function end(c) {
  return end
}

function foundB(c) {
  if (c === 'b') return found2A
  return start(c)
}
function found2A(c) {
  if (c === 'a') return found2B
  return start(c)
}
function found2B(c) {
  if (c === 'b') return found3A
  return start(c)
}
function found3A(c) {
  if (c === 'a') return found3B
  return start(c)
}
function found3B(c) {
  if (c === 'b') return foundX
  return start(c)
}
function foundX(c) {
  if (c === 'x') return end
  return start(c)
}

console.log(match('abababx'))