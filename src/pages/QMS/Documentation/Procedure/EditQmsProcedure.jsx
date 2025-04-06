import React, { useState, useEffect } from 'react'
import { ChevronDown, Eye } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const EditQmsProcedure = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Static data instead of fetched data
    const [procedureDetails, setProcedureDetails] = useState({
        id: 1,
        title: 'Quality Control Procedure',
        written_by: { id: 2, first_name: 'John', last_name: 'Doe' },
        no: 'QCP-2023-001',
        checked_by: { id: 3, first_name: 'Jane', last_name: 'Smith' },
        checked_by_system_notify: true,
        checked_by_email_notify: false,
        rivision: '1.2',
        approved_by: { id: 4, first_name: 'Michael', last_name: 'Johnson' },
        approved_by_system_notify: true,
        approved_by_email_notify: true,
        document_type: 'System',
        date: '2023-04-15',
        review_frequency_year: '1',
        review_frequency_month: '6',
        publish: true,
        send_notification: true,
        upload_attachment: null,
        upload_attachment_name: 'quality_procedure.pdf',
        relate_format: 'QC-FORM-001'
    });
    const [corrections, setCorrections] = useState([
        { id: 1, comment: 'Review section 3.2', status: 'pending' },
        { id: 2, comment: 'Update references', status: 'completed' }
    ]);
    const [previewAttachment, setPreviewAttachment] = useState(null);
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileObject, setFileObject] = useState(null);
    // Demo users data
    const [users, setUsers] = useState([
        { id: 1, first_name: 'Admin', last_name: 'User' },
        { id: 2, first_name: 'John', last_name: 'Doe' },
        { id: 3, first_name: 'Jane', last_name: 'Smith' },
        { id: 4, first_name: 'Michael', last_name: 'Johnson' },
        { id: 5, first_name: 'Sarah', last_name: 'Williams' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(false); // Set to false for demo

    // Define yesNoOptions
    const yesNoOptions = ['Yes', 'No'];

    // Initialize formData with demo values
    const [formData, setFormData] = useState({
        title: 'Quality Control Procedure',
        written_by: 2,
        no: 'QCP-2023-001',
        checked_by: 3,
        checked_by_system_notify: true,
        checked_by_email_notify: false,
        rivision: '1.2',
        approved_by: 4,
        approved_by_system_notify: true,
        approved_by_email_notify: true,
        document_type: 'System',
        date: '2023-04-15',
        review_frequency_year: '1',
        review_frequency_month: '6',
        publish: true,
        send_notification: true,
        relate_format: 'QC-FORM-001'
    });

    const [openDropdowns, setOpenDropdowns] = useState({
        written_by: false,
        checked_by: false,
        approved_by: false,
        document_type: false,
        day: false,
        month: false,
        year: false,
        checked_by_system_notify: false,
        checked_by_email_notify: false,
        approved_by_system_notify: false,
        approved_by_email_notify: false
    });

    const closeAttachmentPreview = () => {
        setPreviewAttachment(null);
    };

    // Handle attachment preview - commented out dynamic functionality
    const handleAttachmentPreview = () => {
        // Static preview for demo
        setPreviewAttachment("https://example.com/sample.pdf");
    };

    // Comment out effect for procedureDetails
    /*
    useEffect(() => {
        if (procedureDetails && procedureDetails.upload_attachment) {
            handleAttachmentPreview();
        }
    }, [procedureDetails]);
    */

    // File change handler - simplified for demo
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file.name);
            setFileObject(file);
            // Static URL for demo
            setPreviewAttachment("https://example.com/sample.pdf");
        }
    };

    // Static company ID for demo
    const getUserCompanyId = () => {
        return "12345";
    };

    const companyId = getUserCompanyId();

    // Comment out effect for procedureDetails
    /*
    useEffect(() => {
        if (procedureDetails) {
            setFormData({
                // ... original code
            });
        }
    }, [procedureDetails]);
    */

    // Comment out effect for fetching users
    /*
    useEffect(() => {
        if (companyId) {
            fetchUsers();
        }
    }, [companyId]);
    */

    // Comment out effect for fetching procedure details and corrections
    /*
    useEffect(() => {
        if (companyId && id) {
            fetchProcedureDetails();
            fetchProcedureCorrections();
        }
    }, [companyId, id]);
    */

    // Comment out fetch functions
    /*
    const fetchUsers = async () => {
        // ... original code
    };

    const fetchProcedureDetails = async () => {
        // ... original code
    };

    const fetchProcedureCorrections = async () => {
        // ... original code
    };
    */

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

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
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
        }

        setOpenDropdowns(prev => ({ ...prev, [dropdown]: false }));
    };

    const handleCancelClick = () => {
        navigate('/company/qms/procedure');
    };

    const handleUpdateClick = async () => {
        // Simplified for demo
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Update procedure with data:', formData);
            setLoading(false);
            alert('Procedure updated successfully! (Demo)');
            console.log('Would navigate to /company/qms/procedure');
        }, 1000);

        /* Comment out actual API call
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

            // Add all form data
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            // Add file if new file is selected
            if (fileObject) {
                submitData.append('upload_attachment', fileObject);
            }

            const response = await axios.put(`${BASE_URL}/qms/procedures/${id}/update/`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            alert('Procedure updated successfully!');
            navigate('/company/qms/procedure');
        } catch (err) {
            setLoading(false);
            setError('Failed to update procedure');
            console.error('Error updating procedure:', err);
        }
        */
    };

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

    const renderAttachmentPreview = () => {
        // Simplified static preview
        // if (previewAttachment || procedureDetails?.upload_attachment) {
        const attachmentName = selectedFile || procedureDetails?.upload_attachment_name || 'Attachment';

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

    return (
        <div className="bg-[#1C1C24] rounded-lg text-white">
            <div>
                <h1 className="add-manual-sections">Edit Procedures</h1>

                <div className="border-t border-[#383840] mx-[18px] pt-[22px] px-[104px]">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="add-qms-manual-label">
                                Procedure Name/Title <span className="text-red-500">*</span>
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
                                Procedure Number <span className="text-red-500">*</span>
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
                                Relate Record Format
                            </label>
                            <input
                                type="text"
                                name="relate_format"
                                value={formData.relate_format}
                                onChange={handleChange}
                                className="w-full add-qms-manual-inputs"
                            />
                        </div>
                    </div>

                    <div className="flex items-center mt-[22px] justify-between">
                        <div className='mb-6'>
                            <button
                                className="request-correction-btn duration-200"
                                onClick={() => console.log('Save as Draft clicked')}
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

export default EditQmsProcedure;