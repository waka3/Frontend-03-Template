学习笔记

### 学习过程相关想法和思考
- 视频小练习第一反应： 用indexOf方法查找字符串；
- 疑问：为什么老师的视频里用if else的逻辑去写, 请问if else的写法是在模拟类似indexOf之类的方法吗？
- 疑问: TrunkedBodyParser this.length *= 16处理的意义

> tips: 实际操作总是能通过犯错学到更多因为没有犯错而被忽略的东西

#### 小节
- [x] headers以一个空行为结束标志，kv格式
- [x] body也是kv结构，但是根据Content-Type不同会用不同的分隔符和不同的格式
- [x] 所有HTTP里的换行都是用 **\r\n** 两个字符组成的换行符
- [x] chunk body的responseText的结构：十六进制的数字(数字值为内容的length)占一行 + 内容 + 十六进制0和十进制的0, 0之后为body的结尾

#### send函数的编写
运行server后跑client.js报错：
1. server.js内 body.push(chunk.toString())造成报错, 报错提示要求是Array、Buffer 或者 Uint8Array其中一种，但是却因为toString()收到了一个字符串
```js
buffer.js:480
      throw new ERR_INVALID_ARG_TYPE(
      ^
TypeError [ERR_INVALID_ARG_TYPE]: The "list[0]" argument must be one of type Array, Buffer, or Uint8Array. Received type string
    at Function.concat (buffer.js:480:13)
    at IncomingMessage.request.on.on.on (C:\Users\a4209\WYJ Project\Frontend-03-Template\week02\server.js:11:19)
    at IncomingMessage.emit (events.js:203:15)
    at endReadableNT (_stream_readable.js:1145:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
```
2. client执行, 进入connection.on('data') 打印data.toString()get 400报错:
```js
  HTTP/1.1 400 Bad Request
  Connection: close
```
> toString(){}方法内对response的字符串转化格式出错造成。 (转化过程中出现了额外的字符，如空字符串等)
解决：
```js
// 直接用字符串拼接时, 编辑器的换行、空格都可能造成格式错误，因此要比较注意这个问题
// 所有HTTP里的换行都是用 **\r\n** 两个字符组成的换行符
// headers最后的第一个\r\n用户换行，由于headers是以一个空行为结束标志，所以第二次\r\n
toString() {
  const requestLine = `${this.method} ${this.path} HTTP/1.1\r\n`
  const headers = `${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n`
  return requestLine + headers + this.bodyText
}
```