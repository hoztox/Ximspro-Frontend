import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsAddOpportunityAssessment = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  const [formData, setFormData] = useState({
    activity: "",
    potential_opportunity: "",
    probability: "",
    benefit: "",
    owners: [],
    approved_by: "",
    status: "",
    date: "",
    review_frequency_year: "",
    review_frequency_month: "",
    remarks: "",
  });
  
  // Add separate state for date parts to maintain selection state
  const [dateParts, setDateParts] = useState({
    day: "",
    month: "",
    year: ""
  });
  
  const [actionPlanFields, setActionPlanFields] = useState([{ id: 1, value: "" }]);
  const [users, setUsers] = useState([]);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaveDraftLoading, setIsSaveDraftLoading] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    probability: false,
    benefit: false,
    owners: false,
    approved_by: false,
    status: false,
    day: false,
    month: false,
    year: false,
  });
  
  const ownersDropdownRef = useRef(null);

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  const parseDate = () => {
    if (!formData.date) {
      return dateParts;
    }
    const dateObj = new Date(formData.date);
    const parsed = {
      day: dateObj.getDate(),
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear(),
    };
    return parsed;
  };

  // Use the parseDate function result
  const currentDateParts = parseDate();

  const days = Array.from(
    { length: getDaysInMonth(currentDateParts.month, currentDateParts.year) },
    (_, i) => i + 1
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Filter owners based on search term
  const filteredOwners = users.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(ownerSearchTerm.toLowerCase())
  );

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const companyId = getUserCompanyId();
        const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrors({ non_field_errors: "Failed to load users" });
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ownersDropdownRef.current && !ownersDropdownRef.current.contains(event.target)) {
        setOpenDropdowns((prev) => ({ ...prev, owners: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOwnersChange = (userId) => {
    setFormData((prev) => {
      const newOwners = prev.owners.includes(userId)
        ? prev.owners.filter((id) => id !== userId)
        : [...prev.owners, userId];
      return { ...prev, owners: newOwners };
    });
    if (errors.owners) {
      setErrors((prev) => ({ ...prev, owners: "" }));
    }
  };

  const handleActionPlanChange = (id, value) => {
    setActionPlanFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const addActionPlanField = () => {
    const newId = actionPlanFields.length > 0 ? Math.max(...actionPlanFields.map((f) => f.id)) + 1 : 1;
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
      const newValue = value === "" ? "" : parseInt(value, 10);
      
      // Update the date parts state
      const newDateParts = { ...dateParts, [dropdown]: newValue };
      setDateParts(newDateParts);

      // Construct new date if all parts are available
      if (newDateParts.day && newDateParts.month && newDateParts.year) {
        // Validate the date is valid
        const testDate = new Date(newDateParts.year, newDateParts.month - 1, newDateParts.day);
        if (testDate.getFullYear() === newDateParts.year && 
            testDate.getMonth() === newDateParts.month - 1 && 
            testDate.getDate() === newDateParts.day) {
          const newDate = `${newDateParts.year}-${String(newDateParts.month).padStart(2, "0")}-${String(newDateParts.day).padStart(2, "0")}`;
          setFormData((prev) => ({ ...prev, date: newDate }));
        }
      }
      
      // Clear date error if exists
      if (errors.date) {
        setErrors((prev) => ({ ...prev, date: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [dropdown]: value }));
      if (errors[dropdown]) {
        setErrors((prev) => ({ ...prev, [dropdown]: "" }));
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
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return monthNames[monthNum - 1] || "";
  };

  // Create a common function to build the payload
  const buildPayload = (isDraft = false) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    return {
      activity: formData.activity || null,
      potential_opportunity: formData.potential_opportunity || null,
      opportunity: formData.probability ? parseInt(formData.probability) : null,
      benefit: formData.benefit ? parseInt(formData.benefit) : null,
      owners: formData.owners,
      approved_by: formData.approved_by || null,
      date: formData.date || null,
      status: formData.status || "Achieved",
      remarks: formData.remarks || null,
      actions: actionPlanFields
        .filter(field => field.value.trim() !== '')  
        .map((field) => ({ action: field.value })),
      company: companyId,
      user: userId,
      is_draft: isDraft, // Add the is_draft field
    };
  };

  const handleSave = async () => {
    setIsSaveLoading(true);
    try {
      const payload = buildPayload(false); // Not a draft
      console.log('Sending save payload:', payload);  

      const response = await axios.post(
        `${BASE_URL}/qms/risk-opportunity/create/`,
        payload  
      );
      
      console.log('Save response:', response.data);  
      navigate("/company/qms/list-opportunity-assessment");
    } catch (error) {
      console.error('Save error:', error);  
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ non_field_errors: "Failed to save assessment. Please try again." });
      }
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaveDraftLoading(true);
    try {
      const payload = buildPayload(true); // This is a draft
      console.log('Sending draft payload:', payload);

      const response = await axios.post(
        `${BASE_URL}/qms/risk-opportunity/create/`,
        payload
      );
      
      console.log('Draft response:', response.data);
      navigate("/company/qms/list-opportunity-assessment");
    } catch (error) {
      console.error('Draft save error:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ non_field_errors: "Failed to save draft. Please try again." });
      }
    } finally {
      setIsSaveDraftLoading(false);
    }
  };

  const probabilityOptions = [1, 2, 3, 4, 5];
  const benefitOptions = [1, 2, 3, 4, 5];
  const statusOptions = ["Achieved", "Not Achieved", "Cancelled", "Hold"];

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
          {errors.non_field_errors && (
            <div className="text-red-500 mb-4">{errors.non_field_errors}</div>
          )}
          
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="add-qms-manual-label">Activity/Process</label>
              <input
                type="text"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
              <ErrorMessage message={errors.activity} />
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
              
                </div>
              ))}
               
            </div>

            <div className="flex flex-col gap-3 relative" ref={ownersDropdownRef}>
              <label className="add-qms-manual-label">
                Owner(s)/Action Party
              </label>
              <div className="relative">
                <div className="flex items-center mb-2 border border-[#383840] rounded-md">
                  <input
                    type="text"
                    placeholder="Search owners..."
                    value={ownerSearchTerm}
                    onChange={(e) => setOwnerSearchTerm(e.target.value)}
                    className="add-training-inputs !pr-10"
                  />
                  <Search className="absolute right-3" size={20} color="#AAAAAA" />
                </div>
              </div>
              
              <div className="border border-[#383840] rounded-md p-2 max-h-[130px] overflow-y-auto">
                {filteredOwners.length > 0 ? (
                  filteredOwners.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center py-2 last:border-0"
                    >
                      <input
                        type="checkbox"
                        id={`owner-${user.id}`}
                        checked={formData.owners.includes(user.id)}
                        onChange={() => handleOwnersChange(user.id)}
                        className="mr-2 form-checkboxes"
                      />
                      <label
                        htmlFor={`owner-${user.id}`}
                        className="text-sm text-[#AAAAAA] cursor-pointer"
                      >
                        {user.first_name} {user.last_name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[#AAAAAA] p-2">
                    No owners found
                  </div>
                )}
              </div>
              
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
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {`${user.first_name} ${user.last_name}`}
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
              <label className="add-qms-manual-label">Status</label>
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

            <div></div>
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
                  onClick={handleCancelClick}
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

export default QmsAddOpportunityAssessment;