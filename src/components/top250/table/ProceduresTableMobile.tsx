import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import { Edition } from '@prisma/client';
import { ProcedureMobileCard } from './ProcedureMobileCard';
import { tss } from 'tss-react';

type Props = {
	procedures: ProcedureWithFields[];
	edition?: Edition;
};

export function ProceduresTableMobile(props: Props) {
	const { procedures, edition } = props;
	const { classes, cx } = useStyles();

	const {
		data: procdeureHeadersRequest,
		error: indicatorsError,
		isLoading: isLoadingIndicators
	} = trpc.indicators.getList.useQuery({
		page: 1,
		perPage: 100
	});
	const indicators = procdeureHeadersRequest?.data || [];
	if (indicatorsError) return <div>Une erreur est survenue.</div>;
	if (isLoadingIndicators) return <div>...</div>;
	if (!indicators) return <div>Aucune colonne de démarche</div>;

	return (
		<ul className={cx(classes.root)}>
			{procedures.map(procedure => {
				return (
					<li key={procedure.id}>
						<ProcedureMobileCard
							key={procedure.id}
							indicators={indicators}
							procedure={procedure}
							edition={edition}
						/>
					</li>
				);
			})}
		</ul>
	);
}

const useStyles = tss.withName(ProceduresTableMobile.name).create(() => ({
	root: {
		[fr.breakpoints.down('lg')]: {
			marginTop: `-${fr.spacing('10v')}`,
			marginBottom: fr.spacing('2v')
		},
		listStyleType: 'none',
		paddingLeft: 0
	}
}));
