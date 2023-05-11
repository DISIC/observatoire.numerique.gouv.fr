import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ProcedureHeader } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
	indicators: ProcedureHeader[];
	button: {
		text: string;
		link: string;
	};
};

export function IndicatorsDetails(props: Props) {
	const { title, description, indicators, button } = props;
	const { classes, cx } = useStyles();
	const router = useRouter();

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
							<span>{indicator.label}</span>
							{indicator.description && <p>{indicator.description}</p>}
						</div>
					))}
				</div>
				<div className={classes.buttonContainer}>
					<Link
						href={button.link}
						className={fr.cx('fr-btn', 'fr-btn--secondary', 'fr-btn--sm')}
					>
						{button.text}
					</Link>
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
			['& > span:first-of-type']: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: theme.decisions.background.default.grey.default,
				width: fr.spacing('20v'),
				height: fr.spacing('20v'),
				borderRadius: '50%',
				['i::before']: {
					'--icon-size': fr.spacing('10v'),
					color: theme.decisions.background.actionHigh.blueFrance.default
				},
				[fr.breakpoints.down('sm')]: {
					margin: `0 auto ${fr.spacing('5v')} auto`
				}
			},
			['& > span:not(:first-of-type)']: {
				display: 'block',
				...fr.typography[20].style,
				color: theme.decisions.background.actionHigh.blueFrance.default,
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
