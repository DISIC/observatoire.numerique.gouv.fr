import { fr } from '@codegouvfr/react-dsfr';
import { IndicatorColor } from '@prisma/client';
import { tss } from 'tss-react';

type Props = {
	label: string;
	color: IndicatorColor;
	noBackground?: boolean | null;
	old?: boolean;
};

export function IndicatorLabel(props: Props) {
	const { label, color, noBackground, old } = props;
	const { classes, cx } = useStyles();

	return (
		<p
			className={cx(
				fr.cx(noBackground ? 'fr-px-0' : 'fr-px-1w', 'fr-text--sm'),
				classes.root,
				classes[color],
				old ? classes.old : '',
				old &&
					[
						'< 100 votes',
						'n/a',
						'-',
						'En attente',
						'En cours de déploiement local'
					].includes(label)
					? classes.oldXs
					: '',
				noBackground ? classes.noBackground : ''
			)}
		>
			{label}
		</p>
	);
}

const useStyles = tss.withName(IndicatorLabel.name).create(() => ({
	root: {
		textAlign: 'center',
		fontWeight: 'bold',
		borderRadius: fr.spacing('1v'),
		marginBottom: 0,
		display: 'inline-block',
		[fr.breakpoints.down('lg')]: {
			fontSize: fr.typography[17].style.fontSize,
			position: 'relative',
			top: fr.spacing('1v'),
			zIndex: 1
		}
	},
	blue: {
		color: fr.colors.decisions.background.flat.info.default,
		backgroundColor: fr.colors.decisions.background.contrast.info.default
	},
	red: {
		color: fr.colors.decisions.background.flat.error.default,
		backgroundColor: fr.colors.decisions.background.contrast.error.default
	},
	yellow: {
		color: fr.colors.decisions.background.actionHigh.yellowTournesol.default,
		backgroundColor:
			fr.colors.decisions.background.contrast.yellowTournesol.default
	},
	orange: {
		color: fr.colors.decisions.background.flat.warning.default,
		backgroundColor:
			fr.colors.decisions.background.contrast.orangeTerreBattue.default
	},
	green: {
		color: fr.colors.decisions.background.flat.success.default,
		backgroundColor: fr.colors.decisions.background.contrast.success.default
	},
	gray: {
		color: fr.colors.decisions.background.flat.grey.default,
		backgroundColor: fr.colors.decisions.background.default.grey.hover
	},
	noBackground: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		fontWeight: 'normal'
	},
	old: {
		display: 'block'
	},
	oldXs: {
		fontSize: '0.75rem !important'
	}
}));
