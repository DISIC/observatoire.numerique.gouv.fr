import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { HomeHeader } from '@/components/home/HomeHeader';
import { IndicatorsDetails } from '@/components/home/IndicatorsDetails';
import { IndicatorsInfos } from '@/components/home/IndicatorsInfos';
import { TextWithImage } from '@/components/home/TextWithImage';
import { useProcedureHeaders } from '@/utils/api';
import { trpc } from '@/utils/trpc';

export default function Home() {
	const { data: proceduresTableHeaders } = useProcedureHeaders();

	const { data: homeCMS, isLoading: isLoadingHomeCms } =
		trpc.cms.home.useQuery();

	const homeTexts = homeCMS?.data;

	if (isLoadingHomeCms || !homeTexts) {
		return <EmptyScreenZone><Loader loadingMessage="Chargement du contenu en cours..." /></EmptyScreenZone>
	}

	return (
		<div>
			<HomeHeader {...homeTexts.header} />
			<IndicatorsInfos {...homeTexts.quality} />
			<IndicatorsDetails
				title={<>Zoom sur les indicateurs.</>}
				description={
					<>
						Nous avons défini 5 indicateurs clés afin de suivre les
						améliorations des services numériques. Ils couvrent les enjeux de
						qualité de l’expérience utilisateur, de la proactivité et de la
						performance.
					</>
				}
				indicators={proceduresTableHeaders || []}
				button={{
					text: 'Consulter tous les indicateurs',
					link: '/Aide/Observatoire?tab=indicators'
				}}
			/>
			<TextWithImage
				title={
					<>
						Un service public numérique <br />
						semble manquer à la liste ?
					</>
				}
				description={
					<>
						Toute personne, qu’elle soit citoyenne ou agent administratif peut
						proposer l’ajout d’une démarche ou d’un service public numérique.
					</>
				}
				button={{
					text: 'Proposer une démarche ou un service',
					link: '/demande'
				}}
				image={{
					alt: '',
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
						Faites part des difficultés persistantes rencontrées lors de la
						<br />
						réalisation des démarches en ligne.
					</>
				}
				button={{
					text: 'Partagez-nous votre experience',
					link: 'https://www.plus.transformation.gouv.fr/experience/step_1'
				}}
				image={{
					alt: '',
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
					link: 'https://jedonnemonavis.numerique.gouv.fr'
				}}
				image={{
					alt: '',
					src: '/assets/jdma.svg',
					width: 303,
					height: 280
				}}
			/>
		</div>
	);
}
