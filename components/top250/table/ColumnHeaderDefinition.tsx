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
import React from 'react';

type Props = {
	icon: FrIconClassName | RiIconClassName;
	text: ReactNode;
	infos: {
		title: string;
		content: ReactNode;
	};
	isMobile?: boolean;
};

export function ColumnHeaderDefinition(props: Props) {
	const { icon, text, infos, isMobile } = props;
	const { classes, cx } = useStyles();

	const [openModal, setOpenModal] = useState<boolean>(false);

	const getDisplayedText = (children: ReactNode): ReactNode => {
		if (isMobile) return children;

		let childrenArray = React.Children.toArray(children) as ReactNode[];

		if (typeof children === 'string') {
			const words = children.split(' ');
			childrenArray = words.reduce((acc, word, index) => {
				acc.push(word);
				if (index === 0 && word.length >= 8) {
					acc.push(<br />);
				} else {
					acc.push(' ');
				}
				return acc;
			}, [] as ReactNode[]);
		}

		return childrenArray;
	};

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
					{getDisplayedText(text)}
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
		padding: fr.spacing('2v'),
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
			justifyContent: 'start',
			alignItems: 'start',
			padding: 0,
			position: 'relative',
			zIndex: 1,
			marginTop: 0,
			marginBottom: 0
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
			'--icon-size': fr.typography[18].style.fontSize,
			[fr.breakpoints.down('lg')]: {
				marginLeft: fr.spacing('1v')
			}
		}
	}
}));
