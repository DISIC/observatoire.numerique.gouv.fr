import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		minimumCacheTTL: 604800
	},
	i18n: {
		locales: ['fr'],
		defaultLocale: 'fr'
	},
	webpack: (config, { isServer }) => {
		config.module.rules.push({
			test: /\.woff2$/,
			type: 'asset/resource'
		});

		return config;
	},
	transpilePackages: ['@codegouvfr/react-dsfr', 'tss-react']
};

export default withPayload(nextConfig);
