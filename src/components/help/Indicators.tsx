import { RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import AccordionWithIcon from '../generic/AccordionWithIcon';
import { IndicatorContent } from '../top250/table/IndicatorContent';
import { Help } from '@/payload/payload-types';
import { tss } from 'tss-react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';

type Props = Help['indicators'];

export function HelpIndicators(props: Props) {
	const { keyIndicators, additionnalIndicators } = props;
	const { classes, cx } = useStyles();

	const isFirstLoad = useRef(true);

	const router = useRouter();

	const handleAccordionChange = useCallback((indicatorId: string, isOpen: boolean) => {
		const currentQuery = { ...router.query };

		if (isOpen) {
			router.replace(
				{
					pathname: router.pathname,
					query: { ...currentQuery, indicator: indicatorId }
				},
				undefined,
				{ shallow: true }
			);
		} else if (currentQuery.indicator === indicatorId) {
			delete currentQuery.indicator;
			router.replace(
				{
					pathname: router.pathname,
					query: currentQuery
				},
				undefined,
				{ shallow: true }
			);
		}
	}, [router]);

	useEffect(() => {
		if (isFirstLoad.current && router.query.indicator) {
			if (typeof router.query.indicator === 'string') {
				const element = document.getElementById(`indicator-${router.query.indicator}`);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}

			isFirstLoad.current = false;
		}
	}, [router.query]);

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
								<div id={`indicator-${indicator.id}`} key={indicator.id}>
									<AccordionWithIcon
										className={classes.accordion}
										icon={indicator.icon as RiIconClassName}
										label={indicator.label}
										defaultExpanded={router.query.indicator === indicator.id}
										onExpandedChange={(expanded) => {
											handleAccordionChange(indicator.id, expanded)
										}}
									>
										<IndicatorContent indicator={indicator} isFull />
									</AccordionWithIcon>
								</div>
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
									<div id={`indicator-${indicator.id}`} key={indicator.id}>
										<AccordionWithIcon
											className={classes.accordion}
											icon={indicator.icon as RiIconClassName}
											label={indicator.label}
											defaultExpanded={router.query.indicator === indicator.id}
											onExpandedChange={(expanded) => {
												handleAccordionChange(indicator.id, expanded)
											}}
										>
											<IndicatorContent indicator={indicator} isFull />
										</AccordionWithIcon>
									</div>
								);
							}
						)}
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName(HelpIndicators.name).create(() => ({
	root: {
		h2: {
			color: fr.colors.decisions.background.actionHigh.blueFrance.default
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
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			fontWeight: 500,
			fontSize: fr.typography[20].style.fontSize,
			['& > span:first-of-type']: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
				width: fr.spacing('20v'),
				height: fr.spacing('20v'),
				borderRadius: '50%',
				marginRight: fr.spacing('5v'),
				['i::before']: {
					'--icon-size': fr.spacing('10v'),
					color: fr.colors.decisions.background.actionHigh.blueFrance.default
				}
			}
		}
	}
}));
