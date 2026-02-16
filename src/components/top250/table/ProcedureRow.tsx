import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { getDisplayedVolume } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import { Edition, IndicatorSlug } from '@prisma/client';
import React, { useMemo } from 'react';
import { IndicatorLabel } from './IndicatorLabel';
import { IndicatorProactive } from './IndicatorProactive';
import { IndicatorValue } from './IndicatorValue';
import { SkipLinks } from '@/components/generic/SkipLinks';
import { PayloadIndicator } from '@/payload/payload-types';

type Props = {
	procedure: ProcedureWithFields;
	indicators: PayloadIndicator[];
	edition?: Edition;
	index: number;
	onScrollReset: () => void;
	skipLinksTdClassName: string;
};

const skipLinks = [
	{ text: 'Revenir au dessus du tableau', href: '#procedures-section' }
];

function ProcedureRowInner(props: Props) {
	const {
		procedure: p,
		indicators,
		edition,
		index,
		onScrollReset,
		skipLinksTdClassName
	} = props;

	const isProactive = useMemo(
		() =>
			p.fields.some(
				f => f.slug === 'online' && f.label === 'Démarche proactive'
			),
		[p.fields]
	);
	const isToCome = useMemo(
		() => p.fields.some(f => f.slug === 'online' && f.label === 'À venir'),
		[p.fields]
	);
	const isNotOnline = useMemo(
		() => p.fields.some(f => f.slug === 'online' && f.label === 'Non'),
		[p.fields]
	);

	return (
		<React.Fragment>
			<tr id={`procedure-table-row-${index}`}>
				<th scope="row">
					<div>
						<span>{p.title}</span>
						<br />
						<div className={fr.cx('fr-text--sm', 'fr-mt-1v', 'fr-mb-0')}>
							{p.ministere}
						</div>
						<span className={fr.cx('fr-text--sm')}>{p.administration}</span>
						<div className={fr.cx('fr-text--xs', 'fr-mt-2v', 'fr-mb-0')}>
							Volumétrie en ligne :{' '}
							{p.volume ? getDisplayedVolume(p.volume) : 'non communiquée'}
						</div>
					</div>
				</th>
				{indicators.map((indicator, idx) => {
					const field = p.fields.find(f => f.slug === indicator.slug);

					if (!field) return <td key={`${p.id}-${indicator.slug}`}>-</td>;

					if (isProactive && (idx === 1 || idx === 5))
						return (
							<td colSpan={idx === 1 ? 4 : 6} key={`${p.id}-${indicator.slug}`}>
								<IndicatorProactive />
							</td>
						);
					else if (isProactive && field.slug !== 'online') return null;

					if (isToCome && field.slug !== 'online')
						return (
							<td key={`${p.id}-${indicator.slug}`}>
								<IndicatorLabel color="gray" label="À venir" />
							</td>
						);

					if (isNotOnline && field.slug !== 'online')
						return (
							<td key={`${p.id}-${indicator.slug}`}>
								<IndicatorLabel color="gray" label="-" noBackground />
							</td>
						);

					return (
						<td key={`${p.id}-${indicator.slug}`}>
							<IndicatorLabel {...field} />
							{!!field.value && !isNotOnline && (
								<IndicatorValue
									slug={field.slug}
									value={field.value}
									label={field.label}
									noJdma={p.noJdma}
									procedureId={p.jdma_identifier}
									gristId={p.grist_identifier}
									procedureTitle={p.title}
									edition={edition}
									onLinkFocus={onScrollReset}
								/>
							)}
						</td>
					);
				})}
				<td>
					<span></span>
				</td>
			</tr>
			<tr>
				<td className={`${skipLinksTdClassName} ${fr.cx('fr-pl-1-5v')}`}>
					<SkipLinks links={skipLinks} />
				</td>
			</tr>
		</React.Fragment>
	);
}

export const ProcedureRow = React.memo(ProcedureRowInner);
