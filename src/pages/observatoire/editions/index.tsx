import { useEditions } from '@/utils/api';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import { Edition } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import { tss } from 'tss-react';
import { formatDateRangeFR, slugifyText } from '@/utils/tools';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/router';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';

type EditionTab = {
	kind: 'base' | 'old';
	id: string;
	name: string;
	period: string;
};

const oldEditions = [
	{
		slug: '2022-octobre',
		display: 'Octobre 2022',
		period: 'De juillet à septembre'
	},
	{ slug: '2022-juillet', display: 'Juillet 2022', period: 'De avril à juin' },
	{ slug: '2022-avril', display: 'Avril 2022', period: 'De janvier à mars' },
	{
		slug: '2022-janvier',
		display: 'Janvier 2022',
		period: 'De octobre à décembre'
	},
	{
		slug: '2021-octobre',
		display: 'Octobre 2021',
		period: 'De juillet à septembre'
	},
	{ slug: '2021-juillet', display: 'Juillet 2021', period: 'De avril à juin' },
	{ slug: '2021-avril', display: 'Avril 2021', period: 'De janvier à mars' },
	{
		slug: '2021-janvier',
		display: 'Janvier 2021',
		period: 'De octobre à décembre'
	},
	{
		slug: '2020-octobre',
		display: 'Octobre 2020',
		period: 'De juillet à septembre'
	},
	{ slug: '2020-juillet', display: 'Juillet 2020', period: 'De avril à juin' },
	{ slug: '2020-avril', display: 'Avril 2020', period: 'De janvier à mars' },
	{
		slug: '2020-janvier',
		display: 'Janvier 2020',
		period: 'De octobre à décembre'
	},
	{
		slug: '2019-octobre',
		display: 'Octobre 2019',
		period: 'De juillet à septembre'
	},
	{ slug: '2019-juin', display: 'Juin 2019', period: 'De mars à mai' }
];

export default function ObservatoireEditions() {
	const { classes, cx } = useStyles();

	const router = useRouter();

	const [selectedTabId, setSelectedTabId] = useState<string>('tab0');

	let { data: editions } = useEditions();

	editions = editions?.slice(1) || [];

	const handleTabChange = (tabId: string) => {
		router.push(`?tab=${tabId}`, undefined, { shallow: true });
	};

	const editionTabs = useMemo(() => {
		const groupedByYear: Record<string, EditionTab[]> = {};

		editions.forEach(edition => {
			const editionYearFromName = edition.name.split(' ')[1];
			const year =
				editionYearFromName ||
				new Date(edition.end_date).getFullYear().toString();

			if (!groupedByYear[year]) groupedByYear[year] = [];

			groupedByYear[year].push({
				kind: 'base',
				id: slugifyText(edition.name),
				name: edition.name,
				period: formatDateRangeFR(
					new Date(
						new Date(edition.end_date).setMonth(
							new Date(edition.end_date).getMonth() - 2
						)
					),
					new Date(edition.end_date)
				)
			});
		});

		oldEditions.forEach(edition => {
			const year = edition.display.split(' ')[1];

			if (!groupedByYear[year]) groupedByYear[year] = [];

			groupedByYear[year].push({
				kind: 'old',
				id: edition.slug,
				name: edition.display,
				period: edition.period
			});
		});

		return Object.entries(groupedByYear)
			.sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
			.map(([year, editions], index) => ({
				label: year,
				tabId: `tab${index}`,
				editions: editions as EditionTab[]
			}));
	}, [editions]);

	const tableHeader = ['Éditions', 'Périodes', 'Tableau de suivi'];

	const currentTableData = useMemo(() => {
		const currentEdition = editionTabs.find(
			edition => edition.tabId == selectedTabId
		);
		if (!currentEdition) return [];
		return currentEdition.editions.map(edition => ({
			name: edition.name,
			period: edition.period,
			link: `/observatoire/${edition.kind === 'base' ? 'editions' : 'old'}/${
				edition.id
			}`
		})) as { name: string; period: string; link: string }[];
	}, [selectedTabId, editionTabs]);

	useEffect(() => {
		const { tab } = router.query;
		if (tab && editions.length > 0) {
			setSelectedTabId(tab as string);
		}
	}, [router.isReady, router.query, editions]);

	return (
		<>
			<div className={cx(fr.cx('fr-container'), 'fr-mt-10v')}>
				<Breadcrumb
					segments={[]}
					homeLinkProps={{ href: '/' }}
					currentPageLabel="Éditions précédentes"
					className={cx('fr-mb-1v')}
				/>
				<h1 className={cx(classes.title)}>Éditions précédentes</h1>
			</div>
			<div className={cx(classes.tableContainer)}>
				<div className="fr-container fr-py-6v">
					<Tabs
						tabs={editionTabs}
						selectedTabId={selectedTabId}
						onTabChange={(e: string) => handleTabChange(e)}
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
											<td className={classes.editionName}>
												{row.name.toLowerCase()}
											</td>
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
	editionName: {
		textTransform: 'capitalize'
	},
	tableContainer: {
		backgroundColor: fr.colors.decisions.background.contrast.info.default
	},
	table: {
		margin: 0,
		marginTop: fr.spacing('3v'),
		['table']: {
			display: 'inline-table',
			overflow: 'hidden',
			borderRadius: '8px'
		},
		['table thead']: {
			backgroundColor: 'white',
			backgroundImage: `linear-gradient(0deg, ${fr.colors.decisions.artwork.major.blueFrance.default}, ${fr.colors.decisions.artwork.major.blueFrance.default})`
		},
		['table > ::after']: {
			display: 'none!important'
		}
	},
	tabs: {
		boxShadow: 'none',
		height: 'auto',
		['.fr-tabs__panel']: {
			padding: 0
		}
	}
}));
