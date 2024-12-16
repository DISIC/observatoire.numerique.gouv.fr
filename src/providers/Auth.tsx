import { PayloadAdmin } from '@/payload/payload-types';
import { jwtDecode } from 'jwt-decode';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContext = {
	user: PayloadAdmin | null;
	setUser: (user: PayloadAdmin | null) => void;
	logout: () => void;
	refetchUser: () => Promise<void>;
};

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [user, setUser] = useState<PayloadAdmin | null>(null);

	const router = useRouter();

	const getTokenInfos = async () => {
		const jwtToken = await getCookie(
			process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? 'obs-jwt'
		);
		if (!jwtToken)
			return {
				jwtToken: null,
				slug: null
			};

		const decoded = jwtDecode(jwtToken);
		const slug = (decoded as any)['collection'] as string;

		return {
			jwtToken,
			slug
		};
	};

	const logout = async () => {
		await fetch(`/api/auth/removeCookie`, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(() => {
			setUser(null);
		});
	};

	const fetchMe = async () => {
		try {
			const result = await fetch(`/api/payload-admins/me`).then(req =>
				req.json()
			);

			if (result && result.user !== null) {
				setUser(result.user);
			} else {
				setUser(null);
			}
		} catch (e) {
			console.log('error : ', e);
		}
	};

	useEffect(() => {
		fetchMe();
	}, []);

	return (
		<Context.Provider
			value={{
				user,
				setUser,
				logout,
				refetchUser: fetchMe
			}}
		>
			{children}
		</Context.Provider>
	);
};

type UseAuth = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
