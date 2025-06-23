import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../Utils/Config";
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';

const QmsEditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    gender: false,
    day: false,
    month: false,
    year: false,
    status: false,
  });

  const dropdownRefs = {
    gender: useRef(null),
    day: useRef(null),
    month: useRef(null),
    year: useRef(null),
    status: useRef(null),
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: { day: '', month: '', year: '' },
    phone: '',
    email: '',
    department_division: '',
    status: 'active',
  });

  const [fieldErrors, setFieldErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/company/employees/${id}/`);
        if (response.status === 200) {
          const employee = response.data;
          // Parse date_of_birth if it exists
          let dob = { day: '', month: '', year: '' };
          if (employee.date_of_birth) {
            const [year, month, day] = employee.date_of_birth.split('-');
            dob = { day, month, year };
          }
          setFormData({
            first_name: employee.first_name || '',
            last_name: employee.last_name || '',
            gender: employee.gender || '',
            date_of_birth: dob,
            phone: employee.phone || '',
            email: employee.email || '',
            department_division: employee.department_division || '',
            status: employee.status || 'active',
          });
          setEmailValid(true); // Assume existing email is valid
        }
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError("Failed to load employee data. Please try again.");
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const phoneValue = value.replace(/[^0-9\s\-\(\)\+]/g, '');
      setFormData({ ...formData, [name]: phoneValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleDobChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      date_of_birth: { ...formData.date_of_birth, [name]: value }
    });
  };

  const validateEmail = async () => {
    if (formData.email) {
      const hasBasicStructure = /^[^@]+@[^@]+\.[^@]+$/.test(formData.email);
      if (!hasBasicStructure) {
        setEmailError('');
        setEmailValid(null);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/company/validate-email/`, {
          params: { email: formData.email, exclude_employee_id: id }, // Exclude current employee
        });
        if (response.data.status === 200) {
          if (response.data.exists) {
            setEmailError('Email already exists!');
            setEmailValid(false);
          } else {
            setEmailError('');
            setEmailValid(true);
          }
        } else {
          setEmailError(response.data.error);
          setEmailValid(false);
        }
      } catch (error) {
        console.error('Error validating email:', error);
        setEmailError(error.response?.data?.error || 'Error checking email.');
        setEmailValid(false);
      }
    } else {
      setEmailError('');
      setEmailValid(null);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateEmail();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
      isValid = false;
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (emailValid === false || emailError) {
      errors.email = emailError || 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        throw new Error('Company ID not found. Please log in again.');
      }

      let formattedDob = "";
      if (formData.date_of_birth.day && formData.date_of_birth.month && formData.date_of_birth.year) {
        formattedDob = `${formData.date_of_birth.year}-${formData.date_of_birth.month.padStart(2, "0")}-${formData.date_of_birth.day.padStart(2, "0")}`;
      }

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('company_id', companyId);
      formDataToSubmit.append('first_name', formData.first_name);
      formDataToSubmit.append('last_name', formData.last_name);
      formDataToSubmit.append('gender', formData.gender);
      formDataToSubmit.append('date_of_birth', formattedDob);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('department_division', formData.department_division);
      formDataToSubmit.append('status', formData.status);

      const response = await axios.put(`${BASE_URL}/company/employees/${id}/update/`, formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/company/qms/list-employee");
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.response?.data?.message || "Failed to update employee. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/company/qms/list-employee');
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideClick = Object.values(dropdownRefs).every(
        (ref) => ref.current && !ref.current.contains(event.target)
      );

      if (isOutsideClick) {
        setOpenDropdowns({
          gender: false,
          day: false,
          month: false,
          year: false,
          status: false,
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#1C1C24]">
      <div className="flex justify-between items-center add-user-header">
        <h1 className="add-user-text">Edit Employee</h1>
        <button
          className="list-user-btn duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
          onClick={() => navigate('/company/qms/list-employee')}
        >
          List Employees
        </button>
      </div>

      <SuccessModal
        showSuccessModal={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        successMessage="Employee updated successfully!"
      />

      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />

      {isLoading && !formData.first_name && (
        <div className="text-white text-center py-10">Loading employee data...</div>
      )}

      <form className="add-user-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-[122px] py-[23px]">
          <div>
            <label className="add-user-label">First Name <span className='required-field'>*</span></label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full add-user-inputs"
            />
            {fieldErrors.first_name && (
              <p className="text-red-500 text-sm pt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {fieldErrors.first_name}
              </p>
            )}
          </div>
          <div>
            <label className="add-user-label">Last Name <span className='required-field'>*</span></label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full add-user-inputs"
            />
            {fieldErrors.last_name && (
              <p className="text-red-500 text-sm pt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {fieldErrors.last_name}
              </p>
            )}
          </div>

          <div>
            <label className="add-user-label">Gender</label>
            <div className="relative">
              <select
                ref={dropdownRefs.gender}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onClick={() => toggleDropdown('gender')}
                className="w-full add-user-inputs appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openDropdowns.gender ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="add-user-label">DOB</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <select
                  ref={dropdownRefs.day}
                  name="day"
                  value={formData.date_of_birth.day}
                  onChange={handleDobChange}
                  onClick={() => toggleDropdown('day')}
                  className="w-full add-user-inputs appearance-none"
                >
                  <option value="">dd</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openDropdowns.day ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
              <div className="relative">
                <select
                  ref={dropdownRefs.month}
                  name="month"
                  value={formData.date_of_birth.month}
                  onChange={handleDobChange}
                  onClick={() => toggleDropdown('month')}
                  className="w-full add-user-inputs appearance-none"
                >
                  <option value="">mm</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openDropdowns.month ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
              <div className="relative">
                <select
                  ref={dropdownRefs.year}
                  name="year"
                  value={formData.date_of_birth.year}
                  onChange={handleDobChange}
                  onClick={() => toggleDropdown('year')}
                  className="w-full add-user-inputs appearance-none"
                >
                  <option value="">yyyy</option>
                  {[...Array(100)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={i} value={year.toString()}>{year}</option>;
                  })}
                </select>
                <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openDropdowns.year ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="add-user-label">Phone <span className='required-field'>*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full add-user-inputs"
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-sm pt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {fieldErrors.phone}
              </p>
            )}
          </div>
          <div>
            <label className="add-user-label">Email <span className='required-field'>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full add-user-inputs"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm pt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {fieldErrors.email}
              </p>
            )}
            {emailError && (
              <p className="text-red-500 text-sm pt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {emailError}
              </p>
            )}
            {emailValid === true && formData.email && (
              <p className="text-green-500 text-sm pt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Email is available!
              </p>
            )}
          </div>

          <div>
            <label className="add-user-label">Department / Division</label>
            <input
              type="text"
              name="department_division"
              value={formData.department_division}
              onChange={handleChange}
              className="w-full add-user-inputs"
            />
          </div>
          <div>
            <label className="add-user-label">Status</label>
            <div className="relative">
              <select
                ref={dropdownRefs.status}
                name="status"
                value={formData.status}
                onChange={handleChange}
                onClick={() => toggleDropdown('status')}
                className="w-full add-user-inputs appearance-none"
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openDropdowns.status ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-[22px] mt-5 mx-[122px] pb-[22px]">
          <button
            type="button"
            className="cancel-btns duration-200"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="save-btns duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QmsEditEmployee;