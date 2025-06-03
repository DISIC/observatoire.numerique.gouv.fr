import { ProcedureKind } from '@/pages/api/indicator-scores';
import { RecordData } from '@/utils/data-viz';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import dynamic from 'next/dynamic';
import { useEffect, useId, useState } from 'react';
import { tss } from 'tss-react';

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
	baseTitle: string;
	baseData: RecordData['data'];
	procedureKind: ProcedureKind;
	kindSlug: string;
	kindLabel: string;
};

export function ModalComparison({ actions }: Props) {
	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'radar' | 'table'
	>('radar');
	const [showCrossScorePerimeter, setShowCrossScorePerimeter] = useState(false);

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
			<div className={classes.mainContainer}>
				<div className={cx(classes.container, classes.radarCard)}>
					<h2 className={cx(classes.title, 'fr-text--lg')}>
						{openState?.dialogParams.baseTitle}
					</h2>
					<div className={cx(classes.chart)}>
						<RadarChartCustom
							data={openState?.dialogParams.baseData || []}
							showGoalRadar={false}
							showCrossScorePerimeter={showCrossScorePerimeter}
						/>
					</div>

					<Button priority="secondary">Voir le détail</Button>
				</div>
				<div className={classes.container}></div>
			</div>
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
		gap: fr.spacing('6v')
	},
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		textAlign: 'center',
		borderRadius: fr.spacing('2v'),
		padding: `${fr.spacing('3w')} ${fr.spacing('4v')}`,
		border: `1px solid ${fr.colors.decisions.background.contrast.blueFrance.default}`
	},
	radarCard: {
		gap: fr.spacing('2v'),
		alignItems: 'center'
	},
	title: {
		fontWeight: 500,
		color: fr.colors.decisions.text.title.grey.default,
		marginBottom: fr.spacing('1v')
	},
	chart: {
		width: '100%',
		height: '325px'
	}
}));
