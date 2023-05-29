import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
	button: { link: string; text: string };
};

export function HomeHeader(props: Props) {
	const { title, description, button } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={classes.root}>
			<div className={cx(fr.cx('fr-container'), classes.container)}>
				<h1>{title}</h1>
				<p>{description}</p>
				<Link href={button.link} className={fr.cx('fr-btn')}>
					{button.text}
				</Link>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		backgroundColor: theme.decisions.background.alt.blueFrance.default
	},
	container: {
		maxWidth: '55rem',
		paddingTop: fr.spacing('18v'),
		paddingBottom: fr.spacing('18v'),
		textAlign: 'center',
		h1: {
			color: theme.decisions.background.actionHigh.blueFrance.default,
			...fr.typography[12].style,
			marginBottom: fr.spacing('13v')
		},
		p: {
			...fr.typography[21].style,
			marginBottom: fr.spacing('13v')
		}
	}
}));
