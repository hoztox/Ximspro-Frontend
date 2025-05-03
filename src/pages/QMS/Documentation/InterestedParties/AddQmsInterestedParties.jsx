import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import "./addqmsinterestedparties.css";
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';
import AddQmsInterestedSuccessModal from './Modals/AddQmsInterestedSuccessModal';
import AddQmsInterestedErrorModal from './Modals/AddQmsInterestedErrorModal';
import AddQmsInterestedDraftSuccessModal from './Modals/AddQmsInterestedDraftSuccessModal';
import AddQmsInterestedDraftErrorModal from "./Modals/AddQmsInterestedDraftErrorModal";
const AddQmsInterestedParties = () => {
  const { id } = useParams(); // Get ID from URL if editing
  const isEditing = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [showAddManualSuccessModal, setShowAddManualSuccessModal] = useState(false);
  const [showAddQmsInterestedErrorModal, setShowAddQmsInterestedErrorModal] = useState(false);
  const [showDraftInterestedSuccessModal, setShowDraftInterestedSuccessModal] = useState(false);
  const [showDraftInterestedErrorModal, setShowDraftInterestedErrorModal] = useState(false);

  // Add state for compliance options
  const [legalRequirementOptions, setLegalRequirementOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Internal',
    needs_expectations: [{ needs: '', expectations: '' }], // Changed to array of objects
    special_requirements: '',
    legal_requirements: '',
    custom_legal_requirements: '',
    file: null,
    company: null,
    send_notification: false,
  });


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

  const companyId = getUserCompanyId();

  const [dropdownRotation, setDropdownRotation] = useState({
    category: false,
    legal_requirements: false,
  });

  const addNeedsExpectations = () => {
    setFormData(prev => ({
      ...prev,
      needs_expectations: [...prev.needs_expectations, { needs: '', expectations: '' }]
    }));
  };

  const removeNeedsExpectations = (index) => {
    if (formData.needs_expectations.length > 1) {
      setFormData(prev => {
        const updated = [...prev.needs_expectations];
        updated.splice(index, 1);
        return { ...prev, needs_expectations: updated };
      });
    }
  };

  const handleNeedsExpectationsChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.needs_expectations];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, needs_expectations: updated };
    });
  };

  const [showCustomField, setShowCustomField] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');


  useEffect(() => {
    if (companyId) {
      setFormData(prev => ({
        ...prev,
        company: companyId
      }));
      fetchComplianceData();
    }
  }, [companyId]);
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
  const fetchComplianceData = async () => {
    try {
      if (!companyId) {
        console.error("Company ID not found");
        return;
      }
      const response = await axios.get(`${BASE_URL}/qms/compliance/${companyId}/`);
      setLegalRequirementOptions(response.data);
      console.log("Fetched compliance data:", response.data);
    } catch (err) {
      console.error("Error fetching compliance data:", err);
    }
  };
  const toggleDropdown = (field) => {
    setDropdownRotation((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (name === 'legal_requirements') {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Get fresh company ID in case it changed
    const companyId = getUserCompanyId();
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      setSubmitting(false);
      return;
    }

    const userId = getRelevantUserId();

    try {
      // Format the needs array
      const needsArray = formData.needs_expectations.map(item => ({
        needs: item.needs,
        expectation: item.expectations
      }));

      // Create the data object with company ID at root level
      const submitData = {
        name: formData.name,
        company: companyId, // Ensure this is set
        category: formData.category,
        special_requirements: formData.special_requirements,
        legal_requirements: formData.legal_requirements,
        custom_legal_requirements: formData.custom_legal_requirements || "",
        send_notification: formData.send_notification,
        is_draft: false,
        needs: needsArray,
        user: userId
      };

      console.log("Data being sent:", submitData);


      if (formData.file instanceof File) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('data', JSON.stringify(submitData));
        formDataWithFile.append('file', formData.file);
        formDataWithFile.append('company', formData.company);
        formDataWithFile.append('name', formData.name); // Explicitly add name

        const response = await axios.post(
          `${BASE_URL}/qms/interested-parties/`,
          formDataWithFile,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Response:', response);
      } else {
        const response = await axios.post(
          `${BASE_URL}/qms/interested-parties/`,
          submitData
        );
        console.log('Response:', response);
      }

      setShowAddManualSuccessModal(true);
      setTimeout(() => {
        setShowAddManualSuccessModal(false);
        navigate('/company/qms/interested-parties');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save. Please check your inputs and try again.");
      setShowAddQmsInterestedErrorModal(true);
      setTimeout(() => {
        setShowAddQmsInterestedErrorModal(false);
      }, 3000);
      console.error("Error details:", err.response?.data);
      setSubmitting(false);
    }
  };
  const handleCancel = () => {
    navigate('/company/qms/interested-parties');
  };
  if (loading) {
    return (
      <div className="bg-[#1C1C24] p-5 rounded-lg text-white flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }
  const handleSaveAsDraft = async () => {
    try {
      setLoading(true);

      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();

      if (!companyId || !userId) {
        setError('Company ID or User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Format the needs_expectations array to match backend expectations
      const needsArray = formData.needs_expectations.map(item => ({
        needs: item.needs,
        expectation: item.expectations // Note: backend expects "expectation" not "expectations"
      }));

      // Create the data object the way the backend expects it
      const draftData = {
        name: formData.name,
        company: companyId,
        category: formData.category,
        special_requirements: formData.special_requirements || '',
        legal_requirements: formData.legal_requirements || '',
        custom_legal_requirements: formData.custom_legal_requirements || '',
        send_notification: formData.send_notification,
        is_draft: true,
        user: userId,
        needs: needsArray // This is the important part - send the array of needs objects
      };

      let response;

      // If there's a file, use FormData
      if (formData.file instanceof File) {
        const formDataToSend = new FormData();

        // Add the JSON data as a string 
        formDataToSend.append('data', JSON.stringify(draftData));
        formDataToSend.append('name', formData.name);

        // Add the file separately
        formDataToSend.append('file', formData.file);

        response = await axios.post(
          `${BASE_URL}/qms/interst/draft-create/`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // If no file, send the JSON data directly
        response = await axios.post(
          `${BASE_URL}/qms/interst/draft-create/`,
          draftData
        );
      }

      console.log('Draft saved:', response);

      setLoading(false);
      setShowDraftInterestedSuccessModal(true);
      setTimeout(() => {
        setShowDraftInterestedSuccessModal(false);
        navigate('/company/qms/interested-parties');
      }, 1500);

    } catch (err) {
      setLoading(false);
      setShowDraftInterestedErrorModal(true);
      setTimeout(() => {
        setShowDraftInterestedErrorModal(false);
      }, 3000);
      const errorMessage = err.response?.data?.detail ||
        err.response?.data?.name?.[0] ||
        'Failed to save Draft';
      setError(errorMessage);
      console.error('Error saving Draft:', err.response?.data || err);
    }
  };

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg text-white">
      <h1 className="add-interested-parties-head px-[122px] border-b border-[#383840] pb-5">
        {isEditing ? 'Edit' : 'Add'} Interested Parties
      </h1>

      <AddQmsInterestedSuccessModal
        showAddManualSuccessModal={showAddManualSuccessModal}
        onClose={() => { setShowAddManualSuccessModal(false) }}
      />

      <AddQmsInterestedErrorModal
        showAddQmsInterestedErrorModal={showAddQmsInterestedErrorModal}
        onClose={() => { setShowAddQmsInterestedErrorModal(false) }}
      />

      <AddQmsInterestedDraftSuccessModal
        showDraftInterestedSuccessModal={showDraftInterestedSuccessModal}
        onClose={() => { setShowDraftInterestedSuccessModal(false) }}
      />

      <AddQmsInterestedDraftErrorModal
        showDraftInterestedErrorModal={showDraftInterestedErrorModal}
        onClose={() => { setShowDraftInterestedErrorModal(false) }}
      />

      {error && (
        <div className="px-[122px] mt-4 text-red-500 bg-red-100 bg-opacity-10 p-3 rounded">
          {error}
        </div>
      )}
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
                required
              />
            </div>
            <div>
              <label className="block mb-3 add-qms-manual-label">Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  onFocus={() => toggleDropdown('category')}
                  onBlur={() => toggleDropdown('category')}
                  className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                  required
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none transition-transform duration-300">
                  <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${dropdownRotation.category ? 'rotate-180' : ''
                    }`} />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mb-6">
            {formData.needs_expectations.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-3 add-qms-manual-label">
                    Needs
                  </label>
                  <div className="flex">
                    <input
                      type='text'
                      name={`needs_${index}`}
                      placeholder="Enter Needs"
                      value={item.needs}
                      onChange={(e) => handleNeedsExpectationsChange(index, 'needs', e.target.value)}
                      className="w-full add-qms-intertested-inputs"
                    />
                    {/* {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeNeedsExpectations(index)}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    )} */}
                  </div>
                </div>
                <div>
                  <label className="block mb-3 add-qms-manual-label">
                    Expectations
                  </label>
                  <div className='flex'>
                    <input
                      type="text"
                      name={`expectations_${index}`}
                      placeholder="Enter Expectations"
                      value={item.expectations}
                      onChange={(e) => handleNeedsExpectationsChange(index, 'expectations', e.target.value)}
                      className="w-full add-qms-intertested-inputs"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeNeedsExpectations(index)}
                        className="ml-2 text-red-500 border border-red-500 p-2 rounded-md hover:text-white hover:bg-red-500 duration-200"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </div>
                </div>
                {index === formData.needs_expectations.length - 1 && (
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={addNeedsExpectations}
                      className="request-correction-btn flex items-center gap-[5px] duration-200 "
                    >
                      Add More <Plus size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-3 add-qms-manual-label">Special Requirements</label>
              <input
                type="text"
                name="special_requirements"
                placeholder="Enter Special Requirements"
                value={formData.special_requirements}
                onChange={handleInputChange}
                className="w-full add-qms-intertested-inputs"
              />
            </div>
            <div>
              <label className="block mb-3 add-qms-manual-label">Applicable Legal/Regulatory Requirements</label>
              <div className="relative">
                <select
                  name="legal_requirements"
                  value={formData.legal_requirements}
                  onChange={handleInputChange}
                  onFocus={() => toggleDropdown('legal_requirements')}
                  onBlur={() => toggleDropdown('legal_requirements')}
                  className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                >
                  <option value="">Choose</option>
                  {legalRequirementOptions
                    .filter(option =>
                      !['GDPR', 'HIPAA', 'CCPA', 'SOX'].includes(option.compliance_name))
                    .map((option, index) => (
                      <option key={index} value={option.compliance_name || option.compliance_no}>
                        {option.compliance_name || option.compliance_no}
                      </option>
                    ))}
                  <option value="N/A">N/A</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${dropdownRotation.legal_requirements ? 'rotate-180' : ''
                    }`} />
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${showCustomField ? 'h-32 mt-3 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <textarea
                  name="custom_legal_requirements"
                  placeholder="Please specify"
                  value={formData.custom_legal_requirements}
                  onChange={handleInputChange}
                  className="w-full add-qms-intertested-inputs !h-[118px]"
                />
              </div>
            </div>
            <div>
              <label className="block mb-3 add-qms-manual-label">Browse / Upload File</label>
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
                    {fileName !== "No file chosen" ? fileName : "Choose File"}
                  </span>
                  <img src={file} alt="File Icon" />
                </button>
                {fileName === "No file chosen" && <p className="text-right no-file">No file chosen</p>}
              </div>
            </div>
            <div className='flex items-end justify-end'>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="send_notification"
                  className="mr-2 form-checkboxes"
                  checked={formData.send_notification}
                  onChange={handleInputChange}
                />
                <span className="permissions-texts cursor-pointer">Send Notification</span>
              </label>
            </div>
            <div>
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="request-correction-btn duration-200"
              >
                Save as Draft
              </button>
            </div>
            <div className="flex justify-end space-x-5">
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
                {submitting ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddQmsInterestedParties;