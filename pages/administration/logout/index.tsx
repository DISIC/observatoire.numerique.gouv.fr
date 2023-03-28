import { fr } from '@codegouvfr/react-dsfr';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function Logout() {
	useEffect(() => {
		signOut({ callbackUrl: '/administration/login' });
	}, []);

	return (
		<div className={fr.cx('fr-container', 'fr-py-20v')}>Déconnexion...</div>
	);
}
