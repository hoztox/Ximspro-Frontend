import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { countries } from "countries-list";
import { BASE_URL } from "../../../../Utils/Config";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import axios from "axios";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsAddSupplier = () => {
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
    status: "Approved",
    selection_criteria: "",
    approved_date: {
      day: "",
      month: "",
      year: "",
    },
  });

  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [draftLoading, setDraftLoading] = useState(false);
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

    setFormData({
      ...formData,
      [name]: files[0],
    });
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
  const companyId = getUserCompanyId();

  const prepareSubmissionData = (isDraft = false) => {
    const userId = getRelevantUserId();

    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      return null;
    }

    const submissionData = new FormData();
    submissionData.append("company", companyId);
    submissionData.append("user", userId);
    submissionData.append("company_name", formData.company_name);
    submissionData.append("website", formData.website || "N/A");
    submissionData.append("email", formData.email || "N/A");
    submissionData.append("city", formData.city || "N/A");
    submissionData.append("address", formData.address || "N/A");
    submissionData.append("state", formData.state || "N/A");
    submissionData.append("postal_code", formData.postal_code || "N/A");
    submissionData.append("country", formData.country || "N/A");
    submissionData.append("phone", formData.phone || "N/A");
    submissionData.append("alternate_phone", formData.alternate_phone || "N/A");
    submissionData.append("fax", formData.fax || "N/A");
    submissionData.append("contact_person", formData.contact_person || "N/A");
    submissionData.append(
      "qualified_to_supply",
      formData.qualified_to_supply || "N/A"
    );
    submissionData.append("notes", formData.notes || "N/A");
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

    // Format and append approved_date date if all parts are filled
    const formattedDate = formatDateForSubmission();
    if (formattedDate) {
      submissionData.append("approved_date", formattedDate);
    }

    // Append file attachments if present
    if (formData.pre_qualification) {
      submissionData.append("pre_qualification", formData.pre_qualification);
    }

    if (formData.documents) {
      submissionData.append("documents", formData.documents);
    }

    if (isDraft) {
      submissionData.append("is_draft", true);
    }

    return submissionData;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      if (!companyId) return;

      const response = await axios.get(
        `${BASE_URL}/company/users-active/${companyId}/`
      );

      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        setUsers(response.data);
        console.log("Users loaded:", response.data);
      } else {
        setUsers([]);
        console.error("Unexpected response format:", response.data);
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

      await axios.post(`${BASE_URL}/qms/suppliers/create/`, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Added Supplier--", submissionData);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-supplier");
      }, 1500);
      setSuccessMessage("Supplier Added Successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
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

  const handleSaveAsDraft = async () => {
    setDraftLoading(true);
    setError("");

    try {
      const submissionData = prepareSubmissionData(true);
      if (!submissionData) {
        setDraftLoading(false);
        return;
      }

      await axios.post(
        `${BASE_URL}/qms/suppliers/draft-create/`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Drafte supp:", formData);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/draft-supplier");
      }, 1500);
      setSuccessMessage("Supplier Drafted Successfully");
    } catch (err) {
      setDraftLoading(false);
      let errorMsg = err.message;

      if (err.response) {
        // Check for field-specific errors first
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
        // Check for non-field errors
        else if (err.response.data.email) {
          errorMsg = err.response.data.email[0];
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
      console.error("Error saving Draft:", err.response?.data || err);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/list-supplier");
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

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Add Supplier</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] w-[140px] list-training-btn duration-200"
          onClick={() => handleListSupplier()}
        >
          List Supplier
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
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className={`add-training-inputs ${
              errors.company_name ? "border-red-500" : ""
            }`}
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
            onFocus={() => setFocusedDropdown("approved_by")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="N/A">Select Approved By</option>
            {users.length > 0 ? (
              users.map((user) => (
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
                ${focusedDropdown === "approved_by" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
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
                           ${focusedDropdown === "status" ? "rotate-180" : ""}`}
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
                                     focusedDropdown === "approved_date.month"
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
              id="prequalification-upload"
              name="pre_qualification"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="prequalification-upload"
              className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
            >
              <span className="text-[#AAAAAA] choose-file">Choose File</span>
              <img src={file} alt="" />
            </label>
          </div>
          {formData.pre_qualification ? (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              {formData.pre_qualification.name}
            </p>
          ) : (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              No file chosen
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Upload Documents</label>
          <div className="flex">
            <input
              type="file"
              id="documents-upload"
              name="documents"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="documents-upload"
              className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
            >
              <span className="text-[#AAAAAA] choose-file">Choose File</span>
              <img src={file} alt="" />
            </label>
          </div>
          {formData.documents ? (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              {formData.documents.name}
            </p>
          ) : (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              No file chosen
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 flex gap-4 justify-between">
          <div>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={draftLoading}
              className="request-correction-btn duration-200"
            >
              {draftLoading ? "Saving..." : "Save as Draft"}
            </button>
          </div>
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="save-btn duration-200"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QmsAddSupplier;
