import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		minimumCacheTTL: 604800
	},
	experimental: {
		esmExternals: true
	},
	i18n: {
		locales: ['fr'],
		defaultLocale: 'fr'
	},
	webpack: config => {
		config.module.rules.push({
			test: /\.woff2$/,
			type: 'asset/resource'
		});
		return config;
	},
	babel: {
		presets: [
			['@babel/preset-env', { targets: { node: 'current' } }],
			'@babel/preset-typescript',
			'next/babel'
		]
	},
	transpilePackages: ['@codegouvfr/react-dsfr', 'tss-react']
};

export default withPayload(nextConfig);
