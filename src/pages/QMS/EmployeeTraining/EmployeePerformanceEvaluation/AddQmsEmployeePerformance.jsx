import React, { useState } from 'react';
import "./addqmsemployeeperformance.css"

const AddQmsEmployeePerformance = () => {
    const [formData, setFormData] = useState({
        evaluationTitle: '',
        evaluationDescription: '',
        validTill: {
            day: '',
            month: '',
            year: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here you would typically send the data to your backend
    };

    const handleCancel = () => {
        setFormData({
            evaluationTitle: '',
            evaluationDescription: '',
            validTill: {
                day: '',
                month: '',
                year: ''
            }
        });
    };

    // Generate day options
    const dayOptions = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        return (
            <option key={day} value={day < 10 ? `0${day}` : day}>
                {day < 10 ? `0${day}` : day}
            </option>
        );
    });

    // Generate month options
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthOptions = months.map((month, index) => {
        const monthValue = index + 1;
        return (
            <option key={month} value={monthValue < 10 ? `0${monthValue}` : monthValue}>
                {month}
            </option>
        );
    });

    // Generate year options (current year + 10 years ahead)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => {
        const year = currentYear + i;
        return (
            <option key={year} value={year}>
                {year}
            </option>
        );
    });

    return (
        <div className="bg-[#1C1C24] text-white p-5">
            <div>
                <div className="flex justify-between items-center pb-5 border-b border-[#383840] px-[104px]">
                    <h1 className="add-employee-performance-head">Add Employee Performance Evaluation</h1>
                    <button
                        className="border border-[#858585] text-[#858585] rounded px-[10px] h-[42px] list-training-btn duration-200"
                    >
                        List Employee Performance Evaluation
                    </button>
                </div>

                <form onSubmit={handleSubmit} className=' px-[104px] pt-5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2">
                                Evaluation Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="evaluationTitle"
                                value={formData.evaluationTitle}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="md:row-span-2">
                            <label className="block mb-2">Evaluation Description</label>
                            <textarea
                                name="evaluationDescription"
                                value={formData.evaluationDescription}
                                onChange={handleChange}
                                className="w-full h-full min-h-32 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Valid Till</label>
                            <div className="flex gap-2">
                                <div className="relative w-1/3">
                                    <select
                                        name="validTill.day"
                                        value={formData.validTill.day}
                                        onChange={handleChange}
                                        className="appearance-none w-full bg-gray-800 border border-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">dd</option>
                                        {dayOptions}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="relative w-1/3">
                                    <select
                                        name="validTill.month"
                                        value={formData.validTill.month}
                                        onChange={handleChange}
                                        className="appearance-none w-full bg-gray-800 border border-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">mm</option>
                                        {monthOptions}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="relative w-1/3">
                                    <select
                                        name="validTill.year"
                                        value={formData.validTill.year}
                                        onChange={handleChange}
                                        className="appearance-none w-full bg-gray-800 border border-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">yyyy</option>
                                        {yearOptions}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQmsEmployeePerformance
