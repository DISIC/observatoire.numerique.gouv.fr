import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export function LoginForm() {
	const router = useRouter();
	const { classes, cx } = useStyles();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [errorStatus, setErrorStatus] = useState<number | null>(null);

	const storeUserCookie = async (token?: string, exp?: number) => {
		await fetch(`/api/auth/setCookie?token=${token}&exp=${exp}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		router.push('/administration/bo/airtable');
	};

	const { mutate: login } = trpc.admins.login.useMutation({
		onSuccess: ({ data }) => {
			storeUserCookie(data.token, data.exp);
		},
		onError: e => {
			setErrorStatus(e.data?.httpStatus || null);
		}
	});

	const submitForm = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		login({
			email,
			password
		});
	};

	useEffect(() => {
		setErrorStatus(null);
	}, [email, password]);

	const displayError = !!errorStatus;
	const errorMessage =
		errorStatus === 401 ? 'Identifiants incorrects' : 'Erreur coté serveur';

	return (
		<div className={cx(fr.cx(), classes.root)}>
			<h1>Connexion</h1>
			<form onSubmit={submitForm}>
				<Input
					label="Email"
					state={displayError ? 'error' : 'default'}
					stateRelatedMessage={errorMessage}
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
					stateRelatedMessage={errorMessage}
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
