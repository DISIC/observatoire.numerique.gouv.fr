import { fr } from '@codegouvfr/react-dsfr';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Badge from '@codegouvfr/react-dsfr/Badge';
import Button from '@codegouvfr/react-dsfr/Button';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import Tile from '@codegouvfr/react-dsfr/Tile';
import { Select } from '@codegouvfr/react-dsfr/Select';
import { Loader } from '@/components/generic/Loader';
import { Modal } from '@/components/generic/Modal';
import { slugifyText } from '@/utils/tools';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { tss } from 'tss-react';

const formatDate = (date: Date | string) =>
	new Date(date).toLocaleDateString('fr');

export default function Edition() {
	const router = useRouter();
	const id = router.query.id as string | undefined;
	const { classes } = useStyles();

	const [isRepublishModalOpen, setIsRepublishModalOpen] = useState(false);
	const [selectedGristEditionId, setSelectedGristEditionId] = useState<
		number | null
	>(null);
	const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
	const [feedback, setFeedback] = useState<{
		severity: 'success' | 'error';
		title: string;
		description: string;
	} | null>(null);

	const {
		data: summary,
		isLoading,
		isError,
		refetch
	} = trpc.editions.getSummary.useQuery(
		{ id: id as string },
		{ enabled: !!id, retry: false }
	);

	const { data: versionsQuery } = trpc.versions.getList.useQuery();
	const versions = versionsQuery?.data || [];

	const { data: gristEditionsQuery, isLoading: isLoadingGristEditions } =
		trpc.grist.getEditions.useQuery(undefined, {
			enabled: isRepublishModalOpen
		});
	const gristEditions = useMemo(
		() => gristEditionsQuery?.data || [],
		[gristEditionsQuery]
	);

	const republish = trpc.editions.republish.useMutation();
	const deleteEdition = trpc.editions.delete.useMutation();

	const edition = summary?.edition;

	// Pré-sélectionne l'édition Grist dont le nom contient celui de l'édition (ex: "juillet 2026")
	useEffect(() => {
		if (!edition || !gristEditions.length || selectedGristEditionId !== null)
			return;
		const matching = gristEditions.find(gristEdition =>
			gristEdition.name.toLowerCase().includes(edition.name.toLowerCase())
		);
		setSelectedGristEditionId((matching ?? gristEditions[0]).id);
	}, [edition, gristEditions, selectedGristEditionId]);

	useEffect(() => {
		if (edition && selectedVersion === null) {
			setSelectedVersion(edition.version);
		}
	}, [edition, selectedVersion]);

	if (!id || isLoading)
		return <Loader loadingMessage="Chargement de l'édition en cours" />;
	if (isError || !summary || !edition)
		return (
			<div className={fr.cx('fr-container', 'fr-py-10v')}>
				Cette édition n&apos;existe pas.
			</div>
		);

	if (republish.isPending)
		return (
			<Loader
				loadingMessage={`Republication de l'édition "${edition.name}" en cours`}
			/>
		);

	const versionName =
		versions.find(version => version.number === edition.version)?.name ??
		`Version ${edition.version}`;

	const frontHref = summary.isCurrent
		? '/observatoire'
		: `/observatoire/editions/${slugifyText(edition.name)}`;

	const onDelete = async () => {
		if (
			!confirm(
				`Êtes-vous sûr de vouloir supprimer l'édition "${edition.name}" ? Cette action est irréversible.`
			)
		)
			return;
		try {
			await deleteEdition.mutateAsync({ id: edition.id });
			router.replace('/administration/bo/editions');
		} catch (e) {
			setFeedback({
				severity: 'error',
				title: 'La suppression a échoué',
				description: e instanceof Error ? e.message : String(e)
			});
		}
	};

	const onRepublish = async () => {
		if (selectedGristEditionId === null || selectedVersion === null) return;
		setIsRepublishModalOpen(false);
		setFeedback(null);
		try {
			const { proceduresCount } = await republish.mutateAsync({
				id: edition.id,
				gristEditionId: selectedGristEditionId,
				version: selectedVersion
			});
			await refetch();
			setFeedback({
				severity: 'success',
				title: "L'édition a bien été republiée",
				description: `${proceduresCount} démarches importées depuis Grist.`
			});
		} catch (e) {
			await refetch();
			setFeedback({
				severity: 'error',
				title: 'La republication a échoué',
				description: e instanceof Error ? e.message : String(e)
			});
		}
	};

	const metadata = [
		{
			label: 'Période JDMA',
			value: `Du ${formatDate(edition.start_date)} au ${formatDate(
				edition.end_date
			)}`
		},
		{ label: 'Créée le', value: formatDate(edition.created_at) },
		{ label: 'Version', value: versionName },
		{ label: 'Démarches', value: summary.proceduresCount },
		{ label: 'Ministères', value: summary.ministeresCount },
		{ label: 'Administrations', value: summary.administrationsCount }
	];

	return (
		<div className={classes.root}>
			<div className={fr.cx('fr-container')}>
				<Link className={fr.cx('fr-link')} href="/administration/bo/editions">
					<i className={fr.cx('ri-arrow-left-line', 'fr-mr-0-5v')} />
					Retour
				</Link>
				<div className={classes.header}>
					<h3 className={fr.cx('fr-mb-0')}>Édition : {edition.name}</h3>
					{summary.isCurrent && <Badge severity="new">Édition en cours</Badge>}
				</div>

				{feedback && (
					<Alert
						className={fr.cx('fr-mb-6v')}
						closable
						onClose={() => setFeedback(null)}
						severity={feedback.severity}
						title={feedback.title}
						description={feedback.description}
					/>
				)}

				<Button
					className={fr.cx('fr-mb-6v')}
					iconId="ri-external-link-line"
					priority="secondary"
					linkProps={{ href: frontHref, target: '_blank' }}
				>
					Voir l&apos;édition sur le site
				</Button>

				<div className={fr.cx('fr-grid-row', 'fr-grid-row--gutters')}>
					{metadata.map(item => (
						<div key={item.label} className={fr.cx('fr-col-12', 'fr-col-md-4')}>
							<Tile
								title={item.value}
								titleAs="h4"
								desc={item.label}
								orientation="horizontal"
								small
								noIcon
								grey
							/>
						</div>
					))}
				</div>

				<h4 className={fr.cx('fr-mt-10v')}>Actions</h4>
				<ButtonsGroup
					inlineLayoutWhen="md and up"
					buttonsIconPosition="left"
					buttons={[
						{
							children: 'Republier depuis Grist',
							iconId: 'ri-refresh-line',
							onClick: () => setIsRepublishModalOpen(true)
						},
						{
							children: "Supprimer l'édition",
							iconId: 'ri-delete-bin-2-line',
							className: classes.deleteButton,
							disabled: deleteEdition.isPending,
							onClick: onDelete
						}
					]}
				/>
			</div>

			{isRepublishModalOpen && (
				<Modal
					title={`Republier l'édition "${edition.name}"`}
					buttons={[]}
					onClose={() => setIsRepublishModalOpen(false)}
				>
					<p>
						Les démarches actuelles de cette édition seront supprimées puis
						réimportées depuis Grist. Le nom, les dates JDMA et la date de
						création de l&apos;édition sont conservés.
					</p>
					{isLoadingGristEditions ? (
						<p>Chargement des éditions Grist...</p>
					) : (
						<form onSubmit={e => e.preventDefault()}>
							<Select
								label="Édition Grist"
								nativeSelectProps={{
									value: selectedGristEditionId ?? '',
									onChange: e =>
										setSelectedGristEditionId(Number(e.target.value))
								}}
							>
								{gristEditions.map(gristEdition => (
									<option key={gristEdition.id} value={gristEdition.id}>
										{gristEdition.name}
									</option>
								))}
							</Select>
							<Select
								label="Version"
								nativeSelectProps={{
									value: selectedVersion ?? '',
									onChange: e => setSelectedVersion(Number(e.target.value))
								}}
							>
								{versions.map(version => (
									<option key={version.id} value={version.number}>
										{version.name}
									</option>
								))}
							</Select>
							<Alert
								className={fr.cx('fr-mb-6v')}
								small
								severity="warning"
								description="Vérifiez l'édition Grist sélectionnée : c'est elle qui remplacera les données publiées."
							/>
							<Button
								type="submit"
								className={classes.submit}
								disabled={
									selectedGristEditionId === null || selectedVersion === null
								}
								onClick={onRepublish}
							>
								Republier
							</Button>
						</form>
					)}
				</Modal>
			)}
		</div>
	);
}

const useStyles = tss.withName(Edition.name).create(() => ({
	root: {
		paddingTop: fr.spacing('10v'),
		paddingBottom: fr.spacing('10v')
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		gap: fr.spacing('4v'),
		marginTop: fr.spacing('6v'),
		marginBottom: fr.spacing('6v')
	},
	deleteButton: {
		backgroundColor:
			fr.colors.decisions.background.actionHigh.redMarianne.default,
		['&:hover']: {
			backgroundColor:
				fr.colors.decisions.background.actionHigh.redMarianne.hover +
				' !important'
		}
	},
	submit: {
		display: 'block',
		marginLeft: 'auto',
		marginBottom: fr.spacing('8v')
	}
}));
