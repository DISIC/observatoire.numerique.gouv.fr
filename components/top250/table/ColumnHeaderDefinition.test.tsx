import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ColumnHeaderDefinition } from './ColumnHeaderDefinition';

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
			infos={{
				title: 'Satisfaction Usagers',
				content:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisl, duis ac egestas donec tincidunt lorem. Sodales risus amet nisl sed. Vitae bibendum et penatibus a eget ipsum mattis pharetra. Diam molestie vitae, diam, sed tincidunt facilisi. Arcu faucibus mattis varius pretium. Duis ullamcorper malesuada massa ipsum sit. Ornare donec sit lobortis nullam dictum ullamcorper ac. Congue erat lorem quam amet sagittis egestas lorem. Arcu, nisl, massa eu, a nulla fusce egestas vitae. Mi tortor, penatibus auctor in nisl enim velit pellentesque. Consectetur urna, eleifend non congue dolor adipiscing nec. Ipsum laoreet dui facilisis pellentesque lacus.'
			}}
		/>
	);

	// ACT
	await screen.findByRole('text');

	// ASSERT
	expect(screen.getByRole('text')).toHaveTextContent('Satisfaction Usagers');
});
