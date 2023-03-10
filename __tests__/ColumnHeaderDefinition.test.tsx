import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ColumnHeaderDefinition } from '../components/table/ColumnHeaderDefinition';

test('loads and display Satisfaction Usagers', async () => {
	// ARRANGE
	render(
		<ColumnHeaderDefinition
			text={
				<>
					Satisfaction <br /> Usagers
				</>
			}
			icon="fr-icon-computer-line"
		/>
	);

	// ACT
	await screen.findByRole('text');

	// ASSERT
	expect(screen.getByRole('text')).toHaveTextContent('Satisfaction Usagers');
});
