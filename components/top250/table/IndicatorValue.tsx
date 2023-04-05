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
	'simplicity',
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
				className={classes.hideMobile}
				target="_blank"
				rel="noreferrer"
			>
				Voir le service
			</a>
		);

	if (slug === 'satisfaction' && !isNaN(parseInt(value)))
		return (
			<Link
				href={`https://observatoire.numerique.gouv.fr/Demarches/${procedureId}?view-mode=statistics&date-debut=2022-04-01&date-fin=2023-03-31`}
				className={classes.hideMobile}
			>
				{value.toString().replace('.', ',')} / 10
			</Link>
		);

	if (slug === 'uptime' && !isNaN(parseInt(value))) return <>{value}%</>;
	if (slug === 'performance' && !isNaN(parseInt(value)))
		return <>{parseInt(value) / 1000}s</>;
	if (slug === 'simplicity' && !isNaN(parseInt(value)))
		return <>{value} / 10</>;
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
			display: 'inline',
			position: 'relative',
			left: 0,
			zIndex: 1,
			marginTop: 0,
			marginLeft: fr.spacing('2v'),
			transform: 'translateX(0)'
		}
	},
	hideMobile: {
		[fr.breakpoints.down('lg')]: { display: 'none' }
	}
}));
