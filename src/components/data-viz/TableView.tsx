import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip';

export type TableViewProps = {
	headers: { name: string; description: string }[];
	rows: {
		title?: string;
		description?: string;
		cells: Record<string, string>;
	}[];
	hidden?: boolean;
	tableId?: string;
	title: string;
};

const TableView = ({
	headers,
	rows = [],
	hidden,
	tableId,
	title
}: TableViewProps) => {
	const { classes, cx } = useStyles();

	const displayRows = () => {
		return rows.map((row, index) => (
			<tr key={`${row.title}_${index}`}>
				{row.title && (
					<th scope="row" style={{ textAlign: 'left' }}>
						{row.title}
						{row.description && <p>{row.description}</p>}
					</th>
				)}
				{Object.keys(row.cells).map((key, indexC) => (
					<td key={`${row.title}_${index}_${key}_${indexC}`}>
						{row.cells[key]}
					</td>
				))}
			</tr>
		));
	};

	return (
		<div className={cx(classes.tableContainer, hidden && classes.hiddenTable)}>
			<table className={cx(fr.cx('fr-table'), classes.table)} id={tableId}>
				<caption className={fr.cx('fr-sr-only')}>{title}</caption>
				<thead>
					<tr>
						{headers.map((h, index) =>
							index === 0 && h.name !== '' ? (
								<th scope="col" key={`${h.name}_${index}`}>
									<span className={fr.cx('fr-sr-only')}>{h.name}</span>
								</th>
							) : (
								<th scope="col" key={`${h.name}_${index}`}>
									{h.name}
									{h.description && (
										<span className={fr.cx('fr-ml-0-5v')}>
											<Tooltip kind="hover" title={h.description} />
										</span>
									)}
								</th>
							)
						)}
					</tr>
				</thead>
				<tbody>{displayRows()}</tbody>
			</table>
		</div>
	);
};

const useStyles = tss.create({
	tableContainer: {
		overflowX: 'auto',
		width: '100%'
	},
	hiddenTable: {
		position: 'absolute',
		left: '-9999px',
		visibility: 'hidden',
		opacity: 0,
		pointerEvents: 'none'
	},
	table: {
		textAlign: 'center',
		...fr.typography[18].style,
		width: '100%',
		borderCollapse: 'collapse',
		margin: 0,
		th: {
			padding: ' 0 2rem',
			minWidth: '9rem',
			'&:first-of-type': {
				minWidth: '12rem'
			}
		},
		thead: {
			background: fr.colors.decisions.background.contrast.grey.default,
			tr: {
				borderBottom: '2px solid black',
				th: {
					'&:first-of-type': {
						fontWeight: 'bold',
						paddingLeft: '1rem'
					}
				}
			}
		},
		tbody: {
			tr: {
				':nth-of-type(even)': {
					backgroundColor: fr.colors.decisions.background.contrast.grey.default
				},
				':nth-of-type(odd)': {
					backgroundColor: fr.colors.decisions.background.default.grey.hover
				},
				th: {
					fontWeight: 'bold',
					paddingLeft: '1rem'
				},
				td: {
					p: {
						...fr.typography[17].style,
						fontWeight: 'normal'
					}
				}
			}
		},
		'td, th': {
			padding: '1.25rem 0.5rem'
		}
	}
});

export default TableView;
