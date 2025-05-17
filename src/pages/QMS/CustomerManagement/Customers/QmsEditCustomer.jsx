import React, { useEffect, useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { countries } from 'countries-list';
import { BASE_URL } from "../../../../Utils/Config";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import axios from 'axios';

const QmsEditCustomer = () => {
    const { id } = useParams(); // Get ID from URL parameters
    const navigate = useNavigate();
    
    // Convert countries object to a sorted array of country names
    const countryList = Object.values(countries)
        .map(country => country.name)
        .sort((a, b) => a.localeCompare(b));

    const [formData, setFormData] = useState({
        name: '',
        address: '', // Added address field to match the model
        city: '',
        street_address: '',
        state: '',
        zipcode: '', // Renamed from zip_code to zipcode
        country: '',
        email: '',
        contact_person: '',
        phone: '',
        alternate_phone: '',
        notes: '',
        upload_attachment: null, // Renamed from attachment to upload_attachment
        fax: '',
        is_draft: false, // Added is_draft field to match the model
    });

    const [attachmentFile, setAttachmentFile] = useState(null);
    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState('');

    const handleListCustomer = () => {
        navigate('/company/qms/list-customer');
    };

    // Get company ID from localStorage
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

    // Get user ID from localStorage
    const getRelevantUserId = () => {
        const userRole = localStorage.getItem("role");

        if (userRole === "user") {
            const userId = localStorage.getItem("user_id");
            if (userId) return userId;
        }

        const companyId = localStorage.getItem("company_id");
        if (companyId) return companyId;

        return null;
    };

    // Fetch customer data when component mounts
    useEffect(() => {
        fetchCustomerData();
    }, [id]);

    // Fetch customer data from the API
    const fetchCustomerData = async () => {
        setFetchLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/qms/customer/${id}/`);
            const customerData = response.data;

            // Set the file information if available
            if (customerData.upload_attachment) {
                const fileName = customerData.upload_attachment.split('/').pop();
                setAttachmentFile({
                    name: fileName,
                    url: customerData.upload_attachment
                });
            }

            // Update form data with customer data
            setFormData({
                name: customerData.name || '',
                address: customerData.address || '', // Added address field
                city: customerData.city || '',
                street_address: customerData.street_address || '',
                state: customerData.state || '',
                zipcode: customerData.zipcode || '', // Renamed from zip_code
                country: customerData.country || '',
                email: customerData.email || '',
                contact_person: customerData.contact_person || '',
                phone: customerData.phone || '',
                alternate_phone: customerData.alternate_phone || '',
                notes: customerData.notes || '',
                fax: customerData.fax || '',
                is_draft: customerData.is_draft || false, // Added is_draft field
                // upload_attachment is handled separately
            });

        } catch (error) {
            console.error('Error fetching customer data:', error);
            setError('Failed to load customer data. Please try again.');
            setShowErrorModal(true);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                upload_attachment: file // Updated from attachment to upload_attachment
            });
            setAttachmentFile({
                name: file.name,
                url: URL.createObjectURL(file)
            });
        }
    };

    // Validate the form data
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Prepare form data for submission
    const prepareSubmissionData = () => {
        const companyId = getUserCompanyId();
        const userId = getRelevantUserId();

        if (!companyId) {
            setError('Company ID not found. Please log in again.');
            return null;
        }

        const submissionData = new FormData();
        submissionData.append('company', companyId);
        submissionData.append('user', userId);
        submissionData.append('name', formData.name);
        submissionData.append('address', formData.address || ''); // Added address field
        submissionData.append('city', formData.city || '');
        submissionData.append('street_address', formData.street_address || '');
        submissionData.append('state', formData.state || '');
        submissionData.append('zipcode', formData.zipcode || ''); // Renamed from zip_code
        submissionData.append('country', formData.country || '');
        submissionData.append('email', formData.email || '');
        submissionData.append('contact_person', formData.contact_person || '');
        submissionData.append('phone', formData.phone || '');
        submissionData.append('alternate_phone', formData.alternate_phone || '');
        submissionData.append('notes', formData.notes || '');
        submissionData.append('fax', formData.fax || '');
        submissionData.append('is_draft', formData.is_draft); // Added is_draft field

        // Append file attachment if present and it's a new file (not a string URL)
        if (formData.upload_attachment && typeof formData.upload_attachment !== 'string') {
            submissionData.append('upload_attachment', formData.upload_attachment);
        }

        return submissionData;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submissionData = prepareSubmissionData();
            if (!submissionData) {
                setLoading(false);
                return;
            }

            await axios.put(`${BASE_URL}/qms/customer/${id}/`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-customer');
            }, 1500);
        } catch (error) {
            console.error('Error updating customer:', error);
            setError(error.response?.data?.message || 'Failed to update customer. Please try again.');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/company/qms/list-customer');
    };

    // Open file in new tab
    const handleViewFile = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    if (fetchLoading) {
        return (
            <div className="bg-[#1C1C24] text-white p-5 rounded-lg flex items-center justify-center h-96">
                <p>Loading customer data...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <h1 className="add-training-head">Edit Customer</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
                    onClick={() => handleListCustomer()}
                >
                    List Customer
                </button>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#2A2A32] p-5 rounded-lg text-center">
                        <p className="text-green-500 text-lg">Customer updated successfully!</p>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#2A2A32] p-5 rounded-lg text-center">
                        <p className="text-red-500 text-lg">{error || 'An error occurred'}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`add-training-inputs ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        City
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="add-training-inputs"
                    />
                </div>
                
                {/* Address field added to match the model */}
                <div className="flex flex-col gap-3 col-span-2">
                    <label className="add-training-label">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="add-training-inputs !h-[84px]"
                    />
                </div>

                <div className="flex flex-col gap-3 col-span-2">
                    <label className="add-training-label">
                        Street Address
                    </label>
                    <textarea
                        name="street_address"
                        value={formData.street_address}
                        onChange={handleChange}
                        className="add-training-inputs !h-[84px]"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        State
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="add-training-inputs"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Zipcode
                    </label>
                    <input
                        type="text"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        className="add-training-inputs"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Country</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("country")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select Country</option>
                        {countryList.map((country, index) => (
                            <option key={index} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                          ${focusedDropdown === "country" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`add-training-inputs ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Contact Person
                    </label>
                    <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        className="add-training-inputs" 
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="add-training-inputs"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Alternative Phone
                    </label>
                    <input
                        type="text"
                        name="alternate_phone"
                        value={formData.alternate_phone}
                        onChange={handleChange}
                        className="add-training-inputs"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Fax
                    </label>
                    <input
                        type="text"
                        name="fax"
                        value={formData.fax}
                        onChange={handleChange}
                        className="add-training-inputs"
                    />
                </div>

                <div className="flex flex-col gap-5 col-span-2">
                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="add-training-inputs !h-[98px]"
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
                    <div className='flex justify-between items-center'>
                        {attachmentFile && (
                            <button
                                type="button"
                                onClick={() => handleViewFile(attachmentFile.url)}
                                className='flex items-center gap-2 click-view-file-btn text-[#1E84AF]'
                            >
                                Click to view file <Eye size={17}/>
                            </button>
                        )}
                        <div>
                            {attachmentFile ? (
                                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">{attachmentFile.name}</p>
                            ) : (
                                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">No file chosen</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex gap-4 justify-end">
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
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QmsEditCustomer;