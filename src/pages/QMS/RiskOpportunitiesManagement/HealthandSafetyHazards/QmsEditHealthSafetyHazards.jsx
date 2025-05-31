import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import EditQmsManualSuccessModal from "./Modals/EditQmsManualSuccessModal";
import ProcessTypeModal from "./ProcessTypeModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsEditHealthSafetyHazards = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hazardDetails, setHazardDetails] = useState(null);
  const [corrections, setCorrections] = useState([]);
  const [processes, setProcesses] = useState([]); // New state for processes
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isProcessTypeModalOpen, setIsProcessTypeModalOpen] = useState(false);
  const [focusedDropdown, setFocusedDropdown] = useState(null);

  const [showEditManualSuccessModal, setShowEditManualSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    hazard_no: "",
    written_by: null,
    checked_by: null,
    approved_by: null,
    hazard_source: "",
    legal_requirement: "",
    level_of_risk: "",
    date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
      currentDay
    ).padStart(2, "0")}`,
    description: "",
    action: "",
    process_activity: "",
    send_notification_to_checked_by: false,
    send_email_to_checked_by: false,
    send_notification_to_approved_by: false,
    send_email_to_approved_by: false,
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    written_by: false,
    checked_by: false,
    approved_by: false,
    level_of_risk: false,
    day: false,
    month: false,
    year: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    written_by: "",
    checked_by: "",
    hazard_source: "",
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
    if (hazardDetails) {
      setFormData({
        title: hazardDetails.title || "",
        hazard_no: hazardDetails.hazard_no || "",
        written_by: hazardDetails.written_by?.id || null,
        checked_by: hazardDetails.checked_by?.id || null,
        approved_by: hazardDetails.approved_by?.id || null,
        hazard_source: hazardDetails.hazard_source || "",
        legal_requirement: hazardDetails.legal_requirement || "",
        level_of_risk: hazardDetails.level_of_risk || "",
        date: hazardDetails.date || formData.date,
        description: hazardDetails.description || "",
        action: hazardDetails.action || "",
        process_activity: hazardDetails.process_activity || "",
        send_notification_to_checked_by:
          hazardDetails.send_notification_to_checked_by || false,
        send_email_to_checked_by:
          hazardDetails.send_email_to_checked_by || false,
        send_notification_to_approved_by:
          hazardDetails.send_notification_to_approved_by || false,
        send_email_to_approved_by:
          hazardDetails.send_email_to_approved_by || false,
      });
    }
  }, [hazardDetails]);

  useEffect(() => {
    if (companyId) {
      fetchUsers();
      fetchProcess(); // Fetch processes on mount
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId && id) {
      fetchHazardDetails();
      fetchHazardCorrections();
    }
  }, [companyId, id]);

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
        setError("Unable to load users");
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
      setUsers([]);
    }
  };

  const fetchProcess = async () => {
    setLoading(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/qms/health-root/company/${companyId}/`
      );
      if (Array.isArray(response.data)) {
        setProcesses(response.data); // Store fetched processes
        console.log("Processes loaded:", response.data);
      } else {
        setProcesses([]);
        console.error(
          "Unexpected response format for processes:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching process:", error);
      setError("Failed to load process. Please try again.");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchHazardDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/qms/health-detail/${id}/`);
      setHazardDetails(response.data);
      setIsInitialLoad(false);
      console.log("Hazard Details:", response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching hazard details:", err);
      setError("Failed to load hazard details");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      setIsInitialLoad(false);
      setLoading(false);
    }
  };

  const fetchHazardCorrections = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/qms/health/${id}/corrections/`
      );
      setCorrections(response.data);
      console.log("Fetched Hazard Corrections:", response.data);
    } catch (error) {
      console.error("Error fetching hazard corrections:", error);
    }
  };

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

  const riskLevel = ["High", "Medium", "Low"];

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
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

  const handleOpenProcessTypeModal = () => {
    setIsProcessTypeModalOpen(true);
  };

  const handleCloseProcessTypeModal = (newProcessAdded = false) => {
    setIsProcessTypeModalOpen(false);
    if (newProcessAdded) {
      fetchProcess(); // Refresh processes if a new one was added
    }
  };

  const handleListHealthSafetyHazards = () => {
    navigate("/company/qms/list-health-safety-hazards");
  };

  const handleCancelClick = () => {
    navigate("/company/qms/list-health-safety-hazards");
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...fieldErrors };

    if (!formData.written_by) {
      newErrors.written_by = "Written/Prepare By is required";
      isValid = false;
    }

    if (!formData.checked_by) {
      newErrors.checked_by = "Checked/Reviewed By is required";
      isValid = false;
    }

    if (!formData.hazard_source) {
      newErrors.hazard_source = "Hazard Source is required";
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleUpdateClick = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      setLoading(true);

      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("company", companyId);

      const apiFormData = {
        ...formData,
        send_system_checked: formData.send_notification_to_checked_by
          ? "Yes"
          : "No",
        send_email_checked: formData.send_email_to_checked_by ? "Yes" : "No",
        send_system_approved: formData.send_notification_to_approved_by
          ? "Yes"
          : "No",
        send_email_approved: formData.send_email_to_approved_by ? "Yes" : "No",
      };

      if (formData.approved_by === null || formData.approved_by === "") {
        submitData.append("approved_by", "");
      } else {
        submitData.append("approved_by", formData.approved_by);
      }

      Object.keys(apiFormData).forEach((key) => {
        if (
          key !== "send_notification_to_checked_by" &&
          key !== "send_email_to_checked_by" &&
          key !== "send_notification_to_approved_by" &&
          key !== "send_email_to_approved_by" &&
          key !== "approved_by"
        ) {
          submitData.append(key, apiFormData[key]);
        }
      });

      const response = await axios.put(
        `${BASE_URL}/qms/health/${id}/update/`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      setShowEditManualSuccessModal(true);
      setTimeout(() => {
        setShowEditManualSuccessModal(false);
        navigate("/company/qms/list-health-safety-hazards");
      }, 2000);
    } catch (err) {
      setLoading(false);
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
      console.error("Error updating hazard:", err);
    }
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

  const formatUserName = (user) => {
    return `${user.first_name} ${user.last_name}`;
  };

  const errorTextClass = "text-red-500 text-sm mt-1";

  return (
    <div className="bg-[#1C1C24] rounded-lg text-white">
      <div>
        <div className="flex items-center justify-between px-[65px] 2xl:px-[122px]">
          <h1 className="add-manual-sections !px-0">
            Edit Health and Safety Hazards
          </h1>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleListHealthSafetyHazards}
          >
            <span>List Health and Safety Hazards</span>
          </button>
        </div>

        <EditQmsManualSuccessModal
          showEditManualSuccessModal={showEditManualSuccessModal}
          onClose={() => {
            setShowEditManualSuccessModal(false);
          }}
        />

        <ErrorModal
          showErrorModal={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          error={error}
        />

        <ProcessTypeModal
          isOpen={isProcessTypeModalOpen}
          onClose={handleCloseProcessTypeModal}
        />

        <div className="border-t border-[#383840] mx-[18px] pt-[22px] px-[47px] 2xl:px-[104px]">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="add-qms-manual-label">Hazard Name/Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
            </div>

            <div>
              <label className="add-qms-manual-label">
                Written/Prepare By <span className="text-red-500">*</span>
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

            <div>
              <label className="add-qms-manual-label">Hazard No</label>
              <input
                type="text"
                name="hazard_no"
                value={formData.hazard_no}
                className="w-full add-qms-manual-inputs cursor-not-allowed bg-gray-800"
                readOnly
              />
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
                      setOpenDropdowns((prev) => ({
                        ...prev,
                        checked_by: false,
                      }))
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
              <label className="add-qms-manual-label">
                Hazard Source <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hazard_source"
                value={formData.hazard_source}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
              {fieldErrors.hazard_source && (
                <p className={errorTextClass}>{fieldErrors.hazard_source}</p>
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

            <div>
              <label className="add-qms-manual-label">
                Applicable Legal Requirement
              </label>
              <input
                type="text"
                name="legal_requirement"
                value={formData.legal_requirement}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
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
              <label className="add-qms-manual-label">Hazard Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs !h-[98px] py-2"
              />
            </div>

            <div>
              <label className="add-qms-manual-label">Level of Risk</label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="level_of_risk"
                  value={formData.level_of_risk}
                  onFocus={() => toggleDropdown("level_of_risk")}
                  onChange={(e) => handleDropdownChange(e, "level_of_risk")}
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({
                      ...prev,
                      level_of_risk: false,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Level of Risk
                  </option>
                  {riskLevel.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.level_of_risk ? "rotate-180" : ""
                  }`}
                />
              </div>
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

            <div className="flex flex-col gap-3 relative">
              <label className="add-training-label">
                Related Process/Activity
              </label>
              <select
                name="process_activity"
                value={formData.process_activity}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("process_activity")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  Select Related Process/Activity Type
                </option>
                {processes.map((process) => (
                  <option key={process.id} value={process.id}>
                    {process.title}
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
          </div>

          <div className="flex items-center mt-[22px] justify-end">
            <div className="flex gap-[22px] mb-6">
              <button
                className="cancel-btn duration-200"
                onClick={handleCancelClick}
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

export default QmsEditHealthSafetyHazards;
