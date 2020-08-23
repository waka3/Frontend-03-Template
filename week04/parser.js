const css = require('css')

const EOF = Symbol("EOF") // 利用Symbol唯一性，将EOF作为 End of File

const layout = require('./layout')

let currentToken = null
let currentAttribute = null
let currentTextNode = null

const wordReg = /^[a-zA-Z]$/
const spaceReg = /^[\t\n\f ]$/

let stack = [
  { type: 'document', children: [] } // 初始根节点
]

// 增加css规则
let rules = []
function addCSSRules(text) {
  let ast = css.parse(text)
  // console.log(JSON.stringify(ast, null, "     "))
  rules.push(...ast.stylesheet.rules)
}

// 对应的选择器个数
function specificity(selector) {
  let p = [0, 0, 0, 0] // [inline-style, id, class, tag]
  let selectorParts = selector.split(" ")  // 以空格拆分选择器类别
  for (let part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1
    } else if (part.charAt(0) === ".") {
      p[2] += 1
    } else {
      if (part.indexOf('#') !== -1 || part.indexOf('.') !== -1) { // 复合选择器
        const mulit = selector.match(/[a-zA-Z]+|([#.])[a-zA-Z]+/g)
        for (let part of mulit) {
          if (part.charAt(0) === '#') {
            p[1] += 1
          } else if (part.charAt(0) === ".") {
            p[2] += 1
          } else {
            p[3] += 1
          }
        }
      } else {
        p[3] += 1
      }
    }
  }
  return p
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}

// 样式匹配
function CSS_Selectors(element, selector) {
  // chartAt(index) 返回字符串指定位置的字符内容
  if (selector.charAt(0) === '#') {
    let attr = element.attributes.filter(attr => attr.name === 'id')
    if (attr && attr.value === selector.replace('#', ''))
      return true
  } else if (selector.charAt(0) === '.') {
    let attr = element.attributes.filter(attr => attr.name === 'class')
    if (attr && attr.value === selector.replace('.', ''))
      return true
  } else {
    if (element.tagName === selector) {
      return true
    }
  }
  return false
}

// 元素样式匹配
function match(element, selector) {
  if (!selector || !element.attributes) // 判断节点不存在或为文本节点则返回
    return false
  const multSelector = selector.match(/[a-zA-Z]+|([#.])[a-zA-Z]+/g)
  for (let i = 0; i < multSelector.length; i++) {
    if (!CSS_Selectors(element, multSelector[i])) {
      return false
    }
  }
  return true
}
// 计算css
function computeCSS(element) {
  let elements = stack.slice().reverse() // 获取当前元素往外匹配
  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(" ").reverse()
    if (!match(element, selectorParts[0])) continue
    let matched = false
    let j = 1
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++
      }
    }
    if (j >= selectorParts.length)
      matched = true
    if (matched) {
      let computedStyle = element.computedStyle
      const sp = specificity(rule.selectors[0])
      for (let declaration of rule.declarations) {
        const property = declaration.property
        if (!computeCSS[property]) {
          computedStyle[property] = {}
        }
        if (!computedStyle[property].specificity) {
          computedStyle[property].value = declaration.value
          computedStyle[property].specificity = sp
        } else if (compare(computedStyle[property].specificity, sp) < 0) {
          computedStyle[property].value = declaration.value
          computedStyle[property].specificity = sp
        }
        computedStyle[property].value = declaration.value
      }
      // console.log(element.computedStyle)
    }
  }
}

function emit(token) {
  let top = stack[stack.length - 1] // 获取emit的栈顶元素

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }
    element.tagName = token.tagName
    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') { // 除type&tagName字典，剩余的key均为属性kv
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    computeCSS(element)

    top.children.push(element)  // 开始标签 节点入栈
    element.parent = top
    if (!token.isSelfClosing) {
      stack.push(element)
    }
    currentTextNode = null
  } else if (token.type === 'endTag') { // 结束标签
    if (top.tagName !== token.tagName) { // 配对判断
      throw new Error("Tag start end doesnit match!")
    } else {
      // 结束标签里碰到style标签执行css的绘制
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content)
      }
      // layout(top)
      stack.pop() // 替换最后一个标签
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode == null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

// 开始状态检测 < 唯一开始
function data(c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {  // 结束
    emit({
      type: "EOF"
    })
    return
  } else {
    emit({
      type: "text",
      content: c
    })
    return data // 文本节点
  }
}

// 标签开始<  <div /
function tagOpen(c) {
  if (c === '/') { // 结束标签开始
    return endTagOpen // 直接进入下个char的循环
  } else if (c.match(wordReg)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c) // 检测char为字符串，继续执行tagName对char进行处理
  } else {
    return
  }
}

// 标签结束/后 </div>
function endTagOpen(c) {
  if (c.match(wordReg)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') { // </>
    // 报错
  } else if (c === EOF) {
    // 报错
  } else {

  }
}

// 标签名 <div id="test"></div> <img/>
function tagName(c) {
  if (c.match(spaceReg)) { // 匹配空格 属性开始
    return beforeAttributeName
  } else if (c === "/") { // <img/> 自封闭标签
    return selfClosingStartTag
  } else if (c.match(wordReg)) { // 匹配字符, 标签名还没结束 继续tagName
    currentToken.tagName += c
    return tagName
  } else if (c === '>') { // 普通开始标签
    emit(currentToken)
    return data // 开始标签结束继续开始下一个标签状态匹配
  } else {
    return tagName
  }
}

// 自封闭标签 <img/>
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing - true
    return data  // 当前标签结束，开始新的状态识别
  } else {
    // 报错
  }
}

// 属性名 <div id="test" class="div"></div> <img id="test" src="" />
function beforeAttributeName(c) {
  if (c.match(spaceReg)) {
    return beforeAttributeName
  } else if (c === ">" || c === '/' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === "=") {
    // 报错 (属性名前不可能存在等号)
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if (c.match(spaceReg) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === "'" || c === '<') {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if (c.match(spaceReg) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if (c === '"') {
    return doubleQuoteAttributeValue
  } else if (c === "'") {
    return singleQuoteAttributeValue
  } else if (c === '>') {

  } else {
    return UnquoteAttributeValue(c)
  }
}

function afterQuoteAttributeValue(c) {
  if (c.match(spaceReg)) {
    return beforeAttributeValue
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuoteAttributeValue
  }
}
// 双引号
function doubleQuoteAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuoteAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuoteAttributeValue
  }
}
// 单引号
function singleQuoteAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuoteAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return singleQuoteAttributeValue
  }
}
// 没有引号
function UnquoteAttributeValue(c) {
  if (c.match(spaceReg)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentAttribute)
    return data
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === "'" || c === '<' || c === '=' || c === '`') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return UnquoteAttributeValue
  }
}

// 属性名结束
function afterAttributeName(c) {
  if (c.match(spaceReg)) {
    return afterAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)
  // console.log(JSON.stringify(stack[0]))
  return stack[0]
}