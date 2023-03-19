import { TProcedure } from '@/pages/api/procedures/types';
import { proceduresTableHeaders } from '@/utils/mock';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ColumnHeaderDefinition } from './ColumnHeaderDefinition';
import { IndicatorLabel } from './IndicatorLabel';
import { useLayoutEffect, useRef } from 'react';
import { IndicatorValue } from './IndicatorValue';

type Props = {
	procedures: TProcedure[];
};

const _containerSize = 1208;
const _firstColSize = 358;
const _arrowSlideSize = 40;
const _thRadius = 10;

export function ProceduresTable(props: Props) {
	const { procedures } = props;
	const { classes, cx } = useStyles();

	const stickyHeaderRef = useRef<HTMLTableRowElement | null>(null);
	const tableRef = useRef<HTMLTableElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);

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

	const handleScrollX = (isRight: boolean) => {
		scrollRef?.current?.scrollTo({
			left: isRight ? _containerSize - _firstColSize + _arrowSlideSize : 0,
			behavior: 'smooth'
		});

		if (stickyHeaderRef?.current?.classList.contains('sticked-row')) {
			stickyHeaderRef?.current?.scrollTo({
				left: isRight ? _containerSize - _firstColSize + _arrowSlideSize : 0,
				behavior: 'smooth'
			});
		}
	};

	return (
		<div className={cx(classes.root)} ref={scrollRef}>
			<table className={cx(classes.table)} ref={tableRef}>
				<thead>
					<tr ref={stickyHeaderRef}>
						<th></th>
						{proceduresTableHeaders.map((pth, index) => {
							const hasArrow = index === 4 || index === 9;
							return (
								<th
									key={pth.label}
									className={cx(hasArrow ? classes.arrowTh : {})}
								>
									<ColumnHeaderDefinition
										icon={pth.icon}
										text={pth.label}
										infos={{
											content:
												'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, duis ac egestas donec tincidunt lorem. Sodales risus amet nisl sed. Vitae bibendum et penatibus a eget ipsum mattis pharetra. Diam molestie vitae, diam, sed tincidunt facilisi. Arcu faucibus mattis varius pretium. Duis ullamcorper malesuada massa ipsum sit. Ornare donec sit lobortis nullam dictum ullamcorper ac. Congue erat lorem quam amet sagittis egestas lorem. Arcu, nisl, massa eu, a nulla fusce egestas vitae. Mi tortor, penatibus auctor in nisl enim velit pellentesque. Consectetur urna, eleifend non congue dolor adipiscing nec. Ipsum laoreet dui facilisis pellentesque lacus.',
											title: pth.label
										}}
									/>
									{hasArrow && (
										<button
											className={cx(classes.arrow)}
											onClick={() => {
												handleScrollX(index === 4);
											}}
											aria-label={
												index === 4
													? 'Voir les indicateurs suivants'
													: 'Voir les indicateurs précédents'
											}
										>
											<i
												className={fr.cx(
													index === 4
														? 'ri-arrow-right-s-line'
														: 'ri-arrow-left-s-line'
												)}
											/>
										</button>
									)}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{procedures
						.concat(procedures)
						.concat(procedures)
						.concat(procedures)
						.map(p => (
							<tr key={p.title}>
								<td>
									<span>{p.title}</span>
									<br />
									<span className={fr.cx('fr-text--sm')}>{p.ministere}</span>
									<br />
									<span className={fr.cx('fr-text--sm')}>
										{p.administration}
									</span>
								</td>
								{proceduresTableHeaders.map((pth, index) => {
									const field = p.fields.find(f => f.slug === pth.slug);

									if (!field) return <>No</>;

									return (
										<td
											key={`${p.title} ${pth.label}`}
											className={cx(
												index === 4 || index === 9 ? classes.arrowTd : {}
											)}
										>
											<IndicatorLabel {...field} />
											{field.value && (
												<IndicatorValue slug={field.slug} value={field.value} />
											)}
										</td>
									);
								})}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
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
				top: '-10px',
				zIndex: 99,
				marginLeft: _firstColSize,
				width: _containerSize - _firstColSize,
				['th:not(:first-child)']: {
					minWidth: (_containerSize - _firstColSize) / 5,
					borderBottom: `3px solid ${theme.decisions.background.contrast.info.default}`
				},
				button: {
					fontWeight: 500,
					fontSize: fr.typography[18].style.fontSize,
					['&:first-of-type > i']: { display: 'none' },
					['&:first-of-type > span']: { marginTop: 0 }
				}
			}
		},
		th: {
			zIndex: 10,
			backgroundColor: 'white',
			['& > button']: {
				margin: 'auto'
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
			['&:nth-of-type(6), &:last-child']: {
				borderTopRightRadius: _thRadius
			}
		},
		td: {
			backgroundColor: 'white',
			width: (_containerSize - _firstColSize - _arrowSlideSize) / 5,
			['&:not(:first-child)']: {
				textAlign: 'center'
			},
			['&:first-child']: {
				position: 'sticky',
				left: 0,
				width: _firstColSize,
				borderRight: `2px solid ${theme.decisions.background.contrast.info.default}`,
				padding: fr.spacing('4v'),
				borderTopLeftRadius: _thRadius,
				borderBottomLeftRadius: _thRadius,
				['& > span:first-child']: {
					fontWeight: 'bold'
				}
			},
			['&:last-child']: {
				borderTopRightRadius: _thRadius,
				borderBottomRightRadius: _thRadius
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
			color: 'white'
		}
	},
	arrowTh: {
		width:
			(_containerSize - _firstColSize - _arrowSlideSize) / 5 + _arrowSlideSize,
		paddingRight: _arrowSlideSize,
		position: 'relative'
	},
	arrowTd: {
		width:
			(_containerSize - _firstColSize - _arrowSlideSize) / 5 +
			_arrowSlideSize +
			'px !important',
		paddingRight: _arrowSlideSize
	}
}));
