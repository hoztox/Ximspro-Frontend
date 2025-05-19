import React, { useEffect, useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { countries } from 'countries-list';
import { BASE_URL } from "../../../../Utils/Config";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import axios from 'axios';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsEditDraftCustomer = () => {
    const { id } = useParams();
    console.log('aaaa:', id);

    const navigate = useNavigate();

    // Convert countries object to a sorted array of country names
    const countryList = Object.values(countries)
        .map(country => country.name)
        .sort((a, b) => a.localeCompare(b));

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '', // Changed from street_address to address to match the model
        state: '',
        zipcode: '', // Changed from zip_code to zipcode to match the model
        country: '',
        email: '',
        contact_person: '',
        phone: '',
        alternate_phone: '',
        notes: '',
        upload_attachment: null, // Changed from attachment to upload_attachment to match the model
        fax: '',
    });

    const [attachmentFile, setAttachmentFile] = useState(null);
    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);

    const [error, setError] = useState('');

    const handleListDraftCustomer = () => {
        navigate('/company/qms/draft-customer');
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

    // Fetch draft customer data when component mounts
    useEffect(() => {
        fetchDraftCustomerData();
    }, [id]);

    // Fetch draft customer data from the API
    const fetchDraftCustomerData = async () => {
        setFetchLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/qms/customer/${id}/`);
            const draftCustomerData = response.data;

            // Set the file information if available
            if (draftCustomerData.upload_attachment) { // Changed from attachment to upload_attachment
                const fileName = draftCustomerData.upload_attachment.split('/').pop();
                setAttachmentFile({
                    name: fileName,
                    url: draftCustomerData.upload_attachment
                });
            }

            // Update form data with draft customer data
            setFormData({
                name: draftCustomerData.name || '',
                city: draftCustomerData.city || '',
                address: draftCustomerData.address || '', // Changed from street_address to address
                state: draftCustomerData.state || '',
                zipcode: draftCustomerData.zipcode || '', // Changed from zip_code to zipcode
                country: draftCustomerData.country || '',
                email: draftCustomerData.email || '',
                contact_person: draftCustomerData.contact_person || '',
                phone: draftCustomerData.phone || '',
                alternate_phone: draftCustomerData.alternate_phone || '',
                notes: draftCustomerData.notes || '',
                fax: draftCustomerData.fax || '',
                // upload_attachment is handled separately
            });

        } catch (error) {
            console.error('Error fetching draft customer data:', error);
            let errorMsg = error.message;

            if (error.response) {
                // Check for field-specific errors first
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
                // Check for non-field errors
                else if (error.response.data.detail) {
                    errorMsg = error.response.data.detail;
                }
                else if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }

            setError(errorMsg);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
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
                upload_attachment: file // Changed from attachment to upload_attachment
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
        submissionData.append('city', formData.city || '');
        submissionData.append('address', formData.address || ''); // Changed from street_address to address
        submissionData.append('state', formData.state || '');
        submissionData.append('zipcode', formData.zipcode || ''); // Changed from zip_code to zipcode
        submissionData.append('country', formData.country || '');
        submissionData.append('email', formData.email || '');
        submissionData.append('contact_person', formData.contact_person || '');
        submissionData.append('phone', formData.phone || '');
        submissionData.append('alternate_phone', formData.alternate_phone || '');
        submissionData.append('notes', formData.notes || '');
        submissionData.append('fax', formData.fax || '');

        // Append file attachment if present and it's a new file (not a string URL)
        if (formData.upload_attachment && typeof formData.upload_attachment !== 'string') { // Changed from attachment to upload_attachment
            submissionData.append('upload_attachment', formData.upload_attachment); // Changed from attachment to upload_attachment
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
                navigate('/company/qms/draft-customer');
            }, 1500);
            setSuccessMessage("Customer updated successfully")
        } catch (error) {
            console.error('Error updating draft customer:', error);
            let errorMsg =  error.message;

            if (error.response) {
                // Check for field-specific errors first
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
                // Check for non-field errors
                else if (error.response.data.detail) {
                    errorMsg = error.response.data.detail;
                }
                else if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }

            setError(errorMsg);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/company/qms/draft-customer');
    };

    // Open file in new tab
    const handleViewFile = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    if (fetchLoading) {
        return (
            <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex items-center justify-center h-96">
                <p>Loading draft customer data...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <h1 className="add-training-head">Edit Draft Customer</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
                    onClick={() => handleListDraftCustomer()}
                >
                    List Draft Customer
                </button>
            </div>

            <SuccessModal
                showSuccessModal={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                successMessage={successMessage}
            />

            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={error}
            />


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

                <div className="flex flex-col gap-3 col-span-2">
                    <label className="add-training-label">
                        Address
                    </label>
                    <textarea
                        name="address" // Changed from street_address to address
                        value={formData.address} // Changed from street_address to address
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
                        Zip Code
                    </label>
                    <input
                        type="text"
                        name="zipcode" // Changed from zip_code to zipcode
                        value={formData.zipcode} // Changed from zip_code to zipcode
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
                        className="add-training-inputs"
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
                                Click to view file <Eye size={17} />
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

export default QmsEditDraftCustomer;