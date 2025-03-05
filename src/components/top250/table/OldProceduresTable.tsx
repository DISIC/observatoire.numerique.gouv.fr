import { fr } from '@codegouvfr/react-dsfr';
import { IndicatorColor, OldProcedure } from '@prisma/client';
import { IndicatorLabel } from './IndicatorLabel';
import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { oldDefaultSort } from '@/pages/observatoire/old/[slug]';
import { tss } from 'tss-react';

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
				'En cours': 'green',
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
				? `${sort.includes('asc') ? `${key}:desc` : oldDefaultSort}`
				: `${key}:asc`
		);

	if (!procedures.length)
		return (
			<p className={classes.noProcedure} role="status">
				Aucune démarche trouvée pour cette recherche...
			</p>
		);

	const headerKeys = [
		'title',
		'statutDemat',
		'satisfactionIndex_value',
		'accessibilityScore_display',
		'qualiteSupport',
		'adapteMobile_display',
		'franceConnect_display',
		'ditesLeNousUneFois_value',
		'urlScore_value'
	];

	const headerTexts = [
		'Les démarches',
		'Réalisable en ligne',
		'Usagers Satisfaits (/10)',
		'Prise en compte handicaps',
		'Aide joignable',
		'Compatible mobile',
		'Intégration FranceConnect',
		'Dites-le nous une fois',
		'Disponibilité et rapidité'
	];

	const cellsKeys = [
		'statutDemat',
		'satisfactionIndex_display',
		'accessibilityScore_display',
		'qualiteSupport',
		'adapteMobile_display',
		'franceConnect_display',
		'ditesLeNousUneFois_display',
		'urlScore_display'
	];

	return (
		<div className={fr.cx('fr-table')}>
			<table className={cx(classes.table)}>
				<thead>
					<tr>
						{headerTexts.map((header, i) => (
							<th
								key={i}
								onClick={handleSort(headerKeys[i])}
								className={cx(
									sort.includes(headerKeys[i]) ? classes.sortedHeader : ''
								)}
							>
								{header}{' '}
								{sort.includes(headerKeys[i]) && (
									<span
										className={cx(
											classes.sortIcon,
											sort.includes('asc')
												? 'fr-icon-arrow-down-s-fill'
												: 'fr-icon-arrow-up-s-fill'
										)}
									></span>
								)}
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
								<br />
								<span>
									Volumétrie totale : {procedure.volumetrie_display} (
									{procedure.pourcentageRecoursVoieDematerialisee_display} en
									ligne)
								</span>
							</th>
							{cellsKeys.map((attr, i) => {
								let fieldAttrType: 'number' | 'dlnuf' | 'text' | undefined =
									'text';
								if (
									attr.includes('satisfactionIndex_display') ||
									attr.includes('urlScore_display')
								)
									fieldAttrType = 'number';
								else if (attr.includes('UneFois')) fieldAttrType = 'dlnuf';

								const procedureJdmaLink = `https://observatoire.numerique.gouv.fr/${procedure.xwiki_id
									.split('.')
									.join('/')}?view-mode=statistics&date-debut=${procedure.jdma_start_date
									}&date-fin=${procedure.jdma_end_date}`;
								const hasLink =
									attr === 'satisfactionIndex_display' &&
									(procedure.satisfactionIndex_value || -1) >= 0;

								const displayAccessibilityScore =
									attr === 'accessibilityScore_display' &&
									!!procedure.rgaaCompliancyLevel_value;

								return (
									<td key={i} style={{ position: 'relative' }}>
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
										{hasLink && procedure.jdma_start_date && (
											<Link
												href={procedureJdmaLink}
												className={cx(fr.cx('fr-text--xs'), classes.smallLinks)}
												target="_blank"
											>
												Graphes
											</Link>
										)}
										{attr === 'statutDemat' && procedure.urlDemarche && (
											<Link
												href={procedure.urlDemarche}
												className={cx(fr.cx('fr-text--xs'), classes.smallLinks)}
												target="_blank"
											>
												Voir
											</Link>
										)}
										{displayAccessibilityScore && (
											<span
												className={cx(fr.cx('fr-text--xs'), classes.smallLinks)}
											>
												{procedure.rgaaCompliancyLevel_display}
											</span>
										)}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const useStyles = tss.withName(OldProceduresTable.name).create(() => ({
	table: {
		paddingTop: fr.spacing('10v'),
		['thead th']: {
			cursor: 'pointer',
			position: 'relative',
			':hover': {
				opacity: '0.7'
			}
		},
		['thead th:not(:first-of-type)']: {
			...fr.typography[17].style
		},
		['thead th:first-of-type']: {
			...fr.typography[20].style
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
			},
			span: {
				...fr.typography[17].style,
				fontWeight: 'normal',
				color: '#666'
			}
		},
		['tbody td']: {
			width: '8.5em'
		},
		['tbody tr']: {
			height: '130px'
		}
	},
	noProcedure: {
		padding: fr.spacing('30v'),
		textAlign: 'center',
		fontWeight: 'bold'
	},
	smallLinks: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translateX(-50%)translateY(-50%)',
		marginTop: '1.8rem',
		'::after': {
			display: 'none'
		}
	},
	sortIcon: {
		position: 'absolute',
		right: '5px',
		top: '5px'
	},
	sortedHeader: {
		paddingRight: '3rem'
	}
}));
