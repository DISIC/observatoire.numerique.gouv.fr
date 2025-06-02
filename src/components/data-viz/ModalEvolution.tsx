import { ProcedureKind } from '@/pages/api/indicator-scores';
import { fr } from '@codegouvfr/react-dsfr';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import dynamic from 'next/dynamic';
import { useState, useEffect, useId, useRef } from 'react';
import { tss } from 'tss-react';
import { useIndicatorEvolution } from '@/utils/api';
import { validIndicatorSlugs } from '@/utils/data-viz';
import Button from '@codegouvfr/react-dsfr/Button';
import { LightSelect } from '../generic/LightSelect';
import {
	EvolutionViewType,
	RecordDataGrouped
} from '@/pages/api/indicator-evolution';
import { exportChartAsImage } from '@/utils/tools';
import Link from 'next/link';

const BarChartCustom = dynamic(() => import('@/components/charts/BarChart'));

type Props = {
	actions: {
		open?: (params: ModalEvolutionParams) => void;
	};
};

type TabContentProps = {
	procedureKind: ProcedureKind;
	indicatorSlug: string;
	shouldShowGoalLine?: boolean;
	shouldShowCrossScorePerimeter?: boolean;
	setViewType: (viewType: EvolutionViewType) => void;
	data: RecordDataGrouped[];
	chartRef: React.RefObject<HTMLDivElement | null>;
};

const TabContent = ({
	procedureKind,
	indicatorSlug,
	shouldShowGoalLine,
	shouldShowCrossScorePerimeter,
	data,
	setViewType,
	chartRef
}: TabContentProps) => {
	const { classes, cx } = useStyles();

	const [showGoalLine, setShowGoalLine] = useState(false);
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

	return (
		<div className={classes.tabContent}>
			{(shouldShowGoalLine || shouldShowCrossScorePerimeter) && (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{shouldShowGoalLine && (
						<Checkbox
							options={[
								{
									label: 'Objectif',
									nativeInputProps: {
										name: 'checkboxes-1',
										value: 'value1',
										onChange: e => setShowGoalLine(e.target.checked)
									}
								}
							]}
							orientation="horizontal"
							state="default"
							small
						/>
					)}
					{shouldShowCrossScorePerimeter && (
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
							small
						/>
					)}
				</div>
			)}

			<div className={cx(classes.chart)} ref={chartRef}>
				<BarChartCustom
					dataKeys={
						data[0]?.values.map(value => ({
							label: value.label,
							color: value.color,
							position: value.position
						})) || []
					}
					data={data}
				/>
			</div>
			<div className={classes.viewTypeContainer}>
				<LightSelect
					label=""
					id="select-view"
					options={[
						{
							label: 'Éditions',
							value: 'edition'
						},
						{
							label: 'Années',
							value: 'year'
						}
					]}
					defaultValue={'edition'}
					size="small"
					onChange={value => setViewType(value as EvolutionViewType)}
					className={classes.selectViewType}
				/>
			</div>
		</div>
	);
};

export type ModalEvolutionParams = {
	title: string;
	procedureKind: ProcedureKind;
	kindSlug: string;
	shouldShowGoalLine?: boolean;
	shouldShowCrossScorePerimeter?: boolean;
};

