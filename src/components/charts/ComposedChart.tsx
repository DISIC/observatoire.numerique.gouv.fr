import { DataLevel, RecordDataGrouped } from '@/pages/api/indicator-evolution';
import { fr } from '@codegouvfr/react-dsfr';
import {
	ComposedChart,
	Label,
	Legend,
	Line,
	ReferenceArea,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

type ComposedChartCustomProps = {
	data: RecordDataGrouped[];
	showCrossScorePerimeter?: boolean;
	ticks?: (number | string)[];
	areas?: (DataLevel & { treshold: number })[];
};

const ComposedChartCustom = ({
	data,
	showCrossScorePerimeter,
	ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}: ComposedChartCustomProps) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<ComposedChart data={data} margin={{ bottom: 20, left: -20 }}>
				<XAxis
					dataKey="name"
					tickLine={false}
					axisLine={{
						stroke: fr.colors.decisions.background.contrast.blueFrance.default
					}}
					fontSize="0.825rem"
				/>
				<YAxis
					tickCount={ticks.length}
					ticks={ticks}
					tickLine={false}
					axisLine={{
						stroke: fr.colors.decisions.background.contrast.blueFrance.default
					}}
					fontSize="0.825rem"
				/>
				<Tooltip />
				<Legend
					verticalAlign="top"
					align="left"
					iconType="circle"
					wrapperStyle={{ paddingBottom: 20, left: 0 }}
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
					y2={3}
					fill="#CE050014"
					stroke="#CE050014"
				>
					<Label
						position={'insideLeft'}
						value={'Critique'}
						offset={10}
						style={{ fill: 'red' }}
					/>
				</ReferenceArea>

				{showCrossScorePerimeter && (
					<Line
						type="linear"
						activeDot={false}
						dot={{
							r: 4,
							strokeWidth: 0,
							fill: fr.colors.options.orangeTerreBattue.main645.default
						}}
						dataKey="cross"
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
