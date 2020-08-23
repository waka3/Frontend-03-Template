const http = require('http')

http.createServer((request, response) => {
  let body = []
  request.on('error', (err) => {
    console.log(err)
  }).on('data', (chunk) => {
    body.push(chunk) // chunk is Buffer
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    console.log('body: ', body)
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end(
      `<html lang="en">
        <head>
          <title>Document</title>
          <style>
            body, div{
              width: 100px;
              background: #eee;
            }
            body div.part{
              background: red;
            }
            body div #test{
              height: 100px;
            }
            body div span{
              display: block;
              width: 100px;
            }
          </style>
        </head>
        <body>
          <div class="part">
            <span id="test">mutilple</span>
          </div>
          <div>testContent</div>
        </body>
      </html>`
      )
  })
}).listen(8090)

console.log('Server started')