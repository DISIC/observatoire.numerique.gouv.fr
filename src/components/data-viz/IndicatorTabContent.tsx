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
	shouldShowGoalLine?: boolean;
	shouldShowCrossScorePerimeter?: boolean;
	title?: string;
};

const IndicatorTabContent = ({
	data,
	viewType,
	setViewType,
	chartRef,
	shouldShowGoalLine,
	shouldShowCrossScorePerimeter,
	chartType = 'bar',
	field,
	title
}: TabContentProps) => {
	const { classes, cx } = useStyles();
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);
	const [showGoalLine, setShowGoalLine] = useState(false);

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
			{(shouldShowGoalLine || shouldShowCrossScorePerimeter) &&
				data.indicator?.slug !== 'auth' && (
					<div
						style={{
							position: 'absolute',
							top: '2.25rem',
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'end',
							zIndex: 10
						}}
					>
						{shouldShowGoalLine && (
							<Checkbox
								options={[
									{
										label: 'Objectif',
										nativeInputProps: {
											name: 'checkboxes-1',
											value: 'value1',
											onChange: e => setShowGoalLine(e.target.checked)
										}
									}
								]}
								orientation="horizontal"
								state="default"
								small
							/>
						)}
						{shouldShowCrossScorePerimeter && (
							<Checkbox
								options={[
									{
										label: 'Moyenne inter-périmètre',
										nativeInputProps: {
											name: 'checkboxes-1',
											value: 'value2',
											onChange: e =>
												setShowCrossScorePerimeter(e.target.checked)
										}
									}
								]}
								orientation="horizontal"
								state="default"
								small
							/>
						)}
					</div>
				)}

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
							size="small"
							onChange={value => setViewType(value as EvolutionViewType)}
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
		justifyContent: 'flex-end'
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
	}
});

export default IndicatorTabContent;
