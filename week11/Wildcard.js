function find(soucre, pattern) {
  // 查找 pattern 的 * 个数
  const reg = /\*/g;
  let starCount = 0;
  if (pattern.match(reg)) {
    starCount = pattern.match(reg).length;
  }
  console.log(starCount);
  
  // 没有 * 号的边界
  if (starCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== soucre[i] && pattern[i] !== '?') return false;
    }
    return;
  }

  let i = 0; // pattern index
  let lastIndex = 0; // soucre index

  // 查找第一组 * 的位置 i 
  for (i = 0; pattern[i] !== "*"; i++){
    if (pattern[i] !== soucre[i] && pattern[i] !== '?') {
      return false;
    }
  }

  lastIndex = i;

  // 查找每一组 * 后的字符串
  for (let p = 0; p < starCount - 1; p++){
    i++;
    let subPattern = "";
    while (pattern[i] !== "*") {
      subPattern += pattern[i];
      i++;
    }
    const reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g"); // 把 ? 替换成任意字符后的 subPattern 作为 正则
    reg.lastIndex = lastIndex;
  }

  // 最后一个 * 后的字符串
  for (let j = 0; j < soucre.length - lastIndex && pattern[pattern.length - j] !== "*"; j++){
    if (pattern[pattern.length - j] !== soucre[soucre.length - j] && pattern[pattern.length - j] !== "?"){
      return false;
    }
  }

  return true;
}
// 测试 * 个数用例
// find('', 'av*s*sds*sf');
// find('', 'av*s*');
// find('', '*avs');
// find('', 'avs');

// 测试用例
console.log(find('abcabcabxaac', 'a*b*bx*c'));
