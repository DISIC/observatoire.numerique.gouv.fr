import {
	type FrIconClassName,
	type RiIconClassName,
	fr
} from '@codegouvfr/react-dsfr';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { ReactNode, useState } from 'react';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { Modal } from '@/components/generic/Modal';

type Props = {
	icon: FrIconClassName | RiIconClassName;
	text: ReactNode;
	infos: {
		title: string;
		content: ReactNode;
	};
};

export function ColumnHeaderDefinition(props: Props) {
	const { icon, text, infos } = props;
	const { classes, cx } = useStyles();

	const [openModal, setOpenModal] = useState<boolean>(false);

	return (
		<>
			<Button
				className={cx(classes.root)}
				onClick={() => {
					setOpenModal(true);
				}}
			>
				<i className={cx(fr.cx(icon), classes.mainIcon)} />
				<span role="text" className={cx(classes.text)}>
					{text}{' '}
					<i
						className={cx(
							fr.cx('ri-information-line'),
							classes.informationIcon
						)}
					/>
				</span>
			</Button>
			{openModal && (
				<Modal
					title={infos.title}
					buttons={[
						{
							onClick: () => setOpenModal(false),
							children: 'Consulter toute la documentation'
						}
					]}
					onClose={() => {
						setOpenModal(false);
					}}
				>
					{infos.content}
				</Modal>
			)}
		</>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		width: '90%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: fr.spacing('4v'),
		marginTop: fr.spacing('2v'),
		marginBottom: fr.spacing('2v'),
		color: theme.decisions.text.actionHigh.blueFrance.default,
		fontWeight: 'bold',
		textAlign: 'center',
		cursor: 'pointer',
		borderRadius: '8px',
		backgroundColor: 'transparent',
		[':hover']: {
			backgroundColor:
				theme.decisions.background.alt.blueFrance.default + ' !important'
		},
		[fr.breakpoints.down('lg')]: {
			minHeight: 0,
			paddingBottom: `${fr.spacing('7v')} !important`,
			marginBottom: `-${fr.spacing('7v')}`,
			justifyContent: 'start',
			alignItems: 'start',
			padding: 0,
			position: 'relative',
			zIndex: 1
		}
	},
	text: {
		marginTop: fr.spacing('3v'),
		[fr.breakpoints.down('lg')]: {
			marginTop: 0,
			fontSize: fr.typography[17].style.fontSize
		}
	},
	mainIcon: {
		[fr.breakpoints.down('lg')]: {
			display: 'none'
		}
	},
	informationIcon: {
		['&::before']: {
			'--icon-size': fr.typography[18].style.fontSize
		}
	}
}));
