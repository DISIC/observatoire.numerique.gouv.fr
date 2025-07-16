import { Modal } from '@/components/generic/Modal';
import {
	fr,
	type FrIconClassName,
	type RiIconClassName
} from '@codegouvfr/react-dsfr';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { push } from '@socialgouv/matomo-next';
import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { IndicatorSlug } from '@prisma/client';
import { ProcedureHeaderSort } from './ProceduresTable';
import { tss } from 'tss-react';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

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
	onSort?: (sortObject: ProcedureHeaderSort | null) => void;
	currentSort?: ProcedureHeaderSort | null;
};

export function ColumnHeaderDefinition(props: Props) {
	const { slug, icon, text, infos, isMobile, onFocus, onSort, currentSort } =
		props;
	const { classes, cx } = useStyles();
	const router = useRouter();

	const modal = createModal({
		id: `modal-indicator-${isMobile ? 'mobile' : 'desktop'}-${slug}`,
		isOpenedByDefault: false
	});

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
					modal.open();
				}}
				nativeButtonProps={
					{
						// onFocus
					}
				}
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
			{onSort && (
				<div className={cx(classes.sortContainer)}>
					<Button
						priority="tertiary no outline"
						onClick={() => {
							onSort(
								currentSort?.slug === slug && currentSort?.direction === 'desc'
									? null
									: { slug, direction: 'desc' }
							);
						}}
						nativeButtonProps={{
							title: `Trier les démarches par rapport à la valeur de "${text}" de manière descendante`,
							className: cx(
								classes.sortButton,
								currentSort?.slug === slug &&
								currentSort?.direction === 'desc' &&
								classes.sortButtonActive
							)
						}}
					>
						<i className={cx(fr.cx('ri-arrow-down-line'), classes.sortIcon)} />
						<span className={fr.cx('fr-sr-only')}>
							Trier les démarches par rapport à la valeur de "{text}" de manière descendante
						</span>
					</Button>
					<Button
						priority="tertiary no outline"
						onClick={() => {
							onSort(
								currentSort?.slug === slug && currentSort?.direction === 'asc'
									? null
									: { slug, direction: 'asc' }
							);
						}}
						nativeButtonProps={{
							title: `Trier les démarches par rapport à la valeur de "${text}" de manière ascendante`,
							className: cx(
								classes.sortButton,
								currentSort?.slug === slug &&
								currentSort?.direction === 'asc' &&
								classes.sortButtonActive
							)
						}}
					>
						<i className={cx(fr.cx('ri-arrow-up-line'), classes.sortIcon)} />
						<span className={fr.cx('fr-sr-only')}>
							Trier les démarches par rapport à la valeur de "{text}" de manière ascendante
						</span>
					</Button>
				</div>
			)}
			<modal.Component
				title={infos.title}
				className={cx(classes.modalContainer)}
				buttons={[
					{
						onClick: () => router.push('/Aide/Observatoire?tab=indicators'),
						children: 'Consulter toute la documentation'
					}
				]}
			>
				{infos.content}
			</modal.Component>
		</>
	);
}

const useStyles = tss.withName(ColumnHeaderDefinition.name).create(() => ({
	root: {
		width: '90%',
		height: 'auto',
		minHeight: '65%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'start',
		alignItems: 'center',
		padding: fr.spacing('2v'),
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
		fontWeight: 'bold',
		textAlign: 'center',
		cursor: 'pointer',
		borderRadius: '8px',
		backgroundColor: 'transparent',
		[':hover']: {
			backgroundColor:
				fr.colors.decisions.background.alt.blueFrance.default + ' !important'
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
		fontWeight: 500,
		fontSize: fr.typography[18].style.fontSize,
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
		justifyContent: 'center',
		gap: fr.spacing('1v')
	},
	sortButton: {
		borderRadius: fr.spacing('2v')
	},
	sortButtonActive: {
		backgroundColor: `${fr.colors.decisions.background.contrast.blueFrance.active}!important`
	},
	sortIcon: {
		':before': {
			'--icon-size': fr.typography[21].style.fontSize
		}
	},
	modalContainer: {
		textAlign: 'left',
		fontWeight: 'normal',
		'& .fr-modal__footer': {
			backgroundImage: 'none !important'
		},
		[fr.breakpoints.down('md')]: {
			padding: fr.spacing('3v')
		}
	}
}));
