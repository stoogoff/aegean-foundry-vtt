
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compilePack } from '@foundryvtt/foundryvtt-cli'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


async function run(targets) {
	await Promise.all(targets.map(async target => {
		console.log(`Packing: ${target}`)
		const source = join(__dirname, `../assets/data/packs/${target}`)
		const dest = join(__dirname, `../packs/${target}`)

		return await compilePack(source, dest, { log: true })
	}))
}

run(['properties'])
