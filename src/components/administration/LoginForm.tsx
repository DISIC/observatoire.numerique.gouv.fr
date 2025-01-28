'use client';

import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { tss } from 'tss-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState, memo } from 'react';
import * as OTPAuth from 'otpauth';
import encodeQR from '@paulmillr/qr';

const LoginCredentials = memo(
	({
		email,
		password,
		displayError,
		errorMessage,
		onEmailChange,
		onPasswordChange,
		onSubmit
	}: {
		email: string;
		password: string;
		displayError: boolean;
		errorMessage: string;
		onEmailChange: (value: string) => void;
		onPasswordChange: (value: string) => void;
		onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	}) => (
		<form onSubmit={onSubmit}>
			<Input
				label="Email"
				nativeInputProps={{
					name: 'email',
					value: email,
					onChange: e => onEmailChange(e.target.value)
				}}
			/>
			<Input
				label="Mot de passe"
				state={displayError ? 'error' : 'default'}
				stateRelatedMessage={errorMessage}
				nativeInputProps={{
					name: 'password',
					type: 'password',
					value: password,
					onChange: e => onPasswordChange(e.target.value)
				}}
			/>
			<Button type="submit">Continuer</Button>
		</form>
	)
);

const OTPForm = memo(
	({
		otpCode,
		isOTPDefined,
		qrCodeSvg,
		displayError,
		errorMessage,
		onOTPChange,
		onSubmit
	}: {
		otpCode: string;
		isOTPDefined: boolean;
		qrCodeSvg: string;
		displayError: boolean;
		errorMessage: string;
		onOTPChange: (value: string) => void;
		onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	}) => (
		<form onSubmit={onSubmit}>
			{!isOTPDefined && qrCodeSvg && (
				<div className="fr-my-4">
					<p className="fr-text--sm fr-mb-2">
						Pour votre première connexion, scannez ce QR code avec votre
						application d'authentification puis entrez le code.
					</p>
					<div
						style={{
							backgroundColor: 'white',
							width: '200px',
							height: '200px',
							padding: '8px',
							marginBottom: '16px'
						}}
						dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
					/>
				</div>
			)}

			<Input
				label="Code d'authentification"
				state={displayError ? 'error' : 'default'}
				stateRelatedMessage={errorMessage}
				nativeInputProps={{
					name: 'otp',
					pattern: '[0-9]*',
					inputMode: 'numeric',
					value: otpCode,
					onChange: e => onOTPChange(e.target.value)
				}}
			/>

			<Button type="submit">Se connecter</Button>
		</form>
	)
);

LoginCredentials.displayName = 'LoginCredentials';
OTPForm.displayName = 'OTPForm';

export function LoginForm() {
	const router = useRouter();
	const { classes, cx } = useStyles();

	const [formState, setFormState] = useState({
		email: '',
		password: '',
		otpCode: ''
	});

	const [errorStatus, setErrorStatus] = useState<number | null>(null);
	const [showOTP, setShowOTP] = useState(false);
	const [isOTPDefined, setIsOTPDefined] = useState(false);
	const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
	const [totpSecret, setTotpSecret] = useState<string>('');

	const storeUserCookie = async (token?: string, exp?: number) => {
		await fetch(`/api/auth/setCookie?token=${token}&exp=${exp}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		router.push('/administration/bo/airtable');
	};

	const { mutate: verifyCredentials } =
		trpc.admins.verifyCredentials.useMutation({
			onSuccess: ({ hasOTP }) => {
				setIsOTPDefined(hasOTP);
				setShowOTP(true);

				if (!hasOTP) {
					const totp = new OTPAuth.TOTP({
						issuer: 'Vos démarches essentielles',
						label: formState.email,
						algorithm: 'SHA1',
						digits: 6,
						period: 30
					});
					setTotpSecret(totp.secret.base32);
					setQrCodeSvg(encodeQR(totp.toString(), 'svg'));
				}
			},
			onError: e => {
				setErrorStatus(e.data?.httpStatus || null);
			}
		});

	const { mutate: login } = trpc.admins.login.useMutation({
		onSuccess: ({ data }) => {
			storeUserCookie(data.token, data.exp);
		},
		onError: e => {
			setShowOTP(false);
			setErrorStatus(e.data?.httpStatus || null);
		}
	});

	const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		verifyCredentials({
			email: formState.email
		});
	};

	const handleOTPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login({
			email: formState.email,
			password: formState.password,
			totp: formState.otpCode,
			...(!isOTPDefined && totpSecret ? { totpSecret } : {})
		});
	};

	useEffect(() => {
		setErrorStatus(null);
	}, [formState]);

	useEffect(() => {
		if (showOTP) {
			setFormState(prev => ({
				...prev,
				otpCode: ''
			}));
		}
	}, [showOTP]);

	const displayError = !!errorStatus;
	const errorMessage =
		errorStatus === 401
			? 'Mot de passe ou code temporaire incorrect'
			: 'Erreur coté serveur';

	const handleInputChange =
		(field: keyof typeof formState) => (value: string) => {
			setFormState(prev => ({
				...prev,
				[field]: value
			}));
		};

	return (
		<div className={cx(fr.cx(), classes.root)}>
			<h1>Connexion</h1>
			{!showOTP ? (
				<LoginCredentials
					email={formState.email}
					password={formState.password}
					displayError={displayError}
					errorMessage={errorMessage}
					onEmailChange={handleInputChange('email')}
					onPasswordChange={handleInputChange('password')}
					onSubmit={handleInitialSubmit}
				/>
			) : (
				<OTPForm
					otpCode={formState.otpCode}
					isOTPDefined={isOTPDefined}
					qrCodeSvg={qrCodeSvg}
					displayError={displayError}
					errorMessage={errorMessage}
					onOTPChange={handleInputChange('otpCode')}
					onSubmit={handleOTPSubmit}
				/>
			)}
		</div>
	);
}

const useStyles = tss.withName(LoginForm.name).create(() => ({
	root: {
		width: '36em',
		margin: 'auto',
		[fr.breakpoints.down('sm')]: {
			width: '100%'
		}
	}
}));
