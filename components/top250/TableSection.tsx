import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { TProcedure } from '@/pages/api/procedures/types';
import { PreHeader } from '../table/PreHeader';
import { ProceduresTable } from '../table/ProceduresTable';

type Props = {
	procedures: TProcedure[];
};

export function Top250TableSection(props: Props) {
	const { procedures } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<PreHeader />
			<ProceduresTable procedures={procedures} />
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		paddingBottom: fr.spacing('12v'),
		width: '100%'
	}
}));
