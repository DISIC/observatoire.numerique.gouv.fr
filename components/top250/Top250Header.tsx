import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { fr } from '@codegouvfr/react-dsfr';
import { ReactNode, useState } from 'react';
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar';
import { useEditions } from '@/utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Props = {
	title: ReactNode;
	searchLabel: string;
	onSearch: (value: string) => void;
};

export function Top250Header(props: Props) {
	const { title, searchLabel, onSearch } = props;
	const router = useRouter();
	const { id: edition_id } = router.query;

	const { data: editions } = useEditions();

	const { classes, cx } = useStyles();

	const [search, setSearch] = useState<string>('');

	return (
		<div className={cx(classes.root)}>
			<h1 className={cx(classes.title)}>{title}</h1>
			<div className={cx(classes.editionsContainer)}>
				{editions?.map((e, index) => {
					const isCurrent =
						(edition_id && e.id === edition_id) || (!edition_id && index === 0);
					return (
						<span
							key={index}
							className={cx(fr.cx('fr-px-1w', 'fr-py-0-5v'), classes.linkTag)}
						>
							{isCurrent ? (
								<a
									className={cx(fr.cx('fr-link'), classes.currentLink)}
									href={'#'}
								>
									{e.name}
								</a>
							) : (
								<Link
									href={`/observatoire/${e.id}`}
									className={fr.cx('fr-link')}
								>
									{e.name}
								</Link>
							)}
						</span>
					);
				})}
				<span className={cx(fr.cx('fr-px-1w', 'fr-py-0-5v'), classes.linkTag)}>
					<a
						className={fr.cx('fr-link')}
						href="/observatoire/2022-octobre"
						target="_blank"
					>
						Voir les éditions précédentes
					</a>
				</span>
			</div>
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
		marginBottom: fr.spacing('3w'),
		[fr.breakpoints.down('lg')]: {
			fontSize: `${fr.typography[4].style.fontSize} !important`,
			lineHeight: `${fr.typography[4].style.lineHeight} !important`
		}
	},
	search: {
		width: '50%',
		marginTop: fr.spacing('8w'),
		['input.fr-input']: {
			backgroundColor: theme.decisions.background.alt.blueFrance.default,
			['::placeholder, ::-ms-input-placeholder']: {
				color: theme.decisions.background.actionHigh.blueFrance.default
			}
		},
		[fr.breakpoints.down('lg')]: {
			width: '100%'
		}
	},
	editionsContainer: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	linkTag: {
		textAlign: 'center',
		fontWeight: 'bold',
		borderRadius: fr.spacing('1v'),
		marginRight: fr.spacing('4v'),
		marginBottom: fr.spacing('4v'),
		textTransform: 'uppercase',
		backgroundColor: theme.decisions.background.contrast.info.default,
		['.fr-link']: {
			color: theme.decisions.background.flat.info.default,
			fontSize: fr.typography[18].style.fontSize,
			backgroundImage: 'none',
			['&:hover']: {
				backgroundImage: 'var(--underline-img), var(--underline-img)',
				'--underline-hover-width': 0
			}
		},
		[fr.breakpoints.down('lg')]: {
			fontSize: fr.typography[17].style.fontSize,
			position: 'relative',
			top: fr.spacing('1v'),
			zIndex: 1
		}
	},
	currentLink: {
		textDecoration: 'underline'
	}
}));
