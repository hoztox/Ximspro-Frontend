import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const QmsEditObjectives = () => {
    const getUserCompanyId = () => {
        const storedCompanyId = localStorage.getItem("company_id");
        if (storedCompanyId) return storedCompanyId;

        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            const userData = localStorage.getItem("user_company_id");
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch (e) {
                    console.error("Error parsing user company ID:", e);
                    return null;
                }
            }
        }
        return null;
    };

    const companyId = getUserCompanyId();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const [formData, setFormData] = useState({
        objective: '',
        indicator: '',
        performance_measure: '',
        target_date: {
            day: '',
            month: '',
            year: ''
        },
        responsible: '',
        status: '',
        reminder_date: {
            day: '',
            month: '',
            year: ''
        }
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const handleListObjectives = () => {
        navigate('/company/qms/list-objectives')
    }

    const fetchUsers = async () => {
        try {
            const companyId = getUserCompanyId();
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);

            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users. Please check your connection and try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested objects (dates)
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
            // Handle regular inputs
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const companyId = getUserCompanyId();

            // Format the dates
            const targetDate = formatDate(formData.target_date);
            const reminderDate = formatDate(formData.reminder_date);

            // Prepare submission data
            const submissionData = {
                company: companyId,
                objective: formData.objective,
                indicator: formData.indicator,
                performance_measure: formData.performance_measure,
                target_date: targetDate,
                responsible: formData.responsible,
                status: formData.status,
                reminder_date: reminderDate
            };

            // Submit to API
            const response = await axios.post(`${BASE_URL}/qms/objectives/`, submissionData);

            console.log('Added Objective:', submissionData);

            setIsLoading(false);

            // Navigate to the list page after successful submission
            navigate('/company/qms/list-objectives');

        } catch (error) {
            console.error('Error submitting form:', error);
            setIsLoading(false);
            setError('Failed to save. Please check your inputs and try again.');
        }
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
                <h1 className="add-training-head">Edit Objectives</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => handleListObjectives()}
                >
                    List Objectives
                </button>
            </div>

            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-[104px] py-2 my-2">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Objective <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="objective"
                        value={formData.objective}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Indicator
                    </label>
                    <input
                        type="text"
                        name="indicator"
                        value={formData.indicator}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Performance Measure
                    </label>
                    <input
                        type="text"
                        name="performance_measure"
                        value={formData.performance_measure}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Target Date</label>
                    <div className="grid grid-cols-3 gap-5">
                        {/* Day */}
                        <div className="relative">
                            <select
                                name="target_date.day"
                                value={formData.target_date.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("target_date.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "target_date.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Month */}
                        <div className="relative">
                            <select
                                name="target_date.month"
                                value={formData.target_date.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("target_date.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "target_date.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Year */}
                        <div className="relative">
                            <select
                                name="target_date.year"
                                value={formData.target_date.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("target_date.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "target_date.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Responsible <span className="text-red-500">*</span></label>
                    <select
                        name="responsible"
                        value={formData.responsible}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("responsible")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>
                            {isLoading ? "Loading..." : "Select Responsible"}
                        </option>
                        {users && users.length > 0 ? (
                            users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name || ''}
                                </option>
                            ))
                        ) : !isLoading && (
                            <option value="" disabled>No users found</option>
                        )}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "responsible" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("status")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select Status</option>
                        <option value="OnGoing">OnGoing</option>
                        <option value="Achieved">Achieved</option>
                        <option value="Not Achieved">Not Achieved</option>
                        <option value="Modified">Modified</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "status" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Reminder Notification</label>
                    <div className="grid grid-cols-3 gap-5">
                        {/* Day */}
                        <div className="relative">
                            <select
                                name="reminder_date.day"
                                value={formData.reminder_date.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("reminder_date.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "reminder_date.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Month */}
                        <div className="relative">
                            <select
                                name="reminder_date.month"
                                value={formData.reminder_date.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("reminder_date.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "reminder_date.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Year */}
                        <div className="relative">
                            <select
                                name="reminder_date.year"
                                value={formData.reminder_date.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("reminder_date.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "reminder_date.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-end items-end">
                    <div className='flex gap-5'>
                        <button
                            type="button"
                            onClick={handleListObjectives}
                            className="cancel-btn duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default QmsEditObjectives
