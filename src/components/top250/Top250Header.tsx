import { fr } from '@codegouvfr/react-dsfr';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar';
import { useEditions } from '@/utils/api';
import { useRouter } from 'next/router';
import { LightSelect } from '../generic/LightSelect';
import Button from '@codegouvfr/react-dsfr/Button';
import assert from 'assert';
import { tss } from 'tss-react';

type Props = {
	title: ReactNode;
	searchLabel: string;
	onSearch: (value: string) => void;
	old?: boolean;
	departments: string[];
	setSelectedDepartment: Dispatch<SetStateAction<string>>;
};

const oldEditions = [
	{ slug: '2022-octobre', display: 'Octobre 2022' },
	{ slug: '2022-juillet', display: 'Juillet 2022' },
	{ slug: '2022-avril', display: 'Avril 2022' },
	{ slug: '2022-janvier', display: 'Janvier 2022' },
	{ slug: '2021-octobre', display: 'Octobre 2021' },
	{ slug: '2021-juillet', display: 'Juillet 2021' },
	{ slug: '2021-avril', display: 'Avril 2021' },
	{ slug: '2021-janvier', display: 'Janvier 2021' },
	{ slug: '2020-octobre', display: 'Octobre 2020' },
	{ slug: '2020-juillet', display: 'Juillet 2020' },
	{ slug: '2020-avril', display: 'Avril 2020' },
	{ slug: '2020-janvier', display: 'Janvier 2020' },
	{ slug: '2019-octobre', display: 'Octobre 2019' },
	{ slug: '2019-juin', display: 'Juin 2019' }
];

export function Top250Header(props: Props) {
	const {
		title,
		searchLabel,
		onSearch,
		old,
		departments,
		setSelectedDepartment
	} = props;
	const router = useRouter();
	const { id: edition_id, slug: old_edition_id } = router.query as {
		id: string | undefined;
		slug: string;
	};

	const { classes, cx } = useStyles();

	const { data: editions } = useEditions();

	const [inputElement, setInputElement] = useState<HTMLInputElement | null>(
		null
	);

	const editionOptions =
		editions?.map((edition, index) => ({
			label: edition.name,
			value: index !== 0 ? edition.id : 'current',
			group: edition.name.split(' ')[1]
		})) || [];

	const oldEditionsOptions =
		oldEditions.map(edition => ({
			label: edition.display,
			value: edition.slug,
			group: edition.display.split(' ')[1]
		})) || [];

	const departmentOptions = [
		{ label: 'Tous les ministères', value: 'all' },
		...departments?.map(department => ({
			label: department,
			value: department
		}))
	];
	const [department, setDepartment] = useState<string>('');
	const [editionId, setEditionId] = useState<string>();
	const [search, setSearch] = useState<string>('');

	return (
		<div className={cx(classes.root)}>
			<h1 className={cx(classes.title)}>{title}</h1>
			{!old && (
				<form
					className={cx(classes.editionsWrapper)}
					onSubmit={e => {
						e.preventDefault();
						router.push(
							`/observatoire${editionId !== 'current' ? `/${editionId}` : ''}`
						);
					}}
				>
					<LightSelect
						label="Edition"
						id="select-edition"
						options={editionOptions}
						triggerValue={edition_id || 'current'}
						size="small"
						optgroup
						onChange={value => setEditionId(value as string)}
						className={cx(fr.cx('fr-mb-0'))}
					/>
					<Button
						iconId="fr-icon-checkbox-circle-line"
						type="submit"
						title="Filter apply button"
					>
						Charger l'édition
					</Button>
					<span
						className={cx(
							fr.cx('fr-px-1w', 'fr-py-0-5v', 'fr-mb-1v'),
							classes.linkTag
						)}
					>
						<a
							className={fr.cx('fr-link')}
							href="/observatoire/old/2022-octobre"
							target="_blank"
						>
							Voir les éditions précédentes
						</a>
					</span>
				</form>
			)}
			{old && (
				<form
					className={cx(classes.editionsWrapper)}
					onSubmit={e => {
						e.preventDefault();
						router.push(`/observatoire/old/${editionId}`);
					}}
				>
					<LightSelect
						label="Edition"
						id="select-edition"
						options={oldEditionsOptions}
						triggerValue={old_edition_id}
						size="small"
						optgroup
						onChange={value => setEditionId(value as string)}
						className={cx(fr.cx('fr-mb-0'))}
					/>
					<Button
						iconId="fr-icon-checkbox-circle-line"
						type="submit"
						title="Filter apply button"
					>
						Charger l'édition
					</Button>
					<span
						className={cx(
							fr.cx('fr-px-1w', 'fr-py-0-5v', 'fr-mb-1v'),
							classes.linkTag
						)}
					>
						<a
							className={fr.cx('fr-link')}
							href="/observatoire"
							target="_blank"
						>
							Voir les nouvelles éditions
						</a>
					</span>
				</form>
			)}
			<hr className={cx(classes.filterHr)} />
			<form
				className={cx(classes.filterWrapper)}
				onSubmit={e => {
					e.preventDefault();
					onSearch(search);
					setSelectedDepartment(department);
				}}
			>
				<LightSelect
					label="Ministère"
					id="select-ministere"
					options={departmentOptions}
					size="small"
					onChange={value => setDepartment(value as string)}
					className={cx(classes.filterItem, classes.filterSelect)}
				/>
				<div className={cx(classes.filterItem, classes.search)}>
					<label className={cx('fr-label', fr.cx('fr-mb-2v'))} htmlFor="search">
						Mots clés
					</label>
					<SearchBar
						className={cx(classes.filterItem)}
						label={searchLabel}
						renderInput={({ className, id, placeholder, type }) => (
							<input
								ref={setInputElement}
								className={className}
								id={id}
								placeholder={placeholder}
								type={type}
								value={search}
								onChange={event => setSearch(event.currentTarget.value)}
								onKeyDown={event => {
									if (event.key === 'Escape' && inputElement !== null) {
										assert(inputElement !== null);
										inputElement.blur();
									}
								}}
							/>
						)}
					/>
				</div>
				<Button
					iconId="fr-icon-checkbox-circle-line"
					type="submit"
					title="Filter apply button"
				>
					Appliquer les filtres
				</Button>
			</form>
		</div>
	);
}

