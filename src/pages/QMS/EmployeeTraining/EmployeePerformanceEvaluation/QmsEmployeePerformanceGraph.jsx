import React, { useState } from 'react';
import "./qmsgraph.css";
import print from '../../../../assets/images/Company Documentation/print.svg'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Anonymous', value: 4, color: '#00BFFF' },
    { name: 'Anonymous', value: 2, color: '#DC143C' },
    { name: 'Anonymous', value: 2, color: '#9370DB' },
    { name: 'Anonymous', value: 2, color: '#32CD32' },
];

// Empty function for label to remove the lines
const renderCustomizedLabel = () => null;

const QmsEmployeePerformanceGraph = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="p-5 bg-[#1C1C24] text-white rounded-lg">
            <div className='flex justify-between'>
                <h2 className="graph-head">Employee Performance Evaluation Graph</h2>
                <button className='border rounded-[4px] w-[46px] h-[42px] flex justify-center items-center'>
                    <img src={print} alt="Print" className='w-[18px] h-[18px]' />
                </button>
            </div>

            <div className="flex gap-4 mb-4">
                <select className="bg-gray-800 border border-gray-600 p-2 rounded text-white">
                    <option>Select Employee...</option>
                </select>
                <button className="bg-blue-600 px-4 py-2 rounded">Add Employee Performance Evaluation</button>
                <button className="bg-gray-700 px-4 py-2 rounded">List Employee Performance Evaluation</button>
                <button className="bg-gray-700 px-4 py-2 rounded">Click To See Evaluation In Detail</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
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
                </div>

                <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
                    <div className="mb-2 border-b border-gray-700 pb-1 flex justify-between">
                        <span className="text-gray-400">Question</span>
                        <span className="text-gray-400">Poll</span>
                    </div>
                    {data.map((entry, index) => (
                        <div
                            key={index}
                            className={`flex justify-between px-2 py-1 rounded transition duration-200 ${hoveredIndex === index ? 'bg-gray-700' : ''
                                }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <span style={{ color: entry.color }}>{entry.name}</span>
                            <span className="text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QmsEmployeePerformanceGraph