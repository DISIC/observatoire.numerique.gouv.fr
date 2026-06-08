import { tss } from 'tss-react';
import { fr } from '@codegouvfr/react-dsfr';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { CallOut } from '@codegouvfr/react-dsfr/CallOut';
import DataVizEvolution from '@/components/data-viz/chart-kind/Evolution';
import ScoreCard from '@/components/data-viz/ScoreCard';
import { Loader } from '@/components/generic/Loader';
import { useEdition, useInterministerielScores } from '@/utils/api';
import { getValidIndicatorLabel } from '@/utils/tools';
import { validIndicatorSlugs } from '@/utils/data-viz-client';

type InterministerielIndicator = {
	slug: (typeof validIndicatorSlugs)[number];
	legend: string;
};

const scoreCardTitles: Record<string, string> = {
	satisfaction:
		'Satisfaction usager, démarches ayant un score de satisfaction supérieur à 8/10',
	handicap:
		'Prise en compte du handicap, démarches totalement conformes au RGAA'
};

const interministerielIndicators: InterministerielIndicator[] = [
	{
		slug: 'satisfaction',
		legend:
			'Cet histogramme représente la répartition en pourcentage des niveaux de satisfactions des démarches au niveau interministériel.'
	},
	{
		slug: 'handicap',
		legend:
			'Cet histogramme représente la répartition en pourcentage du niveau d’accessibilité numérique des démarches au niveau interministériel.'
	}
];

const Interministeriel = () => {
	const { classes, cx } = useStyles();

	const { data: scores, isLoading } = useInterministerielScores();

	const { data: currentEdition } = useEdition({ id: 'current', kind: 'id' });

	return (
		<div className={cx(classes.root)}>
			<div className={fr.cx('fr-container', 'fr-pt-6v')}>
				<Breadcrumb
					segments={[]}
					homeLinkProps={{ href: '/' }}
					currentPageLabel="Graphiques - Interministériel"
					className={fr.cx('fr-mb-1v')}
				/>
				<h1>Interministériel</h1>
				<CallOut className={fr.cx('fr-mb-6v')}>
					<a
						className={fr.cx('fr-link')}
						href="https://www.systeme-de-design.gouv.fr/static/file/Circulaire_n_6411_SG_sites_Internet_de_l_Etat_et_demarches_numeriques_07_07_2023.pdf"
						target="_blank"
						rel="noopener noreferrer"
					>
						La circulaire Premier Ministre datant du 7 juillet 2023
					</a>{' '}
					a donné la direction souhaitée par le gouvernement concernant
					l’amélioration de la lisibilité des sites internet de l’Etat et de la
					qualité des démarches numériques. Par la suite, les seuils de 8/10 et
					100% ont été fixés pour les critères Satisfaction usager et Prise en
					compte du handicap respectivement.
				</CallOut>
				{isLoading ? (
					<div className={fr.cx('fr-py-10v')}>
						<Loader />
					</div>
				) : scores.length > 0 ? (
					<>
						<h2 className={cx(fr.cx('fr-h3'), classes.subtitle)}>
							Données basées sur la dernière édition (
							{currentEdition?.name || '...'})
						</h2>
						<div
							className={cx(
								fr.cx('fr-grid-row', 'fr-grid-row--gutters', 'fr-mb-6v')
							)}
						>
							{scores.map(score => (
								<div
									key={score.slug}
									className={fr.cx('fr-col-12', 'fr-col-md-6')}
								>
									<ScoreCard
										title={
											scoreCardTitles[score.slug] ||
											getValidIndicatorLabel(score.slug)
										}
										percentage={score.percentage}
										delta={score.delta}
										reached={score.reached}
										total={score.total}
									/>
								</div>
							))}
						</div>
					</>
				) : null}
				<h2 className={cx(fr.cx('fr-h3'), classes.subtitle)}>
					Évolution des critères dans le temps
				</h2>
				<div className={classes.evolutionContainer}>
					{interministerielIndicators.map(({ slug, legend }) => (
						<DataVizEvolution
							key={slug}
							kind="ministere"
							indicator={slug}
							legend={legend}
							titleAs="h3"
						/>
					))}
				</div>
			</div>
		</div>
	);
};

const useStyles = tss.withName(Interministeriel.name).create(() => ({
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
	},
	subtitle: {
		color: fr.colors.decisions.artwork.minor.blueFrance.default,
		marginBottom: fr.spacing('4w')
	}
}));

export default Interministeriel;
