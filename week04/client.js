const net = require('net')
const parser = require('./parser')
// request 请求对象
class Request{
  constructor(options) {
    this.method = options.method || "GET"
    this.host = options.host
    this.port = options.port || "80"
    this.path = options.path || "/"
    this.body = options.body || {}
    this.headers = options.headers || {}
    if (!this.headers["Content-Type"]) { // Content-Type必填，无则提供一个默认值
      this.headers["Content-Type"] = "appliction/x-www-form-urlencoded"
    }
    if (this.headers["Content-Type"] === "applition/json") {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers["Content-Type"] === "appliction/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key=> `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }
    this.headers["Content-Length"] = this.bodyText.length // 长度不正确无法正确解析文本
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }
      connection.on('data', (data) => {
        // console.log(data.toString())
        parser.receive(data.toString())
        if (parser.isFinished) {
          resolve(parser.response)
          connection.end()
        }
      })
      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
    })
  }

  toString() {
    const requestLine = `${this.method} ${this.path} HTTP/1.1\r\n`
    const headers = `${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n`
    return requestLine + headers + this.bodyText
  }
}

// response 解析
class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0 // request line \r
    this.WAITING_STATUS_LINE_END = 1 // request line \n
    this.WAITING_HEADER_NAME = 2 // headers key
    this.WAITING_HEADER_SPACE = 3 // headers :
    this.WAITING_HEADER_VALUE = 4 // headers value
    this.WAITING_HEADER_LINE_END = 5 // headers \r
    this.WAITING_HEADER_BLOCK_END = 6 // headers \n
    this.WAITING_BODY = 7 // body

    this.current = this.WAITING_STATUS_LINE // 当前解析的状态位置
    this.statusLine = "" // 请求行
    this.headers = {} // headers头
    this.headerName = "" // 临时存储key
    this.headerValue = "" // 临时存储value
    this.bodyParser = null // body解析
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }
  
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
    
  receive(string) {
    for(let i = 0, len=string.length; i<len; i++) {
      this.receiveChar(string.charAt(i))
    }
  }
  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else {
        this.statusLine += char
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE
      } else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
        if (this.headers['Transfer-Encoding'] === 'chunked') { // node 默认的值格式 chunked
          this.bodyParser = new TrunkedBodyParser()
        }
      } else {
        this.headerName += char
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.headerValue += char
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      } 
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
       this.current = this.WAITING_BODY
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
    }
  }
}

// response chunk body解析
class TrunkedBodyParser{
  // chunk body 十六进制表达方式
  // 开头是
  // 结尾是
  // 内容字符串
  constructor() {
    this.WAITING_LENGTH = 0 // 内容的总长度
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_TRUNK = 2 // 内容
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4

    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }

  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true
        }
        this.current = this.WAITING_LENGTH_LINE_END
      } else {
        this.length *= 16
        this.length += parseInt(char, 16) // 使用parseInt转为十六进制格式
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK
      }
    } else if (this.current === this.READING_TRUNK) {
      this.content.push(char)
      this.length--
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    } else if (this.current === this.WAITING_NEW_LINE) { 
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH
      }
    }
  }
}

// http请求
void async function () {
  let request = new Request({
    method: "POST",  // http协议要求
    host: "127.0.0.1", // ip/tcp层要求
    port: "8090", // ip/tcp层要求
    path: "/", // http协议要求
    headers: {
      ["X-Foo2"]: "customed"
    },
    body: {
      name: "wyj"
    }
  })
  try {
    let response = await request.send()
    let dom = parser.parseHTML(response.body)
    console.log(JSON.stringify(dom, null, "  "))
  } catch (err) {
    console.log(err)
  }
}();