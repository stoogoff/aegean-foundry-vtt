
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compilePack } from '@foundryvtt/foundryvtt-cli'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


async function run() {
	const source = join(__dirname, '../assets/data/packs/properties')
	const dest = join(__dirname, '../packs/properties')

	await compilePack(source, dest, { log: true })
}

// TODO add array of folders to read: ['properties', 'equipment'] etc
run()
