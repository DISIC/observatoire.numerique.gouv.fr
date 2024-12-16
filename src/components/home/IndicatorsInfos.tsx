import { PayloadMedia } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';
import PayloadImage from '../generic/PayloadImage';
import { ReactNode } from 'react';

type Props = {
	title: ReactNode | string;
	description: ReactNode | string;
	blocs: {
		title: string;
		description: string;
		buttonText: string;
		buttonLink: string;
		image: string | PayloadMedia;
	}[];
};

type CardProps = {
	image: string | PayloadMedia;
	title: string;
	description: string;
	button: {
		text: string;
		link: string;
	};
};

function IndicatorsInfosCard(props: CardProps) {
	const { image, title, description, button } = props;
	const { classes } = useStyles();

	return (
		<div className={classes.explanation}>
			<div className={classes.explanationTitle}>
				<PayloadImage image={image} />
				<span>{title}</span>
			</div>
			<p>{description}</p>
			<Link
				href={button.link}
				className={fr.cx('fr-btn', 'fr-btn--secondary', 'fr-btn--sm')}
			>
				{button.text} <i className={fr.cx('ri-arrow-right-line', 'fr-ml-2v')} />
			</Link>
		</div>
	);
}

export function IndicatorsInfos(props: Props) {
	const { title, description, blocs } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(fr.cx('fr-container'), classes.root)}>
			<div className={cx(classes.introContainer)}>
				<h2>{title}</h2>
				<p>{description}</p>
			</div>
			<div className={classes.explainationsContainer}>
				{blocs.map((bloc, index) => (
					<IndicatorsInfosCard
						key={index}
						image={bloc.image}
						title={bloc.title}
						description={bloc.description}
						button={{
							text: bloc.buttonText,
							link: bloc.buttonLink
						}}
					/>
				))}
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
		a: {
			fontWeight: 400,
			borderBottom: 0,
			['i::before']: {
				'--icon-size': '1rem !important',
				position: 'relative',
				top: 2
			}
		},
		[fr.breakpoints.down('md')]: {
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
