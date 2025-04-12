
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import "./qmsaddcompliance.css";

const QmsAddCompliance = () => {
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        type: '',
        day: '',
        month: '',
        year: '',
        document: null,
        businessProcess: '',
        remarks: '',
        relatedDocument: '',
        revision: ''
    });

    const [dropdowns, setDropdowns] = useState({
        type: false,
        day: false,
        month: false,
        year: false
    });

    const handleDropdownFocus = (key) => {
        setDropdowns((prev) => ({ ...prev, [key]: true }));
    };

    const handleDropdownBlur = (key) => {
        setDropdowns((prev) => ({ ...prev, [key]: false }));
    };


    const [fileName, setFileName] = useState('No file chosen');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFormData({
                ...formData,
                document: file
            });
        } else {
            setFileName('No file chosen');
            setFormData({
                ...formData,
                document: null
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here you would typically send the data to your backend
    };

    const handleCancel = () => {
        // Reset form or navigate away
        setFormData({
            name: '',
            number: '',
            type: '',
            day: '',
            month: '',
            year: '',
            document: null,
            businessProcess: '',
            remarks: '',
            relatedDocument: '',
            revision: ''
        });
        setFileName('No file chosen');
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center mb-5 px-[122px] pb-5 border-b border-[#383840]">
                <h2 className="add-compliance-head">Add Compliance / Obligation</h2>
                <button className="border border-gray-600 px-4 py-2 rounded-md text-sm">
                    List Compliance / Obligation
                </button>
            </div>
            <form onSubmit={handleSubmit} className='px-[122px]'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name/Title */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Compliance/Obligation Name/Title
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Number */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Compliance/Obligation Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Compliance/Obligation Type
                        </label>
                        <div className="relative">
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                onFocus={() => handleDropdownFocus('type')}
                                onBlur={() => handleDropdownBlur('type')}
                                className="appearance-none w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Compliance/Obligation Type</option>
                                <option value="legal">Legal</option>
                                <option value="regulatory">Regulatory</option>
                                <option value="contractual">Contractual</option>
                                <option value="internal">Internal</option>
                            </select>
                            <div
                                className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 transition-transform duration-300 ${dropdowns.type ? 'rotate-180' : ''
                                    }`}
                            >
                               <ChevronDown size={20}/>
                            </div>
                        </div>

                    </div>

                    {/* Date */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">Date</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="relative">
                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleInputChange}
                                    onFocus={() => handleDropdownFocus('day')}
                                    onBlur={() => handleDropdownBlur('day')}
                                    className="appearance-none w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">dd</option>
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                                <div
                                    className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 transition-transform duration-300 ${dropdowns.day ? 'rotate-180' : ''
                                        }`}
                                >
                                   <ChevronDown size={20}/>
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    name="month"
                                    value={formData.month}
                                    onChange={handleInputChange}
                                    onFocus={() => handleDropdownFocus('month')}
                                    onBlur={() => handleDropdownBlur('month')}
                                    className="appearance-none w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">mm</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                                <div
                                    className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 transition-transform duration-300 ${dropdowns.month ? 'rotate-180' : ''
                                        }`}
                                >
                                   <ChevronDown size={20}/>
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    onFocus={() => handleDropdownFocus('year')}
                                    onBlur={() => handleDropdownBlur('year')}
                                    className="appearance-none w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">yyyy</option>
                                    {[...Array(10)].map((_, i) => (
                                        <option key={2020 + i} value={2020 + i}>{2020 + i}</option>
                                    ))}
                                </select>
                                <div
                                    className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 transition-transform duration-300 ${dropdowns.year ? 'rotate-180' : ''
                                        }`}
                                >
                                   <ChevronDown size={20}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attach Document */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">Attach Document</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="document"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="flex">
                                <label
                                    htmlFor="document"
                                    className="bg-gray-800 border border-gray-700 text-gray-300 w-full py-2.5 px-4 rounded-md cursor-pointer truncate flex justify-between items-center"
                                >
                                    <span>Choose File</span>
                                    <span className="text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{fileName}</p>
                        </div>
                    </div>

                    {/* Relate Business Process */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">Relate Business Process</label>
                        <input
                            type="text"
                            name="businessProcess"
                            value={formData.businessProcess}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">Compliance/Obligation Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* Related Document */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">Relate Document/ Process</label>
                        <textarea
                            name="relatedDocument"
                            value={formData.relatedDocument}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* Revision */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium">Revision</label>
                        <input
                            type="text"
                            name="revision"
                            value={formData.revision}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 rounded-md p-2.5 border border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default QmsAddCompliance
