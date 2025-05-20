import React, { useEffect, useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import ReviewTypeModal from './ReviewTypeModal';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsDraftEditEnergyReview = () => {
    const { id } = useParams();
    const [isReviewTypeModalOpen, setIsReviewTypeModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const [reviewTypes, setReviewTypes] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formErrors, setFormErrors] = useState({
        energy_name: ''
    });
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);

    const [formData, setFormData] = useState({
        energy_name: '',
        review_no: '',
        review_type: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        upload_attachment: null,
        relate_business_process: '',
        remarks: '',
        relate_document_process: '',
        revision: '',
        send_notification: false,
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

    const fetchReviewTypes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/review-type/company/${companyId}/`);
            setReviewTypes(response.data);
        } catch (error) {
            console.error('Error fetching review types:', error);
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

    useEffect(() => {
        const fetchEnergyReview = async () => {
            try {
                const companyId = getUserCompanyId();
                if (!companyId) {
                    setError('Company ID not found. Please log in again.');
                    return;
                }

                await fetchReviewTypes();

                const response = await axios.get(`${BASE_URL}/qms/energy-review/${id}/`);
                const data = response.data;

                let day = '', month = '', year = '';
                if (data.date) {
                    const dateParts = data.date.split('-');
                    year = dateParts[0];
                    month = dateParts[1];
                    day = dateParts[2];
                }

                setFormData({
                    energy_name: data.energy_name || '',
                    review_no: data.review_no || '',
                    review_type: data.review_type?.id || '',
                    date: { day, month, year },
                    upload_attachment: data.upload_attachment || null,
                    relate_business_process: data.relate_business_process || '',
                    remarks: data.remarks || '',
                    relate_document_process: data.relate_document_process || '',
                    revision: data.revision || '',
                    send_notification: data.send_notification || false,
                });

                if (data.upload_attachment) {
                    setSelectedFile(data.upload_attachment.split('/').pop());
                }

            } catch (error) {
                console.error('Error fetching energy review:', error);
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
                setIsLoading(false);
            }
        };

        fetchEnergyReview();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
            return;
        }

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
            if (name === "energy_name") {
                setFormErrors({
                    ...formErrors,
                    energy_name: ""
                });
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file.name);
            setFormData({
                ...formData,
                upload_attachment: file,
            });
        } else {
            setSelectedFile(null);
            setFormData({
                ...formData,
                upload_attachment: null,
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.energy_name.trim()) {
            errors.energy_name = "Energy Review Name/Title is required";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleOpenReviewTypeModal = () => {
        setIsReviewTypeModalOpen(true);
    };

    const handleCloseReviewTypeModal = (newReviewAdded = false) => {
        setIsReviewTypeModalOpen(false);
        if (newReviewAdded && companyId) {
            fetchReviewTypes();
        }
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const formattedDate = formatDate(formData.date);
            const companyId = getUserCompanyId();

            const submissionData = new FormData();
            submissionData.append('company', companyId);
            submissionData.append('energy_name', formData.energy_name);
            submissionData.append('review_no', formData.review_no);
            submissionData.append('review_type', formData.review_type);
            if (formattedDate) submissionData.append('date', formattedDate);
            if (formData.upload_attachment && typeof formData.upload_attachment === 'object') {
                submissionData.append('upload_attachment', formData.upload_attachment);
            }
            submissionData.append('relate_business_process', formData.relate_business_process);
            submissionData.append('remarks', formData.remarks);
            submissionData.append('relate_document_process', formData.relate_document_process);
            submissionData.append('revision', formData.revision);
            submissionData.append('send_notification', formData.send_notification);
            submissionData.append('is_draft', 'false');

            const response = await axios.put(`${BASE_URL}/qms/energy-review-draft/update/${id}/`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-energy-review');
            }, 1500);
            setSuccessMessage("Energy Review Saved Successfully")

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
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/company/qms/draft-energy-review');
    };

    const handleViewFile = () => {
        if (formData.upload_attachment && typeof formData.upload_attachment === 'string') {
            window.open(formData.upload_attachment, '_blank');
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

    // if (isLoading) {
    //     return (
    //         <div className="bg-[#1C1C24] not-found p-5 rounded-lg">
    //             <div className="flex justify-center items-center h-64">
    //                 <p>Loading energy review data...</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <h1 className="add-training-head">Edit Draft Energy Review</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => navigate('/company/qms/draft-energy-review')}
                >
                    List Draft Energy Review
                </button>
            </div>

            <ReviewTypeModal
                isOpen={isReviewTypeModalOpen}
                onClose={handleCloseReviewTypeModal}
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
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Energy Review Name/Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="energy_name"
                        value={formData.energy_name}
                        onChange={handleChange}
                        className={`add-training-inputs focus:outline-none ${formErrors.energy_name ? "border-red-500" : ""}`}
                    />
                    {formErrors.energy_name && (
                        <p className="text-red-500 text-sm">{formErrors.energy_name}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Energy Review Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="review_no"
                        value={formData.review_no}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none cursor-not-allowed"
                        readOnly
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Review Type</label>
                    <select
                        name="review_type"
                        value={formData.review_type}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("review_type")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select Review Type</option>
                        {reviewTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.title}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                        ${focusedDropdown === "review_type" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                    <button
                        className='flex justify-start add-training-label !text-[#1E84AF]'
                        onClick={handleOpenReviewTypeModal}
                        type="button"
                    >
                        View / Add Review Type
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Date</label>
                    <div className="grid grid-cols-3 gap-5">
                        <div className="relative">
                            <select
                                name="date.day"
                                value={formData.date.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date.month"
                                value={formData.date.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                        <div className="relative">
                            <select
                                name="date.year"
                                value={formData.date.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2020, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "date.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Upload Attachments</label>
                    <div className="relative -top-[9px]">
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            className="w-full add-qmsmanual-attach"
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <span className="file-input">
                                {selectedFile ? selectedFile : "Choose File"}
                            </span>
                            <img src={file} alt="File Icon" />
                        </button>
                        <div className="flex items-center justify-between">
                            {(typeof formData.upload_attachment === 'string' || selectedFile) && (
                                <div
                                    onClick={handleViewFile}
                                    className="flex items-center gap-[8px] text-[#1E84AF] mt-[10.65px] click-view-file-text !text-[14px] cursor-pointer"
                                >
                                    Click to view file
                                    <Eye size={17} />
                                </div>
                            )}
                            {!selectedFile && (
                                <p className="text-right no-file">No file chosen</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Relate Business Process</label>
                    <input
                        type="text"
                        name="relate_business_process"
                        value={formData.relate_business_process}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Energy Remarks</label>
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Relate Document/Process</label>
                    <textarea
                        name="relate_document_process"
                        value={formData.relate_document_process}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Revision</label>
                    <input
                        type="text"
                        name="revision"
                        value={formData.revision}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>

                <div className="flex items-end justify-end mt-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="send_notification"
                            className="mr-2 form-checkboxes"
                            checked={formData.send_notification}
                            onChange={(e) => setFormData({ ...formData, send_notification: e.target.checked })}
                        />
                        <span className="permissions-texts cursor-pointer">
                            Send Notification
                        </span>
                    </label>
                </div>

                <div className="md:col-span-2 flex gap-4 justify-end">
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
                            className="save-btn duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QmsDraftEditEnergyReview;