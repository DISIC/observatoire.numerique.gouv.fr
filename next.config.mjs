import { withPayload } from '@payloadcms/next/withPayload';

// URL absolues des médias renvoyées par Payload quand serverURL est défini
const getPublicOrigin = () => {
	const url = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXTAUTH_URL;
	if (!url) return null;
	try {
		return new URL(url);
	} catch {
		return null;
	}
};
const publicOrigin = getPublicOrigin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	images: {
		minimumCacheTTL: 604800,
		...(publicOrigin
			? {
					remotePatterns: [
						{
							protocol: publicOrigin.protocol.replace(':', ''),
							hostname: publicOrigin.hostname,
							...(publicOrigin.port ? { port: publicOrigin.port } : {}),
							pathname: '/api/payload-media/**'
						}
					]
			  }
			: {})
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
					{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }
				]
			}
		];
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
