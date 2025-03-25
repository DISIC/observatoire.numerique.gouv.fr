import { RecordData } from '@/utils/data-viz';
import { fr } from '@codegouvfr/react-dsfr';
import React, { useState } from 'react';
import {
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	ResponsiveContainer,
	Tooltip
} from 'recharts';
import { tss } from 'tss-react';

const CustomAxisTick = (props: any) => {
	if (props.payload.value === 0) return <></>;
	return (
		<text
			x={props.x}
			y={props.y + 14}
			fill="#666"
			fontSize={10}
			textAnchor={props.textAnchor}
		>
			{props.payload.value}%
		</text>
	);
};

const CustomAxisTickLabel = (props: any) => {
	const { classes, cx: cxStyles } = useStyles();

	const { x, y, payload, cx, cy, onMouseEnter, onMouseLeave, activeIcon } =
		props;

	const iconSize = 20;

	// Get the center point of the chart (should be passed as props)
	const centerX = cx || 0;
	const centerY = cy || 0;

	// Calculate the angle of this tick relative to the center
	const angle = Math.atan2(y - centerY, x - centerX);

	// Distance to offset the icon from its original position
	const spacing = 18; // Adjust this value to increase/decrease spacing

	// Calculate the new position with spacing
	// Using the angle to maintain the correct direction from the center
	const newX = x + Math.cos(angle) * spacing;
	const newY = y + Math.sin(angle) * spacing;

	const isActive = activeIcon === payload.value;
	// const displayName = data.find((d: any) => d.icon === activeIcon)?.name || '';
	const displayName = 'test';

	const handleMouseEnter = () => {
		if (onMouseEnter && payload) {
			onMouseEnter(payload);
		}
	};

	const handleMouseLeave = () => {
		if (onMouseLeave) {
			onMouseLeave();
		}
	};

	return (
		<g>
			<foreignObject
				x={newX - iconSize / 2}
				y={newY - iconSize / 2}
				width={iconSize}
				height={iconSize}
				color={
					isActive
						? fr.colors.decisions.background.flat.blueFrance.default
						: fr.colors.getHex({ isDark: true }).decisions.background
								.contrastOverlap.grey.active
				}
			>
				<i className={cxStyles(classes.icon, payload.value)} />
			</foreignObject>
			<circle
				cx={newX}
				cy={newY}
				r={20}
				fill="transparent"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			/>
			{isActive && (
				<>
					<rect
						x={newX + iconSize}
						y={newY - 30 / 2}
						height={30}
						width={displayName.length * 8}
						rx={2}
						fill={fr.colors.decisions.background.flat.blueFrance.default}
					></rect>
					<text
						x={newX + iconSize + 8}
						y={newY + 5}
						textAnchor="right"
						fontSize={14}
						fill="white"
					>
						{displayName}
					</text>
				</>
			)}
		</g>
	);
};

type RadarChartCustomProps = {
	data: RecordData['data'];
	showGoalRadar: boolean;
	showCrossScorePerimeter: boolean;
};

const RadarChartCustom = ({
	data,
	showGoalRadar,
	showCrossScorePerimeter
}: RadarChartCustomProps) => {
	const [activeIcon, setActiveIcon] = useState<string | null>(null);

	const handleIconMouseEnter = (dataItem: any) => {
		setActiveIcon(dataItem.value);
	};

	const handleIconMouseLeave = () => {
		setActiveIcon(null);
	};

	return (
		<ResponsiveContainer width="100%" height="100%">
			<RadarChart data={data} accessibilityLayer>
				<PolarGrid
					stroke={fr.colors.decisions.artwork.decorative.blueFrance.default}
				/>
				<PolarAngleAxis
					dataKey="icon"
					tick={props => (
						<CustomAxisTickLabel
							{...props}
							onMouseEnter={handleIconMouseEnter}
							onMouseLeave={handleIconMouseLeave}
							activeIcon={activeIcon}
						/>
					)}
				/>
				<PolarRadiusAxis
					angle={90}
					domain={[0, 100]}
					orientation="middle"
					stroke="transparent"
					tick={<CustomAxisTick />}
					tickCount={6}
				/>
				<Radar
					name="Valeur"
					dataKey="score"
					stroke={fr.colors.decisions.artwork.minor.blueFrance.default}
					fill={fr.colors.decisions.artwork.minor.blueFrance.default}
					fillOpacity={0.2}
				/>
				{showGoalRadar && (
					<Radar
						name="Objectif"
						dataKey="goal"
						stroke={fr.colors.decisions.background.flat.success.default}
						fill={fr.colors.decisions.background.flat.success.default}
						fillOpacity={0.2}
					/>
				)}
				{showCrossScorePerimeter && (
					<Radar
						name="Moyenne cross-perimètre"
						dataKey="cross"
						stroke={fr.colors.options.orangeTerreBattue.main645.default}
						fill={fr.colors.options.orangeTerreBattue.main645.default}
						fillOpacity={0.2}
					/>
				)}
				<Tooltip
					labelFormatter={(_, payload) => payload[0]?.payload.name || ''}
					formatter={(value, _, { name }) => [`${value}%`, name]}
				/>
			</RadarChart>
		</ResponsiveContainer>
	);
};

const useStyles = tss.withName(RadarChartCustom.name).create(() => ({
	icon: {
		'::before': {
			'--icon-size': '1.25rem'
		}
	}
}));

export default RadarChartCustom;
