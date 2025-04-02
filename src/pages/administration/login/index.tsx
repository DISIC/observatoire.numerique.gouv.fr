import { LoginForm } from '@/components/administration/LoginForm';
import { fr } from '@codegouvfr/react-dsfr';

export default function Login() {
	return (
		<div className={fr.cx('fr-container', 'fr-py-20v')}>
			<LoginForm />
		</div>
	);
}
