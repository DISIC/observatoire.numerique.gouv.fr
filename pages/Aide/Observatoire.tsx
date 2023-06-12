import { HelpCriterias } from '@/components/help/Criterias';
import { HelpGoals } from '@/components/help/Goals';
import { HelpIndicators } from '@/components/help/Indicators';
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

	const getTabToDisplay = () => {
		switch (selectedTabId) {
			case 'goals':
				return <HelpGoals />;
			case 'criterias':
				return <HelpCriterias />;
			case 'indicators':
			default:
				return <HelpIndicators />;
		}
	};

	return (
		<div className={classes.root}>
			<PageTitleHeader title="À propos" />
			<div className={cx(fr.cx('fr-container'), classes.tabsContainer)}>
				<Tabs
					selectedTabId={selectedTabId}
					tabs={tabs}
					onTabChange={handleTabChange}
				>
					{getTabToDisplay()}
				</Tabs>
			</div>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {},
	tabsContainer: {
		maxWidth: '50rem',
		padding: `${fr.spacing('18v')} 0`,
		['.fr-tabs__panel']: {
			paddingTop: fr.spacing('11v')
		},
		['.fr-tabs, .fr-tabs::before']: {
			boxShadow: 'none'
		}
	}
}));
