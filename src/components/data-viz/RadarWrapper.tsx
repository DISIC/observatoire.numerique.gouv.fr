import { RadarChartCustomProps } from '@/components/charts/RadarChart';
import { RecordData } from '@/utils/data-viz-client';
import { exportChartAsPng, stringToBase64Url } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { CxArg, tss } from 'tss-react';

const RadarChartCustom = dynamic(
	() => import('@/components/charts/RadarChart')
);

type RadarWrapperProps = {
	item: RecordData;
	kind: string;
	radarCustomChartProps: Omit<RadarChartCustomProps, 'data'>;
	classNameCXArgs?: CxArg[];
	hideButtonsGroup?: boolean;
	titleChildren?: React.ReactNode;
};

const RadarWrapper = ({
	item,
	kind,
	radarCustomChartProps,
	hideButtonsGroup,
	classNameCXArgs,
	titleChildren
}: RadarWrapperProps) => {
	const { classes, cx } = useStyles();
	const [isMobile, setIsMobile] = useState(false);

	const chartRef = useRef<HTMLDivElement | null>(null);

	const downloadChart = () => {
		const matches = item.text.match(/\b([A-Z])/g) ?? [];
		const titleChart = matches.join('');
		if (chartRef.current) exportChartAsPng(chartRef.current, titleChart);
	};

	useEffect(() => {
		setIsMobile(window.innerWidth <= fr.breakpoints.getPxValues().md);
	}, []);

	return (
		<div key={item.text} className={cx(classes.gridItem, classNameCXArgs)}>
			<div className={cx(classes.gridItemHeader)}>
				{!radarCustomChartProps.compareData && (
					<>
						{titleChildren}
						<h2 className={cx(classes.gridTitle, 'fr-text--lg')}>
							{item.text}
						</h2>
						<p className={cx('fr-text--xs')}>
							(Nombre de démarches : {item.count})
						</p>
					</>
				)}
				<Button
					className={cx(classes.gridItemDownload)}
					iconId="fr-icon-download-line"
					priority="secondary"
					title="Exporter le graphique en PNG"
					size="small"
					onClick={downloadChart}
				/>
			</div>
			<div
				className={cx(classes.chart)}
				style={{ height: isMobile ? '450px' : '325px' }}
			>
				<RadarChartCustom
					customRef={chartRef}
					data={item.data}
					{...radarCustomChartProps}
				/>
			</div>
			{!hideButtonsGroup && (
				<div className={cx(classes.buttonsGroup)}>
					<Button
						size="small"
						linkProps={{
							href: `/data-viz/${kind}/${stringToBase64Url(item.text)}`
						}}
					>
						Analyser les indicateurs
					</Button>
				</div>
			)}
		</div>
	);
};

const useStyles = tss.withName(RadarWrapper.name).create(() => ({
	gridItem: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		textAlign: 'center',
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	gridItemHeader: {
		padding: `0 ${fr.spacing('12v')}`
	},
	gridTitleContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	gridTitle: {
		fontWeight: 500,
		color: fr.colors.decisions.text.title.grey.default,
		marginBottom: fr.spacing('1v')
	},
	gridItemDownload: {
		position: 'absolute',
		top: fr.spacing('4v'),
		right: fr.spacing('4v'),
		zIndex: 1
	},
	chart: {
		width: '100%',
		height: '325px',
		marginTop: 'auto'
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('3v'),
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginTop: fr.spacing('2v')
	},
	modal: {
		textAlign: 'start'
	},
	textContainer: {
		textAlign: 'center',
		p: {
			margin: 0,
			fontWeight: 'bold'
		}
	}
}));

export default RadarWrapper;
