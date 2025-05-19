import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddCarNumberModal from "../AddCarNumberModal";
import { BASE_URL } from "../../../../Utils/Config";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsEditDraftSupplierProblem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [carNumbers, setCarNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    date: {
      day: "",
      month: "",
      year: "",
    },
    problem: "",
    immediate_action: "",
    executor: "",
    solved: "",
    corrective_action_need: "",
    corrections: "",
    no_car: "",
    cars: [],
  });
  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [formErrors, setFormErrors] = useState({
    supplier: false,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [error, setError] = useState(null);

  // Get company ID from local storage
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

  console.log("idddd", id);

  // Get relevant user ID
  const getRelevantUserId = () => {
    return localStorage.getItem("user_id") || "";
  };

  const companyId = getUserCompanyId();

  // Fetch suppliers data from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/suppliers/company/${companyId}/`
        );
        console.log("fetched suppp", response);

        // Filter only active suppliers with Approved status
        const activeSuppliers = response.data.filter(
          (supplier) => supplier.active === "active"
        );
        setSuppliers(activeSuppliers);
        setError(null);
      } catch (err) {
        let errorMsg = err.message;

        if (err.response) {
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          } else if (err.response.data.detail) {
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
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchSuppliers();
    }
  }, [companyId]);

  // Fetch users for executor dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!companyId) {
          setError("Company ID not found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/company/users-active/${companyId}/`
        );
        console.log("API Response (Users):", response.data);

        if (Array.isArray(response.data)) {
          setUsers(response.data);
          console.log("Users loaded:", response.data);
        } else {
          setUsers([]);
          console.error("Unexpected response format:", response.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        let errorMsg = err.message;

        if (err.response) {
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          } else if (err.response.data.detail) {
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

    if (companyId) {
      fetchUsers();
    }
  }, [companyId]);

  // Fetch CAR numbers
  useEffect(() => {
    const fetchCarNumbers = async () => {
      try {
        if (!companyId) {
          setError("Company ID not found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/qms/car_no/company/${companyId}/`
        );
        console.log("API Response (CAR Numbers):", response.data);

        setCarNumbers(response.data);

        // Update formData.cars with the fetched CAR numbers
        if (Array.isArray(response.data)) {
          setFormData((prev) => ({
            ...prev,
            cars: response.data.map((item) => item.car_no || item.action_no),
          }));
        }
      } catch (err) {
        console.error("Error fetching CAR numbers:", err);
        let errorMsg = err.message;

        if (err.response) {
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          } else if (err.response.data.detail) {
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

    if (companyId) {
      fetchCarNumbers();
    }
  }, [companyId]);

  // Fetch supplier problem data by ID
  useEffect(() => {
    const fetchSupplierProblem = async () => {
      try {
        if (!id) {
          setError("Problem ID not found. Please check the URL.");
          return;
        }

        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/supplier-problems/${id}/`
        );
        const problemData = response.data;
        console.log("Fetched problem data:", problemData);

        // Parse the date from ISO format
        let problemDate;
        try {
          problemDate = new Date(problemData.date || problemData.problem_date);
        } catch (e) {
          console.error("Error parsing date:", e);
          problemDate = new Date();
        }

        // Map the response data to our form structure
        setFormData({
          supplier: problemData.supplier?.id || "",
          date: {
            day: String(problemDate.getDate()).padStart(2, "0"),
            month: String(problemDate.getMonth() + 1).padStart(2, "0"),
            year: String(problemDate.getFullYear()),
          },
          problem: problemData.problem,
          immediate_action: problemData.immediate_action,
          executor: problemData.executor,
          // Properly convert the boolean or string value to our expected format
          solved:
            typeof problemData.solved === "boolean"
              ? problemData.solved
                ? "Yes"
                : "No"
              : problemData.solved === "Yes"
              ? "Yes"
              : "No",
          corrective_action_need: problemData.corrective_action_need || "No",
          corrections: problemData.corrections || "",
          no_car: problemData.no_car?.id || "",
          cars: problemData.car_numbers || [],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching supplier problem:", err);
        let errorMsg = err.message;

        if (err.response) {
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          } else if (err.response.data.detail) {
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
      }
    };

    if (id) {
      fetchSupplierProblem();
    }
  }, [id]);

  const handleSupplierProblemLog = () => {
    navigate("/company/qms/drafts-supplier-problem");
  };

  const handleOpenCarModal = () => {
    setIsCarModalOpen(true);
  };

  const handleCloseCarModal = () => {
    setIsCarModalOpen(false);
  };

  const handleAddCar = (cars) => {
    setFormData({
      ...formData,
      cars: cars,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error when field is changed
    if (name in formErrors) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
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

  const formatFormDataForSubmission = () => {
    const formattedDate = `${formData.date.year}-${formData.date.month}-${formData.date.day}`;

    // Convert Yes/No string to boolean for solved field
    const solvedValue = formData.solved === "Yes" ? "Yes" : "No";

    return {
      company: companyId,
      supplier: formData.supplier,
      date: formattedDate,
      problem: formData.problem,
      immediate_action: formData.immediate_action,
      executor: formData.executor,
      solved: solvedValue, // Using boolean value instead of string
      corrective_action_need: formData.corrective_action_need,
      corrections: formData.corrections || "",
      no_car: formData.no_car || null,
    };
  };

  const validateForm = () => {
    const errors = {
      supplier: !formData.supplier,
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = formatFormDataForSubmission();
      const userId = getRelevantUserId();

      // Add user ID to the submission data
      const finalSubmissionData = {
        ...submissionData,
        user: userId,
      };

      console.log("Updating with data:", finalSubmissionData);

      // Update the supplier problem using PUT request
      await axios.put(
        `${BASE_URL}/qms/supplier-problems/${id}/`,
        finalSubmissionData
      );

      // Navigate back to list on success

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/supplier-problem-log");
      }, 1500);
      setSuccessMessage("Supplier Problem Saved Successfully");
    } catch (err) {
      console.error("Error updating supplier problem:", err);
      let errorMsg = err.message;

      if (err.response) {
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        } else if (err.response.data.detail) {
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/drafts-supplier-problem");
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

  // Check if corrective action is needed to display conditional fields
  const showCorrectiveFields = formData.corrective_action_need === "Yes";

  // Debug log to check the value of solved field
  console.log("Current solved value:", formData.solved);

  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex justify-center items-center h-64">
        Loading supplier problem data...
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Draft Supplier Problem</h1>

        <AddCarNumberModal
          isOpen={isCarModalOpen}
          onClose={handleCloseCarModal}
          onAddCar={handleAddCar}
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

        <button
          className="border border-[#858585] text-[#858585] rounded px-5 h-[42px] list-training-btn duration-200"
          onClick={handleSupplierProblemLog}
        >
          Draft Supplier Problem Log
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5"
      >
        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">
            Supplier Name <span className="text-red-500">*</span>
          </label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("supplier")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              Select
            </option>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.company_name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No suppliers available
              </option>
            )}
          </select>
          <ChevronDown
            className={`absolute right-3 top-[55px] transform transition-transform duration-300
                        ${focusedDropdown === "supplier" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
          {formErrors.supplier && (
            <p className="text-red-500 text-sm mt-1">
              Supplier Name is required
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Date</label>
          <div className="grid grid-cols-3 gap-5">
            {/* Day */}
            <div className="relative">
              <select
                name="date.day"
                value={formData.date.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date.day")}
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
                                  focusedDropdown === "date.day"
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
                name="date.month"
                value={formData.date.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date.month")}
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
                                  focusedDropdown === "date.month"
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
                name="date.year"
                value={formData.date.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date.year")}
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
                                  focusedDropdown === "date.year"
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
          <label className="add-training-label">Problem</label>
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Immediate Action</label>
          <textarea
            name="immediate_action"
            value={formData.immediate_action}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Executor</label>
          <select
            name="executor"
            value={formData.executor}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("executor")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer "
          >
            <option value="" disabled>
              Select
            </option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))
            ) : (
              <option value=""> </option>
            )}
          </select>
          <ChevronDown
            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "executor" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Solved</label>
          <select
            name="solved"
            value={formData.solved}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("solved")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                        ${focusedDropdown === "solved" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Corrective Action Needed</label>
          <select
            name="corrective_action_need"
            value={formData.corrective_action_need}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("corrective_action_need")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[54px] transform transition-transform duration-300 
                        ${
                          focusedDropdown === "corrective_action_need"
                            ? "rotate-180"
                            : ""
                        }`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        {/* Conditional rendering based on corrective_action_need value */}
        {showCorrectiveFields && (
          <>
            <div className="flex flex-col gap-3 relative">
              <label className="add-training-label">CAR Number</label>
              <select
                name="no_car"
                value={formData.no_car}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("no_car")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  Select
                </option>
                {carNumbers && carNumbers.length > 0 ? (
                  carNumbers.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.action_no || car.car_no || car.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No CAR numbers available
                  </option>
                )}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[42%] transform transition-transform duration-300 
                                ${
                                  focusedDropdown === "no_car"
                                    ? "rotate-180"
                                    : ""
                                }`}
                size={20}
                color="#AAAAAA"
              />
              <button
                className="flex justify-start add-training-label !text-[#1E84AF]"
                type="button"
                onClick={handleOpenCarModal}
              >
                Add CAR number
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-training-label">Corrections</label>
              <textarea
                name="corrections"
                value={formData.corrections}
                onChange={handleChange}
                className="add-training-inputs focus:outline-none"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2 flex gap-4 justify-end">
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn duration-200"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QmsEditDraftSupplierProblem;
