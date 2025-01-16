import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { fr } from '@codegouvfr/react-dsfr';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar';
import { useEditions } from '@/utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Select from '@codegouvfr/react-dsfr/Select';
import { LightSelect } from '../generic/LightSelect';
import Button from '@codegouvfr/react-dsfr/Button';

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
	const { id: edition_id, slug: old_edition_id } = router.query;

	const { data: editions } = useEditions();

	const { classes, cx } = useStyles();

	const departmentOptions = [
		{ label: 'Tous les ministères', value: 'all' },
		...departments.map(department => ({
			label: department,
			value: department
		}))
	];

	const [department, setDepartment] = useState<string>('');
	const [search, setSearch] = useState<string>('');

	return (
		<div className={cx(classes.root)}>
			<h1 className={cx(classes.title)}>{title}</h1>
			{!old && (
				<div className={cx(classes.editionsContainer)}>
					{editions?.map((e, index) => {
						const isCurrent =
							(edition_id && e.id === edition_id) ||
							(!edition_id && index === 0);
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
					<span
						className={cx(fr.cx('fr-px-1w', 'fr-py-0-5v'), classes.linkTag)}
					>
						<a
							className={fr.cx('fr-link')}
							href="/observatoire/old/2022-octobre"
							target="_blank"
						>
							Voir les éditions précédentes
						</a>
					</span>
				</div>
			)}
			{old && (
				<div className={cx(classes.editionsContainer)}>
					{oldEditions.map((edition, index) => {
						const isCurrent =
							(old_edition_id && edition.slug === old_edition_id) ||
							(!old_edition_id && index === 0);
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
										{edition.display}
									</a>
								) : (
									<Link
										href={`/observatoire/old/${edition.slug}`}
										className={fr.cx('fr-link')}
									>
										{edition.display}
									</Link>
								)}
							</span>
						);
					})}
					<span
						className={cx(fr.cx('fr-px-1w', 'fr-py-0-5v'), classes.linkTag)}
					>
						<a
							className={fr.cx('fr-link')}
							href="/observatoire"
							target="_blank"
						>
							Voir les nouvelles éditions
						</a>
					</span>
				</div>
			)}
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
				<SearchBar
					className={cx(classes.filterItem, classes.search)}
					label={searchLabel}
					nativeInputProps={{
						onChange: e => setSearch(e.target.value)
					}}
				/>
				<Button
					iconId="fr-icon-checkbox-circle-line"
					type="submit"
					title="Filter apply button"
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
		['input.fr-input']: {
			backgroundColor: theme.decisions.background.alt.blueFrance.default,
			['::placeholder, ::-ms-input-placeholder']: {
				color: theme.decisions.background.actionHigh.blueFrance.default
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
	},
	filterWrapper: {
		display: 'flex',
		alignItems: 'end',
		gap: fr.spacing('6v'),
		marginTop: fr.spacing('8w')
	},
	filterItem: {
		flex: 1
	},
	filterSelect: {
		width: '50%',
		marginBottom: '0!important'
	}
}));
