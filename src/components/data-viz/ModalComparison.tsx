import { ProcedureKind } from '@/pages/api/indicator-scores';
import { fr } from '@codegouvfr/react-dsfr';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import { useEffect, useId, useState } from 'react';
import { tss } from 'tss-react';

type Props = {
	actions: {
		open?: (params: ModalComparisonParams) => void;
	};
};
export type ModalComparisonParams = {
	title: string;
	procedureKind: ProcedureKind;
	kindSlug: string;
};

export function ModalComparison({ actions }: Props) {
	const [dataVisualitionKind, setDataVisualitionKind] = useState<
		'radar' | 'table'
	>('radar');

	const { classes } = useStyles();

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
		</modal.Component>
	);
}

const useStyles = tss.withName(ModalComparison.name).create(() => ({
	modal: {
		'& > div > div > div': {
			width: 'calc(1100% / 12)',
			maxWidth: 'calc(1100% / 12)',
			flexBasis: 'calc(1100% / 12)'
		}
	},
	chart: {
		width: '100%',
		height: '400px'
	}
}));
