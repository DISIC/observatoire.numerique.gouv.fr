import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	label: string;
	color: 'blue' | 'red' | 'orange' | 'green' | 'gray';
	noBackground?: boolean;
};

export function IndicatorLabel(props: Props) {
	const { label, color, noBackground } = props;
	const { classes, cx } = useStyles();

	return (
		<span
			className={cx(
				fr.cx('fr-px-1w', 'fr-py-0-5v'),
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
		borderRadius: fr.spacing('1v')
	},
	blue: {
		color: '#0063CB',
		backgroundColor: '#E8EDFF'
	},
	red: {
		color: '#CE0500',
		backgroundColor: '#FFE9E9'
	},
	orange: {
		color: '#716043',
		backgroundColor: '#FEECC2'
	},
	green: {
		color: '#18753C',
		backgroundColor: '#B8FEC9'
	},
	gray: {
		color: '#3A3A3A',
		backgroundColor: '#F6F6F6'
	},
	noBackground: {
		backgroundColor: 'transparent'
	}
}));
