import { TFieldColor } from '@/pages/api/procedures/types';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	label: string;
	color: TFieldColor;
	noBackground?: boolean;
};

export function IndicatorLabel(props: Props) {
	const { label, color, noBackground } = props;
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
				noBackground ? classes.noBackground : ''
			)}
			role="text"
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
			fontSize: fr.typography[17].style.fontSize
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
	}
}));
