import { RecordData } from '@/utils/data-viz-client';
import { fr } from '@codegouvfr/react-dsfr';
import { cpSync } from 'fs';
import {
	Area,
	ComposedChart,
	Customized,
	Label,
	LabelList,
	Legend,
	Line,
	ReferenceArea,
	ResponsiveContainer,
	Text,
	Tooltip,
	XAxis,
	YAxis
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
		amt: 2400
	},
	{
		name: 'Page C',
		uv: 2000,
		pv: 9800,
		amt: 2400
	},
	{
		name: 'Page D',
		uv: 2780,
		pv: 3908,
		amt: 2400
	},
	{
		name: 'Page E',
		uv: 1890,
		pv: 4800,
		amt: 2400
	},
	{
		name: 'Page F',
		uv: 2390,
		pv: 3800,
		amt: 2400
	},
	{
		name: 'Page G',
		uv: 3490,
		pv: 4300,
		amt: 2400
	}
];

type ComposedChartCustomProps = {
	data?: RecordData['data'];
	showGoalLine?: boolean;
	showCrossScorePerimeter?: boolean;
};

const ComposedChartCustom = ({
	showGoalLine,
	showCrossScorePerimeter
}: ComposedChartCustomProps) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<ComposedChart data={data}>
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
				<ReferenceArea
					type={'monotone'}
					y1={0}
					y2={3000}
					fill="#CE050014"
					stroke="#CE050014"
				>
					<Label
						position={'insideLeft'}
						value={'CACACACACAC'}
						offset={10}
						style={{ fill: 'red' }}
					/>
				</ReferenceArea>

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
			</ComposedChart>
		</ResponsiveContainer>
	);
};

export default ComposedChartCustom;
