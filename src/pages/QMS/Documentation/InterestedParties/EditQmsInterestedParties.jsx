import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Eye, X, Plus } from "lucide-react";
import axios from "axios";
import fileIcon from "../../../../assets/images/Company Documentation/file-icon.svg";
import { BASE_URL } from "../../../../Utils/Config";
import EditQmsInterestedSuccessModal from "./Modals/EditQmsInterestedSuccessModal";
import EditQmsInterestedErrorModal from "./Modals/EditQmsInterestedErrorModal";

const EditQmsInterestedParties = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [legalRequirementOptions, setLegalRequirementOptions] = useState([]);
  const [showEditInterestedSuccessModal, setShowEditInterestedSuccessModal] = useState(false);
  const [showEditQmsInterestedErrorModal, setShowEditQmsInterestedErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Internal",
    needs: [], // Matches backend structure
    special_requirements: "",
    legal_requirements: "",
    custom_legal_requirements: "",
    file: null,
    company: null,
    send_notification: false,
  });

  const [dropdownRotation, setDropdownRotation] = useState({
    category: false,
    legal_requirements: false,
  });

  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCustomField, setShowCustomField] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  // Helper functions for needs
  const addNeed = () => {
    setFormData(prev => ({
      ...prev,
      needs: [...prev.needs, { needs: "", expectation: "" }]
    }));
  };

  const removeNeed = (index) => {
    if (formData.needs.length > 1) {
      setFormData(prev => {
        const updated = [...prev.needs];
        updated.splice(index, 1);
        return { ...prev, needs: updated };
      });
    }
  };

  const handleNeedChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.needs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, needs: updated };
    });
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

  const companyId = getUserCompanyId();

  const fetchComplianceData = () => {
    if (!companyId) {
      console.error("Company ID not found");
      return;
    }

    axios.get(`${BASE_URL}/qms/compliance/${companyId}/`)
      .then(response => {
        setLegalRequirementOptions(response.data || []);
      })
      .catch(error => {
        console.error("Error fetching legal requirements:", error);
      });
  };

  useEffect(() => {
    if (companyId) {
      setFormData(prev => ({
        ...prev,
        company: companyId
      }));
      fetchComplianceData();
    }
  }, [companyId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/qms/interested-parties-get/${id}/`);
      const data = response.data;

      setFormData({
        name: data.name || "",
        category: data.category || "Internal",
        needs: data.needs || [],
        special_requirements: data.special_requirements || "",
        legal_requirements: data.legal_requirements || "",
        custom_legal_requirements: data.custom_legal_requirements || "",
        file: null,
        company: data.company || companyId,
        send_notification: data.send_notification || false,
      });

      if (data.legal_requirements === "N/A") {
        setShowCustomField(true);
      }

      if (data.file) {
        setFileName(data.file.split("/").pop());
        setFileUrl(data.file);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
      setSelectedFile(file);
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
    }
  };

  const handleViewFile = () => {
    if (fileUrl && !selectedFile) {
      window.open(fileUrl, '_blank');
    } else if (selectedFile) {
      const tempUrl = URL.createObjectURL(selectedFile);
      window.open(tempUrl, '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response;
      if (selectedFile) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('name', formData.name);
        formDataWithFile.append('category', formData.category);
        formDataWithFile.append('special_requirements', formData.special_requirements);
        formDataWithFile.append('legal_requirements', formData.legal_requirements);
        formDataWithFile.append('custom_legal_requirements', formData.custom_legal_requirements);
        formDataWithFile.append('send_notification', formData.send_notification);
        formDataWithFile.append('company', formData.company);
        formDataWithFile.append('file', selectedFile);

        // Add needs array as JSON string
        formDataWithFile.append('needs', JSON.stringify(formData.needs));

        response = await axios.put(
          `${BASE_URL}/qms/interested-parties/${id}/edit/`,
          formDataWithFile,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Send as regular JSON when no file is selected
        response = await axios.put(
          `${BASE_URL}/qms/interested-parties/${id}/edit/`,
          {
            ...formData,
            file: null, // Explicitly set to null when no file is selected
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      setShowEditInterestedSuccessModal(true);
      setTimeout(() => {
        navigate("/company/qms/interested-parties");
      }, 2000);
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });
      setShowEditQmsInterestedErrorModal(true);
      setTimeout(() => {
        setShowEditQmsInterestedErrorModal(false);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/interested-parties");
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] p-5 rounded-lg text-white flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg text-white">
      <h1 className="add-interested-parties-head px-[122px] border-b border-[#383840] pb-5">
        Edit Interested Parties
      </h1>

      <EditQmsInterestedSuccessModal
        showEditInterestedSuccessModal={showEditInterestedSuccessModal}
        onClose={() => { setShowEditInterestedSuccessModal(false) }}
      />

      <EditQmsInterestedErrorModal
        showEditQmsInterestedErrorModal={showEditQmsInterestedErrorModal}
        onClose={() => { setShowEditQmsInterestedErrorModal(false) }}
      />

      <form onSubmit={handleSubmit} className="px-[122px]">
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block mb-3 add-qms-manual-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full add-qms-intertested-inputs"
                placeholder="Enter Name"
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
                  onFocus={() => toggleDropdown("category")}
                  onBlur={() => toggleDropdown("category")}
                  className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                  required
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${dropdownRotation.category ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Needs Section */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {formData.needs.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-3 add-qms-manual-label">
                    Needs
                  </label>
                  <div className="flex">
                    <input
                      type='text'
                      placeholder="Enter Needs"
                      value={item.needs}
                      onChange={(e) => handleNeedChange(index, 'needs', e.target.value)}
                      className="w-full add-qms-intertested-inputs"
                      required
                    />
                    {/* {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeNeed(index)}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    )} */}
                  </div>
                </div>
                <div>
                  <label className="block mb-3 add-qms-manual-label">
                    Expectation
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter Expectation"
                      value={item.expectation}
                      onChange={(e) => handleNeedChange(index, 'expectation', e.target.value)}
                      className="w-full add-qms-intertested-inputs"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeNeed(index)}
                        className="ml-2 text-red-500 border border-red-500 p-2 rounded-md hover:text-white hover:bg-red-500 duration-200"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </div>
                </div>
                {index === formData.needs.length - 1 && (
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={addNeed}
                      className="request-correction-btn flex items-center gap-[5px] duration-200 " 
                    >
                      Add More <Plus size={18}/>
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
                value={formData.special_requirements}
                onChange={handleInputChange}
                className="w-full add-qms-intertested-inputs"
                placeholder="Enter Special Requirements"
              />
            </div>
            <div>
              <label className="block mb-3 add-qms-manual-label">
                Applicable Legal/Regulatory Requirements
              </label>
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
              {showCustomField && (
                <div className="mt-3 transition-all duration-300 ease-in-out">
                  <textarea
                    name="custom_legal_requirements"
                    value={formData.custom_legal_requirements}
                    onChange={handleInputChange}
                    placeholder="Please specify"
                    className="w-full add-qms-intertested-inputs !h-[118px]"
                  />
                </div>
              )}
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
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <span className="file-input">{fileName}</span>
                  <img src={fileIcon} alt="File Icon" />
                </button>
                <div className="flex justify-between items-center">
                  {(fileUrl || selectedFile) && (
                    <button
                      type="button"
                      onClick={handleViewFile}
                      className="flex items-center mt-[10.65px] gap-[8px]"
                    >
                      <p className="click-view-file-btn text-[#1E84AF]">Click to view file</p>
                      <Eye size={16} className="text-[#1E84AF]" />
                    </button>
                  )}
                  {!selectedFile && !fileUrl && (
                    <p className="text-right no-file">No file chosen</p>
                  )}
                </div>
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
            <div></div>
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
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditQmsInterestedParties;