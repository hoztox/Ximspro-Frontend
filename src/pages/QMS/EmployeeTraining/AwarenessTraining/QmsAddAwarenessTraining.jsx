import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react';
import "./qmsaddawarenesstraining.css"
import { useNavigate } from 'react-router-dom';

const QmsAddAwarenessTraining = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Youtube_Link',
        description: '',
        youtubeLink: ''
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.youtubeLink.trim()) newErrors.youtubeLink = 'YouTube link is required';

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

    const categories = ['Youtube_Link', 'Article', 'Webinar', 'Course'];

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
                                    handleChange(e);
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
                                <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ease-in-out ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}/>
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

                    <div>
                        <label className="block employee-performace-label">
                            Youtube_Link <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            type="text"
                            name="youtubeLink"
                            value={formData.youtubeLink}
                            onChange={handleChange}
                            className='w-full employee-performace-inputs !h-[84px]'
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-5 gap-5">
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
            </form>
        </div>
    );
}

export default QmsAddAwarenessTraining