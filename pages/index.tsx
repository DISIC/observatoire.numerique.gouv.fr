import { HomeHeader } from '@/components/home/HomeHeader';
import { IndicatorsDetails } from '@/components/home/IndicatorsDetails';
import { IndicatorsInfos } from '@/components/home/IndicatorsInfos';
import { TextWithImage } from '@/components/home/TextWithImage';
import { useProcedureHeaders } from '@/utils/api';

export default function Home() {
	const { data: proceduresTableHeaders } = useProcedureHeaders();

	return (
		<div>
			<HomeHeader
				title={
					<>
						Suivez l’amélioration <br /> de la qualité des services <br />{' '}
						publics numériques phares.
					</>
				}
				description={
					<>
						L’observatoire est un outil de pilotage interministériel permettant
						d’identifier les services à améliorer en priorité.
					</>
				}
				button={{
					text: 'Consulter le tableau de suivi des services publics',
					link: '/observatoire'
				}}
			/>
			<IndicatorsInfos
				title={<>Comment évaluons-nous la qualité des services numériques ?</>}
				description={
					<>
						Nous avons recensé les services publics les plus utilisés par les
						usagers et nous avons établi des indicateurs qui nous permettent de
						suivre l&apos;avancée de la dématérialisation, et l&apos;expérience
						usager de façon très concrète.
					</>
				}
			/>
			<IndicatorsDetails
				title={
					<>
						Des indicateurs clés de suivi de la qualité des services publics{' '}
						<br /> numériques.
					</>
				}
				description={
					<>
						Nous avons pensé 11 indicateurs clés afin de suivre les
						améliorations des services numériques selon des critères de qualité
						de l’expérience utilisateur, de proactivité et de performance.
					</>
				}
				indicators={proceduresTableHeaders || []}
				button={{
					text: 'Voir tous les indicateurs',
					link: '/Aide/Observatoire?tab=indicators'
				}}
			/>
			<TextWithImage
				title={
					<>
						Un service publics numérique <br />
						semble manquer à la liste ?
					</>
				}
				description={
					<>
						Toute personne, qu’elle soit citoyenne ou agent administratif peut
						proposer l’ajout d’un service publics numérique à l’observatoire de
						la qualité des services publics numériques.
					</>
				}
				button={{
					text: 'Proposer un service numérique',
					link: '/'
				}}
				image={{
					alt: 'Top 250 des services publics numériques',
					src: '/assets/top250.svg',
					width: 303,
					height: 280
				}}
			/>
			<TextWithImage
				title={
					<>
						Vous êtes agent France Service, accompagnant social <br />
						ou médiateur numérique ?
					</>
				}
				description={
					<>
						Avec l&apo;outil Je donne mon avis, suivez en temps réel la
						satisfaction des usagers de vos services publics numériques.
					</>
				}
				button={{
					text: 'Partagez-nous vote experience',
					link: 'https://www.plus.transformation.gouv.fr/experience/step_1'
				}}
				image={{
					alt: "Exemple de statistiques avec l'outil Je donne mon avis",
					src: '/assets/agents.svg',
					width: 327,
					height: 255
				}}
				imageRight
				blueBackground
			/>
			<TextWithImage
				title={
					<>
						Vous êtes une administration
						<br /> et vous souhaitez suivre la satisfaction de vos usagers ?
					</>
				}
				description={
					<>
						Grâce à l’ajout du bouton “je donne mon avis” à la fin de vos
						démarches vous pourrez recueillir tous les avis de vos usagers en
						temps réel.
					</>
				}
				button={{
					text: 'Ajouter le bouton “je donne mon avis”',
					link: '/je-donne-mon-avis/'
				}}
				image={{
					alt: 'Top 250 des services publics numériques',
					src: '/assets/jdma.svg',
					width: 303,
					height: 280
				}}
			/>
		</div>
	);
}
