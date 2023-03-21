import { TProcedure } from '@/pages/api/procedures/types';
import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import Link from 'next/link';

type Props = {
	procedure: TProcedure;
};

export function ProcedureMobileCard(props: Props) {
	const { classes, cx } = useStyles();

	return <div className={cx(classes.root)}></div>;
}

const useStyles = makeStyles()(theme => ({
	root: {
		border: `1px solid ${theme.decisions.border.default.blueFrance.default}`,
		borderRadius: fr.spacing('2v'),
		padding: fr.spacing('2v'),
		paddingLeft: fr.spacing('4v'),
		paddingRight: fr.spacing('4v'),
		backgroundColor: 'white'
	}
}));
