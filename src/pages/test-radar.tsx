import dynamic from 'next/dynamic';

const RadarChartCustom = dynamic(
	() => import('../components/charts/RadarChart')
);

export default function TestRadarPage() {
	return (
		<div style={{ width: '100%', height: '100vh' }}>
			<RadarChartCustom />
		</div>
	);
}
