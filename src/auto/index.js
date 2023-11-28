const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
let browser

const delay = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds))

async function save (base64, url, count, timestamp) {
  fs.writeFileSync(
    `${path.join(__dirname, '../../archive')}/${
      new URL(`http://${url}`).hostname
    }-${count}.png`,
    base64.replace(/^data:image\/png;base64,/, ''),
    'base64'
  )
}

async function go (url) {
  const page = await browser.newPage()

  try {
    page.setDefaultNavigationTimeout(10000)
    const now = Date.now()
    let count = 0

    await page.exposeFunction('toDataURL', base64 => {
      console.log('◯‍ toDataURL()', base64.length)
      save(base64, url, count, now)
      count++
    })

    await page.evaluateOnNewDocument(() => {
      const o = HTMLCanvasElement.prototype.toDataURL
      HTMLCanvasElement.prototype.toDataURL = function () {
        const result = o.apply(this, arguments)
        toDataURL(result)
        return result
      }
    })

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
  const urls = fs
    .readFileSync(path.join(__dirname, './500.txt'), 'utf-8')
    .replace(/^[#;].*$/gm, '')
    .replace(/(\r?\n)(?:\r?\n)+/gm, '')
    .replace(/0.0.0.0 /gm, '')
    .split('\n')
  console.log(urls.length)

  /* const urls = [
    'http://addthis.com',
    'https://fingerprint.com',
    'http://tiktok.com'
  ] */

  browser = await puppeteer.launch({ headless: 'new' })
  let count = 0
  for (const url of urls) {
    console.log(count, url)
    await go(url)
    count++
  }
}

init()
