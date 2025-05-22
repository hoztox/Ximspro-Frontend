import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../../Utils/Config';
import RootCauseModal from './RootCauseModal';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsAddEnvironmentalIncidents = () => {
    const navigate = useNavigate();
    const [isRootCauseModalOpen, setIsRootCauseModalOpen] = useState(false);
    const [rootCauses, setRootCauses] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // For data fetching
    const [isSaveLoading, setIsSaveLoading] = useState(false); // For Save button
    const [isDraftLoading, setIsDraftLoading] = useState(false); // For Save as Draft button
    const [nextEino, setNextEino] = useState('1');
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);

    const sourceOptions = ['Internal', 'External', 'Customer', 'Regulatory'];

    const getUserCompanyId = () => {
        const storedCompanyId = localStorage.getItem('company_id');
        if (storedCompanyId) return storedCompanyId;
        const userRole = localStorage.getItem('role');
        if (userRole === 'user') {
            const userData = localStorage.getItem('user_company_id');
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch (e) {
                    console.error('Error parsing user company ID:', e);
                    return null;
                }
            }
        }
        return null;
    };

    const getRelevantUserId = () => {
        const userRole = localStorage.getItem('role');
        if (userRole === 'user') {
            const userId = localStorage.getItem('user_id');
            if (userId) return userId;
        }
        const companyId = localStorage.getItem('company_id');
        if (companyId) return companyId;
        return null;
    };

    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    const [formData, setFormData] = useState({
        source: '',
        title: '',
        next_ei_no: '',
        status: 'Pending',
        root_cause: '',
        report_by: '',
        description: '',
        action: '',
        date_raised: { day: '', month: '', year: '' },
        date_completed: { day: '', month: '', year: '' },
        remarks: '',
        send_notification: false,
        is_draft: false,
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    useEffect(() => {
        if (companyId) {
            fetchRootCauses();
            fetchUsers();
            fetchNextEiNumber();
        }
    }, [companyId]);

    const fetchNextEiNumber = async () => {
        try {
            if (!companyId) {
                setNextEino('1');
                setFormData((prev) => ({ ...prev, next_ei_no: '1' }));
                return;
            }
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL}/qms/incident/next-action/${companyId}/`);
            let eiNumber = '1';
            if (response.data.next_incident_no) {
                eiNumber = response.data.next_incident_no.replace('EI-', '');
            }
            setNextEino(eiNumber);
            setFormData((prev) => ({ ...prev, next_ei_no: eiNumber }));
        } catch (error) {
            console.error('Error fetching next EI number:', error);
            setNextEino('1');
            setFormData((prev) => ({ ...prev, next_ei_no: '1' }));
            setError('Failed to fetch next incident number');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRootCauses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL}/qms/incident-root/company/${companyId}/`);
            if (Array.isArray(response.data)) {
                setRootCauses(response.data);
            } else {
                setRootCauses([]);
                setError('Unexpected root cause data format');
            }
        } catch (error) {
            console.error('Error fetching root causes:', error);
            setError('Failed to fetch root causes');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            if (!companyId) return;
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
                setError('Unexpected user data format');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.source) errors.source = 'Source is required';
        if (!formData.title) errors.title = 'Incident Title is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'next_ei_no') return;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }

        setFormErrors((prev) => ({ ...prev, [name.split('.')[0]]: '' }));
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsSaveLoading(true);
            setError('');

            const dateRaised = formatDate(formData.date_raised);
            const dateCompleted = formData.date_completed.day ? formatDate(formData.date_completed) : null;

            const submissionData = {
                company: companyId,
                user: userId,
                source: formData.source,
                title: formData.title,
                incident_no: `EI-${formData.next_ei_no}`,
                status: formData.status,
                root_cause: formData.root_cause || null,
                reported_by: formData.report_by || null,
                description: formData.description || null,
                action: formData.action || null,
                date_raised: dateRaised,
                date_completed: dateCompleted,
                remarks: formData.remarks || null,
                send_notification: formData.send_notification,
            };

            await axios.post(`${BASE_URL}/qms/incident/create/`, submissionData);

            setIsSaveLoading(false);

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-environmantal-incident');
            }, 1500);
            setSuccessMessage("Environmental Incident Added Successfully")
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
            setIsSaveLoading(false);
        }
    };

    const handleDraftClick = async () => {
        try {
            setIsDraftLoading(true);
            setError('');

            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                setIsDraftLoading(false);
                return;
            }
            if (!userId) {
                setError('User ID not found. Please log in again.');
                setIsDraftLoading(false);
                return;
            }

            const dateRaised = formatDate(formData.date_raised);
            const dateCompleted = formData.date_completed.day ? formatDate(formData.date_completed) : null;

            const submissionData = {
                company: companyId,
                user: userId,
                source: formData.source || null,
                title: formData.title || null,
                incident_no: formData.next_ei_no ? `EI-${formData.next_ei_no}` : null,
                status: formData.status || 'Pending',
                root_cause: formData.root_cause || null,
                reported_by: formData.report_by || null,
                description: formData.description || null,
                action: formData.action || null,
                date_raised: dateRaised,
                date_completed: dateCompleted,
                remarks: formData.remarks || null,
                send_notification: formData.send_notification,
                is_draft: true,
            };

            await axios.post(`${BASE_URL}/qms/incident/draft-create/`, submissionData);

            setIsDraftLoading(false);

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/draft-environmantal-incident');
            }, 1500);
            setSuccessMessage("Environmental Incident Drafted Successfully")
        } catch (error) {
            console.error('Error saving draft incident:', error);
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
            setIsDraftLoading(false);
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
                <h1 className="add-training-head">Add Environmental Incident</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => navigate('/company/qms/list-environmantal-incident')}
                >
                    List Environmental Incidents
                </button>
            </div>

            <RootCauseModal
                isOpen={isRootCauseModalOpen}
                onClose={(newCauseAdded) => {
                    setIsRootCauseModalOpen(false);
                    if (newCauseAdded) fetchRootCauses();
                }}
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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">
                        Source <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select Source</option>
                        {sourceOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    {formErrors.source && <span className="text-red-500 text-sm">{formErrors.source}</span>}
                    <ChevronDown
                        className={`absolute right-3 top-[55px] transform transition-transform duration-300 ${focusedDropdown === 'source' ? 'rotate-180' : ''
                            }`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Incident Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                    {formErrors.title && <span className="text-red-500 text-sm">{formErrors.title}</span>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Incident No</label>
                    <input
                        type="text"
                        name="next_ei_no"
                        value={`EI-${formData.next_ei_no}`}
                        className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
                        readOnly
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown('status')}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Deleted">Deleted</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 ${focusedDropdown === 'status' ? 'rotate-180' : ''
                            }`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Root Cause</label>
                    <select
                        name="root_cause"
                        value={formData.root_cause}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown('root_cause')}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>
                            {isLoading ? 'Loading...' : 'Select Root Cause'}
                        </option>
                        {rootCauses.map((cause) => (
                            <option key={cause.id} value={cause.id}>{cause.title}</option>
                        ))}
                    </select>
                    <button
                        className="flex justify-start add-training-label !text-[#1E84AF] mt-1"
                        onClick={() => setIsRootCauseModalOpen(true)}
                        type="button"
                    >
                        View / Add Root Cause
                    </button>
                    <ChevronDown
                        className={`absolute right-3 top-[40%] transform transition-transform duration-300 ${focusedDropdown === 'root_cause' ? 'rotate-180' : ''
                            }`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Reported By</label>
                    <select
                        name="report_by"
                        value={formData.report_by}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown('report_by')}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>
                            {isLoading ? 'Loading...' : 'Select Reported By'}
                        </option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name || ''}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[40%] transform transition-transform duration-300 ${focusedDropdown === 'report_by' ? 'rotate-180' : ''
                            }`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Incident Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Action or Corrections {formData.status === 'Completed' && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                        name="action"
                        value={formData.action}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                    />
                    {formErrors.action && <span className="text-red-500 text-sm">{formErrors.action}</span>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Date Raised
                    </label>
                    <div className="grid grid-cols-3 gap-5">
                        <div className="relative">
                            <select
                                name="date_raised.day"
                                value={formData.date_raised.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown('date_raised.day')}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300 ${focusedDropdown === 'date_raised.day' ? 'rotate-180' : ''
                                    }`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date_raised.month"
                                value={formData.date_raised.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown('date_raised.month')}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300 ${focusedDropdown === 'date_raised.month' ? 'rotate-180' : ''
                                    }`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date_raised.year"
                                value={formData.date_raised.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown('date_raised.year')}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300 ${focusedDropdown === 'date_raised.year' ? 'rotate-180' : ''
                                    }`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                    {formErrors.date_raised && <span className="text-red-500 text-sm">{formErrors.date_raised}</span>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Complete By {formData.status === 'Completed' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="grid grid-cols-3 gap-5">
                        <div className="relative">
                            <select
                                name="date_completed.day"
                                value={formData.date_completed.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown('date_completed.day')}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300 ${focusedDropdown === 'date_completed.day' ? 'rotate-180' : ''
                                    }`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date_completed.month"
                                value={formData.date_completed.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown('date_completed.month')}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300 ${focusedDropdown === 'date_completed.month' ? 'rotate-180' : ''
                                    }`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date_completed.year"
                                value={formData.date_completed.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown('date_completed.year')}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300 ${focusedDropdown === 'date_completed.year' ? 'rotate-180' : ''
                                    }`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                    {formErrors.date_completed && <span className="text-red-500 text-sm">{formErrors.date_completed}</span>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Remarks</label>
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                    />
                </div>

                <div className="flex items-end justify-end mt-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="send_notification"
                            className="mr-2 form-checkboxes"
                            checked={formData.send_notification}
                            onChange={handleChange}
                        />
                        <span className="permissions-texts cursor-pointer">Send Notification</span>
                    </label>
                </div>

                <div className="md:col-span-2 flex gap-4 justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={handleDraftClick}
                            className="request-correction-btn duration-200"
                            disabled={isDraftLoading}
                        >
                            {isDraftLoading ? 'Saving Draft...' : 'Save as Draft'}
                        </button>
                    </div>
                    <div className="flex gap-5">
                        <button
                            type="button"
                            onClick={() => navigate('/company/qms/list-environmantal-incident')}
                            className="cancel-btn duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn duration-200"
                            disabled={isSaveLoading}
                        >
                            {isSaveLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QmsAddEnvironmentalIncidents;