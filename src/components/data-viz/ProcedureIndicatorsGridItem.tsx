import { ProcedureKind } from '@/pages/api/indicator-scores';
import { ProcedureWithFieldsAndEditions } from '@/pages/api/procedures/types';
import { PayloadIndicator } from '@/payload/payload-types';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/router';
import { tss } from 'tss-react';
import { IndicatorLabel } from '../top250/table/IndicatorLabel';

type ProcedureIndicatorsGridItemProps = {
	procedure: ProcedureWithFieldsAndEditions;
	indicators: PayloadIndicator[];
	showCompareButton?: boolean;
};
const ProcedureIndicatorsGridItem = ({
	procedure,
	indicators,
	showCompareButton = true
}: ProcedureIndicatorsGridItemProps) => {
	const router = useRouter();
	const { kind, slug: tmpSlug } = router.query as {
		kind: ProcedureKind;
		slug: string;
	};
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.gridItem)}>
			<div>
				<h2 className={cx(classes.gridTitle, 'fr-text--lg')}>
					{procedure.title}
				</h2>
				<p className={cx('fr-text--xs', 'fr-mb-0')}>
					{procedure.administration}
				</p>
			</div>
			<div className={cx(classes.procredureStats)}>
				{indicators.map((indicator, index) => {
					const field = procedure.fields.find(f => f.slug === indicator.slug);

					if (!field) return null;

					return (
						<div
							key={`${procedure.id}-${indicator.id}`}
							className={classes.indicator}
							style={{
								backgroundColor:
									index % 2
										? fr.colors.decisions.artwork.background.blueFrance.default
										: 'transparent'
							}}
						>
							<div className={classes.indicatorLabelContainer}>
								<i className={cx(fr.cx(indicator.icon, 'fr-mr-2v'))} />
								<span className={classes.indicatorLabel}>
									{indicator.label}
								</span>
							</div>
							<IndicatorLabel {...field} />
						</div>
					);
				})}
			</div>
			<div className={cx(classes.buttonsGroup)}>
				{showCompareButton && (
					<Button
						priority="secondary"
						size="small"
						linkProps={{
							href: `/data-viz/${kind}/${tmpSlug}/procedures/${procedure.id}/comparison`
						}}
					>
						Comparer
					</Button>
				)}
				<Button
					priority="secondary"
					size="small"
					linkProps={{
						href: `/data-viz/${kind}/${tmpSlug}/procedures/${procedure.id}/details`
					}}
				>
					Voir le détail
				</Button>
			</div>
		</div>
	);
};

const useStyles = tss.create({
	gridItem: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		textAlign: 'center',
		gap: fr.spacing('5v'),
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	gridTitle: {
		fontWeight: 500,
		color: fr.colors.decisions.text.title.grey.default,
		marginBottom: fr.spacing('1v')
	},
	procredureStats: {
		...fr.spacing('padding', { rightLeft: '4v' }),
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`,
		borderRadius: fr.spacing('2v'),
		width: '100%',
		marginTop: 'auto'
	},
	indicator: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: fr.spacing('4v'),
		borderRadius: fr.spacing('3v'),
		width: '100%',
		'i::before, i::after ': {
			'--icon-size': '1.25rem',
			color: fr.colors.decisions.text.title.blueFrance.default
		}
	},
	indicatorLabelContainer: {
		alignItems: 'center'
	},
	indicatorLabel: {
		fontWeight: 500,
		fontSize: '0.875rem',
		lineHeight: '1.5rem'
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	}
});

export default ProcedureIndicatorsGridItem;
