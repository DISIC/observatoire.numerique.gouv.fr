import Button from '@codegouvfr/react-dsfr/Button';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useEdition, useEditions, useProcedures } from '@/utils/api';
import { useRouter } from 'next/router';
import { Top250TableSection } from '@/components/top250/TableSection';
import Link from 'next/link';

type Props = {
	error?: string;
};

export default function Editions(props: Props) {
	const router = useRouter();
	const { id } = router.query;
	const { classes, cx } = useStyles();

	const {
		data: edition,
		isError: isErrorEdition,
		isLoading: isLoadingEdition
	} = useEdition(id as string);
	const {
		data: procedures,
		isError: isErrorProcedures,
		isLoading: isLoadingProcedures
	} = useProcedures(id as string);
	if (isErrorEdition || isErrorProcedures)
		return <div>Une erreur est survenue.</div>;
	if (isLoadingEdition || isLoadingProcedures)
		return (
			<div className={cx(classes.loader)}>
				<div>
					<i className={fr.cx('ri-loader-4-line')} />
				</div>

				<p className={fr.cx('fr-pt-4v')}>
					Chargement de l&eapos;édition en cours
				</p>
			</div>
		);

	if (!edition) return <div>Cette édition n&eapos;existe pas.</div>;
	if (!procedures) return <div>Aucune démarche pour cette édition</div>;

	const deleteEdition = () => {
		console.log('Delete edition');
	};

	return (
		<div className={classes.root}>
			<div className={fr.cx('fr-container', 'fr-pt-10v')}>
				<Link className={fr.cx('fr-link')} href="/administration/bo/editions">
					<i className={fr.cx('ri-arrow-left-line', 'fr-mr-0-5v')} />
					Retour
				</Link>
				<h3 className={fr.cx('fr-mt-6v', 'fr-mb-0')}>
					Édition : {edition.name}
				</h3>
			</div>
			<div
				className={cx(fr.cx('fr-container', 'fr-mt-4v'), classes.controlPanel)}
			>
				<Button
					iconId="ri-delete-bin-2-line"
					type="button"
					className={fr.cx('fr-mb-6v')}
					onClick={deleteEdition}
				>
					Supprimer l&eapos;édition
				</Button>
			</div>
			<div className={cx(classes.tableContainer)}>
				<div className={fr.cx('fr-container', 'fr-px-5v')}>
					<Top250TableSection procedures={procedures} isAdmin />
				</div>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {},
	tableContainer: {
		paddingTop: fr.spacing('6v'),
		backgroundColor: theme.decisions.background.contrast.info.default,
		['.fr-container']: {
			maxWidth: 1440
		}
	},
	controlPanel: {
		display: 'flex',
		justifyContent: 'end',
		button: {
			backgroundColor:
				theme.decisions.background.actionHigh.redMarianne.default,
			['&:hover']: {
				backgroundColor:
					theme.decisions.background.actionHigh.redMarianne.hover +
					' !important'
			}
		}
	},
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
