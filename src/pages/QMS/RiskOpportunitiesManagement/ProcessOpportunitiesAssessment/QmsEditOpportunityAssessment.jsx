import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, X, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsEditOpportunityAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
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
      }
    };
    fetchUsers();
  }, []);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ownersDropdownRef.current && !ownersDropdownRef.current.contains(event.target)) {
        setOpenDropdowns((prev) => ({ ...prev, owners: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper function to format user display name
  const formatUserName = (user) => {
    if (!user) return "";
    if (typeof user === 'string') return user;
    
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    const username = user.username || "";
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else if (username) {
      return username;
    }
    
    return "";
  };

  // Fetch opportunity assessment data
  const fetchOpportunityData = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await axios.get(`${BASE_URL}/qms/risk-opportunity/${id}/`);
    const opportunityData = response.data;

    console.log("Fetched opportunity data:", opportunityData);

    // Defensive check: ensure opportunityData is a valid object
    if (!opportunityData || typeof opportunityData !== "object") {
      setError("Invalid data received from server.");
      return;
    }

    // Parse owners - handle different data structures
    let ownersArray = [];
    if (opportunityData.owners && Array.isArray(opportunityData.owners)) {
      ownersArray = opportunityData.owners.map(owner =>
        typeof owner === "object" && owner !== null ? owner.id : owner
      );
    } else if (opportunityData.action_party) {
      const matchingUser = users.find(user =>
        `${user.first_name} ${user.last_name}` === opportunityData.action_party ||
        user.username === opportunityData.action_party
      );
      if (matchingUser) {
        ownersArray = [matchingUser.id];
      }
    }

    // Pre-populate form data
    setFormData({
      activity: opportunityData.activity || "",
      potential_opportunity: opportunityData.potential_opportunity || "",
      probability: opportunityData.probability || opportunityData.opportunity || "",
      benefit: opportunityData.benefit || "",
      owners: ownersArray,
      approved_by: typeof opportunityData.approved_by === "object" && opportunityData.approved_by !== null
        ? opportunityData.approved_by.id
        : opportunityData.approved_by || "",
      status: opportunityData.status || "",
      date: opportunityData.date || opportunityData.due_date || "",
      review_frequency_year: opportunityData.review_frequency_year || "",
      review_frequency_month: opportunityData.review_frequency_month || "",
      remarks: opportunityData.remarks || "",
    });

    // Parse and set date parts
    if (opportunityData.date || opportunityData.due_date) {
      const dateObj = new Date(opportunityData.date || opportunityData.due_date);
      setDateParts({
        day: dateObj.getDate(),
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear(),
      });
    }

    // Pre-populate action plan fields
    if (opportunityData.opportunity_action_plan) {
      let actionPlans = [];

      if (Array.isArray(opportunityData.opportunity_action_plan)) {
        actionPlans = opportunityData.opportunity_action_plan;
      } else if (typeof opportunityData.opportunity_action_plan === "string") {
        actionPlans = opportunityData.opportunity_action_plan
          .split(";")
          .filter(plan => plan.trim() !== "");
      }

      setActionPlanFields(
        actionPlans.length > 0
          ? actionPlans.map((plan, index) => ({ id: index + 1, value: plan.trim() }))
          : [{ id: 1, value: "" }]
      );
    } else if (opportunityData.actions && Array.isArray(opportunityData.actions)) {
      const actions = opportunityData.actions
        .map(action =>
          typeof action === "object" && action !== null ? action.action : action
        )
        .filter(action => action && action.trim() !== "");

      setActionPlanFields(
        actions.length > 0
          ? actions.map((action, index) => ({ id: index + 1, value: action }))
          : [{ id: 1, value: "" }]
      );
    }

  } catch (error) {
    console.error("Error fetching opportunity data:", error);
    setError("Failed to load opportunity assessment data");

    if (error.response?.status === 404) {
      navigate("/company/qms/list-opportunity-assessment");
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (id && users.length > 0) {
      fetchOpportunityData();
    } else if (!id) {
      setError("Invalid assessment ID");
      setLoading(false);
    }
  }, [id, users]);

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

const handleUpdateClick = async () => {
  try {
    setUpdateLoading(true);
    
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    // Create base payload with scalar fields
    const payload = {
      activity: formData.activity || null,
      potential_opportunity: formData.potential_opportunity || null,
      opportunity: formData.probability ? parseInt(formData.probability) : null,
      benefit: formData.benefit ? parseInt(formData.benefit) : null,
      approved_by: formData.approved_by || null,
      date: formData.date || null,
      status: formData.status || "Achieved",
      remarks: formData.remarks || null,
      company: companyId,
      user: userId,
    };

 
    if (formData.owners && formData.owners.length >= 0) {
      payload.owners = formData.owners;
    }

  
    const filteredActions = actionPlanFields.filter(field => field.value.trim() !== '');
    if (filteredActions.length > 0) {
      payload.actions = filteredActions.map((field) => ({ action: field.value }));
    }

    console.log('Updating opportunity with payload:', payload);

     
    const response = await axios.patch(
      `${BASE_URL}/qms/risk-opportunity/${id}/`,
      payload
    );

    console.log("Update response:", response.data);
    
   
    navigate("/company/qms/list-opportunity-assessment");
    
  } catch (error) {
    console.error("Error updating opportunity:", error);
    if (error.response?.data) {
      setErrors(error.response.data);
    } else {
      setErrors({ non_field_errors: "Failed to update opportunity assessment. Please try again." });
    }
  } finally {
    setUpdateLoading(false);
  }
};

  const probabilityOptions = [1, 2, 3, 4, 5];
  const benefitOptions = [1, 2, 3, 4, 5];
  const statusOptions = ["Achieved", "Not Achieved", "Cancelled", "Hold"];

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <div className="text-red-500 text-sm mt-1">{message}</div>;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#1C1C24] rounded-lg text-white p-5 flex justify-center items-center min-h-[400px]">
        <p>Loading Opportunity Assessment...</p>
      </div>
    );
  }

  // Error state
  if (error && !formData.activity) {
    return (
      <div className="bg-[#1C1C24] rounded-lg text-white p-5">
        <div className="text-red-500 text-center mt-8 mb-4">{error}</div>
        <div className="text-center">
          <button
            onClick={fetchOpportunityData}
            className="border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white duration-200 px-4 py-2 rounded mr-4"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/company/qms/list-opportunity-assessment")}
            className="border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white duration-200 px-4 py-2 rounded"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] rounded-lg text-white">
      <div>
        <div className="flex items-center justify-between px-[65px] 2xl:px-[122px]">
          <h1 className="add-manual-sections !px-0">
            Edit Opportunity Assessment
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
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  className="save-btn duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleUpdateClick}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsEditOpportunityAssessment;