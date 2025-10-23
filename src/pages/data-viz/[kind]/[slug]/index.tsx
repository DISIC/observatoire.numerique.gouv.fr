import { tss } from 'tss-react';
import { fr } from '@codegouvfr/react-dsfr';
import { base64UrlToString, getProcedureKindLabel } from '@/utils/tools';
import { ProcedureKind } from '@/pages/api/indicator-scores';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Tabs, { type TabsProps } from '@codegouvfr/react-dsfr/Tabs';
import { validIndicatorSlugs } from '@/utils/data-viz-client';
import DataVizEvolution from '@/components/data-viz/chart-kind/Evolution';
import RadarComparison from '@/components/data-viz/chart-kind/RadarComparaison';
import DataVizProceduresList from '@/components/data-viz/ProcedureList';
import { GetServerSidePropsContext } from 'next';

const evolutionLegends = [
	'Cet histogramme représente la répartition en pourcentage des niveaux de satisfactions des démarches du périmètre.',
	'Cet histogramme représente la répartition en pourcentage du niveau d’accessibilité numérique des démarches du périmètre.',
	'Cet histogramme représente la répartition en pourcentage du niveau de simplification des démarches du périmètre.',
	'Cet histogramme représente la répartition en pourcentage des démarches de l’indicateur “Authentification”',
	'Cet histogramme représente la répartition en pourcentage des niveaux de clarté des démarches du périmètre.'
];

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const kind = ctx.query.kind;
	const tmpSlug = ctx.query.slug;

	if (typeof kind !== 'string' || typeof tmpSlug !== 'string') {
		return {
			notFound: true
		};
	}

	const slug = tmpSlug ? base64UrlToString(tmpSlug) : '';

	return {
		props: {
			kind,
			slug
		}
	};
}

const DataViz = ({ kind, slug }: { kind: ProcedureKind; slug: string }) => {
	const { classes, cx } = useStyles();

	const tabs = [
		{
			label: `Analyser les indicateurs du ${getProcedureKindLabel(kind)}`,
			content: (
				<div className={classes.evolutionContainer}>
					{validIndicatorSlugs.map((indicator, index) => (
						<DataVizEvolution
							key={indicator}
							kind={kind}
							slug={slug}
							indicator={indicator}
							legend={evolutionLegends[index]}
						/>
					))}
				</div>
			)
		},
		{
			label: `Comparer le ${getProcedureKindLabel(kind)}`,
			content: <RadarComparison kind={kind} slug={slug} />
		},
		{
			label: `Voir les démarches du ${getProcedureKindLabel(kind)}`,
			content: <DataVizProceduresList kind={kind} slug={slug} />
		}
	] as TabsProps.Uncontrolled['tabs'];

	const currentPageLabel = `${getProcedureKindLabel(kind, {
		uppercaseFirst: true
	})} des ${slug}`;

	return (
		<div className={cx(classes.root)}>
			<div className={fr.cx('fr-container', 'fr-pt-6v')}>
				<Breadcrumb
					segments={[
						{
							label: `Graphiques - ${getProcedureKindLabel(kind, {
								plural: true,
								uppercaseFirst: true
							})}`,
							linkProps: { href: `/data-viz/${kind}` }
						}
					]}
					homeLinkProps={{ href: '/' }}
					currentPageLabel={currentPageLabel}
					className={fr.cx('fr-mb-1v')}
				/>
				<h1>{currentPageLabel}</h1>
				<Tabs tabs={tabs} className={classes.tabsWrapper} />
			</div>
		</div>
	);
};

const useStyles = tss.withName(DataViz.name).create(() => ({
	root: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		['& > div > h1']: {
			...fr.typography[11].style,
			color: fr.colors.decisions.background.actionHigh.blueFrance.default
		}
	},
	tabsWrapper: {
		boxShadow: 'none',
		border: 'none',
		'&::before': {
			boxShadow: 'none'
		},
		['& > .fr-tabs__list']: {
			marginBottom: fr.spacing('2v')
		},
		['& > .fr-tabs__panel']: {
			border: 'none',
			padding: 0
		}
	},
	evolutionContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: fr.spacing('2v')
	}
}));

export default DataViz;
