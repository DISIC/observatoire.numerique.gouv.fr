import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';

export type TableViewProps = {
	headers: string[];
	rows: {
		title?: string;
		description?: string;
		cells: Record<string, string>;
	}[];
	hidden?: boolean;
	tableId?: string;
};

const TableView = ({ headers, rows = [], hidden, tableId }: TableViewProps) => {
	const { classes, cx } = useStyles();

	const displayRows = () => {
		return rows.map((row, index) => (
			<tr key={`${row.title}_${index}`}>
				{row.title && (
					<td style={{ textAlign: 'left' }}>
						{row.title}
						{row.description && <p>{row.description}</p>}
					</td>
				)}
				{Object.keys(row.cells).map((key, indexC) => (
					<td
						key={`${row.title}_${index}_${key}_${indexC}`}
						title={row.cells[key]?.toString()}
					>
						{row.cells[key]}
					</td>
				))}
			</tr>
		));
	};

	return (
		<div className={cx(classes.tableContainer, hidden && classes.hiddenTable)}>
			<table className={cx(fr.cx('fr-table'), classes.table)} id={tableId}>
				<thead>
					<tr>
						{headers.map((h, index) =>
							index === 0 && h !== '' ? (
								<th
									scope="row"
									key={`${h}_${index}`}
									style={{ textAlign: 'left' }}
								>
									{h}
								</th>
							) : (
								<th scope="col" key={`${h}_${index}`}>
									{h}
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
				td: {
					'&:first-of-type': {
						fontWeight: 'bold',
						paddingLeft: '1rem'
					},
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
