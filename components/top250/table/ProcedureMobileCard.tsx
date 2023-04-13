import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorLabel } from './IndicatorLabel';
import { ColumnHeaderDefinition } from './ColumnHeaderDefinition';
import { IndicatorValue } from './IndicatorValue';
import { createRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { ProcedureHeader } from '@prisma/client';
import { ProcedureHeaderContent } from './ProcedureHeaderContent';

type Props = {
	procedure: ProcedureWithFields;
	proceduresTableHeaders: ProcedureHeader[];
};

export function ProcedureMobileCard(props: Props) {
	const { procedure, proceduresTableHeaders } = props;
	const { classes, cx } = useStyles();

	const [toogleSwitch, setToogleSwitch] = useState<boolean>(false);

	return (
		<div className={cx(classes.root)}>
			<div className={cx(classes.mainInfos)}>
				<div className={fr.cx('fr-text--sm', 'fr-mb-0')}>{procedure.title}</div>
				<div className={fr.cx('fr-text--xs', 'fr-mb-0')}>
					<div>{procedure.ministere}</div>
					{procedure.volume && (
						<div className={fr.cx('fr-mt-3v')}>
							Total d&apos;utilisateur annuel : {procedure.volume}
						</div>
					)}
				</div>
			</div>
			<hr className={fr.cx('fr-pb-1v', 'fr-mt-3v')} />
			<TransitionGroup className={cx(classes.fields)}>
				{proceduresTableHeaders
					.map(f => ({ ...f, nodeRef: createRef<HTMLDivElement>() }))
					.map((pth, index) => {
						const field = procedure.fields.find(f => pth.slug === f.slug);

						if (!field) return <></>;

						const canBeSeen = index <= 4 || toogleSwitch;
						return (
							canBeSeen && (
								<CSSTransition
									nodeRef={pth.nodeRef}
									timeout={300}
									key={field.slug}
									classNames={classes.fieldTransition}
								>
									<div className={cx(classes.field)} ref={pth.nodeRef}>
										<ColumnHeaderDefinition
											icon={pth.icon as FrIconClassName | RiIconClassName}
											text={pth.label}
											infos={{
												content: <ProcedureHeaderContent slug={pth.slug} />,
												title: pth.label
											}}
											isMobile
										/>
										<IndicatorLabel {...field} />
										{field.value && (
											<IndicatorValue
												slug={field.slug}
												value={field.value}
												procedureId={procedure.airtable_identifier}
											/>
										)}
									</div>
								</CSSTransition>
							)
						);
					})}
			</TransitionGroup>
			<button
				type="button"
				className={classes.toogle}
				onClick={() => setToogleSwitch(!toogleSwitch)}
			>
				<i
					className={fr.cx(
						toogleSwitch ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
					)}
				/>
			</button>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		backgroundColor: theme.decisions.background.default.grey.default,
		border: `1px solid ${theme.decisions.border.default.blueFrance.default}`,
		borderTopLeftRadius: fr.spacing('2v'),
		borderTopRightRadius: fr.spacing('2v'),
		padding: fr.spacing('2v'),
		paddingLeft: fr.spacing('4v'),
		paddingRight: fr.spacing('4v'),
		marginBottom: fr.spacing('12v'),
		position: 'relative'
	},
	mainInfos: {
		['& > div:first-child']: {
			fontWeight: 500
		}
	},
	fields: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: fr.spacing('2v'),
		paddingBottom: fr.spacing('2v')
	},
	field: {
		position: 'relative',
		marginBottom: fr.spacing('4v'),
		['&:last-child']: {
			marginBottom: fr.spacing('2v')
		}
	},
	toogle: {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: theme.decisions.background.actionHigh.blueFrance.default,
		color: theme.decisions.background.default.grey.default,
		position: 'absolute',
		width: 'calc(100% + 2px)',
		bottom: 0,
		left: 0,
		transform: 'translateY(100%)translateX(-1px)',
		borderBottomRightRadius: fr.spacing('2v'),
		borderBottomLeftRadius: fr.spacing('2v'),
		paddingTop: fr.spacing('1v'),
		paddingBottom: fr.spacing('1v')
	},
	fieldTransition: {
		position: 'relative',
		['&-enter']: {
			opacity: 0
		},
		['&-enter-active']: {
			opacity: 1,
			transition: 'opacity 500ms ease-in'
		},
		['&-exit']: {
			opacity: 1
		},
		['&-exit-active']: {
			opacity: 0,
			transition: 'opacity 500ms ease-in'
		}
	}
}));
