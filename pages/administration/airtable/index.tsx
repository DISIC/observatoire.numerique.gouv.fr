import { Top250TableSection } from '@/components/top250/TableSection';
import { ProcedureWithFields } from '@/pages/api/procedures/types';
import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useEffect, useRef, useState } from 'react';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import Input from '@codegouvfr/react-dsfr/Input';

export default function Airtable() {
	const { classes, cx } = useStyles();

	const [procedures, setProcdeures] = useState<ProcedureWithFields[]>([]);
	const [isPublishing, setIsPublishing] = useState<boolean>(false);
	const [published, setIsPublished] = useState<boolean>(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const yearMonthFr = new Date().toLocaleString('fr-FR', {
		month: 'long',
		year: 'numeric'
	});
	const defaultEditionName =
		yearMonthFr.charAt(0).toUpperCase() + yearMonthFr.slice(1);

	const { EditionModal, editionModalButtonProps } = createModal({
		name: 'edition',
		isOpenedByDefault: false
	});

	const getProceduresFormAirtalbe = async () => {
		const res = await fetch('/api/airtable/demarches');
		const json = await res.json();

		setProcdeures(json.data);
	};

	useEffect(() => {
		getProceduresFormAirtalbe();
	}, []);

	const publish = async () => {
		console.log(inputRef.current?.value);
		const editionName = !!inputRef.current?.value
			? inputRef.current?.value
			: defaultEditionName;
		setIsPublishing(true);

		// CREATE EDITION
		const editionResponse = await fetch('/api/editions', {
			method: 'POST',
			body: JSON.stringify({
				name: editionName,
				start_date: new Date(new Date().setMonth(new Date().getMonth() - 3)),
				end_date: new Date(),
				created_at: new Date()
			})
		}).then(r => r.json());

		// CREATE PROCEDURES
		const responses = procedures.map(procedure => {
			fetch('/api/procedures', {
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
		return (
			<div className={cx(classes.loader)}>
				<div>
					<i className={fr.cx('ri-loader-4-line')} />
				</div>
				<p className={fr.cx('fr-pt-4v')}>Publication de l'édition en cours</p>
			</div>
		);

	if (!procedures.length)
		return (
			<div className={cx(classes.loader)}>
				<div>
					<i className={fr.cx('ri-loader-4-line')} />
				</div>
				<p className={fr.cx('fr-pt-4v')}>
					Chargement des données à partir du Airtable...
				</p>
			</div>
		);

	return (
		<div className={cx(classes.root)}>
			{published && (
				<div className={cx(fr.cx('fr-container', 'fr-mb-10v'))}>
					<Alert
						closable
						description="Retrouvez votre édition fraichement crée dans l'onglet Édition"
						onClose={() => {
							setIsPublished(false);
						}}
						severity="success"
						title="L'édition a bien été publiée"
					/>
				</div>
			)}
			<div className={cx(fr.cx('fr-container'), classes.controlPanel)}>
				<Button type="button" {...editionModalButtonProps}>
					Publier l&apos;édition
				</Button>
			</div>
			<div className={cx(classes.tableContainer)}>
				<div className={fr.cx('fr-container', 'fr-px-5v')}>
					<Top250TableSection procedures={procedures} isAdmin />
				</div>
			</div>
			<EditionModal
				title="Création d'une édition"
				buttons={[
					{
						onClick: publish,
						children: "Publier l'édition"
					}
				]}
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
				</form>
			</EditionModal>
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
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
		backgroundColor: theme.decisions.background.contrast.info.default,
		['.fr-container']: {
			maxWidth: 1440
		}
	},
	loader: {
		padding: fr.spacing('30v'),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		i: {
			display: 'inline-block',
			animation: 'spin 1s linear infinite;',
			color: theme.decisions.background.actionHigh.blueFrance.default,
			['&::before']: {
				'--icon-size': '2rem'
			}
		}
	}
}));
