// Given a cookie key `name`, returns the value of
// the cookie or `null`, if the key is not found.
export function getCookie(name: string): string | null {
	const nameLenPlus = name.length + 1;
	return (
		document.cookie
			.split(';')
			.map(c => c.trim())
			.filter(cookie => {
				return cookie.substring(0, nameLenPlus) === `${name}=`;
			})
			.map(cookie => {
				return decodeURIComponent(cookie.substring(nameLenPlus));
			})[0] || null
	);
}
