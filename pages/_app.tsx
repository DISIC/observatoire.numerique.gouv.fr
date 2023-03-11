import type { AppProps } from 'next/app';
import { createNextDsfrIntegrationApi } from '@codegouvfr/react-dsfr/next-pagesdir';
import Link from 'next/link';
import PublicLayout from '@/layouts/PublicLayout';
import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir';

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
	return (
		<PublicLayout>
			<Component {...pageProps} />
		</PublicLayout>
	);
}

export default withDsfr(withAppEmotionCache(App));
