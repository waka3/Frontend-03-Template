学习笔记

## 组件化的搭建

### 组件化基础
对象和组件区别：
1. 对象 (Object) - 普通对象
  - Properties: 属性
  - Methods：方法
  - Inherit：继承对象(原型继承关系)
2. 组件 (Component) - 复用性开发 UI强相关
  - Properties: 强调从属关系 / 特性
  - Methods 
  - Inherit 
  - Attribute: 强调描述性 / 属性
  - Config & State：组件的配置(针对一次性配置，多用于全局) & 组件状态
  - Event 
  - Lifecycle：创建 - ... - 销魂
  - Children：树形结果基础

  ![组件][/images/comp.jpg]

  > 左端：End User Input(终端用户输入) - 改变组件State - State 影响 Children
  > 右端：User's Markup Code(标记语言， 如 HTML) - 改变组件State
  > 右端：组件开发者 通过 JS Code Event 告诉 组件使用开发者
  > 右端：组件使用开发者 通过 JS Code Method、 Property 使用组件

#### Attribute vs Property
```HTML
<a href="//m.taobao.com" >taobao</a>
<script>
  const a = document.querySelector('a');
  console.log(a.href); // file://m.taobao.com/  获取的是resolve的结果
  console.log(a.getAttribute('href'));  // //m.taobao.com  get的就是set的内容
</script>
```
```HTML
<input value = "cute" /> 
<script> 
  let input = document.querySelector('input'); 
  // property没有设置， attribute 和 input.value 一致 
  console.log(input.getAttribute('value')); // cute
  console.log(input.value); // cute
  input.setAttribute('value', 'lucky');
  // 通过attribute设置了 value 属性, 则attribute变化, property变化
  console.log(input.getAttribute('value')); // lucky 
  console.log(input.value); // lucky
</script>
```
```HTML
<input value = "cute" /> 
<script> 
  let input = document.querySelector('input'); 
  // property没有设置， attribute 和 input.value 一致 
  console.log(input.getAttribute('value')); // cute
  console.log(input.value); // cute
  input.value = 'lucky'; 
  // 通过property设置了 value 属性, 则attribute不变, property变化, 元素上显示的实际的效果是property优先 input.value 
  console.log(input.getAttribute('value')); // cute 
  console.log(input.value); // lucky
</script>
```
> 防坑指南：
> 在表单空间上，用户的交互和元素的显示效果是以 property优先 即 input.value 通过 getAttribute 的值不一定是展示的值;
> 如 input.value radio.checked等 
>>(曾经踩坑，知道原因，但不知道原理) - 可测试看页面的效果 和 控制台dom 的变化
>>因此在表单 控件值获取时推荐使用 property 方式读取， 以 getAttribute 属性值的方式读取，可能出现偏差;

#### 组件状态设计
| Markup set (标签设置) |  JS Code set (JS设置) | JS Change (JS改变) | User Input Change (用户输入改变) |  |
| :- | :- | :- | :- | :- |
| ❌ | ✔️ | ✔️ | ❓  | property |
| ✔️ | ✔️ | ✔️ | ❓  | attribute |
| ❌ | ❌ | ❌ | ✔️ | state |
| ❌ | ✔️ | ❌ | ❌ | config |

#### 生命周期
- 组件创建(created)
- 过程 (反复发生)
  - 挂载在组件树 (mounted) - 从组件树移除 (unMounted) 
  - 代码修改/设置 (JS Change/Set) - 重新渲染/更新 (render/update)
  - 终端用户输入(User Input) - 重新渲染/更新 (render/update)
- 组件销毁(destoryed)

#### Children
- 内容型 Children 展示即内容
- 模板型 Children 展示结构, 展示的数目不一定，根据情况决定
