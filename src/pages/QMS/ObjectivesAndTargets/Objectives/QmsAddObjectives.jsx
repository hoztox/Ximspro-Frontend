import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsAddObjectives = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

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
  const [formErrors, setFormErrors] = useState({
    objective: "",
    responsible: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const [formData, setFormData] = useState({
    objective: "",
    indicator: "",
    performance: "",
    target_date: {
      day: "",
      month: "",
      year: "",
    },
    responsible: "",
    status: "On Going",
    reminder_date: {
      day: "",
      month: "",
      year: "",
    },
    is_draft: false,
  });

  const [focusedDropdown, setFocusedDropdown] = useState(null);

  const handleListObjectives = () => {
    navigate("/company/qms/list-objectives");
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
      if (name === "objective" || name === "responsible") {
        setFormErrors({
          ...formErrors,
          [name]: ""
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.objective.trim()) {
      errors.objective = "Objective is required";
      isValid = false;
    }

    if (!formData.responsible) {
      errors.responsible = "Responsible is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const   formatDate = (dateObj) => {
    if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const targetDate = formatDate(formData.target_date);
      const reminderDate = formatDate(formData.reminder_date);

      const submissionData = {
        company: companyId,
        user: userId,
        objective: formData.objective,
        indicator: formData.indicator,
        performance: formData.performance,
        target_date: targetDate,
        responsible: formData.responsible,
        status: formData.status,
        reminder_date: reminderDate,
        is_draft: false,
      };

      const response = await axios.post(
        `${BASE_URL}/qms/objectives/create/`,
        submissionData
      );

      console.log("Added Objective:", response.data);

      setIsLoading(false);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-objectives");
      }, 1500);
      setSuccessMessage("Objectives Added Successfully")
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
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
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const targetDate = formatDate(formData.target_date);
      const reminderDate = formatDate(formData.reminder_date);

      const submissionData = {
        company: companyId,
        user: userId,
        objective: formData.objective,
        indicator: formData.indicator,
        performance: formData.performance,
        target_date: targetDate,
        responsible: formData.responsible,
        status: formData.status,
        reminder_date: reminderDate,
        is_draft: true,
      };

      const response = await axios.post(
        `${BASE_URL}/qms/objectives/draft-create/`,
        submissionData
      );

      console.log("Saved as Draft:", response.data);

      setIsLoading(false);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/draft-objectives");
      }, 1500);
      setSuccessMessage("Objectives Drafted Successfully")
    } catch (error) {
      console.error("Error saving as draft:", error);
      setIsLoading(false);
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
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
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
        <h1 className="add-training-head">Add Objectives</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={() => handleListObjectives()}
        >
          List Objectives
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
            Objective <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            className={`add-training-inputs focus:outline-none ${formErrors.objective ? "border-red-500" : ""
              }`}
          />
          {formErrors.objective && (
            <p className="text-red-500 text-sm mt-1">{formErrors.objective}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Indicator</label>
          <input
            type="text"
            name="indicator"
            value={formData.indicator}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3 col-span-2">
          <label className="add-training-label">Performance</label>
          <textarea
            name="performance"
            value={formData.performance}
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
            className={`add-training-inputs appearance-none pr-10 cursor-pointer ${formErrors.responsible ? "border-red-500" : ""
              }`}
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
                        ${focusedDropdown === "responsible" ? "rotate-180" : ""
              }`}
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

        <div className="md:col-span-2 flex gap-4 justify-between pt-5">
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
              onClick={handleListObjectives}
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

export default QmsAddObjectives;