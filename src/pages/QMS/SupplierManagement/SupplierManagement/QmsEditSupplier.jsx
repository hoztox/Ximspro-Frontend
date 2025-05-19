import React, { useEffect, useState } from "react";
import { ChevronDown, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { countries } from "countries-list";
import { BASE_URL } from "../../../../Utils/Config";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import axios from "axios";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsEditSupplier = () => {
  const { id } = useParams(); // Get ID from URL parameters
  const countryList = Object.values(countries)
    .map((country) => country.name)
    .sort((a, b) => a.localeCompare(b));

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: "",
    website: "",
    email: "",
    city: "",
    address: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    alternate_phone: "",
    resolution: "",
    fax: "",
    contact_person: "",
    qualified_to_supply: "",
    notes: "",
    analysis_needed: false,
    approved_by: "",
    status: "",
    selection_criteria: "",
    approved_date: {
      day: "",
      month: "",
      year: "",
    },
  });

  // State variables for file displays
  const [preQualificationFile, setPreQualificationFile] = useState(null);
  const [documentsFile, setDocumentsFile] = useState(null);

  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [error, setError] = useState("");

  const handleListSupplier = () => {
    navigate("/company/qms/list-supplier");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkboxes
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
      return;
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

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "pre_qualification" && files[0]) {
      setFormData({
        ...formData,
        pre_qualification: files[0],
      });
    } else if (name === "documents" && files[0]) {
      setFormData({
        ...formData,
        documents: files[0],
      });
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

  // Fetch supplier data when component mounts
  useEffect(() => {
    fetchSupplierData();
    fetchUsers();
  }, [id]);

  // Fetch supplier data from the API
  const fetchSupplierData = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/qms/suppliers/${id}/`);
      const supplierData = response.data;

      // Extract date components
      let day = "";
      let month = "";
      let year = "";

      if (supplierData.approved_date) {
        const dateParts = supplierData.approved_date.split("-");
        if (dateParts.length === 3) {
          year = dateParts[0];
          month = dateParts[1];
          day = dateParts[2];
        }
      }

      // Set the file information if available
      if (supplierData.pre_qualification) {
        const fileName = supplierData.pre_qualification.split("/").pop();
        setPreQualificationFile({
          name: fileName,
          url: supplierData.pre_qualification,
        });
      }

      if (supplierData.documents) {
        const fileName = supplierData.documents.split("/").pop();
        setDocumentsFile({
          name: fileName,
          url: supplierData.documents,
        });
      }

      // Update form data with supplier data
      setFormData({
        company_name: supplierData.company_name || "",
        website: supplierData.website || "",
        email: supplierData.email || "",
        city: supplierData.city || "",
        address: supplierData.address || "",
        state: supplierData.state || "",
        postal_code: supplierData.postal_code || "",
        country: supplierData.country || "",
        phone: supplierData.phone || "",
        alternate_phone: supplierData.alternate_phone || "",
        fax: supplierData.fax || "",
        contact_person: supplierData.contact_person || "",
        qualified_to_supply: supplierData.qualified_to_supply || "",
        notes: supplierData.notes || "",
        analysis_needed: supplierData.analysis_needed || false,
        resolution: supplierData.resolution || "",
        approved_by:
          supplierData.approved_by?.id || supplierData.approved_by || "",
        status: supplierData.status || "",
        selection_criteria: supplierData.selection_criteria || "",
        approved_date: {
          day,
          month,
          year,
        },
      });
    } catch (error) {
      console.error("Error fetching supplier data:", error);
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

  const companyId = getUserCompanyId();

  // Fetch active users for the dropdown
  const fetchUsers = async () => {
    try {
      if (!companyId) return;

      const response = await axios.get(
        `${BASE_URL}/company/users-active/${companyId}/`
      );

      // Make sure the response data is in the expected format
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Unexpected users data format:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
    }
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company Name is required";
    }

    // Validate date if any part is filled
    if (
      formData.approved_date.day ||
      formData.approved_date.month ||
      formData.approved_date.year
    ) {
      if (
        !formData.approved_date.day ||
        !formData.approved_date.month ||
        !formData.approved_date.year
      ) {
        newErrors.approved_date = "Please complete the approval date";
      }
    }

    // Add additional validations as needed for your form
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format date for submission
  const formatDateForSubmission = () => {
    const { day, month, year } = formData.approved_date;
    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  // Prepare form data for submission
  const prepareSubmissionData = () => {
    const userId = getRelevantUserId();

    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      return null;
    }

    const submissionData = new FormData();
    submissionData.append("company", companyId);
    submissionData.append("user", userId);
    submissionData.append("company_name", formData.company_name);
    submissionData.append("website", formData.website || "");
    submissionData.append("email", formData.email || "");
    submissionData.append("city", formData.city || "");
    submissionData.append("address", formData.address || "");
    submissionData.append("state", formData.state || "");
    submissionData.append("postal_code", formData.postal_code || "");
    submissionData.append("country", formData.country || "");
    submissionData.append("phone", formData.phone || "");
    submissionData.append("alternate_phone", formData.alternate_phone || "");
    submissionData.append("fax", formData.fax || "");
    submissionData.append("contact_person", formData.contact_person || "");
    submissionData.append(
      "qualified_to_supply",
      formData.qualified_to_supply || ""
    );
    submissionData.append("notes", formData.notes || "");
    submissionData.append("analysis_needed", formData.analysis_needed);
    submissionData.append("approved_by", formData.approved_by || "");
    submissionData.append("status", formData.status || "");
    submissionData.append(
      "selection_criteria",
      formData.selection_criteria || ""
    );

    // Append resolution only if analysis_needed is true
    if (formData.analysis_needed && formData.resolution) {
      submissionData.append("resolution", formData.resolution);
    }

    // Format and append approved_date if all parts are filled
    const formattedDate = formatDateForSubmission();
    if (formattedDate) {
      submissionData.append("approved_date", formattedDate);
    }

    // Append file attachments if present and they are new files (not strings)
    if (
      formData.pre_qualification &&
      typeof formData.pre_qualification !== "string"
    ) {
      submissionData.append("pre_qualification", formData.pre_qualification);
    }

    if (formData.documents && typeof formData.documents !== "string") {
      submissionData.append("documents", formData.documents);
    }

    return submissionData;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const submissionData = prepareSubmissionData();
      if (!submissionData) {
        setLoading(false);
        return;
      }

      await axios.put(`${BASE_URL}/qms/suppliers/${id}/`, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-supplier");
      }, 1500);
      setSuccessMessage("Supplier Updated Successfully");
    } catch (error) {
      console.error("Error updating supplier:", error);
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
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/list-supplier");
  };

  // Open file in new tab
  const handleViewFile = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
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

  if (fetchLoading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex items-center justify-center h-96">
        <p>Loading supplier data...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Supplier</h1>

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

        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] w-[140px] list-training-btn duration-200"
          onClick={() => handleListSupplier()}
        >
          List Supplier
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5"
      >
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="add-training-inputs"
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm">{errors.company_name}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Web Site</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`add-training-inputs ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>

        <div className="flex flex-col gap-3 col-span-2">
          <label className="add-training-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="add-training-inputs !h-[84px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Postal Code</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 relative">
            <label className="add-training-label">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("country")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
            >
              <option value="" disabled>
                Select Country
              </option>
              {countryList.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                                 ${
                                   focusedDropdown === "country"
                                     ? "rotate-180"
                                     : ""
                                 }`}
              size={20}
              color="#AAAAAA"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Alternate Phone</label>
          <input
            type="text"
            name="alternate_phone"
            value={formData.alternate_phone}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Fax</label>
          <input
            type="text"
            name="fax"
            value={formData.fax}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Contact Person</label>
          <input
            type="text"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>
        <div></div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Qualified To Supply</label>
          <textarea
            name="qualified_to_supply"
            value={formData.qualified_to_supply}
            onChange={handleChange}
            className="add-training-inputs !h-[98px]"
          ></textarea>

          <div className="flex items-end justify-start">
            <label className="flex items-center">
              <span className="add-training-label cursor-pointer pr-3">
                Analysis Needed?
              </span>
              <input
                type="checkbox"
                name="analysis_needed"
                className="mr-2 form-checkboxes"
                checked={formData.analysis_needed}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="add-training-inputs !h-[98px]"
          ></textarea>

          {/* Resolution After Analysis field - only visible when analysis_needed is true */}
          {formData.analysis_needed && (
            <div className="flex flex-col gap-3">
              <label className="add-training-label">
                Resolution After Analysis
              </label>
              <input
                type="text"
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
                className="add-training-inputs"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Approved By</label>
          <select
            name="approved_by"
            value={formData.approved_by}
            onChange={handleChange}
            className={`add-training-inputs appearance-none pr-10 cursor-pointer ${
              errors.approved_by ? "border-red-500" : ""
            }`}
          >
            <option value="" disabled>
              Select Approved By
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                               ${
                                 focusedDropdown === "approved_by"
                                   ? "rotate-180"
                                   : ""
                               }`}
            size={20}
            color="#AAAAAA"
          />
          {errors.approved_by && (
            <p className="text-red-500 text-sm">{errors.approved_by}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("status")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Approved">Approved</option>
            <option value="Provisional">Provisional</option>
            <option value="Not Approved">Not Approved</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                               ${
                                 focusedDropdown === "status"
                                   ? "rotate-180"
                                   : ""
                               }`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Selection Criteria</label>
          <input
            type="text"
            name="selection_criteria"
            value={formData.selection_criteria}
            onChange={handleChange}
            className="add-training-inputs"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Approval Date</label>
          <div className="grid grid-cols-3 gap-5">
            {/* Day */}
            <div className="relative">
              <select
                name="approved_date.day"
                value={formData.approved_date.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("approved_date.day")}
                onBlur={() => setFocusedDropdown(null)}
                className={`add-training-inputs appearance-none pr-10 cursor-pointer ${
                  errors.approved_date ? "border-red-500" : ""
                }`}
              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                      ${
                                        focusedDropdown === "approved_date.day"
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
                name="approved_date.month"
                value={formData.approved_date.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("approved_date.month")}
                onBlur={() => setFocusedDropdown(null)}
                className={`add-training-inputs appearance-none pr-10 cursor-pointer ${
                  errors.approved_date ? "border-red-500" : ""
                }`}
              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                      ${
                                        focusedDropdown ===
                                        "approved_date.month"
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
                name="approved_date.year"
                value={formData.approved_date.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("approved_date.year")}
                onBlur={() => setFocusedDropdown(null)}
                className={`add-training-inputs appearance-none pr-10 cursor-pointer ${
                  errors.approved_date ? "border-red-500" : ""
                }`}
              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                      ${
                                        focusedDropdown === "approved_date.year"
                                          ? "rotate-180"
                                          : ""
                                      }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
          {errors.approved_date && (
            <p className="text-red-500 text-sm">{errors.approved_date}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Pre-qualification</label>
          <div className="flex">
            <input
              type="file"
              id="pre_qualification"
              name="pre_qualification"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="pre_qualification"
              className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
            >
              <span className="text-[#AAAAAA] choose-file">Choose File</span>
              <img src={file} alt="" />
            </label>
          </div>
          <div className="flex justify-between items-center">
            {preQualificationFile && (
              <button
                type="button"
                onClick={() => handleViewFile(preQualificationFile.url)}
                className="click-view-file-btn text-[#1E84AF] flex items-center gap-2"
              >
                Click to view file <Eye size={18} />
              </button>
            )}
            {preQualificationFile ? (
              <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                {preQualificationFile.name}
              </p>
            ) : (
              <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                No file chosen
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Upload Documents</label>
          <div className="flex">
            <input
              type="file"
              id="documents"
              name="documents"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="documents"
              className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
            >
              <span className="text-[#AAAAAA] choose-file">Choose File</span>
              <img src={file} alt="" />
            </label>
          </div>
          <div className="flex justify-between items-center">
            {documentsFile && (
              <button
                type="button"
                onClick={() => handleViewFile(documentsFile.url)}
                className="click-view-file-btn text-[#1E84AF] flex items-center gap-2"
              >
                Click to view file <Eye size={18} />
              </button>
            )}
            {documentsFile ? (
              <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                {documentsFile.name}
              </p>
            ) : (
              <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                No file chosen
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 flex gap-4 justify-end">
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
            >
              Cancel
            </button>
            <button type="submit" className="save-btn duration-200">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default QmsEditSupplier;
