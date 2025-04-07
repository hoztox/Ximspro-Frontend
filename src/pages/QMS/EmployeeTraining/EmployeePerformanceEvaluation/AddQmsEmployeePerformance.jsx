import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./addqmsemployeeperformance.css";

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

    const [focusedField, setFocusedField] = useState("");
    const navigate = useNavigate();
    const handleFocus = (field) => setFocusedField(field);
    const handleBlur = () => setFocusedField("");

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

    const handleListEmployeePerformance = () => {
        navigate('/company/qms/employee-performance')
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleCancel = () => {
        navigate('/company/qms/employee-performance')
    };

    const dayOptions = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        return (
            <option key={day} value={day < 10 ? `0${day}` : day}>
                {day < 10 ? `0${day}` : day}
            </option>
        );
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthOptions = months.map((month, index) => {
        const monthValue = index + 1;
        return (
            <option key={month} value={monthValue < 10 ? `0${monthValue}` : monthValue}>
                {month}
            </option>
        );
    });

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
                    <button className="border border-[#858585] text-[#858585] rounded px-[10px] h-[42px] list-training-btn duration-200"
                    onClick={handleListEmployeePerformance}
                    >
                        List Employee Performance Evaluation
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='px-[104px] pt-5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block employee-performace-label">
                                Evaluation Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="evaluationTitle"
                                value={formData.evaluationTitle}
                                onChange={handleChange}
                                className="w-full employee-performace-inputs"
                                required
                            />
                        </div>

                        <div className="md:row-span-2">
                            <label className="block employee-performace-label">Evaluation Description</label>
                            <textarea
                                name="evaluationDescription"
                                value={formData.evaluationDescription}
                                onChange={handleChange}
                                className="w-full h-full min-h-[151px] employee-performace-inputs"
                            />
                        </div>

                        <div>
                            <label className="block employee-performace-label">Valid Till</label>
                            <div className="flex gap-5">
                                {/* Day */}
                                <div className="relative w-1/3">
                                    <select
                                        name="validTill.day"
                                        value={formData.validTill.day}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus("day")}
                                        onBlur={handleBlur}
                                        className="appearance-none w-full employee-performace-inputs"
                                    >
                                        <option value="">dd</option>
                                        {dayOptions}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown
                                            className={`w-5 h-5 transition-transform duration-300 text-[#AAAAAA] ${focusedField === "day" ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </div>

                                {/* Month */}
                                <div className="relative w-1/3">
                                    <select
                                        name="validTill.month"
                                        value={formData.validTill.month}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus("month")}
                                        onBlur={handleBlur}
                                        className="appearance-none w-full employee-performace-inputs"
                                    >
                                        <option value="">mm</option>
                                        {monthOptions}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown
                                            className={`w-5 h-5 transition-transform duration-300 text-[#AAAAAA] ${focusedField === "month" ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </div>

                                {/* Year */}
                                <div className="relative w-1/3">
                                    <select
                                        name="validTill.year"
                                        value={formData.validTill.year}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus("year")}
                                        onBlur={handleBlur}
                                        className="appearance-none w-full employee-performace-inputs"
                                    >
                                        <option value="">yyyy</option>
                                        {yearOptions}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown
                                            className={`w-5 h-5 transition-transform duration-300 text-[#AAAAAA] ${focusedField === "year" ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-5 mt-5 pl-[23.5rem]">
                        <button type="button" onClick={handleCancel} className="cancel-btn duration-200">
                            Cancel
                        </button>
                        <button type="submit" className="save-btn duration-200">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQmsEmployeePerformance;
