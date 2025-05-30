import { tss } from 'tss-react';
import { useEffect, useState } from 'react';
import { Select } from '@codegouvfr/react-dsfr/Select';
import { fr } from '@codegouvfr/react-dsfr';

type Option = {
	label: string;
	value: string | number;
	href?: string;
	group?: string;
};

type Props = {
	options: Option[];
	defaultValue?: string | number;
	onChange?(value: string | number, href?: string): void;
	triggerValue?: string | number;
	placeholder?: string;
	superLight?: boolean;
	label: string;
	id?: string;
	className?: string;
	size?: 'small' | 'medium';
	optgroup?: boolean;
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
		optgroup,
		label,
		id
	} = props;

	const { classes, cx } = useStyles();

	const [value, setValue] = useState<string | number>(
		defaultValue ? defaultValue : ''
	);

	const optionsGrouped = options.reduce((acc, opt) => {
		if (optgroup && opt.group) {
			if (!acc[opt.group]) acc[opt.group] = [];
			acc[opt.group].push(opt);
		}
		return acc;
	}, {} as { [key: string]: Option[] });

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
			{optgroup
				? Object.entries(optionsGrouped)
						.sort(([a], [b]) => parseInt(b) - parseInt(a))
						.map(([key, group]) => (
							<optgroup key={`optgroup-${key}`} label={key}>
								{group.map(opt => (
									<option key={`key-${opt.value}`} value={opt.value}>
										{opt.label}
									</option>
								))}
							</optgroup>
						))
				: options.map(opt => (
						<option key={`key-${opt.value}`} value={opt.value}>
							{opt.label}
						</option>
				  ))}
		</Select>
	);
}

const useStyles = tss.withName(LightSelect.name).create(() => ({
	root: {
		['select']: {
			width: 'auto',
			backgroundColor: 'transparent',
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
			fontWeight: 'bold',
			boxShadow: 'none',
			border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
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
			paddingRight: fr.spacing('4v'),
			...fr.typography[18].style,
			marginBottom: 0
		}
	}
}));
