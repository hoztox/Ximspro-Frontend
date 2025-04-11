import React, { useState } from 'react'

const QmsAddAwarenessTraining = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Youtube_Link',
        description: '',
        youtubeLink: ''
    });

    const [errors, setErrors] = useState({});

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
        // Additional submission logic would go here
    };

    const handleCancel = () => {
        console.log('Form cancelled');
        // Logic for cancel action
    };

    const categories = ['Youtube_Link', 'Article', 'Webinar', 'Course'];

    return (
        <div className="bg-[#1C1C24] text-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add Awareness Training</h1>
                <button
                    className="bg-gray-800 text-white py-2 px-4 rounded border border-gray-700 hover:bg-gray-700"
                    onClick={() => console.log('List Awareness Training')}
                >
                    List Awareness Training
                </button>
            </div>

            <hr className="border-gray-700 mb-6" />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full p-3 bg-gray-800 rounded border ${errors.title ? 'border-red-500' : 'border-gray-700'}`}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block mb-2">
                            Choose Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-800 rounded border border-gray-700 appearance-none"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 rounded border border-gray-700 min-h-24"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block mb-2">
                            Youtube_Link <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="youtubeLink"
                            value={formData.youtubeLink}
                            onChange={handleChange}
                            className={`w-full p-3 bg-gray-800 rounded border ${errors.youtubeLink ? 'border-red-500' : 'border-gray-700'}`}
                        />
                        {errors.youtubeLink && <p className="text-red-500 text-sm mt-1">{errors.youtubeLink}</p>}
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default QmsAddAwarenessTraining
