import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ColumnHeaderDefinition } from './ColumnHeaderDefinition';
import { IndicatorLabel } from './IndicatorLabel';
import { useLayoutEffect, useRef, useState } from 'react';
import { IndicatorValue } from './IndicatorValue';
import { useProcedureHeaders } from '@/utils/api';

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
	}, []);

	useLayoutEffect(() => {
		let fixedTop = stickyHeaderRef?.current?.getBoundingClientRect().top;
		const fixedHeader = () => {
			if (fixedTop !== undefined) {
				if (window.pageYOffset > fixedTop) {
					stickyHeaderRef.current?.classList.add('sticked-row');
					tableRef.current?.classList.add('table-has-sticked-row');
				} else {
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
	if (isLoading) return <div>Chargement du tableau ...</div>;
	if (!proceduresTableHeaders) return <div>Aucune colonne de démarche</div>;

	const handleScrollX = (tmpIsRight: boolean) => {
		const _userViewportAvailable = window.innerWidth - 40;
		const _containerWidth =
			_userViewportAvailable < 1400 ? _userViewportAvailable : 1400;
		const _firstColSize = _containerWidth * 0.28;
		const isSticky =
			stickyHeaderRef?.current?.classList.contains('sticked-row');

		scrollRef?.current?.scrollTo({
			left: tmpIsRight ? _containerWidth - _firstColSize : 0,
			behavior: isSticky ? 'auto' : 'smooth'
		});

		setIsRight(tmpIsRight);
	};

	return (
		<div className={cx(classes.root)} ref={scrollRef}>
			<table className={cx(classes.table)} ref={tableRef}>
				<thead>
					<tr ref={stickyHeaderRef}>
						<th></th>
						{proceduresTableHeaders.map((pth, index) => {
							return (
								<th key={pth.label}>
									<ColumnHeaderDefinition
										icon={pth.icon as FrIconClassName | RiIconClassName}
										text={pth.label}
										infos={{
											content:
												'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, duis ac egestas donec tincidunt lorem. Sodales risus amet nisl sed. Vitae bibendum et penatibus a eget ipsum mattis pharetra. Diam molestie vitae, diam, sed tincidunt facilisi. Arcu faucibus mattis varius pretium. Duis ullamcorper malesuada massa ipsum sit. Ornare donec sit lobortis nullam dictum ullamcorper ac. Congue erat lorem quam amet sagittis egestas lorem. Arcu, nisl, massa eu, a nulla fusce egestas vitae. Mi tortor, penatibus auctor in nisl enim velit pellentesque. Consectetur urna, eleifend non congue dolor adipiscing nec. Ipsum laoreet dui facilisis pellentesque lacus.',
											title: pth.label
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
					{procedures.map(p => (
						<tr key={p.title}>
							<td>
								<div>
									<span>{p.title}</span>
									<br />
									<div className={fr.cx('fr-text--sm', 'fr-mt-2v', 'fr-mb-0')}>
										{p.ministere}
									</div>
									<span className={fr.cx('fr-text--sm')}>
										{p.administration}
									</span>
								</div>
							</td>
							{proceduresTableHeaders.map((pth, index) => {
								const field = p.fields.find(f => f.slug === pth.slug);

								if (!field) return <>No</>;

								return (
									<td key={`${p.title} ${pth.label}`}>
										<IndicatorLabel {...field} />
										{field.value && (
											<IndicatorValue slug={field.slug} value={field.value} />
										)}
									</td>
								);
							})}
							<td>
								<div></div>
							</td>
						</tr>
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
					th: {
						borderBottom: `3px solid ${theme.decisions.background.contrast.info.default}`,
						borderTopLeftRadius: _thRadius
					},
					['th:nth-child(2)']: {
						borderTopLeftRadius: 0
					},
					['th:nth-child(-n + 5):not(:first-child)']: {
						minWidth: (_containerWidth - _firstColSize) / 5
					},
					['th:nth-child(n + 6)']: {
						minWidth: (_containerWidth - _firstColSize - _arrowSlideSize) / 6
					},
					['th:last-child']: {
						minWidth: _arrowSlideSize
					},
					['th:first-child']: {
						borderRight: `2px solid ${theme.decisions.background.contrast.info.default}`,
						minWidth: _firstColSize,
						backgroundColor: theme.decisions.background.default.grey.default
					},
					['button:first-child']: {
						fontWeight: 500,
						fontSize: fr.typography[18].style.fontSize,
						['&:first-of-type > i']: { display: 'none' },
						['&:first-of-type > span']: { marginTop: 0 }
					}
				},
				['&:hover']: {
					['td:not(:first-child)']: {
						borderTopColor:
							theme.decisions.background.actionHigh.blueFrance.hover,
						borderBottomColor:
							theme.decisions.background.actionHigh.blueFrance.hover,
						['&:last-child > div']: {
							border: `1px solid ${theme.decisions.background.actionHigh.blueFrance.hover}`,
							borderLeftWidth: 0
						}
					},
					['td:first-child ']: {
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
				['&:first-child']: {
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
				['&:not(:first-child):not(:last-child)']: {
					verticalAlign: 'top'
				}
			},
			td: {
				backgroundColor: theme.decisions.background.default.grey.default,
				border: '1px solid transparent',
				position: 'relative',
				['&:nth-child(-n + 5)']: {
					width: (_containerWidth - _firstColSize) / 5
				},
				['&:nth-child(n + 6)']: {
					width: (_containerWidth - _firstColSize - _arrowSlideSize) / 6
				},
				['&:not(:first-child)']: {
					textAlign: 'center'
				},
				['&:first-child']: {
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
						['& > span:first-child']: {
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
		}
	};
});
