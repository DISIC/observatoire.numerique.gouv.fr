import { RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import AccordionWithIcon from '../generic/AccordionWithIcon';
import { useProcedureHeaders } from '@/utils/api';
import { indicatorsDescriptions } from '@/utils/indicators';
import { ProcedureHeaderContent } from '../top250/table/ProcedureHeaderContent';

type Props = {};

export function HelpIndicators(props: Props) {
	const { classes, cx } = useStyles();

	const { data: proceduresTableHeaders } = useProcedureHeaders();

	if (!proceduresTableHeaders || !proceduresTableHeaders.length) return <></>;

	return (
		<div className={classes.root}>
			<div className={classes.primarySection}>
				<h2 className={cx(fr.cx('fr-h2'))}>Les indicateurs clés</h2>
				<p></p>
				<div
					className={cx(fr.cx('fr-accordions-group'), classes.accordionGroup)}
				>
					{proceduresTableHeaders.slice(0, 5).map(pth => (
						<AccordionWithIcon
							key={pth.id}
							className={classes.accordion}
							icon={pth.icon as RiIconClassName}
							label={pth.label}
						>
							<ProcedureHeaderContent slug={pth.slug} isFull />
						</AccordionWithIcon>
					))}
				</div>
			</div>
			<div className={classes.secondarySection}>
				<h2 className={cx(fr.cx('fr-h2'))}>Les indicateurs complémentaires</h2>
				<p>
					Des indicateurs complémentaires permettent aux équipes d’affiner
					l’identification d’opportunités d’améliorations.
				</p>
				<div
					className={cx(fr.cx('fr-accordions-group'), classes.accordionGroup)}
				>
					{proceduresTableHeaders.slice(5).map(pth => (
						<AccordionWithIcon
							key={pth.id}
							className={classes.accordion}
							icon={pth.icon as RiIconClassName}
							label={pth.label}
						>
							<ProcedureHeaderContent slug={pth.slug} isFull />
						</AccordionWithIcon>
					))}
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
