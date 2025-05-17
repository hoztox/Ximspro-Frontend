import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import { BASE_URL } from "../../../../Utils/Config";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import axios from 'axios';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsAddCustomer = () => {
    const navigate = useNavigate();

    // Convert countries object to a sorted array of country names
    const countryList = Object.values(countries)
        .map(country => country.name)
        .sort((a, b) => a.localeCompare(b));

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        state: '',
        zipcode: '',
        country: '',
        email: '',
        contact_person: '',
        phone: '',
        alternate_phone: '',
        notes: '',
        upload_attachment: null,
        fax: '',
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState('');

    const handleListCustomer = () => {
        navigate('/company/qms/list-customer');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
                [name]: value,
            });
        }

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            upload_attachment: e.target.files[0] // Updated field name to match model
        });
    };

    const getUserCompanyId = () => {
        // First check if company_id is stored directly
        const storedCompanyId = localStorage.getItem("company_id");
        if (storedCompanyId) return storedCompanyId;

        // If user data exists with company_id
        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            // Try to get company_id from user data that was stored during login
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

    // Validate the form data
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Customer name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const companyId = getUserCompanyId();

    const prepareSubmissionData = (isDraft = false) => {
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
        submissionData.append('address', formData.address || ''); // Updated field name
        submissionData.append('state', formData.state || '');
        submissionData.append('zipcode', formData.zipcode || ''); // Updated field name
        submissionData.append('country', formData.country || '');
        submissionData.append('email', formData.email || '');
        submissionData.append('contact_person', formData.contact_person || '');
        submissionData.append('phone', formData.phone || '');
        submissionData.append('alternate_phone', formData.alternate_phone || '');
        submissionData.append('notes', formData.notes || '');
        submissionData.append('fax', formData.fax || '');

        // Append file attachment if present
        if (formData.upload_attachment) {
            submissionData.append('upload_attachment', formData.upload_attachment); // Updated field name
        }

        if (isDraft) {
            submissionData.append('is_draft', true);
        }

        return submissionData;
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);

            console.log("API Response:", response.data);

            if (Array.isArray(response.data)) {
                setUsers(response.data);
                console.log("Users loaded:", response.data);
            } else {
                setUsers([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            let errorMsg = 'Failed to fetch users';

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
        }
    };

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

            await axios.post(`${BASE_URL}/qms/customer/create/`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Added Customer:', submissionData);

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-customer');
            }, 1500);
            setSuccessMessage("Customer Added Successfully")
        } catch (error) {
            console.error('Error submitting form:', error);
            let errorMsg = 'Failed to add customer. Please try again.';

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

    const handleSaveAsDraft = async () => {
        setDraftLoading(true);
        setError('');

        try {
            const submissionData = prepareSubmissionData(true);
            if (!submissionData) {
                setDraftLoading(false);
                return;
            }

            await axios.post(`${BASE_URL}/qms/customer/draft-create/`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/draft-customer');
            }, 1500);
            setSuccessMessage("Customer Drafted Successfully")
        } catch (err) {
            setDraftLoading(false);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg = "Failed to draft customer";

            if (err.response) {
                // Check for field-specific errors first
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                // Check for non-field errors
                else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }

            setError(errorMsg);
            console.error('Error saving Draft:', err.response?.data || err);
        }
    };

    const handleCancel = () => {
        navigate('/company/qms/list-customer');
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <h1 className="add-training-head">Add Customer</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
                    onClick={() => handleListCustomer()}
                >
                    List Customer
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
                        className="add-training-inputs focus:outline-none"
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
                        className="add-training-inputs focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-3 col-span-2">
                    <label className="add-training-label">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[84px]"
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
                        className="add-training-inputs focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Zip Code
                    </label>
                    <input
                        type="text"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
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
                        className={`add-training-inputs focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">
                        Contact Person
                    </label>
                    <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
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
                        className="add-training-inputs focus:outline-none"
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
                        className="add-training-inputs focus:outline-none"
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
                        className="add-training-inputs focus:outline-none"
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
                    {formData.upload_attachment && (
                        <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">{formData.upload_attachment.name}</p>
                    )}
                    {!formData.upload_attachment && (
                        <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">No file chosen</p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-4 justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={handleSaveAsDraft}
                            disabled={draftLoading}
                            className='request-correction-btn duration-200'
                        >
                            {draftLoading ? 'Saving...' : 'Save as Draft'}
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
                            disabled={loading}
                            className="save-btn duration-200"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QmsAddCustomer;