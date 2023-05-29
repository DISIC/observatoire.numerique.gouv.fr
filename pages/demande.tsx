import { PageTitleHeader } from '@/components/layout/PageTitleHeader';
import { fr } from '@codegouvfr/react-dsfr';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useState } from 'react';
import * as Yup from 'yup';

export default function Demande() {
	const { classes, cx } = useStyles();

	const [isSubmitted, setIsSubmitted] = useState(false);

	const validationSchema = Yup.object().shape({
		serviceName: Yup.string(),
		url: Yup.string().url('Invalid URL').required('URL is required'),
		remarks: Yup.string()
	});

	const DemandeForm = () => {
		return (
			<>
				<PageTitleHeader
					title={
						<>
							Demande de soumission d'un service
							<br /> public
						</>
					}
				/>
				<div className={cx(classes.formContainer, fr.cx('fr-container'))}>
					<Formik
						initialValues={{ serviceName: '', url: '', remarks: '' }}
						validationSchema={validationSchema}
						onSubmit={(values, { setSubmitting }) => {
							fetch('/api/airtable/demande', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(values)
							})
								.then(res =>
									res.json().then(json => {
										console.log(json);
										setIsSubmitted(true);
									})
								)
								.finally(() => setSubmitting(false));
						}}
					>
						{({ values, handleChange, handleBlur, isSubmitting, errors }) => (
							<Form>
								<Input
									label="Nom du sevice numérique (optionnel)"
									nativeInputProps={{
										name: 'serviceName',
										value: values.serviceName,
										onChange: handleChange,
										onBlur: handleBlur
									}}
								/>
								<Alert
									description="Il s’agit du service que vous souhaitez soumettre à l’observatoire de la qualité des démarches en ligne"
									severity="info"
									className={cx(classes.lightInfoAlert)}
									small
								/>
								<Input
									label="URL"
									nativeInputProps={{
										name: 'url',
										value: values.url,
										onChange: handleChange,
										onBlur: handleBlur
									}}
									state={!!errors['url'] ? 'error' : 'default'}
									stateRelatedMessage="Une URL doit être renseignée (exemple: http://impots.gouv.fr/)"
								/>
								<Input
									label="Remarques (optionnel)"
									nativeTextAreaProps={{
										name: 'remarks',
										value: values.remarks,
										onChange: handleChange,
										onBlur: handleBlur
									}}
									state="default"
									textArea
								/>

								<Button size="large" type="submit" disabled={isSubmitting}>
									Envoyer
								</Button>
							</Form>
						)}
					</Formik>
					<p className={fr.cx('fr-text--xs', 'fr-mt-12v')}>
						Pour qu’un service public rejoigne l’observatoire de la qualité des
						démarches en ligne, ce dernier doit répondre à quelques critères
						d’entrées.
					</p>
					<Link
						className={fr.cx('fr-link', 'fr-text--xs')}
						href="/Aide/Observatoire?tab=criterias"
					>
						Consulter les critères d’entrée à l’observatoire de la qualité des
						services publics numériques
					</Link>
				</div>
			</>
		);
	};

	const DemandeSuccess = () => {
		return (
			<div className={cx(classes.submitted, fr.cx('fr-container'))}>
				<h1 className={fr.cx('fr-mb-10v')}>
					Merci pour votre contribution,
					<br />
					nous étudions votre proposition.
				</h1>
				<Link
					href="/demande"
					onClick={() => setIsSubmitted(false)}
					className={fr.cx('fr-btn')}
				>
					Faire une autre demande
				</Link>
			</div>
		);
	};

	return (
		<div className={cx(classes.root)}>
			{!isSubmitted ? <DemandeForm /> : <DemandeSuccess />}
		</div>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {},
	formContainer: {
		padding: `0 0 ${fr.spacing('16v')} 0`,
		maxWidth: '38rem',
		['.fr-input-group']: { margin: `${fr.spacing('12v')} 0` },
		['button[type="submit"]']: {
			display: 'block',
			marginLeft: 'auto',
			marginTop: `-${fr.spacing('2v')}`
		}
	},
	submitted: {
		padding: `${fr.spacing('14w')} 0`,
		textAlign: 'center',
		h1: {
			...fr.typography[11].style,
			marginBottom: 0,
			color: theme.decisions.background.actionHigh.blueFrance.default
		}
	},
	lightInfoAlert: {
		boxShadow: 'none',
		padding: `0 0 0 ${fr.spacing('5v')}`,
		color: theme.decisions.background.flat.info.default,
		marginTop: `-${fr.spacing('9v')}`,
		['&::before']: {
			color: theme.decisions.background.flat.info.default,
			'--icon-size': '1rem',
			margin: `2px 0 0 0`
		},
		['.fr-alert__title']: {
			display: 'none'
		},
		p: {
			...fr.typography[17].style
		}
	}
}));
