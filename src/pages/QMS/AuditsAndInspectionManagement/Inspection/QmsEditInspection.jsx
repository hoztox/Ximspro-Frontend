import React, { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsEditInspection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  const [procedureOptions, setProcedureOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    inspection_type: false,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  // Search states
  const [procedureSearchTerm, setProcedureSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Custom field states
  const [showCustomProcedureField, setShowCustomProcedureField] =
    useState(false);
  const [showCustomUserField, setShowCustomUserField] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    certification_body: "",
    inspector_from: "",
    check_inspector: false,
    inspection_type: "",
    area: "",
    procedures: [],
    inspector_from_internal: [],
    notes: "",
    upload_inspection_report: null,
    upload_non_coformities_report: null,
    proposedDate: {
      day: "",
      month: "",
      year: "",
    },
    dateConducted: {
      day: "",
      month: "",
      year: "",
    },
    custom_procedures: "",
    custom_internal_inspectors: "",
  });

  const [focusedDropdown, setFocusedDropdown] = useState(null);

  useEffect(() => {
    // Fetch inspection data, procedures, and users on component mount
    fetchInspectionData();
    fetchProcedures();
    fetchUsers();
  }, [id]);

  const fetchInspectionData = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${BASE_URL}/qms/inspection-get/${id}/`);
      const inspectionData = response.data;

      // Format dates for form data
      const proposedDate = inspectionData.proposed_date
        ? new Date(inspectionData.proposed_date)
        : null;
      const dateConducted = inspectionData.date_conducted
        ? new Date(inspectionData.date_conducted)
        : null;

      // Check if this is an internal or external inspection
      const hasInternalInspectors =
        inspectionData.inspector_from_internal &&
        inspectionData.inspector_from_internal.length > 0;

      setFormData({
        title: inspectionData.title || "",
        certification_body: inspectionData.certification_body || "",
        inspector_from: inspectionData.inspector_from || "",
        check_inspector: hasInternalInspectors,
        inspector_from_internal: hasInternalInspectors
          ? inspectionData.inspector_from_internal?.map((user) => user.id) || []
          : [],
        inspection_type: inspectionData.inspection_type || "",
        area: inspectionData.area || "",
        procedures: inspectionData.procedures?.map((proc) => proc.id) || [],
        notes: inspectionData.notes || "",
        proposedDate: {
          day: proposedDate
            ? String(proposedDate.getDate()).padStart(2, "0")
            : "",
          month: proposedDate
            ? String(proposedDate.getMonth() + 1).padStart(2, "0")
            : "",
          year: proposedDate ? String(proposedDate.getFullYear()) : "",
        },
        dateConducted: {
          day: dateConducted
            ? String(dateConducted.getDate()).padStart(2, "0")
            : "",
          month: dateConducted
            ? String(dateConducted.getMonth() + 1).padStart(2, "0")
            : "",
          year: dateConducted ? String(dateConducted.getFullYear()) : "",
        },
        custom_procedures: inspectionData.custom_procedures || "",
        custom_internal_inspectors:
          inspectionData.custom_internal_inspectors || "",
      });

      // Set custom field flags if they exist
      setShowCustomProcedureField(!!inspectionData.custom_procedures);
      setShowCustomUserField(!!inspectionData.custom_internal_inspectors);

      setError(null);
    } catch (error) {
      console.error("Failed to fetch inspection data", error);
      setError("Failed to load inspection data");
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
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchProcedures = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        console.error("Company ID not found");
        return;
      }
      const response = await axios.get(
        `${BASE_URL}/qms/procedure-publish/${companyId}/`
      );
      setProcedureOptions(response.data);
    } catch (err) {
      console.error("Error fetching procedures:", err);
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
      // Fallback procedure options
      setProcedureOptions([{ id: 1, title: "Null" }]);
    }
  };

  const fetchUsers = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        console.error("Company ID not found");
        return;
      }
      const response = await axios.get(
        `${BASE_URL}/company/users/${companyId}/`
      );
      setUserOptions(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
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
    }
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

  const handleProcedureCheckboxChange = (procedureId) => {
    setFormData((prevData) => {
      const updatedProcedures = [...prevData.procedures];

      // If already selected, remove it
      if (updatedProcedures.includes(procedureId)) {
        return {
          ...prevData,
          procedures: updatedProcedures.filter((id) => id !== procedureId),
        };
      }
      // Otherwise add it
      else {
        return {
          ...prevData,
          procedures: [...updatedProcedures, procedureId],
        };
      }
    });
  };

  const handleUserCheckboxChange = (userId) => {
    setFormData((prevData) => {
      const updatedUsers = [...prevData.inspector_from_internal];

      // If already selected, remove it
      if (updatedUsers.includes(userId)) {
        return {
          ...prevData,
          inspector_from_internal: updatedUsers.filter((id) => id !== userId),
        };
      }
      // Otherwise add it
      else {
        return {
          ...prevData,
          inspector_from_internal: [...updatedUsers, userId],
        };
      }
    });
  };

  // Handle procedure N/A option
  const handleProcedureNAChange = (e) => {
    const checked = e.target.checked;
    setShowCustomProcedureField(checked);

    if (checked) {
      // Clear selected procedures if N/A is checked
      setFormData((prev) => ({
        ...prev,
        procedures: [],
      }));
    } else {
      // Clear custom field if N/A is unchecked
      setFormData((prev) => ({
        ...prev,
        custom_procedures: "",
      }));
    }
  };

  // Handle user N/A option
  const handleUserNAChange = (e) => {
    const checked = e.target.checked;
    setShowCustomUserField(checked);

    if (checked) {
      // Clear selected users if N/A is checked
      setFormData((prev) => ({
        ...prev,
        inspector_from_internal: [],
      }));
    } else {
      // Clear custom field if N/A is unchecked
      setFormData((prev) => ({
        ...prev,
        custom_internal_inspectors: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox specifically - especially for the inspector toggle
    if (type === "checkbox") {
      if (name === "check_inspector") {
        // If changing to internal inspector, clear the external inspector_from field
        // If changing to external inspector, clear the internal inspector selections
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
          ...(checked
            ? { inspector_from: "" }
            : { inspector_from_internal: [], custom_internal_inspectors: "" }),
        }));

        // Also reset the custom field display when switching
        if (!checked) {
          setShowCustomUserField(false);
        }

        return;
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
        return;
      }
    }

    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      title: !formData.title,
      inspection_type: !formData.inspection_type,
    };

    setFieldErrors(errors);

    // If there are errors, don't submit
    if (errors.title || errors.inspection_type) {
      return;
    }

    setLoading(true);

    try {
      const userId = getRelevantUserId();
      const companyId = getUserCompanyId();

      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      // Format dates properly
      const proposedDate =
        formData.proposedDate.year &&
        formData.proposedDate.month &&
        formData.proposedDate.day
          ? `${formData.proposedDate.year}-${formData.proposedDate.month}-${formData.proposedDate.day}`
          : null;

      const dateConducted =
        formData.dateConducted.year &&
        formData.dateConducted.month &&
        formData.dateConducted.day
          ? `${formData.dateConducted.year}-${formData.dateConducted.month}-${formData.dateConducted.day}`
          : null;

      const submissionData = new FormData();
      submissionData.append("company", companyId);
      submissionData.append("user", userId);
      submissionData.append("title", formData.title);
      submissionData.append("certification_body", formData.certification_body);
      submissionData.append("inspection_type", formData.inspection_type);
      submissionData.append("area", formData.area);
      submissionData.append("notes", formData.notes);

      // Exclusive handling of inspector_from vs inspector_from_internal
      if (formData.check_inspector) {
        // Using internal inspectors
        submissionData.append("inspector_from", ""); // Clear external inspector

        // Handle internal inspectors
        if (showCustomUserField && formData.custom_internal_inspectors) {
          submissionData.append(
            "custom_internal_inspectors",
            formData.custom_internal_inspectors
          );
        } else if (
          formData.inspector_from_internal &&
          formData.inspector_from_internal.length > 0
        ) {
          formData.inspector_from_internal.forEach((userId) => {
            submissionData.append("inspector_from_internal", userId);
          });
        }
      } else {
        // Using external inspector
        submissionData.append("inspector_from", formData.inspector_from);
        // Don't include inspector_from_internal at all to ensure it's cleared
      }

      if (proposedDate) {
        submissionData.append("proposed_date", proposedDate);
      }

      if (dateConducted) {
        submissionData.append("date_conducted", dateConducted);
      }

      // Handle multi-select procedures
      if (showCustomProcedureField && formData.custom_procedures) {
        submissionData.append("custom_procedures", formData.custom_procedures);
      } else if (formData.procedures && formData.procedures.length > 0) {
        formData.procedures.forEach((procedureId) => {
          submissionData.append("procedures", procedureId);
        });
      }

      // If there are files, add them to the form data
      if (formData.upload_inspection_report instanceof File) {
        submissionData.append(
          "upload_inspection_report",
          formData.upload_inspection_report
        );
      }

      if (formData.upload_non_coformities_report instanceof File) {
        submissionData.append(
          "upload_non_coformities_report",
          formData.upload_non_coformities_report
        );
      }

      const response = await axios.put(
        `${BASE_URL}/qms/inspection-get/${id}/`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Inspection updated successfully:", response.data);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-inspection");
      }, 1500);
      setSuccessMessage("Inspection updated successfully");
    } catch (error) {
      console.error("Error updating inspection:", error);
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

  const handleListInspection = () => {
    navigate("/company/qms/list-inspection");
  };

  const handleCancel = () => {
    navigate("/company/qms/list-inspection");
  };

  // Generate options for dropdowns
  const generateOptions = (start, end, prefix = "") => {
    const options = [];
    for (let i = start; i <= end; i++) {
      const value = i < 10 ? `0${i}` : `${i}`;
      options.push(
        <option key={i} value={value}>
          {prefix}
          {value}
        </option>
      );
    }
    return options;
  };

  // Filter procedures based on search term
  const filteredProcedures = procedureOptions.filter((procedure) =>
    procedure.title.toLowerCase().includes(procedureSearchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = userOptions.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(userSearchTerm.toLowerCase())
  );

  // Show loading while fetching data
  if (fetchLoading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex justify-center items-center h-64">
        <p>Loading inspection data...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Inspection</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
          onClick={() => handleListInspection()}
        >
          List Inspection
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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5"
      >
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Inspection Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-sm">Inspection Title is required</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Certification Body</label>
          <input
            type="text"
            name="certification_body"
            value={formData.certification_body}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          {!formData.check_inspector && (
            <>
              <label className="add-training-label">Inspector From</label>
              <input
                type="text"
                name="inspector_from"
                value={formData.inspector_from}
                onChange={handleChange}
                className="add-training-inputs focus:outline-none"
              />
            </>
          )}
          <div className="flex items-end justify-start">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="check_inspector"
                className="mr-2 form-checkboxes"
                checked={formData.check_inspector}
                onChange={handleChange}
              />
              <span className="permissions-texts cursor-pointer pr-3">
                If not external inspector
              </span>
            </label>
          </div>

          {/* Conditionally render user selection when check_inspector is true */}
          {formData.check_inspector && (
            <div className="flex flex-col mt-3">
              <div className="relative mb-2">
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Search inspectors..."
                  className="w-full add-training-inputs pl-8 focus:outline-none"
                />
              </div>

              {showCustomUserField ? (
                <input
                  type="text"
                  name="custom_internal_inspectors"
                  value={formData.custom_internal_inspectors}
                  onChange={handleChange}
                  placeholder="Enter custom inspector names"
                  className="add-training-inputs focus:outline-none mb-2"
                />
              ) : (
                <div className="border border-[#383840] rounded-md p-2 max-h-[130px] overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          className="mr-2 form-checkboxes"
                          checked={formData.inspector_from_internal.includes(
                            user.id
                          )}
                          onChange={() => handleUserCheckboxChange(user.id)}
                        />
                        <label
                          htmlFor={`user-${user.id}`}
                          className="permissions-texts cursor-pointer"
                        >
                          {user.first_name} {user.last_name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 mt-2">No inspectors found</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">
            Inspection Type <span className="text-red-500">*</span>
          </label>
          <select
            name="inspection_type"
            value={formData.inspection_type}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("inspection_type")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Internal">Internal</option>
            <option value="External">External</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[50px] transform transition-transform duration-300 
                        ${
                          focusedDropdown === "inspection_type"
                            ? "rotate-180"
                            : ""
                        }`}
            size={20}
            color="#AAAAAA"
          />
          {fieldErrors.inspection_type && (
            <p className="text-red-500 text-sm">Inspection Type is required</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Area / Function:</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="block mb-3 add-qms-manual-label">Procedures</label>

          {showCustomProcedureField ? (
            <input
              type="text"
              name="custom_procedures"
              value={formData.custom_procedures}
              onChange={handleChange}
              placeholder="Enter custom procedure names"
              className="add-training-inputs focus:outline-none mb-2"
            />
          ) : (
            <>
              <div className="relative mb-2">
                <input
                  type="text"
                  value={procedureSearchTerm}
                  onChange={(e) => setProcedureSearchTerm(e.target.value)}
                  placeholder="Search procedures..."
                  className="w-full add-training-inputs pl-8 focus:outline-none"
                />
              </div>

              <div className="border border-[#383840] rounded-md p-2 max-h-[130px] overflow-y-auto">
                {filteredProcedures.length > 0 ? (
                  filteredProcedures.map((option) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`procedure-${option.id}`}
                        className="mr-2 form-checkboxes"
                        checked={formData.procedures.includes(option.id)}
                        onChange={() =>
                          handleProcedureCheckboxChange(option.id)
                        }
                      />
                      <label
                        htmlFor={`procedure-${option.id}`}
                        className="permissions-texts cursor-pointer"
                      >
                        {option.title}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="not-found mt-2">No Procedures Found</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Proposed Date for Inspection
          </label>
          <div className="grid grid-cols-3 gap-5">
            {/* Day */}
            <div className="relative">
              <select
                name="proposedDate.day"
                value={formData.proposedDate.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("proposedDate.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${
                                  focusedDropdown === "proposedDate.day"
                                    ? "rotate-180"
                                    : ""
                                }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Month */}
            <div className="relative">
              <select
                name="proposedDate.month"
                value={formData.proposedDate.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("proposedDate.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${
                                  focusedDropdown === "proposedDate.month"
                                    ? "rotate-180"
                                    : ""
                                }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                name="proposedDate.year"
                value={formData.proposedDate.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("proposedDate.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${
                                  focusedDropdown === "proposedDate.year"
                                    ? "rotate-180"
                                    : ""
                                }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Date Conducted</label>
          <div className="grid grid-cols-3 gap-5">
            {/* Day */}
            <div className="relative">
              <select
                name="dateConducted.day"
                value={formData.dateConducted.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateConducted.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${
                                  focusedDropdown === "dateConducted.day"
                                    ? "rotate-180"
                                    : ""
                                }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Month */}
            <div className="relative">
              <select
                name="dateConducted.month"
                value={formData.dateConducted.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateConducted.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${
                                  focusedDropdown === "dateConducted.month"
                                    ? "rotate-180"
                                    : ""
                                }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                name="dateConducted.year"
                value={formData.dateConducted.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateConducted.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${
                                  focusedDropdown === "dateConducted.year"
                                    ? "rotate-180"
                                    : ""
                                }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="add-training-label">Notes</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="add-training-inputs"
              required
            />
          </div>
        </div>

        <div className="flex items-end gap-5 w-full">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn duration-200 !w-full"
          >
            Cancel
          </button>
          <button type="submit" className="save-btn duration-200 !w-full">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
export default QmsEditInspection;
