import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {
	loadingMessage?: string;
};

export const Loader = (props: Props) => {
	const { loadingMessage } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.loader)}>
			<div>
				<i className={fr.cx('ri-loader-4-line')} />
			</div>
			<p className={fr.cx('fr-pt-4v')}>{loadingMessage || 'Chargement...'}</p>
		</div>
	);
};

const useStyles = makeStyles()(theme => ({
	loader: {
		padding: fr.spacing('30v'),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		i: {
			display: 'inline-block',
			animation: 'spin 1s linear infinite;',
			color: theme.decisions.background.actionHigh.blueFrance.default,
			['&::before']: {
				'--icon-size': '2rem'
			}
		}
	}
}));
