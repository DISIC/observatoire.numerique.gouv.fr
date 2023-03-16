import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IndicatorLabel } from './IndicatorLabel';

type TestProps = {
	label: string;
	color: 'blue' | 'red' | 'orange' | 'green' | 'gray';
	noBackground?: boolean;
	find: {
		text: string;
		color: string;
		backgroundColor: string;
	};
};

const indicatorLabelTests: TestProps[] = [
	{
		label: 'Oui',
		color: 'green',
		find: { text: 'Oui', color: '#18753C', backgroundColor: '#B8FEC9' }
	},
	{
		label: 'Démarche Proactive',
		color: 'blue',
		find: {
			text: 'Démarche Proactive',
			color: '#0063CB',
			backgroundColor: '#E8EDFF'
		}
	},
	{
		label: 'Non',
		color: 'red',
		find: {
			text: 'Non',
			color: '#CE0500',
			backgroundColor: '#FFE9E9'
		}
	},
	{
		label: 'Totale',
		color: 'gray',
		find: {
			text: 'Totale',
			color: '#3A3A3A',
			backgroundColor: '#F6F6F6'
		}
	},
	{
		label: 'En cours',
		color: 'gray',
		noBackground: true,
		find: {
			text: 'En cours',
			color: '#3A3A3A',
			backgroundColor: 'transparent'
		}
	}
];

indicatorLabelTests.forEach(ilt => {
	test(`loads and display "${ilt.label} / ${ilt.color}" indicator label`, async () => {
		// ARRANGE
		render(
			<IndicatorLabel
				label={ilt.label}
				color={ilt.color}
				noBackground={ilt.noBackground ?? false}
			/>
		);

		// ACT
		await screen.findByRole('text');

		// ASSERT
		expect(screen.getByRole('text')).toHaveTextContent(ilt.find.text);
		expect(screen.getByRole('text')).toHaveStyle(
			`background-color: ${ilt.find.backgroundColor}`
		);
		expect(screen.getByRole('text')).toHaveStyle(`color: ${ilt.find.color}`);
	});
});
