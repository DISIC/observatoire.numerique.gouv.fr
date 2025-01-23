import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { HelpCriterias } from '@/components/help/Criterias';
import { HelpGoals } from '@/components/help/Goals';
import { HelpIndicators } from '@/components/help/Indicators';
import { PageTitleHeader } from '@/components/layout/PageTitleHeader';
import { Help } from '@/payload/payload-types';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@/components/generic/Tabs';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type TabsType = keyof Pick<Help, 'goals' | 'criterias' | 'indicators'>;

export default function AideObservatoire() {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const { data: helpCMS, isLoading: isLoadingHelpCms } =
		trpc.cms.help.useQuery();

	const helpTexts = helpCMS?.data;

	const [selectedTabId, setSelectedTabId] = useState<TabsType>('goals');

	const tabs: { tabId: TabsType; label: string }[] = [
		{
			tabId: 'goals',
			label: helpTexts?.goals.title || 'Objectifs et méthodologie'
		},
		{
			tabId: 'criterias',
			label: helpTexts?.criterias.title || "Critères d'entrée des services"
		},
		{
			tabId: 'indicators',
			label: helpTexts?.indicators.title || 'Indicateurs de qualité'
		}
	];

	const handleTabChange = (slug: TabsType) => {
		setSelectedTabId(slug);
		router.push(`?tab=${slug}`, undefined, { shallow: true });
	};

	useEffect(() => {
		const { tab } = router.query;
		if (tab && tabs.some(tabItem => tabItem.tabId === tab)) {
			setSelectedTabId(tab as TabsType);
		}
	}, [router.query]);

	if (isLoadingHelpCms || !helpTexts) {
		return (
			<EmptyScreenZone>
				<Loader loadingMessage="Chargement du contenu en cours..." />
			</EmptyScreenZone>
		);
	}

	const getTabToDisplay = () => {
		switch (selectedTabId) {
			case 'goals':
				return <HelpGoals {...helpTexts.goals} />;
			case 'criterias':
				return <HelpCriterias {...helpTexts.criterias} />;
			case 'indicators':
			default:
				return <HelpIndicators {...helpTexts.indicators} />;
		}
	};

	return (
		<div className={classes.root}>
			<PageTitleHeader title={helpTexts.header.title} />
			<div className={cx(fr.cx('fr-container'), classes.tabsContainer)}>
				<Tabs
					selectedTabId={selectedTabId}
					tabs={tabs}
					onTabChange={e => handleTabChange(e as TabsType)}
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
