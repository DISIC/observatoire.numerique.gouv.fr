import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { ReactNode } from 'react';

type Props = {
	children?: ReactNode;
};

export const EmptyScreenZone = (props: Props) => {
	const { children } = props;
	const { classes, cx } = useStyles();

	return <div className={cx(classes.container)}>{children}</div>;
};

const useStyles = makeStyles()(theme => ({
	container: {
		minHeight: '85vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
}));
