import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { fr } from '@codegouvfr/react-dsfr';
import { ReactNode } from 'react';
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar';

type Props = {
	title: ReactNode;
	searchLabel: string;
};

export function Top250Header(props: Props) {
	const { title, searchLabel } = props;

	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.root)}>
			<h1 className={cx(classes.title)}>{title}</h1>
			<SearchBar className={cx(classes.search)} label={searchLabel} />
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		paddingTop: fr.spacing('20v'),
		paddingBottom: fr.spacing('18v')
	},
	title: {
		fontSize: '3rem',
		lineHeight: '3.625rem',
		color: theme.decisions.background.actionHigh.blueFrance.default
	},
	search: {
		width: '50%',
		marginTop: fr.spacing('11v'),
		['input']: {
			backgroundColor: theme.decisions.background.alt.blueFrance.default
		}
	}
}));
