import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BASE_URL } from "../../../../Utils/Config";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const QmsEditDraftPreventiveActions = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    executor: "",
    description: "",
    action: "",
    date_raised: {
      day: "",
      month: "",
      year: "",
    },
    date_completed: {
      day: "",
      month: "",
      year: "",
    },
    status: "",
    send_notification: false,
  });

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [formErrors, setFormErrors] = useState({
    title: "",
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const response = await axios.get(
            `${BASE_URL}/qms/preventive-get/${id}/`
          );
          const actionData = response.data;

          let dateRaised = { day: "", month: "", year: "" };
          if (actionData.date_raised) {
            const date = new Date(actionData.date_raised);
            dateRaised = {
              day: String(date.getDate()).padStart(2, "0"),
              month: String(date.getMonth() + 1).padStart(2, "0"),
              year: String(date.getFullYear()),
            };
          }

          let dateCompleted = { day: "", month: "", year: "" };
          if (actionData.date_completed) {
            const date = new Date(actionData.date_completed);
            dateCompleted = {
              day: String(date.getDate()).padStart(2, "0"),
              month: String(date.getMonth() + 1).padStart(2, "0"),
              year: String(date.getFullYear()),
            };
          }

          setFormData({
            title: actionData.title || "",
            executor: actionData.executor?.id || "",
            description: actionData.description || "",
            action: actionData.action || "",
            date_raised: dateRaised,
            date_completed: dateCompleted,
            status: actionData.status || "",
            send_notification: actionData.send_notification || false,
          });
        }

        const usersResponse = await axios.get(
          `${BASE_URL}/company/users-active/${companyId}/`
        );
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleListDraftPreventiveActions = () => {
    navigate("/company/qms/draft-preventive-actions");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
      return;
    }

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
      if (name === "title") {
        setFormErrors({
          ...formErrors,
          title: "",
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let formattedData = {
        title: formData.title,
        executor: formData.executor,
        description: formData.description,
        action: formData.action,
        status: formData.status,
        send_notification: formData.send_notification,
      };

      if (
        formData.date_raised.day &&
        formData.date_raised.month &&
        formData.date_raised.year
      ) {
        formattedData.date_raised = `${formData.date_raised.year}-${formData.date_raised.month}-${formData.date_raised.day}`;
      }

      if (
        formData.date_completed.day &&
        formData.date_completed.month &&
        formData.date_completed.year
      ) {
        formattedData.date_completed = `${formData.date_completed.year}-${formData.date_completed.month}-${formData.date_completed.day}`;
      }

      const response = await axios.put(
        `${BASE_URL}/qms/preventive-draft/edit/${id}/`,
        formattedData
      );

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-preventive-actions");
      }, 1500);
      setSuccessMessage("Preventive Action Saved Successfully");
    } catch (error) {
      console.error("Error saving preventive action:", error);
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

  if (isLoading) {
    return <div className="not-found text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Draft Preventive Action</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={handleListDraftPreventiveActions}
        >
          List Draft Preventive Action
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
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`add-training-inputs focus:outline-none ${
              formErrors.title ? "border-red-500" : ""
            }`}
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm">{formErrors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Executor</label>
          <select
            name="executor"
            value={formData.executor}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("executor")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              Select Executor
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
                             focusedDropdown === "executor" ? "rotate-180" : ""
                           }`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Problem Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Action</label>
          <textarea
            name="action"
            value={formData.action}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Date Raised</label>
          <div className="grid grid-cols-3 gap-5">
            <div className="relative">
              <select
                name="date_raised.day"
                value={formData.date_raised.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_raised.day")}
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
                                 focusedDropdown === "date_raised.day"
                                   ? "rotate-180"
                                   : ""
                               }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            <div className="relative">
              <select
                name="date_raised.month"
                value={formData.date_raised.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_raised.month")}
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
                                 focusedDropdown === "date_raised.month"
                                   ? "rotate-180"
                                   : ""
                               }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            <div className="relative">
              <select
                name="date_raised.year"
                value={formData.date_raised.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_raised.year")}
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
                                 focusedDropdown === "date_raised.year"
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
          <label className="add-training-label">Complete By</label>
          <div className="grid grid-cols-3 gap-5">
            <div className="relative">
              <select
                name="date_completed.day"
                value={formData.date_completed.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_completed.day")}
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
                                 focusedDropdown === "date_completed.day"
                                   ? "rotate-180"
                                   : ""
                               }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            <div className="relative">
              <select
                name="date_completed.month"
                value={formData.date_completed.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_completed.month")}
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
                                 focusedDropdown === "date_completed.month"
                                   ? "rotate-180"
                                   : ""
                               }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            <div className="relative">
              <select
                name="date_completed.year"
                value={formData.date_completed.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_completed.year")}
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
                                 focusedDropdown === "date_completed.year"
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
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[58%] transform transition-transform duration-300 
                           ${focusedDropdown === "status" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex items-end justify-end mt-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="send_notification"
              className="mr-2 form-checkboxes"
              checked={formData.send_notification}
              onChange={handleChange}
            />
            <span className="permissions-texts cursor-pointer">
              Send Notification
            </span>
          </label>
        </div>

        <div className="md:col-span-2 flex gap-4 justify-end">
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleListDraftPreventiveActions}
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

export default QmsEditDraftPreventiveActions;
