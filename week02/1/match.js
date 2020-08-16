// 查找字符a
function match(str) {
  for (let c of str) {
    if (c === 'a') {
      return true
    }
  }
  return false
}
console.log(match('I am test'))