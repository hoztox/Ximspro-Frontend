import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg"
import { useNavigate } from 'react-router-dom';

const EditQmsInterestedParties = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Internal',
        needs: '',
        expectations: '',
        specialRequirements: '',
        legalRequirements: '',
        file: null,
    });

    const [dropdownRotation, setDropdownRotation] = useState({
        category: false,
        legalRequirements: false,
    });

    const toggleDropdown = (field) => {
        setDropdownRotation((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
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
            setFormData({
                ...formData,
                file: file
            });
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can process the form data here
        console.log('Form submitted:', formData);
        // Then you might want to reset the form or redirect
    };

    const handleCancel = () => {
        navigate('/company/qms/interested-parties')
    };

    return (
        <div className="bg-[#1C1C24] p-5 rounded-lg text-white ">
            <h1 className="add-interested-parties-head px-[122px] border-b border-[#383840] pb-5">Edit Interested Parties</h1>

            <form onSubmit={handleSubmit} className='px-[122px]'>
                <div className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="block mb-3 add-qms-manual-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full add-qms-intertested-inputs"
                            />
                        </div>

                        <div>
                            <label className="block  mb-3 add-qms-manual-label">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    onFocus={() => toggleDropdown('category')}
                                    onBlur={() => toggleDropdown('category')}
                                    className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                                >
                                    <option value="Internal">Internal</option>
                                    <option value="External">External</option>
                                    <option value="Vendor">Vendor</option>
                                    <option value="Client">Client</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none transition-transform duration-300">
                                    <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${dropdownRotation.category ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block mb-3 add-qms-manual-label">Needs</label>
                            <input
                                type='text'
                                name="needs"
                                placeholder="Enter Needs"
                                value={formData.needs}
                                onChange={handleInputChange}
                                className="w-full add-qms-intertested-inputs"
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className="block mb-3 add-qms-manual-label">Expectations</label>
                            <input
                                type="text"
                                name="expectations"
                                placeholder="Enter Expectations"
                                value={formData.expectations}
                                onChange={handleInputChange}
                                className="w-full add-qms-intertested-inputs"
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block mb-3 add-qms-manual-label">Special Requirements</label>
                            <input
                                type="text"
                                name="specialRequirements"
                                placeholder="Enter Special Requirements"
                                value={formData.specialRequirements}
                                onChange={handleInputChange}
                                className="w-full add-qms-intertested-inputs"
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className="block  mb-3 add-qms-manual-label">Applicable Legal/Regulatory Requirements</label>
                            <div className="relative">
                                <select
                                    name="legalRequirements"
                                    value={formData.legalRequirements}
                                    onChange={handleInputChange}
                                    onFocus={() => toggleDropdown('legalRequirements')}
                                    onBlur={() => toggleDropdown('legalRequirements')}
                                    className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                                >
                                    <option value="">Choose</option>
                                    <option value="GDPR">GDPR</option>
                                    <option value="HIPAA">HIPAA</option>
                                    <option value="CCPA">CCPA</option>
                                    <option value="SOX">SOX</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none transition-transform duration-300">
                                    <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${dropdownRotation.legalRequirements ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </div>

                        </div>

                        <div className="mb-6">
                            <label className="block  mb-3 add-qms-manual-label">Upload File</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="fileInput"
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

                        <div className="flex justify-end space-x-4 mt-8">
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
                </div>
            </form>
        </div>
    );
};

export default EditQmsInterestedParties
