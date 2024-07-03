interface MainStructure {
	[key: string]: {
		title: string;
		content: (
			| string
			| {
					text: string;
					type?: 'noSpaces' | 'link' | 'mailto' | 'list' | 'subtitle' | 'bold';
					href?: string;
			  }
		)[];
	};
}

export const CGU: MainStructure = {
	responsable: {
		title: 'Qui est responsable de Vos Démarches Essentielles ?',
		content: [
			{
				text: 'Le site <strong>Vos Démarches Essentielles</strong> est développé au sein la Direction Interministérielle du Numérique (DINUM). Ce site propose un observatoire de la qualité des démarches et services les plus utilisés par les citoyens français.',
				type: 'bold'
			},
			'Le responsable de l’utilisation des données est la DINUM représenté par Stéphanie Schaer, Directrice Interministérielle du Numérique (DINUM).'
		]
	},
	raison: {
		title: 'Données à caractère personnel',
		content: [
			{
				text: 'Le site <strong>Vos Démarches Essentielles</strong> ne collecte ou traite aucune donnée à caractère personnel.',
				type: 'bold'
			}
		]
	},
	cookies: {
		title: 'Cookies',
		content: [
			'Un cookie est un fichier déposé sur votre terminal lors de la visite d’un site. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal (ordinateur, mobile ou tablette).',
			'En application de l’article 5(3) de la directive 2002/58/CE modifiée concernant le traitement des données à caractère personnel et la protection de la vie privée dans le secteur des communications électroniques, transposée à l’article 82 de la loi n°78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les traceurs ou cookies suivent deux régimes distincts.',
			{
				text: 'Les cookies n’étant pas strictement nécessaires au service ou n’ayant pas pour finalité exclusive de faciliter la communication par voie électronique doivent être consentis par l’utilisateur.',
				type: 'list'
			},
			'Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques constitue une base légale au sens du RGPD et doit être entendu au sens de l’article 6-a du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données.',
			'À tout moment, vous pouvez refuser l’utilisation des cookies et désactiver le dépôt sur votre ordinateur en utilisant la fonction dédiée de votre navigateur (fonction disponible notamment sur Microsoft Internet Explorer 11, Google Chrome, Mozilla Firefox, Apple Safari et Opera).',
			{
				text: 'Certains cookies sont strictement nécessaires au service ou ayant pour finalité exclusive de faciliter la communication par voie électronique et sont dispensés de consentement préalable au titre de l’article 82 de la loi n°78-17 du 6 janvier 1978.',
				type: 'list'
			},
			'Des cookies relatifs aux statistiques publiques et anonymes sont également déposés.',
			"La plateforme utilise également la solution de mesure d'audience Matomo en l'ayant configuré en mode « exempté », conformément aux recommandations de la CNIL. Elle ne nécessite donc pas le consentement des personnes concernées.",
			'Pour aller plus loin, vous pouvez consulter les fiches proposées par la Commission Nationale de l’Informatique et des Libertés (CNIL) :',
			{
				text: 'Cookies et traceurs : que dit la loi ?',
				type: 'link',
				href: 'https://www.cnil.fr/fr/cookies-et-autres-traceurs-que-dit-la-loi'
			},
			{
				text: 'Cookies : les outils pour les maîtriser',
				type: 'link',
				href: 'https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser'
			}
		]
	}
};

