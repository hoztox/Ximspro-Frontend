import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Config";
import RootCauseModalNonConformity from "./RootCauseModalNonConformity";
import SuccessModal from "./Modals/SuccessModal";
import ErrorModal from "./Modals/ErrorModal";

const QmsEditDraftNonConformity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [isRootCauseModalOpen, setIsRootCauseModalOpen] = useState(false);
  const [rootCauses, setRootCauses] = useState([]);
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    source: "",
    title: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    source: "",
    title: "",
    ncr: "",
    root_cause: "",
    executor: "",
    description: "",
    resolution: "",
    supplier: "",
    date_raised: {
      day: "",
      month: "",
      year: "",
    },
    date_completed: {
      day: "",
      month: "",
      year: "",
    },
    status: "Pending",
    send_notification: false,
    is_draft: true,
  });

  const [focusedDropdown, setFocusedDropdown] = useState(null);

  useEffect(() => {
    fetchDraftNonConformity();
    fetchRootCauses();
    fetchUsers();
    fetchSuppliers();
  }, [id]);

  const fetchDraftNonConformity = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/qms/conformity/${id}/`);
      const data = response.data;

      if (!data.is_draft) {
        navigate("/company/qms/list-nonconformity");
        return;
      }

      const processDate = (dateString) => {
        if (!dateString) return { day: "", month: "", year: "" };
        const [year, month, day] = dateString.split("-");
        return { day, month, year };
      };

      setFormData({
        source: data.source || "",
        title: data.title || "",
        ncr: data.ncr || "",
        root_cause: data.root_cause?.id || "",
        executor: data.executor?.id || "",
        description: data.description || "",
        resolution: data.resolution || "",
        supplier: data.supplier?.id || "",
        date_raised: processDate(data.date_raised),
        date_completed: processDate(data.date_completed),
        status: data.status || "Pending",
        send_notification: data.send_notification || false,
        is_draft: data.is_draft || true,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching draft conformity report:", error);
      setError(
        "Failed to load draft conformity report data. Please try again."
      );
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const fetchRootCauses = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/qms/conf-cause/company/${companyId}/`
      );
      setRootCauses(response.data);
    } catch (error) {
      console.error("Error fetching root causes:", error);
      setError(
        "Failed to load root causes. Please check your connection and try again."
      );
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
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

  const fetchSuppliers = async () => {
    try {
      if (!companyId) return;
      const response = await axios.get(
        `${BASE_URL}/qms/suppliers/company/${companyId}/`
      );
      const activeSuppliers = response.data.filter(
        (supplier) => supplier.active === "active"
      );
      setSuppliers(activeSuppliers);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to fetch suppliers data");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  const handleOpenRootCauseModal = () => {
    setIsRootCauseModalOpen(true);
  };

  const handleCloseRootCauseModal = (newCauseAdded = false) => {
    setIsRootCauseModalOpen(false);
    if (newCauseAdded) {
      fetchRootCauses();
    }
  };

  const handleListDraftNonConformity = () => {
    navigate("/company/qms/draft-nonconformity");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ncr") return;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else if (e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (name === "source" && value) {
      setErrors((prev) => ({ ...prev, source: "" }));
    }
    if (name === "title" && value.trim()) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const formatDate = (dateObj) => {
    if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.source || !formData.title.trim()) {
      setErrors({
        source: formData.source ? "" : "Please select a source",
        title: formData.title.trim() ? "" : "Title is required",
      });
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const dateRaised = formatDate(formData.date_raised);
      const dateCompleted = formatDate(formData.date_completed);

      const submissionData = {
        company: companyId,
        title: formData.title,
        source: formData.source,
        root_cause: formData.root_cause || null,
        description: formData.description,
        date_raised: dateRaised,
        date_completed: dateCompleted,
        status: formData.status,
        executor: formData.executor || null,
        ncr: formData.ncr,
        resolution: formData.resolution,
        send_notification: formData.send_notification,
        is_draft: true,
      };

      if (formData.source === "Supplier") {
        submissionData.supplier = formData.supplier;
      }

      const response = await axios.put(
        `${BASE_URL}/qms/conformity-draft/update/${id}/`,
        submissionData
      );

      console.log("Updated Draft Conformity Report:", response.data);
      setIsLoading(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-nonconformity");
      }, 1500);
      setSuccessMessage("Non Conformity Updated Successfully");
    } catch (error) {
      console.error("Error updating draft form:", error);
      setIsLoading(false);
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
    }
  };

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
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Draft Non Conformity Report</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={() => handleListDraftNonConformity()}
        >
          List Draft Non Conformity Report
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="not-found">Loading...</p>
        </div>
      ) : (
        <>
          <RootCauseModalNonConformity
            isOpen={isRootCauseModalOpen}
            onClose={handleCloseRootCauseModal}
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

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5"
          >
            <div className="flex flex-col gap-3 relative">
              <label className="add-training-label">
                Source <span className="text-red-500">*</span>
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("source")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Audit">Audit</option>
                <option value="Customer">Customer</option>
                <option value="Internal">Internal</option>
                <option value="Supplier">Supplier</option>
              </select>
              <ChevronDown
                className={`absolute right-3 top-[55px] transform transition-transform duration-300
                                ${focusedDropdown === "source"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
              {errors.source && (
                <p className="text-red-500 text-sm mt-1">{errors.source}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-training-label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="add-training-inputs focus:outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-training-label">NCR No</label>
              <input
                type="text"
                name="ncr"
                value={formData.ncr}
                className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
                readOnly
                title="Auto-generated action number"
              />
            </div>

            {formData.source === "Supplier" ? (
              <div className="flex flex-col gap-3 relative">
                <label className="add-training-label">
                  Supplier <span className="text-red-500">*</span>
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
                    Select Supplier
                  </option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.company_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                                    ${focusedDropdown === "supplier"
                      ? "rotate-180"
                      : ""
                    }`}
                  size={20}
                  color="#AAAAAA"
                />
              </div>
            ) : (
              <div></div>
            )}

            <div className="flex flex-col gap-3 relative">
              <label className="add-training-label">Root Cause</label>
              <select
                name="root_cause"
                value={formData.root_cause}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("root_cause")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  Select Root Cause
                </option>
                {rootCauses.map((cause) => (
                  <option key={cause.id} value={cause.id}>
                    {cause.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[42%] transform transition-transform duration-300 
                                ${focusedDropdown === "root_cause"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
              <button
                className="flex justify-start add-training-label !text-[#1E84AF] mt-1"
                onClick={handleOpenRootCauseModal}
                type="button"
              >
                View / Add Root Cause
              </button>
            </div>

            <div className="flex flex-col gap-3 relative">
              <label className="add-training-label">Executor</label>
              <select
                name="executor"
                value={formData.executor}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("executor")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  Select Executor
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name || ""}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[42%] transform transition-transform duration-300 
                                ${focusedDropdown === "executor"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-training-label">
                Non Conformity Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="add-training-inputs focus:outline-none !h-[98px]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-training-label">Resolution Details</label>
              <textarea
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
                className="add-training-inputs focus:outline-none !h-[98px]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="add-training-label">Date Raised</label>
              <div className="grid grid-cols-3 gap-5">
                <div className="relative">
                  <select
                    name="date_raised.day"
                    value={formData.date_raised.day}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("date_raised.day")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                  >
                    <option value="" disabled>
                      dd
                    </option>
                    {generateOptions(1, 31)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                        ${focusedDropdown === "date_raised.day"
                        ? "rotate-180"
                        : ""
                      }`}
                    size={20}
                    color="#AAAAAA"
                  />
                </div>
                <div className="relative">
                  <select
                    name="date_raised.month"
                    value={formData.date_raised.month}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("date_raised.month")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                  >
                    <option value="" disabled>
                      mm
                    </option>
                    {generateOptions(1, 12)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                        ${focusedDropdown ===
                        "date_raised.month"
                        ? "rotate-180"
                        : ""
                      }`}
                    size={20}
                    color="#AAAAAA"
                  />
                </div>
                <div className="relative">
                  <select
                    name="date_raised.year"
                    value={formData.date_raised.year}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("date_raised.year")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                  >
                    <option value="" disabled>
                      yyyy
                    </option>
                    {generateOptions(2023, 2030)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                        ${focusedDropdown === "date_raised.year"
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
              <label className="add-training-label">Complete By</label>
              <div className="grid grid-cols-3 gap-5">
                <div className="relative">
                  <select
                    name="date_completed.day"
                    value={formData.date_completed.day}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("date_completed.day")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                  >
                    <option value="" disabled>
                      dd
                    </option>
                    {generateOptions(1, 31)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                        ${focusedDropdown ===
                        "date_completed.day"
                        ? "rotate-180"
                        : ""
                      }`}
                    size={20}
                    color="#AAAAAA"
                  />
                </div>
                <div className="relative">
                  <select
                    name="date_completed.month"
                    value={formData.date_completed.month}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("date_completed.month")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                  >
                    <option value="" disabled>
                      mm
                    </option>
                    {generateOptions(1, 12)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                        ${focusedDropdown ===
                        "date_completed.month"
                        ? "rotate-180"
                        : ""
                      }`}
                    size={20}
                    color="#AAAAAA"
                  />
                </div>
                <div className="relative">
                  <select
                    name="date_completed.year"
                    value={formData.date_completed.year}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("date_completed.year")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"
                  >
                    <option value="" disabled>
                      yyyy
                    </option>
                    {generateOptions(2023, 2030)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                        ${focusedDropdown ===
                        "date_completed.year"
                        ? "rotate-180"
                        : ""
                      }`}
                    size={20}
                    color="#AAAAAA"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 relative">
              <label className="add-training-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("status")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Deleted">Deleted</option>
              </select>
              <ChevronDown
                className={`absolute right-3 top-[58%] transform transition-transform duration-300 
                                ${focusedDropdown === "status"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            <div className="flex items-end justify-end mt-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="send_notification"
                  className="mr-2 form-checkboxes"
                  checked={formData.send_notification || false}
                  onChange={handleChange}
                />
                <span className="permissions-texts cursor-pointer">
                  Send Notification
                </span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-4 justify-end">
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={handleListDraftNonConformity}
                  className="cancel-btn duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default QmsEditDraftNonConformity;
