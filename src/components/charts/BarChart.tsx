import { RecordData } from '@/utils/data-viz';
import React from 'react';
import { BarChart, ResponsiveContainer } from 'recharts';

type BarChartProps = {
	data?: RecordData['data'];
};

const CustomBarChart = ({ data }: BarChartProps) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart role="img" data={data}></BarChart>
		</ResponsiveContainer>
	);
};

export default CustomBarChart;
