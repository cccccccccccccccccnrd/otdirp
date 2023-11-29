const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
let browser

const delay = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds))

async function archive (base64, c) {
  const n = `${path.join(__dirname, '../../archive')}/${
    new URL(`http://${c.url}`).hostname
  }-${c.count}`
  fs.writeFileSync(
    `${n}.png`,
    base64.replace(/^data:image\/png;base64,/, ''),
    'base64'
  )
  fs.writeFileSync(`${n}.json`, JSON.stringify(c, null, 2), 'utf-8')
}

async function go (url) {
  const page = await browser.newPage()

  try {
    page.setDefaultNavigationTimeout(10000)

    const c = {
      url,
      now: Date.now(),
      count: 0,
      calls: []
    }

    await page.exposeFunction('d1ff3r3nc3', (f, as, r) => {
      console.log(`◯‍ ${f}()`, Object.values(as))
      switch (f) {
        case 'toDataURL':
          archive(r, c)
          c.calls = []
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

    await page.goto(`http://${url}`, { waitUntil: 'networkidle2' })
    await delay(2000)

    return true
  } catch (error) {
    console.log(error)
  } finally {
    await page.close()
  }
}

async function init () {
  /* const urls = fs
    .readFileSync(path.join(__dirname, './500.txt'), 'utf-8')
    .replace(/^[#;].*$/gm, '')
    .replace(/(\r?\n)(?:\r?\n)+/gm, '')
    .replace(/0.0.0.0 /gm, '')
    .split('\n')
  console.log(urls.length) */

  const urls = ['mediafire.com', 'fingerprint.com', 'tiktok.com']

  browser = await puppeteer.launch({ headless: 'new' })
  let count = 0
  for (const url of urls) {
    console.log(count, url)
    await go(url)
    count++
  }

  await browser.close()
  process.exit()
}

init()
