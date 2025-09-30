import { RecordData } from '@/utils/data-viz-client';
import { fr } from '@codegouvfr/react-dsfr';
import React, { useState } from 'react';
import {
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	ResponsiveContainer,
	Tooltip,
	Legend,
	TooltipProps
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
			<defs>
				<symbol id="ri-open-arm-line" viewBox="0 0 24 24" fill="currentColor">
					<path d="M18.0004 17V22H16.0004V17C16.0004 12.5487 18.6444 8.71498 22.4475 6.98352L23.2753 8.8047C20.1637 10.2213 18.0004 13.3581 18.0004 17ZM8.00045 17V22H6.00045V17C6.00045 13.3581 3.83723 10.2213 0.725586 8.8047L1.55339 6.98352C5.35651 8.71498 8.00045 12.5487 8.00045 17ZM12.0004 12C9.23902 12 7.00045 9.76142 7.00045 7C7.00045 4.23858 9.23902 2 12.0004 2C14.7619 2 17.0004 4.23858 17.0004 7C17.0004 9.76142 14.7619 12 12.0004 12ZM12.0004 10C13.6573 10 15.0004 8.65685 15.0004 7C15.0004 5.34315 13.6573 4 12.0004 4C10.3436 4 9.00045 5.34315 9.00045 7C9.00045 8.65685 10.3436 10 12.0004 10Z" />
				</symbol>
				<symbol id="ri-pass-valid-line" viewBox="0 0 24 24" fill="currentColor">
					<path d="M3 18H21V6H3V18ZM1 5C1 4.44772 1.44772 4 2 4H22C22.5523 4 23 4.44772 23 5V19C23 19.5523 22.5523 20 22 20H2C1.44772 20 1 19.5523 1 19V5ZM9 10C9 9.44772 8.55228 9 8 9C7.44772 9 7 9.44772 7 10C7 10.5523 7.44772 11 8 11C8.55228 11 9 10.5523 9 10ZM11 10C11 11.6569 9.65685 13 8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10ZM8.0018 16C7.03503 16 6.1614 16.3907 5.52693 17.0251L4.11272 15.6109C5.10693 14.6167 6.4833 14 8.0018 14C9.52031 14 10.8967 14.6167 11.8909 15.6109L10.4767 17.0251C9.84221 16.3907 8.96858 16 8.0018 16ZM16.2071 14.7071L20.2071 10.7071L18.7929 9.29289L15.5 12.5858L13.7071 10.7929L12.2929 12.2071L14.7929 14.7071L15.5 15.4142L16.2071 14.7071Z" />
				</symbol>
				<symbol id="ri-speak-line" viewBox="0 0 24 24" fill="currentColor">
					<path d="M16.9337 8.96494C16.426 5.03562 13.0675 2 9 2 4.58172 2 1 5.58172 1 10 1 11.8924 1.65707 13.6313 2.7555 15.0011 3.56351 16.0087 4.00033 17.1252 4.00025 18.3061L4 22H13L13.001 19H15C16.1046 19 17 18.1046 17 17V14.071L18.9593 13.2317C19.3025 13.0847 19.3324 12.7367 19.1842 12.5037L16.9337 8.96494ZM3 10C3 6.68629 5.68629 4 9 4 12.0243 4 14.5665 6.25141 14.9501 9.22118L15.0072 9.66262 16.5497 12.0881 15 12.7519V17H11.0017L11.0007 20H6.00013L6.00025 18.3063C6.00036 16.6672 5.40965 15.114 4.31578 13.7499 3.46818 12.6929 3 11.3849 3 10ZM21.1535 18.1024 19.4893 16.9929C20.4436 15.5642 21 13.8471 21 12.0001 21 10.153 20.4436 8.4359 19.4893 7.00722L21.1535 5.89771C22.32 7.64386 23 9.74254 23 12.0001 23 14.2576 22.32 16.3562 21.1535 18.1024Z" />
				</symbol>
				<symbol
					id="ri-lock-unlock-line"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z" />
				</symbol>
				<symbol
					id="ri-emoji-sticker-line"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M10.5199 19.8634C10.5955 18.6615 10.8833 17.5172 11.3463 16.4676C9.81124 16.3252 8.41864 15.6867 7.33309 14.7151L8.66691 13.2248C9.55217 14.0172 10.7188 14.4978 12 14.4978C12.1763 14.4978 12.3501 14.4887 12.5211 14.471C14.227 12.2169 16.8661 10.7083 19.8634 10.5199C19.1692 6.80877 15.9126 4 12 4C7.58172 4 4 7.58172 4 12C4 15.9126 6.80877 19.1692 10.5199 19.8634ZM19.0233 12.636C15.7891 13.2396 13.2396 15.7891 12.636 19.0233L19.0233 12.636ZM22 12C22 12.1677 21.9959 12.3344 21.9877 12.5L12.5 21.9877C12.3344 21.9959 12.1677 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM10 10C10 10.8284 9.32843 11.5 8.5 11.5C7.67157 11.5 7 10.8284 7 10C7 9.17157 7.67157 8.5 8.5 8.5C9.32843 8.5 10 9.17157 10 10ZM17 10C17 10.8284 16.3284 11.5 15.5 11.5C14.6716 11.5 14 10.8284 14 10C14 9.17157 14.6716 8.5 15.5 8.5C16.3284 8.5 17 9.17157 17 10Z" />
				</symbol>
			</defs>
			<use
				href={`#${payload.value}`}
				x={newX - iconSize / 2}
				y={newY - iconSize / 2}
				width={iconSize}
				height={iconSize}
				fill={
					isActive
						? fr.colors.decisions.background.flat.blueFrance.default
						: fr.colors.getHex({ isDark: true }).decisions.background
								.contrastOverlap.grey.active
				}
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
						textAnchor="end"
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

const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
	if (active && payload && payload.length) {
		return (
			<div
				style={{
					backgroundColor:
						fr.colors.decisions.background.actionHigh.blueFrance.default,
					padding: '5px 10px',
					boxShadow: '0px 2px 6px 0px #00001229',
					textAlign: 'center'
				}}
			>
				{payload.map((payloadItem, index: number) => {
					return (
						<p key={index} style={{ margin: 0, color: 'white', fontSize: 13 }}>
							{payloadItem.value}% des démarches ont atteint de l'objectif de
							l'indicateur "{payloadItem.payload.name}", fixé à{' '}
							{payloadItem.payload.goalLabel}
						</p>
					);
				})}
			</div>
		);
	}

	return null;
};

