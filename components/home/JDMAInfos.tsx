import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

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
					<img src="/jdma-screenshot.svg" />
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
		['& > div:first-child']: {
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
		['& > div:not(:first-child)']: {
			width: '40%'
		}
	},
	jdmaButton: {
		backgroundColor: theme.decisions.background.default.grey.default
	}
}));
