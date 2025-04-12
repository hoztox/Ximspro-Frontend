import React, { useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg"
import { useNavigate } from 'react-router-dom';

const EditQmsProcesses = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        processes_type: 'Internal',
        identifications: '',
        specialRequirements: '',
        related_procedures: '',
        custom_related_procedures: '',
        file: null,
    });

    const [dropdownRotation, setDropdownRotation] = useState({
        processes_type: false,
        related_procedures: false,
    });


    const [showCustomField, setShowCustomField] = useState(false);

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


        if (name === 'related_procedures') {
            setShowCustomField(value === 'N/A');
        }
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

        console.log('Form submitted:', formData);

    };

    const handleCancel = () => {
        navigate('/company/qms/processes')
    };

    return (
        <div className="bg-[#1C1C24] p-5 rounded-lg text-white ">
            <h1 className="add-interested-parties-head px-[122px] border-b border-[#383840] pb-5">Edit Processes</h1>

            <form onSubmit={handleSubmit} className='px-[122px]'>
                <div className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="block mb-3 add-qms-manual-label">Name/Title</label>
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
                            <label className="block mb-3 add-qms-manual-label">Processes No/Identification</label>
                            <input
                                type="text"
                                name="identifications"
                                placeholder="Enter Processes No/identification"
                                value={formData.identifications}
                                onChange={handleInputChange}
                                className="w-full add-qms-intertested-inputs"
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block  mb-3 add-qms-manual-label">Processes Type</label>
                            <div className="relative">
                                <select
                                    name="processes_type"
                                    value={formData.processes_type}
                                    onChange={handleInputChange}
                                    onFocus={() => toggleDropdown('processes_type')}
                                    onBlur={() => toggleDropdown('processes_type')}
                                    className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                                >
                                    <option value="Internal">Internal</option>
                                    <option value="External">External</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none transition-transform duration-300">
                                    <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${dropdownRotation.processes_type ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-3 add-qms-manual-label">Related Procedures</label>
                            <div className="relative">
                                <select
                                    name="related_procedures"
                                    value={formData.related_procedures}
                                    onChange={handleInputChange}
                                    onFocus={() => toggleDropdown('related_procedures')}
                                    onBlur={() => toggleDropdown('related_procedures')}
                                    className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                                >
                                    <option value="">Choose</option>
                                    <option value="GDPR">GDPR</option>
                                    <option value="HIPAA">HIPAA</option>
                                    <option value="CCPA">CCPA</option>
                                    <option value="SOX">SOX</option>
                                    <option value="N/A">N/A</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${dropdownRotation.related_procedures ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </div>

                            {/* Animated container for the custom field */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${showCustomField ? 'h-32 mt-3 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <textarea
                                    name="custom_related_procedures"
                                    placeholder="Please specify"
                                    value={formData.custom_related_procedures}
                                    onChange={handleInputChange}
                                    className="w-full add-qms-intertested-inputs !h-[118px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="">
                            <label className="block mb-3 add-qms-manual-label">Upload File</label>
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
                                    onClick={() => document.getElementById("fileInput").click()}
                                >
                                    <span className="file-input">
                                        {selectedFile ? selectedFile : "Choose File"}
                                    </span>
                                    <img src={file} alt="File Icon" />
                                </button>
                                <div className="flex justify-between items-center">
                                    <button className="flex items-center mt-[10.65px] gap-[8px]">
                                        <p className="click-view-file-btn text-[#1E84AF] ">
                                            Click to view file
                                        </p>
                                        <Eye size={16} className="text-[#1E84AF] " />
                                    </button>
                                    {!selectedFile && (
                                        <p className="text-right no-file">No file chosen</p>
                                    )}
                                </div>
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

export default EditQmsProcesses
