import { ObservatoireHead } from '@/components/layout/ObservatoireHead';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import { createNextDsfrIntegrationApi } from '@codegouvfr/react-dsfr/next-pagesdir';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir';
import '../utils/keyframes.css';
import { init } from '@socialgouv/matomo-next';
import Hotjar from '@hotjar/browser';
import { trpc } from '../utils/trpc';
import { AuthProvider } from '@/providers/Auth';

// Only in TypeScript projects
declare module '@codegouvfr/react-dsfr/next-pagesdir' {
	interface RegisterLink {
		Link: typeof Link;
	}
}

const { augmentDocumentWithEmotionCache, withAppEmotionCache } =
	createEmotionSsrAdvancedApproach({ key: 'css' });

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
	defaultColorScheme: 'light',
	Link
});

export { augmentDocumentWithEmotionCache, dsfrDocumentApi };

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL as string;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID as string;

const HOTJAR_SITE_ID = parseInt(process.env.NEXT_PUBLIC_HOTJAR_SITE_ID || '0');
const HOTJAR_VERSION = parseInt(process.env.NEXT_PUBLIC_HOTJAR_VERSION || '6');

function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });
			Hotjar.init(HOTJAR_SITE_ID, HOTJAR_VERSION);
		}
	}, []);

	const getLayout = (children: ReactNode) => {
		if (router.pathname.startsWith('/administration/bo')) {
			return <DashboardLayout>{children}</DashboardLayout>;
		} else {
			return <PublicLayout>{children}</PublicLayout>;
		}
	};

	return (
		<AuthProvider>
			<ObservatoireHead />
			{getLayout(<Component {...pageProps} />)}
		</AuthProvider>
	);
}

export default withDsfr(trpc.withTRPC(withAppEmotionCache(App)));
