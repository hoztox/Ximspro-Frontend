import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewObjectives = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    objective: "",
    indicator: "",
    performance: "",
    target_date: "",
    responsible: "",
    status: "",
    reminder_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchObjective();
  }, []);

  const fetchObjective = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/qms/objectives-get/${id}/`);

      const data = response.data;
      setFormData({
        objective: data.objective || "",
        indicator: data.indicator || "",
        performance: data.performance || "",
        target_date: data.target_date || "N/A",
        responsible: data.responsible
          ? `${data.responsible.first_name} ${data.responsible.last_name || ""}`
          : "N/A",
        status: data.status || "On Going",
        reminder_date: data.reminder_date || "N/A",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching objective:", error);
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
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A"; // handle invalid date formats
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const handleClose = () => {
    navigate("/company/qms/list-objectives");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edit-objectives/${id}`);
  };

  // Open delete confirmation modal
  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteMessage('Objective');
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/objectives-get/${id}/`);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setSuccessMessage("Objective Deleted Successfully");
      setTimeout(() => {
        navigate("/company/qms/list-objectives");
      }, 2000);
    } catch (error) {
      console.error("Error deleting objective:", error);
      setShowDeleteModal(false);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);

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

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Objectives Information</h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4 not-found">Loading objective...</div>
      ) : (
        <div className="pt-5 relative">
          <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
            <div>
              <label className="block view-employee-label mb-[6px]">
                Objective
              </label>
              <div className="view-employee-data">{formData.objective}</div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Indicator
              </label>
              <div className="view-employee-data">{formData.indicator || "N/A"}</div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Performance Measure
              </label>
              <div className="view-employee-data">{formData.performance || "N/A"}</div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Target Date
              </label>
              <div className="view-employee-data">{formatDate(formData.target_date)}</div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Responsible
              </label>
              <div className="view-employee-data">{formData.responsible}</div>
            </div>

            <div className="flex justify-between">
              <div>
                <label className="block view-employee-label mb-[6px]">
                  Status
                </label>
                <div className="view-employee-data">{formData.status}</div>
              </div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Reminder Notification
              </label>
              <div className="view-employee-data">
                {formatDate(formData.reminder_date)}
              </div>
            </div>

            <div className="flex space-x-10 justify-end">
              <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                Edit
                <button onClick={handleEdit}>
                  <img
                    src={edits}
                    alt="Edit Icon"
                    className="w-[18px] h-[18px]"
                  />
                </button>
              </div>

              <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                Delete
                <button onClick={openDeleteModal}>
                  <img
                    src={deletes}
                    alt="Delete Icon"
                    className="w-[18px] h-[18px]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfimModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
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
    </div>
  );
};

export default QmsViewObjectives;