export function ModalEvolution(props: Props) {
	const { actions } = props;

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'line' | 'table'
	>('line');

	const [selectedTabId, setSelectedTabId] =
		useState<(typeof validIndicatorSlugs)[number]>('satisfaction');

	const [viewType, setViewType] = useState<EvolutionViewType>('edition');

	const { classes } = useStyles();

	const id = useId();
	const chartRef = useRef<HTMLDivElement>(null);

	const [modal] = useState(() =>
		createModal({
			id: `modal-indicator-evolution-${id}`,
			isOpenedByDefault: false
		})
	);

	const [openState, setOpenState] = useState<
		| {
				dialogParams: ModalEvolutionParams;
		  }
		| undefined
	>(undefined);

	const { data: apiData } = useIndicatorEvolution({
		view: viewType || 'edition',
		slug: selectedTabId,
		kind: openState?.dialogParams.procedureKind as ProcedureKind,
		value: openState?.dialogParams.kindSlug || ''
	});

	useEffect(() => {
		actions.open = dialogParams => {
			setOpenState({
				dialogParams
			});
			modal.open();
		};
	}, []);

	useIsModalOpen(modal);

	const tabs = [
		{
			tabId: 'satisfaction',
			label: (
				<>
					<i className="ri-emoji-sticker-line" />
					{selectedTabId === 'satisfaction' && <p>Satisfaction usager</p>}
				</>
			),
			legend:
				'Cet histogramme représente la répartition en pourcentage des niveaux de satisfactions des démarches du périmètre ministériel.'
		},
		{
			tabId: 'handicap',
			label: (
				<>
					<i className="ri-open-arm-line" />
					{selectedTabId === 'handicap' && <p>Prise en compte du handicap</p>}
				</>
			),
			legend:
				'Cet histogramme représente la répartition en pourcentage du niveau d’accessibilité numérique des démarches du périmètre ministériel.'
		},
		{
			tabId: 'dlnuf',
			label: (
				<>
					<i className="ri-pass-valid-line" />
					{selectedTabId === 'dlnuf' && <p>Dites-le-nous une fois</p>}
				</>
			),
			legend:
				'Cet histogramme représente la répartition en pourcentage du niveau de simplification des démarches du périmètre ministériel.'
		},
		{
			tabId: 'auth',
			label: (
				<>
					<i className="ri-lock-unlock-line" />
					{selectedTabId === 'auth' && <p>Authentification</p>}
				</>
			),
			legend:
				'Cet histogramme représente la répartition en pourcentage des démarches de l’indicateur “Authentification”'
		},
		{
			tabId: 'simplicity',
			label: (
				<>
					<i className="ri-speak-line" />
					{selectedTabId === 'simplicity' && <p>Clarté du langage</p>}
				</>
			),
			legend:
				'Cet histogramme représente la répartition en pourcentage des niveaux de clarté des démarches du périmètre ministériel.'
		}
	];

	return (
		<modal.Component
			title={openState?.dialogParams.title}
			iconId="ri-arrow-right-line"
			concealingBackdrop={false}
			size="large"
			className={classes.modal}
		>
			<hr />
			<div style={{ position: 'relative' }}>
				<Tabs
					className={classes.tabsWrapper}
					selectedTabId={selectedTabId}
					onTabChange={tabId =>
						setSelectedTabId(tabId as (typeof validIndicatorSlugs)[number])
					}
					tabs={tabs.map(tab => ({
						...tab
					}))}
				>
					<p className={classes.chartLegend}>
						{tabs.find(tab => tab.tabId === selectedTabId)?.legend}
					</p>
					<TabContent
						procedureKind={
							openState?.dialogParams.procedureKind as ProcedureKind
						}
						indicatorSlug={selectedTabId}
						shouldShowGoalLine={openState?.dialogParams.shouldShowGoalLine}
						shouldShowCrossScorePerimeter={
							openState?.dialogParams.shouldShowCrossScorePerimeter
						}
						setViewType={setViewType}
						data={apiData}
						chartRef={chartRef}
					/>
				</Tabs>
				<div className={classes.linkContainer}>
					<Link
						href="/Aide/Observatoire?tab=indicators"
						className={fr.cx('fr-link')}
					>
						Tout comprendre sur les indicateurs{' '}
						<i className={fr.cx('fr-icon-external-link-line', 'fr-ml-1v')} />
					</Link>
				</div>

				<div className={classes.tabsActions}>
					<div className={classes.buttonsGroup}>
						<Button
							iconId="ri-bar-chart-line"
							onClick={() => setDataVisualitionKind('line')}
							priority={
								dataVisualitionKind === 'line' ? 'primary' : 'secondary'
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
							if (chartRef.current && openState?.dialogParams.title) {
								exportChartAsImage(
									chartRef.current,
									openState.dialogParams.title
								);
							}
						}}
					>
						Exporter
					</Button>
				</div>
			</div>
		</modal.Component>
	);
}

const useStyles = tss.withName(ModalEvolution.name).create(() => ({
	modal: {
		'& > div > div > div': {
			width: 'calc(1100% / 12)',
			maxWidth: 'calc(1100% / 12)',
			flexBasis: 'calc(1100% / 12)'
		}
	},
	tabsWrapper: {
		boxShadow: 'none',
		border: 'none',
		'&::before': {
			boxShadow: 'none'
		},
		['& > .fr-tabs__list']: {
			marginBottom: fr.spacing('1v')
		},
		['& > .fr-tabs__panel']: {
			backgroundColor: 'white',
			border: 'none',
			padding: `${fr.spacing('5v')} 0`,
			borderRadius: fr.spacing('2v')
		}
	},
	tabsActions: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 1,
		display: 'flex',
		gap: fr.spacing('10v'),
		paddingTop: fr.spacing('1v')
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	},
	tabContent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	chart: {
		width: '100%',
		height: '500px'
	},
	chartLegend: {
		color: fr.colors.decisions.text.mention.grey.default,
		fontSize: '14px'
	},
	viewTypeContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end'
	},
	linkContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		a: {
			fontSize: '14px',
			'i::after, i::before': {
				'--icon-size': '14px'
			}
		}
	},
	selectViewType: {
		['select.fr-select']: {
			width: '100%'
		},
		width: '7rem'
	}
}));
