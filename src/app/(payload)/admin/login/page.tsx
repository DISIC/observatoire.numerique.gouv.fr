'use client';

import { checkOTP, login } from '@/app/(payload)/admin/actions/login';
import encodeQR from '@paulmillr/qr';
import { redirect } from 'next/navigation';
import * as OTPAuth from 'otpauth';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface CredentialsData {
	email: string;
	password: string;
}

interface LoginFormProps {
	formActionCredentials: (formData: FormData) => void;
	credentialsData: CredentialsData;
	setCredentialsData: (data: CredentialsData) => void;
}

interface OTPFormProps {
	formActionLogin: (formData: FormData) => void;
	email: string;
	password: string;
	totpSecret: string;
	isOTPDefined: boolean;
	goBack: () => void;
	qrCodeSvg: string;
}

const LoginForm = ({
	formActionCredentials,
	credentialsData,
	setCredentialsData
}: LoginFormProps) => (
	<form className="login__form form" action={formActionCredentials}>
		<div className="login__form__inputWrap">
			<div className="field-type email" style={{ flex: '1 1 auto' }}>
				<label className="field-label" htmlFor="field-email">
					Email<span className="required">*</span>
				</label>
				<div className="field-type__wrap">
					<input
						autoComplete="email"
						id="field-email"
						required
						type="email"
						name="email"
						onChange={e =>
							setCredentialsData({
								...credentialsData,
								email: e.target.value
							})
						}
						defaultValue={credentialsData.email}
					/>
				</div>
			</div>
			<div className="field-type password" style={{ flex: '1 1 auto' }}>
				<label className="field-label" htmlFor="field-password">
					Mot de passe<span className="required">*</span>
				</label>
				<div className="field-type__wrap">
					<input
						aria-label="Password"
						autoComplete="off"
						id="field-password"
						type="password"
						name="password"
						onChange={e =>
							setCredentialsData({
								...credentialsData,
								password: e.target.value
							})
						}
						defaultValue={credentialsData.password}
						required
					/>
				</div>
			</div>
		</div>

		<a href="/admin/forgot" className="mt-4 block">
			Mot de passe oublié?
		</a>
		<div className="form-submit mt-6">
			<button
				type="submit"
				className="btn btn--style-primary btn--size-large w-full"
			>
				<span className="btn__content">
					<span className="btn__label">Continuer</span>
				</span>
			</button>
		</div>
	</form>
);

const OTPForm = ({
	formActionLogin,
	email,
	password,
	totpSecret,
	isOTPDefined,
	goBack,
	qrCodeSvg
}: OTPFormProps) => (
	<form className="login__form form" action={formActionLogin}>
		<input type="hidden" name="email" value={email} />
		<input type="hidden" name="password" value={password} />
		<div className="login__form__inputWrap">
			<button onClick={goBack} type="button">
				Retour
			</button>
			{!isOTPDefined && qrCodeSvg && (
				<div className="field-type text mt-4" style={{ flex: '1 1 auto' }}>
					<label className="field-label" style={{ textAlign: 'center' }}>
						Première connexion, veuillez scanner le QR (par exemple via
						l'application Google Authenticator)
					</label>
					<div
						style={{
							backgroundColor: 'white',
							width: '200px',
							height: '200px',
							padding: '8px',
							margin: '16px auto'
						}}
						dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
					/>
					<p
						className="text-sm text-gray-600"
						style={{ textAlign: 'center', marginBottom: 20 }}
					>
						Une fois le QR code scanné, entrez le code temporaire affiché sur
						l'application
					</p>
				</div>
			)}
			<div className="field-type number" style={{ flex: '1 1 auto' }}>
				<label className="field-label" htmlFor="field-totp">
					Entrez le code temporaire<span className="required">*</span>
				</label>
				<div className="field-type__wrap">
					<input
						aria-label="TOTP"
						autoComplete="off"
						id="field-totp"
						type="number"
						name="totp"
						required
					/>
					<input type="hidden" name="totpSecret" value={totpSecret} />
				</div>
			</div>
		</div>

		<div className="form-submit mt-6">
			<button
				type="submit"
				className="btn btn--style-primary btn--size-large w-full"
			>
				<span className="btn__content">
					<span className="btn__label">Se connecter</span>
				</span>
			</button>
		</div>
	</form>
);

const LoginPage = () => {
	const [stateLogin, formActionLogin, isLoading] = useActionState(login, {
		success: false,
		error: false
	});

	const [stateCredentials, formActionCredentials] = useActionState(checkOTP, {
		success: false,
		error: false,
		hasOTP: false,
		message: ''
	});

	const [credentialsData, setCredentialsData] = useState<CredentialsData>({
		email: '',
		password: ''
	});

	const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
	const [totpSecret, setTotpSecret] = useState<string>('');
	const [showOTP, setShowOTP] = useState<boolean>(false);
	const [isOTPDefined, setIsOTPDefined] = useState<boolean>(false);

	useEffect(() => {
		if (stateLogin.success) {
			redirect('/admin');
		} else if (stateLogin.error) {
			toast.error(process.env.NODE_ENV === 'development' ? 'Identifiants invalides' : 'Mot de passe ou code temporaire invalide');
			setShowOTP(false);
		}
	}, [stateLogin]);

	useEffect(() => {
		if (stateCredentials.success) {
			if (process.env.NODE_ENV === 'development') {
				startTransition(() => {
					const formData = new FormData();
					formData.append('email', credentialsData.email);
					formData.append('password', credentialsData.password);
					formActionLogin(formData);
				});
			} else {
				setIsOTPDefined(!!stateCredentials.hasOTP);
				setShowOTP(true);
			}
		} else if (stateLogin.error) {
			toast.error(stateCredentials.message);
		}
	}, [stateCredentials, formActionLogin]);

	useEffect(() => {
		if (showOTP && !isOTPDefined) {
			const totp = new OTPAuth.TOTP({
				issuer: 'Vos démarches essentielles',
				label: credentialsData.email,
				algorithm: 'SHA1',
				digits: 6,
				period: 30
			});
			setTotpSecret(totp.secret.base32);
			setQrCodeSvg(encodeQR(totp.toString(), 'svg'));
		}
	}, [credentialsData.email, showOTP, isOTPDefined]);

	return (
		<section className="login template-minimal template-minimal--width-normal">
			<div className="template-minimal__wrap">
				<img
					src="/assets/marianne.png"
					alt="Marianne logo"
					style={{
						width: 300,
						margin: 'auto',
						marginBottom: 50
					}}
				/>
				{isLoading ? (
					<div style={{ textAlign: 'center', marginTop: 100 }}>
						Chargement...
					</div>
				) : !showOTP ? (
					<LoginForm
						formActionCredentials={formActionCredentials}
						credentialsData={credentialsData}
						setCredentialsData={setCredentialsData}
					/>
				) : (
					<OTPForm
						formActionLogin={formActionLogin}
						email={credentialsData.email}
						password={credentialsData.password}
						totpSecret={totpSecret}
						isOTPDefined={isOTPDefined}
						goBack={() => {
							setShowOTP(false);
						}}
						qrCodeSvg={qrCodeSvg}
					/>
				)}
			</div>
			<Toaster />
		</section>
	);
};

export default LoginPage;
