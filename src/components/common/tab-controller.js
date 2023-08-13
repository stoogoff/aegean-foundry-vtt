
const tabs = []

export const register = callback => {
	tabs.push(callback)
}

export const activate = active => {
	tabs.forEach(tab => tab(active))
}
