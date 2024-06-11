import { fr } from '@codegouvfr/react-dsfr';
import Head from 'next/head';
import React from 'react';
import { ACCESSIBILITE } from '../utils/content';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';

const Accessibility = () => {
	const { cx, classes } = useStyles();

	return (
		<>
			<Head>
				<title>Accessibilité | Je donne mon avis</title>
				<meta
					name="description"
					content={`Accessibilité | Je donne mon avis`}
				/>
			</Head>
			<div
				className={fr.cx(
					'fr-container',
					'fr-col-lg-10',
					'fr-col-xl-8',
					'fr-pt-20v',
					'fr-pb-8v'
				)}
			>
				<div
					className={fr.cx(
						'fr-grid-row',
						'fr-grid-row--gutters',
						'fr-grid-row--middle'
					)}
				>
					<div className={cx(classes.accessibilityWrapper)}>
						<h1>Accessibilité</h1>
						<section>
							<h2>Déclaration d'accessibilité</h2>
							<p>{ACCESSIBILITE.declaration}</p>
							<p>
								A cette fin, il met en œuvre la stratégie et les actions
								suivantes :
							</p>
							<ul>
								{ACCESSIBILITE.strategy.map((item, index) => (
									<li key={index}>
										<a href={item.link} target="blank">
											{item.text}
										</a>
									</li>
								))}
							</ul>
							<p>
								Cette déclaration d’accessibilité s’applique au service Vos
								démarches essentielles.
							</p>
						</section>
						<section>
							<h3>État de conformité</h3>
							<p>{ACCESSIBILITE.conformity}</p>
						</section>
						<section>
							<h3>Résultats des tests</h3>
							<p>
								L’audit de conformité finalisé le 1er juillet 2021 en interne
								révèle que :
							</p>
							<ul>
								{ACCESSIBILITE.testResults.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						</section>
						<section>
							<h3>Contenus non accessibles</h3>
							<p>
								Les contenus listés ci-dessous ne sont pas accessibles pour les
								raisons suivantes :
							</p>
							<p>Images</p>
							<ul>
								{ACCESSIBILITE.nonAccessibleContent.images.map(
									(item, index) => (
										<li key={index}>{item}</li>
									)
								)}
							</ul>
							<p>Couleurs</p>
							<ul>
								{ACCESSIBILITE.nonAccessibleContent.colors.map(
									(item, index) => (
										<li key={index}>{item}</li>
									)
								)}
							</ul>
							<p>Scripts</p>
							<p>Dans la page 'Observatoire' :</p>
							<ul>
								{ACCESSIBILITE.nonAccessibleContent.scripts.map(
									(item, index) => (
										<li key={index}>{item}</li>
									)
								)}
							</ul>
							<p>Dans la page “Conditions générales d’utilisation” : </p>
							<ul>
								{ACCESSIBILITE.nonAccessibleContent.cgu.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
							<p>Structuration</p>
							<ul>
								{ACCESSIBILITE.nonAccessibleContent.structuration.map(
									(item, index) => (
										<li key={index}>{item}</li>
									)
								)}
							</ul>
							<p>Présentation de l’information</p>
							<ul>
								{ACCESSIBILITE.nonAccessibleContent.presentation.map(
									(item, index) => (
										<li key={index}>{item}</li>
									)
								)}
							</ul>
							<p>Formulaires</p>
							<ul>
								{ACCESSIBILITE.nonAccessibleContent.forms.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
							<p>Navigation</p>
							<ul>
								{ACCESSIBILITE.nonAccessibleContent.navigation.map(
									(item, index) => (
										<li key={index}>{item}</li>
									)
								)}
							</ul>
						</section>
						<section>
							<h3>Dérogations pour charge disproportionnée</h3>
							<p>{ACCESSIBILITE.disproportionateBurden}</p>
						</section>
						<section>
							<h3>Contenus non soumis à l'obligation d'accessibilité</h3>
							<p>{ACCESSIBILITE.notSubjectContent}</p>
						</section>
						<section>
							<h3>Établissement de cette déclaration d'accessibilité</h3>
							<p>{ACCESSIBILITE.establishment}</p>
						</section>
						<section>
							<p>Technologies utilisées pour la réalisation du site web</p>
							<ul>
								{ACCESSIBILITE.technologies.map((tech, index) => (
									<li key={index}>{tech}</li>
								))}
							</ul>
							<p>
								Les tests des pages web ont été effectués avec les combinaisons
								de navigateurs web et lecteurs d’écran suivants :
							</p>
						</section>
						<section>
							<ul>
								{ACCESSIBILITE.testTools.map((tool, index) => (
									<li key={index}>{tool}</li>
								))}
							</ul>
						</section>
						<section>
							<p>Les outils suivants ont été utilisés lors de l’évaluation</p>

							<ul>
								{ACCESSIBILITE.toolsEval.map((tool, index) => (
									<li key={index}>{tool}</li>
								))}
							</ul>
						</section>
						<section>
							<p>
								Pages du site ayant fait l’objet de la vérification de
								conformité
							</p>
							<ul>
								{ACCESSIBILITE.verifiedPages.map((page, index) => (
									<li key={index}>
										<a href={page.link}>{page.text}</a>
									</li>
								))}
							</ul>
						</section>
						<section>
							<h3>Droit à compensation</h3>
							<p>{ACCESSIBILITE.rightToCompensation}</p>
						</section>
						<section>
							<h3>Amélioration et contact</h3>
							<p>{ACCESSIBILITE.contact}</p>
						</section>
						<section>
							<h3>Défenseur des droits</h3>
							<p>
								Si vous constatez un défaut d'accessibilité vous empêchant
								d'accéder à un contenu ou une fonctionnalité du site, que vous
								nous le signalez et que vous ne parvenez pas à obtenir une
								réponse rapide de notre part, vous êtes en droit de faire
								parvenir vos doléances ou une demande de saisine au Défenseur
								des droits. Plusieurs moyens sont à votre disposition :
							</p>
							<ul>
								<li>
									un{' '}
									<a
										href="https://www.defenseurdesdroits.fr/nous-contacter-355"
										target="blank"
									>
										formulaire de contact ;
									</a>
								</li>
								<li>
									la{' '}
									<a
										href="https://www.defenseurdesdroits.fr/carte-des-delegues"
										target="blank"
									>
										liste des délégués de votre région{' '}
									</a>
									avec leurs informations de contact directs ;
								</li>
								<li>{ACCESSIBILITE.defenderOfRights.phone}</li>
								<li>{ACCESSIBILITE.defenderOfRights.postal}</li>
							</ul>
						</section>
					</div>
				</div>
			</div>
		</>
	);
};

const useStyles = makeStyles()(theme => ({
	accessibilityWrapper: {
		paddingLeft: '0.5rem',
		paddingRight: '0.5rem',

		[fr.breakpoints.up('lg')]: {
			paddingLeft: '1.5rem',
			paddingRight: '1.5rem'
		},
		h1: {
			...fr.typography[5].style,
			marginBottom: '3rem'
		},
		h3: {
			marginBottom: '0.5rem'
		},
		section: {
			marginBottom: '1.5rem'
		},
		ul: {
			paddingInlineStart: '2.5rem'
		}
	}
}));

export default Accessibility;
