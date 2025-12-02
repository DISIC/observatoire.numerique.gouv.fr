import {
	EvolutionViewType,
	IndicatorEvolutionResponse,
	RecordDataGrouped
} from '@/pages/api/indicator-evolution';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { tss } from 'tss-react';
import { LightSelect } from '../generic/LightSelect';
import { fr } from '@codegouvfr/react-dsfr';
import { getColorValue } from '@/utils/tools';
import { IndicatorLabel } from '../top250/table/IndicatorLabel';
import { Field } from '@prisma/client';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

const BarChartCustom = dynamic(() => import('@/components/charts/BarChart'));
const ComposedChartCustom = dynamic(
	() => import('@/components/charts/ComposedChart')
);

type TabContentProps = {
	viewType: EvolutionViewType;
	setViewType: (viewType: EvolutionViewType) => void;
	data: IndicatorEvolutionResponse;
	field?: Field;
	chartRef: React.RefObject<HTMLDivElement | null>;
	chartType?: 'bar' | 'line';
	title?: string;
	showCrossScorePerimeter?: boolean;
};

const IndicatorTabContent = ({
	data,
	viewType,
	setViewType,
	chartRef,
	chartType = 'bar',
	field,
	title,
	showCrossScorePerimeter
}: TabContentProps) => {
	const { classes, cx } = useStyles();

	return (
		<div
			className={cx(
				classes.tabContent,
				fr.cx(
					data.indicator?.slug !== 'auth'
						? ['fr-py-3w', 'fr-px-4v']
						: ['fr-py-15v', 'fr-px-6v']
				)
			)}
		>
			{data.indicator?.slug !== 'auth' || chartType === 'bar' ? (
				<>
					<div className={cx(classes.chart)} ref={chartRef}>
						{chartType === 'bar' ? (
							<BarChartCustom
								dataKeys={
									data.groupedData[0]?.values.map(value => ({
										label: value.label,
										color: value.color,
										position: value.position
									})) || []
								}
								data={data.groupedData}
							/>
						) : (
							<ComposedChartCustom
								data={data.groupedData || []}
								ticks={
									(data.indicator?.threshold_max ?? 0) > 10
										? Array.from({ length: 11 }, (_, i) =>
												Math.round(
													((data.indicator?.threshold_max ?? 0) / 10) * i
												)
										  )
										: Array.from(
												{ length: (data.indicator?.threshold_max ?? 0) + 1 },
												(_, i) => i
										  )
								}
								areas={
									data.indicator?.levels?.docs
										?.map(level => {
											if (
												typeof level === 'string' ||
												!level.label_stats ||
												level.threshold === undefined ||
												level.threshold === null
											)
												return;

											return {
												label: level.label_stats,
												threshold: level.threshold,
												color: getColorValue(level.color),
												position: level.position
											};
										})
										.filter(e => !!e)
										.sort((a, b) =>
											data.indicator.slug === 'dlnuf'
												? (a.position ?? 0) - (b.position ?? 0)
												: (b.position ?? 0) - (a.position ?? 0)
										) || []
								}
								showCrossScorePerimeter={showCrossScorePerimeter}
								isReversed={data.indicator?.slug === 'dlnuf'}
								title={title}
							/>
						)}
					</div>
					<div className={classes.viewTypeContainer}>
						<div className={classes.linkContainer}>
							<Link
								href="/Aide/Observatoire?tab=indicators"
								className={fr.cx('fr-link')}
							>
								Tout comprendre sur les indicateurs{' '}
								<i
									className={fr.cx('fr-icon-external-link-line', 'fr-ml-1v')}
								/>
							</Link>
						</div>
						<LightSelect
							label=""
							id="select-view"
							options={[
								{
									label: 'Éditions',
									value: 'edition'
								},
								{
									label: 'Années',
									value: 'year'
								}
							]}
							defaultValue={viewType}
							triggerValue={viewType}
							size="small"
							onChange={value => {
								if (!!value) setViewType(value as EvolutionViewType);
							}}
							className={classes.selectViewType}
						/>
					</div>
				</>
			) : (
				<>
					<div className={classes.indicatorValueContainer}>
						<span>{data.indicator?.label}&nbsp;:</span>
						<IndicatorLabel
							label={field?.label || 'Aucune donnée disponible'}
							color={field?.color || 'gray'}
							noBackground={field?.noBackground}
						/>
					</div>
					<Alert
						severity="info"
						small
						description="Cet indicateur ne permet pas d’afficher un graphique"
					/>
				</>
			)}
		</div>
	);
};

const useStyles = tss.create({
	tabContent: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: fr.spacing('2v'),
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	chart: {
		width: '100%',
		height: '500px'
	},
	viewTypeContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: `0 ${fr.spacing('2v')}`,
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column-reverse',
			gap: fr.spacing('4v'),
			alignItems: 'flex-end'
		}
	},
	selectViewType: {
		['select.fr-select']: {
			width: '100%'
		},
		width: '7rem'
	},
	indicatorValueContainer: {
		padding: fr.spacing('5v'),
		backgroundColor:
			fr.colors.getHex({ isDark: false }).decisions.background.alt.blueFrance
				.default + '80',
		borderRadius: fr.spacing('3v'),
		display: 'flex',
		gap: fr.spacing('2v'),
		marginBottom: fr.spacing('10v')
	},
	linkContainer: {
		width: '100%',
		display: 'flex',
		a: {
			fontSize: '14px',
			'i::after, i::before': {
				'--icon-size': '14px'
			}
		}
	}
});

export default IndicatorTabContent;
