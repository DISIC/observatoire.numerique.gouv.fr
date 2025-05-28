import { fr } from '@codegouvfr/react-dsfr';
import React from 'react';
import {
	BarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

type BarChartProps = {
	data: { name: string; [key: string]: number | string }[];
	dataKeys: { label: string; color: string; position?: number }[];
};

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
				// .sort((a: any, b: any) => sortOrder[a.value] - sortOrder[b.value])
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
								width: '24px',
								height: '24px',
								borderRadius: 5,
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

	if (payload.value === 12) return null;

	return (
		<g transform={`translate(${x},${y})`}>
			<text x={0} y={0} dy={4} textAnchor="end" fill="#666" fontSize="0.75rem">
				{payload.value}%
			</text>
		</g>
	);
};

const CustomBarChart = ({ data }: BarChartProps) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart role="img" data={data}>
				<XAxis
					axisLine={false}
					dataKey="name"
					fontSize="0.75rem"
					tickLine={false}
					padding={{ left: 20 }}
				/>
				<YAxis
					axisLine={false}
					domain={[0, 1]}
					ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
					tick={<CustomYAxisTick />}
					tickLine={false}
					fontSize="0.75rem"
				/>
				<Tooltip cursor={false} />
				<Legend verticalAlign="top" align="left" content={renderLegend} />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default CustomBarChart;
