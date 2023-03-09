import '../styles/header.scss';
import type { AppProps } from 'next/app';
import { createNextDsfrIntegrationApi } from '@codegouvfr/react-dsfr/next-pagesdir';
import Link from 'next/link';
import PublicLayout from '@/layouts/PublicLayout';

// Only in TypeScript projects
declare module '@codegouvfr/react-dsfr/next-pagesdir' {
  interface RegisterLink {
    Link: typeof Link;
  }
}

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
  defaultColorScheme: 'system',
  Link
});

export { dsfrDocumentApi };

function App({ Component, pageProps }: AppProps) {
  return (
    <PublicLayout>
      <Component {...pageProps} />
    </PublicLayout>
  );
}

export default withDsfr(App);
