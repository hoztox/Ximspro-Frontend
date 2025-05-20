import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const QmsEditPreventiveActions = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    executor: "",
    description: "",
    action: "",
    date_raised: null,
    date_completed: null,
    status: "Pending",
    is_draft: false,
    send_notification: false,
  });

  const [dateRaised, setDateRaised] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [dateCompleted, setDateCompleted] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const fetchPreventiveAction = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/preventive-get/${id}/`
        );
        const data = response.data;

        setFormData({
          title: data.title || "",
          executor: data.executor?.id || "",
          description: data.description || "",
          action: data.action || "",
          date_raised: data.date_raised,
          date_completed: data.date_completed,
          status: data.status || "Pending",
          is_draft: data.is_draft || false,
          send_notification: data.send_notification || false,
        });

        if (data.date_raised) {
          const dateParts = data.date_raised.split("-");
          setDateRaised({
            year: dateParts[0],
            month: dateParts[1].startsWith("0")
              ? dateParts[1].substring(1)
              : dateParts[1],
            day: dateParts[2].startsWith("0")
              ? dateParts[2].substring(1)
              : dateParts[2],
          });
        }

        if (data.date_completed) {
          const dateParts = data.date_completed.split("-");
          setDateCompleted({
            year: dateParts[0],
            month: dateParts[1].startsWith("0")
              ? dateParts[1].substring(1)
              : dateParts[1],
            day: dateParts[2].startsWith("0")
              ? dateParts[2].substring(1)
              : dateParts[2],
          });
        }

        const usersResponse = await axios.get(
          `${BASE_URL}/company/users-active/${companyId}/`
        );
        setUsers(usersResponse.data);

        setLoading(false);
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
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    if (id) {
      fetchPreventiveAction();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleListPreventiveActions = () => {
    navigate("/company/qms/list-preventive-actions");
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

      if (parent === "date_raised") {
        const newDateRaised = {
          ...dateRaised,
          [child]: value,
        };
        setDateRaised(newDateRaised);

        if (newDateRaised.day && newDateRaised.month && newDateRaised.year) {
          const formattedDate = `${
            newDateRaised.year
          }-${newDateRaised.month.padStart(
            2,
            "0"
          )}-${newDateRaised.day.padStart(2, "0")}`;
          setFormData({
            ...formData,
            date_raised: formattedDate,
          });
        }
      } else if (parent === "date_completed") {
        const newDateCompleted = {
          ...dateCompleted,
          [child]: value,
        };
        setDateCompleted(newDateCompleted);

        if (
          newDateCompleted.day &&
          newDateCompleted.month &&
          newDateCompleted.year
        ) {
          const formattedDate = `${
            newDateCompleted.year
          }-${newDateCompleted.month.padStart(
            2,
            "0"
          )}-${newDateCompleted.day.padStart(2, "0")}`;
          setFormData({
            ...formData,
            date_completed: formattedDate,
          });
        }
      }
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
      const submissionData = {
        ...formData,
        company: companyId,
      };
      const response = await axios.put(
        `${BASE_URL}/qms/preventive-actions/${id}/edit/`,
        submissionData
      );

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-preventive-actions");
      }, 1500);
      setSuccessMessage("Preventive Action Updated Successfully");
    } catch (err) {
      console.error("Error submitting form:", err);
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

  const generateOptions = (start, end, prefix = "") => {
    const options = [];
    for (let i = start; i <= end; i++) {
      const value = i < 10 ? `${i}` : `${i}`;
      const displayValue = i < 10 ? `0${i}` : `${i}`;
      options.push(
        <option key={i} value={value}>
          {prefix}
          {displayValue}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Preventive Action</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={handleListPreventiveActions}
        >
          List Preventive Action
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="not-found">Loading...</p>
        </div>
      ) : (
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
                  value={dateRaised.day}
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
                  value={dateRaised.month}
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
                  value={dateRaised.year}
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
                  value={dateCompleted.day}
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
                  value={dateCompleted.month}
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
                  value={dateCompleted.year}
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
                onClick={handleListPreventiveActions}
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
      )}
    </div>
  );
};

export default QmsEditPreventiveActions;
