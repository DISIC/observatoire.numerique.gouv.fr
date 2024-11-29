import type { CollectionConfig } from 'payload';

export const Admins: CollectionConfig = {
	slug: 'payload-admins',
	labels: {
		singular: 'Administrateur',
		plural: 'Administrateurs'
	},
	admin: {
		useAsTitle: 'email'
	},
	auth: true,
	fields: [
		// Email added by default
		// Add more fields as needed
	]
};
