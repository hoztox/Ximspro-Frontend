
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import file from "../../../assets/images/Company Documentation/file-icon.svg"
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

        const [selectedFile, setSelectedFile] = useState(null);

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
                <button
                    className="flex items-center justify-center add-manual-btn gap-[10px] !w-[238px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                >
                    <span>List Compliance / Obligation</span>
                </button>
            </div>
            <form onSubmit={handleSubmit} className='px-[122px]'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name/Title */}
                    <div>
                        <label className="add-compliance-label">
                            Compliance/Obligation Name/Title
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full add-compliance-inputs"
                        />
                    </div>

                    {/* Number */}
                    <div>
                        <label className="add-compliance-label">
                            Compliance/Obligation Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            required
                            className="w-full add-compliance-inputs"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="add-compliance-label">
                            Compliance/Obligation Type
                        </label>
                        <div className="relative">
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                onFocus={() => handleDropdownFocus('type')}
                                onBlur={() => handleDropdownBlur('type')}
                                className="appearance-none w-full add-compliance-inputs"
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
                                <ChevronDown size={20} />
                            </div>
                        </div>

                    </div>

                    {/* Date */}
                    <div>
                        <label className="add-compliance-label">Date</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="relative">
                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleInputChange}
                                    onFocus={() => handleDropdownFocus('day')}
                                    onBlur={() => handleDropdownBlur('day')}
                                    className="appearance-none w-full add-compliance-inputs"
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
                                    <ChevronDown size={20} />
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    name="month"
                                    value={formData.month}
                                    onChange={handleInputChange}
                                    onFocus={() => handleDropdownFocus('month')}
                                    onBlur={() => handleDropdownBlur('month')}
                                    className="appearance-none w-full add-compliance-inputs"
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
                                    <ChevronDown size={20} />
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    onFocus={() => handleDropdownFocus('year')}
                                    onBlur={() => handleDropdownBlur('year')}
                                    className="appearance-none w-full add-compliance-inputs"
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
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attach Document */}
                    <div>
                        <label className="add-compliance-label">Attach Document</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="document"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                className="w-full add-qmsmanual-attach"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                <span className="file-input">
                                    {selectedFile ? selectedFile : "Choose File"}
                                </span>
                                <img src={file} alt="File Icon" />
                            </button>
                            {!selectedFile && <p className="text-right no-file">No file chosen</p>}
                        </div>
                    </div>

                    {/* Relate Business Process */}
                    <div>
                        <label className="add-compliance-label">Relate Business Process</label>
                        <input
                            type="text"
                            name="businessProcess"
                            value={formData.businessProcess}
                            onChange={handleInputChange}
                            className="w-full add-compliance-inputs"
                        />
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="add-compliance-label">Compliance/Obligation Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full add-compliance-inputs !h-[98px]"
                        ></textarea>
                    </div>

                    {/* Related Document */}
                    <div>
                        <label className="add-compliance-label">Relate Document/ Process</label>
                        <textarea
                            name="relatedDocument"
                            value={formData.relatedDocument}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full add-compliance-inputs !h-[98px]"
                        ></textarea>
                    </div>

                    {/* Revision */}
                    <div className="md:col-span-2">
                        <label className="add-compliance-label">Revision</label>
                        <input
                            type="text"
                            name="revision"
                            value={formData.revision}
                            onChange={handleInputChange}
                            className="w-full add-compliance-inputs"
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