const useStyles = tss.withName(Top250Header.name).create(theme => ({
	root: {
		paddingTop: fr.spacing('20v'),
		paddingBottom: fr.spacing('18v'),
		[fr.breakpoints.down('lg')]: {
			paddingTop: fr.spacing('12v')
		}
	},
	title: {
		...fr.typography[11].style,
		color: fr.colors.decisions.background.actionHigh.blueFrance.default,
		marginBottom: fr.spacing('3w'),
		[fr.breakpoints.down('lg')]: {
			fontSize: `${fr.typography[4].style.fontSize} !important`,
			lineHeight: `${fr.typography[4].style.lineHeight} !important`
		}
	},
	search: {
		width: '50%',
		['input.fr-input']: {
			backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
			['::placeholder, ::-ms-input-placeholder']: {
				color: fr.colors.decisions.background.actionHigh.blueFrance.default
			}
		},
		[fr.breakpoints.down('lg')]: {
			width: '100%'
		},
		['button.fr-btn']: {
			display: 'none'
		}
	},
	editionsContainer: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	editionsWrapper: {
		display: 'flex',
		alignItems: 'end',
		gap: fr.spacing('4v'),
		flexWrap: 'wrap'
	},
	linkTag: {
		textAlign: 'center',
		fontWeight: 'bold',
		borderRadius: fr.spacing('1v'),
		marginRight: fr.spacing('4v'),
		marginBottom: fr.spacing('4v'),
		textTransform: 'uppercase',
		backgroundColor: fr.colors.decisions.background.contrast.info.default,
		['.fr-link']: {
			color: fr.colors.decisions.background.flat.info.default,
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
	},
	filterHr: {
		marginTop: fr.spacing('6w'),
		marginBottom: fr.spacing('6w'),
		paddingBottom: 1
	},
	filterWrapper: {
		display: 'flex',
		alignItems: 'end',
		justifyContent: 'center',
		gap: fr.spacing('6v'),
		flexWrap: 'wrap',
		[fr.breakpoints.down('md')]: {
			border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
			borderRadius: fr.spacing('1v'),
			padding: fr.spacing('2w')
		}
	},
	filterItem: {
		[fr.breakpoints.up('md')]: {
			flex: 1
		}
	},
	filterSelect: {
		['select.fr-select']: {
			width: '100%'
		},
		[fr.breakpoints.up('md')]: {
			width: '50%'
		},
		marginBottom: '0!important'
	}
}));
