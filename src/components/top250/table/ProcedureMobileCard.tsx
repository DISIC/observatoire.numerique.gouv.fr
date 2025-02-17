import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { PayloadIndicator } from '@/payload/payload-types';
import { getDisplayedVolume } from '@/utils/tools';
import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { Edition, Field, IndicatorColor, IndicatorSlug } from '@prisma/client';
import { createRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ColumnHeaderDefinition } from './ColumnHeaderDefinition';
import { IndicatorLabel } from './IndicatorLabel';
import { IndicatorProactive } from './IndicatorProactive';
import { IndicatorValue } from './IndicatorValue';
import { IndicatorContent } from './IndicatorContent';
import { tss } from 'tss-react';

type Props = {
	procedure: ProcedureWithFields;
	indicators: PayloadIndicator[];
	edition?: Edition;
};

export function ProcedureMobileCard(props: Props) {
	const { procedure, indicators, edition } = props;
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
			return <IndicatorLabel color="gray" label="À venir" />;

		if (isNotOnline && field.slug !== 'online')
			return <IndicatorLabel color="gray" label="-" noBackground />;

		return (
			<>
				<IndicatorLabel {...field} />

				{!!field.value && (
					<IndicatorValue
						slug={field.slug}
						value={field.value}
						noJdma={procedure.noJdma}
						label={field.label}
						procedureId={procedure.grist_identifier}
						procedureTitle={procedure.title}
						edition={edition}
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
				<h2 className={fr.cx('fr-text--sm', 'fr-mb-0')}>{procedure.title}</h2>
				<div className={fr.cx('fr-text--xs', 'fr-mb-0')}>
					<div>{procedure.ministere}</div>
					<div className={fr.cx('fr-mt-3v')}>
						Volumétrie en ligne :{' '}
						{procedure.volume
							? getDisplayedVolume(procedure.volume)
							: 'non communiquée'}
					</div>
				</div>
			</div>
			<hr className={fr.cx('fr-pb-1v', 'fr-mt-3v')} />
			<TransitionGroup className={cx(classes.fields)}>
				{indicators
					.map(f => ({ ...f, nodeRef: createRef<HTMLDivElement>() }))
					.map((indicator, index) => {
						const field = procedure.fields.find(f => indicator.slug === f.slug);

						if (!field) return <></>;
						if (isProactive && field.slug === 'satisfaction')
							return (
								<div key={index}>
									<IndicatorProactive />
								</div>
							);
						if (isProactive && field.slug !== 'online') return <></>;

						const canBeSeen = index <= 4 || toogleSwitch;
						return (
							canBeSeen && (
								<CSSTransition
									nodeRef={indicator.nodeRef}
									timeout={300}
									key={field.slug}
									classNames={classes.fieldTransition}
								>
									<div className={cx(classes.field)} ref={indicator.nodeRef}>
										<ColumnHeaderDefinition
											slug={indicator.slug as IndicatorSlug}
											icon={indicator.icon as FrIconClassName | RiIconClassName}
											text={indicator.label}
											infos={{
												content: <IndicatorContent indicator={indicator} />,
												title: indicator.label
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

const useStyles = tss.withName(ProcedureMobileCard.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		border: `1px solid ${fr.colors.decisions.border.default.blueFrance.default}`,
		borderTopLeftRadius: fr.spacing('2v'),
		borderTopRightRadius: fr.spacing('2v'),
		padding: fr.spacing('2v'),
		paddingLeft: fr.spacing('4v'),
		paddingRight: fr.spacing('4v'),
		marginBottom: fr.spacing('12v'),
		position: 'relative'
	},
	mainInfos: {
		['& > h2']: {
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
		backgroundColor:
			fr.colors.decisions.background.actionHigh.blueFrance.default,
		color: fr.colors.decisions.background.default.grey.default,
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
