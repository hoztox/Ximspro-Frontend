import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg"
import "./qmsaddawarenesstraining.css"
import { useNavigate } from 'react-router-dom';

const QmsAddAwarenessTraining = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Youtube_Link',
        description: '',
        youtubeLink: '',
        webLink: '',
        presentationFile: null
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [fieldVisible, setFieldVisible] = useState(true);

    // Handle animation timing
    const handleCategoryChange = (e) => {
        const { value } = e.target;

        // First hide the current field
        setFieldVisible(false);

        // After animation completes, change the category and show the new field
        setTimeout(() => {
            setFormData(prevData => ({
                ...prevData,
                category: value
            }));
            setFieldVisible(true);
        }, 300); // 300ms matches our animation duration
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            presentationFile: e.target.files[0]
        }));

        // Clear error when user selects a file
        if (errors.presentationFile) {
            setErrors(prevErrors => ({
                ...prevErrors,
                presentationFile: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';

        // Validate based on category
        if (formData.category === 'Youtube_Link' && !formData.youtubeLink.trim()) {
            newErrors.youtubeLink = 'YouTube link is required';
        } else if (formData.category === 'WebLink' && !formData.webLink.trim()) {
            newErrors.webLink = 'Web link is required';
        } else if (formData.category === 'Presentation' && !formData.presentationFile) {
            newErrors.presentationFile = 'Presentation file is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleListAwarenessTraining = () => {
        navigate('/company/qms/list-awareness-training')
    }

    const handleCancel = () => {
        navigate('/company/qms/list-awareness-training')
    };

    const categories = ['Youtube_Link', 'Presentation', 'WebLink'];

    // Render the appropriate input field based on category
    const renderCategoryField = () => {
        const animationClass = fieldVisible ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0';

        switch (formData.category) {
            case 'Youtube_Link':
                return (
                    <div className={`transition-all duration-300 ease-in-out ${animationClass}`}>
                        <label className="block employee-performace-label">
                            Youtube Link <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="youtubeLink"
                            value={formData.youtubeLink}
                            onChange={handleChange}
                            className='w-full employee-performace-inputs !h-[84px]'
                        />
                        {errors.youtubeLink && <p className="text-red-500 text-sm mt-1">{errors.youtubeLink}</p>}
                    </div>
                );
            case 'Presentation':
                return (
                    <div className={`transition-all duration-300 ease-in-out ${animationClass}`}>
                        <label className="block employee-performace-label">Upload File  <span className="text-red-500">*</span></label>
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
                        {formData.presentationFile && (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">{formData.presentationFile.name}</p>
                        )}
                        {!formData.presentationFile && (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">No file chosen</p>
                        )}
                    </div>
                );
            case 'WebLink':
                return (
                    <div className={`transition-all duration-300 ease-in-out ${animationClass}`}>
                        <label className="block employee-performace-label">
                            Web Link <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="webLink"
                            value={formData.webLink}
                            onChange={handleChange}
                            className='w-full employee-performace-inputs !h-[84px]'
                        />
                        {errors.webLink && <p className="text-red-500 text-sm mt-1">{errors.webLink}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center px-[104px] pb-5 border-b border-[#383840]">
                <h1 className="add-awareness-training-head">Add Awareness Training</h1>
                <button className="border border-[#858585] text-[#858585] rounded px-[10px] h-[42px] w-[213px] list-training-btn duration-200"
                    onClick={handleListAwarenessTraining}
                >
                    List Awareness Training
                </button>
            </div>

            <form onSubmit={handleSubmit} className='px-[104px] pt-5'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block employee-performace-label">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className='w-full employee-performace-inputs'
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block employee-performace-label">
                            Choose Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) => {
                                    handleCategoryChange(e);
                                    setDropdownOpen(prev => !prev);
                                    // Simulate the dropdown closing after selection
                                    setTimeout(() => setDropdownOpen(false), 200);
                                }}
                                onFocus={() => setDropdownOpen(true)}
                                onBlur={() => setDropdownOpen(false)}
                                className="w-full employee-performace-inputs appearance-none cursor-pointer"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ease-in-out ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block employee-performace-label">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full employee-performace-inputs !h-[84px]"
                        />
                    </div>

                    {/* Dynamic Category Field */}
                    <div>
                        {renderCategoryField()}
                    </div>
                </div>

                <div className="flex justify-between mt-5 gap-5">
                    <div>
                        <button className='request-correction-btn duration-200'>
                            Save as Draft
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
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default QmsAddAwarenessTraining