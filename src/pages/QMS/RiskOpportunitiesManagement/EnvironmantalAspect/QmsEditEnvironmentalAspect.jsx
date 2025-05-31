import React, { useState, useEffect } from "react";
import { ChevronDown, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import ProcessTypeModal from "./ProcessTypeModal";
import SuccessModal from "./Modals/SuccessModal";
import ErrorModal from "./Modals/ErrorModal";

const QmsEditEnvironmentalAspect = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [users, setUsers] = useState([]);
  const [processActivities, setProcessActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [isProcessTypeModalOpen, setIsProcessTypeModalOpen] = useState(false);
  const [corrections, setCorrections] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [environmentalAspectDetails, setEnvironmentalAspectDetails] =
    useState(null);

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

  const companyId = getUserCompanyId();

  const [formData, setFormData] = useState({
    aspect_source: "",
    title: "",
    aspect_no: "",
    process_activity: "",
    legal_requirement: "",
    description: "",
    action: "",
    send_notification_to_checked_by: false,
    send_email_to_checked_by: false,
    send_notification_to_approved_by: false,
    send_email_to_approved_by: false,
    date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
      currentDay
    ).padStart(2, "0")}`,
    level_of_impact: "",
    written_by: "",
    checked_by: "",
    approved_by: "",
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    written_by: false,
    checked_by: false,
    approved_by: false,
    level_of_impact: false,
    day: false,
    month: false,
    year: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    written_by: "",
    checked_by: "",
  });

  const fetchEnvironmentalAspect = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/qms/aspect-detail/${id}/`);
      const data = response.data;
      setEnvironmentalAspectDetails(data);

      const formattedDate = data.date
        ? data.date
        : `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
            currentDay
          ).padStart(2, "0")}`;

      setFormData({
        aspect_source: data.aspect_source || "",
        title: data.title || "",
        aspect_no: data.aspect_no || "",
        process_activity: data.process_activity?.id || "",
        legal_requirement: data.legal_requirement || "",
        description: data.description || "",
        action: data.action || "",
        send_notification_to_checked_by:
          data.send_notification_to_checked_by !== undefined
            ? data.send_notification_to_checked_by
            : false,
        send_email_to_checked_by:
          data.send_email_to_checked_by !== undefined
            ? data.send_email_to_checked_by
            : false,
        send_notification_to_approved_by:
          data.send_notification_to_approved_by !== undefined
            ? data.send_notification_to_approved_by
            : false,
        send_email_to_approved_by:
          data.send_email_to_approved_by !== undefined
            ? data.send_email_to_approved_by
            : false,
        date: formattedDate,
        level_of_impact: data.level_of_impact || "",
        written_by: data.written_by?.id || "",
        checked_by: data.checked_by?.id || "",
        approved_by: data.approved_by?.id || "",
      });
      setIsInitialLoad(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching environmental aspect:", error);
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
      setIsInitialLoad(false);
      setLoading(false);
    }
  };

  const fetchManualCorrections = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/qms/aspect/${id}/corrections/`
      );
      setCorrections(response.data);
      console.log("Fetched Manual Corrections:", response.data);
    } catch (error) {
      console.error("Error fetching manual corrections:", error);
    }
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

  const fetchProcessActivities = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/qms/process-activity/company/${companyId}/`
      );
      setProcessActivities(response.data);
    } catch (error) {
      console.error("Error fetching process activities:", error);
      setError("Failed to load process activities.");
    }
  };

  useEffect(() => {
    if (companyId && id) {
      fetchUsers();
      fetchEnvironmentalAspect();
      fetchManualCorrections();
      fetchProcessActivities();
    }
  }, [companyId, id]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const parseDate = () => {
    const dateObj = new Date(formData.date);
    return {
      day: dateObj.getDate(),
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear(),
    };
  };

  const dateParts = parseDate();

  const days = Array.from(
    { length: getDaysInMonth(dateParts.month, dateParts.year) },
    (_, i) => i + 1
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const impactLevels = ["Significant", "Non Significant"];

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...fieldErrors };

    if (!formData.title.trim()) {
      newErrors.title = "Aspect Name/Title is required";
      isValid = false;
    }

    if (!formData.written_by) {
      newErrors.written_by = "Written/Prepared By is required";
      isValid = false;
    }

    if (!formData.checked_by) {
      newErrors.checked_by = "Checked/Reviewed By is required";
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleOpenProcessTypeModal = () => {
    setIsProcessTypeModalOpen(true);
  };

  const handleCloseProcessTypeModal = (newProcessAdded = false) => {
    setIsProcessTypeModalOpen(false);
    if (newProcessAdded) {
      fetchProcessActivities();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDropdownChange = (e, dropdown) => {
    const value = e.target.value;

    if (dropdown === "day" || dropdown === "month" || dropdown === "year") {
      const dateObj = parseDate();
      dateObj[dropdown] = parseInt(value, 10);
      const newDate = `${dateObj.year}-${String(dateObj.month).padStart(
        2,
        "0"
      )}-${String(dateObj.day).padStart(2, "0")}`;
      setFormData((prev) => ({
        ...prev,
        date: newDate,
      }));
    } else {
      const newValue = value === "" ? null : value;
      setFormData((prev) => ({
        ...prev,
        [dropdown]: newValue,
      }));

      if (fieldErrors[dropdown]) {
        setFieldErrors((prev) => ({
          ...prev,
          [dropdown]: "",
        }));
      }
    }

    setOpenDropdowns((prev) => ({ ...prev, [dropdown]: false }));
  };

  const handleListEnvironmentalAspect = () => {
    navigate("/company/qms/list-environmantal-aspect");
  };

  const handleUpdateClick = async () => {
  if (!validateForm()) {
    setError('Please fill in all required fields');
    setShowErrorModal(true);
    setTimeout(() => setShowErrorModal(false), 3000);
    return;
  }
  try {
    setLoading(true);

    const companyId = getUserCompanyId();
    if (!companyId) {
      setError('Company ID not found. Please log in again.');
      setLoading(false);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      return;
    }

    const submitData = new FormData();
    submitData.append('company', companyId);

    // Convert boolean checkbox values to 'Yes'/'No' strings for API compatibility
    const apiFormData = {
      ...formData,
      send_system_checked: formData.send_notification_to_checked_by ? 'Yes' : 'No',
      send_email_checked: formData.send_email_to_checked_by ? 'Yes' : 'No',
      send_system_approved: formData.send_notification_to_approved_by ? 'Yes' : 'No',
      send_email_approved: formData.send_email_to_approved_by ? 'Yes' : 'No'
    };

    // Handle approved_by field - explicitly set to empty string if null
    if (formData.approved_by === null || formData.approved_by === "") {
      submitData.append("approved_by", "");
    } else {
      submitData.append("approved_by", formData.approved_by);
    }

    // Handle process_activity field
    if (formData.process_activity === null || formData.process_activity === "") {
      submitData.append("process_activity", "");
    } else {
      submitData.append("process_activity", formData.process_activity);
    }

    // Convert IDs to numbers
    apiFormData.written_by = parseInt(apiFormData.written_by, 10);
    apiFormData.checked_by = parseInt(apiFormData.checked_by, 10);

    // Add all other form data
    Object.keys(apiFormData).forEach(key => {
      if (
        key !== 'send_notification_to_checked_by' &&
        key !== 'send_email_to_checked_by' &&
        key !== 'send_notification_to_approved_by' &&
        key !== 'send_email_to_approved_by' &&
        key !== 'approved_by' && // Skip approved_by as we've handled it separately
        key !== 'process_activity' // Skip process_activity as we've handled it separately
      ) {
        submitData.append(key, apiFormData[key]);
      }
    });

    const response = await axios.put(
      `${BASE_URL}/qms/aspect/${id}/update/`,
      submitData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    setLoading(false);
    setSuccessMessage("Environmental Aspect Updated Successfully");
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate('/company/qms/list-environmantal-aspect');
    }, 1500);

  } catch (err) {
    setLoading(false);
    let errorMsg = err.message;

    if (err.response) {
      if (err.response.data.date) {
        errorMsg = err.response.data.date[0];
      }
      else if (err.response.data.detail) {
        errorMsg = err.response.data.detail;
      }
      else if (err.response.data.message) {
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
    console.error('Update error:', err);
  }
};

  const formatUserName = (user) => {
    if (!user) return "N/A";
    return `${user.first_name} ${user.last_name}`;
  };

  const getMonthName = (monthNum) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNum - 1];
  };

  const errorTextClass = "text-red-500 text-sm mt-1";

  return (
    <div className="bg-[#1C1C24] rounded-lg text-white p-5">
      <div className="flex justify-between items-center border-b border-[#383840] px-[124px] pb-5">
        <h1 className="add-training-head">Edit Environmental Aspect</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={handleListEnvironmentalAspect}
        >
          List Environmental Aspect
        </button>
      </div>

      <ProcessTypeModal
        isOpen={isProcessTypeModalOpen}
        onClose={handleCloseProcessTypeModal}
      />

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

      <div className="mx-[18px] pt-[22px] px-[47px] 2xl:px-[104px]">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="add-qms-manual-label">Aspect Source</label>
            <input
              type="text"
              name="aspect_source"
              value={formData.aspect_source}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs"
            />
          </div>

          <div>
            <label className="add-qms-manual-label">
              Aspect Name/Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs"
            />
            {fieldErrors.title && (
              <p className={errorTextClass}>{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label className="add-qms-manual-label">Aspect No</label>
            <input
              type="text"
              name="aspect_no"
              value={formData.aspect_no}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs cursor-not-allowed bg-gray-800"
              readOnly
            />
          </div>
          <div></div>

          <div className="flex flex-col gap-3 relative">
            <label className="add-training-label">Process/Activity</label>
            <select
              name="process_activity"
              value={formData.process_activity}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("process_activity")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
            >
              <option value="">Select Process/Activity</option>
              {processActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.title}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-[40%] transform transition-transform duration-300 
                            ${
                              focusedDropdown === "process_activity"
                                ? "rotate-180"
                                : ""
                            }`}
              size={20}
              color="#AAAAAA"
            />
            <button
              className="flex justify-start add-training-label !text-[#1E84AF]"
              onClick={handleOpenProcessTypeModal}
              type="button"
            >
              View / Add Process/Activities
            </button>
          </div>

          <div>
            <label className="add-qms-manual-label">Legal Requirement</label>
            <input
              type="text"
              name="legal_requirement"
              value={formData.legal_requirement}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs"
            />
          </div>
          <div>
            <label className="add-qms-manual-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs !h-[98px] py-2"
            />
          </div>

          <div>
            <label className="add-qms-manual-label">
              Action or Corrections
            </label>
            <textarea
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs !h-[98px] py-2"
            />
          </div>

          <div>
            <label className="add-qms-manual-label">
              Written/Prepared By <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                name="written_by"
                value={formData.written_by || ""}
                onFocus={() => toggleDropdown("written_by")}
                onChange={(e) => handleDropdownChange(e, "written_by")}
                onBlur={() =>
                  setOpenDropdowns((prev) => ({ ...prev, written_by: false }))
                }
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={`written-${user.id}`} value={user.id}>
                    {formatUserName(user)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                  openDropdowns.written_by ? "rotate-180" : ""
                }`}
              />
            </div>
            {fieldErrors.written_by && (
              <p className={errorTextClass}>{fieldErrors.written_by}</p>
            )}
          </div>

          <div className="flex">
            <div className="flex-grow">
              <div className="flex items-center justify-between h-[24px]">
                <label className="add-qms-manual-label">Approved By</label>
                <div className="flex items-end justify-end space-y-1">
                  <div className="ml-5 flex items-center h-[24px]">
                    <div className="flex items-center h-14 justify-center gap-2">
                      <input
                        type="checkbox"
                        name="send_notification_to_approved_by"
                        checked={formData.send_notification_to_approved_by}
                        onChange={handleCheckboxChange}
                        className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                      />
                      <label className="add-qms-manual-label check-label">
                        System Notify
                      </label>
                    </div>
                  </div>
                  <div className="ml-5 flex items-center h-[24px]">
                    <div className="flex items-center h-14 justify-center gap-2">
                      <input
                        type="checkbox"
                        name="send_email_to_approved_by"
                        checked={formData.send_email_to_approved_by}
                        onChange={handleCheckboxChange}
                        className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                      />
                      <label className="add-qms-manual-label check-label">
                        Email Notify
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="approved_by"
                  value={formData.approved_by || ""} 
                  onFocus={() => toggleDropdown("approved_by")}
                  onChange={(e) => handleDropdownChange(e, "approved_by")}
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({
                      ...prev,
                      approved_by: false,
                    }))
                  }
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={`approved-${user.id}`} value={user.id}>
                      {formatUserName(user)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.approved_by ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-grow">
              <div className="flex items-center justify-between h-[24px]">
                <label className="add-qms-manual-label">
                  Checked/Reviewed By <span className="text-red-500">*</span>
                </label>
                <div className="flex items-end justify-end space-y-1">
                  <div className="ml-5 flex items-center h-[24px]">
                    <div className="flex items-center h-14 justify-center gap-2">
                      <input
                        type="checkbox"
                        name="send_notification_to_checked_by"
                        checked={formData.send_notification_to_checked_by}
                        onChange={handleCheckboxChange}
                        className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                      />
                      <label className="add-qms-manual-label check-label">
                        System Notify
                      </label>
                    </div>
                  </div>
                  <div className="ml-5 flex items-center h-[24px]">
                    <div className="flex items-center h-14 justify-center gap-2">
                      <input
                        type="checkbox"
                        name="send_email_to_checked_by"
                        checked={formData.send_email_to_checked_by}
                        onChange={handleCheckboxChange}
                        className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                      />
                      <label className="add-qms-manual-label check-label">
                        Email Notify
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="checked_by"
                  value={formData.checked_by || ""}
                  onFocus={() => toggleDropdown("checked_by")}
                  onChange={(e) => handleDropdownChange(e, "checked_by")}
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({ ...prev, checked_by: false }))
                  }
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={`checked-${user.id}`} value={user.id}>
                      {formatUserName(user)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.checked_by ? "rotate-180" : ""
                  }`}
                />
              </div>
              {fieldErrors.checked_by && (
                <p className={errorTextClass}>{fieldErrors.checked_by}</p>
              )}
            </div>
          </div>

          <div>
            <label className="add-qms-manual-label">Date Entered</label>
            <div className="flex space-x-5">
              <div className="relative w-1/3">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  value={dateParts.day}
                  onFocus={() => toggleDropdown("day")}
                  onChange={(e) => handleDropdownChange(e, "day")}
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({ ...prev, day: false }))
                  }
                >
                  {days.map((day) => (
                    <option key={`day-${day}`} value={day}>
                      {day < 10 ? `0${day}` : day}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.day ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div className="relative w-1/3">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  value={dateParts.month}
                  onFocus={() => toggleDropdown("month")}
                  onChange={(e) => handleDropdownChange(e, "month")}
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({ ...prev, month: false }))
                  }
                >
                  {months.map((month) => (
                    <option key={`month-${month}`} value={month}>
                      {month < 10 ? `0${month}` : month} -{" "}
                      {getMonthName(month).substring(0, 3)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.month ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div className="relative w-1/3">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  value={dateParts.year}
                  onFocus={() => toggleDropdown("year")}
                  onChange={(e) => handleDropdownChange(e, "year")}
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({ ...prev, year: false }))
                  }
                >
                  {years.map((year) => (
                    <option key={`year-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.year ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="add-qms-manual-label">Level of Impact</label>
            <div className="relative">
              <select
                className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                name="level_of_impact"
                value={formData.level_of_impact}
                onFocus={() => toggleDropdown("level_of_impact")}
                onChange={(e) => handleDropdownChange(e, "level_of_impact")}
                onBlur={() =>
                  setOpenDropdowns((prev) => ({
                    ...prev,
                    level_of_impact: false,
                  }))
                }
              >
                <option value="">Select Level of Impact</option>
                {impactLevels.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                  openDropdowns.level_of_impact ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          <div className="flex items-end mt-[22px] justify-end">
            <div className="flex gap-[22px]">
              <button
                className="cancel-btn duration-200"
                onClick={handleListEnvironmentalAspect}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="save-btn duration-200"
                onClick={handleUpdateClick}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsEditEnvironmentalAspect;
