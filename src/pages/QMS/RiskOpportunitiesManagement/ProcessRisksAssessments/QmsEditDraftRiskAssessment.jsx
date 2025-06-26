import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import SuccessModal from "../../../../components/Modals/SuccessModal";
import ErrorModal from "../../../../components/Modals/ErrorModal";

const QmsEditDraftRiskAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [formData, setFormData] = useState({
    activity: "",
    hazard: "",
    risk_likelihood: "",
    risk_severity: "",
    owner: "",
    date: "",
    residual_likelihood: "",
    residual_severity: "",
    remarks: "",
  });

  const [dateParts, setDateParts] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [riskFields, setRiskFields] = useState([{ id: 1, name: "" }]);
  const [controlMeasureFields, setControlMeasureFields] = useState([{ id: 1, name: "" }]);
  const [requiredControlMeasureFields, setRequiredControlMeasureFields] = useState([{ id: 1, name: "" }]);
  const [users, setUsers] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({
    risk_likelihood: false,
    risk_severity: false,
    owner: false,
    residual_likelihood: false,
    residual_severity: false,
    day: false,
    month: false,
    year: false,
  });
  const [errors, setErrors] = useState({});
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  // New state for modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

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

  // Fetch existing risk assessment data
  useEffect(() => {
    const fetchRiskAssessmentData = async () => {
      if (!id) return;

      try {
        setIsLoadingData(true);
        const response = await axios.get(`${BASE_URL}/qms/process-risk-assessment/${id}/`);
        const data = response.data;

        setFormData({
          activity: data.activity || "",
          hazard: data.hazard || "",
          risk_likelihood: data.risk_likelihood || "",
          risk_severity: data.risk_severity || "",
          owner: typeof data.owner === 'object' && data.owner ? data.owner.id : data.owner || "",
          date: data.date || "",
          residual_likelihood: data.residual_likelihood || "",
          residual_severity: data.residual_severity || "",
          remarks: data.remarks || "",
        });

        if (data.date) {
          const dateObj = new Date(data.date);
          setDateParts({
            day: dateObj.getDate(),
            month: dateObj.getMonth() + 1,
            year: dateObj.getFullYear(),
          });
        }

        if (data.risks && data.risks.length > 0) {
          setRiskFields(data.risks.map((risk, index) => ({
            id: index + 1,
            name: risk.name || ""
          })));
        }

        if (data.control_risks && data.control_risks.length > 0) {
          setControlMeasureFields(data.control_risks.map((control, index) => ({
            id: index + 1,
            name: control.name || ""
          })));
        }

        if (data.required_control_risks && data.required_control_risks.length > 0) {
          setRequiredControlMeasureFields(data.required_control_risks.map((required, index) => ({
            id: index + 1,
            name: required.name || ""
          })));
        }

      } catch (error) {
        console.error("Error fetching risk assessment data:", error);
        setErrors({ non_field_errors: "Failed to load risk assessment data" });
        setShowErrorModal(true);
        setErrorMessage("Failed to load risk assessment data");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchRiskAssessmentData();
  }, [id]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const companyId = getUserCompanyId();
        const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrors({ non_field_errors: "Failed to load users" });
        setShowErrorModal(true);
        setErrorMessage("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  // Update formData.date whenever dateParts changes
  useEffect(() => {
    const { day, month, year } = dateParts;
    if (day && month && year) {
      try {
        const newDate = new Date(year, month - 1, day);
        if (!isNaN(newDate.getTime())) {
          const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          setFormData((prev) => ({ ...prev, date: formattedDate }));
          setErrors((prev) => ({ ...prev, date: "" }));
        } else {
          setFormData((prev) => ({ ...prev, date: "" }));
          setErrors((prev) => ({ ...prev, date: "Invalid date" }));
        }
      } catch (error) {
        setFormData((prev) => ({ ...prev, date: "" }));
        setErrors((prev) => ({ ...prev, date: "Invalid date" }));
      }
    } else if (!day && !month && !year) {
      setFormData((prev) => ({ ...prev, date: "" }));
    }
  }, [dateParts]);

  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(dateParts.month, dateParts.year) }, (_, i) => i + 1),
    [dateParts.month, dateParts.year]
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  const riskScaleOptions = [1, 2, 3, 4, 5];

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRiskFieldChange = (id, name) => {
    setRiskFields(
      riskFields.map((field) =>
        field.id === id ? { ...field, name } : field
      )
    );
  };

  const handleControlMeasureFieldChange = (id, name) => {
    setControlMeasureFields(
      controlMeasureFields.map((field) =>
        field.id === id ? { ...field, name } : field
      )
    );
  };

  const handleRequiredControlMeasureFieldChange = (id, name) => {
    setRequiredControlMeasureFields(
      requiredControlMeasureFields.map((field) =>
        field.id === id ? { ...field, name } : field
      )
    );
  };

  const addRiskField =

 () => {
    const newId =
      riskFields.length > 0
        ? Math.max(...riskFields.map((f) => f.id)) + 1
        : 1;
    setRiskFields([...riskFields, { id: newId, name: "" }]);
  };

  const addControlMeasureField = () => {
    const newId =
      controlMeasureFields.length > 0
        ? Math.max(...controlMeasureFields.map((f) => f.id)) + 1
        : 1;
    setControlMeasureFields([...controlMeasureFields, { id: newId, name: "" }]);
  };

  const addRequiredControlMeasureField = () => {
    const newId =
      requiredControlMeasureFields.length > 0
        ? Math.max(...requiredControlMeasureFields.map((f) => f.id)) + 1
        : 1;
    setRequiredControlMeasureFields([...requiredControlMeasureFields, { id: newId, name: "" }]);
  };

  const removeRiskField = (id) => {
    if (riskFields.length > 1) {
      setRiskFields(riskFields.filter((field) => field.id !== id));
    }
  };

  const removeControlMeasureField = (id) => {
    if (controlMeasureFields.length > 1) {
      setControlMeasureFields(controlMeasureFields.filter((field) => field.id !== id));
    }
  };

  const removeRequiredControlMeasureField = (id) => {
    if (requiredControlMeasureFields.length > 1) {
      setRequiredControlMeasureFields(requiredControlMeasureFields.filter((field) => field.id !== id));
    }
  };

  const handleDropdownFieldChange = (value, dropdown) => {
    if (dropdown === "day" || dropdown === "month" || dropdown === "year") {
      setDateParts((prev) => ({
        ...prev,
        [dropdown]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [dropdown]: value,
      }));

      if (errors[dropdown]) {
        setErrors((prev) => ({
          ...prev,
          [dropdown]: "",
        }));
      }
    }

    setOpenDropdowns((prev) => ({ ...prev, [dropdown]: false }));
  };

  const handleNavigateToRiskAssessmentList = () => {
    navigate("/company/qms/draft-process-risks-assessments");
  };

  const getMonthName = (monthNum) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return monthNames[monthNum - 1] || "";
  };

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <div className="text-red-500 text-sm mt-1">{message}</div>;
  };

  const prepareSubmissionData = () => {
    const submissionData = {
      ...formData,
      user: getRelevantUserId(),
      company: getUserCompanyId(),
      risks: riskFields.filter(field => field.name.trim()).map(field => ({ name: field.name })),
      control_risks: controlMeasureFields.filter(field => field.name.trim()).map(field => ({ name: field.name })),
      required_control_risks: requiredControlMeasureFields.filter(field => field.name.trim()).map(field => ({ name: field.name })),
    };

    if (typeof submissionData.owner === 'object' && submissionData.owner && submissionData.owner.id) {
      submissionData.owner = submissionData.owner.id;
    }

    return submissionData;
  };

  const handleSave = async () => {
    setIsSaveLoading(true);
    try {
      const { day, month, year } = dateParts;
      if (!day || !month || !year) {
        setErrors((prev) => ({ ...prev, date: "Please select a valid date" }));
        setIsSaveLoading(false);
        return;
      }

      const submissionData = {
        ...prepareSubmissionData(),
        is_draft: false,
      };

      const response = await axios.put(
        `${BASE_URL}/qms/process-risk-assessment/${id}/`,
        submissionData
      );

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        handleNavigateToRiskAssessmentList();
      }, 2000); // Auto-close after 2 seconds
    } catch (error) {
      console.error("Error updating risk assessment:", error);
      let errorMsg = "Failed to update risk assessment";
      if (error.response?.data) {
        setErrors(error.response.data);
        errorMsg = Object.values(error.response.data).flat().join(", ") || errorMsg;
      }
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    handleNavigateToRiskAssessmentList();
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  if (isLoadingData) {
    return (
      <div className="bg-[#1C1C24] rounded-lg not-found flex items-center justify-center p-5">
        <div>Loading Risk Assessment Data...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] rounded-lg text-white">
      <div>
        <div className="flex items-center justify-between px-[65px] 2xl:px-[122px]">
          <h1 className="add-manual-sections !px-0">Edit Risk Assessment</h1>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleNavigateToRiskAssessmentList}
          >
            <span>List Risk Assessment</span>
          </button>
        </div>

        <div className="border-t border-[#383840] mx-[18px] pt-[22px] px-[47px] 2xl:px-[104px]">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="add-qms-manual-label">Activity</label>
              <input
                type="text"
                name="activity"
                value={formData.activity}
                onChange={handleFormFieldChange}
                className="w-full add-qms-manual-inputs"
              />
              <ErrorMessage message={errors.activity} />
            </div>

            <div>
              <label className="add-qms-manual-label">Hazard</label>
              <input
                type="text"
                name="hazard"
                value={formData.hazard}
                onChange={handleFormFieldChange}
                className="w-full add-qms-manual-inputs"
              />
              <ErrorMessage message={errors.hazard} />
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-qms-manual-label">Risk(s)</label>
              {riskFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          handleRiskFieldChange(field.id, e.target.value)
                        }
                        className="add-qms-manual-inputs focus:outline-none flex-1 !mt-0"
                      />
                      {index === riskFields.length - 1 ? (
                        <button
                          type="button"
                          onClick={addRiskField}
                          className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                        >
                          <Plus className="text-white" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeRiskField(field.id)}
                          className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                        >
                          <X className="text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <ErrorMessage message={errors.risks} />
            </div>

            <div>
              <label className="add-qms-manual-label">Risk Assessment</label>
              <div className="flex space-x-5">
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="risk_likelihood"
                    value={formData.risk_likelihood}
                    onFocus={() => toggleDropdown("risk_likelihood")}
                    onChange={(e) => handleDropdownFieldChange(e.target.value, "risk_likelihood")}
                    onBlur={() => setOpenDropdowns((prev) => ({ ...prev, risk_likelihood: false }))}
                  >
                    <option value="" disabled>
                      Likelihood
                    </option>
                    {riskScaleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.risk_likelihood ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="risk_severity"
                    value={formData.risk_severity}
                    onFocus={() => toggleDropdown("risk_severity")}
                    onChange={(e) => handleDropdownFieldChange(e.target.value, "risk_severity")}
                    onBlur={() => setOpenDropdowns((prev) => ({ ...prev, risk_severity: false }))}
                  >
                    <option value="" disabled>
                      Severity
                    </option>
                    {riskScaleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.risk_severity ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <ErrorMessage message={errors.risk_likelihood} />
              <ErrorMessage message={errors.risk_severity} />
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-qms-manual-label">Control Measures</label>
              {controlMeasureFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          handleControlMeasureFieldChange(field.id, e.target.value)
                        }
                        className="add-qms-manual-inputs focus:outline-none flex-1 !mt-0"
                      />
                      {index === controlMeasureFields.length - 1 ? (
                        <button
                          type="button"
                          onClick={addControlMeasureField}
                          className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                        >
                          <Plus className="text-white" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeControlMeasureField(field.id)}
                          className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                        >
                          <X className="text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <ErrorMessage message={errors.control_measures} />
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-qms-manual-label">Required Control Measures</label>
              {requiredControlMeasureFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) =>
                          handleRequiredControlMeasureFieldChange(field.id, e.target.value)
                        }
                        className="add-qms-manual-inputs focus:outline-none flex-1 !mt-0"
                      />
                      {index === requiredControlMeasureFields.length - 1 ? (
                        <button
                          type="button"
                          onClick={addRequiredControlMeasureField}
                          className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                        >
                          <Plus className="text-white" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeRequiredControlMeasureField(field.id)}
                          className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                        >
                          <X className="text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <ErrorMessage message={errors.required_control_measures} />
            </div>

            <div>
              <label className="add-qms-manual-label">Action Owner</label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="owner"
                  value={formData.owner}
                  onFocus={() => toggleDropdown("owner")}
                  onChange={(e) => handleDropdownFieldChange(e.target.value, "owner")}
                  onBlur={() => setOpenDropdowns((prev) => ({ ...prev, owner: false }))}
                >
                  <option value="" disabled>
                    Select Action Owner
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.owner ? "rotate-180" : ""
                  }`}
                />
              </div>
              <ErrorMessage message={errors.owner} />
            </div>

            <div>
              <label className="add-qms-manual-label">Residual Risk</label>
              <div className="flex space-x-5">
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="residual_likelihood"
                    value={formData.residual_likelihood}
                    onFocus={() => toggleDropdown("residual_likelihood")}
                    onChange={(e) => handleDropdownFieldChange(e.target.value, "residual_likelihood")}
                    onBlur={() => setOpenDropdowns((prev) => ({ ...prev, residual_likelihood: false }))}
                  >
                    <option value="" disabled>
                      Likelihood
                    </option>
                    {riskScaleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.residual_likelihood ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="residual_severity"
                    value={formData.residual_severity}
                    onFocus={() => toggleDropdown("residual_severity")}
                    onChange={(e) => handleDropdownFieldChange(e.target.value, "residual_severity")}
                    onBlur={() => setOpenDropdowns((prev) => ({ ...prev, residual_severity: false }))}
                  >
                    <option value="" disabled>
                      Severity
                    </option>
                    {riskScaleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.residual_severity ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <ErrorMessage message={errors.residual_likelihood} />
              <ErrorMessage message={errors.residual_severity} />
            </div>

            <div>
              <label className="add-qms-manual-label">Review Date</label>
              <div className="flex space-x-5">
                <div className="relative w-1/3">
                  <select
                    className="w-full appearance-none add-qms-manual-inputs cursor-pointer"
                    value={dateParts.day || ""}
                    onFocus={() => toggleDropdown("day")}
                    onChange={(e) => {
                      handleDropdownFieldChange(e.target.value, "day");
                    }}
                    onBlur={() => setOpenDropdowns((prev) => ({ ...prev, day: false }))}
                  >
                    <option value="" disabled>dd</option>
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
                    className="w-full appearance-none add-qms-manual-inputs cursor-pointer"
                    value={dateParts.month || ""}
                    onFocus={() => toggleDropdown("month")}
                    onChange={(e) => {
                      handleDropdownFieldChange(e.target.value, "month");
                    }}
                    onBlur={() => setOpenDropdowns((prev) => ({ ...prev, month: false }))}
                  >
                    <option value="" disabled>
                      mm
                    </option>
                    {months.map((month) => (
                      <option key={`month-${month}`} value={month}>
                        {month < 10 ? `0${month}` : month} - {getMonthName(month).substring(0, 3)}
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
                    className="w-full appearance-none add-qms-manual-inputs cursor-pointer"
                    value={dateParts.year || ""}
                    onFocus={() => toggleDropdown("year")}
                    onChange={(e) => {
                      handleDropdownFieldChange(e.target.value, "year");
                    }}
                    onBlur={() => setOpenDropdowns((prev) => ({ ...prev, year: false }))}
                  >
                    <option value="" disabled>
                      yyyy
                    </option>
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
              <ErrorMessage message={errors.date} />
            </div>

            <div>
              <label className="add-qms-manual-label">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleFormFieldChange}
                className="w-full add-qms-manual-inputs"
              />
              <ErrorMessage message={errors.remarks} />
            </div>

            <div></div>
            <div>
              <div className="flex gap-[22px] mb-6 justify-end">
                <button
                  className="cancel-btn duration-200"
                  onClick={handleNavigateToRiskAssessmentList}
                >
                  Cancel
                </button>
                <button
                  className="save-btn duration-200"
                  onClick={handleSave}
                  disabled={isSaveLoading}
                >
                  {isSaveLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-[22px] justify-between"></div>
        </div>
      </div>

      {/* Modals */}
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onClose={handleCloseSuccessModal}
        successMessage="Risk Assessment Updated Successfully"
      />
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={handleCloseErrorModal}
        error={errorMessage}
      />
    </div>
  );
};

export default QmsEditDraftRiskAssessment;