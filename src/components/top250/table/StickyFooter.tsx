import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { push } from '@socialgouv/matomo-next';
import { tss } from 'tss-react';

type Props = {
	proceduresCount: number;
	isAdmin?: boolean;
};

export function StickyFooter(props: Props) {
	const { proceduresCount, isAdmin } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={cx(fr.cx('fr-text--sm'), classes.leftSection)}>
				{proceduresCount} services numériques évalués
			</div>
			<div className={cx(classes.rightSection)}>
				<a
					href="#"
					className={cx(fr.cx('fr-link', 'fr-text--sm'), classes.achorLink)}
				>
					<i
						className={cx(
							fr.cx('ri-arrow-up-fill', 'fr-pr-3v'),
							classes.anchorLinkIcon
						)}
					/>
					Haut de page
				</a>
			</div>
		</div>
	);
}

const useStyles = tss.withName(StickyFooter.name).create(() => ({
	root: {
		position: 'sticky',
		bottom: 0,
		zIndex: 11,
		display: 'flex',
		justifyContent: 'space-between',
		padding: `${fr.spacing('3v')} ${fr.spacing('8v')}`,
		paddingLeft: 0,
		backgroundColor:
			fr.colors.decisions.background.actionLow.blueFrance.default,
		[fr.breakpoints.down('lg')]: {
			backgroundColor: fr.colors.decisions.background.default.grey.default
		}
	},
	leftSection: {
		display: 'flex',
		alignItems: 'center',
		fontWeight: 500,
		marginBottom: 0,
		paddingLeft:
			window.innerWidth > 1400
				? 'calc((100vw - 1400px) / 2)'
				: fr.spacing('8v'),
		[fr.breakpoints.down('lg')]: { display: 'none' }
	},
	rightSection: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		[fr.breakpoints.down('lg')]: {
			width: '100%'
		}
	},
	button: {
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		[fr.breakpoints.down('lg')]: { display: 'none' }
	},
	buttonIcon: {
		marginRight: fr.spacing('2v'),
		['&::before']: {
			'--icon-size': fr.typography[18].style.fontSize
		}
	},
	achorLink: {
		fontWeight: 500,
		marginLeft: fr.spacing('18v'),
		[fr.breakpoints.down('lg')]: { marginLeft: 0 }
	},
	anchorLinkIcon: {
		['&::before']: {
			'--icon-size': fr.typography[19].style.fontSize
		}
	}
}));
