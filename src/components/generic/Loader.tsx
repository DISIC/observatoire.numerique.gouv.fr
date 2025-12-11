import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';

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
			<p
				className={fr.cx('fr-pt-4v')}
				aria-live="polite"
				role="status"
				aria-atomic
			>
				{loadingMessage || 'Chargement...'}
			</p>
		</div>
	);
};

const useStyles = tss.withName(Loader.name).create(() => ({
	loader: {
		padding: fr.spacing('30v'),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		i: {
			display: 'inline-block',
			animation: 'spin 1s linear infinite;',
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			['&::before']: {
				'--icon-size': '2rem'
			}
		}
	}
}));
