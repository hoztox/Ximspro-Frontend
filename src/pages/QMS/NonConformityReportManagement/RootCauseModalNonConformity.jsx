import React, { useState, useEffect } from "react";
import deletes from "../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../Utils/Config";
import axios from "axios";
import SuccessModal from "./Modals/SuccessModal";
import ErrorModal from "./Modals/ErrorModal";
import DeleteConfimModal from "./Modals/DeleteConfimModal";

const RootCauseModalNonConformity = ({ isOpen, onClose, onAddCause }) => {
  const [animateClass, setAnimateClass] = useState("");
  const [causes, setCauses] = useState([]);
  const [newCauseTitle, setNewCauseTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState({ newCauseTitle: "" });

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [causeToDelete, setCauseToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAnimateClass("opacity-100 scale-100");
      fetchCauses();
    } else {
      setAnimateClass("opacity-0 scale-95");
    }
  }, [isOpen]);

  const fetchCauses = async () => {
    setLoading(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/qms/conf-cause/company/${companyId}/`
      );
      setCauses(response.data);
    } catch (error) {
      console.error("Error fetching causes:", error);
      setError("Failed to load causes. Please try again.");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
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

  // Open delete confirmation modal
  const openDeleteModal = (cause) => {
    setCauseToDelete(cause);
    setShowDeleteModal(true);
    setDeleteMessage('Root Cause');
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!causeToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/conf-cause/${causeToDelete.id}/`);
      setCauses(causes.filter(item => item.id !== causeToDelete.id));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      setSuccessMessage("Root Cause Deleted Successfully");
    } catch (error) {
      console.error("Error deleting cause:", error);
      setError("Failed to delete cause. Please try again.");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      setShowDeleteModal(false);
    }
  };

  const handleSave = async () => {
    if (!newCauseTitle.trim()) {
      setErrors({ newCauseTitle: "Title is required" });
      return;
    }

    setIsAdding(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        return;
      }

      const response = await axios.post(`${BASE_URL}/qms/conf-cause/create/`, {
        company: companyId,
        title: newCauseTitle.trim(),
      });

      setCauses([...causes, response.data]);
      if (onAddCause) onAddCause(response.data);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);
      setSuccessMessage("Root Cause Added Successfully");
      setNewCauseTitle("");
    } catch (error) {
      console.error("Error adding cause:", error);
      setError("Failed to add cause. Please try again.");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSelectCause = (cause) => {
    if (onAddCause) {
      onAddCause(cause);
      onClose();
    }
  };

  const handleCauseTitleChange = (e) => {
    const value = e.target.value;
    setNewCauseTitle(value);
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, newCauseTitle: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      {/* Main Modal */}
      <div
        className={`bg-[#13131A] text-white rounded-[4px] w-[563px] p-5 transform transition-all duration-300 ${animateClass}`}
        style={{ zIndex: 60 }} // Higher than modals
      >
        {/* Causes List Section */}
        <div className="bg-[#1C1C24] rounded-[4px] p-5 mb-6 max-h-[350px]">
          <h2 className="agenda-list-head pb-5">Root Causes List</h2>

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

          {loading ? (
            <div className="text-center py-4 not-found">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-400">
                <thead className="bg-[#24242D] h-[48px]">
                  <tr className="rounded-[4px]">
                    <th className="px-3 w-[10%] agenda-thead">No</th>
                    <th className="px-3 w-[60%] agenda-thead">Title</th>
                    <th className="px-3 text-center w-[15%] agenda-thead">
                      Delete
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="max-h-[230px] overflow-y-auto">
                <table className="w-full text-left text-gray-400">
                  <tbody>
                    {causes.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No causes found
                        </td>
                      </tr>
                    ) : (
                      causes.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-[#383840] h-[42px]"
                        >
                          <td className="px-3 agenda-data w-[10%]"> 
                            {index + 1}
                          </td>
                          <td className="px-3 agenda-data w-[60%]">
                            {item.title}
                          </td>
                          <td className="px-3 agenda-data text-center w-[15%]">
                            <div className="flex items-center justify-center h-[42px]">
                              <button onClick={() => openDeleteModal(item)}>
                                <img
                                  src={deletes}
                                  alt="Delete Icon"
                                  className="w-[16px] h-[16px]"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Add Cause Section */}
        <div className="bg-[#1C1C24] rounded-[4px]">
          <h3 className="agenda-list-head border-b border-[#383840] px-5 py-6">
            Add Root Cause
          </h3>

          <div className="mb-4 px-5">
            <label className="block mb-3 agenda-list-label">
              Cause Title <span className="text-[#F9291F]">*</span>
            </label>
            <input
              type="text"
              value={newCauseTitle}
              onChange={handleCauseTitleChange}
              className="w-full add-agenda-inputs bg-[#24242D] h-[49px] px-5 border-none outline-none"
              placeholder="Enter cause title"
            />
            {errors.newCauseTitle && (
              <p className="text-[#F9291F] text-sm mt-1">
                {errors.newCauseTitle}
              </p>
            )}
          </div>

          <div className="flex gap-5 justify-end pb-5 px-5">
            <button
              onClick={onClose}
              className="cancel-btn"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="save-btn"
              disabled={isAdding}
            >
              {isAdding ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfimModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeAllModals}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};

export default RootCauseModalNonConformity;