import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Tile from '@codegouvfr/react-dsfr/Tile';
import { ProcedureHeader } from '@prisma/client';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
	titleIndicators: JSX.Element;
	indicators: ProcedureHeader[];
};

export function IndicatorsInfos(props: Props) {
	const { title, description, titleIndicators, indicators } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(fr.cx('fr-container'), classes.root)}>
			<div className={cx(classes.introContainer)}>
				<h2>{title}</h2>
				<p>{description}</p>
			</div>
			<div className={classes.tilesContainer}>
				<Tile
					imageUrl="/city-hall.svg"
					imageAlt="La sélection des services"
					imageWidth={80}
					imageHeight={80}
					linkProps={{
						href: '#'
					}}
					title="La sélection des services"
				/>
				<Tile
					imageUrl="/data-visualization.svg"
					imageAlt="Le suivi des services"
					imageWidth={80}
					imageHeight={80}
					linkProps={{
						href: '#'
					}}
					title="Le suivi des services"
				/>
			</div>
			<div className={classes.indicatorsContainer}>
				<h2>{titleIndicators}</h2>
				<div>
					{indicators.slice(0, 5).map(indicator => (
						<div key={indicator.id}>
							<span>
								<i className={indicator.icon} />
							</span>
							<span>{indicator.label}</span>
						</div>
					))}
				</div>
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
			...fr.typography[5].style,
			textAlign: 'center',
			color: theme.decisions.background.actionHigh.blueFrance.default
		},
		p: {
			paddingLeft: fr.spacing('16v'),
			paddingRight: fr.spacing('16v'),
			marginTop: fr.spacing('8v'),
			[fr.breakpoints.down('sm')]: {
				padding: 0,
				textAlign: 'center'
			}
		}
	},
	tilesContainer: {
		display: 'flex',
		justifyContent: 'center',
		paddingTop: fr.spacing('9v'),
		paddingBottom: fr.spacing('17v'),
		['& > div']: {
			maxWidth: '11.25rem',
			marginLeft: fr.spacing('4v'),
			marginRight: fr.spacing('4v'),
			paddingBottom: fr.spacing('8v'),
			[fr.breakpoints.down('sm')]: {
				maxWidth: '9.25rem'
			}
		}
	},
	indicatorsContainer: {
		h2: {
			...fr.typography[4].style,
			textAlign: 'center',
			color: theme.decisions.background.actionHigh.blueFrance.default
		},
		['& > div']: {
			display: 'flex',
			justifyContent: 'space-between',
			['& > div']: {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				marginTop: fr.spacing('8v'),
				['& > span:first-of-type']: {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: theme.decisions.background.alt.blueFrance.default,
					borderRadius: '50%',
					width: fr.spacing('20v'),
					height: fr.spacing('20v'),
					['i::before']: {
						'--icon-size': fr.spacing('10v'),
						color: theme.decisions.background.actionHigh.blueFrance.default
					}
				},
				['& > span:not(:first-of-type)']: {
					maxWidth: fr.spacing('32v'),
					textAlign: 'center',
					color: theme.decisions.background.actionHigh.blueFrance.default,
					fontWeight: 'bold',
					marginTop: fr.spacing('7v')
				}
			},
			[fr.breakpoints.down('sm')]: {
				flexWrap: 'wrap',
				['& > div']: {
					width: '100%',
					['&:not(:first-of-type)']: { marginTop: fr.spacing('20v') }
				}
			}
		}
	}
}));
