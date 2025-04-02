import { fr } from '@codegouvfr/react-dsfr';
import { ReactNode } from 'react';
import { tss } from 'tss-react';

type Props = {
	title: string | ReactNode;
};

export function PageTitleHeader(props: Props) {
	const { title } = props;
	const { classes, cx } = useStyles();
	return (
		<div className={classes.root}>
			<div className={fr.cx('fr-container')}>
				<h1>{title}</h1>
			</div>
		</div>
	);
}

const useStyles = tss.withName(PageTitleHeader.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		padding: `${fr.spacing('18v')} 0`,
		textAlign: 'center',
		h1: {
			...fr.typography[11].style,
			marginBottom: 0,
			color: fr.colors.decisions.background.actionHigh.blueFrance.default
		}
	}
}));
