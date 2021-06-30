var fs = require("fs")
var watchify = require('watchify')
var browserify = require("browserify")
var express = require('express')

const dist = "dist/bundle-all.js"

const b = browserify({
  entries: ["./index.js"],
  cache: {},
  packageCache: {},
  plugin: [watchify]
})

b.on('update', () => b.bundle().pipe(fs.createWriteStream(dist)))
b.transform("babelify", {presets: ["@babel/preset-env", "@babel/preset-react"]})
b.bundle().pipe(fs.createWriteStream(dist))

var app = express()
var expressWs = require('express-ws')(app)
app.ws('/', (ws, _) => {
  ws.onmessage = (msg) => {
    expressWs.getWss().clients.forEach(client => {
      client.send(msg.data)
    })
  }
  ws.onclose = () => {
    expressWs.getWss().clients.forEach(client => {
      client.send(JSON.stringify({action: 'someone-quit'}))
    })
  }
})
app.use('/', express.static('static'))
app.use('/dist', express.static('dist'))
app.listen(3000)
console.log('The development can be visited at: http://localhost:3000')
