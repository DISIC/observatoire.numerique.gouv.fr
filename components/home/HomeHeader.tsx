import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useRouter } from 'next/router';

type Props = {
	title: JSX.Element;
	description: JSX.Element;
	buttonText: string;
};

export function HomeHeader(props: Props) {
	const { title, description, buttonText } = props;
	const { classes, cx } = useStyles();
	const router = useRouter();

	return (
		<div className={classes.root}>
			<div className={cx(fr.cx('fr-container'), classes.container)}>
				<h1>{title}</h1>
				<p>{description}</p>
				<Button
					type="button"
					onClick={() => {
						router.push('/observatoire');
					}}
				>
					{buttonText}
				</Button>
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
