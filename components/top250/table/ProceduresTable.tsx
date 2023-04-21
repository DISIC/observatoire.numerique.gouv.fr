import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ColumnHeaderDefinition } from './ColumnHeaderDefinition';
import { IndicatorLabel } from './IndicatorLabel';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IndicatorValue } from './IndicatorValue';
import { useProcedureHeaders } from '@/utils/api';
import { ProcedureHeaderContent } from './ProcedureHeaderContent';
import { getDisplayedVolume } from '@/utils/tools';
import { SkipLinks } from '@/components/generic/SkipLinks';

type Props = {
	procedures: ProcedureWithFields[];
};

export function ProceduresTable(props: Props) {
	const { procedures } = props;
	const { classes, cx } = useStyles();

	const [isRight, setIsRight] = useState<boolean>(false);

	const stickyHeaderRef = useRef<HTMLTableRowElement | null>(null);
	const tableRef = useRef<HTMLTableElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);

	function contentScrollHeader() {
		if (stickyHeaderRef.current && scrollRef.current)
			stickyHeaderRef.current.scrollLeft = scrollRef.current.scrollLeft;
	}

	function headerScrollContent() {
		if (scrollRef.current && stickyHeaderRef.current)
			scrollRef.current.scrollLeft = stickyHeaderRef.current.scrollLeft;
	}

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.addEventListener('scroll', contentScrollHeader);
		}

		if (stickyHeaderRef.current) {
			stickyHeaderRef.current.addEventListener('scroll', headerScrollContent);
		}
	}, [stickyHeaderRef.current, scrollRef.current]);

	useLayoutEffect(() => {
		const fixedHeader = () => {
			let fixedTop = stickyHeaderRef?.current?.getBoundingClientRect().top;
			let tableTop = scrollRef?.current?.getBoundingClientRect().top;
			if (fixedTop !== undefined && tableTop !== undefined) {
				const isFixed =
					stickyHeaderRef.current?.classList.contains('sticked-row');
				if (!isFixed && fixedTop < 0) {
					stickyHeaderRef.current?.classList.add('sticked-row');
					tableRef.current?.classList.add('table-has-sticked-row');
					if (stickyHeaderRef.current && scrollRef.current) {
						stickyHeaderRef.current.scrollLeft = scrollRef.current.scrollLeft;
					}
				} else if (isFixed && tableTop > 0) {
					stickyHeaderRef.current?.classList.remove('sticked-row');
					tableRef.current?.classList.remove('table-has-sticked-row');
				}
			}
		};
		window.addEventListener('scroll', fixedHeader);
	}, []);

	const {
		data: proceduresTableHeaders,
		isError,
		isLoading
	} = useProcedureHeaders();
	if (isError) return <div>Une erreur est survenue.</div>;
	if (isLoading)
		return (
			<div className={cx(classes.loader)}>
				<div>
					<i className={fr.cx('ri-loader-4-line')} />
				</div>

				<p className={fr.cx('fr-pt-4v')}>Chargement du tableau...</p>
			</div>
		);
	if (!proceduresTableHeaders) return <div>Aucune colonne de démarche</div>;

	const handleScrollX = (tmpIsRight: boolean, disabledSmooth?: boolean) => {
		const _userViewportAvailable = window.innerWidth - 40;
		const _containerWidth =
			_userViewportAvailable < 1400 ? _userViewportAvailable : 1400;
		const _firstColSize = _containerWidth * 0.28;
		const isSticky =
			stickyHeaderRef?.current?.classList.contains('sticked-row');

		scrollRef?.current?.scrollTo({
			left: tmpIsRight ? _containerWidth - _firstColSize : 0,
			behavior: isSticky ? 'auto' : disabledSmooth ? 'auto' : 'smooth'
		});

		setIsRight(tmpIsRight);
	};

	return (
		<div className={cx(classes.root)} ref={scrollRef}>
			<table className={cx(classes.table)} ref={tableRef} id="procedure-table">
				<thead>
					<tr ref={stickyHeaderRef}>
						<th></th>
						{proceduresTableHeaders.map((pth, index) => {
							return (
								<th key={pth.label} scope="col">
									<ColumnHeaderDefinition
										icon={pth.icon as FrIconClassName | RiIconClassName}
										text={pth.label}
										infos={{
											content: (
												<>
													<ProcedureHeaderContent slug={pth.slug} />
												</>
											),
											title: pth.label
										}}
										onFocus={() => {
											if (index >= 5) handleScrollX(true, true);
											else handleScrollX(false, true);
										}}
									/>
								</th>
							);
						})}
						<th className={classes.arrowTh}>
							<button
								className={cx(classes.arrow)}
								onClick={() => {
									handleScrollX(!isRight);
								}}
								tabIndex={-1}
								aria-label={
									!isRight
										? 'Voir les indicateurs suivants'
										: 'Voir les indicateurs précédents'
								}
							>
								<i
									className={fr.cx(
										!isRight ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'
									)}
								/>
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{procedures.map((p, index) => (
						<>
							<tr key={p.id} id={`procedure-table-row-${index}`}>
								<td scope="row">
									<div>
										<span>{p.title}</span>
										<br />
										<div
											className={fr.cx('fr-text--sm', 'fr-mt-1v', 'fr-mb-0')}
										>
											{p.ministere}
										</div>
										<span className={fr.cx('fr-text--sm')}>
											{p.administration}
										</span>
										<div
											className={fr.cx('fr-text--xs', 'fr-mt-2v', 'fr-mb-0')}
										>
											Volumétrie en ligne :{' '}
											{p.volume && getDisplayedVolume(p.volume)}
										</div>
									</div>
								</td>
								{proceduresTableHeaders.map((pth, index) => {
									const field = p.fields.find(f => f.slug === pth.slug);

									if (!field) return <>No</>;

									return (
										<td key={`${p.title} ${pth.label}`}>
											<IndicatorLabel {...field} />
											{field.value && (
												<IndicatorValue
													slug={field.slug}
													value={field.value}
													procedureId={p.airtable_identifier}
												/>
											)}
										</td>
									);
								})}
								<td>
									<div></div>
								</td>
							</tr>
							<tr key={`${p.id}-skiplinks`}>
								<td colSpan={12} className={fr.cx('fr-pl-1-5v')}>
									<SkipLinks
										links={[
											{
												text: 'Aller au pied du tableau',
												href: '#table-footer'
											},
											{
												text: 'Revenir à la première ligne',
												href: '#procedure-table-row-0'
											},
											{
												text: 'Revenir au dessus du tableau',
												href: '#procedures-section'
											}
										]}
									/>
								</td>
							</tr>
						</>
					))}
				</tbody>
			</table>
		</div>
	);
}

