
export const sortByProperty = prop =>
	(a, b) => {
		a = a[prop]
		b = b[prop]

		return a == b ? 0 : (a < b ? -1 : 1)
	}

export const sum = (a, b) => a + b
