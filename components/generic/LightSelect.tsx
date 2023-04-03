import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useEffect, useState } from 'react';
import { Select } from '@codegouvfr/react-dsfr/Select';
import { fr } from '@codegouvfr/react-dsfr';

type Props = {
	options: { label: string; value: string | number; href?: string }[];
	defaultValue?: string | number;
	onChange?(value: string | number, href?: string): void;
	placeholder?: string;
	superLight?: boolean;
};

export function LightSelect(props: Props) {
	const { onChange, options, placeholder, defaultValue, superLight } = props;

	const { classes, cx } = useStyles();

	const [value, setValue] = useState<string | number>(
		defaultValue ? defaultValue : ''
	);

	useEffect(() => {
		if (value !== undefined && !!onChange)
			onChange(value, options.find(_ => _.value === value)?.href);
	}, [value, onChange, options]);

	return (
		<Select
			label=""
			className={cx(classes.root, superLight ? classes.rootSuperLight : {})}
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
			border: `1px solid ${theme.decisions.border.default.grey.default}`,
			...fr.typography[20].style,
			padding: fr.spacing('3v'),
			paddingLeft: fr.spacing('6v'),
			paddingRight: fr.spacing('10v'),
			borderRadius: 0,
			[fr.breakpoints.down('lg')]: {
				...fr.typography[19].style,
				padding: fr.spacing('2v'),
				paddingLeft: fr.spacing('4v'),
				paddingRight: fr.spacing('8v')
			}
		}
	},
	rootSuperLight: {
		['select']: {
			paddingTop: 0,
			paddingLeft: 0,
			paddingBottom: 0,
			fontWeight: 500,
			border: 0,
			...fr.typography[19].style
		}
	}
}));
