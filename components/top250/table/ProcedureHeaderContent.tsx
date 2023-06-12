import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorColor, IndicatorSlug } from '@prisma/client';
import { IndicatorLabel } from './IndicatorLabel';
import { fr } from '@codegouvfr/react-dsfr';
import { indicatorsDescriptions } from '@/utils/indicators';

type Props = {
	slug: IndicatorSlug;
};

export const ProcedureHeaderContent = (props: Props) => {
	const { slug } = props;
	const { classes, cx } = useStyles();

	const content = indicatorsDescriptions.find(i => i.slug === slug);

	if (!content) return <p>À venir...</p>;

	return (
		<div className={cx(classes.root)}>
			<h5>{content.title}</h5>
			{content.description && <p>{content.description}</p>}
			{content.indicators_intro && (
				<p>
					<b>{content.indicators_intro}</b>
				</p>
			)}
			<ul className={cx(classes.indicatorContainer)}>
				{content.indicators.map((indicator, index) => (
					<li key={index} className={classes.indicatorItem}>
						<span className={cx(classes.label)}>
							<IndicatorLabel
								label={indicator.label}
								color={indicator.color as IndicatorColor}
							/>
						</span>
						<span>{indicator.description}</span>
					</li>
				))}
			</ul>
			{content.moreInfos && (
				<div
					className={cx(
						classes.moreInfos,
						content.isMoreInfosBlue ? classes.moreInfosBlue : {}
					)}
				>
					{content.moreInfos_title && <b>{content.moreInfos_title}</b>}
					<p>{content.moreInfos}</p>
				</div>
			)}
		</div>
	);
};

const useStyles = makeStyles()(theme => ({
	root: {
		h5: {
			fontSize: '20px'
		},
		p: {
			fontSize: '14px'
		}
	},
	label: {
		marginRight: fr.spacing('2v')
	},
	indicatorContainer: {
		paddingLeft: 0
	},
	indicatorItem: {
		marginBottom: `${fr.spacing('4v')} !important`,
		display: 'flex',
		...fr.typography[18].style,
		['& > span:first-of-type']: {
			flexShrink: 0
		},
		[fr.breakpoints.down('sm')]: {
			flexDirection: 'column',
			['& > span:first-of-type']: {
				marginBottom: fr.spacing('2v')
			}
		}
	},
	moreInfos: {
		padding: fr.spacing('2v'),
		marginTop: fr.spacing('6v'),
		backgroundColor: theme.decisions.background.default.grey.hover,
		p: {
			marginBottom: 0
		}
	},
	moreInfosBlue: {
		backgroundColor: theme.decisions.background.contrast.info.default,
		b: {
			color: theme.decisions.background.flat.info.default
		}
	}
}));
