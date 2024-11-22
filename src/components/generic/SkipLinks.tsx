import { fr } from '@codegouvfr/react-dsfr';
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

	if (links.length === 1) {
		return (
			<div className={classes.skipLinkList}>
				<a href={links[0].href}>{links[0].text}</a>
			</div>
		);
	}

	return (
		<ul className={classes.skipLinkList}>
			{links.map((link, index) => (
				<li key={index}>
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
		backgroundColor: 'transparent',
		['&:focus-within']: {
			position: 'static'
		},
		['li:not(:first-of-type)']: {
			marginLeft: fr.spacing('10v')
		}
	}
}));
