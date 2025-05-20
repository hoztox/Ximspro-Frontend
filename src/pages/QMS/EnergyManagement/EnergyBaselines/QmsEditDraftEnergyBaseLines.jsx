import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import ReviewTypeModal from './ReviewTypeModal';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsEditDraftEnergyBaseLines = () => {
    const [isReviewTypeModalOpen, setIsReviewTypeModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [enpiFields, setEnpiFields] = useState([{ id: 1, value: '' }]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const [formErrors, setFormErrors] = useState({
        basline_title: '',
        responsible: ''
    });
    const navigate = useNavigate();
    const { id } = useParams();

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);

    const [formData, setFormData] = useState({
        basline_title: '',
        established_basline: '',
        remarks: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        responsible: '',
        energy_review: '',
        is_draft: false,
    });

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

    const getRelevantUserId = () => {
        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            const userId = localStorage.getItem("user_id");
            if (userId) return userId;
        }
        const companyId = localStorage.getItem("company_id");
        if (companyId) return companyId;
        return null;
    };

    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    const fetchUsers = async () => {
        try {
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
        }
    };

    const fetchReviews = async () => {
        try {
            if (!companyId) return;
            const response = await axios.get(`${BASE_URL}/qms/baseline-reviewtype/company/${companyId}`, {
                params: { company: companyId }
            });
            if (Array.isArray(response.data)) {
                setReviews(response.data);
            } else {
                setReviews([]);
                console.error("Unexpected reviews response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
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
        }
    };

    const fetchBaseline = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.get(`${BASE_URL}/qms/baselines/${id}/`);
            const baseline = response.data;
            const date = baseline.date ? new Date(baseline.date) : null;

            const newFormData = {
                basline_title: baseline.basline_title || '',
                established_basline: baseline.established_basline || '',
                remarks: baseline.remarks || '',
                date: {
                    day: date ? String(date.getDate()).padStart(2, '0') : '',
                    month: date ? String(date.getMonth() + 1).padStart(2, '0') : '',
                    year: date ? String(date.getFullYear()) : ''
                },
                responsible: baseline.responsible?.id || '',
                energy_review: baseline.energy_review?.id || '',
                is_draft: false
            };

            setFormData(newFormData);

            setEnpiFields(baseline.enpis?.length > 0
                ? baseline.enpis.map((enpi, index) => ({
                    id: index + 1,
                    value: enpi.enpi
                }))
                : [{ id: 1, value: '' }]);
        } catch (error) {
            console.error("Error fetching baseline:", error);
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
        fetchReviews();
        if (id) {
            fetchBaseline();
        }
    }, [id]);

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
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevFormData => ({
                ...prevFormData,
                [parent]: {
                    ...prevFormData[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
            if (name === "basline_title" || name === "responsible") {
                setFormErrors({
                    ...formErrors,
                    [name]: ""
                });
            }
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.basline_title.trim()) {
            errors.basline_title = "Baseline Title is required";
            isValid = false;
        }

        if (!formData.responsible) {
            errors.responsible = "Responsible is required";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleOpenReviewTypeModal = () => {
        setIsReviewTypeModalOpen(true);
    };

    const handleCloseReviewTypeModal = (newReviewAdded = false) => {
        setIsReviewTypeModalOpen(false);
        if (newReviewAdded) {
            fetchReviews();
        }
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const prepareSubmissionData = () => {
        const formattedDate = formatDate(formData.date);
        const enpis = enpiFields
            .map(field => field.value)
            .filter(Boolean)
            .map(value => ({ enpi: value }));

        const submissionData = {
            company: companyId,
            user: userId,
            basline_title: formData.basline_title,
            established_basline: formData.established_basline,
            remarks: formData.remarks,
            date: formattedDate,
            responsible: formData.responsible,
            energy_review: formData.energy_review || null,
            enpis: enpis,
            is_draft: formData.is_draft
        };

        return submissionData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const submissionData = prepareSubmissionData();

            await axios.put(`${BASE_URL}/qms/baselines/${id}/`, submissionData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-energy-baselines');
            }, 1500);
            setSuccessMessage("Energy Baselines Saved Successfully")
        } catch (error) {
            console.error('Form submission error:', error);
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
        navigate('/company/qms/draft-energy-baselines');
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
                <h1 className="add-training-head">Edit Draft Base Line</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200 w-[170px]"
                    onClick={() => navigate('/company/qms/draft-energy-baselines')}
                >
                    List Draft Base Line
                </button>
            </div>

            <ReviewTypeModal
                isOpen={isReviewTypeModalOpen}
                onClose={handleCloseReviewTypeModal}
            />

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


            {isLoading ? (
                <div className="text-center py-4 not-found">Loading...</div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">
                            Baseline Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="basline_title"
                            value={formData.basline_title}
                            onChange={handleChange}
                            className={`add-training-inputs focus:outline-none ${formErrors.basline_title ? "border-red-500" : ""}`}
                        />
                        {formErrors.basline_title && (
                            <p className="text-red-500 text-sm">{formErrors.basline_title}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">Established Baseline</label>
                        <input
                            type="text"
                            name="established_basline"
                            value={formData.established_basline}
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
                        <label className="add-training-label">Responsible <span className="text-red-500">*</span></label>
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
                            {users.length > 0 ? (
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
                        {formErrors.responsible && (
                            <p className="text-red-500 text-sm">{formErrors.responsible}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 relative">
                        <label className="add-training-label">Related Energy Review</label>
                        <select
                            name="energy_review"
                            value={formData.energy_review}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("energy_review")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        >
                            <option value="" disabled>Select Review Type</option>
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <option key={review.id} value={review.id}>
                                        {review.title || 'Untitled Review'}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No reviews found</option>
                            )}
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                            ${focusedDropdown === "energy_review" ? "rotate-180" : ""}`}
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
                                    Associated EnPI(s)
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
            )}
        </div>
    );
};

export default QmsEditDraftEnergyBaseLines;