import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';

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
							title="Compte Twitter, nouvelle fenêtre"
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
							title="Compte LinkedIn, nouvelle fenêtre"
							className={fr.cx('ri-linkedin-box-fill')}
						>
							Accéder au compte LinkedIn
						</a>
					</li>
					<li>
						<a
							href="https://www.youtube.com/c/designgouv"
							target="_blank"
							rel="noreferrer"
							title="Compte Youtube, nouvelle fenêtre"
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

const useStyles = tss.withName(SocialNetworks.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default
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
				color: fr.colors.decisions.background.actionHigh.blueFrance.default,
				['&:before']: {},
				['&::after']: {
					'--icon-size': '0 !important',
					margin: 0
				}
			}
		}
	}
}));
