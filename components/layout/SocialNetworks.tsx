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
						href="https://twitter.com"
						target="_blank"
						rel="noreferrer"
						aria-label="Lien vers le compte Twitter"
					>
						<i className={fr.cx('ri-twitter-fill')} />
					</a>
					<a
						href="https://linkedin.com"
						target="_blank"
						rel="noreferrer"
						aria-label="Lien vers le compte LinkedIn"
					>
						<i className={fr.cx('ri-linkedin-box-fill')} />
					</a>
					<a
						href="https://youtube.com"
						target="_blank"
						rel="noreferrer"
						aria-label="Lien vers le compte Youtube"
					>
						<i className={fr.cx('ri-youtube-fill')} />
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
			paddingLeft: fr.spacing('5v'),
			paddingRight: fr.spacing('5v'),
			backgroundImage: 'none',
			['i::before']: {
				backgroundColor:
					theme.decisions.background.actionHigh.blueFrance.default
			},
			['&::after']: {
				'--icon-size': '0 !important',
				margin: 0
			}
		}
	}
}));
