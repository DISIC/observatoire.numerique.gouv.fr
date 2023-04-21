import { fr } from '@/../react-dsfr/dist/fr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	links: {
		text: string;
		href: string;
	}[];
};

export function SkipLinks(props: Props) {
	const { links } = props;
	const { classes, cx } = useStyles();

	return (
		<ul className={classes.skipLinkList}>
			{links.map(link => (
				<li>
					<a href={link.href}>{link.text}</a>
				</li>
			))}
		</ul>
	);
}

const useStyles = makeStyles()(theme => ({
	skipLinkList: {
		display: 'flex',
		flexDirection: 'row',
		listStyle: 'none',
		position: 'fixed',
		left: -99999,
		paddingLeft: 0,
		['&:focus-within']: {
			position: 'static'
		},
		['li:not(:first-of-type)']: {
			marginLeft: fr.spacing('10v')
		}
	}
}));
