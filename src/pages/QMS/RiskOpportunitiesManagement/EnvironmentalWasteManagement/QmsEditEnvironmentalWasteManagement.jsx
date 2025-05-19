import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import EditQmsManualSuccessModal from './Modals/EditQmsManualSuccessModal';

const QmsEditEnvironmentalWasteManagement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [manualDetails, setManualDetails] = useState(null);
    const [corrections, setCorrections] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [showEditManualSuccessModal, setShowEditManualSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        location: '',
        wmp: '',
        send_notification_to_checked_by: false,
        send_email_to_checked_by: false,
        send_notification_to_approved_by: false,
        send_email_to_approved_by: false,
        originator: '',
        waste_category: '',
        waste_handling: '',
        waste_minimization: '',
        responsible_party: '',
        waste_type: '',
        legal_requirement: '',
        waste_quantity: '',
        remark: '',
        written_by: null,
        checked_by: null,
        approved_by: null,
    });

    const [openDropdowns, setOpenDropdowns] = useState({
        written_by: false,
        checked_by: false,
        approved_by: false,
        waste_category: false,
        waste_handling: false,
        waste_minimization: false,
    });

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
        if (manualDetails) {
            setFormData({
                location: manualDetails.location || '',
                wmp: manualDetails.wmp || '',
                written_by: manualDetails.written_by?.id || null,
                checked_by: manualDetails.checked_by?.id || null,
                approved_by: manualDetails.approved_by?.id || null,
                originator: manualDetails.originator || '',
                waste_category: manualDetails.waste_category || '',
                waste_handling: manualDetails.waste_handling || '',
                waste_minimization: manualDetails.waste_minimization || '',
                responsible_party: manualDetails.responsible_party || '',
                waste_type: manualDetails.waste_type || '',
                legal_requirement: manualDetails.legal_requirement || '',
                waste_quantity: manualDetails.waste_quantity || '',
                remark: manualDetails.remark || '',
                send_notification_to_checked_by: manualDetails.send_notification_to_checked_by || true,
                send_email_to_checked_by: manualDetails.send_email_to_checked_by || true,
                send_notification_to_approved_by: manualDetails.send_notification_to_approved_by || true,
                send_email_to_approved_by: manualDetails.send_email_to_approved_by || true,
            });
        }
    }, [manualDetails]);

    useEffect(() => {
        if (companyId) {
            fetchUsers();
        }
    }, [companyId]);

    useEffect(() => {
        if (companyId && id) {
            fetchManualDetails();
            fetchManualCorrections();
        }
    }, [companyId, id]);

    const fetchUsers = async () => {
        try {
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
                console.error("Unexpected response format:", response.data);
                setError("Unable to load users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users. Please check your connection and try again.");
            setUsers([]);
        }
    };

    const fetchManualDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/waste-detail/${id}/`);
            setManualDetails(response.data);
            setIsInitialLoad(false);
            console.log("Manual Details:", response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching waste management details:", err);
            setError("Failed to load waste management details");
            setIsInitialLoad(false);
            setLoading(false);
        }
    };

    const fetchManualCorrections = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/waste/${id}/corrections/`);
            setCorrections(response.data);
            console.log("Fetched Manual Corrections:", response.data);
        } catch (error) {
            console.error("Error fetching manual corrections:", error);
        }
    };

    const wasteCategory = [
        ('Hazardous', 'Hazardous'),
        ('Non Hazardous', 'Non Hazardous'),
    ];

    const wasteHandling = [
        ('Company', 'Company'),
        ('Client', 'Client'),
        ('Contractor', 'Contractor'),
        ('Third Party/Others', 'Third Party/Others'),
    ];

    const wasteMinimization = [
        ('Reuse', 'Reuse'),
        ('Recycle', 'Recycle'),
        ('Recovery', 'Recovery'),
        ('Disposal', 'Disposal'),
        ('Non Disposable', 'Non Disposable'),
    ];

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

    const handleDropdownChange = (e, dropdown) => {
        const value = e.target.value;

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

        setOpenDropdowns(prev => ({ ...prev, [dropdown]: false }));
    };

    const handleListEnvironmentalWasteManagement = () => {
        navigate('/company/qms/list-environmantal-waste-management');
    };

    const handleCancelClick = () => {
        navigate('/company/qms/list-environmantal-waste-management');
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

            const response = await axios.put(`${BASE_URL}/qms/waste/${id}/update/`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            setShowEditManualSuccessModal(true);
            setTimeout(() => {
                setShowEditManualSuccessModal(false);
                navigate('/company/qms/list-environmantal-waste-management');
            }, 2000);

        } catch (err) {
            setLoading(false);
            setError('Failed to update waste management record');
            console.error('Error updating waste management record:', err);
        }
    };

    const formatUserName = (user) => {
        return `${user.first_name} ${user.last_name}`;
    };

    const errorTextClass = "text-red-500 text-sm mt-1";

    return (
        <div className="bg-[#1C1C24] rounded-lg text-white">
            <div>
                <div className='flex items-center justify-between px-[65px] 2xl:px-[122px]'>
                    <h1 className="add-manual-sections !px-0">Edit Environmental Waste Management</h1>
                    <button
                        className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleListEnvironmentalWasteManagement}
                    >
                        <span>List Environmental Waste Management</span>
                    </button>
                </div>

                <EditQmsManualSuccessModal
                    showEditManualSuccessModal={showEditManualSuccessModal}
                    onClose={() => { setShowEditManualSuccessModal(false) }}
                />

                <div className="border-t border-[#383840] mx-[18px] pt-[22px] px-[47px] 2xl:px-[104px]">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="add-qms-manual-label">
                                Location/Site Name
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
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
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QmsEditEnvironmentalWasteManagement;