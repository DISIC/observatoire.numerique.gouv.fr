import { PageTitleHeader } from '@/components/layout/PageTitleHeader';
import { fr } from '@codegouvfr/react-dsfr';
import { Tabs } from '@codegouvfr/react-dsfr/Tabs';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AideObservatoire() {
	const { classes, cx } = useStyles();
	const router = useRouter();

	const [selectedTabId, setSelectedTabId] = useState('goals');

	const tabs = [
		{ tabId: 'goals', label: 'Objectifs et méthodologie' },
		{ tabId: 'criterias', label: "Critères d'entrée des services" },
		{ tabId: 'indicators', label: 'Indicateurs de qualité' }
	];

	const handleTabChange = (slug: string) => {
		setSelectedTabId(slug);
		router.push(`?tab=${slug}`, undefined, { shallow: true });
	};

	useEffect(() => {
		const { tab } = router.query;
		if (tab && tabs.some(tabItem => tabItem.tabId === tab)) {
			setSelectedTabId(tab as string);
		}
	}, [router.query]);

	return (
		<div className={classes.root}>
			<PageTitleHeader title="En savoir plus sur l'Observatoire" />
			<div className={cx(fr.cx('fr-container'), classes.tabsContainer)}>
				<Tabs
					selectedTabId={selectedTabId}
					tabs={tabs}
					onTabChange={handleTabChange}
				></Tabs>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {},
	tabsContainer: {
		padding: `${fr.spacing('18v')} 0`
	}
}));
