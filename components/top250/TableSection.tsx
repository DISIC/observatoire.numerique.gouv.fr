import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { PreHeader } from './table/PreHeader';
import { ProceduresTable } from './table/ProceduresTable';
import { PreFooter } from './table/PreFooter';
import { ProceduresTableMobile } from './table/ProceduresTableMobile';
import { ProcedureWithFields } from '@/pages/api/procedures/types';

type Props = {
	procedures: ProcedureWithFields[];
	isAdmin?: boolean;
};

export function Top250TableSection(props: Props) {
	const { procedures, isAdmin } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			{!isAdmin && <PreHeader />}
			{window.innerWidth > 62 * 16 ? (
				<ProceduresTable procedures={procedures} />
			) : (
				<ProceduresTableMobile procedures={procedures} />
			)}
			<PreFooter />
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		paddingBottom: fr.spacing('12v'),
		width: '100%'
	}
}));
