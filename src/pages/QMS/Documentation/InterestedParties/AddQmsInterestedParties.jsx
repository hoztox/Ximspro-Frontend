import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import "./addqmsinterestedparties.css";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import AddQmsInterestedSuccessModal from "./Modals/AddQmsInterestedSuccessModal";
import AddQmsInterestedErrorModal from "./Modals/AddQmsInterestedErrorModal";
import AddQmsInterestedDraftSuccessModal from "./Modals/AddQmsInterestedDraftSuccessModal";
import AddQmsInterestedDraftErrorModal from "./Modals/AddQmsInterestedDraftErrorModal";
import InterestedPartiesTypeModal from "./InterestedPartiesTypeModal";

const AddQmsInterestedParties = () => {
  const { id } = useParams(); // Get ID from URL if editing
  const isEditing = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Add state for field validation
  const [nameError, setNameError] = useState("");
  const [fieldTouched, setFieldTouched] = useState({
    name: false,
  });

  const [showAddManualSuccessModal, setShowAddManualSuccessModal] =
    useState(false);
  const [showAddQmsInterestedErrorModal, setShowAddQmsInterestedErrorModal] =
    useState(false);
  const [showDraftInterestedSuccessModal, setShowDraftInterestedSuccessModal] =
    useState(false);
  const [showDraftInterestedErrorModal, setShowDraftInterestedErrorModal] =
    useState(false);
  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [isReviewTypeModalOpen, setIsReviewTypeModalOpen] = useState(false);

  // State for compliance and cause party options
  const [legalRequirementOptions, setLegalRequirementOptions] = useState([]);
  const [causePartyOptions, setCausePartyOptions] = useState([]); // New state for CauseParty data

  const [formData, setFormData] = useState({
    name: "",
    category: "Internal",
    needs_expectations: [{ needs: "", expectations: "" }],
    special_requirements: "",
    legal_requirements: "",
    custom_legal_requirements: "",
    file: null,
    company: null,
    send_notification: false,
    type: "", // This will store the CauseParty ID
  });

  // Validate name field
  const validateName = (name) => {
    if (!name.trim()) {
      setNameError("Name is Required");
      return false;
    } else {
      setNameError("");
      return true;
    }
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

  const [dropdownRotation, setDropdownRotation] = useState({
    category: false,
    legal_requirements: false,
  });

  const addNeedsExpectations = () => {
    setFormData((prev) => ({
      ...prev,
      needs_expectations: [
        ...prev.needs_expectations,
        { needs: "", expectations: "" },
      ],
    }));
  };

  const removeNeedsExpectations = (index) => {
    if (formData.needs_expectations.length > 1) {
      setFormData((prev) => {
        const updated = [...prev.needs_expectations];
        updated.splice(index, 1);
        return { ...prev, needs_expectations: updated };
      });
    }
  };

  const handleOpenReviewTypeModal = () => {
    setIsReviewTypeModalOpen(true);
  };

  const handleCloseReviewTypeModal = (newReviewAdded = false) => {
    setIsReviewTypeModalOpen(false);
    if (newReviewAdded) {
      fetchCauseParty(); // Refresh CauseParty data after adding a new type
    }
  };

  const handleNeedsExpectationsChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.needs_expectations];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, needs_expectations: updated };
    });
  };

  const [showCustomField, setShowCustomField] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");

  // Fetch CauseParty data
  const fetchCauseParty = async () => {
    setLoading(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/qms/cause-party/company/${companyId}/`
      );
      setCausePartyOptions(response.data); // Store CauseParty data
    } catch (error) {
      console.error("Error fetching Cause Party:", error);
      let errorMsg = error.message;

      if (error.response) {
        // Check for field-specific errors first
        if (error.response.data.date) {
          errorMsg = error.response.data.date[0];
        }
        // Check for non-field errors
        else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch compliance and CauseParty data on component mount
  useEffect(() => {
    if (companyId) {
      setFormData((prev) => ({
        ...prev,
        company: companyId,
      }));
      fetchComplianceData();
      fetchCauseParty(); // Fetch CauseParty data
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
      const response = await axios.get(
        `${BASE_URL}/qms/compliance/${companyId}/`
      );
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
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "legal_requirements") {
      setShowCustomField(value === "N/A");
    }

    // If the name field is being changed, validate it
    if (name === "name") {
      validateName(value);

      // Mark the field as touched
      if (!fieldTouched.name) {
        setFieldTouched((prev) => ({
          ...prev,
          name: true,
        }));
      }
    }
  };

  // Add blur handler for validation
  const handleBlur = (e) => {
    const { name } = e.target;

    if (name === "name") {
      setFieldTouched((prev) => ({
        ...prev,
        name: true,
      }));
      validateName(formData.name);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file: file,
      });
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the name field before submitting
    const isNameValid = validateName(formData.name);
    if (!isNameValid) {
      // Set the field as touched to show error
      setFieldTouched((prev) => ({
        ...prev,
        name: true,
      }));
      return; // Stop submission if validation fails
    }

    setSubmitting(true);
    setError(null);

    const companyId = getUserCompanyId();
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      setSubmitting(false);
      return;
    }

    const userId = getRelevantUserId();

    try {
      const needsArray = formData.needs_expectations.map((item) => ({
        needs: item.needs,
        expectation: item.expectations,
      }));

      const submitData = {
        name: formData.name,
        company: companyId,
        category: formData.category,
        special_requirements: formData.special_requirements,
        legal_requirements: formData.legal_requirements,
        custom_legal_requirements: formData.custom_legal_requirements || "",
        send_notification: formData.send_notification,
        type: formData.type || null, // Send CauseParty ID or null if not selected
        is_draft: false,
        needs: needsArray,
        user: userId,
      };

      console.log("Data being sent:", submitData);

      if (formData.file instanceof File) {
        const formDataWithFile = new FormData();
        formDataWithFile.append("data", JSON.stringify(submitData));
        formDataWithFile.append("file", formData.file);
        formDataWithFile.append("company", formData.company);
        formDataWithFile.append("name", formData.name);

        const response = await axios.post(
          `${BASE_URL}/qms/interested-parties/`,
          formDataWithFile,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response);
      } else {
        const response = await axios.post(
          `${BASE_URL}/qms/interested-parties/`,
          submitData
        );
        console.log("Response:", response);
      }

      setShowAddManualSuccessModal(true);
      setTimeout(() => {
        setShowAddManualSuccessModal(false);
        navigate("/company/qms/interested-parties");
      }, 1500);
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
      setShowAddQmsInterestedErrorModal(true);
      setTimeout(() => {
        setShowAddQmsInterestedErrorModal(false);
      }, 3000);
      console.error("Error details:", err.response?.data);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/interested-parties");
  };

  const handleSaveAsDraft = async () => {
    try {
      setLoading(true);

      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();

      if (!companyId || !userId) {
        setError("Company ID or User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      const needsArray = formData.needs_expectations.map((item) => ({
        needs: item.needs,
        expectation: item.expectations,
      }));

      const draftData = {
        name: formData.name,
        company: companyId,
        category: formData.category,
        special_requirements: formData.special_requirements || "",
        legal_requirements: formData.legal_requirements || "",
        custom_legal_requirements: formData.custom_legal_requirements || "",
        send_notification: formData.send_notification,
        type: formData.type || null, // Send CauseParty ID or null if not selected
        is_draft: true,
        user: userId,
        needs: needsArray,
      };

      let response;

      if (formData.file instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append("data", JSON.stringify(draftData));
        formDataToSend.append("company", companyId);
        formDataToSend.append("name", formData.name);
        formDataToSend.append("is_draft", "true");
        formDataToSend.append("user", userId);
        formDataToSend.append("file", formData.file);

        response = await axios.post(
          `${BASE_URL}/qms/interst/draft-create/`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/qms/interst/draft-create/`,
          draftData
        );
      }

      console.log("Draft saved:", response);

      setLoading(false);
      setShowDraftInterestedSuccessModal(true);
      setTimeout(() => {
        setShowDraftInterestedSuccessModal(false);
        navigate("/company/qms/interested-parties");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setShowDraftInterestedErrorModal(true);
      setTimeout(() => {
        setShowDraftInterestedErrorModal(false);
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
      console.error("Error saving Draft:", err.response?.data || err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] p-5 rounded-lg not-found flex justify-center items-center h-64">
        <p>Loading Interested Parties...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg text-white">
      <h1 className="add-interested-parties-head px-[122px] border-b border-[#383840] pb-5">
        {isEditing ? "Edit" : "Add"} Interested Parties
      </h1>

      <InterestedPartiesTypeModal
        isOpen={isReviewTypeModalOpen}
        onClose={handleCloseReviewTypeModal}
      />

      <AddQmsInterestedSuccessModal
        showAddManualSuccessModal={showAddManualSuccessModal}
        onClose={() => setShowAddManualSuccessModal(false)}
      />

      <AddQmsInterestedErrorModal
        showAddQmsInterestedErrorModal={showAddQmsInterestedErrorModal}
        onClose={() => setShowAddQmsInterestedErrorModal(false)}
        error={error}
      />

      <AddQmsInterestedDraftSuccessModal
        showDraftInterestedSuccessModal={showDraftInterestedSuccessModal}
        onClose={() => setShowDraftInterestedSuccessModal(false)}
      />

      <AddQmsInterestedDraftErrorModal
        showDraftInterestedErrorModal={showDraftInterestedErrorModal}
        onClose={() => setShowDraftInterestedErrorModal(false)}
        error={error}
      />

      <form onSubmit={handleSubmit} className="px-[122px]">
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block mb-3 add-qms-manual-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full add-qms-intertested-inputs ${
                  fieldTouched.name && nameError ? "border-red-500" : ""
                }`}
              />
              {fieldTouched.name && nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>
            <div>
              <label className="block mb-3 add-qms-manual-label">
                Category
              </label>
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
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none transition-transform duration-300">
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
                      dropdownRotation.category ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            {formData.needs_expectations.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <div>
                  <label className="block mb-3 add-qms-manual-label">
                    Needs
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name={`needs_${index}`}
                      placeholder="Enter Needs"
                      value={item.needs}
                      onChange={(e) =>
                        handleNeedsExpectationsChange(
                          index,
                          "needs",
                          e.target.value
                        )
                      }
                      className="w-full add-qms-intertested-inputs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-3 add-qms-manual-label">
                    Expectations
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name={`expectations_${index}`}
                      placeholder="Enter Expectations"
                      value={item.expectations}
                      onChange={(e) =>
                        handleNeedsExpectationsChange(
                          index,
                          "expectations",
                          e.target.value
                        )
                      }
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
                      className="request-correction-btn flex items-center gap-[5px] duration-200"
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
              <label className="block mb-3 add-qms-manual-label">
                Special Requirements
              </label>
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
              <label className="block mb-3 add-qms-manual-label">
                Applicable Legal/Regulatory Requirements
              </label>
              <div className="relative">
                <select
                  name="legal_requirements"
                  value={formData.legal_requirements}
                  onChange={handleInputChange}
                  onFocus={() => toggleDropdown("legal_requirements")}
                  onBlur={() => toggleDropdown("legal_requirements")}
                  className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                >
                  <option value="">Choose</option>
                  {legalRequirementOptions
                    .filter(
                      (option) =>
                        !["GDPR", "HIPAA", "CCPA", "SOX"].includes(
                          option.compliance_name
                        )
                    )
                    .map((option, index) => (
                      <option
                        key={index}
                        value={option.compliance_name || option.compliance_no}
                      >
                        {option.compliance_name || option.compliance_no}
                      </option>
                    ))}
                  <option value="N/A">N/A</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
                      dropdownRotation.legal_requirements ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showCustomField
                    ? "h-32 mt-3 opacity-100"
                    : "max-h-0 opacity-0"
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
              <label className="block mb-3 add-qms-manual-label">
                Browse / Upload File
              </label>
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
                  <span className="file-input">
                    {fileName !== "No file chosen" ? fileName : "Choose File"}
                  </span>
                  <img src={file} alt="File Icon" />
                </button>
                {fileName === "No file chosen" && (
                  <p className="text-right no-file">No file chosen</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 relative">
              <label className="add-training-label">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                onFocus={() => setFocusedDropdown("type")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="">Select Type</option>
                {causePartyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                            ${focusedDropdown === "type" ? "rotate-180" : ""}`}
                size={20}
                color="#AAAAAA"
              />
              <button
                className="flex justify-start add-training-label !text-[#1E84AF]"
                onClick={handleOpenReviewTypeModal}
                type="button"
              >
                View / Add Type
              </button>
            </div>

            <div className="col-span-2 flex items-end justify-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="send_notification"
                  className="mr-2 form-checkboxes"
                  checked={formData.send_notification}
                  onChange={handleInputChange}
                />
                <span className="permissions-texts cursor-pointer">
                  Send Notification
                </span>
              </label>
            </div>
            <div></div>
            <div className="flex items-center justify-between col-span-2">
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
                  {submitting ? "Saving..." : "Save & Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddQmsInterestedParties;
