import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Eye, Search } from "lucide-react";
import axios from "axios";
import fileIcon from "../../../../assets/images/Company Documentation/file-icon.svg";
import { BASE_URL } from "../../../../Utils/Config";
import EditQmsProcessesDraftSuccessModal from "./Modals/EditQmsProcessesDraftSuccessModal";
import EditQmsProcessesDraftErrorModal from "./Modals/EditQmsProcessesDraftErrorModal";

const EditQmsDraftProcesses = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Define legal requirement options
  const [legalRequirementOptions, setLegalRequirementOptions] = useState([]);
  // Add search state
  const [searchTerm, setSearchTerm] = useState("");
  // Add error state
  const [error, setError] = useState(null);
  // Add validation errors state
  const [validationErrors, setValidationErrors] = useState({
    name: "",
  });

  const [
    showEditDraftProcessesSuccessModal,
    setShowEditDraftProcessesSuccessModal,
  ] = useState(false);
  const [
    showEditDraftProcessesErrorModal,
    setShowEditDraftProcessesErrorModal,
  ] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    no: "",
    type: "Strategic", // Default value aligned with the model choices
    legal_requirements: [],
    custom_legal_requirements: "",
    file: null,
    is_draft: false,
    send_notification: false,
  });

  const [dropdownRotation, setDropdownRotation] = useState({
    type: false,
    legal_requirements: false,
  });

  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCustomField, setShowCustomField] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

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

  // Define the fetchComplianceData function
  const fetchComplianceData = () => {
    if (!companyId) {
      console.error("Company ID not found");
      return;
    }

    axios
      .get(`${BASE_URL}/qms/procedure-publish/${companyId}/`)
      .then((response) => {
        setLegalRequirementOptions(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching procedure:", error);
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
      });
  };

  useEffect(() => {
    if (companyId) {
      setFormData((prev) => ({
        ...prev,
        company: companyId,
      }));
      fetchComplianceData();
    }
  }, [companyId]);

  useEffect(() => {
    if (!id) return;
    console.log("Fetching data for id:", id);

    axios
      .get(`${BASE_URL}/qms/processes-get/${id}/`)
      .then((res) => {
        const data = res.data;

        // Convert the legal_requirements IDs to titles using legal_requirement_details
        let procedureTitles = [];
        if (
          data.legal_requirement_details &&
          Array.isArray(data.legal_requirement_details)
        ) {
          procedureTitles = data.legal_requirement_details.map(
            (item) => item.title
          );
        }

        setFormData({
          ...data,
          legal_requirements: procedureTitles,
          custom_legal_requirements: data.custom_legal_requirements || "",
          file: null,
        });

        if (
          data.legal_requirements === "N/A" ||
          data.custom_legal_requirements
        ) {
          setShowCustomField(true);
        }

        if (data.file) {
          setFileName(data.file.split("/").pop());
          setFileUrl(data.file);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
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
      });
  }, [id]);

  const toggleDropdown = (field) => {
    setDropdownRotation((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation errors when user starts typing
    if (name === "name" && validationErrors.name) {
      setValidationErrors({
        ...validationErrors,
        name: "",
      });
    }
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle checkbox change for procedures
  const handleProcedureCheckboxChange = (procedureTitle) => {
    setFormData((prevData) => {
      const updatedProcedures = [...prevData.legal_requirements];

      // If already selected, remove it
      if (updatedProcedures.includes(procedureTitle)) {
        return {
          ...prevData,
          legal_requirements: updatedProcedures.filter(
            (item) => item !== procedureTitle
          ),
        };
      }
      // Otherwise add it
      else {
        return {
          ...prevData,
          legal_requirements: [...updatedProcedures, procedureTitle],
        };
      }
    });
  };

  // Toggle N/A option for custom field
  const handleNAChange = (e) => {
    const checked = e.target.checked;
    setShowCustomField(checked);

    if (checked) {
      // If N/A is checked, clear all procedure selections
      setFormData((prev) => ({
        ...prev,
        legal_requirements: [],
      }));
    } else {
      // If N/A is unchecked, clear the custom field
      setFormData((prev) => ({
        ...prev,
        custom_legal_requirements: "",
      }));
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
      window.open(fileUrl, "_blank");
    } else if (selectedFile) {
      // If there's a newly selected file, create a temporary URL to view it
      const tempUrl = URL.createObjectURL(selectedFile);
      window.open(tempUrl, "_blank");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Check if name is empty
    if (!formData.name.trim()) {
      errors.name = "Name/Title is Required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      // Create an object for the JSON data
      const data = {
        name: formData.name,
        no: formData.no,
        type: formData.type,
        is_draft: formData.is_draft,
        send_notification: formData.send_notification,
        company: companyId,
      };

      // Handle file upload first if needed
      if (formData.file instanceof File) {
        const fileFormData = new FormData();
        fileFormData.append("file", formData.file);

        const fileResponse = await axios.put(
          `${BASE_URL}/qms/processes/create/${id}/`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (fileResponse.data && fileResponse.data.file_url) {
          data.file = fileResponse.data.file_url;
        }
      }

      // Handle legal requirements based on whether custom field is shown
      if (showCustomField) {
        data.custom_legal_requirements =
          formData.custom_legal_requirements || "";
        data.legal_requirements = [];
      } else {
        const procedureIds = formData.legal_requirements
          .map((procedureTitle) => {
            const procedure = legalRequirementOptions.find(
              (p) => p.title === procedureTitle
            );
            return procedure ? procedure.id : null;
          })
          .filter((id) => id !== null);

        data.legal_requirements = procedureIds;
        data.custom_legal_requirements = "";
      }

      // Send the update request as JSON instead of FormData
      const response = await axios.put(
        `${BASE_URL}/qms/processes/create/${id}/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Success response:", response.data);
      setShowEditDraftProcessesSuccessModal(true);
      setTimeout(() => {
        setShowEditDraftProcessesSuccessModal(false);
        navigate("/company/qms/processes");
      }, 2000);
    } catch (err) {
      console.error("Error updating process:", err.response?.data || err);
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
      setShowEditDraftProcessesErrorModal(true);
      setTimeout(() => {
        setShowEditDraftProcessesErrorModal(false);
      }, 3000);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/draft-processes");
  };

  // Filter procedures based on search term
  const filteredProcedures = legalRequirementOptions.filter((option) =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg text-white">
      <h1 className="add-interested-parties-head px-[122px] border-b border-[#383840] pb-5">
        Edit Draft Processes
      </h1>

      <EditQmsProcessesDraftSuccessModal
        showEditDraftProcessesSuccessModal={showEditDraftProcessesSuccessModal}
        onClose={() => {
          setShowEditDraftProcessesSuccessModal(false);
        }}
      />

      <EditQmsProcessesDraftErrorModal
        showEditDraftProcessesErrorModal={showEditDraftProcessesErrorModal}
        onClose={() => {
          setShowEditDraftProcessesErrorModal(false);
        }}
        error={error}
      />

      <form onSubmit={handleSubmit} className="px-[122px]">
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block mb-3 add-qms-manual-label">
                Name/Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full add-qms-intertested-inputs ${
                  validationErrors.name ? "border-red-500" : ""
                }`}
                placeholder="Enter Name"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-3 add-qms-manual-label">
                Process No/Identification
              </label>
              <input
                type="text"
                name="no"
                value={formData.no || ""}
                onChange={handleInputChange}
                className="w-full add-qms-intertested-inputs"
                placeholder="Enter Process Number"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-3 add-qms-manual-label">
                Process Type
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  onFocus={() => toggleDropdown("type")}
                  onBlur={() => toggleDropdown("type")}
                  className="w-full add-qms-intertested-inputs appearance-none cursor-pointer"
                >
                  <option value="Strategic">Strategic</option>
                  <option value="Core">Core</option>
                  <option value="Support">Support</option>
                  <option value="Monitoring/Measurment">
                    Monitoring/Measurement
                  </option>
                  <option value="Outsource">Outsource</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
                      dropdownRotation.type ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block mb-3 add-qms-manual-label">
                Related Procedure
              </label>

              {/* Search box for procedures */}
              <div className="relative mb-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search procedures..."
                  className="w-full add-qms-intertested-inputs !pl-8"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              <div className="border border-[#383840] rounded-md p-2 max-h-[145px] overflow-y-auto">
                {showCustomField ? (
                  <div className="my-2">
                    <textarea
                      name="custom_legal_requirements"
                      placeholder="Please specify"
                      value={formData.custom_legal_requirements}
                      onChange={handleInputChange}
                      className="w-full add-qms-intertested-inputs !h-16"
                    />
                  </div>
                ) : (
                  <>
                    {filteredProcedures.length > 0 ? (
                      filteredProcedures.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`procedure-${index}`}
                            className="mr-2 form-checkboxes"
                            checked={formData.legal_requirements.includes(
                              option.title
                            )}
                            onChange={() =>
                              handleProcedureCheckboxChange(option.title)
                            }
                          />
                          <label
                            htmlFor={`procedure-${index}`}
                            className="permissions-texts cursor-pointer"
                          >
                            {option.title}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="not-found mt-2 mb-2">No procedures found</p>
                    )}
                  </>
                )}
                <div className="flex items-center mb-4 pb-2">
                  <input
                    type="checkbox"
                    id="procedure-na"
                    className="mr-2 form-checkboxes"
                    checked={showCustomField}
                    onChange={handleNAChange}
                  />
                  <label
                    htmlFor="procedure-na"
                    className="permissions-texts cursor-pointer font-medium"
                  >
                    N/A
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      <p className="click-view-file-btn text-[#1E84AF]">
                        Click to view file
                      </p>
                      <Eye size={16} className="text-[#1E84AF]" />
                    </button>
                  )}
                  {!selectedFile && !fileUrl && (
                    <p className="text-right no-file">No file chosen</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-end justify-end">
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
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
            >
              Cancel
            </button>
            <button type="submit" className="save-btn duration-200">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EditQmsDraftProcesses;
