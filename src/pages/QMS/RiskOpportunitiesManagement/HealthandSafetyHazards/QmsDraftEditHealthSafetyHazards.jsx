import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import EditDraftQmsManualSuccessModal from './Modals/EditDraftQmsManualSuccessModal';
import ProcessTypeModal from './ProcessTypeModal';
const QmsDraftEditHealthSafetyHazards = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hazardDetails, setHazardDetails] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isProcessTypeModalOpen, setIsProcessTypeModalOpen] = useState(false);
    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const [showEditDraftHazardSuccessModal, setShowEditDraftHazardSuccessModal] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        written_by: '',
        checked_by: '',
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

    const companyId = getUserCompanyId();

    useEffect(() => {
        if (companyId && id) {
            fetchHazardDetails();
        }
    }, [companyId, id]);

    useEffect(() => {
        if (hazardDetails) {
            setFormData({
                title: hazardDetails.title || '',
                written_by: hazardDetails.written_by?.id || null,
                hazard_no: hazardDetails.hazard_no || '', // Use existing Hazard Number
                checked_by: hazardDetails.checked_by?.id || null,
                approved_by: hazardDetails.approved_by?.id || null,
                hazard_source: hazardDetails.hazard_source || '',
                legal_requirement: hazardDetails.legal_requirement || '',
                risk_level: hazardDetails.risk_level || '',
                date: hazardDetails.date || `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
                description: hazardDetails.description || '',
                action: hazardDetails.action || '',
                related_process: hazardDetails.related_process || '',
                send_notification_to_checked_by: hazardDetails.send_notification_to_checked_by || false,
                send_email_to_checked_by: hazardDetails.send_email_to_checked_by || false,
                send_notification_to_approved_by: hazardDetails.send_notification_to_approved_by || false,
                send_email_to_approved_by: hazardDetails.send_email_to_approved_by || false,
            });
        }
    }, [hazardDetails]);

    const fetchHazardDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/qms/health-detail/${id}/`);
            setHazardDetails(response.data);
            setIsInitialLoad(false);
            console.log("Hazard Details:", response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching hazard details:", err);
            setError("Failed to load hazard details");
            setIsInitialLoad(false);
            setLoading(false);
        }
    };

    const riskLevel = [
        'High',
        'Medium',
        'Low',
    ];

    const [formData, setFormData] = useState({
        title: '',
        written_by: null,
        hazard_no: '',
        checked_by: null,
        approved_by: null,
        hazard_source: '',
        legal_requirement: '',
        risk_level: '',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
        description: '',
        action: '',
        related_process: '',
        send_notification_to_checked_by: false,
        send_email_to_checked_by: false,
        send_notification_to_approved_by: false,
        send_email_to_approved_by: false,
    });

    const [openDropdowns, setOpenDropdowns] = useState({
        written_by: false,
        checked_by: false,
        approved_by: false,
        risk_level: false,
        day: false,
        month: false,
        year: false,
    });

    useEffect(() => {
        if (companyId) {
            fetchUsers();
        }
    }, [companyId]);

    const fetchUsers = async () => {
        try {
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/company/users/${companyId}/`);
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

    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    const parseDate = () => {
        const dateObj = new Date(formData.date);
        return {
            day: dateObj.getDate(),
            month: dateObj.getMonth() + 1,
            year: dateObj.getFullYear()
        };
    };

    const dateParts = parseDate();

    const days = Array.from(
        { length: getDaysInMonth(dateParts.month, dateParts.year) },
        (_, i) => i + 1
    );

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const years = Array.from(
        { length: 21 },
        (_, i) => currentYear - 10 + i
    );

    const toggleDropdown = (dropdown) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...fieldErrors };

        if (!formData.written_by) {
            newErrors.written_by = 'Written/Prepare By is required';
            isValid = false;
        }

        if (!formData.checked_by) {
            newErrors.checked_by = 'Checked/Reviewed By is required';
            isValid = false;
        }

        setFieldErrors(newErrors);
        return isValid;
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleOpenProcessTypeModal = () => {
        setIsProcessTypeModalOpen(true);
    };

    const handleCloseProcessTypeModal = (newProcessAdded = false) => {
        setIsProcessTypeModalOpen(false);
        if (newProcessAdded) {
            // Optionally fetch updated process list if needed
        }
    };

    const handleDropdownChange = (e, dropdown) => {
        const value = e.target.value;

        if (dropdown === 'day' || dropdown === 'month' || dropdown === 'year') {
            const dateObj = parseDate();
            dateObj[dropdown] = parseInt(value, 10);
            const newDate = `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
            setFormData(prev => ({
                ...prev,
                date: newDate
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [dropdown]: value
            }));

            if (fieldErrors[dropdown]) {
                setFieldErrors(prev => ({
                    ...prev,
                    [dropdown]: ''
                }));
            }
        }

        setOpenDropdowns(prev => ({ ...prev, [dropdown]: false }));
    };

    const handleCancelClick = () => {
        navigate('/company/qms/draft-health-safety-hazards');
    };

    const handleListDraftHealthSafetyHazards = () => {
        navigate('/company/qms/draft-health-safety-hazards');
    }

    const getMonthName = (monthNum) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthNum - 1];
    };

    const formatUserName = (user) => {
        return `${user.first_name} ${user.last_name}`;
    };

    const handleUpdateClick = async () => {
        if (!validateForm()) {
            setError('Please fill in all required fields');
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
            submitData.append('company', companyId);

            const apiFormData = {
                ...formData,
                send_system_checked: formData.send_notification_to_checked_by ? 'Yes' : 'No',
                send_email_checked: formData.send_email_to_checked_by ? 'Yes' : 'No',
                send_system_approved: formData.send_notification_to_approved_by ? 'Yes' : 'No',
                send_email_approved: formData.send_email_to_approved_by ? 'Yes' : 'No'
            };

            if (formData.approved_by === null || formData.approved_by === '') {
                delete apiFormData.approved_by;
            } else if (typeof formData.approved_by === 'string') {
                apiFormData.approved_by = parseInt(formData.approved_by, 10);
            }

            Object.keys(apiFormData).forEach(key => {
                if (key !== 'send_notification_to_checked_by' &&
                    key !== 'send_email_to_checked_by' &&
                    key !== 'send_notification_to_approved_by' &&
                    key !== 'send_email_to_approved_by') {
                    submitData.append(key, apiFormData[key]);
                }
            });

            const response = await axios.put(`${BASE_URL}/qms/health/create/${id}/`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            setShowEditDraftHazardSuccessModal(true);
            setTimeout(() => {
                setShowEditDraftHazardSuccessModal(false);
                navigate('/company/qms/list-health-safety-hazards');
            }, 2000);

        } catch (err) {
            setLoading(false);
            setError('Failed to update hazard');
            console.error('Error updating hazard:', err);
        }
    };

    const errorTextClass = "text-red-500 text-sm mt-1";

    return (
        <div className="bg-[#1C1C24] rounded-lg text-white p-5">
            <div>
                <div className="flex justify-between items-center border-b border-[#383840] px-[124px] pb-5">
                    <h1 className="add-training-head">Edit Draft Health and Safety Hazards</h1>
                    <button
                        className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                        onClick={handleListDraftHealthSafetyHazards}
                    >
                        List Draft Health and Safety Hazards
                    </button>
                </div>

                <EditDraftQmsManualSuccessModal
                    showEditDraftManualSuccessModal={showEditDraftHazardSuccessModal}
                    onClose={() => { setShowEditDraftHazardSuccessModal(false) }}
                />

                <ProcessTypeModal
                    isOpen={isProcessTypeModalOpen}
                    onClose={handleCloseProcessTypeModal}
                />

                <div className="mx-[18px] pt-[22px] px-[104px]">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="add-qms-manual-label">
                                Hazard Name/Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
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
                            {fieldErrors.written_by && <p className={errorTextClass}>{fieldErrors.written_by}</p>}
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Hazard No
                            </label>
                            <input
                                type="text"
                                name="hazard_no"
                                value={formData.hazard_no}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs cursor-not-allowed"
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
                                        <div className="ml-5 flex items-center h-[24px]">
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
                                        <div className="ml-5 flex items-center h-[24px]">
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
                                {fieldErrors.checked_by && <p className={errorTextClass}>{fieldErrors.checked_by}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Hazard Source
                            </label>
                            <input
                                type="text"
                                name="hazard_source"
                                value={formData.hazard_source}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
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
                                Date Entered
                            </label>
                            <div className="flex space-x-5">
                                <div className="relative w-1/3">
                                    <select
                                        className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                        value={dateParts.day}
                                        onFocus={() => toggleDropdown('day')}
                                        onChange={(e) => handleDropdownChange(e, 'day')}
                                        onBlur={() => setOpenDropdowns(prev => ({ ...prev, day: false }))}
                                    >
                                        {days.map(day => (
                                            <option key={`day-${day}`} value={day}>
                                                {day < 10 ? `0${day}` : day}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.day ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                <div className="relative w-1/3">
                                    <select
                                        className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                        value={dateParts.month}
                                        onFocus={() => toggleDropdown('month')}
                                        onChange={(e) => handleDropdownChange(e, 'month')}
                                        onBlur={() => setOpenDropdowns(prev => ({ ...prev, month: false }))}
                                    >
                                        {months.map(month => (
                                            <option key={`month-${month}`} value={month}>
                                                {month < 10 ? `0${month}` : month} - {getMonthName(month).substring(0, 3)}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.month ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                <div className="relative w-1/3">
                                    <select
                                        className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                        value={dateParts.year}
                                        onFocus={() => toggleDropdown('year')}
                                        onChange={(e) => handleDropdownChange(e, 'year')}
                                        onBlur={() => setOpenDropdowns(prev => ({ ...prev, year: false }))}
                                    >
                                        {years.map(year => (
                                            <option key={`year-${year}`} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.year ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Hazard Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Level of Risk
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                    name="risk_level"
                                    value={formData.risk_level}
                                    onFocus={() => toggleDropdown('risk_level')}
                                    onChange={(e) => handleDropdownChange(e, 'risk_level')}
                                    onBlur={() => setOpenDropdowns(prev => ({ ...prev, risk_level: false }))}
                                >
                                    <option value="" disabled>Select Level of Risk</option>
                                    {riskLevel.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.risk_level ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>


                        <div>
                            <label className="add-qms-manual-label">
                                Action or Corrections
                            </label>
                            <textarea
                                name="action"
                                value={formData.action}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs !h-[98px] py-2"
                            />
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            <label className="add-training-label">Related Process/Activity</label>
                            <select
                                name="related_process"
                                value={formData.related_process}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("related_process")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>Select Related Process/Activity Type</option>
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                                                        ${focusedDropdown === "related_process" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                            <button
                                className='flex justify-start add-training-label !text-[#1E84AF]'
                                onClick={handleOpenProcessTypeModal}
                                type="button"
                            >
                                View / Add Process/Activities
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center mt-[22px] justify-end">
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
                                onClick={handleUpdateClick}
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
export default QmsDraftEditHealthSafetyHazards
