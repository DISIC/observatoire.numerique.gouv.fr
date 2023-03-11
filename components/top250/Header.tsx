import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { fr } from '@codegouvfr/react-dsfr';
import { ReactNode } from 'react';
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar';
import { LightSelect } from '../generic/LightSelect';

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
			<LightSelect
				options={[
					{ label: 'Avril 2023', value: '04-2023' },
					{ label: 'Octobre 2022', value: '10-2022' },
					{ label: 'Juillet 2022', value: '07-2022' }
				]}
				defaultValue={'04-2023'}
			/>
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
		...fr.typography[11].style,
		color: theme.decisions.background.actionHigh.blueFrance.default,
		marginBottom: fr.spacing('3v')
	},
	search: {
		width: '50%',
		marginTop: fr.spacing('11v'),
		['input.fr-input']: {
			backgroundColor: theme.decisions.background.alt.blueFrance.default,
			['::placeholder, ::-ms-input-placeholder']: {
				color: theme.decisions.background.actionHigh.blueFrance.default
			}
		}
	}
}));
