import { ProcedureKind } from '@/pages/api/indicator-scores';
import { RecordData } from '@/utils/data-viz';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import dynamic from 'next/dynamic';
import { useEffect, useId, useRef, useState } from 'react';
import { tss } from 'tss-react';
import Select from '@codegouvfr/react-dsfr/Select';
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch';

const RadarChartCustom = dynamic(
	() => import('@/components/charts/RadarChart')
);

type Props = {
	actions: {
		open?: (params: ModalComparisonParams) => void;
	};
};

export type ModalComparisonParams = {
	title: string;
	baseData: RecordData['data'];
	procedureKind: ProcedureKind;
	kindSlug: string;
	kindLabel: string;
	kindDataOptions: { label: string; value: string; data: RecordData['data'] }[];
};

export function ModalComparison({ actions }: Props) {
	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'radar' | 'table'
	>('radar');
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);
	const [selectedKindValue, setSelectedKindValue] = useState<string>('');
	const [shouldRadarOverlay, setShouldRadarOverlay] = useState(false);
	const [maxReachedHeight, setMaxReachedHeight] = useState<number>();

	const mainContainerRef = useRef<HTMLDivElement | null>(null);

	const { classes, cx } = useStyles();

	const id = useId();

	const [modal] = useState(() =>
		createModal({
			id: `modal-indicator-comparison-${id}`,
			isOpenedByDefault: false
		})
	);

	const [openState, setOpenState] = useState<
		| {
				dialogParams: ModalComparisonParams;
		  }
		| undefined
	>(undefined);

	useEffect(() => {
		actions.open = dialogParams => {
			setOpenState({
				dialogParams
			});
			modal.open();
		};
	}, []);

	useEffect(() => {
		if (mainContainerRef.current) {
			const containerHeight = mainContainerRef.current.clientHeight;
			if (containerHeight > (maxReachedHeight || 0)) {
				setMaxReachedHeight(containerHeight);
			}
		}
	}, [selectedKindValue]);

	useEffect(() => {
		resetState();
		if (mainContainerRef.current) {
			const containerHeight = mainContainerRef.current.clientHeight;
			setMaxReachedHeight(containerHeight);
		}
	}, [openState?.dialogParams.kindSlug]);

	useIsModalOpen(modal);

	const resetState = () => {
		setSelectedKindValue('');
		setShouldRadarOverlay(false);
		setShowCrossScorePerimeter(false);
		setDataVisualitionKind('radar');
	};

	const getSingularKindLabel = (label: string) => {
		return label
			.split(' ')
			.map(word => (word.endsWith('s') ? word.slice(0, -1) : word))
			.join(' ');
	};

	return (
		<modal.Component
			title={openState?.dialogParams.title}
			iconId="ri-arrow-right-line"
			concealingBackdrop={false}
			size="large"
			className={classes.modal}
		>
			<hr />
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
							// TODO: export either both charts or merged single chart
							// if (chartRef.current && openState?.dialogParams.title) {
							// 	exportChartAsImage(
							// 		chartRef.current,
							// 		openState.dialogParams.title
							// 	);
							// }
						}}
					>
						Exporter
					</Button>
				</div>
			</div>
			<div className={classes.mainContainer} ref={mainContainerRef}>
				<div
					className={cx(classes.container, classes.radarCard)}
					style={{ height: maxReachedHeight }}
				>
					{!shouldRadarOverlay && (
						<h2 className={cx(classes.title, 'fr-text--lg')}>
							{openState?.dialogParams.kindSlug}
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
								data={
									shouldRadarOverlay
										? [] // TODO: merge both radars data
										: openState?.dialogParams.baseData || []
								}
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
											data={
												openState?.dialogParams.kindDataOptions.find(
													option => option.value === selectedKindValue
												)?.data || []
											}
											showGoalRadar={false}
											showCrossScorePerimeter={showCrossScorePerimeter}
										/>
									</div>

									<Button priority="secondary">Voir le détail</Button>
								</div>
							</>
						) : (
							openState && (
								<>
									<Select
										label={getSingularKindLabel(
											openState.dialogParams.kindLabel
										)}
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
										{openState.dialogParams.kindDataOptions
											.filter(
												option =>
													option.value !== openState.dialogParams.kindSlug
											)
											.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
									</Select>
									<div className={classes.emptyStateContainer}>
										<p>
											Ajouter un
											{openState.dialogParams.procedureKind !== 'ministere'
												? 'e'
												: ''}{' '}
											{getSingularKindLabel(
												openState.dialogParams.kindLabel.toLowerCase()
											)}{' '}
											à comparer
										</p>
									</div>
								</>
							)
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
			<div style={{ paddingBottom: '10rem' }} />
		</modal.Component>
	);
}

const useStyles = tss.withName(ModalComparison.name).create(() => ({
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
