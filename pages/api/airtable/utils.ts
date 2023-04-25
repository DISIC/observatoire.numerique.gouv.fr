import { IndicatorColor, IndicatorSlug } from '@prisma/client';

export const getLabelFromValue = (
	slug: IndicatorSlug,
	value: string
): string => {
	switch (slug) {
		case 'online':
			if (
				[
					'Oui',
					'Non',
					'Partiel',
					'Bêta',
					'À venir',
					'Démarche proactive'
				].includes(value)
			)
				return value;
			if (value === 'En cours de déploiement local') return 'En cours';
			return 'Non';
		case 'satisfaction':
		case 'simplicity':
			const markIntValue = parseFloat(value);
			if (isNaN(markIntValue) && !!value) {
				if (value === 'Non applicable') return value;
				else return 'À venir';
			}
			if (!value) return 'À venir';
			return `${markIntValue.toFixed(1)} / 10`;
		case 'uptime':
			const uptimeIntValue = parseFloat(value);
			if (isNaN(uptimeIntValue)) return 'À venir';
			if (uptimeIntValue < 0.985) return 'Faible';
			if (uptimeIntValue < 0.99) return 'Partiel';
			return 'Optimal';
		case 'performance':
			const performanceIntValue = parseInt(value);
			if (isNaN(performanceIntValue)) return 'À venir';
			if (performanceIntValue > 800) return 'Faible';
			if (performanceIntValue > 400) return 'Partiel';
			return 'Optimal';
		case 'dlnuf':
			const dlnufIntValue = parseInt(value);
			if (isNaN(dlnufIntValue)) return 'Non communiqué';
			if (dlnufIntValue < 4) return 'Faible';
			if (dlnufIntValue < 6) return 'Partiel';
			if (dlnufIntValue < 8) return 'Bon';
			return 'Optimal';
		case 'handicap':
			const handicapIntValue = parseFloat(value);
			if (isNaN(handicapIntValue)) {
				if (['Non conforme', 'Non applicable'].includes(value)) return value;
				return 'À venir';
			}
			if (handicapIntValue < 0.5) return 'Faible';
			if (handicapIntValue < 1) return 'Partiel';
			return 'Optimal';
		case 'usage':
			const usageFloatValue = parseFloat(value);
			if (isNaN(usageFloatValue)) return 'À venir';
			return `${
				getRoundedDecimalString((usageFloatValue * 100).toString()) || '0'
			}%`;
		case 'auth':
			if (['FranceConnect', 'FranceConnect +', 'Non'].includes(value))
				return value;
			if (['n/a', '-'].includes(value)) return 'Non applicable';
			return 'À venir';
		default:
			return value;
	}
};

export const getColorFromLabel = (
	slug: IndicatorSlug,
	label: string
): IndicatorColor => {
	switch (slug) {
		case 'online':
			if (label === 'Oui') return 'green';
			if (label === 'Partiel') return 'orange';
			if (label === 'Bêta') return 'orange';
			if (label === 'En cours') return 'gray';
			if (label === 'Démarche proactive') return 'blue';
			return 'red';
		case 'satisfaction':
		case 'simplicity':
			const markIntValue = parseInt(label.split(' ')[0]);
			if (isNaN(markIntValue)) return 'gray';
			if (markIntValue < 5) return 'red';
			if (markIntValue < 8) return 'orange';
			return 'green';
		case 'uptime':
			if (label === 'À venir') return 'gray';
			if (label === 'Partiel') return 'orange';
			if (label === 'Faible') return 'red';
			return 'green';
		case 'performance':
			if (label === 'À venir') return 'gray';
			if (label === 'Partiel') return 'orange';
			if (label === 'Lent') return 'red';
			return 'green';
		case 'dlnuf':
			if (label === 'Non communiqué') return 'gray';
			if (label === 'Bon') return 'orange';
			if (label === 'Partiel') return 'orange';
			if (label === 'Faible') return 'red';
			return 'green';
		case 'handicap':
			if (label === 'Optimal') return 'green';
			if (label === 'Partiel') return 'orange';
			if (['Faible', 'Non conforme'].includes(label)) return 'red';
			return 'gray';
		case 'usage':
			return 'gray';
		case 'auth':
			if (['À venir', 'Non applicable'].includes(label)) return 'gray';
			if (label === 'Non') return 'red';
			return 'blue';
		default:
			return 'gray';
	}
};

export const getRoundedDecimalString = (value: string): string | null => {
	if (isNaN(parseInt(value))) return null;
	return (Math.round(parseFloat(value) * 10) / 10).toString();
};
