
export const sortByProperty = prop =>
	(a, b) => {
		a = a[prop]
		b = b[prop]

		return a == b ? 0 : (a < b ? -1 : 1)
	}

export const add = (a, b) => a + b

export const subtract = (a, b) => a - b

export const max = (a, b) => Math.max(a, b)
