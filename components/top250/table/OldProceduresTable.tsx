import { fr } from '@codegouvfr/react-dsfr';
import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { IndicatorColor, OldProcedure } from '@prisma/client';
import { IndicatorLabel } from './IndicatorLabel';
import { Dispatch, SetStateAction } from 'react';

type Props = {
	procedures: OldProcedure[];
	sort: string;
	setSort: Dispatch<SetStateAction<string>>;
};

export const OldProceduresTable = ({ procedures, sort, setSort }: Props) => {
	const { classes, cx } = useStyles();

	const getColor = (
		value: string,
		type: 'text' | 'number' | 'dlnuf' = 'text'
	): IndicatorColor => {
		if (type === 'text') {
			return ({
				Oui: 'green',
				'En cours de déploiement local': 'green',
				Non: 'red',
				Partiel: 'orange'
			}[value] || 'gray') as IndicatorColor;
		} else if (type === 'number') {
			const num = parseInt(value);
			if (isNaN(num)) return 'gray';
			else if (num < 5) return 'red';
			else if (num < 8) return 'orange';
			else return 'green';
		} else {
			// DLNUF
			const num = parseInt(value);
			if (isNaN(num)) return 'gray';
			else if (num > 4) return 'red';
			else if (num >= 2) return 'orange';
			else return 'green';
		}
	};

	const handleSort = (key: string) => () =>
		setSort(
			sort.includes(key)
				? `${key}:${sort.includes('asc') ? 'desc' : 'asc'}`
				: `${key}:asc`
		);

	if (!procedures.length)
		return (
			<p className={classes.noProcedure} role="status">
				Aucune démarche trouvée pour cette recherche...
			</p>
		);

	return (
		<table className={cx(fr.cx('fr-table'), classes.table)}>
			<thead>
				<tr>
					{[
						'Les démarches',
						'Réalisable en ligne',
						'Usagers Satisfaits (/10)',
						'Prise en compte handicaps',
						'Aide joignable',
						'Compatible mobile',
						'Intégration FranceConnect',
						'Dites-le nous une fois',
						'Disponibilité et rapidité'
					].map((header, i) => (
						<th
							key={i}
							onClick={handleSort(
								[
									'title',
									'statutDemat',
									'satisfactionIndex_value',
									'accessibilityScore_display',
									'qualiteSupport',
									'adapteMobile_display',
									'franceConnect_display',
									'ditesLeNousUneFois_value',
									'urlScore_value'
								][i]
							)}
						>
							{header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{procedures.map(procedure => (
					<tr key={procedure.id}>
						<th className={fr.cx('fr-text--bold', 'fr-text--md')} scope="row">
							{procedure.title}
							<br />
							<small>{procedure.ministere}</small>
						</th>
						{[
							'statutDemat',
							'satisfactionIndex_display',
							'accessibilityScore_display',
							'qualiteSupport',
							'adapteMobile_display',
							'franceConnect_display',
							'ditesLeNousUneFois_display',
							'urlScore_display'
						].map((attr, i) => {
							let fieldAttrType: 'number' | 'dlnuf' | 'text' | undefined =
								'text';
							if (
								attr.includes('satisfactionIndex_display') ||
								attr.includes('urlScore_display')
							)
								fieldAttrType = 'number';
							else if (attr.includes('UneFois')) fieldAttrType = 'dlnuf';

							return (
								<td key={i}>
									<IndicatorLabel
										label={
											(procedure[attr as keyof OldProcedure] as string) || '-'
										}
										noBackground={['-', 'n/a'].includes(
											(procedure[attr as keyof OldProcedure] as string) || '-'
										)}
										color={getColor(
											(procedure[attr as keyof OldProcedure] as string) || '',
											fieldAttrType
										)}
										old
									/>
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
};

const useStyles = makeStyles()(theme => ({
	table: {
		['thead th']: {
			cursor: 'pointer'
		},
		['thead th:not(:first-of-type)']: {
			...fr.typography[17].style
		},
		['thead th:not(:first-of-type), tbody td']: {
			textAlign: 'center'
		},
		['tbody th']: {
			...fr.typography[20].style,
			small: {
				...fr.typography[18].style,
				fontWeight: 'normal',
				color: '#666'
			}
		},
		['tbody td']: {
			width: '8.5em'
		}
	},
	noProcedure: {
		padding: fr.spacing('30v'),
		textAlign: 'center',
		fontWeight: 'bold'
	}
}));
