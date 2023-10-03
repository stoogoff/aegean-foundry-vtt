
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { compilePack } from '@foundryvtt/foundryvtt-cli'

async function run() {
	const source = path.join(__dirname, '../assets/data/packs/properties')
	const dest = path.join(__dirname, '../packs/properties')

	console.log(source)
	//await compilePack(source, dest)
	console.log('Complete?')
}

run()


/*const fs = require('fs')
const path = require('path')

const READ_DIR = path.join(__dirname, 'assets/data/packs')
const WRITE_DIR = path.join(__dirname, 'packs')

const packDirs = fs.readdirSync(READ_DIR)

packDirs.forEach(dir => {
	const files = fs.readdirSync(path.join(READ_DIR, dir))
	const output = []

	console.log(`Reading... ${dir}`)

	files.forEach(file => {
		console.log(`  - Processing ${file}`)

		const content = fs.readFileSync(path.join(READ_DIR, dir, file), 'utf8')

		output.push(JSON.stringify(JSON.parse(content)))		
	})

	const newFile = path.join(WRITE_DIR, dir + '.db').replace(/\s/g, '\ ')

	if(fs.existsSync(newFile)) {
		console.log(`${newFile} exists, deleting`)
		fs.unlinkSync(newFile)
	}

	console.log(`Writing... ${newFile}`)

	setTimeout(() => fs.writeFileSync(newFile, output.join('\n'), { encoding: 'utf8', flag: 'w' }), 1000)
})
*/

