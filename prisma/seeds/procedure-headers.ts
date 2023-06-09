export const procedureHeaders = [
	{
		slug: 'online',
		label: 'Réalisable en ligne',
		icon: 'ri-computer-line',
		description:
			'Permet d’évaluer si le service est entièrement disponible et réalisable en version numérique et en ligne.',
		description_full: `
			<p><strong>Évalue si le service est numérisé.</strong></p>
			<p>Cet indicateur permet de mesurer la numérisation des services en répondant à trois questions :</p>
			<ul>
				<li>Le service est-il entièrement numérique ?</li>
				<li>Est-il disponible sur tout le territoire français ?</li>
				<li>Est-il ouvert à tous ?</li>
			</ul>
			<br/>
			<p>L’évaluation est réalisée de la manière suivante :</p>
			<ul>
				<li>Oui : le service est intégralement utilisable numériquement et disponible sur l’intégralité du territoire français.</li>
				<li>Proactif : le service octroie automatiquement les droits aux personnes concernées.</li>
				<li>En cours de déploiement local : le service n’est pas encore disponible sur l’intégralité du territoire - les collectivités sont responsables de son déploiement.</li>
				<li>Partiel :  une partie du service n’est pas réalisable numériquement ou n’est pas disponible sur l’intégralité du territoire français, ou n’est ouvert qu’à une partie de la population</li>
				<li>Bêta : le service est en cours d’expérimentation sur un échantillon restreint d’utilisateurs ou de cas métier</li>
				<li>Non : le service n’est n’est pas numérisé</li>
			</ul>
			<br/>
			<p>D’où vient la donnée ?</p>
			<p>À compléter</p>
			`,
		position: 1
	},
	{
		slug: 'satisfaction',
		label: 'Satisfaction Usagers',
		icon: 'ri-emotion-happy-line',
		description:
			'Evalue le niveau de satisfaction du service, par les usagers. Avis recueilli grâce au bouton “je donne mons avis“.',
		description_full: `
			<p><strong>Évalue le niveau de satisfaction du service, par les usagers.</strong></p>
			<p>Cette note de satisfaction est calculée sur la base des avis déposés sur le service par les usagers.</p>
			<p>Pour calculer la note de satisfaction, nous réalisons une moyenne des réponses données à la question « Comment s’est passée cette démarche pour vous ? » en attribuant une note sur 10 à chaque option de réponses proposée dans le questionnaire :</p>
			<ul>
				<li>Le service est-il entièrement numérique ?</li>
				<li>Est-il disponible sur tout le territoire français ?</li>
				<li>Est-il ouvert à tous ?</li>
			</ul>
			<br/>
			<p>L’évaluation est réalisée de la manière suivante :</p>
			<ul>
				<li>Oui : le service est intégralement utilisable numériquement et disponible sur l’intégralité du territoire français.</li>
				<li>Proactif : le service octroie automatiquement les droits aux personnes concernées.</li>
				<li>En cours de déploiement local : le service n’est pas encore disponible sur l’intégralité du territoire - les collectivités sont responsables de son déploiement.</li>
				<li>Partiel :  une partie du service n’est pas réalisable numériquement ou n’est pas disponible sur l’intégralité du territoire français, ou n’est ouvert qu’à une partie de la population</li>
				<li>Bêta : le service est en cours d’expérimentation sur un échantillon restreint d’utilisateurs ou de cas métier</li>
				<li>Non : le service n’est n’est pas numérisé</li>
			</ul>
			<br/>
			<p>D’où vient la donnée ?</p>
			<p>À compléter</p>
		`,
		position: 2
	},
	{
		slug: 'handicap',
		label: 'Prise en compte du handicap',
		icon: 'ri-open-arm-line',
		description:
			"Mesure le niveau d’accessibilité numérique d’une démarche, en se basant sur le RGAA (Référentiel Général d'Amélioration de l'Accessibilité).",
		description_full:
			"Mesure le niveau d’accessibilité numérique d’une démarche, en se basant sur le RGAA (Référentiel Général d'Amélioration de l'Accessibilité).",
		position: 3
	},
	{
		slug: 'dlnuf',
		label: 'Dites-le-nous une fois',
		icon: 'ri-spam-line',
		description:
			"Simplifie les démarches des usagers, en leur évitant de fournir des informations ou des documents que l'Administration détient déjà.",
		description_full:
			"Simplifie les démarches des usagers, en leur évitant de fournir des informations ou des documents que l'Administration détient déjà.",
		position: 4
	},
	{
		slug: 'usage',
		label: 'Utilisation de la version numérique',
		icon: 'ri-direction-line',
		description:
			'Mesure le taux d’utilisation du service numérique, par rapport à l’utilisation tous canaux confondus',
		description_full:
			'Mesure le taux d’utilisation du service numérique, par rapport à l’utilisation tous canaux confondus',
		position: 5
	},
	{
		slug: 'simplicity',
		label: 'Simplicité du langage',
		icon: 'ri-sun-line',
		position: 6
	},
	{
		slug: 'help_reachable',
		label: 'Aide joignable et efficace',
		icon: 'ri-customer-service-2-line',
		position: 7
	},
	{
		slug: 'help_used',
		label: 'Niveau d’autonomie',
		icon: 'ri-chat-smile-line',
		position: 8
	},
	{
		slug: 'uptime',
		label: 'Disponibilité du service',
		icon: 'ri-rest-time-line',
		position: 9
	},
	{
		slug: 'performance',
		label: 'Temps de chargement des pages',
		icon: 'ri-timer-flash-line',
		position: 10
	},
	{
		slug: 'auth',
		label: 'Authentification',
		icon: 'ri-shield-user-line',
		position: 11
	}
];
