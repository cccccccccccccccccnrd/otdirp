const mode = new URLSearchParams(window.location.search).get('mode')

console.log(mode)
if (mode) init()

async function f (url) {
  const response = await fetch(url)
  return await response.json()
}

async function init () {
  const m = await f(`/${mode}`)
  let count = 0

  setInterval(() => {
    i.src = `/${mode}/${m[count]}`

    switch (mode) {
      case 'archive':
        i.style.imageRendering = 'pixelated'
        break
      case 'context':
        if (m[count].split('.')[0].endsWith('-i')) {
          i.style.filter = 'invert(1)'
        } else {
          i.style.filter = ''
        }
        break
    }

    count === m.length - 1 ? (count = 0) : count++
    console.log(count, m[count])
  }, mode === 'archive' ? 15 * 1000 : 30 * 1000)
}
