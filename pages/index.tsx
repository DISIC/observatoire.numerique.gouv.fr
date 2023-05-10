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
						Pour des services numériques simple, accessible et efficace.
						<br />
						L’observatoire vous accompagne dans votre stratégie de transition
						numérique.
					</>
				}
				buttonText="Tableau de suivi des services publics"
			/>
			<IndicatorsInfos
				title={<>Comment évaluons-nous la qualité des services numériques ?</>}
				description={
					<>
						Nous avons recensé plus de 250 services publics les plus utilisées
						par les usagers et nous avons établi des indicateurs qui nous
						permettent de suivre l’avancée de la dématérialisation, et
						l&apos;expérience usager de façon très concrète.
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
					link: '/'
				}}
			/>
			<TextWithImage
				title={
					<>
						Vous êtes porteur ou porteuse d’un service public
						<br />
						numérique ?
					</>
				}
				description={
					<>
						Vous pouvez proposer votre service et utiliser les indicateurs
						choisi par l’observatoire afin de piloter votre trategie
						d’amélioration de la qualité de vos services
					</>
				}
				button={{
					text: 'Proposer votre service',
					link: 'https://www.plus.transformation.gouv.fr/experience/step_1'
				}}
				image={{
					alt: 'Top 250 des services publics numériques',
					src: '/assets/top250.svg',
					width: 303,
					height: 280
				}}
			/>
			<TextWithImage
				title={<>Comment suivre la satisfaction de vos usagers ?</>}
				description={
					<>
						Avec l&apo;outil Je donne mon avis, suivez en temps réel la
						satisfaction des usagers de vos services publics numériques.
					</>
				}
				button={{
					text: 'Ajouter le bouton “je donne mon avis”',
					link: '/je-donne-mon-avis/'
				}}
				image={{
					alt: "Exemple de statistiques avec l'outil Je donne mon avis",
					src: '/assets/jdma-screenshot.svg',
					width: 327,
					height: 255
				}}
				imageRight
				blueBackground
			/>
			<TextWithImage
				title={
					<>
						Vous êtes porteur ou porteuse d’un service public
						<br />
						numérique ?
					</>
				}
				description={
					<>
						Vous pouvez proposer votre service et utiliser les indicateurs
						choisi par l’observatoire afin de piloter votre trategie
						d’amélioration de la qualité de vos services
					</>
				}
				button={{
					text: 'Proposer votre service',
					link: '/'
				}}
				image={{
					alt: 'Top 250 des services publics numériques',
					src: '/assets/top250.svg',
					width: 303,
					height: 280
				}}
			/>
		</div>
	);
}
