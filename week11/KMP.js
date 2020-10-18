
function KMP(source, pattern) {
  let table = new Array(pattern.length).fill(0);
  {
    // 计算回退表格
    let i = 1; // 自重复字符所在位置
    let j = 0; // 已重复的个数
    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        i++;
        j++;
        table[i] = j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
    }
    console.log(table);
  }

  {
    // 字符串是否匹配
    let i = 0; // source index
    let j = 0; // pattern index
    while (i < source.length) {
      if (source[i] === pattern[j]) {
        i++;
        j++;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
      if (j === pattern.length) { // pattern已全部匹配完毕
        return true;
      }
    }
    return false;
  }
}
// KMP("", 'abcdabce');
// KMP("", 'abababc');
// KMP("", 'aabaaac');

// console.log(KMP("hello", 'll'));
// console.log(KMP("hello", 'llx'));
// console.log(KMP("aabaabaaacx", 'aabaaac'));
// console.log(KMP("abc", 'abc'));
// console.log(KMP("abcxabcabc", 'ab'));