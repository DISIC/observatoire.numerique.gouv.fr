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
				return `${millions}.${Math.floor(units / 100)} million${
					millions > 1 ? 's' : ''
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
