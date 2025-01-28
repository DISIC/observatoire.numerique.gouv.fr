import { PayloadIndicator } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';
import Link from 'next/link';

type Props = {
	title: string;
	description: string;
	indicators: PayloadIndicator[];
	buttonText: string;
	buttonLink: string;
};

export function IndicatorsDetails(props: Props) {
	const { title, description, indicators, buttonText, buttonLink } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			<div className={cx(fr.cx('fr-container'), classes.container)}>
				<div className={cx(classes.introContainer)}>
					<h2>{title}</h2>
					<p>{description}</p>
				</div>
				<div className={cx(classes.indicatorsContainer)}>
					{indicators.slice(0, 5).map(indicator => (
						<div key={indicator.id}>
							<span>
								<i className={indicator.icon} />
							</span>
							<h3>{indicator.label}</h3>
							{indicator.description && <p>{indicator.description}</p>}
						</div>
					))}
				</div>
				<div className={classes.buttonContainer}>
					<Link
						href={buttonLink}
						className={fr.cx('fr-btn', 'fr-btn--secondary')}
					>
						{buttonText}
					</Link>
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName(IndicatorsDetails.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default
	},
	container: {
		maxWidth: '62rem',
		paddingTop: fr.spacing('14v'),
		paddingBottom: fr.spacing('24v')
	},
	introContainer: {
		h2: {
			...fr.typography[3].style,
			textAlign: 'center',
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
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
	indicatorsContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		['& > div']: {
			margin: `${fr.spacing('5v')} ${fr.spacing('10v')}`,
			width: `calc(50% - ${fr.spacing('10w')})`,
			[fr.breakpoints.down('sm')]: {
				margin: `${fr.spacing('7v')} 0`,
				width: '100%',
				p: {
					display: 'none'
				}
			},
			['& > span']: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: fr.colors.decisions.background.default.grey.default,
				width: fr.spacing('20v'),
				height: fr.spacing('20v'),
				borderRadius: '50%',
				['i::before']: {
					'--icon-size': fr.spacing('10v'),
					color: fr.colors.decisions.background.actionHigh.blueFrance.default
				},
				[fr.breakpoints.down('sm')]: {
					margin: `0 auto ${fr.spacing('5v')} auto`
				}
			},
			['& > h3']: {
				display: 'block',
				...fr.typography[20].style,
				color: fr.colors.decisions.background.actionHigh.blueFrance.default,
				fontWeight: 500,
				marginTop: fr.spacing('4v'),
				marginBottom: fr.spacing('3v'),
				[fr.breakpoints.down('sm')]: {
					margin: 'auto',
					maxWidth: '10rem'
				}
			}
		},
		[fr.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	},
	buttonContainer: {
		display: 'flex',
		justifyContent: 'center',
		marginTop: fr.spacing('8v')
	}
}));
