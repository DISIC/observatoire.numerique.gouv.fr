import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ProcedureMobileCard } from './ProcedureMobileCard';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { ProcedureHeader } from '@prisma/client';
import { useProcedureHeaders } from '@/utils/api';

type Props = {
	procedures: ProcedureWithFields[];
};

export function ProceduresTableMobile(props: Props) {
	const { procedures } = props;
	const { classes, cx } = useStyles();

	const {
		data: proceduresTableHeaders,
		isError,
		isLoading
	} = useProcedureHeaders();
	if (isError) return <div>Une erreur est survenue.</div>;
	if (isLoading) return <div>...</div>;
	if (!proceduresTableHeaders) return <div>Aucune colonne de démarche</div>;

	return (
		<div className={cx(classes.root)}>
			{procedures.map(procedure => {
				return (
					<ProcedureMobileCard
						proceduresTableHeaders={proceduresTableHeaders}
						key={procedure.title}
						procedure={procedure}
					/>
				);
			})}
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		[fr.breakpoints.down('lg')]: {
			marginTop: `-${fr.spacing('10v')}`,
			marginBottom: fr.spacing('2v')
		}
	}
}));
