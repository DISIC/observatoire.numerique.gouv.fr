import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useEffect, useState } from 'react';
import { Select } from '@codegouvfr/react-dsfr/Select';
import { fr } from '@codegouvfr/react-dsfr';

type Props = {
	options: { label: string; value: string | number }[];
	defaultValue?: string | number;
	onChange?(value: string | number): void;
	placeholder?: string;
};

export function LightSelect(props: Props) {
	const { onChange, options, placeholder, defaultValue } = props;

	const { classes, cx } = useStyles();

	const [value, setValue] = useState<string | number>(
		defaultValue ? defaultValue : ''
	);

	useEffect(() => {
		if (value !== undefined && !!onChange) onChange(value);
	}, [value, onChange]);

	return (
		<Select
			label=""
			className={cx(classes.root)}
			nativeSelectProps={{
				onChange: event => setValue(event.target.value),
				value
			}}
		>
			{placeholder && (
				<option value="" disabled hidden>
					{placeholder}
				</option>
			)}
			{options.map(opt => (
				<option key={`key-${opt.value}`} value={opt.value}>
					{opt.label}
				</option>
			))}
		</Select>
	);
}

const useStyles = makeStyles()(theme => ({
	root: {
		['select']: {
			width: 'auto',
			backgroundColor: 'transparent',
			color: theme.decisions.background.actionHigh.blueFrance.default,
			fontWeight: 'bold',
			boxShadow: 'none',
			...fr.typography[20].style,
			padding: fr.spacing('2v'),
			paddingRight: fr.spacing('10v')
		}
	}
}));
