import { TProcedure } from '@/pages/api/procedures/types';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ProcedureMobileCard } from './ProcedureMobileCard';

type Props = {
	procedures: TProcedure[];
};

export function ProceduresTableMobile(props: Props) {
	const { procedures } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			{procedures.map(procedure => {
				return <ProcedureMobileCard procedure={procedure} />;
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
