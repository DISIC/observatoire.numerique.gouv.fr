import { tss } from 'tss-react';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { GetServerSidePropsContext } from 'next';
import { useProcedureById } from '@/utils/api';
import { validIndicatorSlugs } from '@/utils/data-viz-client';
import DataVizIndicatorEvolution from '@/components/data-viz/chart-kind/IndicatorEvolution';
import Head from 'next/head';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const id = ctx.query.id;

	if (typeof id !== 'string') {
		return {
			notFound: true
		};
	}

	return {
		props: {
			id
		}
	};
}

const DataViz = ({ id }: { id: string }) => {
	const { classes, cx } = useStyles();

	const { data: procedure } = useProcedureById(id);

	return (
		<>
			<Head>
				<title>Graphiques - {procedure?.title} - Vos démarches essentielles</title>
			</Head>
			<div className={cx(classes.root)}>
				<div className={fr.cx('fr-container', 'fr-pt-6v')}>
					<Breadcrumb
						segments={[
							{
								label: 'Graphiques - Démarches',
								linkProps: { href: '/data-viz/procedure' }
							}
						]}
						homeLinkProps={{ href: '/' }}
						currentPageLabel={procedure?.title || ''}
						className={fr.cx('fr-mb-1v')}
					/>
					<h1>{procedure?.title}</h1>
					<div className={classes.evolutionContainer}>
						{validIndicatorSlugs.map(indicatorSlug => (
							<DataVizIndicatorEvolution
								key={indicatorSlug}
								indicatorSlug={indicatorSlug}
								procedure={procedure}
							/>
						))}
					</div>
				</div>
			</div>
		</>
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
	evolutionContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: fr.spacing('2v')
	}
}));

export default DataViz;
