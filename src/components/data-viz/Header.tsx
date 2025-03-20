import Button from '@codegouvfr/react-dsfr/Button';
import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import { tss } from 'tss-react';
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox';
import { fr } from '@codegouvfr/react-dsfr';
import { DataVizKind } from '@/pages/data-viz';

type DataVizTabHeaderProps = {
	dataVisualitionKind: DataVizKind;
	// give me the set type for useState
	setDataVisualitionKind: any;
};

const DataVizTabHeader = ({
	dataVisualitionKind,
	setDataVisualitionKind
}: DataVizTabHeaderProps) => {
	const { classes, cx } = useStyles();
	return (
		<div className={cx(classes.root)}>
			<SearchBar onButtonClick={function noRefCheck() {}} />
			<Checkbox
				options={[
					{
						label: 'Objectif',
						nativeInputProps: {
							name: 'checkboxes-1',
							value: 'value1'
						}
					},
					{
						label: 'Moyenne interministérielle',
						nativeInputProps: {
							name: 'checkboxes-1',
							value: 'value2'
						}
					}
				]}
				orientation="horizontal"
				state="default"
				className={cx(classes.checkboxWrapper)}
				small
			/>
			<div className={cx(classes.buttonsGroup)}>
				<Button
					iconId="fr-icon-checkbox-circle-line"
					onClick={() => setDataVisualitionKind('radar')}
					priority={dataVisualitionKind === 'radar' ? 'primary' : 'secondary'}
					title="Radar"
				/>
				<Button
					iconId="ri-table-line"
					onClick={() => setDataVisualitionKind('table')}
					priority={dataVisualitionKind === 'table' ? 'primary' : 'secondary'}
					title="Table"
				/>
			</div>
		</div>
	);
};

const useStyles = tss.withName(DataVizTabHeader.name).create(() => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: fr.spacing('6v')
	},
	checkboxWrapper: {
		marginBottom: 0,
		'& > .fr-fieldset__content': {
			marginTop: 0
		}
	},
	buttonsGroup: {
		display: 'flex',
		gap: fr.spacing('2v')
	}
}));

export default DataVizTabHeader;