export const LegalNotice: MainStructure = {
	editeur: {
		title: 'Éditeur de la plateforme',
		content: [
			{
				text: 'La plateforme <strong>Vos Démarches Essentielles</strong> est éditée par la Direction interministérielle du numérique de l’Etat (DINUM) située :',
				type: 'bold'
			},
			{ text: '20 avenue de Ségur', type: 'noSpaces' },
			{ text: '75007 Paris', type: 'noSpaces' },
			'Tel. Accueil : 01.71.21.01.70',
			{
				text: 'SIRET : 12000101100010 (secrétariat général du gouvernement)',
				type: 'noSpaces'
			},
			'SIREN : 120 001 011'
		]
	},
	directeurPublication: {
		title: 'Directeur de la publication',
		content: [
			'La directrice de la publication est Madame Stéphanie Schaer, Directrice interministérielle du numérique.'
		]
	},
	hebergement: {
		title: 'Hébergement de la plateforme',
		content: [
			'La plateforme est hébergée par Clever Cloud situé :',
			{ text: 'RCS Nantes B 524 172 699', type: 'noSpaces' },
			{ text: 'Code APE : 6311Z', type: 'noSpaces' },
			{ text: 'N°TVA : FR 87 524 172 699', type: 'noSpaces' },
			{ text: 'Siège social : 4 rue Voltaire', type: 'noSpaces' },
			{ text: '44000 Nantes', type: 'noSpaces' },
			'France'
		]
	},
	accessibilite: {
		title: 'Accessibilité',
		content: ['L’accessibilité de la plateforme est partiellement conforme.']
	},
	moreInfo: {
		title: 'En savoir plus',
		content: [
			'Pour en savoir plus sur la politique d’accessibilité numérique de l’État : ',
			{
				text: 'https://accessibilite.numerique.gouv.fr/',
				type: 'link',
				href: 'https://accessibilite.numerique.gouv.fr/'
			}
		]
	},
	securite: {
		title: 'Sécurité',
		content: [
			'La plateforme est protégée par un certificat électronique, matérialisé pour la grande majorité des navigateurs par un cadenas. Cette protection participe à la confidentialité des échanges.',
			'En aucun cas les services associés à la plateforme ne seront à l’origine d’envoi de courriels pour demander la saisie d’informations personnelles.'
		]
	},
	service: {
		title: 'Service',
		content: [
			'Le suivi éditorial et graphique est assuré par la DINUM.',
			'Tout site public ou privé est autorisé à établir, sans autorisation préalable, un lien (y compris profond) vers les informations diffusées sur le site.'
		]
	},
	contact: {
		title: 'Contact',
		content: [
			'L’adresse courriel de contact est la suivante : ',
			{
				text: 'observatoire@design.numerique.gouv.fr ',
				type: 'mailto',
				href: 'mailto:observatoire@design.numerique.gouv.fr '
			}
		]
	}
};

