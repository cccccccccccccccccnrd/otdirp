const scrolls = document.querySelectorAll('.s')

o.addEventListener('wheel', (event) => {
  event.preventDefault()
  scrolls.forEach((s) => s.scrollTop += event.deltaY)
})

async function f (url) {
  const response = await fetch(url)
  return await response.json()
}

async function archive () {
  const r = await f('/archive')
  console.log(r)
  let count = 0
  setInterval(() => {
    c.src = `/archive/${r[count]}`
    console.log(count)
    if (count === r.length) count = 0
    count++
  }, 2000)
}

async function context () {
  const r = await f('/context')
  console.log(r)
  r.map((w) => {
    console.log(w)
    const img = document.createElement('img')
    img.src = `/context/${w}`
    if (w.split('.')[0].endsWith('-i')) {
      img.style.filter = 'invert(1)'
    }
    m.appendChild(img)
  })
}

context()
archive()

console.log(`%cOn the Difference in Rendering Pixels (2022)`, 'padding: 0.5em; color: white; font-size: 2em;')
