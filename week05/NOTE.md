学习笔记

### CSS 2.1 总体结构
1. at-rules
  - [x] [@media](https://www.w3.org/TR/css3-conditional/)
  - [x] [@keyframes](https://www.w3.org/TR/css-animations-1/)
  - [x] [@fontface](https://www.w3.org/TR/css-fonts-3/)

  - [@import](https://www.w3.org/TR/css-cascade-4/)r

  - [@charset](https://www.w3.org/TR/css-syntax-3/)
  - [@page](https://www.w3.org/TR/css-page-3/)
  - [@counter-style](https://www.w3.org/TR/css-counter-styles-3)
  - [@supports](https://www.w3.org/TR/css3-conditional/) 检查某些功能是否被支持 本身是css3的新特性，目前不建议使用这个来检测新特性是否支持
  - [@namespace](https://www.w3.org/TR/css-namespaces-3/)
  - ... (已废弃/新出未确认)
2. rules
  - 选择器
  - 声明
    - key
      - 属性
      - 变量
    - value
      - 正常值
      - 函数值

#### CSS 规则
1. Selector (selector-3)[https://www.w3.org/TR/selectors-3/] (selector-4)[https://www.w3.org/TR/selectors-4/]
  - selector_group
  - selector: > , space, + , - 
  - simple_selector： type, *, ., #, :, ::, :not, []
2. Declaration
  - Key (Variables)[https://www.w3.org/TR/css-variables/]
    - variables
    - properties
  - Value (Value)[https://www.w3.org/TR/css-values-4/]
    - calc
    - number
    - length
    - unit
    - ...

##### Selector
1. 样式优先级
  > 优先级：[0, 0, 0, 0] - [内联, id, 类选择器/属性选择器/伪类, tagName/伪元素]

  > 设定数N

  > 通配符选择器不影响优先级，:not()不影响优先级，但是not里包含的内容影响优先级

  > 举例：设定数为1,
  >> .test div : [0,0,1,1], 权重为: 1 * 10 + 1 = 11,
  >> .test1 : [0,0,1,0] 权重为: 10,
  >> #id.class div: [0,1,1,1], 权重为: 1 * 100 + 1 * 10 + 1 = 111; 

2. 选择器语法
    - 简单选择器
      - \* 通配符选择器
      - div 类型选择器(tagName) 
      > 有命名空间概念: HTML、SVG、MathML, 重叠的命名用命名空间分隔符分开即可，如：svg | a
      - .cls 类选择器
      - #id id选择器
      - [attr=value] 属性选择器
      - :hover 伪类选择器
      - ::before 伪元素选择器
      > ::before / ::after 无中生有, 生成dom元素

      > ::first-line / ::first-letter 在现有的dom元素上做处理
    - 复杂选择器
      - 空格 祖孙关系
      - \> 直接上级(父)
      - ~ 兄弟节点:  div ~ p 在div后的所有 p 兄弟节点 
      - \+ 兄弟节点 div + p 紧跟在div后的 p 节点
    - 复合选择器
    > 有一定的顺序要求: 通配符/类型选择器最前, 伪类最后 如：div.test#id::before

##### 思考：为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？
1. The ::first-line pseudo-element describes the contents of the first formatted line of an element.
  ::first-line 伪元素 描述元素的第一‘格式化行’的内容。

2. In CSS, the ::first-line pseudo-element can only have an effect when attached to a block-like container such as a block box, inline-block, table-caption, or table-cell. In such a case, it refers to the first formatted line of that container.

The first formatted line of an element may occur inside a block-level descendant in the same flow (i.e., a block-level descendant that is not out-of-flow due to floating or positioning). For example, the first line of the DIV in <DIV><P>This line...</P></DIV> is the first line of the P (assuming that both P and DIV are block-level).
  
  ::first-line 描述的是第一格式化行， 且要求同继承元素处于同一个流中，浮动会使元素的流产生变化，因此不能设置float属性