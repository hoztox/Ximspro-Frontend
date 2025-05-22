import React, { useState, useEffect } from "react";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import SuccessModal from "./Modals/SuccessModal";
import ErrorModal from "./Modals/ErrorModal";
import DeleteConfimModal from "./Modals/DeleteConfimModal";

const ProcessTypeModal = ({ isOpen, onClose, onAddProcess }) => {
  const [animateClass, setAnimateClass] = useState("");
  const [process, setProcess] = useState([]);
  const [newProcessTitle, setNewProcessTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [processToDelete, setProcessToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  // Animation effect when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAnimateClass("opacity-100 scale-100");
      fetchProcess();
    } else {
      setAnimateClass("opacity-0 scale-95");
    }
  }, [isOpen]);

  const fetchProcess = async () => {
    setLoading(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/qms/process-activity/company/${companyId}/`
      );
      setProcess(response.data);
    } catch (error) {
      console.error("Error fetching process:", error);
      setError("Failed to load process. Please try again.");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

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

  // Open delete confirmation modal
  const openDeleteModal = (processItem) => {
    setProcessToDelete(processItem);
    setShowDeleteModal(true);
    setDeleteMessage("Process Type");
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
  };

  // Handle delete process
  const handleDelete = async () => {
    if (!processToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/process-activity/${processToDelete.id}/`);
      setProcess(process.filter((item) => item.id !== processToDelete.id));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setSuccessMessage("Process Type Deleted Successfully");
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting Process:", error);
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

  // Validate Process/Activities Title
  const validateForm = () => {
    if (!newProcessTitle.trim()) {
      setTitleError("Process/Activities Title is required");
      return false;
    }
    setTitleError("");
    return true;
  };

  // Handle save new process
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsAdding(true);
    try {
      const companyId = getUserCompanyId();

      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
        setIsAdding(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/qms/process-activity/create/`,
        {
          company: companyId,
          title: newProcessTitle.trim(),
        }
      );

      setProcess([...process, response.data]);

      if (onAddProcess && typeof onAddProcess === "function") {
        onAddProcess(response.data);
      }
      setShowSuccessModal(true);
      setSuccessMessage("Process Type Added Successfully");
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      setNewProcessTitle("");
    } catch (error) {
      console.error("Error adding Process:", error);
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
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div
        className={`bg-[#13131A] text-white rounded-[4px] w-[563px] p-5 transform transition-all duration-300 ${animateClass}`}
      >
        {/* Delete Confirmation Modal */}
        <DeleteConfimModal
          showDeleteModal={showDeleteModal}
          onConfirm={handleDelete}
          onCancel={closeAllModals}
          deleteMessage={deleteMessage}
        />

        {/* Success Modal */}
        <SuccessModal
          showSuccessModal={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          successMessage={successMessage}
        />

        {/* Error Modal */}
        <ErrorModal
          showErrorModal={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          error={error}
        />

        {/* Process List Section */}
        <div className="bg-[#1C1C24] rounded-[4px] p-5 mb-6 max-h-[350px]">
          <h2 className="agenda-list-head pb-5">Related Process/Activities</h2>
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
                    {process.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 not-found">
                          No Review Found
                        </td>
                      </tr>
                    ) : (
                      process.map((item, index) => (
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

        {/* Add Process Section */}
        <div className="bg-[#1C1C24] rounded-[4px]">
          <h3 className="agenda-list-head border-b border-[#383840] px-5 py-6">
            Add Related Process/Activities
          </h3>

          <div className="mb-4 px-5">
            <label className="block mb-3 agenda-list-label">
              Process/Activities Title <span className="text-[#F9291F]">*</span>
            </label>
            <input
              type="text"
              value={newProcessTitle}
              onChange={(e) => {
                setNewProcessTitle(e.target.value);
                setTitleError("");
              }}
              className={`w-full add-agenda-inputs bg-[#24242D] h-[49px] px-5 border-none outline-none ${titleError ? "border border-red-500" : ""}`}
            />
            {titleError && (
              <p className="text-red-500 text-sm mt-1">{titleError}</p>
            )}
          </div>

          <div className="flex gap-5 justify-end pb-5 px-5">
            <button onClick={onClose} className="cancel-btn">
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
    </div>
  );
};
export default ProcessTypeModal; 