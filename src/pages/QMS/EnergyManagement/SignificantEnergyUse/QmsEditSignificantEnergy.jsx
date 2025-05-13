import React, { useEffect, useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import EnergySourceTypeModal from './EnergySourceTypeModal';

const QmsEditSignificantEnergy = () => {
    const { id } = useParams();
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
    const [isEnergySourceModalOpen, setIsEnergySourceModalOpen] = useState(false);
    const [energySources, setEnergySources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        significant: '',
        source_type: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        upload_attachment: null,
        facility: '',
        consumption: '',
        action: '',
        consequences: '',
        impact: '',
        remarks: '',
        revision: '',
        is_notification: false,
        is_draft: false
    });

    const [existingAttachment, setExistingAttachment] = useState(null);
    const [focusedDropdown, setFocusedDropdown] = useState(null);

    useEffect(() => {
        fetchSignificantEnergy();
        fetchEnergySources();
    }, [id]);

    const fetchSignificantEnergy = async () => {
        try {
            setIsLoading(true);
            if (!companyId || !id) {
                setError('Company ID or record ID not found. Please try again.');
                return;
            }
            const response = await axios.get(`${BASE_URL}/qms/significant/${id}/`);
            const data = response.data;

            const processDate = (dateString) => {
                if (!dateString) return { day: '', month: '', year: '' };
                const [year, month, day] = dateString.split('-');
                return { day, month, year };
            };

            setFormData({
                title: data.title || '',
                significant: data.significant || '',
                source_type: data.source_type?.id || data.source_type || '',
                date: processDate(data.date),
                upload_attachment: null,
                facility: data.facility || '',
                consumption: data.consumption || '',
                action: data.action || '',
                consequences: data.consequences || '',
                impact: data.impact || '',
                remarks: data.remarks || '',
                revision: data.revision || '',
                is_notification: data.is_notification || false,
                is_draft: data.is_draft || false
            });
            setExistingAttachment(data.upload_attachment || null);
        } catch (error) {
            console.error('Error fetching significant energy:', error);
            setError('Failed to load significant energy data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEnergySources = async () => {
        try {
            if (!companyId) {
                setError('Company ID not found. Please try again.');
                return;
            }
            const response = await axios.get(`${BASE_URL}/qms/source-type/company/${companyId}/`);
            setEnergySources(response.data);
        } catch (error) {
            console.error('Error fetching energy sources:', error);
            setError('Failed to load energy sources. Please try again.');
        }
    };

    const handleOpenEnergySourceModal = () => {
        setIsEnergySourceModalOpen(true);
    };

    const handleEnergySourceModal = (newEnergySourceAdded = false) => {
        setIsEnergySourceModalOpen(false);
        if (newEnergySourceAdded) {
            fetchEnergySources();
        }
    };

    const handleListSignificantEnergy = () => {
        navigate('/company/qms/list-significant-energy');
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            upload_attachment: e.target.files[0],
        });
    };

    const handleViewFile = () => {
        if (existingAttachment) {
            window.open(existingAttachment, "_blank");
        } else {
            setError("No existing file attached to this record.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'significant') return;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else if (e.target.type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const handleSubmit = async (e, asDraft = false) => {
        e.preventDefault();
        if (asDraft) {
            handleDraftSave(e);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            if (!companyId || !userId || !id) {
                setError('Company, user, or record ID not found. Please try again.');
                return;
            }
            if (!formData.significant) {
                setError('Significant Energy Use Number is required.');
                return;
            }

            const date = formatDate(formData.date);
            const formDataToSend = new FormData();
            formDataToSend.append('company', companyId);
            formDataToSend.append('user', userId);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('significant', formData.significant);
            formDataToSend.append('source_type', formData.source_type);
            if (date) formDataToSend.append('date', date);
            if (formData.upload_attachment) formDataToSend.append('upload_attachment', formData.upload_attachment);
            formDataToSend.append('facility', formData.facility);
            formDataToSend.append('consumption', formData.consumption);
            formDataToSend.append('action', formData.action);
            formDataToSend.append('consequences', formData.consequences);
            formDataToSend.append('impact', formData.impact);
            formDataToSend.append('remarks', formData.remarks);
            formDataToSend.append('revision', formData.revision);
            formDataToSend.append('is_notification', formData.is_notification);
            formDataToSend.append('is_draft', false);

            const response = await axios.put(`${BASE_URL}/qms/significant/update/${id}/`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Updated Significant Energy:', response.data);
            navigate('/company/qms/list-significant-energy');
        } catch (error) {
            console.error('Error updating form:', error);
            setError('Failed to update. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
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
                <h1 className="add-training-head">Edit Significant Energy Use</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={handleListSignificantEnergy}
                >
                    List Significant Energy Use
                </button>
            </div>

            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-[104px] py-2 my-2">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-white">Loading...</p>
                </div>
            ) : (
                <>
                    <EnergySourceTypeModal
                        isOpen={isEnergySourceModalOpen}
                        onClose={handleEnergySourceModal}
                    />

                    <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Significant Energy Use Name/Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Significant Energy Use Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="significant"
                                value={formData.significant}
                                className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
                                readOnly
                                title="Significant number cannot be changed"
                            />
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            <label className="add-training-label">Energy Source Type</label>
                            <select
                                name="source_type"
                                value={formData.source_type}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("source_type")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>
                                    Select Energy Source
                                </option>
                                {energySources && energySources.length > 0 ? (
                                    energySources.map(source => (
                                        <option key={source.id} value={source.id}>
                                            {source.title}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No Energy Source Found</option>
                                )}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                                    ${focusedDropdown === "source_type" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                            <button
                                className='flex justify-start add-training-label !text-[#1E84AF] mt-1'
                                onClick={handleOpenEnergySourceModal}
                                type="button"
                            >
                                View / Add Energy Source Type
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
                                        {generateOptions(2023, 2030)}
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
                            <label className="add-training-label">Attach Document</label>
                            <div className="flex">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                                >
                                    <span className="text-[#AAAAAA] choose-file">Choose File</span>
                                    <img src={file} alt="" />
                                </label>
                            </div>
                            <div className='flex justify-between items-center'>
                                {existingAttachment && (
                                    <button
                                        onClick={handleViewFile}
                                        className='click-view-file-btn flex items-center gap-2 text-[#1E84AF]'
                                        type="button"
                                    >
                                        Click to view file <Eye size={17} />
                                    </button>
                                )}
                                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                                    {formData.upload_attachment
                                        ? formData.upload_attachment.name
                                        : existingAttachment
                                            ? 'Existing file attached'
                                            : 'No file chosen'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Facility/Process/Activity
                            </label>
                            <input
                                type="text"
                                name="facility"
                                value={formData.facility}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Average Consumption
                            </label>
                            <input
                                type="text"
                                name="consumption"
                                value={formData.consumption}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Action Required
                            </label>
                            <input
                                type="text"
                                name="action"
                                value={formData.action}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Potential Consequences of Energy Use
                            </label>
                            <input
                                type="text"
                                name="consequences"
                                value={formData.consequences}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Impact on Processes/Activity/Cost
                            </label>
                            <input
                                type="text"
                                name="impact"
                                value={formData.impact}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Significant Energy Use Remarks
                            </label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Revision
                            </label>
                            <input
                                type="text"
                                name="revision"
                                value={formData.revision}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                            />
                        </div>

                        <div className="flex items-end justify-end mt-3 col-span-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_notification"
                                    className="mr-2 form-checkboxes"
                                    checked={formData.is_notification}
                                    onChange={handleChange}
                                />
                                <span className="permissions-texts cursor-pointer">
                                    Send Notification
                                </span>
                            </label>
                        </div>

                        <div className="md:col-span-2 flex gap-4 justify-end">
                            <div className="flex gap-5">
                                <button
                                    type="button"
                                    onClick={handleListSignificantEnergy}
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
                </>
            )}
        </div>
    );
};

export default QmsEditSignificantEnergy;