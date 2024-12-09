import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Edition, IndicatorSlug } from '@prisma/client';
import Link from 'next/link';
import { ReactNode, useEffect, useRef } from 'react';

type Props = {
	slug: IndicatorSlug;
	procedureId: number | null;
	procedureTitle: string | null;
	edition?: Edition;
	value: string;
	noJdma?: boolean;
	label: string;
	onLinkFocus?: () => void;
};

const acceptedSlugValues: IndicatorSlug[] = [
	'online',
	'satisfaction',
	'handicap',
	'uptime',
	'performance'
];

function IndicatorValueDisplay(props: Props): ReactNode {
	const {
		slug,
		value,
		label,
		procedureId,
		procedureTitle,
		edition,
		noJdma,
		onLinkFocus
	} = props;
	const { classes, cx } = useStyles();

	const linkRef = useRef<HTMLAnchorElement | null>(null);

	useEffect(() => {
		const link = linkRef.current;

		if (link && onLinkFocus) {
			link.addEventListener('focus', onLinkFocus);

			// Clean up
			return () => {
				link.removeEventListener('focus', onLinkFocus);
			};
		}
	}, []);

	if (slug === 'online' && label !== 'À venir' && typeof value === 'string')
		return (
			<Link
				ref={linkRef}
				href={value}
				title={`Voir le service ${procedureTitle}`}
				target="_blank"
				rel="noreferrer"
			>
				Voir le service
			</Link>
		);

	if (
		procedureId &&
		slug === 'satisfaction' &&
		!isNaN(parseInt(value)) &&
		!noJdma
	) {
		const valueToDisplay = value.toString().replace('.', ',');

		let datesParam = `date-debut=2022-04-01&date-fin=2023-03-31`;
		if (edition)
			datesParam = `date-debut=${edition.start_date.toString().split('T')[0]
				}&date-fin=${edition.end_date.toString().split('T')[0]}`;

		return (
			<Link
				ref={linkRef}
				title={`Voir le détail : satisfaction usagers : ${valueToDisplay} sur 10, consulter les statistiques`}
				href={`/Demarches/${procedureId}?view-mode=statistics&${datesParam}`}
				target="_blank"
			>
				Voir le détail
			</Link>
		);
	}

	if (slug === 'uptime' && !isNaN(parseInt(value))) return <>{value}%</>;
	if (slug === 'performance' && !isNaN(parseInt(value)))
		return <>{parseInt(value) / 1000}s</>;
	if (slug === 'handicap' && !isNaN(parseInt(value))) return <>{value}%</>;

	return <></>;
}

export function IndicatorValue(props: Props) {
	const { slug } = props;
	const { classes, cx } = useStyles();

	if (!acceptedSlugValues.includes(slug)) return <></>;

	return (
		<div className={classes.root}>
			<IndicatorValueDisplay {...props} />
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		fontSize: fr.typography[17].style.fontSize,
		marginTop: fr.spacing('4v'),
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translateX(-50%)',
		width: '100%',
		['a::after']: {
			'--icon-size': 0,
			margin: 0
		},
		[fr.breakpoints.down('lg')]: {
			position: 'relative',
			top: 0,
			left: 0,
			transform: 'translateX(0)',
			marginTop: fr.spacing('2v')
		}
	}
}));
