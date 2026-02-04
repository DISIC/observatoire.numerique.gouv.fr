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
	areas?: (DataLevel & { threshold: number })[];
	isReversed?: boolean;
	title?: string;
};

const ComposedChartCustom = ({
	data,
	showCrossScorePerimeter,
	ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	areas,
	isReversed,
	title
}: ComposedChartCustomProps) => {
	const formattedData = data.map(item => {
		const values = item.values.map(value => ({
			...value,
			score: value.value,
			cross: value.cross ?? 0
		}));
		return {
			name: item.name,
			score: values[0]?.score ?? 0,
			cross: values[0]?.cross ?? 0,
			values
		};
	});

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload[0] && payload[0].payload.values.length) {
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
					<b>{payload[0].payload.name}</b>
					<p style={{ margin: 0 }}>
						{payload[0].payload.values[0].label}:{' '}
						<b>{payload[0].payload.values[0].valueLabel}</b>
					</p>
					{showCrossScorePerimeter && (
						<p style={{ margin: 0 }}>
							Moyenne de l'observatoire:{' '}
							<b>{payload[0].payload.values[0].crossValueLabel}</b>
						</p>
					)}
				</div>
			);
		}

		return null;
	};

	return (
		<ResponsiveContainer width="100%" height="100%">
			<ComposedChart
				data={formattedData}
				margin={{ bottom: 20, left: -20 }}
				accessibilityLayer
				tabIndex={-1}
			>
				<XAxis
					dataKey="name"
					tickLine={false}
					axisLine={{
						stroke: fr.colors.decisions.background.contrast.blueFrance.default
					}}
					fontSize="0.825rem"
					orientation={isReversed ? 'top' : 'bottom'}
				/>
				<YAxis
					tickCount={ticks.length}
					ticks={ticks}
					tickLine={false}
					axisLine={{
						stroke: fr.colors.decisions.background.contrast.blueFrance.default
					}}
					reversed={isReversed}
					unit={ticks[ticks.length - 1] === 100 ? '%' : ''}
					fontSize="0.825rem"
				/>
				<Tooltip cursor={false} content={<CustomTooltip />} />
				<Legend
					verticalAlign="top"
					align="left"
					iconType="circle"
					wrapperStyle={{ paddingBottom: 20, left: 10 }}
					formatter={value => (
						<span
							style={{
								color: 'black'
							}}
						>
							{value}
						</span>
					)}
				/>
				<Line
					type="linear"
					activeDot={false}
					dot={{
						r: 4,
						strokeWidth: 0,
						fill: fr.colors.decisions.artwork.minor.blueFrance.default
					}}
					dataKey="score"
					name={title}
					strokeWidth={1.5}
					stroke={fr.colors.decisions.artwork.minor.blueFrance.default}
				/>
				{areas?.map((area, index) => {
					const minThreshold = area.threshold;
					const maxThreshold =
						areas[index + 1]?.threshold ?? (ticks[ticks.length - 1] as number);
					return (
						<ReferenceArea
							key={index}
							y1={minThreshold}
							y2={maxThreshold}
							fill={area.color + '14'}
							stroke={area.color + '14'}
						>
							<Label
								position={'insideLeft'}
								value={area.label}
								offset={10}
								style={{ fill: area.color }}
								fontSize="0.75rem"
							/>
						</ReferenceArea>
					);
				})}

				{showCrossScorePerimeter && (
					<Line
						type="linear"
						dot={{
							r: 4,
							strokeWidth: 0,
							fill: 'black'
						}}
						dataKey="cross"
						name="Moyenne de l'observatoire"
						strokeWidth={1.5}
						stroke={'black'}
						strokeDasharray="6 6"
						strokeLinecap="round"
					/>
				)}
			</ComposedChart>
		</ResponsiveContainer>
	);
};

export default ComposedChartCustom;
