import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {};

export function SocialNetworks(props: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={cx(fr.cx('fr-container'), classes.content)}>
				<h2 className={cx(classes.leftSection)}>
					Suivez-nous sur les réseaux sociaux
				</h2>
				<ul className={cx(classes.rightSection)}>
					<li>
						<a
							href="https://twitter.com/Numerique_Gouv"
							target="_blank"
							rel="noreferrer"
							title="Compte Twitter"
							className={fr.cx('ri-twitter-fill')}
						>
							Accéder au compte Twitter
						</a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/company/direction-interministerielle-du-numerique-dinum/"
							target="_blank"
							rel="noreferrer"
							title="Compte LinkedIn"
							className={fr.cx('ri-linkedin-box-fill')}
						>
							Accéder au compte LinkedIn
						</a>
					</li>
					<li>
						<a
							href="https://youtube.com"
							target="_blank"
							rel="noreferrer"
							title="Compte Youtube"
							className={fr.cx('ri-youtube-fill')}
						>
							Accéder au compte Youtube
						</a>
					</li>
				</ul>
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
		alignItems: 'center',
		paddingTop: fr.spacing('10v'),
		paddingBottom: fr.spacing('10v')
	},
	leftSection: {
		fontWeight: 700,
		fontSize: fr.typography[22].style.fontSize,
		marginBottom: 0
	},
	rightSection: {
		listStyle: 'none',
		li: {
			display: 'inline-flex',
			a: {
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
	}
}));
