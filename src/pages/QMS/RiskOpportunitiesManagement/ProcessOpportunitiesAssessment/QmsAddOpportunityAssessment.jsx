import React, { useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QmsAddOpportunityAssessment = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [formData, setFormData] = useState({
    activity_process: "",
    potential_opportunity: "",
    probability: "",
    benefit: "",
    owners_action_party: "",
    approved_by: "",
    status: "",
    date: "",
    review_frequency_year: "",
    review_frequency_month: "",
    remarks: "",
  });

  const [actionPlanFields, setActionPlanFields] = useState([{ id: 1, value: "" }]);

  const [openDropdowns, setOpenDropdowns] = useState({
    probability: false,
    benefit: false,
    owners_action_party: false,
    approved_by: false,
    status: false,
    day: false,
    month: false,
    year: false,
  });
  const [errors, setErrors] = useState({});

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

  const approvedByOptions = [
    "Manager",
    "Director",
    "Executive",
    "Compliance Officer",
  ];

  const probabilityOptions = ["Low", "Medium", "High"];
  const benefitOptions = ["Minor", "Moderate", "Significant"];

  const statusOptions = ["Achieved", "Not Achieved", "Cancelled", "Hold"];

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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleActionPlanChange = (id, value) => {
    setActionPlanFields(
      actionPlanFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const addActionPlanField = () => {
    const newId =
      actionPlanFields.length > 0
        ? Math.max(...actionPlanFields.map((f) => f.id)) + 1
        : 1;
    setActionPlanFields([...actionPlanFields, { id: newId, value: "" }]);
  };

  const removeActionPlanField = (id) => {
    if (actionPlanFields.length > 1) {
      setActionPlanFields(actionPlanFields.filter((field) => field.id !== id));
    }
  };

  const handleDropdownChange = (e, dropdown) => {
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

  const handleListOpportunity = () => {
    navigate("/company/qms/list-opportunity-assessment");
  };

  const handleCancelClick = () => {
    navigate("/company/qms/list-opportunity-assessment");
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

  return (
    <div className="bg-[#1C1C24] rounded-lg text-white">
      <div>
        <div className="flex items-center justify-between px-[65px] 2xl:px-[122px]">
          <h1 className="add-manual-sections !px-0">
            Add Opportunity Assessment
          </h1>

          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleListOpportunity}
          >
            <span>List Opportunity Assessments</span>
          </button>
        </div>

        <div className="border-t border-[#383840] mx-[18px] pt-[22px] px-[47px] 2xl:px-[104px]">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="add-qms-manual-label">Activity/Process</label>
              <input
                type="text"
                name="activity_process"
                value={formData.activity_process}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
              <ErrorMessage message={errors.activity_process} />
            </div>

            <div>
              <label className="add-qms-manual-label">
                Potential Opportunity
              </label>
              <input
                type="text"
                name="potential_opportunity"
                value={formData.potential_opportunity}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
              <ErrorMessage message={errors.potential_opportunity} />
            </div>

            <div>
              <label className="add-qms-manual-label">Opportunity</label>
              <div className="flex space-x-5">
                <div className="relative w-1/2">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    name="probability"
                    value={formData.probability}
                    onFocus={() => toggleDropdown("probability")}
                    onChange={(e) => handleDropdownChange(e, "probability")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({
                        ...prev,
                        probability: false,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select Probability
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
                    onChange={(e) => handleDropdownChange(e, "benefit")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, benefit: false }))
                    }
                  >
                    <option value="" disabled>
                      Select Benefit
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
              <label className="add-qms-manual-label">
                Opportunity Action Plan
              </label>
              {actionPlanFields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) =>
                          handleActionPlanChange(field.id, e.target.value)
                        }
                        className="add-qms-manual-inputs focus:outline-none flex-1 !mt-0"
                      />
                      {index === actionPlanFields.length - 1 ? (
                        <button
                          type="button"
                          onClick={addActionPlanField}
                          className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                        >
                          <Plus className="text-white" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeActionPlanField(field.id)}
                          className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                        >
                          <X className="text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                  <ErrorMessage message={errors[`action_plan_${field.id}`]} />
                </div>
              ))}
            </div>

            <div>
              <label className="add-qms-manual-label">
                Owner(s)/Action Party
              </label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="owners_action_party"
                  value={formData.owners_action_party}
                  onFocus={() => toggleDropdown("owners_action_party")}
                  onChange={(e) =>
                    handleDropdownChange(e, "owners_action_party")
                  }
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({
                      ...prev,
                      owners_action_party: false,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Owner/Action Party
                  </option>
                  {ownersActionParties.map((party) => (
                    <option key={party} value={party}>
                      {party}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.owners_action_party ? "rotate-180" : ""
                  }`}
                />
              </div>
              <ErrorMessage message={errors.owners_action_party} />
            </div>

            <div>
              <label className="add-qms-manual-label">
                Approved By <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="approved_by"
                  value={formData.approved_by}
                  onFocus={() => toggleDropdown("approved_by")}
                  onChange={(e) => handleDropdownChange(e, "approved_by")}
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({
                      ...prev,
                      approved_by: false,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Approver
                  </option>
                  {approvedByOptions.map((approver) => (
                    <option key={approver} value={approver}>
                      {approver}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.approved_by ? "rotate-180" : ""
                  }`}
                />
              </div>
              <ErrorMessage message={errors.approved_by} />
            </div>

            <div>
              <label className="add-qms-manual-label">Due Date</label>
              <div className="flex space-x-5">
                <div className="relative w-1/3">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    value={dateParts.day || ""}
                    onFocus={() => toggleDropdown("day")}
                    onChange={(e) => handleDropdownChange(e, "day")}
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
                    onChange={(e) => handleDropdownChange(e, "month")}
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
                    onChange={(e) => handleDropdownChange(e, "year")}
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
              <label className="add-qms-manual-label">
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="status"
                  value={formData.status}
                  onFocus={() => toggleDropdown("status")}
                  onChange={(e) => handleDropdownChange(e, "status")}
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({
                      ...prev,
                      status: false,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.status ? "rotate-180" : ""
                  }`}
                />
              </div>
              <ErrorMessage message={errors.status} />
            </div>

            <div>
              <label className="add-qms-manual-label">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
              <ErrorMessage message={errors.remarks} />
            </div>

            <div className="mt-[35px]">
              <div className="flex gap-[22px] mb-6 justify-end">
                <button
                  className="cancel-btn duration-200"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button className="save-btn duration-200" onClick={() => {}}>
                  Save
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

export default QmsAddOpportunityAssessment;