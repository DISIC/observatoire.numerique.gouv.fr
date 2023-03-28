import type { AppProps } from 'next/app';
import { createNextDsfrIntegrationApi } from '@codegouvfr/react-dsfr/next-pagesdir';
import Link from 'next/link';
import PublicLayout from '@/layouts/PublicLayout';
import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

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
		if (router.pathname.startsWith('/administration/airtable')) {
			return <DashboardLayout>{children}</DashboardLayout>;
		} else {
			return <PublicLayout>{children}</PublicLayout>;
		}
	};

	return getLayout(<Component {...pageProps} />);
}

export default withDsfr(withAppEmotionCache(App));
