import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./causesmodal.css"
import RootCauseModal from './RootCauseModal';
import { BASE_URL } from "../../../Utils/Config";
import axios from 'axios';
import AddCarNoSuccessModal from './Modals/AddCarNoSuccessModal';
import ErrorModal from './Modals/ErrorModal';
import DraftCarNoSuccessModal from './Modals/DraftCarNoSuccessModal';

const AddCarNumberModal = ({ isOpen, onClose, onSuccess }) => {
    // Define the getUserCompanyId function first
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

    // Now you can safely use the function
    const companyId = getUserCompanyId();

    const [isRootCauseModalOpen, setIsRootCauseModalOpen] = useState(false);
    const navigate = useNavigate();
    const [animateClass, setAnimateClass] = useState('');
    const [rootCauses, setRootCauses] = useState([]);
    const [users, setUsers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextActionNo, setNextActionNo] = useState("1");
    const [error, setError] = useState('');

    const [showCarSuccessModal, setShowCarSuccessModal] = useState(false);
    const [showDraftCarSuccessModal, setShowDraftCarSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimateClass('opacity-100 scale-100');
            fetchRootCauses();
            fetchUsers();
            fetchNextActionNumber();
            fetchSuppliers();
        } else {
            setAnimateClass('opacity-0 scale-95');
        }
    }, [isOpen]);

    // Fetch suppliers
    const fetchSuppliers = async () => {
        try {
            setIsLoading(true);
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/qms/suppliers/company/${companyId}/`);
            // Filter only active suppliers with Approved status
            const activeSuppliers = response.data.filter(supplier =>
                supplier.active === 'active'
            );
            setSuppliers(activeSuppliers);
        } catch (err) {
            console.error('Error fetching suppliers:', err);
            let errorMsg = err.message;

            if (err.response) {
                // Check for field-specific errors first
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                // Check for non-field errors
                else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                }
                else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
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

    const handleOpenRootCauseModal = () => {
        setIsRootCauseModalOpen(true);
    };

    const handleCloseRootCauseModal = (newCauseAdded = false) => {
        setIsRootCauseModalOpen(false);
        if (newCauseAdded) {
            fetchRootCauses(); // Refresh root causes when a new one is added
        }
    };

    const [formData, setFormData] = useState({
        source: '',
        title: '',
        next_action_no: '', // Initialize with "1" as default
        root_cause: '',
        executor: '',
        description: '',
        action_or_corrections: '',
        supplier: '', // Added supplier field
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
        is_draft: false
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    // New function to fetch the next available action number
    const fetchNextActionNumber = async () => {
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                // If no company ID, default to empty string
                setNextActionNo("1");
                setFormData(prevData => ({
                    ...prevData,
                    next_action_no: "1"
                }));
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/car-number/next-action/${companyId}/`);
            if (response.data && response.data.next_action_no) {  // Changed from next_action_number to next_action_no
                // Convert to string to ensure consistent display
                const actionNumber = String(response.data.next_action_no);
                setNextActionNo(actionNumber);

                console.log('Action Number:', actionNumber);

                // Update the form data with the new action number
                setFormData(prevData => ({
                    ...prevData,
                    next_action_no: actionNumber
                }));
            } else {
                // If response doesn't contain a valid number, default to "1"
                setNextActionNo("1");
                setFormData(prevData => ({
                    ...prevData,
                    next_action_no: "1"
                }));
            }
        } catch (error) {
            console.error('Error fetching next action number:', error);
            // Set a fallback value if the API fails
            setNextActionNo("1");
            setFormData(prevData => ({
                ...prevData,
                next_action_no: "1"
            }));
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
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
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
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


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Skip changes to next_action_no field since it's auto-generated
        if (name === 'next_action_no') return;

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
        } else if (e.target.type === 'checkbox') {
            // Handle checkboxes
            setFormData({
                ...formData,
                [name]: e.target.checked
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

    const handleSubmit = async (e, asDraft = false) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const companyId = getUserCompanyId();

            // Format the dates
            const dateRaised = formatDate(formData.date_raised);
            const dateCompleted = formatDate(formData.date_completed);

            // Prepare submission data
            const submissionData = {
                company: companyId,
                title: formData.title,
                source: formData.source,
                root_cause: formData.root_cause,
                description: formData.description,
                date_raised: dateRaised,
                date_completed: dateCompleted,
                status: formData.status,
                executor: formData.executor,
                next_action_no: formData.next_action_no, // Use the action number from form data
                action_or_corrections: formData.action_or_corrections,
                send_notification: formData.send_notification,
                is_draft: asDraft
            };

            // Add supplier only if source is 'Supplier'
            if (formData.source === 'Supplier') {
                submissionData.supplier = formData.supplier;
            }

            // Submit to API
            const response = await axios.post(`${BASE_URL}/qms/car-numbers/`, submissionData);

            console.log('Added CAR:', submissionData);


            setIsLoading(false);
            onClose();
            if (onSuccess) onSuccess(response.data);

            // Reset form and fetch new action number for next time
            setFormData({
                source: '',
                title: '',
                next_action_no: '1', // Reset to default
                root_cause: '',
                executor: '',
                description: '',
                action_or_corrections: '',
                supplier: '',
                date_raised: { day: '', month: '', year: '' },
                date_completed: { day: '', month: '', year: '' },
                status: 'Pending',
                send_notification: false,
                is_draft: false
            });

            // After successful submission, fetch the next action number for next time
            fetchNextActionNumber();
            setShowCarSuccessModal(true);
            setTimeout(() => {
                setShowCarSuccessModal(false);
            }, 3000);

        } catch (error) {
            console.error('Error submitting form:', error);
            setIsLoading(false);
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

    if (!isOpen) return null;

    const handleDraftSave = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError('');
            const companyId = getUserCompanyId();
            const userId = getRelevantUserId(); // Get the user ID

            // Format the dates
            const dateRaised = formatDate(formData.date_raised);
            const dateCompleted = formatDate(formData.date_completed);

            // Prepare submission data
            const submissionData = {
                company: companyId,
                title: formData.title,
                source: formData.source,
                root_cause: formData.root_cause,
                description: formData.description,
                date_raised: dateRaised,
                date_completed: dateCompleted,
                status: formData.status,
                executor: formData.executor,
                next_action_no: formData.next_action_no,
                action_or_corrections: formData.action_or_corrections,
                send_notification: formData.send_notification,
                is_draft: true,
                user: userId  // Add the user ID to the submission data
            };

            // Add supplier only if source is 'Supplier'
            if (formData.source === 'Supplier') {
                submissionData.supplier = formData.supplier;
            }

            // Submit to draft-specific API endpoint
            const response = await axios.post(`${BASE_URL}/qms/car/draft-create/`, submissionData);

            console.log('Saved CAR Draft:', response.data);

            setIsLoading(false);
            setShowDraftCarSuccessModal(true);
            setTimeout(() => {
                setShowDraftCarSuccessModal(false);
            }, 3000);

        } catch (error) {
            console.error('Error saving draft:', error);
            setIsLoading(false);
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 overflow-y-scroll">
            <div className={`bg-[#1C1C24] text-white rounded-[4px] w-[1014px] p-5 transform transition-all duration-300 ${animateClass}`}>
                <div className="flex justify-start items-center border-b border-[#383840] px-[104px] pb-5">
                    <h1 className="add-training-head">Add Corrective Action</h1>

                    <RootCauseModal
                        isOpen={isRootCauseModalOpen}
                        onClose={handleCloseRootCauseModal}
                    />

                    <AddCarNoSuccessModal
                        showCarSuccessModal={showCarSuccessModal}
                        onClose={() => {
                            setShowCarSuccessModal(false);
                        }}
                    />

                    <DraftCarNoSuccessModal
                        showDraftCarSuccessModal={showDraftCarSuccessModal}
                        onClose={() => {
                            setShowDraftCarSuccessModal(false);
                        }}
                    />

                    <ErrorModal
                        showErrorModal={showErrorModal}
                        onClose={() => {
                            setShowErrorModal(false);
                        }}
                        error={error}
                    />

                </div>
                <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                    <div className="flex flex-col gap-3 relative">
                        <label className="add-training-label">Source <span className="text-red-500">*</span></label>
                        <select
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("source")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            required
                        >
                            <option value="" disabled>Select</option>
                            <option value="Audit">Audit</option>
                            <option value="Customer">Customer</option>
                            <option value="Internal">Internal</option>
                            <option value="Supplier">Supplier</option>
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "source" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
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
                            className="add-training-inputs focus:outline-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">
                            Action No
                        </label>
                        <input
                            type="text"
                            name="next_action_no"
                            value={formData.next_action_no} // Use formData.next_action_no directly
                            className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
                            readOnly
                            title="Auto-generated action number"
                        />
                    </div>

                    {formData.source === 'Supplier' ? (
                        <div className="flex flex-col gap-3 relative">
                            <label className="add-training-label">Supplier <span className="text-red-500">*</span></label>
                            <select
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("supplier")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                required
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

                    {/* Rest of the form remains the same */}
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
                            {/* Day */}
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

                            {/* Month */}
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

                            {/* Year */}
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
                            {/* Day */}
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

                            {/* Month */}
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

                            {/* Year */}
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
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "status" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>

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

                    {/* Form Actions */}
                    <div className="md:col-span-2 flex gap-4 justify-between">
                        <div>
                            <button
                                type="button"
                                onClick={handleDraftSave}
                                className='request-correction-btn duration-200'>
                                Save as Draft
                            </button>
                        </div>
                        <div className='flex gap-5'>
                            <button
                                type="button"
                                onClick={onClose}
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
        </div>
    )
}
export default AddCarNumberModal