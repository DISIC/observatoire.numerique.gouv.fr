import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorSlug } from '@prisma/client';
import Link from 'next/link';

type Props = {
	slug: IndicatorSlug;
	procedureId: number;
	value: string;
};

const acceptedSlugValues: IndicatorSlug[] = [
	'online',
	'satisfaction',
	'handicap',
	'uptime',
	'performance'
];

function IndicatorValueDisplay(props: Props): JSX.Element {
	const { slug, value, procedureId } = props;
	const { classes, cx } = useStyles();

	if (slug === 'online' && typeof value === 'string')
		return (
			<a
				href={value}
				title="accéder au service en ligne"
				target="_blank"
				rel="noreferrer"
			>
				Voir le service
			</a>
		);

	if (slug === 'satisfaction' && !isNaN(parseInt(value))) {
		const valueToDisplay = value.toString().replace('.', ',');
		return (
			<Link
				title={`satisfaction usagers : ${valueToDisplay} sur 10, consulter les statistiques`}
				href={`/Demarches/${procedureId}?view-mode=statistics&date-debut=2022-04-01&date-fin=2023-03-31`}
        target="_blank"
			>
				Détails
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
