
export const isEquipment = type => type === 'weapon' || type === 'equipment' || type === 'armour'

export const parseObject = (input, scope, debug = false) => {
    const parts = input.trim().split(/\./g)
    let buffer = scope

    for (let i = 0, ilen = parts.length; i < ilen; ++i) {
        if (parts[i] === 'this') continue

        buffer = buffer[parts[i]]

        if (buffer === undefined) break
    }

    if (buffer === undefined && debug)
        throw new Error(`${ input } not found in scope`, scope)

    if (buffer === undefined)
        buffer = ''

    return buffer
}
