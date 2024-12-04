import { RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import AccordionWithIcon from '../generic/AccordionWithIcon';
import { ProcedureHeaderContent } from '../top250/table/ProcedureHeaderContent';
import { Help } from '@/payload/payload-types';
import { IndicatorSlug } from '@prisma/client';

type Props = Help['indicators'];

export function HelpIndicators(props: Props) {
	const { keyIndicators, additionnalIndicators } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			<div className={classes.primarySection}>
				<h2 className={cx(fr.cx('fr-h2'))}>
					{keyIndicators.keyIndicatorsTitle}
				</h2>
				<p>{keyIndicators.keyIndicatorsDescription}</p>
				<div
					className={cx(fr.cx('fr-accordions-group'), classes.accordionGroup)}
				>
					{keyIndicators.keyIndicatorsList &&
						keyIndicators.keyIndicatorsList.map(({ indicator }, id) => {
							if (typeof indicator === 'string') return;

							return (
								<AccordionWithIcon
									key={indicator.id}
									className={classes.accordion}
									icon={indicator.icon as RiIconClassName}
									label={indicator.label}
								>
									<ProcedureHeaderContent
										slug={indicator.slug as IndicatorSlug}
										isFull
									/>
								</AccordionWithIcon>
							);
						})}
				</div>
			</div>
			<div className={classes.secondarySection}>
				<h2 className={cx(fr.cx('fr-h2'))}>
					{additionnalIndicators.additionnalIndicatorsTitle}
				</h2>
				<p>{additionnalIndicators.additionnalIndicatorsDescription}</p>
				<div
					className={cx(fr.cx('fr-accordions-group'), classes.accordionGroup)}
				>
					{additionnalIndicators.additionnalIndicatorsList &&
						additionnalIndicators.additionnalIndicatorsList.map(
							({ indicator }, id) => {
								if (typeof indicator === 'string') return;
								return (
									<AccordionWithIcon
										key={indicator.id}
										className={classes.accordion}
										icon={indicator.icon as RiIconClassName}
										label={indicator.label}
									>
										<ProcedureHeaderContent
											slug={indicator.slug as IndicatorSlug}
											isFull
										/>
									</AccordionWithIcon>
								);
							}
						)}
				</div>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		h2: {
			color: theme.decisions.background.actionHigh.blueFrance.default
		}
	},
	primarySection: {},
	secondarySection: {
		marginTop: fr.spacing('15v')
	},
	accordionGroup: {
		margin: `${fr.spacing('10v')} 0`
	},
	accordion: {
		['button.fr-accordion__btn']: {
			color: theme.decisions.background.actionHigh.blueFrance.default,
			fontWeight: 500,
			fontSize: fr.typography[20].style.fontSize,
			['& > span:first-of-type']: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: theme.decisions.background.alt.blueFrance.default,
				width: fr.spacing('20v'),
				height: fr.spacing('20v'),
				borderRadius: '50%',
				marginRight: fr.spacing('5v'),
				['i::before']: {
					'--icon-size': fr.spacing('10v'),
					color: theme.decisions.background.actionHigh.blueFrance.default
				}
			}
		}
	}
}));
