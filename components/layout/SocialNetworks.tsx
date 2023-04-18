import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {};

export function SocialNetworks(props: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={cx(fr.cx('fr-container'), classes.content)}>
				<div className={cx(classes.leftSection)}>
					Suivez-nous sur les réseaux sociaux
				</div>
				<div className={cx(classes.rightSection)}>
					<a
						href="https://twitter.com/_DINUM"
						target="_blank"
						rel="noreferrer"
						title="Lien vers le compte Twitter"
						className={fr.cx('ri-twitter-fill')}
					>
						Lien vers le compte Twitter
					</a>
					<a
						href="https://www.linkedin.com/company/direction-interministerielle-du-numerique-dinum/"
						target="_blank"
						rel="noreferrer"
						title="Lien vers le compte LinkedIn"
						className={fr.cx('ri-linkedin-box-fill')}
					>
						Lien vers le compte LinkedIn
					</a>
					<a
						href="https://youtube.com"
						target="_blank"
						rel="noreferrer"
						title="Lien vers le compte Youtube"
						className={fr.cx('ri-youtube-fill')}
					>
						Lien vers le compte Youtube
					</a>
				</div>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		backgroundColor: theme.decisions.background.alt.blueFrance.default
	},
	content: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingTop: fr.spacing('10v'),
		paddingBottom: fr.spacing('10v')
	},
	leftSection: {
		fontWeight: 700,
		fontSize: fr.typography[22].style.fontSize
	},
	rightSection: {
		a: {
			display: 'inline-flex',
			overflow: 'hidden',
			marginLeft: fr.spacing('5v'),
			marginRight: fr.spacing('5v'),
			backgroundImage: 'none',
			maxWidth: fr.spacing('6v'),
			maxHeight: fr.spacing('6v'),
			color: theme.decisions.background.actionHigh.blueFrance.default,
			['&:before']: {},
			['&::after']: {
				'--icon-size': '0 !important',
				margin: 0
			}
		}
	}
}));
