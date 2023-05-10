import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ProcedureHeader } from '@prisma/client';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/router';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
	titleIndicators: JSX.Element;
	indicators: ProcedureHeader[];
};

type CardProps = {
	imageUrl: string;
	imageAlt: string;
	title: JSX.Element;
	description: string;
	button: {
		text: string;
		link: string;
	};
};

function IndicatorsInfosCard(props: CardProps) {
	const { imageUrl, imageAlt, title, description, button } = props;
	const { classes, cx } = useStyles();
	const router = useRouter();

	return (
		<div className={classes.explanation}>
			<div className={classes.explanationTitle}>
				<img
					className={cx(fr.cx('fr-responsive-img'))}
					src={imageUrl}
					alt={imageAlt}
				/>
				<span>{title}</span>
			</div>
			<p>{description}</p>
			<Button
				type="button"
				priority="secondary"
				size="small"
				onClick={() => {
					router.push(button.link);
				}}
			>
				{button.text} <i className={fr.cx('ri-arrow-right-line', 'fr-ml-2v')} />
			</Button>
		</div>
	);
}

export function IndicatorsInfos(props: Props) {
	const { title, description, titleIndicators, indicators } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(fr.cx('fr-container'), classes.root)}>
			<div className={cx(classes.introContainer)}>
				<h2>{title}</h2>
				<p>{description}</p>
			</div>
			<div className={classes.explainationsContainer}>
				<IndicatorsInfosCard
					imageUrl="/assets/data-visualization.svg"
					imageAlt="Le suivi des services"
					title={
						<>
							Une évaluation trimestrielle
							<br /> des services
						</>
					}
					description="Elle permet d’évaluer les services sur des critères de qualité et de performance."
					button={{
						text: 'Comprendre l’évaluation',
						link: '/'
					}}
				/>
				<IndicatorsInfosCard
					imageUrl="/assets/city-hall.svg"
					imageAlt="La sélection des services"
					title={
						<>
							Une sélection des services
							<br /> numériques phares
						</>
					}
					description="Tous les services publics numérique peuvent réaliser une demande pour entrer dans l’observatoire."
					button={{
						text: 'Voir les critères d’entrée',
						link: '/'
					}}
				/>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		maxWidth: '62rem',
		paddingTop: fr.spacing('14v'),
		paddingBottom: fr.spacing('24v')
	},
	introContainer: {
		h2: {
			...fr.typography[3].style,
			textAlign: 'center',
			color: theme.decisions.background.actionHigh.blueFrance.default,
			marginBottom: fr.spacing('6v')
		},
		p: {
			paddingLeft: fr.spacing('17v'),
			paddingRight: fr.spacing('17v'),
			marginBottom: fr.spacing('10v'),
			textAlign: 'center',
			[fr.breakpoints.down('sm')]: {
				padding: 0,
				textAlign: 'center'
			}
		}
	},
	explainationsContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: fr.spacing('14w'),
		paddingLeft: fr.spacing('17v'),
		paddingRight: fr.spacing('17v'),
		[fr.breakpoints.down('sm')]: {
			flexDirection: 'column-reverse',
			textAlign: 'center',
			gap: 0,
			paddingLeft: 0,
			paddingRight: 0
		}
	},
	explanation: {
		width: `calc(50% - ${fr.spacing('7w')})`,
		p: {
			marginTop: fr.spacing('9v'),
			marginBottom: fr.spacing('9v'),
			height: fr.spacing('8w'),
			[fr.breakpoints.down('sm')]: {
				marginTop: fr.spacing('4v'),
				marginBottom: fr.spacing('4v'),
				height: 'auto'
			}
		},
		button: {
			fontWeight: 400,
			['i::before']: {
				'--icon-size': '1rem !important'
			}
		},
		[fr.breakpoints.down('sm')]: {
			width: '100%',
			['&:not(:last-of-type)']: {
				marginTop: fr.spacing('16v')
			}
		}
	},
	explanationTitle: {
		display: 'flex',
		alignItems: 'center',
		img: {
			width: fr.spacing('19v')
		},
		span: {
			...fr.typography[20].style,
			color: theme.decisions.background.actionHigh.blueFrance.default,
			fontWeight: 500,
			margin: `0 0 0 ${fr.spacing('4v')}`
		},
		[fr.breakpoints.down('sm')]: {
			flexDirection: 'column',
			gap: fr.spacing('6v')
		}
	}
}));
