import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgBuffer = readFileSync(join(__dirname, '../public/favicon.svg'))
const out = (name) => join(__dirname, '../public', name)

for (const [name, size] of [
  ['pwa-192.png', 192],
  ['pwa-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(svgBuffer).resize(size, size).png().toFile(out(name))
  console.log(`✓ ${name}`)
}

// Maskable: icon at 80% centred on --bg (#131f24) background
const bg = await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: { r: 19, g: 31, b: 36, alpha: 1 },
  },
})
  .png()
  .toBuffer()

const icon = await sharp(svgBuffer).resize(410, 410).png().toBuffer()

await sharp(bg)
  .composite([{ input: icon, gravity: 'centre' }])
  .toFile(out('pwa-maskable-512.png'))
console.log('✓ pwa-maskable-512.png')
