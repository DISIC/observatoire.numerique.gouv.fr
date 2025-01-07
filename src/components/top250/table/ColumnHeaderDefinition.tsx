import { Modal } from '@/components/generic/Modal';
import {
	fr,
	type FrIconClassName,
	type RiIconClassName
} from '@codegouvfr/react-dsfr';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { push } from '@socialgouv/matomo-next';
import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { IndicatorSlug } from '@prisma/client';
import { ProcedureHeaderSort } from './ProceduresTable';

type Props = {
	slug: IndicatorSlug;
	icon: FrIconClassName | RiIconClassName;
	text: ReactNode;
	infos: {
		title: string;
		content: ReactNode;
	};
	isMobile?: boolean;
	onFocus?: () => void;
	onSort?: (sortObject: ProcedureHeaderSort) => void;
	currentSort?: ProcedureHeaderSort;
};

export function ColumnHeaderDefinition(props: Props) {
	const { slug, icon, text, infos, isMobile, onFocus, onSort, currentSort } = props;
	const { classes, cx } = useStyles();
	const router = useRouter();

	const [openModal, setOpenModal] = useState<boolean>(false);

	const getDisplayedText = (children: ReactNode): ReactNode => {
		if (isMobile) return children;

		let childrenArray = React.Children.toArray(children) as ReactNode[];

		if (typeof children === 'string') {
			const words = children.split(' ');
			childrenArray = words.reduce((acc, word, index) => {
				acc.push(word);
				if (index === 0 && word.length >= 8) {
					acc.push(<br key={`br-${index}`} />);
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
					push(['trackEvent', 'top250', 'openModalIndicator', infos.title]);
					setOpenModal(true);
				}}
				nativeButtonProps={{
					onFocus
				}}
			>
				<i className={cx(fr.cx(icon), classes.mainIcon)} />
				<span className={cx(classes.text)}>
					{getDisplayedText(text)}
					<i
						className={cx(
							fr.cx('ri-information-line'),
							classes.informationIcon
						)}
					/>
				</span>
			</Button>
			{
				onSort && (
					<div className={cx(classes.sortContainer)}>
						<Button priority="tertiary no outline" onClick={() => {
							onSort({ slug, direction: 'up' })
						}}>
							<i className={cx(fr.cx('ri-arrow-drop-down-line'))} style={{ color: currentSort?.slug === slug && currentSort?.direction === 'up' ? 'inherit' : 'gray' }} />
						</Button>
						<Button priority="tertiary no outline" onClick={() => {
							onSort({ slug, direction: 'down' })
						}}>
							<i className={cx(fr.cx('ri-arrow-drop-up-line'))} style={{ color: currentSort?.slug === slug && currentSort?.direction === 'down' ? 'inherit' : 'gray' }} />
						</Button>
					</div>
				)
			}
			{openModal && (
				<Modal
					title={infos.title}
					buttons={[
						{
							onClick: () => {
								router.push('/Aide/Observatoire?tab=indicators');
							},
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
		height: 'auto',
		minHeight: '65%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'start',
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
	},
	sortContainer: {
		display: 'flex',
		justifyContent: 'center'
	}
}));
