import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {};

export function HelpCriterias(props: Props) {
	const { classes, cx } = useStyles();

	return <div className={classes.root}>Critères d&apos;entrée</div>;
}

const useStyles = makeStyles()(theme => ({
	root: {}
}));
