import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const renderCustomizedLabel = () => null;
const QmsEmployeePerformanceChart = ({ data, hoveredIndex, setHoveredIndex }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    label={renderCustomizedLabel}
                    labelLine={false}
                    onMouseEnter={(_, index) => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    paddingAngle={5}
                    cornerRadius={10}
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};
export default QmsEmployeePerformanceChart
