import { useEffect, useState } from 'react';

export function useWindowResize() {
	const [, setWindowSize] = useState(window.innerWidth * window.innerHeight);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize(window.innerWidth * window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return null;
}
