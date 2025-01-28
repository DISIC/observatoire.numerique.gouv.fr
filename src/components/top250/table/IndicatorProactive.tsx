import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';

type Props = {};

export function IndicatorProactive(props: Props) {
	const { classes } = useStyles();
	return (
		<div className={classes.root}>
			<i className={fr.cx('ri-dvd-line')} />
			<p>
				Grâce au partage d’informations entre administrations, ce service
				octroie automatiquement les droits aux personnes concernées.
			</p>
		</div>
	);
}

const useStyles = tss.withName(IndicatorProactive.name).create(() => ({
	root: {
		display: 'flex',
		textAlign: 'left',
		marginLeft: fr.spacing('10v'),
		i: {
			['&::before']: {
				'--icon-size': '0.875rem !important'
			}
		},
		p: {
			marginBottom: 0,
			marginLeft: fr.spacing('2v'),
			fontSize: fr.typography[18].style.fontSize
		},
		[fr.breakpoints.down('lg')]: {
			flexDirection: 'column',
			alignItems: 'center',
			marginLeft: 0,
			i: {
				display: 'none'
			},
			p: {
				...fr.typography[18].style,
				marginBottom: '0 !important'
			}
		}
	}
}));
