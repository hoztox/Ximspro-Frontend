import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddCarNumberModal from '../AddCarNumberModal';
import { BASE_URL } from '../../../../Utils/Config';

const QmsAddSupplierProblem = () => {
    const navigate = useNavigate();
    const [isCarModalOpen, setIsCarModalOpen] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [users, setUsers] = useState([]);
    const [carNumbers, setCarNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        supplier: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        problem: '',
        immediate_action: '',
        executor: '',
        solved: 'No',
        corrective_action_need: 'No',  
        corrections: '',
        no_car: '', // Changed from car to match backend field name
        cars: [],
    });
    const [isDraft, setIsDraft] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [focusedDropdown, setFocusedDropdown] = useState(null);

    // Get company ID from local storage
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

    // Get relevant user ID
    const getRelevantUserId = () => {
        return localStorage.getItem("user_id") || "";
    };

    const companyId = getUserCompanyId();

    // Fetch suppliers data from API
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/suppliers/company/${companyId}/`);
                // Filter only active suppliers with Approved status
                const activeSuppliers = response.data.filter(supplier =>
                    supplier.active === 'active'
                );
                setSuppliers(activeSuppliers);
                setError(null);
            } catch (err) {
                setError('Failed to fetch suppliers data');
                console.error('Error fetching suppliers:', err);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchSuppliers();
        }
    }, [companyId]);

    // Fetch users for executor dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!companyId) {
                    setError('Company ID not found. Please log in again.');
                    return;
                }

                const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);

                console.log("API Response (Users):", response.data);

                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                    console.log("Users loaded:", response.data);
                } else {
                    setUsers([]);
                    console.error("Unexpected response format:", response.data);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users. Please check your connection and try again.");
            }
        };

        if (companyId) {
            fetchUsers();
        }
    }, [companyId]);

    // Fetch CAR numbers
    useEffect(() => {
        const fetchCarNumbers = async () => {
            try {
                if (!companyId) {
                    setError('Company ID not found. Please log in again.');
                    return;
                }

                const response = await axios.get(`${BASE_URL}/qms/car_no/company/${companyId}/`);
                console.log("API Response (CAR Numbers):", response.data);

                setCarNumbers(response.data);
                // Update formData.cars with the fetched CAR numbers
                if (Array.isArray(response.data)) {
                    setFormData(prev => ({
                        ...prev,
                        cars: response.data.map(item => item.car_no || item.action_no)
                    }));
                }
            } catch (err) {
                console.error("Error fetching CAR numbers:", err);
                setError("Failed to load CAR numbers. Please check your connection and try again.");
            }
        };

        if (companyId) {
            fetchCarNumbers();
        }
    }, [companyId]);

    // Get today's date for default value
    useEffect(() => {
        const today = new Date();
        setFormData(prev => ({
            ...prev,
            date: {
                day: String(today.getDate()).padStart(2, '0'),
                month: String(today.getMonth() + 1).padStart(2, '0'),
                year: String(today.getFullYear())
            }
        }));
    }, []);

    const handleSupplierProblemLog = () => {
        navigate('/company/qms/supplier-problem-log');
    };

    const handleOpenCarModal = () => {
        setIsCarModalOpen(true);
    };

    const handleCloseCarModal = () => {
        setIsCarModalOpen(false);
    };

    const handleAddCar = (cars) => {
        setFormData({
            ...formData,
            cars: cars
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested objects
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
                [name]: value
            });
        }
    };

    const formatFormDataForSubmission = () => {
        const formattedDate = `${formData.date.year}-${formData.date.month}-${formData.date.day}`;

        return {
            company: companyId,
            supplier: formData.supplier,
            date: formattedDate,
            problem: formData.problem,
            immediate_action: formData.immediate_action,
            executor: formData.executor,
            solved: formData.solved,
            corrective_action_need: formData.corrective_action_need,
            corrections: formData.corrections || '',
            no_car: formData.no_car || null,
            is_draft: isDraft,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const submissionData = formatFormDataForSubmission();
            const userId = getRelevantUserId();
            console.log('Submission data:', submissionData);

            if (!companyId) {
                setError("Company ID not found. Please log in again.");
                setSubmitting(false);
                return;
            }

            // Add user ID to the request data
            const finalSubmissionData = {
                ...submissionData,
                user: userId
            };

            // Submit to the API
            const response = await axios.post(`${BASE_URL}/qms/supplier-problems/`, finalSubmissionData);

            console.log('Supplier Problems Response:', response.data);

            // Navigate back to list on success
            navigate('/company/qms/supplier-problem-log');
        } catch (err) {
            console.error('Error submitting supplier problem:', err);
            setError('Failed to submit supplier problem. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsDraft(true);

        try {
            setFormData(prev => ({
                ...prev,
                is_draft: true
            }));

            const submissionData = formatFormDataForSubmission();
            submissionData.is_draft = true;

            const userId = getRelevantUserId();

            // Add user ID
            const finalSubmissionData = {
                ...submissionData,
                user: userId
            };

            // Submit as draft to the API
            const response = await axios.post(`${BASE_URL}/qms/supplier-problems/draft-create/`, finalSubmissionData);
            console.log('Draft saved supplier problem:', response.data);
            navigate('/company/qms/drafts-supplier-problem');
        } catch (err) {
            console.error('Error saving draft:', err);
            setError('Failed to save draft. Please try again.');
        } finally {
            setIsDraft(false);
        }
    };

    const handleCancel = () => {
        navigate('/company/qms/supplier-problem-log');
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

    // Check if corrective action is needed to display conditional fields
    const showCorrectiveFields = formData.corrective_action_need === 'Yes';

    if (loading) return <div className="bg-[#1C1C24] text-white p-5 rounded-lg flex justify-center items-center h-64">Loading suppliers data...</div>;

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <h1 className="add-training-head">Enter Supplier Problem</h1>

                <AddCarNumberModal
                    isOpen={isCarModalOpen}
                    onClose={handleCloseCarModal}
                    onAddCar={handleAddCar}
                />

                <button
                    className="border border-[#858585] text-[#858585] rounded px-5 h-[42px] list-training-btn duration-200"
                    onClick={handleSupplierProblemLog}
                >
                    Supplier Problem Log
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Supplier Name <span className="text-red-500">*</span></label>
                    <select
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("supplier")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select</option>
                        {suppliers.length > 0 ?
                            suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.company_name}
                                </option>
                            )) :
                            <option value="" disabled>No suppliers available</option>
                        }
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "supplier" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Date</label>
                    <div className="grid grid-cols-3 gap-5">
                        {/* Day */}
                        <div className="relative">
                            <select
                                name="date.day"
                                value={formData.date.day}
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
                                value={formData.date.month}
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
                                value={formData.date.year}
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

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Problem <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="problem"
                        value={formData.problem}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Immediate Action <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="immediate_action"
                        value={formData.immediate_action}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[98px]"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Executor <span className="text-red-500">*</span></label>
                    <select
                        name="executor"
                        value={formData.executor}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("executor")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select</option>
                        {users.length > 0 ? (
                            users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No users available</option>
                        )}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "executor" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Solved <span className="text-red-500">*</span></label>
                    <select
                        name="solved"
                        value={formData.solved}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("solved")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "solved" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Corrective Action Needed <span className="text-red-500">*</span></label>
                    <select
                        name="corrective_action_need"
                        value={formData.corrective_action_need}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("corrective_action_need")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[54px] transform transition-transform duration-300 
                        ${focusedDropdown === "corrective_action_need" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                {/* Conditional rendering based on corrective_action_need value */}
                {showCorrectiveFields && (
                    <>
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
                                <option value="" disabled>Select</option>
                                {carNumbers && carNumbers.length > 0 ? (
                                    carNumbers.map(car => (
                                        <option key={car.id} value={car.id}>
                                            {car.action_no || car.car_no}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No CAR numbers available</option>
                                )}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[42%] transform transition-transform duration-300 
                                ${focusedDropdown === "no_car" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                            <button
                                className="flex justify-start add-training-label !text-[#1E84AF]"
                                type="button"
                                onClick={handleOpenCarModal}
                            >
                                Add CAR number
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="add-training-label">
                                Corrections <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="corrections"
                                value={formData.corrections}
                                onChange={handleChange}
                                className="add-training-inputs focus:outline-none"
                                required={showCorrectiveFields}
                            />
                        </div>
                    </>
                )}

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-4 justify-between">
                    <div>
                        <button
                            type="button"
                            className="request-correction-btn duration-200"
                            onClick={handleSaveDraft}
                            disabled={submitting}
                        >
                            {submitting && isDraft ? 'Saving...' : 'Save as Draft'}
                        </button>
                    </div>
                    <div className="flex gap-5">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel-btn duration-200"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn duration-200"
                            disabled={submitting}
                        >
                            {submitting && !isDraft ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QmsAddSupplierProblem;