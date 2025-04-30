import { Top250TableSection } from '@/components/top250/TableSection';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { useEffect, useRef, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import { StickyFooter } from '@/components/top250/table/StickyFooter';
import { LightSelect } from '@/components/generic/LightSelect';
import { Loader } from '@/components/generic/Loader';
import { Modal } from '@/components/generic/Modal';
import { ISODateFormatToSimplifiedDate } from '@/utils/tools';
import { tss } from 'tss-react';
import { GristEdition } from '@/trpc/routers/grist';
import { trpc } from '@/utils/trpc';

export default function Grist() {
	const { classes, cx } = useStyles();

	const [selectedEdition, setSelectedEdition] =
		useState<GristEdition | null>(null);
	const [isPublishing, setIsPublishing] = useState<boolean>(false);
	const [published, setIsPublished] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const { data: editionsQuery, isLoading: isLoadingEditions } =
		trpc.grist.getEditions.useQuery();
	const editions = editionsQuery?.data || [];

	const { data: proceduresQuery, isLoading: isLoadingProcedures } =
		trpc.grist.getProcedures.useQuery({ edition: selectedEdition?.id || 0 }, { enabled: !!selectedEdition });
	const procedures = proceduresQuery?.data || [];

	const isLoading = isLoadingEditions || isLoadingProcedures;

	const inputRef = useRef<HTMLInputElement>(null);
	const startDateRef = useRef<HTMLInputElement>(null);
	const endDateRef = useRef<HTMLInputElement>(null);

	const yearMonthFr = new Date().toLocaleString('fr-FR', {
		month: 'long',
		year: 'numeric'
	});
	const defaultEditionName =
		yearMonthFr.charAt(0).toUpperCase() + yearMonthFr.slice(1);

	useEffect(() => {
		if (editions.length > 0) {
			setSelectedEdition(editions[0]);
		}
	}, [editions])

	const publish = async () => {
		const editionName = !!inputRef.current?.value
			? inputRef.current?.value
			: defaultEditionName;

		const startDate = startDateRef.current?.value;
		const endDate = endDateRef.current?.value;

		if (!startDate || !endDate) return;

		setIsModalOpen(false);
		setIsPublishing(true);

		// CREATE EDITION
		const editionResponse = await fetch('/api/editions', {
			method: 'POST',
			body: JSON.stringify({
				name: editionName,
				start_date: new Date(startDate),
				end_date: new Date(endDate),
				created_at: new Date()
			})
		}).then(r => r.json());

		// CREATE PROCEDURES
		const responses = procedures.map(procedure => {
			return fetch('/api/procedures', {
				method: 'POST',
				body: JSON.stringify({ ...procedure, editionId: editionResponse.id })
			});
		});
		Promise.all(responses).then(procedures => {
			setIsPublishing(false);
			setIsPublished(true);
		});
	};

	if (isPublishing)
		return <Loader loadingMessage="Publication de l'édition en cours" />;

	return (
		<div className={cx(classes.root)}>
			<div className={cx(fr.cx('fr-container', 'fr-mb-10v'))}>
				<h2>Prévisualisation à partir de Grist</h2>
				<LightSelect
					label="Édition cible de Grist"
					id="selecteur-editions"
					options={editions.map(e => ({
						label: e.name,
						value: e.name
					}))}
					onChange={e => {
						const matchingEdition = editions.find(
							edition => edition.name === e
						);
						if (matchingEdition) setSelectedEdition(matchingEdition);
					}}
				/>
				<p>
					Cet espace d&apos;administration vous permet de publier une nouvelle
					édition du top 250 des démarches en direct depuis les données de
					Grist. Sélectionnez l&apos;édition cible de Grist, puis
					prévisualisez les données de celle-ci. Vous pouvez ainsi publier des
					éditions dans l&apos;Observatoire à la volée en cliquant sur
					&quot;Publier l&apos;édition&quot;. Les éditions créées sont
					accessibles depuis l&apos;onglet &quot;Mes éditions&quot;.
				</p>
			</div>
			{isLoading || !procedures.length ? (
				<Loader loadingMessage="Chargement des données à partir de Grist..." />
			) : (
				<>
					{published && (
						<div className={cx(fr.cx('fr-container', 'fr-mb-10v'))}>
							<Alert
								closable
								description="Retrouvez votre édition fraichement crée dans l'onglet « Mes Édition »"
								onClose={() => {
									setIsPublished(false);
								}}
								severity="success"
								title="L'édition a bien été publiée"
							/>
						</div>
					)}
					<div className={cx(fr.cx('fr-container'), classes.controlPanel)}>
						<Button
							type="button"
							onClick={() => {
								setIsModalOpen(true);
								setTimeout(() => {
									startDateRef?.current?.setAttribute(
										'value',
										ISODateFormatToSimplifiedDate(
											selectedEdition?.start_date || ''
										)
									);
									endDateRef?.current?.setAttribute(
										'value',
										ISODateFormatToSimplifiedDate(
											selectedEdition?.end_date || ''
										)
									);
								}, 200);
							}}
						>
							Publier l&apos;édition
						</Button>
					</div>
					<div className={cx(classes.tableContainer)}>
						<div className={fr.cx('fr-container', 'fr-px-5v')}>
							<Top250TableSection procedures={procedures} />
						</div>
						<StickyFooter proceduresCount={procedures.length} isAdmin />
					</div>
				</>
			)}
			{isModalOpen && (
				<Modal
					title="Création d'une édition"
					buttons={[]}
					onClose={() => {
						setIsModalOpen(false);
					}}
				>
					<form onSubmit={e => e.preventDefault()}>
						<Input
							hintText="Le nom de l'édition apparaitra dans le menu déroulant des éditions sur le top 250."
							label="Nom de l'édition"
							stateRelatedMessage="Veuillez donner un nom à votre édition"
							state="default"
							nativeInputProps={{
								name: 'editionName',
								placeholder: defaultEditionName,
								ref: inputRef
							}}
						/>
						<Input
							label="Date de début JDMA"
							stateRelatedMessage="Veuillez spécifier une date de début"
							state="default"
							nativeInputProps={{
								name: 'start_date',
								ref: startDateRef,
								type: 'date',
								required: true
							}}
						/>
						<Input
							label="Date de fin JDMA"
							stateRelatedMessage="Veuillez spécifier une date de fin"
							state="default"
							nativeInputProps={{
								name: 'end_date',
								ref: endDateRef,
								type: 'date',
								required: true
							}}
						/>
						<Button
							onClick={publish}
							type="submit"
							className={cx(classes.submit)}
						>
							Publier
						</Button>
					</form>
				</Modal>
			)}
		</div>
	);
}

const useStyles = tss.withName(Grist.name).create(() => ({
	root: {
		paddingTop: fr.spacing('10v')
	},
	controlPanel: {
		paddingBottom: fr.spacing('10v'),
		display: 'flex',
		justifyContent: 'end'
	},
	tableContainer: {
		paddingTop: fr.spacing('6v'),
		backgroundColor: fr.colors.decisions.background.contrast.info.default,
		['.fr-container']: {
			maxWidth: 1440
		}
	},
	submit: {
		display: 'block',
		marginLeft: 'auto',
		marginBottom: fr.spacing('8v'),
		width: '8rem'
	}
}));
