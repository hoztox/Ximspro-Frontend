import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RootCauseModal from '../RootCauseModal';
import axios from 'axios';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { BASE_URL } from "../../../../Utils/Config";
import SuccessModal from '../SuccessModal';
import ErrorModal from '../ErrorModal';

const QmsAddCorrectionActions = () => {
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

    const [isRootCauseModalOpen, setIsRootCauseModalOpen] = useState(false);
    const navigate = useNavigate();
    const [rootCauses, setRootCauses] = useState([]);
    const [users, setUsers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextActionNo, setNextActionNo] = useState("1");
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({
        source: '',
        title: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false); // For initial data loading


    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        fetchRootCauses();
        fetchUsers();
        fetchNextActionNumber();
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setIsLoading(true);
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/qms/suppliers/company/${companyId}/`);
            const activeSuppliers = response.data.filter(supplier =>
                supplier.active === 'active'
            );
            setSuppliers(activeSuppliers);
        } catch (err) {
            console.error('Error fetching suppliers:', err);
            setError('Failed to fetch suppliers data');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenRootCauseModal = () => {
        setIsRootCauseModalOpen(true);
    };

    const handleCloseRootCauseModal = (newCauseAdded = false) => {
        setIsRootCauseModalOpen(false);
        if (newCauseAdded) {
            fetchRootCauses();
        }
    };

    const [formData, setFormData] = useState({
        source: '',
        title: '',
        next_action_no: '',
        root_cause: '',
        executor: '',
        description: '',
        action_or_corrections: '',
        supplier: '',
        date_raised: {
            day: '',
            month: '',
            year: ''
        },
        date_completed: {
            day: '',
            month: '',
            year: ''
        },
        status: 'Pending',
        send_notification: false,
        is_draft: false,
        upload_attachment: null // Add this line
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const handleListCorrectionActions = () => {
        navigate('/company/qms/list-correction-actions')
    }

    const fetchNextActionNumber = async () => {
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                setNextActionNo("1");
                setFormData(prevData => ({
                    ...prevData,
                    next_action_no: "1"
                }));
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/car-number/next-action/${companyId}/`);
            if (response.data && response.data.next_action_no) {
                const actionNumber = String(response.data.next_action_no);
                setNextActionNo(actionNumber);
                setFormData(prevData => ({
                    ...prevData,
                    next_action_no: actionNumber
                }));
            } else {
                setNextActionNo("1");
                setFormData(prevData => ({
                    ...prevData,
                    next_action_no: "1"
                }));
            }
        } catch (error) {
            console.error('Error fetching next action number:', error);
            setNextActionNo("1");
            setFormData(prevData => ({
                ...prevData,
                next_action_no: "1"
            }));
        }
    };

    const fetchRootCauses = async () => {
        try {
            setIsLoading(true);
            const companyId = getUserCompanyId();
            const response = await axios.get(`${BASE_URL}/qms/root-cause/company/${companyId}/`);
            setRootCauses(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching root causes:', error);
            setIsLoading(false);
        }
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
            setError("Failed to load users");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                upload_attachment: files[0]
            });
            return;
        }
        if (name === 'next_action_no') return;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else if (e.target.type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
            // Clear error when user starts interacting
            if (name === "source" || name === "title" || name === "supplier") {
                setFormErrors({
                    ...formErrors,
                    [name]: ""
                });
            }
        }
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.source) {
            errors.source = "Please select source";
            isValid = false;
        }

        if (!formData.title.trim()) {
            errors.title = "Title is required";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleDraftSave = async (e) => {
        e.preventDefault();

        try {
            setIsSavingDraft(true);
            const dateRaised = formatDate(formData.date_raised);
            const dateCompleted = formatDate(formData.date_completed);

            const submissionData = new FormData();

            submissionData.append('company', companyId);
            submissionData.append('user', userId);
            submissionData.append('title', formData.title);
            submissionData.append('source', formData.source);
            submissionData.append('root_cause', formData.root_cause);
            submissionData.append('description', formData.description);
            if (dateRaised) {
                submissionData.append('date_raised', dateRaised);
            }
            if (dateCompleted) {
                submissionData.append('date_completed', dateCompleted);
            }
            submissionData.append('status', formData.status);
            submissionData.append('executor', formData.executor);
            submissionData.append('next_action_no', formData.next_action_no);
            submissionData.append('action_or_corrections', formData.action_or_corrections);
            submissionData.append('send_notification', formData.send_notification);
            submissionData.append('is_draft', true);

            if (formData.source === 'Supplier' && formData.supplier) {
                submissionData.append('supplier', formData.supplier);
            }

            if (formData.upload_attachment) {
                submissionData.append('upload_attachment', formData.upload_attachment);
            }

            const response = await axios.post(`${BASE_URL}/qms/car/draft-create/`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsLoading(false);

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/draft-correction-actions');
            }, 1500);
            setSuccessMessage("Corrections Actions Drafted Successfully");

        } catch (error) {
            console.error('Error saving draft:', error);
            setIsSavingDraft(false);
            let errorMsg = error.message;

            if (error.response) {
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            const dateRaised = formatDate(formData.date_raised);
            const dateCompleted = formatDate(formData.date_completed);

            const submissionData = new FormData();

            submissionData.append('company', companyId);
            submissionData.append('user', userId);
            submissionData.append('title', formData.title);
            submissionData.append('source', formData.source);
            submissionData.append('root_cause', formData.root_cause);
            submissionData.append('description', formData.description);
            if (dateRaised) {
                submissionData.append('date_raised', dateRaised);
            }
            if (dateCompleted) {
                submissionData.append('date_completed', dateCompleted);
            }
            submissionData.append('status', formData.status);
            submissionData.append('executor', formData.executor);
            submissionData.append('next_action_no', formData.next_action_no);
            submissionData.append('action_or_corrections', formData.action_or_corrections);
            submissionData.append('send_notification', formData.send_notification);
            submissionData.append('is_draft', false);

            if (formData.source === 'Supplier' && formData.supplier) {
                submissionData.append('supplier', formData.supplier);
            }

            if (formData.upload_attachment) {
                submissionData.append('upload_attachment', formData.upload_attachment);
            }

            const response = await axios.post(`${BASE_URL}/qms/car-numbers/`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsLoading(false);

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-correction-actions');
            }, 1500);
            setSuccessMessage("Corrections Actions Added Successfully");

            // Reset form
            setFormData({
                source: '',
                title: '',
                next_action_no: '1',
                root_cause: '',
                executor: '',
                description: '',
                action_or_corrections: '',
                supplier: '',
                date_raised: { day: '', month: '', year: '' },
                date_completed: { day: '', month: '', year: '' },
                status: 'Pending',
                send_notification: false,
                is_draft: false,
                upload_attachment: null
            });

            fetchNextActionNumber();

        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
            let errorMsg = error.message;

            if (error.response) {
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
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
                <h1 className="add-training-head">Add Corrective Action</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => handleListCorrectionActions()}
                >
                    List Corrective Actions
                </button>
            </div>


            <RootCauseModal
                isOpen={isRootCauseModalOpen}
                onClose={handleCloseRootCauseModal}
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


            <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Source <span className="text-red-500">*</span></label>
                    <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("source")}
                        onBlur={() => setFocusedDropdown(null)}
                        className={`add-training-inputs appearance-none pr-10 cursor-pointer ${formErrors.source ? "border-red-500" : ""}`}
                    >
                        <option value="" disabled>Select</option>
                        <option value="Audit">Audit</option>
                        <option value="Customer">Customer</option>
                        <option value="Internal">Internal</option>
                        <option value="Supplier">Supplier</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[55px] transform transition-transform duration-300 
                        ${focusedDropdown === "source" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                    {formErrors.source && (
                        <p className="text-red-500 text-sm">{formErrors.source}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`add-training-inputs focus:outline-none ${formErrors.title ? "border-red-500" : ""}`}
                    />
                    {formErrors.title && (
                        <p className="text-red-500 text-sm">{formErrors.title}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Action No
                    </label>
                    <input
                        type="text"
                        name="next_action_no"
                        value={formData.next_action_no}
                        className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
                        readOnly
                        title="Auto-generated action number"
                    />
                </div>

                {formData.source === 'Supplier' ? (
                    <div className="flex flex-col gap-3 relative">
                        <label className="add-training-label">Supplier</label>
                        <select
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("supplier")}
                            onBlur={() => setFocusedDropdown(null)}
                            className={`add-training-inputs appearance-none pr-10 cursor-pointer ${formErrors.supplier ? "border-red-500" : ""}`}
                        >
                            <option value="" disabled>
                                {isLoading ? "Loading suppliers..." : "Select Supplier"}
                            </option>
                            {suppliers && suppliers.length > 0 ? (
                                suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.company_name}
                                    </option>
                                ))
                            ) : !isLoading && (
                                <option value="" disabled>No approved suppliers found</option>
                            )}
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                            ${focusedDropdown === "supplier" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>
                ) : (
                    <div></div>
                )}

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Root Cause</label>
                    <select
                        name="root_cause"
                        value={formData.root_cause}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("root_cause")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>
                            {isLoading ? "Loading..." : "Select Root Cause"}
                        </option>
                        {rootCauses && rootCauses.length > 0 ? (
                            rootCauses.map(cause => (
                                <option key={cause.id} value={cause.id}>
                                    {cause.title}
                                </option>
                            ))
                        ) : !isLoading && (
                            <option value="" disabled>No root causes found</option>
                        )}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                            ${focusedDropdown === "root_cause" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                    <button
                        className='flex justify-start add-training-label !text-[#1E84AF] mt-1'
                        onClick={handleOpenRootCauseModal}
                        type="button"
                    >
                        View / Add Root Cause
                    </button>
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Executor</label>
                    <select
                        name="executor"
                        value={formData.executor}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("executor")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>
                            {isLoading ? "Loading..." : "Select Executor"}
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
                        className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                        ${focusedDropdown === "executor" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Problem Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Action or Corrections
                    </label>
                    <textarea
                        name="action_or_corrections"
                        value={formData.action_or_corrections}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Date Raised</label>
                    <div className="grid grid-cols-3 gap-5">
                        <div className="relative">
                            <select
                                name="date_raised.day"
                                value={formData.date_raised.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date_raised.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date_raised.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date_raised.month"
                                value={formData.date_raised.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date_raised.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date_raised.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date_raised.year"
                                value={formData.date_raised.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date_raised.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date_raised.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Complete By</label>
                    <div className="grid grid-cols-3 gap-5">
                        <div className="relative">
                            <select
                                name="date_completed.day"
                                value={formData.date_completed.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date_completed.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date_completed.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date_completed.month"
                                value={formData.date_completed.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date_completed.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date_completed.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date_completed.year"
                                value={formData.date_completed.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date_completed.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date_completed.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
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
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Deleted">Deleted</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[55px] transform transition-transform duration-300
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
                            name="upload_attachment"
                            onChange={handleChange}
                            className="hidden"
                            id="correction-upload"
                        />
                        <label
                            htmlFor="correction-upload"
                            className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                        >
                            <span className="text-[#AAAAAA] choose-file">Choose File</span>
                            <img src={file} alt="" />
                        </label>
                    </div>
                    <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                        {formData.upload_attachment ? formData.upload_attachment.name : "No file chosen"}
                    </p>
                </div>
                <div></div>

                <div className="flex items-end justify-end mt-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="send_notification"
                            className="mr-2 form-checkboxes"
                            checked={formData.send_notification || false}
                            onChange={handleChange}
                        />
                        <span className="permissions-texts cursor-pointer">
                            Send Notification
                        </span>
                    </label>
                </div>

                <div className="md:col-span-2 flex gap-4 justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={handleDraftSave}
                            className='request-correction-btn duration-200'>
                            {isSavingDraft ? 'Saving Draft...' : 'Save as Draft'}
                        </button>
                    </div>
                    <div className='flex gap-5'>
                        <button
                            type="button"
                            onClick={handleListCorrectionActions}
                            className="cancel-btn duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn duration-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QmsAddCorrectionActions;