import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import AddQmsManualSuccessModal from './Modals/AddQmsManualSuccessModal';
import AddQmsManualDraftSuccessModal from './Modals/AddQmsManualDraftSuccessModal';
import AddQmsManualDraftErrorModal from './Modals/AddQmsManualDraftErrorModal';

const QmsAddEnvironmentalWasteManagement = () => {
    const navigate = useNavigate()
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextWmpNo, setNextWmpNo] = useState("1");

    const [showAddManualSuccessModal, setShowAddManualSuccessModal] = useState(false);
    const [showDraftManualSuccessModal, setShowDraftManualSuccessModal] = useState(false);
    const [showDraftManualErrorModal, setShowDarftManualErrorModal] = useState(false);

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
    console.log("Stored Company ID:", companyId);

    const [formData, setFormData] = useState({
        location: '',
        wmp: 'WMP-1', // Initialize with default WMP No
        send_notification_to_checked_by: true,
        send_email_to_checked_by: true,
        send_notification_to_approved_by: true,
        send_email_to_approved_by: true,
        originator: '',
        waste_category: '',
        waste_handling: '',
        waste_minimization: '',
        responsible_party: '',
        waste_type: '',
        legal_requirement: '',
        waste_quantity: '',
        remark: '',
    });

    const [openDropdowns, setOpenDropdowns] = useState({
        written_by: false,
        checked_by: false,
        approved_by: false,
        waste_category: false,
        waste_handling: false,
        waste_minimization: false,
    });

    useEffect(() => {
        if (companyId) {
            fetchUsers();
            fetchNextWmpNumber();
        }
    }, [companyId]);

    const fetchUsers = async () => {
        try {
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
            console.log("API Response:", response.data);

            if (Array.isArray(response.data)) {
                setUsers(response.data);
                console.log("Users loaded:", response.data);
            } else {
                setUsers([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load record formats. Please check your connection and try again.");
        }
    };

    const fetchNextWmpNumber = async () => {
        try {
            if (!companyId) {
                setNextWmpNo("1");
                setFormData(prevData => ({
                    ...prevData,
                    wmp: "WMP-1"
                }));
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/waste/next-action/${companyId}/`);
            if (response.data && response.data.next_wmp_no) {
                const wmpNumber = String(response.data.next_wmp_no);
                setNextWmpNo(wmpNumber);
                setFormData(prevData => ({
                    ...prevData,
                    wmp: `${wmpNumber}`
                }));
            } else {
                setNextWmpNo("1");
                setFormData(prevData => ({
                    ...prevData,
                    wmp: "WMP-1"
                }));
            }
        } catch (error) {
            console.error('Error fetching next WMP number:', error);
            setNextWmpNo("1");
            setFormData(prevData => ({
                ...prevData,
                no: "WMP-1"
            }));
        }
    };

    const wasteCategory = [
        ('Hazardous', 'Hazardous'),
        ('Non Hazardous', 'Non Hazardous'),
    ]

    const wasteHandling = [
        ('Company', 'Company'),
        ('Client', 'Client'),
        ('Contractor', 'Contractor'),
        ('Third Party/Others', 'Third Party/Others'),
    ]

    const wasteMinimization = [
        ('Reuse', 'Reuse'),
        ('Recycle', 'Recycle'),
        ('Recovery', 'Recovery'),
        ('Disposal', 'Disposal'),
        ('Non Disposable', 'Non Disposable'),
    ]

    const toggleDropdown = (dropdown) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};

        if (!formData.location) {
            newErrors.location = "Location/Site Name is required";
        }

        if (!formData.written_by) {
            newErrors.written_by = "Written/Prepare By is required";
        }

        if (!formData.checked_by) {
            newErrors.checked_by = "Checked/Reviewed By is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleDropdownChange = (e, dropdown) => {
        const value = e.target.value;

        setFormData(prev => ({
            ...prev,
            [dropdown]: value
        }));

        if (errors[dropdown]) {
            setErrors(prev => ({
                ...prev,
                [dropdown]: ''
            }));
        }

        setOpenDropdowns(prev => ({ ...prev, [dropdown]: false }));
    };

    const handleListSustainability = () => {
        navigate('/company/qms/list-environmantal-waste-management')
    }

    const handleCancelClick = () => {
        navigate('/company/qms/list-environmantal-waste-management')
    }

    const handleSaveClick = async () => {
        if (!validateForm()) {
            setError('Please correct the errors below');
            return;
        }
        try {
            setLoading(true);

            const companyId = getUserCompanyId();
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            const submitData = new FormData();
            console.log("Environmental Waste Management Post ...................", formData)
            submitData.append('company', companyId);

            Object.keys(formData).forEach(key => {
                if (key === 'send_notification_to_checked_by' || key === 'send_notification_to_approved_by' ||
                    key === 'send_email_to_checked_by' || key === 'send_email_to_approved_by') {
                    submitData.append(key, formData[key]);
                    return;
                }
                submitData.append(key, formData[key]);
            });

            const response = await axios.post(`${BASE_URL}/qms/waste-create/`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            setShowAddManualSuccessModal(true);
            setTimeout(() => {
                setShowAddManualSuccessModal(false);
                navigate('/company/qms/list-environmantal-waste-management');
            }, 1500);

        } catch (err) {
            setLoading(false);
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
            setShowDarftManualErrorModal(true);
            setTimeout(() => {
                setShowDarftManualErrorModal(false);
            }, 3000);
        }
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

    const handleDraftClick = async () => {
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            const userId = getRelevantUserId();
            if (!userId) {
                setError('User ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            const submitData = new FormData();

            submitData.append('company', companyId);
            submitData.append('user', userId);
            submitData.append('is_draft', true);

            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await axios.post(`${BASE_URL}/qms/waste/draft-create/`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            setShowDraftManualSuccessModal(true);
            setTimeout(() => {
                setShowDraftManualSuccessModal(false);
                navigate('/company/qms/draft-environmantal-waste-management');
            }, 1500);

        } catch (err) {
            setLoading(false);
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
            setShowDarftManualErrorModal(true);
            setTimeout(() => {
                setShowDarftManualErrorModal(false);
            }, 3000);
            console.error('Error saving manual:', err);
        }
    };

    const formatUserName = (user) => {
        return `${user.first_name} ${user.last_name}`;
    };

    const ErrorMessage = ({ message }) => {
        if (!message) return null;
        return (
            <div className="text-red-500 text-sm mt-1">
                {message}
            </div>
        );
    };

    return (
        <div className="bg-[#1C1C24] rounded-lg text-white">
            <div>
                <div className='flex items-center justify-between  px-[65px] 2xl:px-[122px]'>
                    <h1 className="add-manual-sections !px-0">Add Environmental Waste Management</h1>
                    <button
                        className="flex items-center justify-center  add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleListSustainability}
                    >
                        <span>List Environmental Waste Management</span>
                    </button>
                </div>

                <AddQmsManualSuccessModal
                    showAddManualSuccessModal={showAddManualSuccessModal}
                    onClose={() => { setShowAddManualSuccessModal(false) }}
                />

                <AddQmsManualDraftSuccessModal
                    showDraftManualSuccessModal={showDraftManualSuccessModal}
                    onClose={() => { setShowDraftManualSuccessModal(false) }}
                />

                <AddQmsManualDraftErrorModal
                    showDraftManualErrorModal={showDraftManualErrorModal}
                    onClose={() => { setShowDarftManualErrorModal(false) }}
                    error={error}
                />

                <div className="border-t border-[#383840] mx-[18px] pt-[22px] px-[47px] 2xl:px-[104px]">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="add-qms-manual-label">
                                Location/Site Name  <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                            <ErrorMessage message={errors.location} />
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Written/Prepare By <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                    name="written_by"
                                    value={formData.written_by || ''}
                                    onFocus={() => toggleDropdown('written_by')}
                                    onChange={(e) => handleDropdownChange(e, 'written_by')}
                                    onBlur={() => setOpenDropdowns(prev => ({ ...prev, written_by: false }))}
                                >
                                    <option value="">Select User</option>
                                    {users.map(user => (
                                        <option key={`written-${user.id}`} value={user.id}>
                                            {formatUserName(user)}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.written_by ? 'rotate-180' : ''}`}
                                />
                            </div>
                            <ErrorMessage message={errors.written_by} />
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                WMP No
                            </label>
                            <input
                                type="text"
                                name="wmp"
                                value={formData.wmp}
                                className="w-full add-qms-manual-inputs cursor-not-allowed bg-gray-800"
                                readOnly
                            />
                        </div>

                        <div className="flex">
                            <div className="flex-grow">
                                <div className='flex items-center justify-between h-[24px]'>
                                    <label className="add-qms-manual-label">
                                        Checked/Reviewed By <span className="text-red-500">*</span>
                                    </label>
                                    <div className='flex items-end justify-end space-y-1'>
                                        <div className="ml-5 flex items-center h-[24px] ">
                                            <div className="flex items-center h-14 justify-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="send_notification_to_checked_by"
                                                    checked={formData.send_notification_to_checked_by}
                                                    onChange={handleCheckboxChange}
                                                    className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                                                />
                                                <label className="add-qms-manual-label check-label">System Notify</label>
                                            </div>
                                        </div>
                                        <div className="ml-5 flex items-center h-[24px] ">
                                            <div className="flex items-center h-14 justify-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="send_email_to_checked_by"
                                                    checked={formData.send_email_to_checked_by}
                                                    onChange={handleCheckboxChange}
                                                    className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                                                />
                                                <label className="add-qms-manual-label check-label">Email Notify</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select
                                        className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                        name="checked_by"
                                        value={formData.checked_by || ''}
                                        onFocus={() => toggleDropdown('checked_by')}
                                        onChange={(e) => handleDropdownChange(e, 'checked_by')}
                                        onBlur={() => setOpenDropdowns(prev => ({ ...prev, checked_by: false }))}
                                    >
                                        <option value="">Select User</option>
                                        {users.map(user => (
                                            <option key={`checked-${user.id}`} value={user.id}>
                                                {formatUserName(user)}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.checked_by ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                <ErrorMessage message={errors.checked_by} />
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Waste Category
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                    name="waste_category"
                                    value={formData.waste_category}
                                    onFocus={() => toggleDropdown('waste_category')}
                                    onChange={(e) => handleDropdownChange(e, 'waste_category')}
                                    onBlur={() => setOpenDropdowns(prev => ({ ...prev, waste_category: false }))}
                                >
                                    <option value="">Select Waste Category</option>
                                    {wasteCategory.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.waste_category ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        <div className="flex">
                            <div className="flex-grow">
                                <div className='flex items-center justify-between h-[24px]'>
                                    <label className="add-qms-manual-label">
                                        Approved By
                                    </label>
                                    <div className='flex items-end justify-end space-y-1'>
                                        <div className="ml-5 flex items-center h-[24px]">
                                            <div className="flex items-center h-14 justify-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="send_notification_to_approved_by"
                                                    checked={formData.send_notification_to_approved_by}
                                                    onChange={handleCheckboxChange}
                                                    className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                                                />
                                                <label className="add-qms-manual-label check-label">System Notify</label>
                                            </div>
                                        </div>
                                        <div className="ml-5 flex items-center h-[24px]">
                                            <div className="flex items-center h-14 justify-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="send_email_to_approved_by"
                                                    checked={formData.send_email_to_approved_by}
                                                    onChange={handleCheckboxChange}
                                                    className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                                                />
                                                <label className="add-qms-manual-label check-label">Email Notify</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select
                                        className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                        name="approved_by"
                                        value={formData.approved_by || ''}
                                        onFocus={() => toggleDropdown('approved_by')}
                                        onChange={(e) => handleDropdownChange(e, 'approved_by')}
                                        onBlur={() => setOpenDropdowns(prev => ({ ...prev, approved_by: false }))}
                                    >
                                        <option value="">Select User</option>
                                        {users.map(user => (
                                            <option key={`approved-${user.id}`} value={user.id}>
                                                {formatUserName(user)}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.approved_by ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Waste Handling
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                    name="waste_handling"
                                    value={formData.waste_handling}
                                    onFocus={() => toggleDropdown('waste_handling')}
                                    onChange={(e) => handleDropdownChange(e, 'waste_handling')}
                                    onBlur={() => setOpenDropdowns(prev => ({ ...prev, waste_handling: false }))}
                                >
                                    <option value="">Select Waste Handling</option>
                                    {wasteHandling.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.waste_handling ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Waste Minimization
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                    name="waste_minimization"
                                    value={formData.waste_minimization}
                                    onFocus={() => toggleDropdown('waste_minimization')}
                                    onChange={(e) => handleDropdownChange(e, 'waste_minimization')}
                                    onBlur={() => setOpenDropdowns(prev => ({ ...prev, waste_minimization: false }))}
                                >
                                    <option value="">Select Waste Minimization</option>
                                    {wasteMinimization.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.waste_minimization ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Originator
                            </label>
                            <input
                                type="text"
                                name="originator"
                                value={formData.originator}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Responsible Party
                            </label>
                            <input
                                type="text"
                                name="responsible_party"
                                value={formData.responsible_party}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-qms-manual-label">
                                Waste Type
                            </label>
                            <input
                                type="text"
                                name="waste_type"
                                value={formData.waste_type}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-qms-manual-label">
                                Applicable Legal Requirement
                            </label>
                            <input
                                type="text"
                                name="legal_requirement"
                                value={formData.legal_requirement}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-qms-manual-label">
                                Waste Quantity (Daily/Monthly)
                            </label>
                            <textarea
                                name="waste_quantity"
                                value={formData.waste_quantity}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs !h-[98px] py-2"
                            />
                        </div>
                        <div>
                            <label className="add-qms-manual-label">
                                Remark
                            </label>
                            <textarea
                                name="remark"
                                value={formData.remark}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs !h-[98px] py-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center mt-[22px] justify-between">
                        <div className='mb-6'>
                            <button
                                className="request-correction-btn duration-200"
                                onClick={handleDraftClick}
                            >
                                Save as Draft
                            </button>
                        </div>

                        <div className='flex gap-[22px] mb-6'>
                            <button
                                className="cancel-btn duration-200"
                                onClick={handleCancelClick}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="save-btn duration-200"
                                onClick={handleSaveClick}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QmsAddEnvironmentalWasteManagement