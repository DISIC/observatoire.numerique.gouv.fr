import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { fr } from '@codegouvfr/react-dsfr';
import { ReactNode, useEffect, useRef, useState } from 'react';
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
	const searchInputRef = useRef<HTMLInputElement>(null);

	const { data: editions } = useEditions();

	const currentEditionName = editions && editions[0] ? editions[0].name : '...';

	const { classes, cx } = useStyles();

	const [search, setSearch] = useState<string>('');

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === 'f') {
				event.preventDefault();
				if (searchInputRef.current) {
					searchInputRef.current.focus();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<div className={cx(classes.root)}>
			<h1 className={cx(classes.title)}>{title}</h1>
			<p className={fr.cx('fr-text--xl')}>Edition : {currentEditionName}</p>
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
						},
						ref: searchInputRef
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
