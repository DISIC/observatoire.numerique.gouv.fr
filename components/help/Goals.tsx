import { makeStyles } from '@codegouvfr/react-dsfr/tss';

type Props = {};

export function HelpGoals(props: Props) {
	const { classes, cx } = useStyles();

	return <div className={classes.root}>Objectifs</div>;
}

const useStyles = makeStyles()(theme => ({
	root: {}
}));
