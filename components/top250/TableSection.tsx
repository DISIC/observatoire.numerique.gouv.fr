import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { PreHeader } from './table/PreHeader';
import { ProceduresTable } from './table/ProceduresTable';
import { PreFooter } from './table/PreFooter';
import { ProceduresTableMobile } from './table/ProceduresTableMobile';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { useMemo } from 'react';

type Props = {
	procedures?: ProcedureWithFields[];
	search?: string;
	isAdmin?: boolean;
};

export function Top250TableSection(props: Props) {
	const { procedures, isAdmin, search } = props;
	const { classes, cx } = useStyles();

	const table = useMemo(() => {
		if (!procedures || procedures.length === 0) {
			return (
				<div className={classes.noProcedure}>
					{search
						? 'Aucune démarche trouvée pour cette recherche...'
						: 'Aucune démarche pour cette édition...'}
				</div>
			);
		}

		return (
			<>
				{!isAdmin && <PreHeader />}
				{window.innerWidth > 62 * 16 ? (
					<ProceduresTable procedures={procedures} />
				) : (
					<ProceduresTableMobile procedures={procedures} />
				)}
				<PreFooter />
			</>
		);
	}, [procedures, isAdmin, search, classes.noProcedure]);

	return <div className={cx(classes.root)}>{table}</div>;
}

const useStyles = makeStyles()(theme => ({
	root: {
		paddingBottom: fr.spacing('12v'),
		width: '100%'
	},
	noProcedure: {
		padding: fr.spacing('30v'),
		textAlign: 'center',
		fontWeight: 'bold'
	}
}));
