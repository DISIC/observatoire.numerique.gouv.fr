import * as migration_20261020_094834_initial from './20261020_094834_initial';
import * as migration_20261020_120047_totp_enrolement from './20261020_120047_totp_enrolement';

export const migrations = [
	{
		up: migration_20261020_094834_initial.up,
		down: migration_20261020_094834_initial.down,
		name: '20261020_094834_initial'
	},
	{
		up: migration_20261020_120047_totp_enrolement.up,
		down: migration_20261020_120047_totp_enrolement.down,
		name: '20261020_120047_totp_enrolement'
	}
];
