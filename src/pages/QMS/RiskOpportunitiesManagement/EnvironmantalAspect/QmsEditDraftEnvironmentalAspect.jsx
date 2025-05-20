import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import ProcessTypeModal from './ProcessTypeModal';
import EditDraftQmsManualSuccessModal from './Modals/EditDraftQmsManualSuccessModal';
import ErrorModal from './Modals/ErrorModal';


const QmsEditDraftEnvironmentalAspect = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const [users, setUsers] = useState([]);
    const [processActivities, setProcessActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const [isProcessTypeModalOpen, setIsProcessTypeModalOpen] = useState(false);
    const [showEditDraftManualSuccessModal, setShowEditDraftManualSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [corrections, setCorrections] = useState([]);

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

    const [formData, setFormData] = useState({
        aspect_source: '',
        title: '',
        aspect_no: '',
        process_activity: '',
        legal_requirement: '',
        description: '',
        action: '',
        send_notification_to_checked_by: false,
        send_email_to_checked_by: false,
        send_notification_to_approved_by: false,
        send_email_to_approved_by: false,
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
        level_of_impact: '',
        written_by: '',
        checked_by: '',
        approved_by: '',
        publish: false
    });

    const [openDropdowns, setOpenDropdowns] = useState({
        written_by: false,
        checked_by: false,
        approved_by: false,
        level_of_impact: false,
        day: false,
        month: false,
        year: false,
        process_activity: false,
    });

    const [errors, setErrors] = useState({});

    const fetchEnvironmentalAspect = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/qms/aspect-detail/${id}/`);
            const data = response.data;

            const formattedDate = data.date
                ? data.date
                : `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

            setFormData({
                aspect_source: data.aspect_source || '',
                title: data.title || '',
                aspect_no: data.aspect_no || '',
                process_activity: data.process_activity?.id || '',
                legal_requirement: data.legal_requirement || '',
                description: data.description || '',
                action: data.action || '',
                send_notification_to_checked_by: data.send_notification_to_checked_by !== undefined ? data.send_notification_to_checked_by : false,
                send_email_to_checked_by: data.send_email_to_checked_by !== undefined ? data.send_email_to_checked_by : false,
                send_notification_to_approved_by: data.send_notification_to_approved_by !== undefined ? data.send_notification_to_approved_by : false,
                send_email_to_approved_by: data.send_email_to_approved_by !== undefined ? data.send_email_to_approved_by : false,
                date: formattedDate,
                level_of_impact: data.level_of_impact || '',
                written_by: data.written_by?.id || '',
                checked_by: data.checked_by?.id || '',
                approved_by: data.approved_by?.id || '',
                publish: data.publish || false
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching environmental aspect:', error);
            setError('Failed to load environmental aspect data');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            setLoading(false);
        }
    };

    const fetchManualCorrections = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/aspect/${id}/corrections/`);
            setCorrections(response.data);
            if (response.data.length > 0) {
                const latestCorrection = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
                setFormData(prev => ({ ...prev, action: latestCorrection.correction }));
            }
        } catch (error) {
            console.error("Error fetching manual corrections:", error);
        }
    };

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
            setError("Failed to load users. Please check your connection and try again.");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    const fetchProcessActivities = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/process-activity/company/${companyId}/`);
            if (Array.isArray(response.data)) {
                setProcessActivities(response.data);
            } else {
                setProcessActivities([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching process activities:", error);
            setError("Failed to load process activities.");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    useEffect(() => {
        if (companyId && id) {
            fetchUsers();
            fetchEnvironmentalAspect();
            fetchManualCorrections();
            fetchProcessActivities();
        }
    }, [companyId, id]);

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

    const validateForm = () => {
        const newErrors = {};

        // if (!formData.aspect_source.trim()) {
        //     newErrors.aspect_source = "Aspect Source is required";
        // }
        if (!formData.title.trim()) {
            newErrors.title = "Aspect Name/Title is required";
        }
        if (!formData.aspect_no.trim()) {
            newErrors.aspect_no = "Aspect Number is required";
        }
        if (!formData.process_activity) {
            newErrors.process_activity = "Process/Activity is required";
        }
        if (!formData.written_by) {
            newErrors.written_by = "Written/Prepared By is required";
        }
        if (!formData.checked_by) {
            newErrors.checked_by = "Checked/Reviewed By is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpenProcessTypeModal = () => {
        setIsProcessTypeModalOpen(true);
    };

    const handleCloseProcessTypeModal = (newProcessAdded = false) => {
        setIsProcessTypeModalOpen(false);
        if (newProcessAdded) {
            fetchProcessActivities();
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
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

            if (errors[dropdown]) {
                setErrors(prev => ({
                    ...prev,
                    [dropdown]: ''
                }));
            }
        }

        setOpenDropdowns(prev => ({ ...prev, [dropdown]: false }));
    };

    const handleListDraftEnvironmentalAspect = () => {
        navigate('/company/qms/draft-environmantal-aspect');
    };

    const handleUpdateClick = async () => {
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
            submitData.append('company', companyId);

            const apiFormData = {
                ...formData,
                send_system_checked: formData.send_notification_to_checked_by ? 'Yes' : 'No',
                send_email_checked: formData.send_email_to_checked_by ? 'Yes' : 'No',
                send_system_approved: formData.send_notification_to_approved_by ? 'Yes' : 'No',
                send_email_approved: formData.send_email_to_approved_by ? 'Yes' : 'No'
            };

            if (formData.approved_by === '' || formData.approved_by === null) {
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

            await axios.put(`${BASE_URL}/qms/aspect-draft/create/${id}/`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            setShowEditDraftManualSuccessModal(true);
            setTimeout(() => {
                setShowEditDraftManualSuccessModal(false);
                navigate('/company/qms/list-environmantal-aspect');
            }, 2000);
        } catch (err) {
            setLoading(false);
            setError('Failed to update Environmental Aspect');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            console.error('Update error:', err);
        }
    };

    const formatUserName = (user) => {
        if (!user) return '';
        return `${user.first_name} ${user.last_name}`;
    };

    const getMonthName = (monthNum) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthNum - 1];
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
        <div className="bg-[#1C1C24] rounded-lg text-white p-5">
            <div className="flex justify-between items-center border-b border-[#383840] px-[124px] pb-5">
                <h1 className="add-training-head">Edit Draft Environmental Aspect</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={handleListDraftEnvironmentalAspect}
                >
                    List Draft Environmental Aspect
                </button>
            </div>

            <ProcessTypeModal
                isOpen={isProcessTypeModalOpen}
                onClose={handleCloseProcessTypeModal}
            />

            <EditDraftQmsManualSuccessModal
                showEditDraftManualSuccessModal={showEditDraftManualSuccessModal}
                onClose={() => setShowEditDraftManualSuccessModal(false)}
            />

            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={error}
            />


            <div className="mx-[18px] pt-[22px] px-[47px] 2xl:px-[104px]">
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="add-qms-manual-label">
                            Aspect Source
                        </label>
                        <input
                            type="text"
                            name="aspect_source"
                            value={formData.aspect_source}
                            onChange={handleChange}
                            className="w-full add-qms-manual-inputs"
                        />
                        {/* <ErrorMessage message={errors.aspect_source} /> */}
                    </div>

                    <div>
                        <label className="add-qms-manual-label">
                            Aspect Name/Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full add-qms-manual-inputs"
                        />
                        <ErrorMessage message={errors.title} />
                    </div>

                    <div>
                        <label className="add-qms-manual-label">
                            Aspect No <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="aspect_no"
                            value={formData.aspect_no}
                            onChange={handleChange}
                            className="w-full add-qms-manual-inputs cursor-not-allowed bg-gray-800"
                            readOnly
                        />
                        <ErrorMessage message={errors.aspect_no} />
                    </div>
                    <div></div>

                    <div className="flex flex-col gap-3 relative">
                        <label className="add-qms-manual-label">
                            Process/Activity <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="process_activity"
                            value={formData.process_activity}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("process_activity")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        >
                            <option value="" disabled>Select Process/Activity</option>
                            {processActivities.map(activity => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.title}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[50px] transform transition-transform duration-300
                                ${focusedDropdown === "process_activity" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                        <ErrorMessage message={errors.process_activity} />
                        <button
                            className='flex justify-start add-training-label !ателефон:[#1E84AF]'
                            onClick={handleOpenProcessTypeModal}
                            type="button"
                        >
                            View / Add Process/Activities
                        </button>
                    </div>

                    <div>
                        <label className="add-qms-manual-label">
                            Legal Requirement
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
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full add-qms-manual-inputs !h-[98px] py-2"
                        />
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

                    <div>
                        <label className="add-qms-manual-label">
                            Written/Prepared By <span className="text-red-500">*</span>
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
                                                onChange={handleChange}
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
                                                onChange={handleChange}
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
                                                onChange={handleChange}
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
                                                onChange={handleChange}
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
                            Level of Impact
                        </label>
                        <div className="relative">
                            <select
                                className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                name="level_of_impact"
                                value={formData.level_of_impact}
                                onFocus={() => toggleDropdown('level_of_impact')}
                                onChange={(e) => handleDropdownChange(e, 'level_of_impact')}
                                onBlur={() => setOpenDropdowns(prev => ({ ...prev, level_of_impact: false }))}
                            >
                                <option value="">Select Level of Impact</option>
                                {['Significant', 'Non Significant'].map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.level_of_impact ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="flex items-end mt-[22px] justify-end  ">
                        <div className='flex gap-[22px]'>
                            <button
                                className="cancel-btn duration-200"
                                onClick={handleListDraftEnvironmentalAspect}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="save-btn duration-200"
                                onClick={handleUpdateClick}
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default QmsEditDraftEnvironmentalAspect;