import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import CategoryModal from '../CategoryModal';
import AddCarNumberModal from '../AddCarNumberModal';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';

const QmsAddComplaints = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [carNumbers, setCarNumbers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    customer: false,
    // add other fields if needed
  });

  const validateForm = () => {
    const errors = {
      customer: !formData.customer,
      // add validation for other required fields
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const [formData, setFormData] = useState({
    customer: '',
    details: '',
    executor: '',
    corrections: '',
    solved_after_action: '',
    category: [],
    immediate_action: '',
    date: null,
    corrective_action_need: '',
    no_car: '',
    upload_attachment: null,
    is_draft: false
  });

  const [dateValues, setDateValues] = useState({
    day: '',
    month: '',
    year: ''
  });

  const [focusedDropdown, setFocusedDropdown] = useState(null);

  useEffect(() => {
    if (categories.length > 0) {
      const filtered = categories.filter(category =>
        category.title.toLowerCase().includes(categorySearchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categorySearchTerm, categories]);

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

  const userId = getRelevantUserId();

  useEffect(() => {
    if (companyId) {
      fetchCategories();
    }
  }, [companyId]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/qms/category/company/${companyId}/`);
      setCategories(response.data);
      setFilteredCategories(response.data); // Initialize filtered categories
      console.log('categories:', response);
    } catch (err) {
      console.error("Error fetching categories:", err);
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
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/customer/company/${companyId}/`
        );
        setCustomers(response.data);
      } catch (err) {
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
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCustomers();
    }
  }, [companyId]);

  useEffect(() => {
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
      }
    };

    if (companyId) {
      fetchCarNumbers();
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      fetchUsers();
    }
  }, [companyId]);

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

  const handleListComplaints = () => {
    navigate('/company/qms/list-complaints');
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
      return;
    }

    if (type === 'file') {
      setFormData({
        ...formData,
        upload_attachment: files[0]
      });
      return;
    }

    if (name.startsWith('date.')) {
      const datePart = name.split('.')[1];
      setDateValues(prev => ({
        ...prev,
        [datePart]: value
      }));

      const updatedDateValues = {
        ...dateValues,
        [datePart]: value
      };

      if (updatedDateValues.day && updatedDateValues.month && updatedDateValues.year) {
        const formattedDate = `${updatedDateValues.year}-${updatedDateValues.month}-${updatedDateValues.day}`;
        setFormData(prev => ({
          ...prev,
          date: formattedDate
        }));
      }
      return;
    }

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchCategories();
  };

  const handleSaveDraft = async () => {
    try {
      const formDataToSend = new FormData();
      console.log('qqqqqqqqqqqqqqqqqqqqqqqq:', formData);
      setDraftLoading(true);

      const jsonData = {
        customer: formData.customer,
        details: formData.details || '',
        executor: formData.executor || '',
        corrections: formData.corrections || '',
        solved_after_action: formData.solved_after_action || 'Yes',
        immediate_action: formData.immediate_action || '',
        date: formData.date || null,
        corrective_action_need: formData.corrective_action_need || 'Yes',
        no_car: formData.no_car || null,
        is_draft: true,
        company: companyId,
        user: userId,
        category: formData.category // Send category as an array instead of individual elements
      };

      console.log('Sending data:', jsonData);

      // If there's a file to upload, we need to use FormData
      if (formData.upload_attachment) {

        // Append the JSON data as a string
        formDataToSend.append('data', JSON.stringify(jsonData));

        // Append the file
        formDataToSend.append('upload_attachment', formData.upload_attachment);

        const response = await axios.post(
          `${BASE_URL}/qms/complaints/draft-create/`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        console.log('Draft saved successfully:', response.data);
        navigate('/company/qms/draft-complaints');
      } else {
        // If no file, just send the JSON directly
        const response = await axios.post(
          `${BASE_URL}/qms/complaints/draft-create/`,
          jsonData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Draft saved successfully:', response.data);

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/company/qms/draft-complaints');
        }, 1500);
        setSuccessMessage("Compliants Drafted Successfully")
      }
    } catch (err) {
      console.error('Error saving draft:', err);
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
    } finally {
      setDraftLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      console.log('uuuuuuuuuuuuu:', formData);

      formDataToSend.append('customer', formData.customer);
      formDataToSend.append('details', formData.details || '');
      formDataToSend.append('executor', formData.executor || '');
      formDataToSend.append('corrections', formData.corrections || '');
      formDataToSend.append('solved_after_action', formData.solved_after_action || 'Yes');
      formDataToSend.append('immediate_action', formData.immediate_action || '');
      if (formData.date) {
        formDataToSend.append('date', formData.date);
      }
      formDataToSend.append('corrective_action_need', formData.corrective_action_need || 'Yes');
      if (formData.no_car) {
        formDataToSend.append('no_car', formData.no_car);
      }
      formDataToSend.append('is_draft', false);
      formDataToSend.append('company', companyId);
      formDataToSend.append('user', userId);
      formData.category.forEach(catId => {
        formDataToSend.append('category', catId);
      });
      if (formData.upload_attachment) {
        formDataToSend.append('upload_attachment', formData.upload_attachment);
      }

      const response = await axios.post(
        `${BASE_URL}/qms/complaints/create/`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Complaint submitted successfully:', response.data);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/company/qms/list-complaints');
      }, 1500);
      setSuccessMessage("Compliants Added Successfully")
    } catch (err) {
      console.error('Error submitting complaint:', err);
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

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        <AddCarNumberModal
          isOpen={isCarModalOpen}
          onClose={handleCloseCarModal}
          onAddCause={(cars) => console.log("CAR numbers added:", cars)}
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

        <h1 className="add-training-head">Add Complaints and Feedbacks</h1>
        <button
          type="button"
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={handleListComplaints}
        >
          List Complaints and Feedbacks
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
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
              <option value="" disabled>Select</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-[52px] transform transition-transform duration-300
      ${focusedDropdown === "customer" ? "rotate-180" : ""}`}
              size={20}
              color="#AAAAAA"
            />
            {fieldErrors.customer && (
              <p className="text-red-500 text-sm mt-1">Please select customer</p>
            )}
          </div>
        </div>

        {/* Updated Categories Field */}
        <div className="flex flex-col gap-3 relative">
          <div className="flex items-center justify-between">
            <label className="add-training-label">
              Categories
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

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Details
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="add-training-inputs !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Immediate Action</label>
          <textarea
            name="immediate_action"
            value={formData.immediate_action}
            onChange={handleChange}
            className="add-training-inputs !h-[98px]"
          />
        </div>

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
          >
            <option value="" disabled>Select User</option>
            {users.length > 0 ? (
              users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))
            ) : (
              <option disabled>Loading users...</option>
            )}
          </select>
          <ChevronDown
            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                ${focusedDropdown === "executor" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Date</label>
          <div className="grid grid-cols-3 gap-5">
            <div className="relative">
              <select
                name="date.day"
                value={dateValues.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
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

            <div className="relative">
              <select
                name="date.month"
                value={dateValues.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
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

            <div className="relative">
              <select
                name="date.year"
                value={dateValues.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
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

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Solved After Action?</label>
          <select
            name="solved_after_action"
            value={formData.solved_after_action}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("solved_after_action")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>Select</option>
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
            >
              <option value="" disabled>Select Action</option>
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

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Upload Attachments</label>
          <div className="flex">
            <input
              type="file"
              id="file-upload"
              onChange={handleChange}
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

        <div className="md:col-span-2 flex gap-4 justify-between">
          <div>
            <button
              type="button"
              className='request-correction-btn duration-200'
              onClick={handleSaveDraft}
              disabled={draftLoading}
            >
              {draftLoading ? 'Saving...' : 'Save as Draft'}
            </button>
          </div>
          <div className='flex gap-5'>
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
              disabled={loading || draftLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn duration-200"
              disabled={loading || draftLoading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QmsAddComplaints;