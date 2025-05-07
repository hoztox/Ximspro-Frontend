import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import EnergySourceTypeModal from './EnergySourceTypeModal';

const QmsAddSignificantEnergy = () => {
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

    // Now you can safely use the function
    const companyId = getUserCompanyId();
    const [isEnergySourceModalOpen, setIsEnergySourceModalOpen] = useState(false);
    const navigate = useNavigate();
    const [energySources, setEnergySources] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextSeuno, setNextSeuNo] = useState("1");
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEnergySources();
        fetchNextSeuNumber();
    }, []);

    const handleOpenEnergySourceModal = () => {
        setIsEnergySourceModalOpen(true);
    };

    const handleEnergySourceModal = (newEnergySourceAdded = false) => {
        setIsEnergySourceModalOpen(false);
        if (newEnergySourceAdded) {
            fetchEnergySources();
        }
    };

    const [formData, setFormData] = useState({
        title: '',
        next_seu_no: '',
        energy_source_type: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        attachment: '',
        facility: '',
        consumption: '',
        action: '',
        consequences: '',
        impact: '',
        remarks: '',
        revision: '',
        send_notification: false,
        is_draft: false
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const handleListSignificantEnergy = () => {
        navigate('/company/qms/list-significant-energy')
    }

    // New function to fetch the next available action number
    const fetchNextSeuNumber = async () => {
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                // If no company ID, default to SEU-1
                setNextSeuNo("SEU-1");
                setFormData(prevData => ({
                    ...prevData,
                    next_seu_no: "SEU-1"
                }));
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/car-number/next-action/${companyId}/`);
            if (response.data && response.data.next_seu_no) {
                const seuNumber = `SEU-${response.data.next_seu_no}`;
                setNextSeuNo(seuNumber);
                console.log('SEU Number:', seuNumber);

                setFormData(prevData => ({
                    ...prevData,
                    next_seu_no: seuNumber
                }));
            } else {
                // If response doesn't contain a valid number, default to "SEU-1"
                setNextSeuNo("SEU-1");
                setFormData(prevData => ({
                    ...prevData,
                    next_seu_no: "SEU-1"
                }));
            }
        } catch (error) {
            console.error('Error fetching next seu number:', error);
            // Set a fallback value if the API fails
            setNextSeuNo("SEU-1");
            setFormData(prevData => ({
                ...prevData,
                next_seu_no: "SEU-1"
            }));
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            attachment: e.target.files[0],
        });
    };


    const fetchEnergySources = async () => {
        try {
            setIsLoading(true);
            const companyId = getUserCompanyId();
            const response = await axios.get(`${BASE_URL}/qms/root-cause/company/${companyId}/`);
            setEnergySources(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching root causes:', error);
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'next_seu_no') return;

        // Handle nested objects (dates)
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
            // Handle checkboxes
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
        } else {
            // Handle regular inputs
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

    const handleDraftSave = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError('');
            const companyId = getUserCompanyId();

            // Format the dates
            const date = formatDate(formData.date);

            // Prepare submission data
            const submissionData = {
                company: companyId,
                title: formData.title,
                next_seu_no: formData.next_seu_no.replace('SEU-', ''),
                energy_source_type: formData.energy_source_type,
                date: date,
                attachment: formData.attachment,
                facility: formData.facility,
                consumption: formData.consumption,
                action: formData.action,
                consequences: formData.consequences,
                impact: formData.impact,
                remarks: formData.remarks,
                revision: formData.revision,
                send_notification: formData.send_notification,
                is_draft: true
            };
            // Submit to draft-specific API endpoint
            const response = await axios.post(`${BASE_URL}/qms/car/draft-create/`, submissionData);

            console.log('Saved Significant Energy Draft:', response.data);

            setIsLoading(false);

            // Show success message or navigate
            navigate('/company/qms/draft-correction-actions');

        } catch (error) {
            console.error('Error saving draft:', error);
            setIsLoading(false);
            setError('Failed to save draft. Please check your inputs and try again.');
        }
    };

    const handleSubmit = async (e, asDraft = false) => {
        e.preventDefault();

        // If saving as draft, use the specialized draft save function
        if (asDraft) {
            handleDraftSave(e);
            return;
        }

        try {
            setIsLoading(true);
            const companyId = getUserCompanyId();

            // Format the dates
            const date = formatDate(formData.date);
            const dateCompleted = formatDate(formData.date_completed);

            // Prepare submission data
            const submissionData = {
                company: companyId,
                title: formData.title,
                next_seu_no: formData.next_seu_no.replace('SEU-', ''),
                energy_source_type: formData.energy_source_type,
                date: date,
                attachment: formData.attachment,
                facility: formData.facility,
                consumption: formData.consumption,
                action: formData.action,
                consequences: formData.consequences,
                impact: formData.impact,
                remarks: formData.remarks,
                revision: formData.revision,
                send_notification: formData.send_notification,
                is_draft: true
            };

            // Add supplier only if source is 'Supplier'
            if (formData.source === 'Supplier') {
                submissionData.supplier = formData.supplier;
            }

            // Submit to API
            const response = await axios.post(`${BASE_URL}/qms/car-numbers/`, submissionData);

            console.log('Added Significant:', submissionData);

            setIsLoading(false);


            navigate('/company/qms/list-correction-actions');

            // Reset form and fetch new action number for next time
            setFormData({
                title: '',
                next_seu_no: '',
                energy_source_type: '',
                date: {
                    day: '',
                    month: '',
                    year: ''
                },
                attachment: '',
                facility: '',
                consumption: '',
                action: '',
                consequences: '',
                impact: '',
                remarks: '',
                revision: '',
                send_notification: false,
                is_draft: false
            });

            // After successful submission, fetch the next action number for next time
            fetchNextSeuNumber();

        } catch (error) {
            console.error('Error submitting form:', error);
            setIsLoading(false);
            setError('Failed to save. Please check your inputs and try again.');
        }
    };

    // Generate options for dropdowns
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
                <h1 className="add-training-head">Add Significant Energy Use</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => handleListSignificantEnergy()}
                >
                    List Significant Energy Use
                </button>
            </div>

            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-[104px] py-2 my-2">
                    {error}
                </div>
            )}

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
                        name="next_seu_no"
                        value={formData.next_seu_no}
                        className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
                        readOnly
                        title="Auto-generated seu number"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Energy Source Type</label>
                    <select
                        name="energy_source_type"
                        value={formData.energy_source_type}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("energy_source_type")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>
                            {isLoading ? "Loading..." : "Select Energy Source"}
                        </option>
                        {energySources && energySources.length > 0 ? (
                            energySources.map(cause => (
                                <option key={cause.id} value={cause.id}>
                                    {cause.title}
                                </option>
                            ))
                        ) : !isLoading && (
                            <option value="" disabled>No Energy Source Found</option>
                        )}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                            ${focusedDropdown === "energy_source_type" ? "rotate-180" : ""}`}
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
                        {/* Day */}
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

                        {/* Month */}
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

                        {/* Year */}
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
                    {formData.attachment && (
                        <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                            {formData.attachment.name}
                        </p>
                    )}
                    {!formData.attachment && (
                        <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                            No file chosen
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Facility/Process/ Activity
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
                        name="title"
                        value={formData.title}
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
                        name="title"
                        value={formData.title}
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
                        name="title"
                        value={formData.title}
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
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Significant Energy use Remarks
                    </label>
                    <textarea
                        name="title"
                        value={formData.title}
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
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                    />
                </div>
                <div></div>

                <div className="flex items-end justify-end mt-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="send_notification"
                            className="mr-2 form-checkboxes"
                            checked={formData.send_notification || false}
                            onChange={handleChange}
                        />
                        <span className="permissions-texts cursor-pointer">
                            Send Notification
                        </span>
                    </label>
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-4 justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={handleDraftSave}
                            className='request-correction-btn duration-200'>
                            Save as Draft
                        </button>
                    </div>
                    <div className='flex gap-5'>
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
        </div>
    );
};
export default QmsAddSignificantEnergy
