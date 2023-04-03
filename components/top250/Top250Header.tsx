import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { fr } from '@codegouvfr/react-dsfr';
import { ReactNode, useState } from 'react';
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar';
import { LightSelect } from '../generic/LightSelect';
import { useEditions } from '@/utils/api';
type Props = {
	title: ReactNode;
	searchLabel: string;
	onSearch: (value: string) => void;
};

export function Top250Header(props: Props) {
	const { title, searchLabel, onSearch } = props;

	const { data: editions } = useEditions();

	const editionOptions = [
		{
			label: editions && editions[0] ? editions[0].name : '...',
			value: '04-2023'
		},
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
	];

	const { classes, cx } = useStyles();

	const [search, setSearch] = useState<string>('');

	return (
		<div className={cx(classes.root)}>
			<h1 className={cx(classes.title)}>{title}</h1>
			<LightSelect
				options={editionOptions}
				defaultValue={'04-2023'}
				onChange={(value, href) => {
					if (href) location.href = href;
				}}
			/>
			<form
				onSubmit={e => {
					e.preventDefault();
					onSearch(search);
				}}
			>
				<SearchBar
					className={cx(classes.search)}
					label={searchLabel}
					nativeInputProps={{
						onChange: e => {
							setSearch(e.target.value);
							if (!e.target.value) onSearch('');
						}
					}}
				/>
			</form>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		paddingTop: fr.spacing('20v'),
		paddingBottom: fr.spacing('18v'),
		[fr.breakpoints.down('lg')]: {
			paddingTop: fr.spacing('12v')
		}
	},
	title: {
		...fr.typography[11].style,
		color: theme.decisions.background.actionHigh.blueFrance.default,
		marginBottom: fr.spacing('3v'),
		[fr.breakpoints.down('lg')]: {
			fontSize: `${fr.typography[4].style.fontSize} !important`,
			lineHeight: `${fr.typography[4].style.lineHeight} !important`
		}
	},
	search: {
		width: '50%',
		marginTop: fr.spacing('11v'),
		['input.fr-input']: {
			backgroundColor: theme.decisions.background.alt.blueFrance.default,
			['::placeholder, ::-ms-input-placeholder']: {
				color: theme.decisions.background.actionHigh.blueFrance.default
			}
		},
		[fr.breakpoints.down('lg')]: {
			width: '100%'
		}
	}
}));
