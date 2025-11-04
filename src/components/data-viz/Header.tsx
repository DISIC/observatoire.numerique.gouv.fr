import Button from '@codegouvfr/react-dsfr/Button';
import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import { tss } from 'tss-react';
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox';
import { fr } from '@codegouvfr/react-dsfr';
import { DataVizKind } from '@/pages/data-viz/[kind]';
import { Dispatch, SetStateAction, useState } from 'react';
import assert from 'assert';
import { getProcedureKindLabel } from '@/utils/tools';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import { exportTableAsCSV } from '@/utils/tools';
import Link from 'next/link';

type DataVizTabHeaderProps = {
	kind: ProcedureKind;
	dataVisualitionKind: DataVizKind;
	setDataVisualitionKind: Dispatch<SetStateAction<DataVizKind>>;
	setShowGoalRadar: Dispatch<SetStateAction<boolean>>;
	setShowCrossScorePerimeter: Dispatch<SetStateAction<boolean>>;
	search?: string;
	setSearch: Dispatch<SetStateAction<string | undefined>>;
	kindLabel: string;
	tableId: string;
};

const DataVizTabHeader = ({
	kind,
	search,
	setSearch,
	dataVisualitionKind,
	setDataVisualitionKind,
	setShowGoalRadar,
	setShowCrossScorePerimeter,
	kindLabel,
	tableId
}: DataVizTabHeaderProps) => {
	const { classes, cx } = useStyles();

	const [inputElement, setInputElement] = useState<HTMLInputElement | null>(
		null
	);

	return (
		<div className={cx(classes.root)}>
			<div className={cx(classes.wrapperSearch)}>
				<SearchBar
					label="Rechercher"
					className={cx(classes.searchInput)}
					renderInput={({ className, id, type }) => (
						<input
							ref={setInputElement}
							className={className}
							id={id}
							placeholder={`Rechercher un${
								(kind === 'administration' ? 'e ' : ' ') +
								getProcedureKindLabel(kind)
							}`}
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
				<div className={classes.tabsActions}>
					<div className={cx(classes.buttonsGroup)}>
						<Button
							iconId="ri-pentagon-line"
							onClick={() => setDataVisualitionKind('radar')}
							priority={
								dataVisualitionKind === 'radar' ? 'primary' : 'secondary'
							}
						>
							Radars
						</Button>
						<Button
							iconId="ri-table-line"
							onClick={() => setDataVisualitionKind('table')}
							priority={
								dataVisualitionKind === 'table' ? 'primary' : 'secondary'
							}
						>
							Tableaux
						</Button>
					</div>
					{dataVisualitionKind === 'table' && (
						<Button
							iconId="ri-download-line"
							priority="secondary"
							className={fr.cx('fr-ml-10v')}
							onClick={() => exportTableAsCSV(`#${tableId}`, kindLabel)}
						>
							Exporter en CSV
						</Button>
					)}
				</div>
			</div>
			<div className={cx(classes.wrapperButtons)}>
				<p className={cx(fr.cx('fr-mb-0'), classes.headerDescription)}>
					Ces radars représentent le pourcentage des démarches par{' '}
					{getProcedureKindLabel(kind)} ayant atteint les{' '}
					<Link
						href="/Aide/Observatoire"
						target="_blank"
						rel="noreferrer"
						title="Objectifs - Vos démarches essentielles, nouvelle fenêtre"
					>
						objectifs
					</Link>{' '}
					des{' '}
					<Link
						href="/Aide/Observatoire?tab=2"
						target="_blank"
						rel="noreferrer"
						title="Indicateurs - Vos démarches essentielles, nouvelle fenêtre"
					>
						indicateurs
					</Link>{' '}
					.
				</p>
				{dataVisualitionKind === 'radar' && (
					<Checkbox
						options={[
							{
								label: "Moyenne de l'observatoire",
								nativeInputProps: {
									name: 'checkboxes-1',
									value: 'value2',
									onChange: e => setShowCrossScorePerimeter(e.target.checked)
								}
							}
						]}
						orientation="horizontal"
						state="default"
						className={cx(classes.checkboxWrapper, 'checkbox-yellow')}
						small
					/>
				)}
			</div>
		</div>
	);
};

const useStyles = tss.withName(DataVizTabHeader.name).create(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: fr.spacing('6v'),
		marginBottom: fr.spacing('6v')
	},
	wrapperSearch: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column',
			gap: fr.spacing('3w'),
			'& > div': {
				width: '100%',
				justifyContent: 'space-between'
			}
		}
	},
	wrapperButtons: {
		display: 'flex',
		alignItems: 'baseline',
		justifyContent: 'space-between',
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column',
			gap: fr.spacing('2w'),
			'& > div': {
				marginLeft: 0
			}
		}
	},
	searchInput: {
		width: '35%'
	},
	checkboxWrapper: {
		marginBottom: 0,
		'& > .fr-fieldset__content': {
			marginTop: 0,
			justifyContent: 'end'
		},
		alignItems: 'end',
		justifyContent: 'end',
		marginLeft: 'auto'
	},
	headerDescription: {
		fontSize: '0.875rem',
		color: fr.colors.decisions.text.mention.grey.default
	},
	tabsActions: {
		display: 'flex',
		alignItems: 'center',
		[fr.breakpoints.down('md')]: {
			flexDirection: 'column',
			gap: fr.spacing('2w'),
			alignItems: 'start',
			'& > button': {
				marginLeft: '0 !important'
			}
		}
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	}
}));

export default DataVizTabHeader;
