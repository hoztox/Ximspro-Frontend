import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import CategoryModal from '../CategoryModal';
import AddCarNumberModal from '../AddCarNumberModal';
import { BASE_URL } from '../../../../Utils/Config';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsEditComplaints = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCarModalOpen, setIsCarModalOpen] = useState(false);

    // State for API data
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [carNumbers, setCarNumbers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({
        customer: false,
    });

    const validateForm = () => {
        const errors = {
            customer: !formData.customer,
        };
        setFieldErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const getUserCompanyId = () => {
        const role = localStorage.getItem("role");

        if (role === "company") {
            return localStorage.getItem("company_id");
        } else if (role === "user") {
            try {
                const userCompanyId = localStorage.getItem("user_company_id");
                return userCompanyId ? JSON.parse(userCompanyId) : null;
            } catch (e) {
                console.error("Error parsing user company ID:", e);
                return null;
            }
        }
        return null;
    };

    // Get company ID from localStorage
    const companyId = getUserCompanyId();
    const userId = localStorage.getItem("user_id");

    const [formData, setFormData] = useState({
        customer: '',
        details: '',
        immediate_action: '',
        executor: '',
        solved_after_action: 'Yes',
        category: [],
        date: '',
        corrective_action_need: 'Yes',
        corrections: '',
        no_car: '',
        upload_attachment: null,
        is_draft: false,
        send_notification: false
    });

    const [dateInputs, setDateInputs] = useState({
        day: '',
        month: '',
        year: ''
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        if (companyId) {
            fetchCustomers();
            fetchUsers();
            fetchCarNumbers();
            fetchCategories();

            // If ID exists, fetch complaint data
            if (id) {
                fetchComplaintData(id);
            }
        }
    }, [companyId, id]);

    // Filter categories based on search term
    useEffect(() => {
        if (categories.length > 0) {
            const filtered = categories.filter(category =>
                category.title.toLowerCase().includes(categorySearchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [categorySearchTerm, categories]);

    const fetchComplaintData = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/qms/complaints/${id}/`);
            const data = response.data;
            console.log('edit complaints:', data);

            // Parse date if it exists
            let day = '';
            let month = '';
            let year = '';

            if (data.date) {
                const dateObj = new Date(data.date);
                day = String(dateObj.getDate()).padStart(2, '0');
                month = String(dateObj.getMonth() + 1).padStart(2, '0');
                year = String(dateObj.getFullYear());
            }

            setDateInputs({
                day,
                month,
                year
            });

            // Transform category data to ensure it's an array of IDs
            const categoryIds = Array.isArray(data.category)
                ? data.category.map(cat => typeof cat === 'object' ? cat.id : cat)
                : [];

            // Update formData with fetched data
            setFormData({
                customer: data.customer?.id || '',
                details: data.details || '',
                immediate_action: data.immediate_action || '',
                executor: data.executor?.id || '',
                solved_after_action: data.solved_after_action || 'Yes',
                category: categoryIds,
                date: data.date || '',
                corrective_action_need: data.corrective_action_need || 'Yes',
                corrections: data.corrections || '',
                no_car: data.no_car?.id || '',
                upload_attachment: null,
                is_draft: data.is_draft || false
            });

        } catch (err) {
            console.error("Error fetching complaint data:", err);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg = err.message;

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
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/qms/customer/company/${companyId}/`);
            setCustomers(response.data);
        } catch (err) {
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg = err.message;

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
            console.error("Error fetching customers:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);

            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
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
        }
    };

    const fetchCarNumbers = async () => {
        try {
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/car_no/company/${companyId}/`);
            setCarNumbers(response.data);
        } catch (err) {
            console.error("Error fetching CAR numbers:", err);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg =  err.message;

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
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/qms/category/company/${companyId}/`);
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg = err.message;

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
        } finally {
            setLoading(false);
        }
    };

    const handleListComplaints = () => {
        navigate('/company/qms/list-complaints');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle checkboxes
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
            return;
        }

        // Handle date fields
        if (name.startsWith('date.')) {
            const datePart = name.split('.')[1];
            setDateInputs({
                ...dateInputs,
                [datePart]: value
            });

            // Update the full date in ISO format when all parts are present
            const updatedDateInputs = { ...dateInputs, [datePart]: value };
            if (updatedDateInputs.day && updatedDateInputs.month && updatedDateInputs.year) {
                const formattedDate = `${updatedDateInputs.year}-${updatedDateInputs.month}-${updatedDateInputs.day}`;
                setFormData({
                    ...formData,
                    date: formattedDate
                });
            }
            return;
        }

        // Handle all other fields
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCategoryToggle = (categoryId) => {
        const categoryIdInt = parseInt(categoryId);

        setFormData(prevData => {
            if (prevData.category.includes(categoryIdInt)) {
                return {
                    ...prevData,
                    category: prevData.category.filter(id => id !== categoryIdInt)
                };
            } else {
                return {
                    ...prevData,
                    category: [...prevData.category, categoryIdInt]
                };
            }
        });
    };

    const handleRemoveCategory = (categoryId) => {
        setFormData(prevData => ({
            ...prevData,
            category: prevData.category.filter(id => id !== categoryId)
        }));
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.title : '';
    };

    const handleOpenCarModal = () => {
        setIsCarModalOpen(true);
    };

    const handleCloseCarModal = () => {
        setIsCarModalOpen(false);
    };

    const handleAddCar = (car) => {
        // After adding a new car, fetch the updated list
        fetchCarNumbers();
        // Select the newly added car
        if (car && car.id) {
            setFormData({
                ...formData,
                no_car: car.id
            });
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddCategory = (category) => {
        // After adding a new category, fetch the updated list
        fetchCategories();
        // Update the selected category
        if (category && category.id) {
            // Add the new category ID to the array of selected categories
            const newCategoryId = category.id;
            if (!formData.category.includes(newCategoryId)) {
                setFormData({
                    ...formData,
                    category: [...formData.category, newCategoryId]
                });
            }
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            upload_attachment: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);

            // Create a regular object first (not FormData)
            const submitData = {
                ...formData,
                user: userId,
                company: companyId
            };

            // Convert to FormData only if we have a file to upload
            let payload;
            if (formData.upload_attachment) {
                payload = new FormData();
                // Append all fields except category
                Object.keys(submitData).forEach(key => {
                    if (key !== 'category' && submitData[key] !== null && submitData[key] !== undefined) {
                        if (key === 'upload_attachment') {
                            payload.append(key, submitData[key]);
                        } else {
                            payload.append(key, String(submitData[key]));
                        }
                    }
                });
                // Append categories separately
                if (Array.isArray(submitData.category)) {
                    submitData.category.forEach(catId => {
                        payload.append('category', catId);
                    });
                }
            } else {
                // No file upload - send as JSON
                payload = submitData;
            }

            console.log('Submitting data:', payload);

            const config = formData.upload_attachment ? {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            } : {};

            let response;
            if (id) {
                response = await axios.put(
                    `${BASE_URL}/qms/complaints/${id}/`,
                    payload,
                    config
                );
            } else {
                response = await axios.post(
                    `${BASE_URL}/qms/complaints/`,
                    payload,
                    config
                );
            }
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/company/qms/list-complaints');
            }, 1500);
            setSuccessMessage("Compliants updated successfully")
        } catch (err) {
            console.error("Error submitting form:", err);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg = err.message;

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
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        navigate('/company/qms/list-complaints');
    };

    // Generate options for dropdowns
    const generateOptions = (start, end, prefix = '') => {
        const options = [];
        for (let i = start; i <= end; i++) {
            const value = i < 10 ? `0${i}` : `${i}`;
            options.push(
                <option key={i} value={value}>
                    {prefix}{value}
                </option>
            );
        }
        return options;
    };

    if (loading && !customers.length) {
        return <div className="flex justify-center items-center p-10">Loading...</div>;
    }

    if (error) {
        return <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>;
    }

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAddCause={handleAddCategory}
                />

                <AddCarNumberModal
                    isOpen={isCarModalOpen}
                    onClose={handleCloseCarModal}
                    onAddCause={handleAddCar}
                />

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

                <h1 className="add-training-head">
                    {id ? "Edit" : "Add"} Complaints and Feedbacks
                </h1>
                <button
                    type="button"
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
                    onClick={() => handleListComplaints()}
                >
                    List Complaints and Feedbacks
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                {/* Customer Selection */}
                <div className="flex flex-col gap-5">
                    <div className='flex flex-col gap-3 relative'>
                        <label className="add-training-label">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="customer"
                            value={formData.customer}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("customer")}
                            onBlur={() => {
                                setFocusedDropdown(null);
                                setFieldErrors(prev => ({
                                    ...prev,
                                    customer: !formData.customer
                                }));
                            }}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        >
                            <option value="" disabled>Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
      ${focusedDropdown === "customer" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                        {fieldErrors.customer && (
                            <p className="text-red-500 text-sm mt-1">Please select customer</p>
                        )}
                    </div>
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-3 relative">
                    <div className="flex items-center justify-between">
                        <label className="add-training-label">
                            Categories <span className="text-red-500">*</span>
                        </label>
                    </div>

                    <div className="relative">
                        <div className="flex items-center mb-2 border border-[#383840] rounded-md">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={categorySearchTerm}
                                onChange={(e) => setCategorySearchTerm(e.target.value)}
                                className="add-training-inputs !pr-10"
                            />
                            <Search
                                className="absolute right-3"
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>

                    <div className="border border-[#383840] rounded-md p-2 max-h-[130px] overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map(category => (
                                <div key={category.id} className="flex items-center py-2 last:border-0">
                                    <input
                                        type="checkbox"
                                        id={`category-${category.id}`}
                                        checked={formData.category.includes(category.id)}
                                        onChange={() => handleCategoryToggle(category.id)}
                                        className="mr-2 form-checkboxes"
                                    />
                                    <label
                                        htmlFor={`category-${category.id}`}
                                        className="text-sm text-[#AAAAAA] cursor-pointer"
                                    >
                                        {category.title}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-[#AAAAAA] p-2">
                                {categories.length === 0 ? 'No categories available' : 'No matching categories found'}
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        className='flex justify-start add-training-label !text-[#1E84AF] hover:text-[#29a6db] transition-colors'
                        onClick={handleOpenModal}
                    >
                        View / Add Category Item
                    </button>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Details
                    </label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        className="add-training-inputs !h-[98px]"
                        required
                    />
                </div>

                {/* Immediate Action */}
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Immediate Action</label>
                    <textarea
                        name="immediate_action"
                        value={formData.immediate_action}
                        onChange={handleChange}
                        className="add-training-inputs !h-[98px]"
                    />
                </div>

                {/* Executor */}
                <div className='flex flex-col gap-3 relative'>
                    <label className="add-training-label">
                        Executor
                    </label>
                    <select
                        name="executor"
                        value={formData.executor}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("executor")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                             ${focusedDropdown === "executor" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                {/* Date */}
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Date</label>
                    <div className="grid grid-cols-3 gap-5">
                        {/* Day */}
                        <div className="relative">
                            <select
                                name="date.day"
                                value={dateInputs.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                required
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                     ${focusedDropdown === "date.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Month */}
                        <div className="relative">
                            <select
                                name="date.month"
                                value={dateInputs.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                required
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                     ${focusedDropdown === "date.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Year */}
                        <div className="relative">
                            <select
                                name="date.year"
                                value={dateInputs.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("date.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                                required
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                     ${focusedDropdown === "date.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>

                {/* Solved After Action */}
                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Solved After Action?</label>
                    <select
                        name="solved_after_action"
                        value={formData.solved_after_action}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("solved_after_action")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                             ${focusedDropdown === "solved_after_action" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                {/* Corrective Action Needed */}
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Corrective Action Needed?</label>
                    <div className="relative">
                        <select
                            name="corrective_action_need"
                            value={formData.corrective_action_need}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("corrective_action_need")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            required
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-1/3 transform transition-transform duration-300
                             ${focusedDropdown === "corrective_action_need" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>
                </div>

                {/* Conditionally render Corrections and CAR Number fields */}
                {formData.corrective_action_need === 'Yes' && (
                    <>
                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Corrections
                            </label>
                            <input
                                type='text'
                                name="corrections"
                                value={formData.corrections}
                                onChange={handleChange}
                                className="add-training-inputs"
                            />
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            <label className="add-training-label">CAR Number</label>
                            <select
                                name="no_car"
                                value={formData.no_car}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("no_car")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>Select CAR Number</option>
                                {carNumbers.map(car => (
                                    <option key={car.id} value={car.id}>
                                        {car.action_no}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[45%] transform transition-transform duration-300 
                             ${focusedDropdown === "no_car" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                            <button
                                type="button"
                                className='flex justify-start add-training-label !text-[#1E84AF]'
                                onClick={handleOpenCarModal}
                            >
                                Add CAR Number
                            </button>
                        </div>
                    </>
                )}

                {/* File Upload */}
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
                    {formData.upload_attachment ? (
                        <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                            {formData.upload_attachment.name}
                        </p>
                    ) : (
                        <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                            No file chosen
                        </p>
                    )}
                </div>

                {/* Form Actions */}
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

export default QmsEditComplaints;