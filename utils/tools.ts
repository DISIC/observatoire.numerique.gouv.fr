export const getDisplayedVolume = (volume: number): string => {
	if (volume >= 1000000) {
		const millions = Math.floor(volume / 1000000);
		const remainder = volume % 1000000;
		if (remainder === 0) {
			return `${millions} million${millions > 1 ? 's' : ''}`;
		} else {
			const thousands = Math.round(remainder / 100000);
			const units = remainder % 1000;
			if (thousands === 0) {
				return `${millions}.${Math.floor(units / 100)} million${millions > 1 ? 's' : ''
					}`;
			} else {
				return `${millions}.${thousands} million${millions > 1 ? 's' : ''}`;
			}
		}
	} else {
		const numString = volume.toString();
		const parts = [];
		for (let i = numString.length - 1; i >= 0; i -= 3) {
			const chunk = numString.slice(Math.max(i - 2, 0), i + 1);
			parts.unshift(chunk);
		}
		return parts.join(' ');
	}
};


export function getNbPages(count: number, numberPerPage: number) {
	return count % numberPerPage === 0
		? count / numberPerPage
		: Math.trunc(count / numberPerPage) + 1;
}

export function formatDateToFrenchString(tmpDate: string) {
	const date = new Date(tmpDate);

	if (!(date instanceof Date)) {
		throw new Error('Input is not a valid Date object');
	}

	const formatter = new Intl.DateTimeFormat('fr-FR', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});

	return formatter.format(date);
}