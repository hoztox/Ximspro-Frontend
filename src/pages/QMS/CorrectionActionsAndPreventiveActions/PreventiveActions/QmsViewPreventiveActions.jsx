import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import DeleteConfimModal from "../DeleteConfimModal";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const QmsViewPreventiveActions = () => {
  const [formData, setFormData] = useState({
    title: "",
    executor: {},
    description: "",
    action: "",
    date_raised: "",
    date_completed: "",
    status: "Pending",
    is_draft: false,
    send_notification: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch preventive action data
  useEffect(() => {
    const fetchPreventiveAction = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/preventive-get/${id}/`
        );
        setFormData(response.data);
        setLoading(false);
        console.log("Fetched Response:", response.data);
      } catch (err) {
        console.error("Error fetching preventive action:", err);
        handleError(err, "Failed to load preventive action data");
        setLoading(false);
      }
    };

    if (id) {
      fetchPreventiveAction();
    }
  }, [id]);

  const handleError = (error, defaultMessage) => {
    let errorMsg = defaultMessage || error.message;

    if (error.response) {
      if (error.response.data.date) {
        errorMsg = error.response.data.date[0];
      } else if (error.response.data.detail) {
        errorMsg = error.response.data.detail;
      } else if (error.response.data.message) {
        errorMsg = error.response.data.message;
      }
    }

    setError(errorMsg);
    setShowErrorModal(true);
    setTimeout(() => {
      setShowErrorModal(false);
    }, 3000);
  };

  const handleClose = () => {
    navigate("/company/qms/list-preventive-actions");
  };

  const handleEdit = (id) => {
    navigate(`/company/qms/edit-preventive-actions/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
    setDeleteMessage("Preventive Action");
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/preventive-get/${id}/`);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setSuccessMessage("Preventive Action Deleted Successfully");
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-preventive-actions");
      }, 3000);
    } catch (err) {
      console.error("Error deleting preventive action:", err);
      handleError(err, "Failed to delete preventive action");
      setShowDeleteModal(false);
    }
  };

  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  // Format the executor name if available
  const getExecutorName = () => {
    if (
      formData.executor &&
      formData.executor.first_name &&
      formData.executor.last_name
    ) {
      return `${formData.executor.first_name} ${formData.executor.last_name}`;
    }
    return "Not Assigned";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  if (loading)
    return <div className="not-found text-center p-5">Loading...</div>;

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Preventive Action Information</h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>

      <div className="pt-5 relative">
        {/* Vertical divider line */}
        <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
          <div>
            <label className="block view-employee-label mb-[6px]">Title</label>
            <div className="view-employee-data">{formData.title || "N/A"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Executor
            </label>
            <div className="view-employee-data">{getExecutorName()}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Problem Description
            </label>
            <div className="view-employee-data">
              {formData.description || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Action No
            </label>
            <div className="view-employee-data">{formData.action || "N/A"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Date Raised
            </label>
            <div className="view-employee-data">
              {formatDate(formData.date_raised)}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Completed By
            </label>
            <div className="view-employee-data">
              {formatDate(formData.date_completed)}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Status</label>
            <div className="view-employee-data">{formData.status}</div>
          </div>

          <div className="flex space-x-10 justify-end">
            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
              Edit
              <button onClick={() => handleEdit(id)}>
                <img
                  src={edits}
                  alt="Edit Icon"
                  className="w-[18px] h-[18px]"
                />
              </button>
            </div>

            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
              Delete
              <button onClick={() => handleDelete()}>
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

export default QmsViewPreventiveActions;