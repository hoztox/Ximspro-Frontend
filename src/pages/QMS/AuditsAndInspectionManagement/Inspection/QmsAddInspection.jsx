import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsAddInspection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [error, setError] = useState(null);

    const [fieldErrors, setFieldErrors] = useState({
        title: false,
        inspection_type: false
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [companyId, setCompanyId] = useState(null);
    const [procedureOptions, setProcedureOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // Add search states
    const [procedureSearchTerm, setProcedureSearchTerm] = useState("");
    const [userSearchTerm, setUserSearchTerm] = useState("");

    // Add custom field states
    const [showCustomProcedureField, setShowCustomProcedureField] = useState(false);
    const [showCustomUserField, setShowCustomUserField] = useState(false);
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const [formData, setFormData] = useState({
        title: '',
        certification_body: '',
        inspector_from: '',
        check_inspector: false,
        inspection_type: '',
        area: '',
        procedures: [],
        inspector_from_internal: [],
        proposed_date: null,
        date_conducted: null,
        notes: '',
        upload_inspection_report: null,
        upload_non_coformities_report: null,
        proposedDate: {
            day: '',
            month: '',
            year: ''
        },
        dateConducted: {
            day: '',
            month: '',
            year: ''
        },
    });

    useEffect(() => {
        const fetchedCompanyId = getUserCompanyId();
        setCompanyId(fetchedCompanyId);

        // Fetch procedures and users
        fetchProcedures();
        fetchUsers();
    }, []);

    const fetchProcedures = async () => {
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                console.error("Company ID not found");
                return;
            }
            const response = await axios.get(`${BASE_URL}/qms/procedure-publish/${companyId}/`);
            setProcedureOptions(response.data);
        } catch (err) {
            console.error("Error fetching procedures:", err);
            let errorMsg = err.message;

            if (err.response) {
                // Check for field-specific errors first
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                // Check for non-field errors
                else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                } else if (err.response.data.message) {
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
            // Fallback procedure options
            setProcedureOptions([
                { id: 1, title: "Null" },
            ]);
        }
    };

    const fetchUsers = async () => {
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                console.error("Company ID not found");
                return;
            }
            const response = await axios.get(`${BASE_URL}/company/users/${companyId}/`);
            setUserOptions(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            let errorMsg = err.message;

            if (err.response) {
                // Check for field-specific errors first
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                // Check for non-field errors
                else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                } else if (err.response.data.message) {
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
        }
    };

    const getUserCompanyId = () => {
        // First check if company_id is stored directly
        const storedCompanyId = localStorage.getItem("company_id");
        if (storedCompanyId) return storedCompanyId;

        // If user data exists with company_id
        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            // Try to get company_id from user data that was stored during login
            const userData = localStorage.getItem("user_company_id");
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch (err) {
                    console.error("Error parsing user company ID:", err);
                    let errorMsg = err.message;

                    if (err.response) {
                        // Check for field-specific errors first
                        if (err.response.data.date) {
                            errorMsg = err.response.data.date[0];
                        }
                        // Check for non-field errors
                        else if (err.response.data.detail) {
                            errorMsg = err.response.data.detail;
                        } else if (err.response.data.message) {
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

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {
            title: !formData.title,
            inspection_type: !formData.inspection_type
        };

        setFieldErrors(errors);

        // If there are errors, don't submit
        if (errors.title || errors.inspection_type) {
            return;
        }

        setLoading(true);

        try {
            const userId = getRelevantUserId();
            const companyId = getUserCompanyId();
            console.log('Form Data State:', formData);
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            // Format dates properly
            const proposedDate = formData.proposedDate.year && formData.proposedDate.month && formData.proposedDate.day
                ? `${formData.proposedDate.year}-${formData.proposedDate.month}-${formData.proposedDate.day}`
                : null;

            const dateConducted = formData.dateConducted.year && formData.dateConducted.month && formData.dateConducted.day
                ? `${formData.dateConducted.year}-${formData.dateConducted.month}-${formData.dateConducted.day}`
                : null;

            const submissionData = new FormData();
            submissionData.append('company', companyId);
            submissionData.append('user', userId);
            submissionData.append('title', formData.title);
            submissionData.append('certification_body', formData.certification_body);
            submissionData.append('inspector_from', formData.inspector_from);
            submissionData.append('inspection_type', formData.inspection_type);
            submissionData.append('area', formData.area);
            submissionData.append('notes', formData.notes);

            if (proposedDate) {
                submissionData.append('proposed_date', proposedDate);
            }

            if (dateConducted) {
                submissionData.append('date_conducted', dateConducted);
            }


            if (showCustomProcedureField && formData.custom_procedures) {
                submissionData.append('custom_procedures', formData.custom_procedures);
            } else if (formData.procedures && formData.procedures.length > 0) {
                formData.procedures.forEach(procedureId => {
                    submissionData.append('procedures', procedureId);
                });
            }

            // Handle internal inspectors
            if (formData.check_inspector) {
                if (showCustomUserField && formData.custom_internal_inspectors) {
                    submissionData.append('custom_internal_inspectors', formData.custom_internal_inspectors);
                } else if (formData.inspector_from_internal && formData.inspector_from_internal.length > 0) {
                    formData.inspector_from_internal.forEach(userId => {
                        submissionData.append('inspector_from_internal', userId);
                    });
                }
            }

            const response = await axios.post(`${BASE_URL}/qms/inspection/create/`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-inspection');
            }, 1500);
            setSuccessMessage("Inspection Added Successfully")
        } catch (error) {
            console.error('Error submitting form:', error);
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
            setLoading(false);
        }
    };

    const handleProcedureCheckboxChange = (procedureId) => {
        setFormData(prevData => {
            const updatedProcedures = [...prevData.procedures];

            // If already selected, remove it
            if (updatedProcedures.includes(procedureId)) {
                return {
                    ...prevData,
                    procedures: updatedProcedures.filter(id => id !== procedureId)
                };
            }
            // Otherwise add it
            else {
                return {
                    ...prevData,
                    procedures: [...updatedProcedures, procedureId]
                };
            }
        });
    };

    const handleUserCheckboxChange = (userId) => {
        setFormData(prevData => {
            const updatedUsers = [...prevData.inspector_from_internal];

            // If already selected, remove it
            if (updatedUsers.includes(userId)) {
                return {
                    ...prevData,
                    inspector_from_internal: updatedUsers.filter(id => id !== userId)
                };
            }
            // Otherwise add it
            else {
                return {
                    ...prevData,
                    inspector_from_internal: [...updatedUsers, userId]
                };
            }
        });
    };

    // Handle procedure N/A option
    const handleProcedureNAChange = (e) => {
        const checked = e.target.checked;
        setShowCustomProcedureField(checked);

        if (checked) {
            // Clear selected procedures if N/A is checked
            setFormData(prev => ({
                ...prev,
                procedures: []
            }));
        } else {
            // Clear custom field if N/A is unchecked
            setFormData(prev => ({
                ...prev,
                custom_procedures: ""
            }));
        }
    };

    // Handle user N/A option
    const handleUserNAChange = (e) => {
        const checked = e.target.checked;
        setShowCustomUserField(checked);

        if (checked) {
            // Clear selected users if N/A is checked
            setFormData(prev => ({
                ...prev,
                inspector_from_internal: []
            }));
        } else {
            // Clear custom field if N/A is unchecked
            setFormData(prev => ({
                ...prev,
                custom_internal_inspectors: ""
            }));
        }
    };

    const handleSaveAsDraft = async () => {
        try {
            setDraftLoading(true);

            const companyId = getUserCompanyId();
            const userId = getRelevantUserId();

            if (!companyId || !userId) {
                setError('Company ID or User ID not found. Please log in again.');
                setDraftLoading(false);
                return;
            }

            // Format dates properly
            const proposedDate = formData.proposedDate.year && formData.proposedDate.month && formData.proposedDate.day
                ? `${formData.proposedDate.year}-${formData.proposedDate.month}-${formData.proposedDate.day}`
                : null;

            const dateConducted = formData.dateConducted.year && formData.dateConducted.month && formData.dateConducted.day
                ? `${formData.dateConducted.year}-${formData.dateConducted.month}-${formData.dateConducted.day}`
                : null;

            const submitData = new FormData();

            submitData.append('company', companyId);
            submitData.append('user', userId);
            submitData.append('is_draft', true);

            // Add other form fields
            submitData.append('title', formData.title);
            submitData.append('certification_body', formData.certification_body);
            submitData.append('inspector_from', formData.inspector_from);
            submitData.append('inspection_type', formData.inspection_type);
            submitData.append('area', formData.area);
            submitData.append('notes', formData.notes);

            if (proposedDate) {
                submitData.append('proposed_date', proposedDate);
            }

            if (dateConducted) {
                submitData.append('date_conducted', dateConducted);
            }

            // Handle multi-select procedures for draft
            if (showCustomProcedureField && formData.custom_procedures) {
                submitData.append('custom_procedures', formData.custom_procedures);
            } else if (formData.procedures && formData.procedures.length > 0) {
                formData.procedures.forEach(procedureId => {
                    submitData.append('procedures', procedureId);
                });
            }

            if (formData.check_inspector) {
                if (showCustomUserField && formData.custom_internal_inspectors) {
                    submitData.append('custom_internal_inspectors', formData.custom_internal_inspectors);
                } else if (formData.inspector_from_internal && formData.inspector_from_internal.length > 0) {
                    formData.inspector_from_internal.forEach(userId => {
                        submitData.append('inspector_from_internal', userId);
                    });
                }
            }

            console.log('Sending draft data:', Object.fromEntries(submitData.entries()));

            const response = await axios.post(
                `${BASE_URL}/qms/inspection/draft-create/`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setDraftLoading(false);

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/draft-inspection');
            }, 1500);
            setSuccessMessage("Inspection Drafted Successfully")

        } catch (err) {
            setDraftLoading(false);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg = err.message;

            if (err.response) {
                // Check for field-specific errors first
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                // Check for non-field errors
                else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }

            setError(errorMsg);
            console.error('Error saving Draft:', err.response?.data || err);
        }
    };

    const handleListInspection = () => {
        navigate('/company/qms/list-inspection')
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle checkbox specifically
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
            return;
        }

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

    const handleCancel = () => {
        navigate('/company/qms/list-inspection')
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

    // Filter procedures based on search term
    const filteredProcedures = procedureOptions.filter(procedure =>
        procedure.title.toLowerCase().includes(procedureSearchTerm.toLowerCase())
    );

    // Filter users based on search term
    const filteredUsers = userOptions.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <h1 className="add-training-head">Add Inspection</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
                    onClick={() => handleListInspection()}
                >
                    List Inspection
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
                        Inspection Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                    {fieldErrors.title && (
                        <p className="text-red-500 text-sm">Inspection Title is required</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Certification Body
                    </label>
                    <input
                        type="text"
                        name="certification_body"
                        value={formData.certification_body}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none" 
                    />
                </div>

                <div className="flex flex-col gap-3">
                    {!formData.check_inspector && (
                        <>
                            <label className="add-training-label">
                                Inspector From
                            </label>
                            <input
                                type="text"
                                name="inspector_from"
                                value={formData.inspector_from}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </>
                    )}
                    <div className="flex items-end justify-start">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="check_inspector"
                                className="mr-2 form-checkboxes"
                                checked={formData.check_inspector}
                                onChange={handleChange}
                            />
                            <span className="permissions-texts cursor-pointer pr-3">
                                If not external inspector
                            </span>
                        </label>
                    </div>

                    {/* Conditionally render user selection when check_inspector is true */}
                    {formData.check_inspector && (
                        <div className="flex flex-col ">
                            <div className="relative mb-2">
                                <input
                                    type="text"
                                    value={userSearchTerm}
                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                    placeholder="Search inspectors..."
                                    className="w-full add-training-inputs pl-8 focus:outline-none"
                                />
                            </div>

                            <div className="border border-[#383840] rounded-md p-2 max-h-[130px] overflow-y-auto">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <div key={user.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`procedure-${user.id}`}
                                                className="mr-2 form-checkboxes"
                                                checked={formData.inspector_from_internal.includes(user.id)}
                                                onChange={() => handleUserCheckboxChange(user.id)}
                                            />
                                            <label
                                                htmlFor={`procedure-${user.id}`}
                                                className="permissions-texts cursor-pointer"
                                            >
                                                {user.first_name} {user.last_name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 mt-2 not-found">No Inspectors Found</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Inspection Type <span className="text-red-500">*</span></label>
                    <select
                        name="inspection_type"
                        value={formData.inspection_type}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("inspection_type")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select</option>
                        <option value="Internal">Internal</option>
                        <option value="External">External</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[50px] transform transition-transform duration-300 
                        ${focusedDropdown === "inspection_type" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                    {fieldErrors.inspection_type && (
                        <p className="text-red-500 text-sm">Inspection Type is required</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Area / Function:
                    </label>
                    <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block mb-3 add-qms-manual-label">
                        Procedure
                    </label>

                    <div className="relative mb-2">
                        <input
                            type="text"
                            value={procedureSearchTerm}
                            onChange={(e) => setProcedureSearchTerm(e.target.value)}
                            placeholder="Search procedures..."
                            className="w-full add-qms-intertested-inputs pl-8"
                        />
                    </div>

                    <div className="border border-[#383840] rounded-md p-2 max-h-[130px] overflow-y-auto">
                        {filteredProcedures.length > 0 ? (
                            filteredProcedures.map((option) => (
                                <div key={option.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`procedure-${option.id}`}
                                        className="mr-2 form-checkboxes"
                                        checked={formData.procedures.includes(option.id)}
                                        onChange={() => handleProcedureCheckboxChange(option.id)}
                                    />
                                    <label
                                        htmlFor={`procedure-${option.id}`}
                                        className="permissions-texts cursor-pointer"
                                    >
                                        {option.title}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p className="not-found mt-2">No Procedures Found</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Proposed Date for Inspection</label>
                    <div className="grid grid-cols-3 gap-5">
                        {/* Day */}
                        <div className="relative">
                            <select
                                name="proposedDate.day"
                                value={formData.proposedDate.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("proposedDate.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "proposedDate.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Month */}
                        <div className="relative">
                            <select
                                name="proposedDate.month"
                                value={formData.proposedDate.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("proposedDate.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "proposedDate.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Year */}
                        <div className="relative">
                            <select
                                name="proposedDate.year"
                                value={formData.proposedDate.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("proposedDate.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "proposedDate.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Date Conducted</label>
                    <div className="grid grid-cols-3 gap-5">
                        {/* Day */}
                        <div className="relative">
                            <select
                                name="dateConducted.day"
                                value={formData.dateConducted.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("dateConducted.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "dateConducted.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Month */}
                        <div className="relative">
                            <select
                                name="dateConducted.month"
                                value={formData.dateConducted.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("dateConducted.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "dateConducted.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Year */}
                        <div className="relative">
                            <select
                                name="dateConducted.year"
                                value={formData.dateConducted.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("dateConducted.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "dateConducted.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">
                            Notes
                        </label>
                        <input
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="add-training-inputs focus:outline-none "
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-4 justify-between mt-4">
                    <div>
                        <button
                            type="button"
                            onClick={handleSaveAsDraft}
                            disabled={draftLoading}
                            className='request-correction-btn duration-200'
                        >
                            {draftLoading ? 'Saving...' : 'Save as Draft'}
                        </button>
                    </div>
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
                            disabled={loading}
                            className="save-btn duration-200"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default QmsAddInspection;