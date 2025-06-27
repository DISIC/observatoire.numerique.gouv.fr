import { ProcedureKind } from '@/pages/api/indicator-scores';
import {
	useIndicatorScoreByProcedureKindSlug,
	useProcedureGroupByKind
} from '@/utils/api';
import { base64UrlToString, exportChartAsPng } from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Select from '@codegouvfr/react-dsfr/Select';
import ToggleSwitch from '@codegouvfr/react-dsfr/ToggleSwitch';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { tss } from 'tss-react';
import FileSaver from 'file-saver';

const RadarChartCustom = dynamic(
	() => import('@/components/charts/RadarChart')
);

const RadarComparison = () => {
	const { classes, cx } = useStyles();
	const { query } = useRouter();
	const { kind, slug: tmpSlug } = query as {
		kind: ProcedureKind;
		slug: string;
	};
	const slug = tmpSlug ? base64UrlToString(tmpSlug) : '';

	const id = useId();
	const chartRef = useRef<HTMLDivElement | null>(null);

	const [selectedKindValue, setSelectedKindValue] = useState<string>('');

	const { data: baseIndicatorScores } = useIndicatorScoreByProcedureKindSlug({
		kind,
		slug
	});

	const { data: comparedIndicatorScores } =
		useIndicatorScoreByProcedureKindSlug({
			kind,
			slug: selectedKindValue
		});

	const { data: groupByProcedureKind } = useProcedureGroupByKind({
		kind
	});

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'radar' | 'table'
	>('radar');
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

	const [shouldRadarOverlay, setShouldRadarOverlay] = useState(false);
	const [maxReachedHeight, setMaxReachedHeight] = useState<number>();

	const mainContainerRef = useRef<HTMLDivElement | null>(null);

	const radarData = shouldRadarOverlay
		? (baseIndicatorScores?.data || []).map(item => ({
				...item,
				compareScore: comparedIndicatorScores?.data.find(
					compareItem => compareItem.slug === item.slug
				)?.score
		  }))
		: baseIndicatorScores?.data || [];

	const radarCompareData = shouldRadarOverlay
		? {
				mainTitle: baseIndicatorScores?.text || '',
				compareTitle: selectedKindValue
		  }
		: undefined;

	useEffect(() => {
		if (mainContainerRef.current) {
			const containerHeight = mainContainerRef.current.clientHeight;
			if (containerHeight > (maxReachedHeight || 0)) {
				setMaxReachedHeight(containerHeight);
			}
		}
	}, [selectedKindValue]);

	const getSingularKindLabel = (label: string) => {
		return label
			.split(' ')
			.map(word => (word.endsWith('s') ? word.slice(0, -1) : word))
			.join(' ');
	};

	return (
		<div className={cx(classes.root)}>
			<div className="fr-container">
				<Breadcrumb
					segments={[
						{
							label: 'Accueil',
							linkProps: { href: '/' }
						},
						{
							label: 'Dataviz',
							linkProps: { href: '/data-viz' }
						}
					]}
					currentPageLabel={`Comparer le périmètre ${slug}`}
					className={cx('fr-mb-1v')}
				/>
				<h1>Comparer le périmètre {baseIndicatorScores?.text}</h1>
				<div className={classes.pageContent}>
					<div className={classes.actions}>
						<Checkbox
							options={[
								{
									label: 'Moyenne inter-périmètre',
									nativeInputProps: {
										name: 'checkboxes-1',
										value: 'value2',
										onChange: e => setShowCrossScorePerimeter(e.target.checked)
									}
								}
							]}
							orientation="horizontal"
							state="default"
							className={classes.checkboxWrapper}
							small
						/>
						<div>
							<div className={classes.buttonsGroup}>
								<Button
									iconId="ri-pentagon-line"
									onClick={() => setDataVisualitionKind('radar')}
									priority={
										dataVisualitionKind === 'radar' ? 'primary' : 'secondary'
									}
									title="Chart"
								/>
								<Button
									iconId="ri-table-line"
									onClick={() => setDataVisualitionKind('table')}
									priority={
										dataVisualitionKind === 'table' ? 'primary' : 'secondary'
									}
									title="Table"
								/>
							</div>
							<Button
								iconId="ri-download-line"
								priority={'secondary'}
								title="Exporter"
								onClick={() => {
									if (chartRef.current) {
										exportChartAsPng(chartRef.current);
									}
								}}
							>
								Exporter
							</Button>
						</div>
					</div>
					<div className={classes.mainContainer} ref={mainContainerRef}>
						<div
							className={cx(
								classes.container,
								classes.radarCard,
								shouldRadarOverlay && fr.cx('fr-py-0')
							)}
							style={{
								minHeight: maxReachedHeight,
								height: shouldRadarOverlay ? maxReachedHeight : undefined
							}}
						>
							{!shouldRadarOverlay && (
								<h2 className={cx(classes.title, 'fr-text--lg')}>
									{baseIndicatorScores?.text || 'Radar de comparaison'}
								</h2>
							)}
							<div style={{ width: '100%' }}>
								<div
									className={cx(classes.chart)}
									style={{
										height:
											shouldRadarOverlay && maxReachedHeight
												? maxReachedHeight
												: '325px'
									}}
								>
									<RadarChartCustom
										customRef={chartRef}
										data={radarData}
										compareData={radarCompareData}
										showGoalRadar={false}
										showCrossScorePerimeter={showCrossScorePerimeter}
										enableAnimation={false}
									/>
								</div>
								{!shouldRadarOverlay && (
									<Button priority="secondary">Voir le détail</Button>
								)}
							</div>
						</div>
						{!shouldRadarOverlay && (
							<div
								className={cx(
									classes.container,
									selectedKindValue && classes.radarCard
								)}
							>
								{selectedKindValue ? (
									<>
										<div className={classes.removableTitleContainer}>
											<h2 className={cx(classes.title, 'fr-text--lg')}>
												{selectedKindValue}
											</h2>
											<Button
												priority="tertiary no outline"
												iconId="ri-close-circle-fill"
												onClick={() => setSelectedKindValue('')}
												children={''}
												size="large"
												className={classes.clearButton}
												title="Supprimer la sélection"
												aria-label="Supprimer la sélection"
											/>
										</div>
										<div style={{ width: '100%' }}>
											<div className={cx(classes.chart)}>
												<RadarChartCustom
													data={comparedIndicatorScores?.data || []}
													showGoalRadar={false}
													showCrossScorePerimeter={showCrossScorePerimeter}
													color={
														fr.colors.options.purpleGlycine._925_125.active
													}
													enableAnimation={false}
												/>
											</div>

											<Button priority="secondary">Voir le détail</Button>
										</div>
									</>
								) : (
									<>
										<Select
											label="Choisir un périmètre"
											nativeSelectProps={{
												id: `select-kind-${id}`,
												onChange: event =>
													setSelectedKindValue(event.target.value),
												value: selectedKindValue
											}}
										>
											<option value="" disabled>
												Sélectionner une option
											</option>
											{groupByProcedureKind
												.filter(option => option !== slug)
												.map(option => (
													<option key={option} value={option}>
														{option}
													</option>
												))}
										</Select>
										<div className={classes.emptyStateContainer}>
											<p>
												Ajouter un
												{kind !== 'ministere' ? 'e' : ''}{' '}
												{getSingularKindLabel(slug.toLowerCase())} à comparer
											</p>
										</div>
									</>
								)}
							</div>
						)}
					</div>
					{selectedKindValue && (
						<ToggleSwitch
							label="Superposer les deux radars"
							checked={shouldRadarOverlay}
							onChange={checked => setShouldRadarOverlay(checked)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

const useStyles = tss.withName(RadarComparison.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		padding: `${fr.spacing('12v')} 0`,
		['& > div  > h1']: {
			lineHeight: '2.25rem',
			fontSize: '1.75rem'
		}
	},
	pageContent: {
		backgroundColor: 'white',
		borderRadius: fr.spacing('2v'),
		padding: fr.spacing('6v')
	},
	modal: {
		'& > div > div > div': {
			width: 'calc(900% / 12)',
			maxWidth: 'calc(900% / 12)',
			flexBasis: 'calc(900% / 12)'
		}
	},
	actions: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: fr.spacing('5v'),
		'& > div': {
			display: 'flex',
			gap: fr.spacing('10v')
		}
	},
	checkboxWrapper: {
		marginBottom: 0,
		'& > .fr-fieldset__content, & > .fr-fieldset__content > .fr-checkbox-group':
			{
				marginTop: 0
			}
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	},
	mainContainer: {
		display: 'flex',
		gap: fr.spacing('6v'),
		marginBottom: fr.spacing('9v')
	},
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	radarCard: {
		gap: fr.spacing('2v'),
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	title: {
		fontWeight: 500,
		color: fr.colors.decisions.text.title.grey.default,
		marginBottom: fr.spacing('1v')
	},
	removableTitleContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	clearButton: {
		padding: '0.5rem',
		'::before': {
			margin: '0!important'
		}
	},
	chart: {
		width: '100%',
		height: '325px'
	},
	filterItem: {
		[fr.breakpoints.up('md')]: {
			flex: 1
		}
	},
	filterSelect: {
		['select.fr-select']: {
			width: '100%'
		},
		[fr.breakpoints.up('md')]: {
			width: '50%'
		},
		marginBottom: '0!important'
	},
	emptyStateContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		p: {
			fontWeight: 500,
			color: fr.colors.decisions.text.title.blueFrance.default,
			fontSize: '1.125rem'
		}
	}
}));

export default RadarComparison;