type RadarChartCustomProps = {
	data: RecordData['data'] & {
		compareScore?: number;
	};
	showGoalRadar: boolean;
	showCrossScorePerimeter: boolean;
	enableAnimation?: boolean;
	compareData?: {
		mainTitle: string;
		compareTitle: string;
	};
	color?: string;
	customRef?: React.RefObject<HTMLDivElement | null>;
};

const RadarChartCustom = ({
	data,
	showGoalRadar,
	showCrossScorePerimeter,
	enableAnimation = true,
	compareData,
	color,
	customRef
}: RadarChartCustomProps) => {
	const [activeIcon, setActiveIcon] = useState<string | null>(null);

	const handleIconMouseEnter = (dataItem: any) => {
		setActiveIcon(dataItem.value);
	};

	const handleIconMouseLeave = () => {
		setActiveIcon(null);
	};

	return (
		<ResponsiveContainer
			width="100%"
			height={compareData ? '110%' : '100%'}
			ref={customRef}
		>
			<RadarChart
				data={data}
				accessibilityLayer
				margin={{ top: 16 }}
				style={{
					display: 'flex',
					flexDirection: 'column-reverse'
				}}
			>
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
					name={compareData?.mainTitle || 'Valeur'}
					dataKey="score"
					stroke={color || fr.colors.decisions.artwork.minor.blueFrance.default}
					fill={color || fr.colors.decisions.artwork.minor.blueFrance.default}
					fillOpacity={0.2}
					isAnimationActive={enableAnimation}
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
						name="Moyenne de l'observatoire"
						dataKey="cross"
						stroke={fr.colors.options.orangeTerreBattue.main645.default}
						fill={fr.colors.options.orangeTerreBattue.main645.default}
						fillOpacity={0.2}
						isAnimationActive={enableAnimation}
					/>
				)}
				{compareData && (
					<>
						<Radar
							name={compareData.compareTitle || 'Comparaison'}
							dataKey="compareScore"
							stroke={fr.colors.options.purpleGlycine._925_125.active}
							fill={fr.colors.options.purpleGlycine._925_125.active}
							fillOpacity={0.2}
							isAnimationActive={enableAnimation}
						/>
						<Legend
							verticalAlign="top"
							iconType="circle"
							iconSize={12}
							formatter={value => (
								<span
									style={{
										color: 'black',
										fontSize: 14,
										fontWeight: 500
									}}
								>
									{value}
								</span>
							)}
							height={60}
							wrapperStyle={{ position: 'relative' }}
						/>
					</>
				)}
				<Tooltip
					content={CustomTooltip}
					contentStyle={{
						textAlign: 'left',
						whiteSpace: 'pre-line'
					}}
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
