import { RecordData } from '@/utils/data-viz';
import { fr } from '@codegouvfr/react-dsfr';
import React, { useState } from 'react';
import {
	ResponsiveContainer,
	Tooltip,
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Legend,
	Line
} from 'recharts';

const data = [
	{
		name: 'Page A',
		uv: 4000,
		pv: 2400,
		amt: 2400
	},
	{
		name: 'Page B',
		uv: 3000,
		pv: 1398,
		amt: 2210
	},
	{
		name: 'Page C',
		uv: 2000,
		pv: 9800,
		amt: 2290
	},
	{
		name: 'Page D',
		uv: 2780,
		pv: 3908,
		amt: 2000
	},
	{
		name: 'Page E',
		uv: 1890,
		pv: 4800,
		amt: 2181
	},
	{
		name: 'Page F',
		uv: 2390,
		pv: 3800,
		amt: 2500
	},
	{
		name: 'Page G',
		uv: 3490,
		pv: 4300,
		amt: 2100
	}
];

type LineChartCustomProps = {
	data?: RecordData['data'];
	showGoalLine?: boolean;
	showCrossScorePerimeter?: boolean;
};

const LineChartCustom = ({
	showGoalLine,
	showCrossScorePerimeter
}: LineChartCustomProps) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={data}>
				<XAxis dataKey="name" tickLine={false} />
				<YAxis tickCount={10} domain={[0, 10]} tickLine={false} />
				<Tooltip />
				<Legend
					verticalAlign="top"
					align="left"
					iconType="circle"
					wrapperStyle={{ paddingBottom: 20 }}
				/>
				<Line
					type="linear"
					activeDot={false}
					dot={{
						r: 4,
						strokeWidth: 0,
						fill: fr.colors.decisions.artwork.minor.blueFrance.default
					}}
					dataKey="pv"
					strokeWidth={1.5}
					stroke={fr.colors.decisions.artwork.minor.blueFrance.default}
				/>
				{showGoalLine && (
					<Line
						type="linear"
						activeDot={false}
						dot={{
							r: 4,
							strokeWidth: 0,
							fill: fr.colors.decisions.background.flat.success.default
						}}
						dataKey="uv"
						strokeWidth={1.5}
						stroke={fr.colors.decisions.background.flat.success.default}
						strokeDasharray="6 6"
						strokeLinecap="round"
					/>
				)}
				{showCrossScorePerimeter && (
					<Line
						type="linear"
						activeDot={false}
						dot={{
							r: 4,
							strokeWidth: 0,
							fill: fr.colors.options.orangeTerreBattue.main645.default
						}}
						dataKey="amt"
						strokeWidth={1.5}
						stroke={fr.colors.options.orangeTerreBattue.main645.default}
						strokeDasharray="6 6"
						strokeLinecap="round"
					/>
				)}
			</LineChart>
		</ResponsiveContainer>
	);
};

export default LineChartCustom;
