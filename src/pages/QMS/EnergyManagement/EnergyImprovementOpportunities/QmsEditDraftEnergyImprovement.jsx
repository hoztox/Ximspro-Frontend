import React, { useEffect, useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsEditDraftEnergyImprovement = () => {
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({
        eio_title: '',
        responsible: ''
    });
    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const navigate = useNavigate();
    const [existingAttachment, setExistingAttachment] = useState(null);
    const [existingAttachmentUrl, setExistingAttachmentUrl] = useState(null);

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);

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

    const getCurrentUserId = () => {
        return localStorage.getItem("user_id");
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

    const fetchEnergyImprovement = async () => {
        try {
            setIsLoading(true);
            const companyId = getUserCompanyId();
            if (!companyId || !id) {
                setError("Invalid company or improvement ID.");
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/energy-improvements/${id}/`, {
                params: { company_id: companyId },
            });

            const data = response.data;
            if (!data.is_draft) {
                setError("This is not a draft improvement.");
                return;
            }

            const dateParts = data.date ? data.date.split('-') : ['', '', ''];

            setFormData({
                eio: data.eio || '',
                eio_title: data.eio_title || '',
                target: data.target || '',
                associated_objective: data.associated_objective || '',
                results: data.results || '',
                date: {
                    day: dateParts[2] || '',
                    month: dateParts[1] || '',
                    year: dateParts[0] || ''
                },
                responsible: data.responsible?.id || '',
                status: data.status || 'On Going',
                upload_attachment: null,
                is_draft: data.is_draft || false
            });

            if (data.upload_attachment) {
                setExistingAttachmentUrl(data.upload_attachment);
                const filename = data.upload_attachment.split('/').pop();
                setExistingAttachment(filename);
            }
        } catch (error) {
            console.error("Error fetching energy improvement:", error);
            let errorMsg = error.message;

            if (error.response) {
                // Check for field-specific errors first
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
                // Check for non-field errors
                else if (error.response.data.detail) {
                    errorMsg = error.response.data.detail;
                }
                else if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }

            setError(errorMsg);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchEnergyImprovement();
    }, [id]);

    const companyId = getUserCompanyId();
    const userId = getCurrentUserId();

    const [formData, setFormData] = useState({
        eio: '',
        eio_title: '',
        target: '',
        associated_objective: '',
        results: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        responsible: '',
        status: 'On Going',
        upload_attachment: null,
        is_draft: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'eio') return;

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

        if (name === 'eio_title' || name === 'responsible') {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData({
                ...formData,
                upload_attachment: e.target.files[0],
            });
            setExistingAttachment(null);
            setExistingAttachmentUrl(null);
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.eio_title.trim()) {
            errors.eio_title = 'EIO Title is required';
            isValid = false;
        }

        if (!formData.responsible) {
            errors.responsible = 'Responsible is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const formattedDate = formatDate(formData.date);

            const submissionData = new FormData();
            submissionData.append('user', userId);
            submissionData.append('company', companyId);
            submissionData.append('eio', formData.eio);
            submissionData.append('eio_title', formData.eio_title);
            submissionData.append('target', formData.target);
            submissionData.append('associated_objective', formData.associated_objective);
            submissionData.append('results', formData.results);
            if (formattedDate) submissionData.append('date', formattedDate);
            submissionData.append('responsible', formData.responsible);
            submissionData.append('status', formData.status);
            submissionData.append('is_draft', false);

            if (formData.upload_attachment instanceof File) {
                submissionData.append('upload_attachment', formData.upload_attachment);
            }

            const shouldClearAttachment = !formData.upload_attachment && !existingAttachment;
            if (shouldClearAttachment) {
                submissionData.append('clear_attachment', 'true');
            }

            await axios.put(`${BASE_URL}/qms/energy-improvements/${id}/`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-energy-improvement-opportunities');
            }, 1500);
            setSuccessMessage("Energy Improvements Updated Successfully")
        } catch (error) {
            console.error('Error publishing energy improvement:', error);
            let errorMsg = error.message;

            if (error.response) {
                // Check for field-specific errors first
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
                // Check for non-field errors
                else if (error.response.data.detail) {
                    errorMsg = error.response.data.detail;
                }
                else if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }

            setError(errorMsg);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/company/qms/draft-energy-improvement-opportunities');
    };

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
                <h1 className="add-training-head">Edit Draft Energy Improvement Opportunities</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => navigate('/company/qms/draft-energy-improvement-opportunities')}
                >
                    List Draft Energy Improvement Opportunities
                </button>
            </div>

            <SuccessModal
                showSuccessModal={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                successMessage={successMessage}
            />

            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={error}
            />


            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        EIO Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="eio"
                        value={formData.eio}
                        className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
                        readOnly
                        title="Existing EIO number"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        EIO Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="eio_title"
                        value={formData.eio_title}
                        onChange={handleChange}
                        className={`add-training-inputs focus:outline-none ${formErrors.eio_title ? "border-red-500" : ""}`}
                        maxLength={50}
                    />
                    {formErrors.eio_title && (
                        <p className="text-red-500 text-sm">{formErrors.eio_title}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Target</label>
                    <input
                        type="text"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        maxLength={50}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Associated Objective</label>
                    <input
                        type="text"
                        name="associated_objective"
                        value={formData.associated_objective}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        maxLength={50}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Results</label>
                    <textarea
                        name="results"
                        value={formData.results}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Target Date</label>
                    <div className="grid grid-cols-3 gap-5">
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
                    <label className="add-training-label">
                        Responsible <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="responsible"
                        value={formData.responsible}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("responsible")}
                        onBlur={() => setFocusedDropdown(null)}
                        className={`add-training-inputs appearance-none pr-10 cursor-pointer ${formErrors.responsible ? "border-red-500" : ""}`}
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
                        className={`absolute right-3 top-[55px] transform transition-transform duration-300 
                                                ${focusedDropdown === "responsible" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                    {formErrors.responsible && (
                        <p className="text-red-500 text-sm">{formErrors.responsible}</p>
                    )}
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
                    >
                        <option value="" disabled>Select Status</option>
                        <option value="On Going">On Going</option>
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
                    <label className="add-training-label">Upload Attachment</label>
                    <div className="flex">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="file-upload"
                            className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                        >
                            <span className="text-[#AAAAAA] choose-file">Choose File</span>
                            <img src={file} alt="" />
                        </label>
                    </div>
                    <div className='flex justify-between items-center'>
                        {existingAttachmentUrl && (
                            <a
                                href={existingAttachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='click-view-file-btn flex items-center gap-2 text-[#1E84AF]'
                            >
                                Click to view file <Eye size={17} />
                            </a>
                        )}
                        {formData.upload_attachment instanceof File ? (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                                {formData.upload_attachment.name}
                            </p>
                        ) : existingAttachment ? (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                                {existingAttachment}
                            </p>
                        ) : (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                                No file chosen
                            </p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 flex gap-4 justify-end">
                    <div className='flex gap-5'>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel-btn duration-200"
                            disabled={isLoading}
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

export default QmsEditDraftEnergyImprovement;