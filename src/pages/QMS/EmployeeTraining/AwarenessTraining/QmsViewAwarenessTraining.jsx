import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteAwarenessTrainingConfirmModal from "../Modals/DeleteAwarenessTrainingConfirmModal";
import DeleteAwarenessTrainingSuccessModal from "../Modals/DeleteAwarenessTrainingSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewAwarenessTraining = () => {
  const [trainingData, setTrainingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [
    showDeleteAwarenessTrainingSuccessModal,
    setShowDeleteAwarenessTrainingSuccessModal,
  ] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/awareness-get/${id}/`
        );
        setTrainingData(response.data);
        setError(null);
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
        console.error("Error fetching awareness training data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrainingData();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/list-awareness-training");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edit-awareness-training/${id}`);
  };

  // Open delete confirmation modal
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowDeleteAwarenessTrainingSuccessModal(false);
    setShowErrorModal(false);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/awareness/${id}/update/`);
      setShowDeleteModal(false);
      setShowDeleteAwarenessTrainingSuccessModal(true);
      setTimeout(() => {
        setShowDeleteAwarenessTrainingSuccessModal(false);
        navigate("/company/qms/list-awareness-training");
      }, 3000);
    } catch (err) {
      console.error("Error deleting awareness training:", err);
      setShowDeleteModal(false);
      setShowErrorModal(true);
    }
  };

  // Helper function to render resource content based on category
  const renderResourceContent = () => {
    if (!trainingData) return null;

    switch (trainingData.category) {
      case "YouTube video":
        return (
          <div>
            <label className="block view-employee-label mb-[6px]">
              YouTube Link
            </label>
            <div className="view-employee-data">
              <a
                href={trainingData.youtube_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {trainingData.youtube_link}
              </a>
            </div>
          </div>
        );

      case "Presentation":
        return (
          <div>
            <label className="block view-employee-label mb-[6px]">
              Presentation File
            </label>
            <div className="view-employee-data">
              {trainingData.upload_file ? (
                <a
                  href={trainingData.upload_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View Presentation
                </a>
              ) : (
                <span className="text-gray-400">No file uploaded</span>
              )}
            </div>
          </div>
        );

      case "Web Link":
        return (
          <div>
            <label className="block view-employee-label mb-[6px]">
              Web Link
            </label>
            <div className="view-employee-data">
              <a
                href={trainingData.web_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {trainingData.web_link}
              </a>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block view-employee-label mb-[6px]">
              Resource
            </label>
            <div className="view-employee-data">N/A</div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found rounded-lg p-5 flex justify-center items-center h-64">
        Loading...
      </div>
    );
  }

  if (!trainingData) {
    return (
      <div className="bg-[#1C1C24] not-found rounded-lg p-5 flex justify-center items-center h-64">
        Training item not found
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Awareness Training Information</h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>

      <div className="p-5 relative">
        {/* Vertical divider line */}
        <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
          <div>
            <label className="block view-employee-label mb-[6px]">Title</label>
            <div className="view-employee-data">{trainingData.title}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Category
            </label>
            <div className="view-employee-data">{trainingData.category}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Description
            </label>
            <div className="view-employee-data">
              {trainingData.description || "N/A"}
            </div>
          </div>

          <div className="flex justify-between">
            {renderResourceContent()}

            <div className="flex space-x-10">
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
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteAwarenessTrainingConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeAllModals}
      />

      {/* Success Modal */}
      <DeleteAwarenessTrainingSuccessModal
        showDeleteAwarenessTrainingSuccessModal={
          showDeleteAwarenessTrainingSuccessModal
        }
        onClose={() => setShowDeleteAwarenessTrainingSuccessModal(false)}
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

export default QmsViewAwarenessTraining;
