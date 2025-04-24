import React, { useState } from 'react';
import './qmsgraph.css';
import print from '../../../../assets/images/Company Documentation/print.svg';
import QmsEmployeePerformanceChart from './QmsEmployeePerformanceChart';

const data = [
    { name: 'Anonymous', value: 4, color: '#1E84AF' },
    { name: 'Anonymous', value: 2, color: '#5EBB49' },
    { name: 'Anonymous', value: 2, color: '#F9E4FB' },
    { name: 'Anonymous', value: 2, color: '#CF3F34' },
];

const QmsEmployeePerformanceGraph = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="p-5 bg-[#1C1C24] text-white rounded-lg">
            <div className='flex justify-between border-b border-[#383840] pb-5'>
                <h2 className="graph-head">Employee Performance Evaluation Graph</h2>
                <button className='border rounded-[4px] w-[46px] h-[42px] flex justify-center items-center'>
                    <img src={print} alt="Print" className='w-[18px] h-[18px]' />
                </button>
            </div>

            <div className="flex justify-between items-center pt-5">
                <select className="border border-[#1E84AF] bg-transparent px-[10px] w-auto h-[42px] text-[#1E84AF] rounded graph-tabs">
                    <option>Select Employee</option>
                </select>
                <button className="border border-white px-[10px] w-auto h-[42px] rounded graph-tabs">Add Employee Performance Evaluation</button>
                <button className="border border-white px-[10px] w-auto h-[42px] rounded graph-tabs">List Employee Performance Evaluation</button>
                <button className="border border-white px-[10px] w-auto h-[42px] rounded graph-tabs">Click To See Evaluation In Detail</button>  
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
                    <QmsEmployeePerformanceChart
                        data={data}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                    />
                </div>

                <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
                    <div className="mb-2 border-b border-gray-700 pb-1 flex justify-between">
                        <span className="text-gray-400">Question</span>
                        <span className="text-gray-400">Poll</span>
                    </div>
                    {data.map((entry, index) => (
                        <div
                            key={index}
                            className={`flex justify-between px-2 py-1 rounded transition duration-200 ${hoveredIndex === index ? 'bg-gray-700' : ''}`}
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
};

export default QmsEmployeePerformanceGraph;
