import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const QmsEditSupplierProblem = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        supplier_name: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        problem: '',
        immediate_action: '',
        executor: '',
        audit_type: '',
        solved: '',
        corrective_action: '',
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const handleSupplierProblemLog = () => {
        navigate('/company/qms/supplier-problem-log')
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested objects
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
        // Handle form submission
        console.log('Form data submitted:', formData);
        // Here you would typically send the data to your backend
    };

    const handleCancel = () => {
        navigate('/company/qms/supplier-problem-log')
    };

    // Generate options for dropdowns
    const generateOptions = (start, end, prefix = '') => {
        const options = [];
        for (let i = start; i <= end; i++) {
            const value = i < 10 ? `0${i}` : `${i}`;
            options.push(
                <option key={i} value={value}>
                    {prefix}{value}
                </option>
            );
        }
        return options;
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <h1 className="add-training-head">Edit Supplier Problem</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-5  h-[42px] list-training-btn duration-200"
                    onClick={() => handleSupplierProblemLog()}
                >
                    Supplier Problem Log
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5  ">

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Supplier Name <span className="text-red-500">*</span></label>
                    <select
                        name="supplier_name"
                        value={formData.supplier_name}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("supplier_name")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select</option>
                        <option value="supplier1">Supplier 1</option>
                        <option value="supplier2">Supplier 2</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform   transition-transform duration-300 
          ${focusedDropdown === "supplier_name" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Date</label>
                    <div className="grid grid-cols-3 gap-5">

                        {/* Day */}
                        <div className="relative">
                            <select
                                name="date.day"
                                value={formData.date.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
              ${focusedDropdown === "date.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Month */}
                        <div className="relative">
                            <select
                                name="date.month"
                                value={formData.date.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
              ${focusedDropdown === "date.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Year */}
                        <div className="relative">
                            <select
                                name="date.year"
                                value={formData.date.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
              ${focusedDropdown === "date.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Problem
                    </label>
                    <textarea
                        name="problem"
                        value={formData.problem}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Immediate Action
                    </label>
                    <textarea
                        name="immediate_action"
                        value={formData.immediate_action}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Executor </label>
                    <select
                        name="executor"
                        value={formData.executor}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("executor")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                        <option value="HR">HR</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform   transition-transform duration-300 
          ${focusedDropdown === "executor" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Solved</label>
                    <select
                        name="solved"
                        value={formData.solved}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("solved")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>

                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform   transition-transform duration-300 
          ${focusedDropdown === "solved" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Corrective Action Needed</label>
                    <select
                        name="corrective_action"
                        value={formData.corrective_action}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("corrective_action")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>

                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform   transition-transform duration-300 
          ${focusedDropdown === "corrective_action" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className='flex gap-5 items-end justify-end'>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="cancel-btn duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="save-btn duration-200"
                    >
                        Save
                    </button>
                </div>

            </form>
        </div>
    );
};
export default QmsEditSupplierProblem
