import { TFieldSlug } from '@/pages/api/procedures/types';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';
import { classnames } from 'tss-react/tools/classnames';

type Props = {
	slug: TFieldSlug;
	value: number | string;
};

const acceptedSlugValues: TFieldSlug[] = ['online', 'satisfaction', 'handicap'];

function IndicatorValueDisplay(props: Props): JSX.Element {
	const { slug, value } = props;
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

	if (slug === 'satisfaction' && typeof value === 'number')
		return (
			<Link href="#" className={classes.hideMobile}>
				{value.toString().replace('.', ',')} / 10
			</Link>
		);

	if (slug === 'handicap') return <>{value}</>;

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
			position: 'static',
			marginTop: 0,
			marginLeft: fr.spacing('2v'),
			transform: 'translateX(0)'
		}
	},
	hideMobile: {
		[fr.breakpoints.down('lg')]: { display: 'none' }
	}
}));
