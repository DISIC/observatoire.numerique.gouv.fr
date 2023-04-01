import { HomeHeader } from '@/components/home/HomeHeader';
import { IndicatorsInfos } from '@/components/home/IndicatorsInfos';
import { JDMAInfos } from '@/components/home/JDMAInfos';
import { useProcedureHeaders } from '@/utils/api';

export default function Home() {
	const { data: proceduresTableHeaders } = useProcedureHeaders();

	return (
		<div>
			<HomeHeader
				title={
					<>
						Pour des services publics
						<br />
						numériques de qualité
					</>
				}
				description={
					<>
						L’Observatoire vous permet de suivre la qualité de la
						dématérialisation
						<br />
						de plus de 250 démarches publiques faisant partie des services les
						plus utilisées.
					</>
				}
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
						l'expérience usager de façon très concrète.
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
		</div>
	);
}
