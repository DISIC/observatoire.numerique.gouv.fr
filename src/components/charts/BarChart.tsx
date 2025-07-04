import { DataLevel, RecordDataGrouped } from '@/pages/api/indicator-evolution';
import { getColorValue } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import React from 'react';
import {
	Bar,
	BarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

const renderLegend = (props: any) => {
	const { payload } = props;

	return (
		<div
			style={{
				display: 'flex',
				gap: '20px',
				marginLeft: '25px',
				marginBottom: fr.spacing('6v'),
				flexWrap: 'wrap'
			}}
		>
			{payload
				.sort((a: any, b: any) => a.position - b.position)
				.map((entry: any, index: number) => (
					<div
						key={index}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '5px',
							fontSize: '14px'
						}}
					>
						<div
							style={{
								width: '10px',
								height: '10px',
								borderRadius: '50%',
								backgroundColor: entry.color
							}}
						/>
						{entry.value}
					</div>
				))}
		</div>
	);
};

const CustomYAxisTick = (props: any) => {
	const { x, y, payload } = props;

	return (
		<g transform={`translate(${x},${y})`}>
			<text x={0} y={0} dy={4} textAnchor="end" fill="#666" fontSize="0.75rem">
				{payload.value}%
			</text>
		</g>
	);
};

const CustomBar = (props: any) => {
	const { x, y, width, height, value, color } = props;

	if (value === 0) return null;

	return (
		<g>
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				fill={color}
				ry={5}
				style={{ stroke: '#fff', strokeWidth: 2 }}
			/>
		</g>
	);
};

type BarChartProps = {
	data: RecordDataGrouped[];
	dataKeys: DataLevel[];
	chartRef?: React.RefObject<any>;
};

const CustomBarChart = ({ data, dataKeys, chartRef }: BarChartProps) => {
	const transformedData = data.map(item => {
		const result: any = { name: item.name };
		const total = item.values.reduce((sum, value) => sum + value.value, 0);
		item.values.forEach(value => {
			const percentage = total > 0 ? (value.value / total) * 100 : 0;
			result[value.label] = percentage;
		});
		return result;
	});

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div
					style={{
						backgroundColor:
							fr.colors.decisions.background.default.grey.default,
						padding: '10px',
						boxShadow: '0px 2px 6px 0px #00001229',
						textAlign: 'left'
					}}
				>
					{payload
						.sort((a: any, b: any) => {
							const aKey = dataKeys.find(key => key.label === a.dataKey);
							const bKey = dataKeys.find(key => key.label === b.dataKey);
							return (aKey?.position ?? 0) - (bKey?.position ?? 0);
						})
						.map((payloadItem: any, index: number) => {
							const originalItem = data.find(item => item.name === label);
							const originalValue = originalItem?.values.find(
								v => v.label === payloadItem.dataKey
							);

							return (
								<p key={index} style={{ margin: 0 }}>
									<span style={{ color: payloadItem.color }}>
										{payloadItem.dataKey}
									</span>
									{` : ${Math.round(payloadItem.value)}%, soit ${
										originalValue?.value || 0
									} démarches`}
								</p>
							);
						})}
				</div>
			);
		}

		return null;
	};

	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
				role="img"
				data={transformedData}
				margin={{ bottom: 20 }}
				ref={chartRef}
			>
				<XAxis
					axisLine={{
						stroke: fr.colors.decisions.background.contrast.blueFrance.default
					}}
					dataKey="name"
					fontSize="0.75rem"
					tickLine={false}
					padding={{ left: 10 }}
				/>
				<YAxis
					axisLine={{
						stroke: fr.colors.decisions.background.contrast.blueFrance.default
					}}
					domain={[0, 100]}
					ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
					tick={<CustomYAxisTick />}
					tickLine={false}
					fontSize="0.75rem"
				/>
				<Tooltip cursor={false} content={<CustomTooltip />} />
				<Legend
					verticalAlign="top"
					align="left"
					height={60}
					content={renderLegend}
				/>

				{dataKeys
					.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
					.map((key, index) => {
						return (
							<Bar
								key={index}
								dataKey={key.label}
								name={key.label}
								fill={getColorValue(key.color)}
								radius={4}
								stackId={'a'}
								barSize={25}
								shape={<CustomBar color={getColorValue(key.color)} />}
								style={{ stroke: '#fff', strokeWidth: 2 }}
							/>
						);
					})}
			</BarChart>
		</ResponsiveContainer>
	);
};

export default CustomBarChart;
