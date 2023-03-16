import { ColumnHeaderDefinition } from '@/components/table/ColumnHeaderDefinition';
import { IndicatorLabel } from '@/components/table/IndicatorLabel';
import { fr } from '@codegouvfr/react-dsfr';

export default function Home() {
	return (
		<div className={fr.cx('fr-container')}>
			<h1>Home</h1>
			{/* TESTING */}
			<div style={{ display: 'flex', justifyContent: 'space-around' }}>
				<ColumnHeaderDefinition
					text={
						<>
							Réalisable
							<br />
							en ligne
						</>
					}
					icon="fr-icon-computer-line"
					infos={{
						title: 'Réalisable en ligne',
						content:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, duis ac egestas donec tincidunt lorem. Sodales risus amet nisl sed. Vitae bibendum et penatibus a eget ipsum mattis pharetra. Diam molestie vitae, diam, sed tincidunt facilisi. Arcu faucibus mattis varius pretium. Duis ullamcorper malesuada massa ipsum sit. Ornare donec sit lobortis nullam dictum ullamcorper ac. Congue erat lorem quam amet sagittis egestas lorem. Arcu, nisl, massa eu, a nulla fusce egestas vitae. Mi tortor, penatibus auctor in nisl enim velit pellentesque. Consectetur urna, eleifend non congue dolor adipiscing nec. Ipsum laoreet dui facilisis pellentesque lacus.'
					}}
				/>
				<ColumnHeaderDefinition
					text={
						<>
							Satisfaction
							<br />
							Usagers
						</>
					}
					icon="ri-user-smile-line"
					infos={{
						title: 'Satisfaction Usagers',
						content:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, duis ac egestas donec tincidunt lorem. Sodales risus amet nisl sed. Vitae bibendum et penatibus a eget ipsum mattis pharetra. Diam molestie vitae, diam, sed tincidunt facilisi. Arcu faucibus mattis varius pretium. Duis ullamcorper malesuada massa ipsum sit. Ornare donec sit lobortis nullam dictum ullamcorper ac. Congue erat lorem quam amet sagittis egestas lorem. Arcu, nisl, massa eu, a nulla fusce egestas vitae. Mi tortor, penatibus auctor in nisl enim velit pellentesque. Consectetur urna, eleifend non congue dolor adipiscing nec. Ipsum laoreet dui facilisis pellentesque lacus.'
					}}
				/>
				<ColumnHeaderDefinition
					text={
						<>
							Prise en compte
							<br />
							du handicaps
						</>
					}
					icon="ri-user-heart-line"
					infos={{
						title: 'Prise en compte du handicaps',
						content:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, duis ac egestas donec tincidunt lorem. Sodales risus amet nisl sed. Vitae bibendum et penatibus a eget ipsum mattis pharetra. Diam molestie vitae, diam, sed tincidunt facilisi. Arcu faucibus mattis varius pretium. Duis ullamcorper malesuada massa ipsum sit. Ornare donec sit lobortis nullam dictum ullamcorper ac. Congue erat lorem quam amet sagittis egestas lorem. Arcu, nisl, massa eu, a nulla fusce egestas vitae. Mi tortor, penatibus auctor in nisl enim velit pellentesque. Consectetur urna, eleifend non congue dolor adipiscing nec. Ipsum laoreet dui facilisis pellentesque lacus.'
					}}
				/>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					marginTop: '4rem'
				}}
			>
				<IndicatorLabel label="Démarche Proactive" color="blue" />
				<IndicatorLabel label="Non" color="red" />
				<IndicatorLabel label="Mauvais" color="red" />
				<IndicatorLabel label="Moyen" color="orange" />
				<IndicatorLabel label="Oui" color="green" />
				<IndicatorLabel label="Très bon" color="green" />
				<IndicatorLabel label="Faible" color="gray" />
			</div>
		</div>
	);
}
