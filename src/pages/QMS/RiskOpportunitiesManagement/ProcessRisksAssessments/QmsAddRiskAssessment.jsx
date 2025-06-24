import React, { useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QmsAddRiskAssessment = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [formData, setFormData] = useState({
    activity: "",
    hazard: "",
    probability: "",
    benefit: "",
    action_owner: "",
    approved_by: "",
    status: "",
    date: "",
    review_frequency_year: "",
    review_frequency_month: "",
    remarks: "",
  });
  const [riskFields, setRiskFields] = useState([{ id: 1, value: "" }]);
  const [controlMeasureFields, setControlMeasureFields] = useState([{ id: 1, value: "" }]);
  const [requiredControlMeasureFields, setRequiredControlMeasureFields] = useState([{ id: 1, value: "" }]);
  const [openDropdowns, setOpenDropdowns] = useState({
    probability: false,
    benefit: false,
    action_owner: false,
    approved_by: false,
    status: false,
    day: false,
    month: false,
    year: false,
  });
  const [errors, setErrors] = useState({});
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaveDraftLoading, setIsSaveDraftLoading] = useState(false);

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  const parseDate = () => {
    if (!formData.date) {
      return { day: "", month: "", year: "" };
    }
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

  const ownersActionParties = [
    "Team A",
    "Team B",
    "Individual Contributor",
    "External Partner",
  ];

  const probabilityOptions = [""];
  const benefitOptions = [""];

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

  const handleRiskFieldChange = (id, value) => {
    setRiskFields(
      riskFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const handleControlMeasureFieldChange = (id, value) => {
    setControlMeasureFields(
      controlMeasureFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const handleRequiredControlMeasureFieldChange = (id, value) => {
    setRequiredControlMeasureFields(
      requiredControlMeasureFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const addRiskField = () => {
    const newId =
      riskFields.length > 0
        ? Math.max(...riskFields.map((f) => f.id)) + 1
        : 1;
    setRiskFields([...riskFields, { id: newId, value: "" }]);
  };

  const addControlMeasureField = () => {
    const newId =
      controlMeasureFields.length > 0
        ? Math.max(...controlMeasureFields.map((f) => f.id)) + 1
        : 1;
    setControlMeasureFields([...controlMeasureFields, { id: newId, value: "" }]);
  };

  const addRequiredControlMeasureField = () => {
    const newId =
      requiredControlMeasureFields.length > 0
        ? Math.max(...requiredControlMeasureFields.map((f) => f.id)) + 1
        : 1;
    setRequiredControlMeasureFields([...requiredControlMeasureFields, { id: newId, value: "" }]);
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

  const handleDropdownFieldChange = (e, dropdown) => {
    const value = e.target.value;

    if (dropdown === "day" || dropdown === "month" || dropdown === "year") {
      const dateObj = parseDate();
      dateObj[dropdown] = value === "" ? "" : parseInt(value, 10);

      if (dateObj.day && dateObj.month && dateObj.year) {
        const newDate = `${dateObj.year}-${String(dateObj.month).padStart(
          2,
          "0"
        )}-${String(dateObj.day).padStart(2, "0")}`;
        setFormData((prev) => ({
          ...prev,
          date: newDate,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          date: "",
        }));
      }
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
    navigate("/company/qms/list-process-risks-assessments");
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
    return monthNames[monthNum - 1] || "";
  };

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <div className="text-red-500 text-sm mt-1">{message}</div>;
  };

  const handleSave = () => {
    setIsSaveLoading(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaveLoading(false);
    }, 1000);
  };

  const handleSaveDraft = () => {
    setIsSaveDraftLoading(true);
    // Simulate save draft operation
    setTimeout(() => {
      setIsSaveDraftLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-[#1C1C24] rounded-lg text-white">
      <div>
        <div className="flex items-center justify-between px-[65px] 2xl:px-[122px]">
          <h1 className="add-manual-sections !px-0">Add Risk Assessment</h1>

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
                        value={field.value}
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
                  <ErrorMessage message={errors[`risk_${field.id}`]} />
                </div>
              ))}
            </div>

            <div>
              <label className="add-qms-manual-label">Risk Assessment</label>
              <div className="flex space-x-5">
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="probability"
                    value={formData.probability}
                    onFocus={() => toggleDropdown("probability")}
                    onChange={(e) => handleDropdownFieldChange(e, "probability")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({
                        ...prev,
                        probability: false,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {probabilityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.probability ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="benefit"
                    value={formData.benefit}
                    onFocus={() => toggleDropdown("benefit")}
                    onChange={(e) => handleDropdownFieldChange(e, "benefit")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, benefit: false }))
                    }
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {benefitOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.benefit ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <ErrorMessage message={errors.probability} />
              <ErrorMessage message={errors.benefit} />
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-qms-manual-label">Control Measures</label>
              {controlMeasureFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={field.value}
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
                  <ErrorMessage message={errors[`control_measure_${field.id}`]} />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-qms-manual-label">Required Control Measures</label>
              {requiredControlMeasureFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={field.value}
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
                  <ErrorMessage message={errors[`required_control_measure_${field.id}`]} />
                </div>
              ))}
            </div>

            <div>
              <label className="add-qms-manual-label">Action Owner</label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="action_owner"
                  value={formData.action_owner}
                  onFocus={() => toggleDropdown("action_owner")}
                  onChange={(e) =>
                    handleDropdownFieldChange(e, "action_owner")
                  }
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({
                      ...prev,
                      action_owner: false,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Action Owner
                  </option>
                  {ownersActionParties.map((party) => (
                    <option key={party} value={party}>
                      {party}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.action_owner ? "rotate-180" : ""
                  }`}
                />
              </div>
              <ErrorMessage message={errors.action_owner} />
            </div>

            <div>
              <label className="add-qms-manual-label">Residual Risk</label>
              <div className="flex space-x-5">
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="probability"
                    value={formData.probability}
                    onFocus={() => toggleDropdown("probability")}
                    onChange={(e) => handleDropdownFieldChange(e, "probability")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({
                        ...prev,
                        probability: false,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {probabilityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.probability ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="benefit"
                    value={formData.benefit}
                    onFocus={() => toggleDropdown("benefit")}
                    onChange={(e) => handleDropdownFieldChange(e, "benefit")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, benefit: false }))
                    }
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {benefitOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.benefit ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <ErrorMessage message={errors.probability} />
              <ErrorMessage message={errors.benefit} />
            </div>

            <div>
              <label className="add-qms-manual-label">Review Date</label>
              <div className="flex space-x-5">
                <div className="relative w-1/3">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    value={dateParts.day || ""}
                    onFocus={() => toggleDropdown("day")}
                    onChange={(e) => handleDropdownFieldChange(e, "day")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, day: false }))
                    }
                  >
                    <option value="" disabled>
                      dd
                    </option>
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
                    value={dateParts.month || ""}
                    onFocus={() => toggleDropdown("month")}
                    onChange={(e) => handleDropdownFieldChange(e, "month")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, month: false }))
                    }
                  >
                    <option value="" disabled>
                      mm
                    </option>
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
                    value={dateParts.year || ""}
                    onFocus={() => toggleDropdown("year")}
                    onChange={(e) => handleDropdownFieldChange(e, "year")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, year: false }))
                    }
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

            <div>
              <button
                className="request-correction-btn duration-200"
                onClick={handleSaveDraft}
                disabled={isSaveDraftLoading}
              >
                {isSaveDraftLoading ? "Saving..." : "Save as Draft"}
              </button>
            </div>
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
    </div>
  );
};

export default QmsAddRiskAssessment;