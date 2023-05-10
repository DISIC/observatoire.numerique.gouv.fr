import { HomeHeader } from '@/components/home/HomeHeader';
import { IndicatorsInfos } from '@/components/home/IndicatorsInfos';
import { JDMAInfos } from '@/components/home/JDMAInfos';
import { Questions } from '@/components/home/Questions';
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
				title={
					<>
						Comment évaluons-nous
						<br />
						la qualité des démarches ?
					</>
				}
				description={
					<>
						Nous avons recensé plus de 250 services publics les plus utilisées
						par les usagers et nous avons établi des indicateurs qui nous
						permettent de suivre l’avancée de la dématérialisation, et
						l&apos;expérience usager de façon très concrète.
					</>
				}
				titleIndicators={<>5 indicateurs de suivi des démarches</>}
				indicators={proceduresTableHeaders || []}
			/>
			<JDMAInfos
				title={
					<>
						Vous êtes porteur ou porteuse d’un service public
						<br />
						numérique ?
					</>
				}
				description={
					<>
						Même si votre démarche n’est pas parmi les 250 suivies dans
						l’Observatoire, vous pouvez utiliser l’outil Je donne mon avis afin
						de suivre en temps réel la satisfaction des usagers.
					</>
				}
			/>
			<Questions
				title={<>Des questions ?</>}
				description={
					<>
						Notre objectif est l’amélioration concrète des 250 démarches
						administratives les plus utilisées par les usagers. Cet observatoire
						nous permet d’identifier et de suivre les démarches à améliorer en
						priorité.
					</>
				}
			/>
		</div>
	);
}
