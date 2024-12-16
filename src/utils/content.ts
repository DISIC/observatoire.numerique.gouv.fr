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

export const ACCESSIBILITE = {
	declaration:
		'La direction interministérielle du numérique (DINUM) s’engage à rendre ses sites internet accessibles conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005.',
	introStrategy:
		'À cette fin, il met en œuvre la stratégie et les actions suivantes :',
	strategy: [
		{
			text: 'Consulter le schéma pluriannuel d’accessibilité 2020-2022 (pdf - 1,7 Mo)',
			link: 'https://www.numerique.gouv.fr/uploads/DINUM_SchemaPluriannuel_2020.pdf'
		},
		{
			text: 'Consulter le plan annuel d’accessibilité 2021 (pdf - 900 Ko)',
			link: 'https://www.numerique.gouv.fr/uploads/DINUM-plan-annuel-2021.pdf'
		}
	],
	strategyEnd:
		'Cette déclaration d’accessibilité s’applique au service Vos démarches essentielles.',
	conformity:
		"Le service Vos démarches essentielles est en conformité partielle avec le référentiel général d'amélioration de l'accessibilité (RGAA), version 4.1. Les non-conformités sont énumérées ci-dessous.",
	testResultIntro:
		'L’audit de conformité finalisé le 1er juillet 2021 en interne révèle que :',
	testResults: [
		'53,4 % des critères RGAA sont respectés.',
		'Le taux moyen de conformité du service en ligne s’élève à 78,2%.'
	],
	nonAccessibleContent: {
		contentIntro:
			'Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes :',
		images: [
			'Des images informatives n’ont pas une alternative textuelle pertinente.',
			'Sur les pages dédiées aux démarches, certains graphiques n’ont pas les descriptions détaillées nécessaires pour retranscrire les données chiffrées affichées.'
		],
		colors: [
			'Certains boutons de formulaire et certains textes présentent des problèmes de contraste.'
		],
		scripts: [
			'Des attributs ARIA manquent pour les sous-menus, le tableau listant les démarches et enfin les boutons affichant les détails sur une démarche.',
			"Lorsqu'on active les boutons 'Trier par' et 'Édition avril 2021' avec la touche Espace, les sous-menus sont affichés durant un court instant seulement."
		],
		cgu: [
			'Lorsqu’on active le bouton “Refuser le suivi de votre navigation”, la page se recharge sans que l’utilisateur en ait été averti au préalable. '
		],
		structuration: [
			'La zone de contenu principal n’est pas indiquée dans le code.',
			'La zone de navigation principale n’est pas bien indiquée dans le code pour les lecteurs d’écran.',
			"Certaines listes sont mal structurées, dans le menu de navigation et sur les pages de connexion ('Accès administration') et d’inscription."
		],
		presentation: [
			'La prise de focus est peu ou non visible sur certains liens et boutons sur Safari.',
			"Dans la page 'Observatoire', le tableau n’est pas adapté aux tailles d’écrans mobiles. De même, sur les pages dédiées aux démarches, certains graphiques ne sont pas adaptés.",
			'Dans la page d’accueil, lorsque l’on zoome à 200%, certains textes débordent des cadres et ne sont plus lisibles.'
		],
		forms: [
			'Les messages d’erreurs n’indiquent pas nommément les champs erronés ou ne sont pas assez précis.'
		],
		navigation: [
			'Le site propose un seul moyen de navigation, à savoir le menu principal.'
		]
	},
	disproportionateBurden: 'Pas de contenu concerné',
	notSubjectContent: 'Pas de contenu concerné',
	establishment: 'Cette déclaration a été établie le 01/07/2021.',
	technologies: ['HTML5', 'CSS', 'JavaScript', 'jQuery'],
	testPageIntro:
		'Les tests des pages web ont été effectués avec les combinaisons de navigateurs web et lecteurs d’écran suivants :',
	testTools: [
		'NVDA 2021.4 et Firefox 89.0.2',
		'Jaws 2021 et Firefox 89.0.2',
		'VoiceOver et Safari, OS 11.0.1'
	],
	toolsIntro: 'Les outils suivants ont été utilisés lors de l’évaluation',
	toolsEval: [
		'Barre d’outil Web Developer',
		'Extensions : WAVE, WCAG Color contrast checker et HeadingsMaps'
	],
	verifiedPagesIntro:
		'Pages du site ayant fait l’objet de la vérification de conformité',
	verifiedPages: [
		{ text: 'Accueil', link: '/' },
		{ text: 'Conditions générales d’utilisation', link: '/cgu' },
		{ text: 'Accessibilité', link: '/accessibilite' },
		{ text: 'L’observatoire', link: '/observatoire' },
		{
			text: "En savoir plus sur nos critères d'évaluation",
			link: '/Aide/Observatoire'
		}
	],
	rightToCompensation:
		'Dans l’attente d’une mise en conformité totale, vous pouvez obtenir une version accessible des documents ou des informations qui y seraient contenues en envoyant un courriel à communication.dinum@modernisation.gouv.fr en indiquant le nom du document concerné et/ou les informations que vous souhaiteriez obtenir. Les informations demandées vous seront transmises dans les plus bref délais.',
	contact:
		'Vous pouvez nous aider à améliorer l’accessibilité du site en nous signalant les problèmes éventuels que vous rencontrez. Pour ce faire, envoyez-nous un courriel à communication.dinum@modernisation.gouv.fr.',
	defenderOfRightsIntro:
		"Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits. Plusieurs moyens sont à votre disposition :",
	defenderOfRights: {
		phone:
			"un numéro de téléphone : le 09 69 39 00 00 du lundi au vendredi de 8h00 à 20h00 (coût d'un appel local)",
		postal:
			'une adresse postal (envoi de courrier gratuit, ne pas mettre de timbre) : Défenseur des droits - Libre réponse 71120 - 75342 Paris CEDEX 07'
	}
};
