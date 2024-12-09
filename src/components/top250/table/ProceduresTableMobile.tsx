import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ProcedureMobileCard } from './ProcedureMobileCard';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { Edition, ProcedureHeader } from '@prisma/client';
import { useProcedureHeaders } from '@/utils/api';
import { trpc } from '@/utils/trpc';

type Props = {
	procedures: ProcedureWithFields[];
	edition?: Edition;
};

export function ProceduresTableMobile(props: Props) {
	const { procedures, edition } = props;
	const { classes, cx } = useStyles();

	const {
		data: procdeureHeadersRequest,
		error: procedureHeadersError,
		isLoading: isLoadingProcedureHeaders
	} = trpc.procedureHeaders.getList.useQuery({
		page: 1,
		perPage: 100
	});
	const procedureHeaders = procdeureHeadersRequest?.data || [];
	if (procedureHeadersError) return <div>Une erreur est survenue.</div>;
	if (isLoadingProcedureHeaders) return <div>...</div>;
	if (!procedureHeaders) return <div>Aucune colonne de démarche</div>;

	return (
		<div className={cx(classes.root)}>
			{procedures.map(procedure => {
				return (
					<ProcedureMobileCard
						proceduresTableHeaders={procedureHeaders}
						key={procedure.id}
						procedure={procedure}
						edition={edition}
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
