import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorLabel } from './IndicatorLabel';
import { ColumnHeaderDefinition } from './ColumnHeaderDefinition';
import { IndicatorValue } from './IndicatorValue';
import { createRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { Field, ProcedureHeader } from '@prisma/client';
import { ProcedureHeaderContent } from './ProcedureHeaderContent';
import { getDisplayedVolume } from '@/utils/tools';
import { IndicatorProactive } from './IndicatorProactive';
import Button from '@codegouvfr/react-dsfr/Button';

type Props = {
	procedure: ProcedureWithFields;
	proceduresTableHeaders: ProcedureHeader[];
};

export function ProcedureMobileCard(props: Props) {
	const { procedure, proceduresTableHeaders } = props;
	const { classes, cx } = useStyles();

	const [toogleSwitch, setToogleSwitch] = useState<boolean>(false);

	const isProactive = procedure.fields.some(
		f => f.slug === 'online' && f.label === 'Démarche proactive'
	);
	const isToCome = procedure.fields.some(
		f => f.slug === 'online' && f.label === 'À venir'
	);
	const isNotOnline = procedure.fields.some(
		f => f.slug === 'online' && f.label === 'Non'
	);

	const displayIndicator = (field: Field) => {
		if (isToCome && field.slug !== 'online')
			return <IndicatorLabel color="gray" label="À venir" noBackground />;

		if (isNotOnline && field.slug !== 'online')
			return <IndicatorLabel color="gray" label="-" noBackground />;

		return (
			<>
				<IndicatorLabel {...field} />

				{field.value && (
					<IndicatorValue
						slug={field.slug}
						value={field.value}
						noJdma={procedure.noJdma}
						label={field.label}
						procedureId={procedure.airtable_identifier}
					/>
				)}
			</>
		);
	};

	return (
		<div
			className={cx(classes.root)}
			style={{
				borderBottomLeftRadius: isProactive ? fr.spacing('2v') : 0,
				borderBottomRightRadius: isProactive ? fr.spacing('2v') : 0
			}}
		>
			<div className={cx(classes.mainInfos)}>
				<div className={fr.cx('fr-text--sm', 'fr-mb-0')}>{procedure.title}</div>
				<div className={fr.cx('fr-text--xs', 'fr-mb-0')}>
					<div>{procedure.ministere}</div>
					<div className={fr.cx('fr-mt-3v')}>
						Volumétrie :{' '}
						{procedure.volume
							? getDisplayedVolume(procedure.volume)
							: 'non communiquée'}
					</div>
				</div>
			</div>
			<hr className={fr.cx('fr-pb-1v', 'fr-mt-3v')} />
			<TransitionGroup className={cx(classes.fields)}>
				{proceduresTableHeaders
					.map(f => ({ ...f, nodeRef: createRef<HTMLDivElement>() }))
					.map((pth, index) => {
						const field = procedure.fields.find(f => pth.slug === f.slug);

						if (!field) return <></>;
						if (isProactive && field.slug === 'satisfaction')
							return <IndicatorProactive />;
						if (isProactive && field.slug !== 'online') return <></>;

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
										{displayIndicator(field)}
									</div>
								</CSSTransition>
							)
						);
					})}
			</TransitionGroup>
			{!isProactive && (
				<Button
					type="button"
					className={classes.toogle}
					onClick={() => setToogleSwitch(!toogleSwitch)}
				>
					{toogleSwitch
						? "Voir moins d'indicateurs"
						: "Voir plus d'indicateurs"}
				</Button>
			)}
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
		['& > div:first-of-type']: {
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
		paddingTop: fr.spacing('2v'),
		paddingBottom: fr.spacing('2v')
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
