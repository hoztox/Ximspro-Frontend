import React, { useState, useEffect } from 'react'
import { ChevronDown, Eye } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg"
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const EditDraftQmsRecordFormat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileObject, setFileObject] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recordFormats, setRecordFormats] = useState([]);
    const [previewAttachment, setPreviewAttachment] = useState(null);
    const [recordFormatDetails, setRecordFormatsDetails] = useState(null);
    const { id } = useParams();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const yesNoOptions = ['Yes', 'No'];

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
            fetchProcedureDetails();
        }
    }, [companyId, id]);

    useEffect(() => {
        if (recordFormatDetails) {
            setFormData({
                title: recordFormatDetails.title || '',
                written_by: recordFormatDetails.written_by?.id || null,
                no: recordFormatDetails.no || '',
                checked_by: recordFormatDetails.checked_by?.id || null,
                checked_by_system_notify: recordFormatDetails.checked_by_system_notify || false,
                checked_by_email_notify: recordFormatDetails.checked_by_email_notify || false,
                rivision: recordFormatDetails.rivision || '',
                approved_by: recordFormatDetails.approved_by?.id || null,
                approved_by_system_notify: recordFormatDetails.approved_by_system_notify || false,
                approved_by_email_notify: recordFormatDetails.approved_by_email_notify || false,
                document_type: recordFormatDetails.document_type || 'System',
                date: recordFormatDetails.date || formData.date,
                review_frequency_year: recordFormatDetails.review_frequency_year || '',
                review_frequency_month: recordFormatDetails.review_frequency_month || '',
                publish: recordFormatDetails.publish || false,
                send_notification: recordFormatDetails.send_notification || false,
                retention_period: recordFormatDetails.retention_period || false
            });
        }
    }, [recordFormatDetails]);

    const fetchProcedureDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/recordFormats-detail/${id}/`);
            setRecordFormatsDetails(response.data);
            setIsInitialLoad(false);
            console.log("Record Formats Details:", response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching Record Formats details:", err);
            setError("Failed to load Record Formats details");
            setIsInitialLoad(false);
            setLoading(false);
        }
    };

    const renderAttachmentPreview = () => {
        // if (previewAttachment) {
        //     const attachmentName = selectedFile || recordFormatDetails?.upload_attachment_name || 'Attachment';

        return (
            <button
                onClick={() => window.open(previewAttachment, '_blank')}
                className="text-[#1E84AF] click-view-file-text !text-[14px] flex items-center gap-2 mt-[10.65px]"
            >
                Click to view File
                <Eye size={17} />
            </button>
        );
        // }
        return null;
    };

    console.log("Stored Company ID:", companyId);

    const [formData, setFormData] = useState({
        title: '',
        written_by: null,
        no: '',
        checked_by: null,
        checked_by_system_notify: false,
        checked_by_email_notify: false,
        rivision: '',
        approved_by: null,
        approved_by_system_notify: false,
        approved_by_email_notify: false,
        document_type: 'System',
        date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
        review_frequency_year: '',
        review_frequency_month: '',
        publish: false,
        send_notification: false,
        retention_period: 'abc'
    });

    const [openDropdowns, setOpenDropdowns] = useState({
        written_by: false,
        checked_by: false,
        checked_by_system_notify: false,
        checked_by_email_notify: false,
        approved_by: false,
        approved_by_system_notify: false,
        approved_by_email_notify: false,
        document_type: false,
        day: false,
        month: false,
        year: false
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
            setError("Failed to load Record Formats. Please check your connection and try again.");
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

    const documentTypes = [
        'System',
        'Paper',
        'External',
        'Work Instruction'
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
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file.name);
            setFileObject(file);
        }
    };

    useEffect(() => {
        const draftProcedureId = localStorage.getItem('selected_draft_recordFormat_id');
        const routeState = location.state?.draftProcedureId;
        const urlParams = new URLSearchParams(window.location.search);
        const urlDraftProcedureId = urlParams.get('draftProcedureId');

        const id = draftProcedureId || routeState || urlDraftProcedureId;

        if (id) {
            console.log("Draft Procedure ID found:", id);
            fetchDraftProcedureDetails(id);
        } else {
            console.warn("No draft Record Formats ID found");
        }
    }, []);

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
        } else if (dropdown === 'checked_by_system_notify' || dropdown === 'checked_by_email_notify' ||
            dropdown === 'approved_by_system_notify' || dropdown === 'approved_by_email_notify') {
            setFormData(prev => ({
                ...prev,
                [dropdown]: value === 'Yes'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [dropdown]: value
            }));
        }

        setOpenDropdowns(prev => ({ ...prev, [dropdown]: false }));
    };

    const handleCancelClick = () => {
        navigate('/company/qms/draftrecordformat')
    }

    useEffect(() => {
        if (recordFormatDetails?.upload_attachment) {
            setPreviewAttachment(recordFormatDetails.upload_attachment);
        }
    }, [recordFormatDetails]);

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

            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            if (fileObject) {
                submitData.append('upload_attachment', fileObject);
            }

            const response = await axios.put(`${BASE_URL}/qms/recordFormats/${id}/update/`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            alert('Procedure updated successfully!');
            navigate('/company/qms/record-format');
        } catch (err) {
            setLoading(false);
            setError('Failed to update record Formats');
            console.error('Error updating Record Formats:', err);
        }
    };

    return (
        <div className="bg-[#1C1C24] rounded-lg text-white">
            <div>
                <h1 className="add-manual-sections">Record Format Draft</h1>

                {error && (
                    <div className="mx-[18px] px-[104px] mt-4 p-2 bg-red-500 rounded text-white">
                        {error}
                    </div>
                )}

                <div className="border-t border-[#383840] mx-[18px] pt-[22px] px-[104px]">
                    <div className="grid md:grid-cols-2 gap-5 pb-5">
                        <div>
                            <label className="add-qms-manual-label">
                            Record Name/Title <span className="text-red-500">*</span>
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
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                            Record Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="no"
                                value={formData.no}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>

                        <div>
                            <div className="flex space-x-4">
                                <div className='w-1/2'>
                                    <label className="add-qms-manual-label">
                                        Checked/Reviewed By <span className="text-red-500">*</span>
                                    </label>
                                    <div>
                                        <div className="relative flex-grow">
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
                                    </div>
                                </div>
                                <div className="w-1/4">
                                    <label className="add-qms-manual-label">System Notify</label>
                                    <div className="relative">
                                        <select
                                            className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                            name="checked_by_system_notify"
                                            value={formData.checked_by_system_notify ? 'Yes' : 'No'}
                                            onFocus={() => toggleDropdown('checked_by_system_notify')}
                                            onChange={(e) => handleDropdownChange(e, 'checked_by_system_notify')}
                                            onBlur={() => setOpenDropdowns(prev => ({ ...prev, checked_by_system_notify: false }))}
                                        >
                                            {yesNoOptions.map(option => (
                                                <option key={`checked-notify-${option}`} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.checked_by_system_notify ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                                <div className="w-1/4">
                                    <label className="add-qms-manual-label">Email Notify</label>
                                    <div className="relative">
                                        <select
                                            className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                            name="checked_by_email_notify"
                                            value={formData.checked_by_email_notify ? 'Yes' : 'No'}
                                            onFocus={() => toggleDropdown('checked_by_email_notify')}
                                            onChange={(e) => handleDropdownChange(e, 'checked_by_email_notify')}
                                            onBlur={() => setOpenDropdowns(prev => ({ ...prev, checked_by_email_notify: false }))}
                                        >
                                            {yesNoOptions.map(option => (
                                                <option key={`checked-email-${option}`} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.checked_by_email_notify ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Revision
                            </label>
                            <input
                                type="text"
                                name="rivision"
                                value={formData.rivision}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>

                        <div>
                            <div className="flex space-x-4">
                                <div className='w-1/2'>
                                    <label className="add-qms-manual-label">
                                        Approved By <span className="text-red-500">*</span>
                                    </label>
                                    <div>
                                        <div className="relative flex-grow">
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
                                <div className="w-1/4">
                                    <label className="add-qms-manual-label">System Notify</label>
                                    <div className="relative">
                                        <select
                                            className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                            name="approved_by_system_notify"
                                            value={formData.approved_by_system_notify ? 'Yes' : 'No'}
                                            onFocus={() => toggleDropdown('approved_by_system_notify')}
                                            onChange={(e) => handleDropdownChange(e, 'approved_by_system_notify')}
                                            onBlur={() => setOpenDropdowns(prev => ({ ...prev, approved_by_system_notify: false }))}
                                        >
                                            {yesNoOptions.map(option => (
                                                <option key={`approved-notify-${option}`} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.approved_by_system_notify ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                                <div className="w-1/4">
                                    <label className="add-qms-manual-label">Email Notify</label>
                                    <div className="relative">
                                        <select
                                            className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                            name="approved_by_email_notify"
                                            value={formData.approved_by_email_notify ? 'Yes' : 'No'}
                                            onFocus={() => toggleDropdown('approved_by_email_notify')}
                                            onChange={(e) => handleDropdownChange(e, 'approved_by_email_notify')}
                                            onBlur={() => setOpenDropdowns(prev => ({ ...prev, approved_by_email_notify: false }))}
                                        >
                                            {yesNoOptions.map(option => (
                                                <option key={`approved-email-${option}`} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.approved_by_email_notify ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Document Type
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                                    name="document_type"
                                    value={formData.document_type}
                                    onFocus={() => toggleDropdown('document_type')}
                                    onChange={(e) => handleDropdownChange(e, 'document_type')}
                                    onBlur={() => setOpenDropdowns(prev => ({ ...prev, document_type: false }))}
                                >
                                    {documentTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.document_type ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                                Date
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
                                Attach Document
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    className="w-full add-qmsmanual-attach"
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <span className="file-input">
                                        {selectedFile ? selectedFile : "Choose File"}
                                    </span>
                                    <img src={file} alt="File Icon" />
                                </button>
                                <div className='flex justify-between items-center'>
                                    {renderAttachmentPreview()}
                                    {!selectedFile && <p className="text-right no-file">No file chosen</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className='add-qms-manual-label'>
                                Review Frequency
                            </label>
                            <div className="flex space-x-5">
                                <input
                                    type="text"
                                    name="review_frequency_year"
                                    placeholder='Years'
                                    value={formData.review_frequency_year}
                                    onChange={handleChange}
                                    className="w-full add-qms-manual-inputs"
                                />
                                <input
                                    type="text"
                                    name="review_frequency_month"
                                    placeholder='Months'
                                    value={formData.review_frequency_month}
                                    onChange={handleChange}
                                    className="w-full add-qms-manual-inputs"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="add-qms-manual-label">
                            Retention Period
                            </label>
                            <input
                                type="text"
                                name="retention_period"
                                value={formData.retention_period}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>

                        <div>

                        </div>

                        <div className='mt-[35px]'>
                            <button className="request-correction-btn duration-200">
                                Save as Draft
                            </button>
                        </div>
                        <div className="flex items-center mt-[35px] justify-end">
                            <div className='flex gap-[22px]'>
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
        </div>
    );
};


export default EditDraftQmsRecordFormat
