// Usage: node scripts/shot.cjs <route> <out.png> [baseUrl]
// Renders a route at the Figma frame size (1440x1024) for visual comparison.
const { chromium } = require('playwright')
;(async () => {
  const [route = '/', out = 'shot.png', base = 'http://localhost:4173'] = process.argv.slice(2)
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(base + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await page.screenshot({ path: out, fullPage: true })
  if (errors.length) console.log('ERRORS:\n' + errors.join('\n'))
  await browser.close()
})()
