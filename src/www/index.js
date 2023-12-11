const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express()

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/context', (req, res) => {
  const files = fs
    .readdirSync(path.join(__dirname, 'public/context'))
    .filter(e => e.includes('.'))
  res.send(files)
})

app.get('/archive', (req, res) => {
  const files = fs
    .readdirSync(path.join(__dirname, 'public/archive'))
    .filter(e => e.includes('.'))
  res.send(files)
})

app.listen(2777)
console.log(
  'On the Difference in Rendering Pixels listening on http://localhost:2777'
)
