// ./src/app/(payload)/admin/login/page.tsx
'use client';

import { login } from '@/app/(payload)/admin/actions/login';
import { useActionState, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import * as OTPAuth from 'otpauth';
import encodeQR from '@paulmillr/qr';

export default function LoginPage() {
	const [state, formAction] = useActionState(login, {
		success: false,
		error: true
	});

	const [email, setEmail] = useState('');
	const [qrCodeSvg, setQrCodeSvg] = useState<string>();
	const [totpSecret, setTotpSecret] = useState<string>();

	useEffect(() => {
		let totp = new OTPAuth.TOTP({
			issuer: 'Observatoire',
			label: email,
			algorithm: 'SHA1',
			digits: 6,
			period: 30
		});
		setTotpSecret(totp.secret.base32);
		setQrCodeSvg(encodeQR(totp.toString(), 'svg'));
	}, [email]);

	useEffect(() => {
		if (state.success) redirect('/admin');
	}, [state.success]);

	return (
		<section className="login template-minimal template-minimal--width-normal">
			<div className="template-minimal__wrap">
				<form className="login__form form" action={formAction} method="post">
					<div className="login__form__inputWrap">
						<div className="field-type email" style={{ flex: '1 1 auto' }}>
							<label className="field-label " htmlFor="field-email">
								Email<span className="required">*</span>
							</label>
							<div className="field-type__wrap">
								<input
									autoComplete="email"
									id="field-email"
									required
									type="email"
									onChange={e => setEmail(e.target.value)}
									value={email}
									name="email"
								/>
							</div>
						</div>
						<div className="field-type password" style={{ flex: '1 1 auto' }}>
							<label className="field-label " htmlFor="field-password">
								Password<span className="required">*</span>
							</label>
							<div className="field-type__wrap">
								<div>
									<input
										aria-label="Password"
										autoComplete="off"
										data-rtl="false"
										id="field-password"
										type="password"
										name="password"
									/>
								</div>
							</div>
						</div>
						<div className="field-type email" style={{ flex: '1 1 auto' }}>
							<label className="field-label" htmlFor="field-password">
								TOTP <span className="required">*</span>
							</label>
							<div className="field-type__wrap">
								<div>
									<input
										aria-label="TOTP"
										autoComplete="off"
										data-rtl="false"
										id="field-totp"
										type="number"
										name="totp"
									/>
									<input type="hidden" name="totpSecret" value={totpSecret} />
								</div>
							</div>
						</div>
						{qrCodeSvg && (
							<div className="field-type text" style={{ flex: '1 1 auto' }}>
								<label className="field-label" htmlFor="field-password">
									QR Code
								</label>
								<div
									style={{
										backgroundColor: 'white',
										width: '100px',
										height: '100px',
										padding: '4px'
									}}
									dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
								/>
							</div>
						)}
					</div>

					<a href="/admin/forgot">Forgot password?</a>
					<div className="form-submit">
						<button
							type="submit"
							className="btn btn--icon-style-without-border btn--size-large btn--withoutPopup btn--style-primary btn--withoutPopup"
						>
							<span className="btn__content">
								<span className="btn__label">Login</span>
							</span>
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
