import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import ReviewTypeModal from './ReviewTypeModal';

const QmsAddEnergyReview = () => {
    const [isReviewTypeModalOpen, setIsReviewTypeModalOpen] = useState(false);
    const [reviewTypes, setReviewTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveDraftLoading, setSaveDraftLoading] = useState(false); // New separate loading state for draft
    const [error, setError] = useState('');
    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const navigate = useNavigate();

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

    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();
    const [formData, setFormData] = useState({
        energy_name: '',
        review_no: 'ER-1',
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
        is_draft: false
    });

    useEffect(() => {
        fetchNextReviewNumber();
        fetchReviewTypes();
    }, []);

    const fetchNextReviewNumber = async () => {
        try {
            if (!companyId) {
                setFormData(prev => ({ ...prev, review_no: "ER-1" }));
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/energy-review/next-action/${companyId}/`);
            const nextNumber = response.data?.next_review_no || "1";
            setFormData(prev => ({ ...prev, review_no: `${nextNumber}` }));
        } catch (error) {
            console.error('Error fetching next review number:', error);
            setFormData(prev => ({ ...prev, review_no: "ER-1" }));
        }
    };

    const fetchReviewTypes = async () => {
        setLoading(true);
        try {
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/review-type/company/${companyId}/`);
            setReviewTypes(response.data);
        } catch (error) {
            console.error('Error fetching review types:', error);
            setError('Failed to load review types. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData({ ...formData, upload_attachment: files[0] });
            return;
        }

        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
            return;
        }

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: { ...formData[parent], [child]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleOpenReviewTypeModal = () => {
        setIsReviewTypeModalOpen(true);
    };

    const handleCloseReviewTypeModal = (newReviewAdded = false) => {
        setIsReviewTypeModalOpen(false);
        if (newReviewAdded) {
            fetchReviewTypes();
        }
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const prepareSubmissionData = () => {
        const formattedDate = formatDate(formData.date);
        const submissionData = new FormData();
        console.log('Energy Review Form Data:', formData);

        submissionData.append('company', companyId);
        submissionData.append('user', userId);
        submissionData.append('energy_name', formData.energy_name);
        submissionData.append('review_no', formData.review_no);
        submissionData.append('review_type', formData.review_type);
        submissionData.append('date', formattedDate);
        submissionData.append('remarks', formData.remarks);
        submissionData.append('relate_business_process', formData.relate_business_process);
        submissionData.append('relate_document_process', formData.relate_document_process);
        submissionData.append('revision', formData.revision);
        submissionData.append('send_notification', formData.send_notification);
        if (formData.upload_attachment) {
            submissionData.append('upload_attachment', formData.upload_attachment);
        }
        return submissionData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submissionData = prepareSubmissionData();
            submissionData.append('is_draft', false);

            const response = await axios.post(`${BASE_URL}/qms/energy-review/create/`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Energy Review created:', response.data);
            navigate('/company/qms/list-energy-review');
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Failed to save energy review. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsDraft = async (e) => {
        e.preventDefault();
        setSaveDraftLoading(true); // Use separate loading state for draft
        setError('');

        try {
            const submissionData = prepareSubmissionData();
            submissionData.append('is_draft', true);

            const response = await axios.post(`${BASE_URL}/qms/energy-review/draft-create/`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Energy Review saved as draft:', response.data);
            navigate('/company/qms/draft-energy-review');
        } catch (error) {
            console.error('Error saving draft:', error);
            setError('Failed to save energy review as draft. Please check your inputs and try again.');
        } finally {
            setSaveDraftLoading(false); // Reset draft loading state
        }
    };

    const handleCancel = () => {
        navigate('/company/qms/list-energy-review');
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
                <h1 className="add-training-head">Add Energy Review</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => navigate('/company/qms/list-energy-review')}
                >
                    List Energy Review
                </button>
            </div>


            <ReviewTypeModal
                isOpen={isReviewTypeModalOpen}
                onClose={handleCloseReviewTypeModal}
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Energy Review Name/Title
                    </label>
                    <input
                        type="text"
                        name="energy_name"
                        value={formData.energy_name}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Energy Review Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="review_no"
                        value={formData.review_no}
                        className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
                        readOnly
                        required
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
                        {reviewTypes.map(type => (
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
                    <div className="flex">
                        <input
                            type="file"
                            name="upload_attachment"
                            onChange={handleChange}
                            className="hidden"
                            id="document-upload"
                        />
                        <label
                            htmlFor="document-upload"
                            className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                        >
                            <span className="text-[#AAAAAA] choose-file">Choose File</span>
                            <img src={file} alt="" />
                        </label>
                    </div>
                    <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                        {formData.upload_attachment ? formData.upload_attachment.name : "No file chosen"}
                    </p>
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
                            onChange={handleChange}
                        />
                        <span className="permissions-texts cursor-pointer">
                            Send Notification
                        </span>
                    </label>
                </div>

                <div className="md:col-span-2 flex gap-4 justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={handleSaveAsDraft}
                            className='request-correction-btn duration-200'
                            disabled={saveDraftLoading}
                        >
                            {saveDraftLoading ? 'Saving Draft...' : 'Save as Draft'}
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
                            className="save-btn duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QmsAddEnergyReview;