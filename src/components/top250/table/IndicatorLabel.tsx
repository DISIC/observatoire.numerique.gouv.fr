import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorColor } from '@prisma/client';

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
		<span
			className={cx(
				fr.cx(
					noBackground ? 'fr-px-0' : 'fr-px-1w',
					'fr-py-0-5v',
					'fr-text--sm'
				),
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
		</span>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		textAlign: 'center',
		fontWeight: 'bold',
		borderRadius: fr.spacing('1v'),
		[fr.breakpoints.down('lg')]: {
			fontSize: fr.typography[17].style.fontSize,
			position: 'relative',
			top: fr.spacing('1v'),
			zIndex: 1
		}
	},
	blue: {
		color: theme.decisions.background.flat.info.default,
		backgroundColor: theme.decisions.background.contrast.info.default
	},
	red: {
		color: theme.decisions.background.flat.error.default,
		backgroundColor: theme.decisions.background.contrast.error.default
	},
	yellow: {
		color: theme.decisions.background.actionHigh.yellowTournesol.default,
		backgroundColor: theme.decisions.background.contrast.yellowTournesol.default
	},
	orange: {
		color: theme.decisions.background.flat.warning.default,
		backgroundColor:
			theme.decisions.background.contrast.orangeTerreBattue.default
	},
	green: {
		color: theme.decisions.background.flat.success.default,
		backgroundColor: theme.decisions.background.contrast.success.default
	},
	gray: {
		color: theme.decisions.background.flat.grey.default,
		backgroundColor: theme.decisions.background.default.grey.hover
	},
	noBackground: {
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
