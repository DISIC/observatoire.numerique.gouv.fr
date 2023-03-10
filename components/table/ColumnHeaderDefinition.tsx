import { type FrIconClassName, type RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { ReactNode } from 'react';
import { makeStyles } from "@codegouvfr/react-dsfr/tss";

type Props = {
	icon: FrIconClassName | RiIconClassName;
	text: ReactNode;
};

export function ColumnHeaderDefinition(props: Props) {
	const { icon, text } = props;
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<i className={fr.cx(icon)} />
			<span role="text" className={cx(classes.text)}>
				{text}
			</span>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: fr.spacing('4v'),
		color: theme.decisions.text.actionHigh.blueFrance.default,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	text: {
		marginTop: fr.spacing('3v')
	}
}));
