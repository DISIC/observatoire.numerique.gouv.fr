import Button from '@codegouvfr/react-dsfr/Button';
import SearchBar from '@codegouvfr/react-dsfr/SearchBar';
import { tss } from 'tss-react';
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox';
import { fr } from '@codegouvfr/react-dsfr';
import { DataVizKind } from '@/pages/data-viz';
import { Dispatch, SetStateAction } from 'react';

type DataVizTabHeaderProps = {
	dataVisualitionKind: DataVizKind;
	setDataVisualitionKind: Dispatch<SetStateAction<DataVizKind>>;
	setShowGoalRadar: Dispatch<SetStateAction<boolean>>;
	setShowCrossScorePerimeter: Dispatch<SetStateAction<boolean>>;
};

const DataVizTabHeader = ({
	dataVisualitionKind,
	setDataVisualitionKind,
	setShowGoalRadar,
	setShowCrossScorePerimeter
}: DataVizTabHeaderProps) => {
	const { classes, cx } = useStyles();
	return (
		<div className={cx(classes.root)}>
			<SearchBar onButtonClick={function noRefCheck() {}} />
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<Checkbox
					options={[
						{
							label: 'Objectif',
							nativeInputProps: {
								name: 'checkboxes-1',
								value: 'value1',
								onChange: e => setShowGoalRadar(e.target.checked)
							}
						}
					]}
					orientation="horizontal"
					state="default"
					className={cx(classes.checkboxWrapper, 'checkbox-green')}
					small
				/>
				<Checkbox
					options={[
						{
							label: 'Moyenne inter-périmètre',
							nativeInputProps: {
								name: 'checkboxes-1',
								value: 'value2',
								onChange: e => setShowCrossScorePerimeter(e.target.checked)
							}
						}
					]}
					orientation="horizontal"
					state="default"
					className={cx(classes.checkboxWrapper, 'checkbox-yellow')}
					small
				/>
			</div>
			<div className={cx(classes.buttonsGroup)}>
				<Button
					iconId="ri-pentagon-line"
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
