import type { AppProps } from 'next/app';
import { createNextDsfrIntegrationApi } from '@codegouvfr/react-dsfr/next-pagesdir';
import Link from 'next/link';
import PublicLayout from '@/layouts/PublicLayout';
import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import '../utils/keyframes.css';
import Head from 'next/head';

// Only in TypeScript projects
declare module '@codegouvfr/react-dsfr/next-pagesdir' {
	interface RegisterLink {
		Link: typeof Link;
	}
}

const { augmentDocumentWithEmotionCache, withAppEmotionCache } =
	createEmotionSsrAdvancedApproach({ key: 'css' });

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
	defaultColorScheme: 'system',
	Link
});

export { dsfrDocumentApi, augmentDocumentWithEmotionCache };

function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	const getLayout = (children: ReactNode) => {
		if (router.pathname.startsWith('/administration/bo')) {
			return <DashboardLayout>{children}</DashboardLayout>;
		} else {
			return <PublicLayout>{children}</PublicLayout>;
		}
	};

	return (
		<SessionProvider session={pageProps.session}>
			<Head>
				<title>L&#39;Observatoire de la qualité des démarches en ligne</title>
				<meta
					name="description"
					content="Pour des services publics numériques de qualité"
				></meta>
				<meta
					property="og:url"
					content="https://observatoire.numericite.eu"
				></meta>
				<meta
					property="og:title"
					content="L’Observatoire de la qualité des démarches en ligne"
				></meta>
				<meta
					property="og:description"
					content="Suivi de la qualité des démarches en ligne pour des services publics numériques de qualité"
				></meta>
				<meta
					property="og:image"
					content="https://observatoire.numericite.eu/assets/observatoire.png"
				></meta>
			</Head>
			{getLayout(<Component {...pageProps} />)}
		</SessionProvider>
	);
}

export default withDsfr(withAppEmotionCache(App));
