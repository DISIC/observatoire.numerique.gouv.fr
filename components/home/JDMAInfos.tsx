import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Image from 'next/image';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
};

export function JDMAInfos(props: Props) {
	const { title, description } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<div className={cx(fr.cx('fr-container'), classes.container)}>
				<div>
					<h2>{title}</h2>
					<p>{description}</p>
					<Button
						type="button"
						priority="secondary"
						className={classes.jdmaButton}
						onClick={() => {
							window.location.href =
								'https://observatoire.numerique.gouv.fr/je-donne-mon-avis/';
						}}
					>
						Suivre la satisfaction de vos usagers
					</Button>
				</div>
				<div>
					<Image
						alt="Exemple de statistiques avec l'outil Je donne mon avis"
						src="/assets/jdma-screenshot.svg"
						title="Exemple de statistiques avec l'outil Je donne mon avis"
						width={448}
						height={316}
					/>
				</div>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		backgroundColor: theme.decisions.background.alt.blueFrance.default
	},
	container: {
		maxWidth: '62rem',
		paddingTop: fr.spacing('14v'),
		paddingBottom: fr.spacing('14v'),
		display: 'flex',
		alignItems: 'center',
		['& > div:first-of-type']: {
			marginRight: fr.spacing('16v'),
			h2: {
				...fr.typography[4].style,
				color: theme.decisions.background.actionHigh.blueFrance.default
			},
			p: {
				marginTop: fr.spacing('8v'),
				marginBottom: fr.spacing('7v')
			}
		},
		['& > div:not(:first-of-type)']: {
			width: '40%'
		},
		[fr.breakpoints.down('sm')]: {
			flexWrap: 'wrap',
			textAlign: 'center',
			['& > div:first-of-type']: {
				marginRight: 0
			},
			['& > div:not(:first-of-type)']: {
				width: '100%',
				marginTop: fr.spacing('10v'),
				img: {
					maxWidth: '100%'
				}
			}
		}
	},
	jdmaButton: {
		backgroundColor: theme.decisions.background.default.grey.default
	}
}));
