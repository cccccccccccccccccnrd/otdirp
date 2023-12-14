const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const state = {
  browser: null,
  list: null,
  now: Date.now()
}

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function archive (base64, c) {
  const f = path.join(__dirname, `../../archive/${state.list}`)
  if (!fs.existsSync(f)) fs.mkdirSync(f)

  const p = `${f}/${new URL(`https://${c.url}`).hostname}-${c.count}`
  fs.writeFileSync(
    `${p}.png`,
    base64.replace(/^data:image\/png;base64,/, ''),
    'base64'
  )
  fs.writeFileSync(`${p}.json`, JSON.stringify(c, null, 2), 'utf-8')
}

async function go (url) {
  const page = await state.browser.newPage()

  try {
    page.setDefaultNavigationTimeout(30000)

    const c = {
      url,
      now: Date.now(),
      count: 0,
      calls: [],
      stack: []
    }

    await page.exposeFunction('d1ff3r3nc3', (f, as, r, s) => {
      console.log(`◯‍ ${f}()`, Object.values(as))

      switch (f) {
        case 'toDataURL':
          c.stack = s
          archive(r, c)
          c.calls = []
          c.stack = []
          c.count++
          break
        default:
          c.calls.push({
            function: f,
            arguments: Object.values(as)
          })
      }
    })

    const inj = fs.readFileSync(path.join(__dirname, './inj.js'), 'utf8')
    await page.evaluateOnNewDocument(inj)

    await page.goto(`https://${url}`, { waitUntil: 'networkidle2' })
    await delay(1000)

    return true
  } catch (error) {
    console.log(error.message)
  } finally {
    await page.close()
  }
}

async function browse () {
  const urls = fs
    .readFileSync(
      path.join(__dirname, `../utils/hosts/${state.list}.txt`),
      'utf-8'
    )
    .split('\n')
    .slice(0, 500)

  console.log(urls.length)

  state.browser = await puppeteer.launch({ headless: 'new' })
  let count = 0
  for (const url of urls) {
    console.log(((Date.now() - state.now) / 1000 / 60).toFixed(2), count, url)
    await go(url)
    count++
  }

  await state.browser.close()
  process.exit()
}

async function init () {
  state.list = '18'
  browse()
}

init()
