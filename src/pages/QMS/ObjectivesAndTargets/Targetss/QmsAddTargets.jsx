import React, { useEffect, useState } from "react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { ChevronDown, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsAddTargets = () => {
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

  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [programFields, setProgramFields] = useState([{ id: 1, title: "" }]);
  const [formErrors, setFormErrors] = useState({
    target: "",
    responsible: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    target: "",
    associative_objective: "",
    results: "",
    target_date: {
      day: "",
      month: "",
      year: "",
    },
    upload_attachment: null,
    responsible: "",
    status: "On Going",
    reminder_date: {
      day: "",
      month: "",
      year: "",
    },
    is_draft: false,
    programs: [{ title: "" }],
  });

  const [focusedDropdown, setFocusedDropdown] = useState(null);

  const handleListTargets = () => {
    navigate("/company/qms/list-targets");
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      upload_attachment: e.target.files[0],
    });
  };

  const fetchUsers = async () => {
    try {
      if (!companyId) return;
      const response = await axios.get(
        `${BASE_URL}/company/users-active/${companyId}/`
      );
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(
        "Failed to load users. Please check your connection and try again."
      );
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      // Clear error when user starts typing
      if (name === "target" || name === "responsible") {
        setFormErrors({
          ...formErrors,
          [name]: ""
        });
      }
    }
  };

  const handleProgramChange = (id, value) => {
    const updatedProgramFields = programFields.map(field =>
      field.id === id ? { ...field, title: value } : field
    );

    setProgramFields(updatedProgramFields);

    // Update formData with the new programs array
    setFormData(prev => ({
      ...prev,
      programs: updatedProgramFields.map(field => ({ title: field.title }))
    }));
  };

  const addProgramField = () => {
    const newId = programFields.length > 0
      ? Math.max(...programFields.map(f => f.id)) + 1
      : 1;

    const newProgramFields = [...programFields, { id: newId, title: "" }];

    setProgramFields(newProgramFields);
    setFormData(prev => ({
      ...prev,
      programs: newProgramFields.map(field => ({ title: field.title }))
    }));
  };

  const removeProgramField = (id) => {
    if (programFields.length > 1) {
      const newProgramFields = programFields.filter(field => field.id !== id);

      setProgramFields(newProgramFields);
      setFormData(prev => ({
        ...prev,
        programs: newProgramFields.map(field => ({ title: field.title }))
      }));
    }
  };

  const formatDate = (dateObj) => {
    if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  };

  // const validatePrograms = () => {
  //   const validPrograms = formData.programs.filter(
  //     (program) => program.title.trim() !== "" 
  //   );
  //   if (validPrograms.length === 0) {
  //     setError("At least one program with a non-empty title is required.");
  //     return false;
  //   }
  //   return true;
  // };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.target.trim()) {
      errors.target = "Target is required";
      isValid = false;
    }

    if (!formData.responsible) {
      errors.responsible = "Responsible is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const prepareFormData = (isDraft) => {
    const formDataToSend = new FormData();

    // Append all basic fields
    formDataToSend.append("user", userId);
    formDataToSend.append("company", companyId);
    formDataToSend.append("title", formData.title || "");
    formDataToSend.append("target", formData.target || "");
    formDataToSend.append("associative_objective", formData.associative_objective || "");
    formDataToSend.append("results", formData.results || "");
    formDataToSend.append("status", formData.status);
    formDataToSend.append("responsible", formData.responsible);
    formDataToSend.append("is_draft", isDraft);

    // Format and append dates
    const targetDate = formatDate(formData.target_date);
    if (targetDate) formDataToSend.append("target_date", targetDate);

    const reminderDate = formatDate(formData.reminder_date);
    if (reminderDate) formDataToSend.append("reminder_date", reminderDate);

    // Append file if it exists
    if (formData.upload_attachment) {
      formDataToSend.append("upload_attachment", formData.upload_attachment);
    }

    // Append programs correctly
    const validPrograms = formData.programs.filter(p => p.title.trim() !== "");

    // Use JSON string for draft endpoint
    if (isDraft) {
      formDataToSend.append("programs", JSON.stringify(validPrograms));
    } else {
      // Use the indexed approach for the regular create endpoint
      validPrograms.forEach((program, index) => {
        formDataToSend.append(`programs[${index}]title`, program.title);
      });
    }

    return formDataToSend;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const formDataToSend = prepareFormData(false);

      const response = await axios.post(
        `${BASE_URL}/qms/targets/create/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Target Response", response.data);
      setIsLoading(false);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-targets");
      }, 1500);
      setSuccessMessage("Targets Added Successfully")
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
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

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formDataToSend = prepareFormData(true);

      console.log("Draft Form Data:", Object.fromEntries(formDataToSend.entries()));

      const response = await axios.post(
        `${BASE_URL}/qms/targets/draft-create/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Draft Response", response.data);
      setIsLoading(false);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/draft-targets");
      }, 1500);
      setSuccessMessage("Targets Drafted Successfully")
    } catch (error) {
      console.error("Error saving as draft:", error);
      setIsLoading(false);
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
        <h1 className="add-training-head">Add Targets and Programs</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={handleListTargets}
        >
          List Targets and Programs
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
            Target <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="target"
            value={formData.target}
            onChange={handleChange}
            className={`add-training-inputs focus:outline-none ${formErrors.target ? "border-red-500" : ""}`}
          />
          {formErrors.target && (
            <p className="text-red-500 text-sm mt-1">{formErrors.target}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Associated Objective</label>
          <input
            type="text"
            name="associative_objective"
            value={formData.associative_objective}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
          />
        </div>

        {programFields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 justify-between last:pr-[57px]">
              <label className="add-training-label">
                Program(s)
              </label>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeProgramField(field.id)}
                  className="text-red-500 text-xs"
                >
                  <X size={17} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={field.title}
                onChange={(e) => handleProgramChange(field.id, e.target.value)}
                className="add-training-inputs focus:outline-none flex-1"
              />
              {index === programFields.length - 1 && (
                <button
                  type="button"
                  onClick={addProgramField}
                  className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                >
                  <Plus className="text-white" />
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-3 col-span-2">
          <label className="add-training-label">Results</label>
          <textarea
            name="results"
            value={formData.results}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Target Date</label>
          <div className="grid grid-cols-3 gap-5">
            <div className="relative">
              <select
                name="target_date.day"
                value={formData.target_date.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("target_date.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "target_date.day"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
            <div className="relative">
              <select
                name="target_date.month"
                value={formData.target_date.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("target_date.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "target_date.month"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
            <div className="relative">
              <select
                name="target_date.year"
                value={formData.target_date.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("target_date.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "target_date.year"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">
            Responsible <span className="text-red-500">*</span>
          </label>
          <select
            name="responsible"
            value={formData.responsible}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("responsible")}
            onBlur={() => setFocusedDropdown(null)}
            className={`add-training-inputs appearance-none pr-10 cursor-pointer ${formErrors.responsible ? "border-red-500" : ""}`}
          >
            <option value="" disabled>
              {isLoading ? "Loading..." : "Select Responsible"}
            </option>
            {users && users.length > 0
              ? users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name || ""}
                </option>
              ))
              : !isLoading && (
                <option value="" disabled>
                  No users found
                </option>
              )}
          </select>
          <ChevronDown
            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "responsible" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
          {formErrors.responsible && (
            <p className="text-red-500 text-sm mt-1">{formErrors.responsible}</p>
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
            <option value="On Going">On Going</option>
            <option value="Achieved">Achieved</option>
            <option value="Not Achieved">Not Achieved</option>
            <option value="Modified">Modified</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "status" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Reminder Notification</label>
          <div className="grid grid-cols-3 gap-5">
            <div className="relative">
              <select
                name="reminder_date.day"
                value={formData.reminder_date.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("reminder_date.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "reminder_date.day"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
            <div className="relative">
              <select
                name="reminder_date.month"
                value={formData.reminder_date.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("reminder_date.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "reminder_date.month"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
            <div className="relative">
              <select
                name="reminder_date.year"
                value={formData.reminder_date.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("reminder_date.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                ${focusedDropdown === "reminder_date.year"
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
          <label className="add-training-label">Upload Attachments</label>
          <div className="flex">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
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
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              {formData.upload_attachment.name}
            </p>
          )}
          {!formData.upload_attachment && (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              No file chosen
            </p>
          )}
        </div>

        <div className="md:col-span-2 flex gap-4 justify-between">
          <div>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="request-correction-btn duration-200"
            >
              Save as Draft
            </button>
          </div>
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleListTargets}
              className="cancel-btn duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QmsAddTargets;