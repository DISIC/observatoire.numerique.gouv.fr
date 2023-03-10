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
