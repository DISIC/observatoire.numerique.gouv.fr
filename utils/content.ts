interface Section {
	blocks: string[];
}
interface SecondPart {
	title: string;
	sections: {
		[key: string]: Section;
	};
}

interface Block {
	title?: string;
	content: string[] | string[][];
}

interface LegalNoticeSections {
	[key: string]: Block;
}

interface LegalNotice {
	title: string;
	sections: LegalNoticeSections;
}

export const CGU = {
	title: "Conditions générales d'utilisation",
	firstPart: {
		subtitle: 'Conditions d’utilisation',
		firstBlock:
			"Ce site permet de suivre l’avancée et la qualité de la dématérialisation des 250 démarches phares de l'État. Il met à disposition les données précises sur l’offre de services dématérialisés aux usagers et présente des indicateurs de qualité concrets mis à jour tous les 3 mois.",
		secondBlock:
			'Il permet également aux usagers de donner leurs avis sur les démarches en ligne qu’ils viennent d’effectuer, et en affiche les résultats de manière transparente. Un bouton/lien situé à la fin de la démarche permet d’accéder à ce service.',
		thirdBlock: {
			firstBlock:
				'Lorsque vous donnez un avis détaillé sur une démarche (espace d’expression libre), nous vous prions de :',
			secondBlock: [
				'ne pas nous communiquer d’informations personnelles, permettant de vous identifier ou d’identifier une autre personne (identité, date de naissance, adresse, courriel, y compris professionnel, identifiant administratif, etc.) ;',
				'ne pas inclure d’insultes ou de propos dénigrants ou diffamatoires à l’encontre d’une personne.'
			]
		},
		fourthBlock:
			'Vous ne pouvez en tant qu’usager ou accompagnant évaluer qu’une seule fois la démarche. Vous pouvez néanmoins formuler un nouvel avis à chaque fois que vous effectuez à nouveau la même démarche.',
		fifthBlock: {
			firstBlock:
				"L'adresse URL qui permet d'accéder au service Vos démarches essentielles est la suivante :",
			url1: 'https://observatoire.numerique.gouv.fr',
			secondBlock:
				"L'adresse URL vers laquelle sont dirigés les usagers qui donnent leurs avis à la fin d'une démarche est la suivante dépend de la démarche en question mais commence systématiquement par : ",
			url2: 'https://jedonnemonavis.numerique.gouv.fr'
		}
	},
	secondPart: {
		title: 'Vie privée',
		sections: {
			"Informations de connexion et d'appareil": {
				blocks: [
					"Lorsque vous donnez votre avis sur une démarche administrative sur le site, nous recevons des informations relatives à votre ordinateur, téléphone ou autre outil que vous utilisez pour accéder à MonAvis. Nous pouvons par exemple avoir accès à votre adresse IP, ou aux URLs d'entrée ou de sortie. Le volume d'information recueillie dépend de la configuration de votre appareil et de votre navigateur.",
					"Nous stockons votre adresse IP de façon temporaire pour des raisons d'analyse technique, et nous ne la partageons avec aucun partenaire autre que les prestataires techniques ayant des engagements de confidentialité."
				]
			},
			Cookies: {
				blocks: [
					'Nous collectons des données anonymes d’audience du site, dans le respect des conditions définies par la recommandation « Cookies » de la Commission nationale informatique et libertés (CNIL).',
					'L’outil de mesure d’audience que nous utilisons (Matomo) est paramétré de façon à ce que les informations recueillies soient anonymisées.'
				]
			},
			'Vos données à caractère personnel': {
				blocks: [
					'Conformément aux dispositions de la loi n° 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, vous disposez d’un droit d’accès, de modification, de rectification et de suppression des données qui vous concernent. Pour demander une modification, rectification ou suppression des données vous concernant, il vous suffit de nous écrire par voie électronique à contact@design.numerique.gouv.fr ou postale à la Direction interministérielle du numérique (DINUM), 20, avenue de Ségur, 75007 Paris en justifiant de votre identité. Si vous estimez, après nous avoir contactés, que vos droits Informatique et Libertés ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL.'
				]
			},
			'Refuser le suivi de votre navigation': {
				blocks: [
					'Malgré tout, si vous le souhaitez, vous avez la possibilité de refuser que votre navigation sur notre site soit enregistrée, en cochant la case ci-dessous.',
					`Vous n'êtes pas suivi car votre navigateur signale que vous ne le souhaitez pas. Il s'agit d'un paramètre de votre navigateur, vous ne pourrez donc pas vous inscrire tant que vous n'aurez pas désactivé la fonction "Ne pas suivre".`
				]
			}
		}
	} as SecondPart
};

export const LegalNotice: LegalNotice = {
	title: 'Mentions légales',
	sections: {
		Éditeur: {
			content: [
				'Direction interministérielle du numérique (DINUM)',
				'20 Avenue de Ségur',
				'75007 PARIS'
			]
		},
		'Directrice de la publication': {
			content: [
				'Stéphanie Schaer, Directrice Interministérielle du Numérique (DINUM).'
			]
		},
		"Prestataires d'hébergement": {
			title: 'XWiki SAS',
			content: [
				[
					'RCS Paris n° 477 865 281',
					'Code APE : 6311Z',
					'N°TVA : FR 69 477 865 281',
					'Siège social : XWiki SAS, 35/37 rue Beaubourg',
					'75003 Paris',
					'France'
				],
				[
					'OVH',
					'RCS Roubaix – Tourcoing 424 761 419 00045',
					'Code APE 6202A',
					'N° TVA : FR 22 424 761 419',
					'Siège social : 2 rue Kellermann',
					'59100 Roubaix',
					'France'
				]
			]
		}
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
