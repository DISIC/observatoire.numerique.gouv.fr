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
					{
						label: 'Octobre 2022',
						value: '10-2022',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2022-octobre/'
					},
					{
						label: 'Juillet 2022',
						value: '07-2022',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2022-juillet/'
					},
					{
						label: 'Avril 2022',
						value: '04-2022',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2022-avril/'
					},
					{
						label: 'Janvier 2022',
						value: '01-2022',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2022-janvier/'
					},
					{
						label: 'Octobre 2021',
						value: '10-2021',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2021-octobre/'
					},
					{
						label: 'Juillet 2021',
						value: '07-2021',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2021-juillet/'
					},
					{
						label: 'Avril 2021',
						value: '04-2021',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2021-avril/'
					},
					{
						label: 'Janvier 2021',
						value: '01-2021',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2021-janvier/'
					},
					{
						label: 'Octobre 2020',
						value: '10-2020',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2020-octobre/'
					},
					{
						label: 'Juillet 2020',
						value: '07-2020',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2020-juillet/'
					},
					{
						label: 'Avril 2020',
						value: '04-2020',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2020-avril/'
					},
					{
						label: 'Janvier 2020',
						value: '01-2020',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2020-janvier/'
					},
					{
						label: 'Octobre 2019',
						value: '10-2019',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2019-octobre/'
					},
					{
						label: 'Juin 2019',
						value: '06-2019',
						href: 'https://observatoire.numerique.gouv.fr/observatoire/2019-juin/'
					}
				]}
				defaultValue={'04-2023'}
				onChange={(value, href) => {
					if (href) location.href = href;
				}}
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
