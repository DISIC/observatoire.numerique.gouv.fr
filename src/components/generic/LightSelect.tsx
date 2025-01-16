import { makeStyles } from '@codegouvfr/react-dsfr/tss';
import { useEffect, useState } from 'react';
import { Select } from '@codegouvfr/react-dsfr/Select';
import { fr } from '@codegouvfr/react-dsfr';

type Props = {
	options: { label: string; value: string | number; href?: string }[];
	defaultValue?: string | number;
	onChange?(value: string | number, href?: string): void;
	triggerValue?: string | number;
	placeholder?: string;
	superLight?: boolean;
	label: string;
	id?: string;
	className?: string;
	size?: 'small' | 'medium';
};

export function LightSelect(props: Props) {
	const {
		onChange,
		options,
		placeholder,
		defaultValue,
		triggerValue,
		superLight,
		className,
		size = 'medium',
		label,
		id
	} = props;

	const { classes, cx } = useStyles();

	const [value, setValue] = useState<string | number>(
		defaultValue ? defaultValue : ''
	);

	useEffect(() => {
		if (value !== undefined && !!onChange)
			onChange(value, options.find(_ => _.value === value)?.href);
	}, [value, onChange, options]);

	useEffect(() => {
		setValue(triggerValue ? triggerValue : '');
	}, [triggerValue]);

	return (
		<Select
			label={label}
			className={cx(
				classes.root,
				superLight ? classes.rootSuperLight : {},
				size === 'small' ? classes.rootSmall : {},
				className
			)}
			nativeSelectProps={{
				id,
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
		},

		['.fr-label']: {
			position: 'absolute',
			width: 1,
			height: 1,
			padding: 0,
			margin: -1,
			overflow: 'hidden',
			clip: 'rect(0, 0, 0, 0)',
			whiteSpace: 'nowrap',
			border: 0
		}
	},
	rootSmall: {
		['select']: {
			padding: fr.spacing('2v'),
			...fr.typography[18].style,
			marginBottom: 0
		}
	}
}));
