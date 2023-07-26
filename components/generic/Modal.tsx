import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import FocusTrap from 'focus-trap-react';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
	title: string;
	children: ReactNode;
	buttons: {
		onClick: () => void;
		children: ReactNode;
	}[];
	onClose: () => void;
};

export const Modal = (props: Props) => {
	const { title, children, buttons, onClose } = props;
	const { classes, cx } = useStyles();
	const rNumber = Math.floor(Math.random() * 1000);

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};
		document.addEventListener('keydown', handleEsc);
		return () => {
			document.removeEventListener('keydown', handleEsc);
		};
	}, []);

	return createPortal(
		<FocusTrap>
			<dialog
				id={`fr-modal-${rNumber}`}
				className={cx(classes.root)}
				onClick={onClose}
				role="dialog"
				aria-labelledby={`fr-modal-title-${rNumber}`}
				aria-modal={true}
				open={true}
			>
				<div
					className={cx(
						classes.modalContainer,
						fr.cx('fr-container', 'fr-container--fluid', 'fr-container-md')
					)}
				>
					<div className={cx(classes.modal)} onClick={e => e.stopPropagation()}>
						<div className={cx(classes.modalHeader)}>
							<Button
								priority="tertiary no outline"
								iconId="ri-close-line"
								iconPosition="right"
								onClick={onClose}
							>
								Fermer
							</Button>
						</div>
						<div className={cx(classes.modalContent)}>
							<h1 id={`fr-modal-title-${rNumber}`}>{title}</h1>
							<div>{children}</div>
						</div>
						<div className={cx(classes.modalFooter)}>
							{buttons.map((b, index) => (
								<Button key={index} onClick={b.onClick}>
									{b.children}
								</Button>
							))}
						</div>
					</div>
				</div>
			</dialog>
		</FocusTrap>,
		document.body
	);
};

const useStyles = makeStyles()(theme => ({
	root: {
		width: '100vw',
		height: '100vh',
		position: 'fixed',
		top: 0,
		left: 0,
		backgroundColor: 'rgba(22, 22, 22, 0.64)',
		zIndex: 999,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'left',
		fontWeight: 'normal',
		[fr.breakpoints.down('lg')]: {
			alignItems: 'flex-end'
		}
	},
	modalContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		[fr.breakpoints.down('lg')]: {
			paddingLeft: 0,
			paddingRight: 0
		}
	},
	modal: {
		width: 'calc(700% / 12)',
		maxWidth: 'calc(700% / 12)',
		maxHeight: '95vh',
		overflowY: 'auto',
		height: 'auto',
		backgroundColor: theme.decisions.background.default.grey.default,
		[fr.breakpoints.down('lg')]: {
			width: '100%',
			maxWidth: '100%',
			maxHeight: '80vh'
		}
	},
	modalHeader: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingLeft: fr.spacing('8v'),
		paddingRight: fr.spacing('8v'),
		paddingTop: fr.spacing('4v'),
		paddingBottom: fr.spacing('4v'),
		button: {
			...fr.typography[18].style,
			fontWeight: '400 !important'
		},
		[fr.breakpoints.down('lg')]: {
			paddingLeft: 0,
			paddingRight: 0,
			paddingTop: fr.spacing('2v'),
			paddingBottom: fr.spacing('2v')
		}
	},
	modalContent: {
		paddingLeft: fr.spacing('8v'),
		paddingRight: fr.spacing('8v'),
		h1: {
			...fr.typography[2].style
		},
		[fr.breakpoints.down('lg')]: {
			paddingLeft: fr.spacing('4v'),
			paddingRight: fr.spacing('4v')
		}
	},
	modalFooter: {
		padding: fr.spacing('8v'),
		display: 'flex',
		justifyContent: 'flex-end',
		[fr.breakpoints.down('lg')]: {
			padding: fr.spacing('4v'),
			button: {
				width: '100%',
				justifyContent: 'center'
			}
		}
	}
}));
