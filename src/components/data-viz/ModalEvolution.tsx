import { ProcedureKind } from '@/pages/api/indicator-scores';
import { fr } from '@codegouvfr/react-dsfr';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import dynamic from 'next/dynamic';
import { useState, useEffect, useId } from 'react';
import { tss } from 'tss-react';

const LineChartCustom = dynamic(() => import('@/components/charts/LineChart'));

type Props = {
	actions: {
		open?: (params: ModalEvolutionParams) => void;
	};
};

type TabContentProps = {
	procedureKind: ProcedureKind;
	indicatorSlug: string;
};

const TabContent = ({ procedureKind, indicatorSlug }: TabContentProps) => {
	const { classes, cx } = useStyles();

	const [showGoalLine, setShowGoalLine] = useState(false);
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

	return (
		<div className={classes.tabContent}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
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
			</div>
			<div className={cx(classes.chart)}>
				<LineChartCustom
					showGoalLine={showGoalLine}
					showCrossScorePerimeter={showCrossScorePerimeter}
				/>
			</div>
		</div>
	);
};

export type ModalEvolutionParams = {
	title: string;
	procedureKind: ProcedureKind;
	kindSlug: string;
};

export function ModalEvolution(props: Props) {
	const { actions } = props;

	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'line' | 'table'
	>('line');

	const [selectedTabId, setSelectedTabId] = useState('satisfaction');

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

	useEffect(() => {
		actions.open = dialogParams => {
			setOpenState({
				dialogParams
			});
			modal.open();
		};
	}, []);

	useIsModalOpen(modal);

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
				onTabChange={tabId => setSelectedTabId(tabId)}
				tabs={[
					{
						tabId: 'satisfaction',
						label: (
							<>
								<i className="ri-emoji-sticker-line" />
								{selectedTabId === 'satisfaction' && <p>Satisfaction usager</p>}
							</>
						)
					},
					{
						tabId: 'handicap',
						label: (
							<>
								<i className="ri-open-arm-line" />
								{selectedTabId === 'handicap' && (
									<p>Prise en compte du handicap</p>
								)}
							</>
						)
					},
					{
						tabId: 'dlnuf',
						label: (
							<>
								<i className="ri-pass-valid-line" />
								{selectedTabId === 'dlnuf' && <p>Dites-le-nous une fois</p>}
							</>
						)
					},
					{
						tabId: 'auth',
						label: (
							<>
								<i className="ri-lock-unlock-line" />
								{selectedTabId === 'auth' && <p>Authentification</p>}
							</>
						)
					},
					{
						tabId: 'simplicity',
						label: (
							<>
								<i className="ri-speak-line" />
								{selectedTabId === 'simplicity' && <p>Clarté du langage</p>}
							</>
						)
					}
				]}
			>
				<TabContent
					procedureKind={openState?.dialogParams.procedureKind as ProcedureKind}
					indicatorSlug={selectedTabId}
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
	}
}));
