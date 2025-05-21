import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InternalProblemsModal from "../InternalProblemsModal";
import AddCarNumberModal from "../AddCarNumberModal";
import { BASE_URL } from "../../../../Utils/Config";
import AddInternalSuccessModal from "../Modals/AddInternalSuccessModal";
import DraftInternalSuccessModal from "../Modals/DraftInternalSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsAddInternalProblems = () => {
  const navigate = useNavigate();
  const [isCauseModalOpen, setIsCauseModalOpen] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [causes, setCauses] = useState([]);
  const [carNumbers, setCarNumbers] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    cause: "",
    problem: "",
    immediate_action: "",
    executor: "",
    solve_after_action: "Yes",
    corrective_action: "No",
    correction: "",
    car_no: "",
    is_draft: false,
    dateProblem: {
      day: "",
      month: "",
      year: "",
    },
    causes: [],
    cars: [],
  });
  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [showAddInternalSuccessModal, setShowAddInternalSuccessModal] =
    useState(false);
  const [showDraftInternalSuccessModal, setShowDraftInternalSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchCauses();
    fetchCarNumbers();
    fetchUsers();
  }, []);

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

  const fetchCauses = async () => {
    setLoading(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/qms/cause/company/${companyId}/`
      );
      setCauses(response.data);
    } catch (error) {
      console.error("Error fetching causes:", error);
      let errorMsg =  error.message;

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
    } finally {
      setLoading(false);
    }
  };

  const fetchCarNumbers = async () => {
    setLoading(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/qms/car_no/company/${companyId}/`
      );
      setCarNumbers(response.data);
    } catch (error) {
      console.error("Error fetching car numbers:", error);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/company/users-active/${companyId}/`
      );

      if (Array.isArray(response.data)) {
        setUsers(response.data);
        console.log("Users loaded:", response.data);
      } else {
        setUsers([]);
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
    }
  };

  const handleListInternalProblems = () => {
    navigate("/company/qms/list-internal-problem");
  };

  const handleOpenCauseModal = () => {
    setIsCauseModalOpen(true);
  };

  const handleOpenCarModal = () => {
    setIsCarModalOpen(true);
  };

  const handleCloseCauseModal = () => {
    setIsCauseModalOpen(false);
    // Refresh causes after adding new ones
    fetchCauses();
  };

  const handleCloseCarModal = () => {
    setIsCarModalOpen(false);
    // Refresh car numbers after adding new ones
    fetchCarNumbers();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error for the field being changed
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));

    // Handle checkboxes
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
      return;
    }

    // Handle nested objects
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
    }
  };

  const handleAddCause = (causes) => {
    setFormData({
      ...formData,
      causes: causes,
    });
  };

  const handleAddCar = (cars) => {
    setFormData({
      ...formData,
      cars: cars,
    });
  };

  const formatDate = () => {
    const { day, month, year } = formData.dateProblem;
    if (!day || !month || !year) return null;
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.problem.trim()) {
      errors.problem = "Problem/Observation Description is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const userId = getRelevantUserId();
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        setIsSaving(false);
        return;
      }

      const formattedDate = formatDate();

      // Prepare payload with conditional fields
      const payload = {
        company: companyId,
        user: userId,
        cause: formData.cause, // make optional
        problem: formData.problem,
        immediate_action: formData.immediate_action || null, // make optional
        executor: formData.executor || null, // make optional
        date: formattedDate,
        solve_after_action: formData.solve_after_action || "Yes", // default to "Yes"
        // Only include corrective_action if it has a value
        ...(formData.corrective_action && {
          corrective_action: formData.corrective_action,
        }),
        // Only include correction if corrective_action is "Yes"
        ...(formData.corrective_action === "Yes" && {
          correction: formData.correction || null,
        }),
        // Only include car_no if corrective_action is "Yes"
        ...(formData.corrective_action === "Yes" && {
          car_no: formData.car_no || null,
        }),
        is_draft: false,
      };

      // Remove null values from the payload
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== null)
      );

      const response = await axios.post(
        `${BASE_URL}/qms/internal-problems/create/`,
        cleanPayload
      );
      setShowAddInternalSuccessModal(true);
      setTimeout(() => {
        setShowAddInternalSuccessModal(false);
        navigate("/company/qms/list-internal-problem");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();
    setDraftLoading(true);
    setError(null);

    try {
      const userId = getRelevantUserId();
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        setDraftLoading(false);
        return;
      }

      const formattedDate = formatDate();

      // Prepare payload with conditional fields
      const payload = {
        company: companyId,
        user: userId,
        cause: formData.cause,
        problem: formData.problem || null,
        immediate_action: formData.immediate_action || null,
        executor: formData.executor || null,
        date: formattedDate,
        solve_after_action: formData.solve_after_action || "Yes",
        // Only include corrective_action if it has a value
        ...(formData.corrective_action && {
          corrective_action: formData.corrective_action,
        }),
        // Only include correction if corrective_action is "Yes"
        ...(formData.corrective_action === "Yes" && {
          correction: formData.correction || null,
        }),
        // Only include car_no if corrective_action is "Yes"
        ...(formData.corrective_action === "Yes" && {
          car_no: formData.car_no || null,
        }),
        is_draft: true,
      };

      // Remove null values from the payload
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== null)
      );

      const response = await axios.post(
        `${BASE_URL}/qms/internal-problems/draft-create/`,
        cleanPayload
      );

      setShowDraftInternalSuccessModal(true);
      setTimeout(() => {
        setShowDraftInternalSuccessModal(false);
        navigate("/company/qms/draft-internal-problem");
      }, 1500);
    } catch (error) {
      console.error("Error saving draft:", error);
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
    } finally {
      setDraftLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/list-internal-problem");
  };

  // Generate options for dropdowns
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
      {loading && (
        <div className="flex justify-center items-center py-4 not-found">
          <p>Loading data...</p>
        </div>
      )}

      <InternalProblemsModal
        isOpen={isCauseModalOpen}
        onClose={handleCloseCauseModal}
        onAddCause={handleAddCause}
      />

      <AddCarNumberModal
        isOpen={isCarModalOpen}
        onClose={handleCloseCarModal}
        onAddCause={handleAddCar}
      />

      <AddInternalSuccessModal
        showAddInternalSuccessModal={showAddInternalSuccessModal}
        onClose={() => {
          setShowAddInternalSuccessModal(false);
        }}
      />

      <DraftInternalSuccessModal
        showDraftInternalSuccessModal={showDraftInternalSuccessModal}
        onClose={() => {
          setShowDraftInternalSuccessModal(false);
        }}
      />

      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
        }}
        error={error}
      />

      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">
          Add Internal Problems and Observations
        </h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={() => handleListInternalProblems()}
        >
          Internal Problems and Observations
        </button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
        <div className="flex flex-col gap-3 relative">
          <div className="flex justify-between">
            <label className="add-training-label">
              Select Causes / Root Cause
            </label>
          </div>
          <div className="relative">
            <select
              name="cause"
              value={formData.cause}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("cause")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
            >
              <option value="" disabled>
                Select Cause
              </option>
              {causes.map((cause) => (
                <option key={cause.id} value={cause.id}>
                  {cause.title}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-1/3 transform transition-transform duration-300 
                            ${focusedDropdown === "cause" ? "rotate-180" : ""}`}
              size={20}
              color="#AAAAAA"
            />
          </div>
          <button
            type="button"
            className="flex justify-start add-training-label !text-[#1E84AF]"
            onClick={handleOpenCauseModal}
          >
            Add Causes / Causes
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Problem/Observation Description{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            className="add-training-inputs !h-[152px]"
            required
          />
          {fieldErrors.problem && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.problem}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Immediate Action Taken :</label>
          <textarea
            name="immediate_action"
            value={formData.immediate_action}
            onChange={handleChange}
            className="add-training-inputs !h-[151px]"
          ></textarea>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 relative">
            <label className="add-training-label">Executor:</label>
            <select
              name="executor"
              value={formData.executor}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("executor")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
              required
            >
              <option value="" disabled>
                Select User
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                            ${focusedDropdown === "executor" ? "rotate-180" : ""
                }`}
              size={20}
              color="#AAAAAA"
            />
          </div>

          <div className="flex flex-col gap-3 relative">
            <label className="add-training-label">Solved After Action?</label>
            <select
              name="solve_after_action"
              value={formData.solve_after_action}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("solve_after_action")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <ChevronDown
              className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                            ${focusedDropdown === "solve_after_action"
                  ? "rotate-180"
                  : ""
                }`}
              size={20}
              color="#AAAAAA"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Date</label>
          <div className="grid grid-cols-3 gap-5">
            {/* Day */}
            <div className="relative">
              <select
                name="dateProblem.day"
                value={formData.dateProblem.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateProblem.day")}
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
                                ${focusedDropdown === "dateProblem.day"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Month */}
            <div className="relative">
              <select
                name="dateProblem.month"
                value={formData.dateProblem.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateProblem.month")}
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
                                ${focusedDropdown === "dateProblem.month"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                name="dateProblem.year"
                value={formData.dateProblem.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateProblem.year")}
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
                                ${focusedDropdown === "dateProblem.year"
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
          <label className="add-training-label">
            Corrective Action Needed ?
          </label>
          <div className="relative">
            <select
              name="corrective_action"
              value={formData.corrective_action}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("corrective_action")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
            >
              <option value="">Select Option</option> {/* Add this line */}
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <ChevronDown
              className={`absolute right-3 top-1/3 transform transition-transform duration-300
                            ${focusedDropdown === "corrective_action"
                  ? "rotate-180"
                  : ""
                }`}
              size={20}
              color="#AAAAAA"
            />
          </div>
        </div>

        {/* Conditionally render Corrections and Number CAR fields */}
        {formData.corrective_action === "Yes" && (
          <>
            <div className="flex flex-col gap-3">
              <label className="add-training-label">Corrections</label>
              <input
                type="text"
                name="correction"
                value={formData.correction}
                onChange={handleChange}
                className="add-training-inputs"
              />
              {fieldErrors.correction && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.correction}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-training-label">Number CAR</label>
              <div className="relative">
                <select
                  name="car_no"
                  value={formData.car_no}
                  onChange={handleChange}
                  onFocus={() => setFocusedDropdown("car_no")}
                  onBlur={() => setFocusedDropdown(null)}
                  className="add-training-inputs appearance-none pr-10 cursor-pointer"
                >
                  <option value="" disabled>
                    Select CAR Number
                  </option>
                  {carNumbers.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.action_no}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                    ${focusedDropdown === "car_no"
                      ? "rotate-180"
                      : ""
                    }`}
                  size={20}
                  color="#AAAAAA"
                />
              </div>
              <button
                type="button"
                className="flex justify-start add-training-label !text-[#1E84AF]"
                onClick={handleOpenCarModal}
              >
                Add CAR Number
              </button>
            </div>
          </>
        )}

        {/* Form Actions */}
        <div className="md:col-span-2 flex gap-4 justify-between">
          <div>
            <button
              type="button"
              className="request-correction-btn duration-200"
              onClick={handleSaveAsDraft}
              disabled={draftLoading || isSaving}
            >
              {draftLoading ? "Saving..." : "Save as Draft"}
            </button>
          </div>
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
              disabled={draftLoading || isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="save-btn duration-200"
              disabled={draftLoading || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QmsAddInternalProblems;
