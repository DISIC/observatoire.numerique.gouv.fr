import React from 'react';
import { fr } from '@codegouvfr/react-dsfr';
import { tss } from 'tss-react';
import { RecordData } from '@/utils/data-viz';

type TableViewProps = {
	headers: string[];
	data: RecordData[];
};

const TableView = ({ headers, data }: TableViewProps) => {
	const { classes, cx } = useStyles();

	const cells = data.map(item => {
		return item.data.reduce((acc, current) => {
			acc[current.slug] = current.score;
			return acc;
		}, {} as Record<string, string | number>);
	});

	let rows = data.map(item => item.text);

	const displayCellValue = (
		cell: Record<string, string | number>,
		key: string,
		dataIndex: number
	) => {
		const value = parseInt((((cell[key] as number) || 0) * 10).toString()) / 10;
		const attachedValue = data[dataIndex]?.data.find(
			d => d.slug === key
		)?.score;

		if (attachedValue) {
			return Math.round(value) + `%`;
		}

		return Math.round(value * 100) / 100;
	};

	const displayRows = () => {
		return rows.map((r, index) => (
			<tr key={`${r}_${index}`}>
				<td>{r}</td>
				{Object.keys(cells[index]).map((key, indexC) => (
					<td
						key={`${r}_${index}_${key}_${indexC}`}
						title={cells[index][key]?.toString()}
					>
						{displayCellValue(cells[index], key, index)}
					</td>
				))}
			</tr>
		));
	};

	return (
		<div className={cx(classes.tableContainer)}>
			<table className={cx(fr.cx('fr-table'), classes.table)}>
				<thead>
					<tr>
						{headers.map((h, index) =>
							index === 0 && h !== '' ? (
								<th scope="row" key={`${h}_${index}`}>
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
	table: {
		textAlign: 'center',
		...fr.typography[17].style,
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
				borderBottom: '2px solid black'
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
						fontWeight: 'bold'
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
