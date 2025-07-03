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

const BarChartCustom = dynamic(() => import('@/components/charts/BarChart'));
const ComposedChartCustom = dynamic(
	() => import('@/components/charts/ComposedChart')
);

type TabContentProps = {
	setViewType: (viewType: EvolutionViewType) => void;
	data: IndicatorEvolutionResponse;
	chartRef: React.RefObject<HTMLDivElement | null>;
	chartType?: 'bar' | 'line';
	shouldShowGoalLine?: boolean;
	shouldShowCrossScorePerimeter?: boolean;
};

const IndicatorTabContent = ({
	data,
	setViewType,
	chartRef,
	shouldShowGoalLine,
	shouldShowCrossScorePerimeter,
	chartType = 'bar'
}: TabContentProps) => {
	const { classes, cx } = useStyles();
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);
	const [showGoalLine, setShowGoalLine] = useState(false);

	return (
		<div className={classes.tabContent}>
			{(shouldShowGoalLine || shouldShowCrossScorePerimeter) && (
				<div
					style={{
						position: 'absolute',
						top: '2.25rem',
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'end'
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
										onChange: e => setShowCrossScorePerimeter(e.target.checked)
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
					<ComposedChartCustom data={data.groupedData} areas={[]} />
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
					defaultValue={'edition'}
					size="small"
					onChange={value => setViewType(value as EvolutionViewType)}
					className={classes.selectViewType}
				/>
			</div>
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
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
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
	}
});

export default IndicatorTabContent;
