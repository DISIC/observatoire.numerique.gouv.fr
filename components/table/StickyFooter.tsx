import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	proceduresCount: number;
};

export function StickyFooter(props: Props) {
	const { proceduresCount } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={cx(classes.leftSection)}>
				{proceduresCount} services numériques évalués
			</div>
			<div className={cx(classes.rightSection)}>
				<Button
					className={cx(classes.button)}
					onClick={() => {
						window.location.href =
							'mailto:observatoire@design.numerique.gouv.fr';
					}}
					priority="tertiary"
					size="small"
				>
					<i className={cx(fr.cx('ri-add-line'), classes.buttonIcon)} /> Un
					service semble manquer ? Soumettez-le
				</Button>
				<a
					href="#"
					className={cx(fr.cx('fr-ml-18v', 'fr-link'), classes.achorLink)}
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

const useStyles = makeStyles()(theme => ({
	root: {
		position: 'sticky',
		bottom: 0,
		zIndex: 11,
		display: 'flex',
		justifyContent: 'space-between',
		padding: `${fr.spacing('3v')} ${fr.spacing('8v')}`,
		backgroundColor: theme.decisions.background.actionLow.blueFrance.default
	},
	leftSection: {
		display: 'flex',
		alignItems: 'center',
		fontWeight: 500
	},
	rightSection: {
		display: 'flex',
		alignItems: 'center'
	},
	button: {
		backgroundColor: 'white'
	},
	buttonIcon: {
		marginRight: fr.spacing('2v'),
		['&::before']: {
			'--icon-size': fr.typography[18].style.fontSize
		}
	},
	achorLink: {
		fontWeight: 500
	},
	anchorLinkIcon: {
		['&::before']: {
			'--icon-size': fr.typography[19].style.fontSize
		}
	}
}));
