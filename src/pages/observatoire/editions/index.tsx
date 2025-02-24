import { useEditions } from '@/utils/api';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import { Edition } from '@prisma/client';
import { useMemo, useState } from 'react';
import { tss } from 'tss-react';
import { formatDateRangeFR } from '@/utils/tools';
import Button from '@codegouvfr/react-dsfr/Button';

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

export default function ObservatoireEditions() {
	const { classes, cx } = useStyles();

	const [selectedTabId, setSelectedTabId] = useState<string>('2024');

	let { data: editions } = useEditions();

	editions = editions?.slice(1) || [];

	const editionTabs = editions.reduce((acc, edition) => {
		const editionYearFromName = edition.name.split(' ')[1];
		const year = editionYearFromName
			? editionYearFromName
			: new Date(edition.end_date).getFullYear().toString();

		return acc.some(item => item.label === year)
			? acc.map(item =>
					item.label === year
						? {
								...item,
								editions: [...item.editions, edition]
						  }
						: item
			  )
			: [...acc, { label: year, tabId: year, editions: [edition] }];
	}, [] as { label: string; tabId: string; editions: Edition[] }[]);

	const tableHeader = ['Nom', 'Début', 'Tableau de suivi'];

	const currentTableData = useMemo(() => {
		const currentEdition = editionTabs.find(
			edition => edition.tabId === selectedTabId
		);
		if (!currentEdition) return [];
		return currentEdition.editions.map(edition => ({
			name: edition.name,
			period: formatDateRangeFR(
				new Date(edition.start_date),
				new Date(edition.end_date)
			),
			link: `/observatoire/editions/${edition.id}`
		})) as { name: string; period: string; link: string }[];
	}, [selectedTabId, editionTabs]);

	return (
		<>
			<div className={cx(fr.cx('fr-container'), 'fr-mt-10v')}>
				<h1 className={cx(classes.title)}>Éditions précédentes</h1>
			</div>
			<div className={cx(classes.tableContainer)}>
				<div className="fr-container fr-py-6v">
					<Tabs
						selectedTabId={selectedTabId}
						tabs={editionTabs}
						onTabChange={setSelectedTabId}
						className={cx(classes.tabs)}
					>
						<div className={cx(fr.cx('fr-table'), classes.table)}>
							<table data-fr-js-table-element="true">
								<thead>
									<tr>
										{tableHeader.map((header, i) => (
											<th key={i} scope="col">
												{header}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{currentTableData.map((row, i) => (
										<tr key={i} data-fr-js-table-row="true">
											<td>{row.name}</td>
											<td>{row.period}</td>
											<td>
												<Button
													linkProps={{ href: row.link }}
													priority="secondary"
													size="small"
												>
													Voir le tableau de suivi
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Tabs>
				</div>
			</div>
		</>
	);
}

const useStyles = tss.withName(ObservatoireEditions.name).create(() => ({
	title: {
		...fr.typography[10].style,
		color: fr.colors.decisions.background.actionHigh.blueFrance.default,
		marginBottom: fr.spacing('3w'),
		[fr.breakpoints.down('lg')]: {
			fontSize: `${fr.typography[4].style.fontSize} !important`,
			lineHeight: `${fr.typography[4].style.lineHeight} !important`
		}
	},
	tableContainer: {
		backgroundColor: fr.colors.decisions.background.contrast.info.default
	},
	table: {
		['table thead']: {
			backgroundImage: `linear-gradient(0deg, ${fr.colors.decisions.artwork.major.blueFrance.default}, ${fr.colors.decisions.artwork.major.blueFrance.default})`
		}
	},
	tabs: {}
}));
