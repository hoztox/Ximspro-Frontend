import React, { useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";

const QmsEditComplaints = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: 'Internal',
        details: '',
        immediate_action: '',
        name: '',
        solved: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        correctiveAction: '',
        send_notification: false
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const handleListComplaints = () => {
        navigate('/company/qms/list-complaints')
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle checkboxes
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
            return;
        }

        // Handle nested objects
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
            attachment: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form data submitted:', formData);
        // Here you would typically send the data to your backend
    };

    const handleCancel = () => {
        navigate('/company/qms/list-complaints')
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
                <h1 className="add-training-head">Edit Complaints and Feedbacks</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => handleListComplaints()}
                >
                    List Complaints and Feedbacks
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">

                <div className="flex flex-col gap-5">
                    <div className='flex flex-col gap-3 relative'>
                        <label className="add-training-label">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("name")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            required
                        >
                            <option value="" disabled>Select</option>
                            <option value="User1">User 1</option>
                            <option value="User2">User 2</option>
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                               ${focusedDropdown === "name" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>
                </div>


                <div className="flex flex-col gap-3 relative">
                    <div className='flex justify-between'>
                        <label className="add-training-label">Category <span className="text-red-500">*</span></label>
                        <button className='add-training-label !text-[12px] !text-[#1E84AF]'>Reload Agenda List</button>
                    </div>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("category")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        >
                            <option value="Internal">Internal</option>
                            <option value="External">External</option>
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-1/3 transform transition-transform duration-300 
                               ${focusedDropdown === "category" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>
                    <button className='flex justify-start add-training-label !text-[#1E84AF]'>View / Add Category Item </button>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Details
                    </label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        className="add-training-inputs !h-[98px]"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Immediate Action</label>
                    <textarea
                        name="immediate_action"
                        value={formData.immediate_action}
                        onChange={handleChange}
                        className="add-training-inputs !h-[98px]"
                    >
                    </textarea>
                </div>

                <div className='flex flex-col gap-3 relative'>
                    <label className="add-training-label">
                        Executor
                    </label>
                    <select
                        name="executor"
                        value={formData.executor}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("executor")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select User</option>
                        <option value="User1">User 1</option>
                        <option value="User2">User 2</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                               ${focusedDropdown === "executor" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
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
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
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
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
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
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                       ${focusedDropdown === "date.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Solved After Action?</label>
                    <select
                        name="solved"
                        value={formData.solved}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("solved")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>

                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                               ${focusedDropdown === "solved" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>



                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Corrective Action Needed ?</label>
                    <div className="relative">
                        <select
                            name="correctiveAction"
                            value={formData.correctiveAction}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("correctiveAction")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        >
                            <option value="" disabled>Select Action</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-1/3 transform transition-transform duration-300
                               ${focusedDropdown === "correctiveAction" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
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
                    <div className='flex justify-between'>
                        <button className='flex items-center click-view-file-btn gap-2 text-[#1E84AF]'>
                            Click to view file <Eye size={18}/>
                        </button>

                        <div>
                            {formData.attachment && (
                                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">{formData.attachment.name}</p>
                            )}
                            {!formData.attachment && (
                                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">No file chosen</p>
                            )}
                        </div>
                    </div>
                </div>


                <div className=" flex items-end gap-4 w-full">

                    <div className='flex gap-5 w-full'>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel-btn duration-200 !w-full"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn duration-200 !w-full"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QmsEditComplaints
