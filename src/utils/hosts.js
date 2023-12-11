const fs = require('fs')
const path = require('path')

function chunk (arr, size) {
  return arr.reduce(
    (carry, _, index, orig) =>
      !(index % size) ? carry.concat([orig.slice(index, index + size)]) : carry,
    []
  )
}

function split (file, amount) {
  const f = fs.readFileSync(path.join(__dirname, file), 'utf8')
  const cs = chunk(f.split('\n'), 1000)
  cs.forEach((c, i) => {
    fs.writeFileSync(path.join(__dirname, `hosts/${i}.txt`), c.join('\n'))
  })
}

split('mio.txt', 1000)
