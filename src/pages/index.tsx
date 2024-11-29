import { EmptyScreenZone } from '@/components/generic/EmptyScreenZone';
import { Loader } from '@/components/generic/Loader';
import { HomeHeader } from '@/components/home/HomeHeader';
import { IndicatorsDetails } from '@/components/home/IndicatorsDetails';
import { IndicatorsInfos } from '@/components/home/IndicatorsInfos';
import { TextWithImage } from '@/components/home/TextWithImage';
import { useProcedureHeaders } from '@/utils/api';
import { trpc } from '@/utils/trpc';

export default function Home() {
	const { data: homeCMS, isLoading: isLoadingHomeCms } =
		trpc.cms.home.useQuery();

	const {
		data: procdeureHeadersRequest,
		isLoading: isLoadingProcedureHeaders
	} = trpc.procedureHeaders.getList.useQuery({
		page: 1,
		perPage: 100
	});
	const procedureHeaders = procdeureHeadersRequest?.data || [];

	const homeTexts = homeCMS?.data;

	if (
		isLoadingHomeCms ||
		isLoadingProcedureHeaders ||
		!homeTexts ||
		!procedureHeaders.length
	) {
		return (
			<EmptyScreenZone>
				<Loader loadingMessage="Chargement du contenu en cours..." />
			</EmptyScreenZone>
		);
	}

	return (
		<div>
			<HomeHeader {...homeTexts.header} />
			<IndicatorsInfos {...homeTexts.quality} />
			<IndicatorsDetails
				{...homeTexts.procedureHeaders}
				indicators={procedureHeaders || []}
			/>
			{homeTexts.redirections.textsWithImages.map((textWithImage, index) => (
				<TextWithImage {...textWithImage} blueBackground={index % 2 !== 0} imageRight={index % 2 !== 0}
				/>
			))}
		</div>
	);
}
