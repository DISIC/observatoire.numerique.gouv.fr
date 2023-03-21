import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

type Props = {};

export function PreHeader(props: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={cx(classes.section)}>
				Trier par volumétrie (décroissant)
			</div>
			<div className={cx(classes.section)}>
				<Link href="#" className={fr.cx('fr-link')}>
					Tout comprendre sur les indicateurs{' '}
					<i className={cx(fr.cx('ri-chat-poll-line'), classes.linkIcon)} />
				</Link>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: `${fr.spacing('3v')} ${fr.spacing('4v')}`,
		[fr.breakpoints.down('lg')]: {
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column'
		}
	},
	section: {
		display: 'flex',
		alignItems: 'center',
		fontWeight: 500,
		a: {
			backgroundImage: 'none'
		},
		[fr.breakpoints.down('lg')]: {
			['&:first-child']: {
				marginBottom: fr.spacing('8v')
			},
			transform: 'translateY(-200%)'
		}
	},
	linkIcon: {
		['&::before']: {
			'--icon-size': fr.typography[19].style.fontSize
		}
	}
}));
