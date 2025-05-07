import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import ReviewTypeModal from './ReviewTypeModal';


const QmsEditDraftEnergyBaseLines = () => {
    const [isReviewTypeModalOpen, setIsReviewTypeModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [enpiFields, setEnpiFields] = useState([{ id: 1, value: '' }]); // Initial EnPI field

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

    useEffect(() => {
        fetchUsers();
    }, []);

    const companyId = getUserCompanyId();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        established_baseline: '',
        remarks: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        responsible: '',
        related_energy_review: '',
    });

    const handleEnpiChange = (id, value) => {
        setEnpiFields(enpiFields.map(field =>
            field.id === id ? { ...field, value } : field
        ));
    };

    const addEnpiField = () => {
        const newId = enpiFields.length > 0 ? Math.max(...enpiFields.map(f => f.id)) + 1 : 1;
        setEnpiFields([...enpiFields, { id: newId, value: '' }]);
    };

    const removeEnpiField = (id) => {
        if (enpiFields.length > 1) {
            setEnpiFields(enpiFields.filter(field => field.id !== id));
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

    const handleOpenReviewTypeModal = () => {
        setIsReviewTypeModalOpen(true);
    };

    const handleCloseReviewTypeModal = (newReviewAdded = false) => {
        setIsReviewTypeModalOpen(false);
        if (newReviewAdded) {
            fetchReview();
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
            setError('');

            // Format the date
            const formattedDate = formatDate(formData.date);

            // Combine all EnPI values
            const associatedEnpis = enpiFields.map(field => field.value).filter(Boolean).join(', ');

            // Prepare form data for submission
            const submissionData = new FormData();
            submissionData.append('company', companyId);
            submissionData.append('title', formData.title);
            submissionData.append('established_baseline', formData.established_baseline);
            submissionData.append('remarks', formData.remarks);
            submissionData.append('date', formattedDate);
            submissionData.append('responsible', formData.responsible);
            submissionData.append('related_energy_review', formData.related_energy_review);
            submissionData.append('associated_enpi', associatedEnpis);

            // Submit to API
            const response = await axios.post(`${BASE_URL}/energy/reviews/`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Energy Review created:', response.data);
            navigate('/company/qms/list-energy-baselines');

        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Failed to save energy review. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/company/qms/draft-energy-baselines');
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
                <h1 className="add-training-head">Edit Draft Base Line</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200 w-[170px]"
                    onClick={() => navigate('/company/qms/draft-energy-baselines')}
                >
                    List Draft Base Line
                </button>
            </div>

            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-[104px] py-2 my-2">
                    {error}
                </div>
            )}

            <ReviewTypeModal
                isOpen={isReviewTypeModalOpen}
                onClose={handleCloseReviewTypeModal}
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Baseline Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Established Baseline</label>
                    <input
                        type="text"
                        name="established_baseline"
                        value={formData.established_baseline}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Baseline Performance Measure/Remarks</label>
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
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
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
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
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
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
                                {generateOptions(2020, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date.year" ? "rotate-180" : ""}`}
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
                        className={`absolute right-3 top-[45%] transform transition-transform duration-300
                                        ${focusedDropdown === "responsible" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Related Energy Review</label>
                    <select
                        name="related_energy_review"
                        value={formData.related_energy_review}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("related_energy_review")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select Review Type</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                        ${focusedDropdown === "related_energy_review" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                    <button
                        className='flex justify-start add-training-label !text-[#1E84AF]'
                        onClick={handleOpenReviewTypeModal}
                        type="button"
                    >
                        View / Add Review Type
                    </button>
                </div>

                {enpiFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 justify-between last:pr-[57px]">
                            <label className="add-training-label">
                                Associated EnPI(s) {/*{index > 0 && `#${index + 1}`}*/}
                            </label>
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeEnpiField(field.id)}
                                    className="text-red-500 text-xs"
                                >
                                    <X size={17} />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={field.value}
                                onChange={(e) => handleEnpiChange(field.id, e.target.value)}
                                className="add-training-inputs focus:outline-none flex-1"
                            />
                            {index === enpiFields.length - 1 && (
                                <button
                                    type="button"
                                    onClick={addEnpiField}
                                    className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                                >
                                    <Plus className="text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-4 justify-end">
                    <div className='flex gap-5'>
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
export default QmsEditDraftEnergyBaseLines