export const TermsOfUse: MainStructure = {
	appField: {
		title: '1. Champ d’application',
		content: [
			{
				text: 'Le présent document définit les modalités d’utilisation de <strong>Vos Démarches Essentielles</strong>, développé au sein la Direction Interministérielle du Numérique (DINUM).',
				type: 'bold'
			}
		]
	},
	platform: {
		title: '2. Objet de la plateforme',
		content: [
			'Le service permet de diffuser un observatoire de la qualité des démarches et services les plus utilisés par les citoyens français.',
			{
				text: '<strong>Vos Démarches Essentielles</strong> est développée et opérée par la DINUM. Toute utilisation de ce service doit respecter les présentes modalités d’utilisation.',
				type: 'bold'
			}
		]
	},
	definitions: {
		title: '3. Définitions',
		content: [
			{
				text: 'Administrateur : toute personne membre de la DINUM qui administre les données des services et démarches présentes dans l’observatoire',
				type: 'list'
			},
			{
				text: 'Visiteur : toute personne consultant la plafeforme <strong>Vos Démarches Essentielles</strong>.',
				type: 'list'
			}
		]
	},
	service: {
		title: '4. Accès au service',
		content: [
			{
				text: '<strong>Vos Démarches Essentielles</strong> est mis à disposition de toute personne souhaitant consulter les données de l’observatoire des démarches et services numériques essentielles.',
				type: 'bold'
			},
			'L’utilisation du service est :',
			{
				text: 'libre et gratuite pour les visiteurs,',
				type: 'list'
			},
			{
				text: 'soumis à la création d’un compte utilisateur pour les administrateurs.',
				type: 'list'
			}
		]
	},
	features: {
		title: '5. Fonctionnalités',
		content: [
			'Les visiteurs peuvent accéder au tableau de suivi de l’observatoire et consulter les données relatives à l’ensemble des services et démarches dites essentielles.',
			'Les administrateurs peuvent administrer les comptes utilisateurs des administrateurs et publier des éditions de l’observatoire.'
		]
	},
	responsability: {
		title:
			'6. Engagements et responsabilités des utilisateurs et utilisatrices',
		content: [
			{
				text: '6.1 Usages conformes',
				type: 'subtitle'
			},

			'Le service est mis à disposition pour la consultation des critères de qualité des démarches et services numériques publics.',
			'L’utilisateur ou l’utilisatrice est responsable des données ou contenus qu’il ou elle saisit dans les divers champs libres du formulaire. Il ou elle veille à ne saisir que des messages appropriés.',
			'L’utilisateur s’assure de garder son mot de passe secret. Toute divulgation du mot de passe, quelle que soit sa forme, est interdite. Il assume les risques liés à l’utilisation de son adresse e-mail et de son mot de passe.',
			{
				text: '6.2 Usages interdits',
				type: 'subtitle'
			},
			'L’utilisateur ou l’utilisatrice s’engage à ne pas saisir dans les champs libres du site des contenus ou informations contraires aux dispositions légales et réglementaires en vigueur.',
			'En particulier, il ou elle s’engage à ne communiquer que les données strictement nécessaires à l’évaluation du service numérique public dont il est question et s’abstenir dans les champs libres de révéler des données sensibles le concernant ou concernant des tiers (ex : données de santé, opinion politique, philosophique ou religieuse), de tenir des propos injurieux, diffamatoires, obscènes et plus généralement contraire à la loi et à l’ordre public.',
			'Il est rappelé que toute personne qui procède à une fausse déclaration pour elle-même ou pour autrui s’expose, notamment, aux sanctions prévues à l’article 441-1 du Code pénal, prévoyant des peines pouvant aller jusqu’à trois ans d’emprisonnement et 45 000 euros d’amende.',
			'L’utilisateur s’assure, en amont de la publication, que cette dernière respecte le cadre juridique en vigueur notamment le RGPD, la loi Informatique et libertés, le Code de la propriété intellectuelle et le CRPA.',
			'L’utilisateur s’engage à ne pas publier dans les espaces de discussion ou à quelque endroit que ce soit de messages racistes, sexistes, injurieux, insultants ou contraires à l’ordre public. Chaque commentaire publié emporte cession de ses droits de propriété intellectuelle de façon non exclusive, à titre gracieux, pour le monde entier et pour toute la durée de ces droits.'
		]
	},
	dinum: {
		title: '7. Engagements et responsabilités de la DINUM',
		content: [
			{
				text: '7.1 Sécurité et accès à la Plateforme',
				type: 'subtitle'
			},
			'Les sources des informations diffusées sur la Plateforme sont réputées fiables mais elle ne garantit pas qu’elle soit exempte de défauts, d’erreurs ou d’omissions.',
			'La DINUM s’engage à la sécurisation de la Plateforme, notamment en prenant toutes les mesures nécessaires permettant de garantir la sécurité et la confidentialité des informations fournies.',
			'La DINUM s’engage à fournir les moyens nécessaires et raisonnables pour assurer un accès continu à la Plateforme.',
			'La DINUM se réserve le droit de faire évoluer, de modifier ou de suspendre, sans préavis, le service pour des raisons de maintenance ou pour tout autre motif jugé nécessaire.',
			'La DINUM se réserve le droit de suspendre ou supprimer un compte utilisateur ou utilisatrice du service qui aurait méconnu les présentes modalités d’utilisation, sans préjudice des éventuelles actions en responsabilité pénale et civile qui pourraient être engagées à l’encontre de l’utilisateur ou l’utilisatrice.',

			{
				text: '7.2 Open Source et Licences',
				type: 'subtitle'
			},
			'Le code source de la Plateforme est libre et disponible ici :',
			{
				text: 'https://github.com/DISIC/observatoire.numerique.gouv.fr',
				type: 'link',
				href: 'https://github.com/DISIC/observatoire.numerique.gouv.fr'
			},
			'Les contenus proposés par l’Éditeur sont sous Licence Ouverte, à l’exception des logos et des représentations iconographiques et photographiques pouvant être régis par leurs licences propres.'
		]
	},
	evolution: {
		title: '8. Évolution des modalités d’utilisation',
		content: [
			'Les termes des présentes modalités d’utilisation peuvent être modifiés ou complétés à tout moment, sans préavis, en fonction des modifications apportées au service, de l’évolution de la législation ou pour tout autre motif jugé nécessaire. Ces modifications et mises à jour s’imposent à l’utilisateur ou l’utilisatrice qui doit, en conséquence, se référer régulièrement à cette rubrique pour vérifier les conditions générales en vigueur.'
		]
	},
	accessibility: {
		title: '9. Accessibilité',
		content: [
			'Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une fonctionnalité du service, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou demande de saisine au défenseur des droits par courrier gratuit, sans affranchissement à l’adresse :',
			{
				text: 'Défenseur des droits',
				type: 'noSpaces'
			},
			{
				text: 'Libre réponse 71120',
				type: 'noSpaces'
			},
			{
				text: '75342 Paris CEDEX 07,',
				type: 'noSpaces'
			},
			{
				text: 'par Téléphone : 09 69 39 00 00 ou via le formulaire en ligne.',
				type: 'noSpaces'
			}
		]
	}
};
