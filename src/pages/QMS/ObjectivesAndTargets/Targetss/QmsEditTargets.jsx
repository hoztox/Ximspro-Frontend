import React, { useEffect, useState } from 'react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { ChevronDown, Eye, Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const QmsEditTargets = () => {
    const { id } = useParams(); // Get target ID from URL
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [programFields, setProgramFields] = useState([{ id: 1, value: '' }]);
    const [existingAttachment, setExistingAttachment] = useState(null);

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
        target: '',
        associative_objective: '',
        results: '',
        target_date: { day: '', month: '', year: '' },
        reminder_date: { day: '', month: '', year: '' },
        responsible: '',
        status: '',
        upload_attachment: null,
        is_draft: false
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    // Fetch users
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
            setError("Failed to load users.");
        }
    };

    // Fetch target data
    const fetchTarget = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/qms/targets-get/${id}/`);
            const data = response.data.data;

            // Parse dates
            const parseDate = (dateStr) => {
                if (!dateStr) return { day: '', month: '', year: '' };
                const [year, month, day] = dateStr.split('-');
                return { day, month, year };
            };

            // Initialize program fields from the response
            const programs = data.programs || [];
            setProgramFields(
                programs.length > 0
                    ? programs.map((p, index) => ({ id: index + 1, value: p.title || '' }))
                    : [{ id: 1, value: '' }]
            );

            setFormData({
                target: data.target || '',
                associative_objective: data.associative_objective || '',
                results: data.results || '',
                target_date: parseDate(data.target_date),
                reminder_date: parseDate(data.reminder_date),
                responsible: data.responsible || '', // This should be the user object or ID
                status: data.status || 'On Going',
                upload_attachment: null,
                is_draft: data.is_draft || false,
                programs: programs.length > 0 ? programs : [{ title: '' }] // Initialize programs
            });

            setExistingAttachment(data.upload_attachment || null);
            setError('');
        } catch (error) {
            console.error("Error fetching target:", error);
            setError("Failed to load target data.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
        if (id) {
            fetchTarget();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            upload_attachment: e.target.files[0]
        });
    };

    const handleProgramChange = (id, value) => {
        const updatedProgramFields = programFields.map(field =>
            field.id === id ? { ...field, value } : field
        );

        setProgramFields(updatedProgramFields);

        // Update formData with the new programs array
        setFormData(prev => ({
            ...prev,
            programs: updatedProgramFields.map(field => ({ title: field.value }))
        }));
    };

    const addProgramField = () => {
        const newId = programFields.length > 0 ? Math.max(...programFields.map(f => f.id)) + 1 : 1;
        setProgramFields([...programFields, { id: newId, value: '' }]);
    };

    const removeProgramField = (id) => {
        if (programFields.length > 1) {
            setProgramFields(programFields.filter(field => field.id !== id));
        }
    };

    const formatDate = (dateObj) => {
        if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
        return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const submissionData = new FormData();
            console.log('Target Form Data:', formData); 
            

            // Append all basic fields
            submissionData.append('company', companyId);
            submissionData.append('target', formData.target);
            submissionData.append('associative_objective', formData.associative_objective);
            submissionData.append('results', formData.results);
            submissionData.append('target_date', formatDate(formData.target_date) || '');
            submissionData.append('reminder_date', formatDate(formData.reminder_date) || '');
            submissionData.append('responsible', formData.responsible.id || formData.responsible); // Ensure responsible is ID
            submissionData.append('status', formData.status);
            submissionData.append('is_draft', formData.is_draft);

            // Append programs correctly
            const validPrograms = programFields
                .filter(field => field.value.trim() !== "")
                .map(field => ({ title: field.value }));

            validPrograms.forEach((program, index) => {
                submissionData.append(`programs[${index}]title`, program.title);
            });

            // Append attachment if present
            if (formData.upload_attachment) {
                submissionData.append('upload_attachment', formData.upload_attachment);
            }

            // Update target
            await axios.put(`${BASE_URL}/qms/targets-get/${id}/`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            navigate('/company/qms/list-targets');
        } catch (error) {
            console.error('Error updating target:', error);
            setError(error.response?.data?.message || 'Failed to update target. Please check your inputs.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleListTargets = () => {
        navigate('/company/qms/list-targets');
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
                <h1 className="add-training-head">Edit Targets and Programs</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={handleListTargets}
                >
                    List Targets and Programs
                </button>
            </div>

            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-[104px] py-2 my-2">
                    {error}
                </div>
            )}

            {isLoading && (
                <div className="text-center px-[104px] py-5">Loading...</div>
            )}

            {!isLoading && (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">
                            Target <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="target"
                            value={formData.target}
                            onChange={handleChange}
                            className="add-training-inputs focus:outline-none"
                            required
                        />
                    </div>

                   

                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">
                            Associative Objective
                        </label>
                        <input
                            type="text"
                            name="associative_objective"
                            value={formData.associative_objective}
                            onChange={handleChange}
                            className="add-training-inputs focus:outline-none"
                        />
                    </div>

                    {/* Dynamic Program Fields */}
                    {programFields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 justify-between last:pr-[57px]">
                                <label className="add-training-label">
                                    Program(s)
                                </label>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeProgramField(field.id)}
                                        className="text-red-500 text-xs"
                                    >
                                        <X size={17} />
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={field.value}
                                    onChange={(e) => handleProgramChange(field.id, e.target.value)}
                                    className="add-training-inputs focus:outline-none flex-1"
                                />
                                {index === programFields.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={addProgramField}
                                        className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                                    >
                                        <Plus className="text-white" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col gap-3 col-span-2">
                        <label className="add-training-label">
                            Results
                        </label>
                        <textarea
                            name="results"
                            value={formData.results}
                            onChange={handleChange}
                            className="add-training-inputs focus:outline-none !h-[98px]"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">Target Date</label>
                        <div className="grid grid-cols-3 gap-5">
                            <div className="relative">
                                <select
                                    name="target_date.day"
                                    value={formData.target_date.day}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedDropdown("target_date.day")}
                                    onBlur={() => setFocusedDropdown(null)}
                                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                >
                                    <option value="" disabled>dd</option>
                                    {generateOptions(1, 31)}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                    ${focusedDropdown === "target_date.day" ? "rotate-180" : ""}`}
                                    size={20}
                                    color="#AAAAAA"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    name="target_date.month"
                                    value={formData.target_date.month}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedDropdown("target_date.month")}
                                    onBlur={() => setFocusedDropdown(null)}
                                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                >
                                    <option value="" disabled>mm</option>
                                    {generateOptions(1, 12)}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                    ${focusedDropdown === "target_date.month" ? "rotate-180" : ""}`}
                                    size={20}
                                    color="#AAAAAA"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    name="target_date.year"
                                    value={formData.target_date.year}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedDropdown("target_date.year")}
                                    onBlur={() => setFocusedDropdown(null)}
                                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                >
                                    <option value="" disabled>yyyy</option>
                                    {generateOptions(2023, 2030)}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                    ${focusedDropdown === "target_date.year" ? "rotate-180" : ""}`}
                                    size={20}
                                    color="#AAAAAA"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 relative">
                        <label className="add-training-label">Responsible <span className="text-red-500">*</span></label>
                        <select
                            name="responsible"
                            value={formData.responsible}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("responsible")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            required
                        >
                            <option value="" disabled>Select Responsible</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name || ''}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                            ${focusedDropdown === "responsible" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>

                    <div className="flex flex-col gap-3 relative">
                        <label className="add-training-label">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("status")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            required
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="On Going">On Going</option>
                            <option value="Achieved">Achieved</option>
                            <option value="Not Achieved">Not Achieved</option>
                            <option value="Modified">Modified</option>
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                            ${focusedDropdown === "status" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">Reminder Date</label>
                        <div className="grid grid-cols-3 gap-5">
                            <div className="relative">
                                <select
                                    name="reminder_date.day"
                                    value={formData.reminder_date.day}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedDropdown("reminder_date.day")}
                                    onBlur={() => setFocusedDropdown(null)}
                                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                >
                                    <option value="" disabled>dd</option>
                                    {generateOptions(1, 31)}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                    ${focusedDropdown === "reminder_date.day" ? "rotate-180" : ""}`}
                                    size={20}
                                    color="#AAAAAA"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    name="reminder_date.month"
                                    value={formData.reminder_date.month}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedDropdown("reminder_date.month")}
                                    onBlur={() => setFocusedDropdown(null)}
                                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                >
                                    <option value="" disabled>mm</option>
                                    {generateOptions(1, 12)}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                    ${focusedDropdown === "reminder_date.month" ? "rotate-180" : ""}`}
                                    size={20}
                                    color="#AAAAAA"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    name="reminder_date.year"
                                    value={formData.reminder_date.year}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedDropdown("reminder_date.year")}
                                    onBlur={() => setFocusedDropdown(null)}
                                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                >
                                    <option value="" disabled>yyyy</option>
                                    {generateOptions(2023, 2030)}
                                </select>
                                <ChevronDown
                                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                    ${focusedDropdown === "reminder_date.year" ? "rotate-180" : ""}`}
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
                                <a
                                    href={existingAttachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='click-view-file-btn gap-2 flex items-center text-[#1E84AF]'
                                >
                                    Click to view file <Eye size={17} />
                                </a>
                            )}
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                                {formData.upload_attachment
                                    ? formData.upload_attachment.name
                                    : existingAttachment
                                        ? 'Existing file'
                                        : 'No file chosen'}
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex gap-4 justify-end">
                        <div className='flex gap-5'>
                            <button
                                type="button"
                                onClick={handleListTargets}
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
            )}
        </div>
    );
};

export default QmsEditTargets;