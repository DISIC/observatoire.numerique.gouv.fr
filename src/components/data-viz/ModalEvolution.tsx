import { ProcedureKind } from '@/pages/api/indicator-scores';
import { fr } from '@codegouvfr/react-dsfr';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import dynamic from 'next/dynamic';
import { useState, useEffect, useId } from 'react';
import { tss } from 'tss-react';
import CustomBarChart from '../charts/BarChart';
import { useIndicatorEvolution } from '@/utils/api';
import { validIndicatorSlugs } from '@/utils/data-viz';

const LineChartCustom = dynamic(() => import('@/components/charts/LineChart'));

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
};

const TabContent = ({
	procedureKind,
	indicatorSlug,
	shouldShowGoalLine,
	shouldShowCrossScorePerimeter
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

			<div className={cx(classes.chart)}>
				<CustomBarChart />
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

	const { classes } = useStyles();

	const id = useId();

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

	const { data } = useIndicatorEvolution({
		view: 'edition',
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
					procedureKind={openState?.dialogParams.procedureKind as ProcedureKind}
					indicatorSlug={selectedTabId}
					shouldShowGoalLine={openState?.dialogParams.shouldShowGoalLine}
					shouldShowCrossScorePerimeter={
						openState?.dialogParams.shouldShowCrossScorePerimeter
					}
				/>
			</Tabs>
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
		height: '400px'
	},
	chartLegend: {
		color: fr.colors.decisions.text.mention.grey.default,
		fontSize: '14px'
	}
}));
