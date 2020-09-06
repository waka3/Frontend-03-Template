学习笔记

## 盒(Box)
    css选择器选中元素时会生成的一个/多个盒(元素: 盒 = 1:1/1:N)
1. 盒模型：排版占据的尺寸(box-sizing)

> 排版： 只要是排盒子和文字
## 正常流
1. 收集盒、文字进行
2. 计算盒、文字在行的排布 
3. 计算行的排布
> 行盒水平排列，IFC(行内级格式化上下文)

> 块盒垂直排列，BFC(块级格式化上下文)

### 正常流行级排布
- Baseline 基线
- text-top
- text-bottom 中文对其线
- line-top
- line-bottom

>  inline-block 默认基线对齐，建议用vertical-align去修改对齐方式

> 行盒内没有文字时，行盒默认与baseline基线对齐，但是行盒内存在文字，则默认行盒内的最后一行文字与基线对齐. 

> 行盒的高度会影响到line-top和line-bottom的位置

### 正常流块级排布
- float与clear 脱离正常流，但是依附于正常流的排布方式
- float后的<br /> 无效
- BFC 垂直排列： 
    - margin ccollapse现象
    - 
### BFC合并 (Block Formatting Context)

#### Block 
  > display: 定义建立布局时元素生成的盒类型

1. Block Container: 里面有BFC的盒 
  - 能容纳正常流的盒，里面就有BRF, (基本上为display的效果)如： 
    - block
    - inline-block
    - table-cell
    - flex item
    - grid cell
    - table-caption
2. Block-level Box：外面有BFC的盒
  - 能放进正常流的盒
3. Block Box = Block Container + Block-level Box
  - 里外都有BFC
