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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        supplier_name: '',
        supplier_id: '',
        date: {
            day: '',
            month: '',
            year: ''
        },
        problem: '',
        immediate_action: '',
        executor: '',
        audit_type: '',
        solved: '',
        corrective_action: '',
        corrections: '',
        car: '',
        cars: [],
    });
    const [isDraft, setIsDraft] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [focusedDropdown, setFocusedDropdown] = useState(null);

    // Get company ID from local storage (same as in list component)
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

    const companyId = getUserCompanyId();

    // Fetch suppliers data from API
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/suppliers/company/${companyId}/`);
                // Filter only active suppliers with Approved status
                const activeSuppliers = response.data.filter(supplier => 
                    supplier.active === 'active' && supplier.status === 'Approved'
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

        // Special handling for supplier selection to store both name and ID
        if (name === 'supplier_name') {
            const selectedSupplier = suppliers.find(supplier => supplier.id === value);
            setFormData({
                ...formData,
                supplier_name: selectedSupplier ? selectedSupplier.company_name : '',
                supplier_id: value
            });
            return;
        }

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
            company_id: companyId,
            supplier_id: formData.supplier_id,
            problem_date: formattedDate,
            problem_description: formData.problem,
            immediate_action: formData.immediate_action,
            executor: formData.executor,
            is_solved: formData.solved === 'yes',
            corrective_action_needed: formData.corrective_action === 'yes',
            corrections: formData.corrections || '',
            car_numbers: formData.cars,
            is_draft: isDraft,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const submissionData = formatFormDataForSubmission();
            
            // Submit to the API
            await axios.post(`${BASE_URL}/qms/supplier-problems/`, submissionData);

          console.log('Supplier Problems:', submissionData);
          
            
            // Navigate back to list on success
            navigate('/company/qms/supplier-problem-log');
        } catch (err) {
            console.error('Error submitting supplier problem:', err);
            alert('Failed to submit supplier problem. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsDraft(true);
        
        try {
            const submissionData = formatFormDataForSubmission();
            submissionData.is_draft = true;
            
            // Submit as draft to the API
            await axios.post(`${BASE_URL}/qms/supplier-problems/`, submissionData);
            
            // Navigate back to list on success
            navigate('/company/qms/supplier-problem-log');
        } catch (err) {
            console.error('Error saving draft:', err);
            alert('Failed to save draft. Please try again.');
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
    const showCorrectiveFields = formData.corrective_action === 'yes';

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
                        name="supplier_name"
                        value={formData.supplier_id}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("supplier_name")}
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
                        ${focusedDropdown === "supplier_name" ? "rotate-180" : ""}`}
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
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                        <option value="HR">HR</option>
                        <option value="QA">QA</option>
                        <option value="Supplier">Supplier</option>
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
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
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
                        name="corrective_action"
                        value={formData.corrective_action}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("corrective_action")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[54px] transform transition-transform duration-300 
                        ${focusedDropdown === "corrective_action" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                {/* Conditional rendering based on corrective_action value */}
                {showCorrectiveFields && (
                    <>
                        <div className="flex flex-col gap-3 relative">
                            <label className="add-training-label">CAR Number</label>
                            <select
                                name="car"
                                value={formData.car}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("car")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>Select</option>
                                {formData.cars.map((car, index) => (
                                    <option key={index} value={car}>
                                        {car}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-[42%] transform transition-transform duration-300 
                                ${focusedDropdown === "car" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                            <button
                                className='flex justify-start add-training-label !text-[#1E84AF]'
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
                            className='request-correction-btn duration-200'
                            onClick={handleSaveDraft}
                            disabled={submitting}
                        >
                            {submitting && isDraft ? 'Saving...' : 'Save as Draft'}
                        </button>
                    </div>
                    <div className='flex gap-5'>
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