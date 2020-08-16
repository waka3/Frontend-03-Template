// 使用状态机查找字符串abcdef
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
  if (c === 'b') return foundC
  return start(c)
}
function foundC(c) {
  if (c === 'c') return foundD
  return start(c)
}
function foundD(c) {
  if (c === 'd') return foundE
  return start(c)
}
function foundE(c) {
  if (c === 'e') return foundF
  return start(c)
}
function foundF(c) {
  if (c === 'f') return end
  return start(c)
}

console.log(match('abbccdefg'))