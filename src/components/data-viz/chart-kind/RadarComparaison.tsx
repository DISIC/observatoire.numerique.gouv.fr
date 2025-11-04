import TableView, { TableViewProps } from '@/components/data-viz/TableView';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import {
	useIndicatorScoreByProcedureKindSlug,
	useProcedureGroupByKind
} from '@/utils/api';
import { RecordData } from '@/utils/data-viz-client';
import {
	exportChartAsPng,
	exportTableAsCSV,
	getProcedureKindLabel,
	getTableHeadersFromData
} from '@/utils/tools';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Select from '@codegouvfr/react-dsfr/Select';
import ToggleSwitch from '@codegouvfr/react-dsfr/ToggleSwitch';
import { useEffect, useId, useRef, useState } from 'react';
import { tss } from 'tss-react';
import RadarWrapper from '../RadarWrapper';

type RadarComparisonProps = {
	kind: ProcedureKind;
	slug: string;
};

const RadarComparison = ({ kind, slug }: RadarComparisonProps) => {
	const { classes, cx } = useStyles();

	const id = useId();
	const chartRef = useRef<HTMLDivElement | null>(null);

	const [selectedKindValue, setSelectedKindValue] = useState<string>('');
	const [crossPerimeterValues, setCrossPerimeterValues] = useState<
		{
			slug: string;
			value: number;
		}[]
	>([]);

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
				cross:
					crossPerimeterValues.find(crossItem => crossItem.slug === item.slug)
						?.value || 0,
				compareScore: comparedIndicatorScores?.data.find(
					compareItem => compareItem.slug === item.slug
				)?.score
		  }))
		: baseIndicatorScores?.data.map(item => ({
				...item,
				cross:
					crossPerimeterValues.find(crossItem => crossItem.slug === item.slug)
						?.value || 0
		  })) || [];

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

	useEffect(() => {
		if (
			comparedIndicatorScores &&
			(comparedIndicatorScores as unknown as RecordData[])[0] &&
			(comparedIndicatorScores as unknown as RecordData[])[0].data &&
			crossPerimeterValues.length === 0
		) {
			setCrossPerimeterValues(
				(comparedIndicatorScores as unknown as RecordData[])[0].data.map(
					item => ({
						slug: item.slug,
						value: item.cross
					})
				)
			);
		}
	}, [comparedIndicatorScores]);

	const getRows = (): TableViewProps['rows'] => {
		if (!radarData || radarData.length === 0 || !comparedIndicatorScores) {
			return [];
		}

		return [
			{
				title: baseIndicatorScores?.text || 'Périmètre de base',
				cells: radarData.reduce(
					(acc, current) => ({
						...acc,
						[current.slug]: `${current.score}%`
					}),
					{}
				)
			},
			{
				title: selectedKindValue || 'Périmètre comparé',
				cells: comparedIndicatorScores.data.reduce(
					(acc, current) => ({
						...acc,
						[current.slug]: `${current.score}%`
					}),
					{}
				)
			}
		];
	};

	return (
		<div className={classes.pageContent}>
			<div className={classes.actions}>
				<div>
					{dataVisualitionKind === 'radar' && (
						<Checkbox
							options={[
								{
									label: "Moyenne de l'observatoire",
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
					)}
				</div>
				<div className={classes.buttonsWrapper}>
					<div className={classes.buttonsGroup}>
						<Button
							iconId="ri-pentagon-line"
							onClick={() => setDataVisualitionKind('radar')}
							size="small"
							priority={
								dataVisualitionKind === 'radar' ? 'primary' : 'secondary'
							}
						>
							Radars
						</Button>
						<Button
							iconId="ri-table-line"
							onClick={() => setDataVisualitionKind('table')}
							size="small"
							priority={
								dataVisualitionKind === 'table' ? 'primary' : 'secondary'
							}
							disabled={selectedKindValue === ''}
						>
							Tableaux
						</Button>
					</div>
					{dataVisualitionKind === 'table' && (
						<Button
							iconId="ri-download-line"
							priority="secondary"
							size="small"
							title="Exporter en CSV"
							onClick={() => exportTableAsCSV('table', slug)}
						>
							Exporter en CSV
						</Button>
					)}
				</div>
			</div>
			{dataVisualitionKind === 'table' ? (
				<TableView
					headers={[
						{ name: '', description: '' },
						...getTableHeadersFromData(radarData || [])
					]}
					rows={getRows()}
				/>
			) : (
				<div className={classes.wrapperMainContainer}>
					<div className={classes.mainContainer} ref={mainContainerRef}>
						<RadarWrapper
							kind={kind}
							item={{
								text: baseIndicatorScores?.text || 'Radar de comparaison',
								count: baseIndicatorScores?.count || 0,
								data: radarData
							}}
							radarCustomChartProps={{
								compareData: radarCompareData,
								showCrossScorePerimeter,
								showGoalRadar: false,
								enableAnimation: false
							}}
							classNameCXArgs={[
								classes.container,
								classes.radarCard,
								shouldRadarOverlay && fr.cx('fr-pt-0')
							]}
						/>
						{!shouldRadarOverlay && (
							<>
								{selectedKindValue ? (
									<RadarWrapper
										kind={kind}
										item={{
											text: selectedKindValue,
											count: comparedIndicatorScores?.count || 0,
											data:
												comparedIndicatorScores?.data.map(item => ({
													...item,
													cross:
														crossPerimeterValues.find(
															crossItem => crossItem.slug === item.slug
														)?.value || 0
												})) || []
										}}
										radarCustomChartProps={{
											showCrossScorePerimeter,
											showGoalRadar: false,
											enableAnimation: false
										}}
										classNameCXArgs={[classes.container]}
										titleChildren={
											<Button
												priority="tertiary no outline"
												iconId="ri-close-circle-fill"
												onClick={() => setSelectedKindValue('')}
												title="Supprimer la sélection"
												aria-label="Supprimer la sélection"
											/>
										}
									/>
								) : (
									<div
										className={cx(
											classes.container,
											selectedKindValue && classes.radarCard
										)}
									>
										<Select
											label={`Choisir un${
												(kind === 'administration' ? 'e ' : ' ') +
												getProcedureKindLabel(kind)
											}`}
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
												.map(
													option =>
														option && (
															<option key={option} value={option}>
																{option}
															</option>
														)
												)}
										</Select>
										<div className={classes.emptyStateContainer}>
											<p>
												Sélectionner un
												{kind === 'administration' ? 'e' : ''}{' '}
												{getProcedureKindLabel(kind)} à comparer
											</p>
										</div>
									</div>
								)}
							</>
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
			)}
		</div>
	);
};

const useStyles = tss.withName(RadarComparison.name).create(() => ({
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
		},
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column-reverse',
			gap: fr.spacing('4v'),
			'& > div': {
				justifyContent: 'space-between',
				width: '100%'
			}
		}
	},
	checkboxWrapper: {
		marginBottom: 0,
		'& > .fr-fieldset__content, & > .fr-fieldset__content > .fr-checkbox-group':
			{
				marginTop: 0
			}
	},
	buttonsWrapper: {
		[fr.breakpoints.down('md')]: {
			display: 'flex',
			flexDirection: 'column',
			gap: `${fr.spacing('4v')} !important`
		}
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	},
	wrapperMainContainer: {
		[fr.breakpoints.down('md')]: {
			display: 'flex',
			gap: fr.spacing('3w'),
			flexDirection: 'column-reverse',
			'& > .fr-toggle > .fr-toggle__label': {
				width: '100%'
			}
		}
	},
	mainContainer: {
		display: 'flex',
		gap: fr.spacing('6v'),
		marginBottom: fr.spacing('9v'),
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column-reverse',
			'& > div': {
				justifyContent: 'start',
				display: 'block'
			}
		}
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
