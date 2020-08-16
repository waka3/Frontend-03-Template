// 查找字符串ab
function match(str) {
  let foundA = false
  for (let c of str) {
    if (c === 'a') {
      foundA = true
    } else if (c === 'b' && foundA) {
      return true 
    }
  }
  return false
}
console.log(match('I abm test'))