import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { HelpCriterias } from '@/components/help/Criterias';
import { HelpGoals } from '@/components/help/Goals';
import { HelpIndicators } from '@/components/help/Indicators';
import { PageTitleHeader } from '@/components/layout/PageTitleHeader';
import { Help } from '@/payload/payload-types';
import { trpc } from '@/utils/trpc';
import { fr } from '@codegouvfr/react-dsfr';
import { Tabs } from '@codegouvfr/react-dsfr/Tabs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { tss } from 'tss-react';

export default function AideObservatoire() {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const { data: helpCMS, isLoading: isLoadingHelpCms } =
		trpc.cms.help.useQuery();

	const helpTexts = helpCMS?.data;

	const [selectedTabId, setSelectedTabId] = useState<number | null>(null);

	const handleTabChange = (tabId: number) => {
		router.push(`?tab=${tabId}`, undefined, { shallow: true });
	};

	useEffect(() => {
		const { tab, indicator } = router.query;
		if (tab && !isNaN(parseInt(tab as string))) {
			setSelectedTabId(parseInt(tab as string));
		} else {
			setSelectedTabId(indicator ? 2 : 0);
		}
	}, [router.query]);

	if (isLoadingHelpCms || !helpTexts || selectedTabId === null) {
		return (
			<EmptyScreenZone>
				<Loader loadingMessage="Chargement du contenu en cours..." />
			</EmptyScreenZone>
		);
	}

	const tabs = [
		{
			tabId: 'goals',
			label: helpTexts?.goals.title || 'Objectifs et méthodologie',
			isDefault: selectedTabId === 0,
			content: <HelpGoals {...helpTexts.goals} />
		},
		{
			tabId: 'criterias',
			label: helpTexts?.criterias.title || "Critères d'entrée des services",
			isDefault: selectedTabId === 1,
			content: <HelpCriterias {...helpTexts.criterias} />
		},
		{
			tabId: 'indicators',
			label: helpTexts?.indicators.title || 'Indicateurs de qualité',
			isDefault: selectedTabId === 2,
			content: <HelpIndicators {...helpTexts.indicators} />
		}
	];

	return (
		<div className={classes.root}>
			<PageTitleHeader title={helpTexts.header.title} />
			<div className={cx(fr.cx('fr-container'), classes.tabsContainer)}>
				<Tabs tabs={tabs} onTabChange={e => handleTabChange(e.tabIndex)} />
			</div>
		</div>
	);
}

const useStyles = tss.withName(AideObservatoire.name).create(() => ({
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
