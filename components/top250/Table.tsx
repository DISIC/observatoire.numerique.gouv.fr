import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { TProcedure } from '@/pages/api/procedures/types';

type Props = {
	procedures: TProcedure[];
};

export function Top250Table(props: Props) {
	const { procedures } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			{procedures
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.concat(procedures)
				.map(p => (
					<div>{p.title}</div>
				))}
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {}
}));
