import { fr } from '@codegouvfr/react-dsfr';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar';
import { useRouter } from 'next/router';
import { LightSelect } from '../generic/LightSelect';
import Button from '@codegouvfr/react-dsfr/Button';
import assert from 'assert';
import { tss } from 'tss-react';

type Props = {
	title: string;
	subtitle: string;
	searchLabel: string;
	onSearch: (value: string) => void;
	departments: string[];
	setSelectedDepartment: Dispatch<SetStateAction<string>>;
	nbResults: number | null;
};

export function Top250Header(props: Props) {
	const {
		title,
		subtitle,
		searchLabel,
		onSearch,
		departments,
		setSelectedDepartment,
		nbResults
	} = props;
	const router = useRouter();
	const { id: edition_id } = router.query as {
		id: string | undefined;
		slug: string;
	};

	const { classes, cx } = useStyles({
		isMainEdition: !edition_id
	});

	const [inputElement, setInputElement] = useState<HTMLInputElement | null>(
		null
	);

	const departmentOptions = [
		{ label: 'Tous les ministères', value: 'all' },
		...departments?.map(department => ({
			label: department,
			value: department
		}))
	];
	const [department, setDepartment] = useState<string>('');
	const [search, setSearch] = useState<string>('');

	return (
		<div className={cx(classes.root)}>
			<h1 className={cx(classes.title)}>{title}</h1>
			<h4 className={cx(classes.subtitle)}>{subtitle}</h4>
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
				<p role="status" className={fr.cx('fr-sr-only')}>
					{nbResults !== null && (
						<>
							{nbResults
								? `${nbResults} résultats`
								: 'Aucune démarche trouvée pour cette recherche...'}
						</>
					)}
				</p>
			</form>
		</div>
	);
}

const useStyles = tss
	.withName(Top250Header.name)
	.withParams<{ isMainEdition: boolean }>()
	.create(({ isMainEdition }) => ({
		root: {
			paddingTop: isMainEdition ? fr.spacing('10v') : fr.spacing('1w'),
			paddingBottom: fr.spacing('18v')
			// [fr.breakpoints.down('lg')]: {
			// 	paddingTop: fr.spacing('12v')
			// }
		},
		title: {
			...fr.typography[10].style,
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			marginBottom: fr.spacing('1w'),
			[fr.breakpoints.down('lg')]: {
				fontSize: `${fr.typography[4].style.fontSize} !important`,
				lineHeight: `${fr.typography[4].style.lineHeight} !important`
			}
		},
		subtitle: {
			color: fr.colors.decisions.artwork.minor.blueFrance.default,
			marginBottom: fr.spacing('4w')
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
