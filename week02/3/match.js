// 查找字符串abcdef
function match(str) {
  let foundA = false
  let foundB = false
  let foundC = false
  let foundD = false
  let foundE = false
  // 找到字符“abcdef”
  for (let c of str) {
    if (c === 'a') {
      foundA = true
    } else if (c === 'b' && foundA) {
      foundA = false
      foundB = true
    } else if (c === 'c' && foundB) {
      foundB = false
      foundC = true
    } else if (c === 'd' && foundC) {
      foundC = false
      foundD = true
    } else if (c === 'e' && foundD) {
      foundD = false
      foundE = true
    } else if (c === 'f' && foundE) {
      return true
    } else {
      foundA = false
      foundB = false
      foundC = false
      foundD = false
      foundE = false
    }
  }
  return false
}
console.log(match('aabbcdefg'))