  
const http = require('http')

http.createServer((request, response) => {
  let body = []
  request.on('error', (err) => {
    console.log(err)
  }).on('data', (chunk) => {
    body.push(chunk) // chunk is Buffer
    // body.push(Buffer.from(chunk));
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    console.log('body: ', body)
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end('Hello World Hello World  Hello World  Hello World  Hello World')
  })
}).listen(8088)

console.log('Server started')