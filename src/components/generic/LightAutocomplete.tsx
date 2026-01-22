import { Autocomplete } from '@mui/material';
import { useState } from 'react';

type LightAutocompleteProps = {
	id: string;
	label: string;
	options: { label: string; value: string }[];
	value: string;
	onSelect: (value: string) => void;
	emptyText?: string;
	className?: string;
};

const LightAutocomplete = (props: LightAutocompleteProps) => {
	const { id, options, label, value, onSelect, emptyText, className } = props;

	const [inputValue, setInputValue] = useState(value);

	return (
		<Autocomplete
			id={id}
			disablePortal
			className={className}
			sx={{ width: '100%' }}
			options={options}
			getOptionLabel={option => option.label}
			noOptionsText={emptyText || 'Aucune option'}
			inputValue={inputValue}
			onChange={(_, newValue) => newValue && onSelect(newValue.value)}
			onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
			renderInput={params => (
				<div ref={params.InputProps.ref}>
					<label htmlFor={id} className="fr-label">
						{label}
					</label>
					<input
						{...params.inputProps}
						className={params.inputProps.className + ' fr-input'}
						placeholder="Sélectionner une option"
						type="search"
					/>
				</div>
			)}
		/>
	);
};

export default LightAutocomplete;
