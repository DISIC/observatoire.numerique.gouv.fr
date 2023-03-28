import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

type Props = {
	error?: string;
};

export function LoginForm(props: Props) {
	const { error } = props;
	const { classes, cx } = useStyles();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const submitForm = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const result = await signIn('credentials', { email, password });
		console.log(result);
	};

	const displayError =
		error && error === 'CredentialsSignin' && password === '' && email === '';

	return (
		<div className={cx(fr.cx(), classes.root)}>
			<h1>Connexion</h1>
			<form onSubmit={submitForm}>
				<Input
					label="Email"
					state={displayError ? 'error' : 'default'}
					stateRelatedMessage="Identifiants incorrects"
					nativeInputProps={{
						name: 'email',
						onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
							setEmail(e.target.value);
						}
					}}
				/>
				<Input
					label="Mot de passe"
					state={displayError ? 'error' : 'default'}
					stateRelatedMessage="Identifiants incorrects"
					nativeInputProps={{
						name: 'password',
						type: 'password',
						onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
							setPassword(e.target.value);
						}
					}}
				/>
				<Button type="submit">Se connecter</Button>
			</form>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		width: '36em',
		margin: 'auto',
		[fr.breakpoints.down('sm')]: {
			width: '100%'
		}
	}
}));