const useStyles = makeStyles()(theme => {
	const _userViewportAvailable = window.innerWidth - 40;
	const _containerWidth =
		_userViewportAvailable < 1400 ? _userViewportAvailable : 1400;
	const _firstColSize = _containerWidth * 0.28;
	const _arrowSlideSize = 40;
	const _thRadius = 10;

	return {
		root: {
			width: '100%',
			overflowX: 'scroll',
			scrollbarWidth: 'none',
			msOverflowStyle: 'none',
			['&::-webkit-scrollbar']: {
				display: 'none'
			}
		},
		table: {
			width: 'max-content',
			marginTop: fr.spacing('2v'),
			height: '100%',
			borderSpacing: `0 ${fr.spacing('2v')}`,
			['&.table-has-sticked-row']: {
				marginTop: 150
			},
			tr: {
				['&.sticked-row']: {
					overflowX: 'scroll',
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
					['&::-webkit-scrollbar']: {
						display: 'none'
					},
					position: 'fixed',
					top: '-12px',
					zIndex: 99,
					width: _containerWidth,
					maxWidth: `calc(100% - ${_arrowSlideSize})`,
					th: {
						borderBottom: `3px solid ${theme.decisions.background.contrast.info.default}`,
						borderTopLeftRadius: _thRadius
					},
					['th:nth-of-type(2)']: {
						borderTopLeftRadius: 0
					},
					['th:nth-of-type(-n + 5):not(:first-of-type)']: {
						minWidth: (_containerWidth - _firstColSize) / 5
					},
					['th:nth-of-type(n + 6)']: {
						minWidth: (_containerWidth - _firstColSize - _arrowSlideSize) / 6
					},
					['th:last-child']: {
						minWidth: _arrowSlideSize
					},
					['th:first-of-type']: {
						borderRight: `2px solid ${theme.decisions.background.contrast.info.default}`,
						minWidth: _firstColSize,
						backgroundColor: theme.decisions.background.default.grey.default
					},
					['button:first-of-type']: {
						fontWeight: 500,
						fontSize: fr.typography[18].style.fontSize,
						['&:first-of-type > i']: { display: 'none' },
						['&:first-of-type > span']: { marginTop: 0 }
					}
				},
				['&:hover']: {
					['td:not(:first-of-type)']: {
						borderTopColor:
							theme.decisions.background.actionHigh.blueFrance.hover,
						borderBottomColor:
							theme.decisions.background.actionHigh.blueFrance.hover,
						['&:last-child > div']: {
							border: `1px solid ${theme.decisions.background.actionHigh.blueFrance.hover}`,
							borderLeftWidth: 0
						}
					},
					['td:first-of-type ']: {
						borderRight: `1px solid ${theme.decisions.background.actionHigh.blueFrance.hover}`,
						['& > div']: {
							borderLeft: `1px solid ${theme.decisions.background.actionHigh.blueFrance.hover}`,
							borderTop: `1px solid ${theme.decisions.background.actionHigh.blueFrance.hover}`,
							borderBottom: `1px solid ${theme.decisions.background.actionHigh.blueFrance.hover}`,
							borderTopLeftRadius: _thRadius,
							borderBottomLeftRadius: _thRadius
						}
					}
				}
			},
			th: {
				backgroundColor: theme.decisions.background.default.grey.default,
				['& > button']: {
					marginLeft: 'auto',
					marginRight: 'auto'
				},
				['&:first-of-type']: {
					position: 'sticky',
					left: 0,
					backgroundColor: theme.decisions.background.contrast.info.default,
					zIndex: 11
				},
				['&:nth-of-type(2), &:nth-of-type(7)']: {
					borderTopLeftRadius: _thRadius
				},
				['&:last-child']: {
					position: 'sticky',
					right: 0,
					zIndex: 11,
					width: _arrowSlideSize,
					['& > div']: {
						borderTopRightRadius: _thRadius
					}
				},
				['&:not(:first-of-type):not(:last-child)']: {
					verticalAlign: 'top'
				}
			},
			td: {
				backgroundColor: theme.decisions.background.default.grey.default,
				border: '1px solid transparent',
				position: 'relative',
				['&:nth-of-type(-n + 5)']: {
					width: (_containerWidth - _firstColSize) / 5
				},
				['&:nth-of-type(n + 6)']: {
					width: (_containerWidth - _firstColSize - _arrowSlideSize) / 6
				},
				['&:not(:first-of-type)']: {
					textAlign: 'center'
				},
				['&:first-of-type']: {
					position: 'sticky',
					zIndex: 9,
					left: 0,
					width: _firstColSize,
					backgroundColor: theme.decisions.background.contrast.info.default,
					padding: 0,
					border: 'none',
					borderRight: `2px solid ${theme.decisions.background.contrast.info.default}`,
					['& > div']: {
						borderTop: '1px solid transparent',
						borderLeft: '1px solid transparent',
						borderBottom: '1px solid transparent',
						borderColor: theme.decisions.background.default.grey.default,
						backgroundColor: theme.decisions.background.default.grey.default,
						padding: fr.spacing('4v'),
						borderTopLeftRadius: _thRadius,
						borderBottomLeftRadius: _thRadius,
						['& > span:first-of-type']: {
							fontWeight: 'bold'
						}
					}
				},
				['&:last-child']: {
					width: _arrowSlideSize,
					position: 'sticky',
					zIndex: 9,
					right: 0,
					padding: 0,
					borderWidth: 0,
					height: '100%',
					backgroundColor: theme.decisions.background.contrast.info.default,
					['& > div']: {
						boxSizing: 'border-box',
						height: '100%',
						backgroundColor: theme.decisions.background.default.grey.default,
						borderTopRightRadius: _thRadius,
						borderBottomRightRadius: _thRadius
					}
				}
			}
		},
		arrow: {
			width: _arrowSlideSize,
			backgroundColor: theme.decisions.background.actionHigh.blueFrance.default,
			position: 'absolute',
			right: 0,
			top: 0,
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			borderTopRightRadius: _thRadius,
			['&:hover']: {
				backgroundColor:
					theme.decisions.background.actionHigh.blueFrance.hover + ' !important'
			},
			i: {
				color: theme.decisions.background.default.grey.default,
				display: 'block !important'
			}
		},
		arrowTh: {
			backgroundColor: `${theme.decisions.background.contrast.info.default} !important`,
			width: _arrowSlideSize,
			position: 'relative'
		},
		loader: {
			padding: fr.spacing('30v'),
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			i: {
				display: 'inline-block',
				animation: 'spin 1s linear infinite;',
				color: theme.decisions.background.actionHigh.blueFrance.default,
				['&::before']: {
					'--icon-size': '2rem'
				}
			}
		}
	};
});
