import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import { ChevronDown } from "lucide-react";
import EditEmployeeSatisfactionSuccessModal from "../Modals/EditEmployeeSatisfactionSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsEditDraftSupplierPerformance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({}); // Added for field-specific errors

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    valid_till: null,
  });

  const [
    showEditEmployeeSatisfactionSuccessModal,
    setShowEditEmployeeSatisfactionSuccessModal,
  ] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [dateValues, setDateValues] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [focusedField, setFocusedField] = useState("");

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField("");

  useEffect(() => {
    const fetchSupplierEvaluation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/supplier/evaluation-get/${id}/`
        );
        const data = response.data;

        setFormData({
          title: data.title || "",
          description: data.description || "",
          valid_till: data.valid_till || null,
        });

        if (data.valid_till) {
          const date = new Date(data.valid_till);
          setDateValues({
            day: String(date.getDate()).padStart(2, "0"),
            month: String(date.getMonth() + 1).padStart(2, "0"),
            year: String(date.getFullYear()),
          });
        }

        setError(null);
        setErrors({});
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
        console.error("Error fetching supplier evaluation data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSupplierEvaluation();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Evaluation Title is required";
    }

    if (dateValues.day || dateValues.month || dateValues.year) {
      if (!dateValues.day || !dateValues.month || !dateValues.year) {
        newErrors.valid_till = "Please complete the date";
      } else {
        const dateStr = `${dateValues.year}-${dateValues.month}-${dateValues.day}`;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          newErrors.valid_till = "Invalid date";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("valid_till.")) {
      const field = name.split(".")[1];
      setDateValues({
        ...dateValues,
        [field]: value,
      });
      if (errors.valid_till) {
        setErrors({
          ...errors,
          valid_till: "",
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      valid_till:
        dateValues.day && dateValues.month && dateValues.year
          ? `${dateValues.year}-${dateValues.month}-${dateValues.day}`
          : null,
    };

    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `${BASE_URL}/qms/supplier/evaluation/${id}/update/`,
        submissionData
      );

      setShowEditEmployeeSatisfactionSuccessModal(true);
      setTimeout(() => {
        setShowEditEmployeeSatisfactionSuccessModal(false);
        navigate("/company/qms/drafts-supplier-evaluation");
      }, 1500);
    } catch (err) {
      console.error("Error updating supplier evaluation:", err);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
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
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/drafts-supplier-evaluation");
  };

  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return (
      <option key={day} value={day < 10 ? `0${day}` : String(day)}>
        {day < 10 ? `0${day}` : day}
      </option>
    );
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthOptions = months.map((month, index) => {
    const monthValue = index + 1;
    return (
      <option
        key={month}
        value={monthValue < 10 ? `0${monthValue}` : String(monthValue)}
      >
        {month}
      </option>
    );
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear + i;
    return (
      <option key={year} value={String(year)}>
        {year}
      </option>
    );
  });

  if (loading && !formData.title) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 flex justify-center items-center h-screen">
        <p>Loading supplier evaluation data...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5">
      <div>
        <div className="flex justify-between items-center pb-5 border-b border-[#383840] px-[104px]">
          <h1 className="add-employee-performance-head">
            Edit Draft Supplier Evaluation
          </h1>
          <button
            className="border border-[#858585] text-[#858585] rounded px-[10px] h-[42px] list-training-btn duration-200"
            onClick={() => navigate("/company/qms/drafts-supplier-evaluation")}
          >
            List Draft Supplier Evaluation
          </button>
        </div>

        <EditEmployeeSatisfactionSuccessModal
          showEditEmployeeSatisfactionSuccessModal={
            showEditEmployeeSatisfactionSuccessModal
          }
          onClose={() => {
            setShowEditEmployeeSatisfactionSuccessModal(false);
          }}
        />

        <ErrorModal
          showErrorModal={showErrorModal}
          onClose={() => {
            setShowErrorModal(false);
          }}
          error={error}
        />

        <form onSubmit={handleSubmit} className="px-[104px] pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block employee-performace-label">
                Evaluation Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full employee-performace-inputs ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block employee-performace-label">
                Valid Till
              </label>
              <div className="flex gap-5">
                <div className="relative w-1/3">
                  <select
                    name="valid_till.day"
                    value={dateValues.day}
                    onChange={handleChange}
                    onFocus={() => handleFocus("day")}
                    onBlur={handleBlur}
                    className={`appearance-none w-full employee-performace-inputs cursor-pointer ${
                      errors.valid_till ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">dd</option>
                    {dayOptions}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 text-[#AAAAAA] ${
                        focusedField === "day" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="relative w-1/3">
                  <select
                    name="valid_till.month"
                    value={dateValues.month}
                    onChange={handleChange}
                    onFocus={() => handleFocus("month")}
                    onBlur={handleBlur}
                    className={`appearance-none w-full employee-performace-inputs cursor-pointer ${
                      errors.valid_till ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">mm</option>
                    {monthOptions}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 text-[#AAAAAA] ${
                        focusedField === "month" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="relative w-1/3">
                  <select
                    name="valid_till.year"
                    value={dateValues.year}
                    onChange={handleChange}
                    onFocus={() => handleFocus("year")}
                    onBlur={handleBlur}
                    className={`appearance-none w-full employee-performace-inputs cursor-pointer ${
                      errors.valid_till ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">yyyy</option>
                    {yearOptions}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 text-[#AAAAAA] ${
                        focusedField === "year" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
              {errors.valid_till && (
                <p className="text-red-500 text-sm mt-1">{errors.valid_till}</p>
              )}
            </div>

            <div className="md:row-span-2 col-span-2">
              <label className="block employee-performace-label">
                Evaluation Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-full min-h-[151px] employee-performace-inputs"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-5 mt-5">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn duration-200"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QmsEditDraftSupplierPerformance;
