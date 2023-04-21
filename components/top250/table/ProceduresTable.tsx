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
						<tr key={p.id}>
							<td scope="row">
								<div>
									<span>{p.title}</span>
									<br />
									<div className={fr.cx('fr-text--sm', 'fr-mt-1v', 'fr-mb-0')}>
										{p.ministere}
									</div>
									<span className={fr.cx('fr-text--sm')}>
										{p.administration}
									</span>
									<div className={fr.cx('fr-text--xs', 'fr-mt-2v', 'fr-mb-0')}>
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
			width: '100%',
			tr: {
				display: 'grid',
				gridTemplateColumns:
					'20% repeat(5, calc(80% / 5)) repeat(6, calc(100% / 6 ))',
				td: {
					['&:nth-child(1)']: {
						position: 'sticky',
						left: 0,
						zIndex: 1
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
