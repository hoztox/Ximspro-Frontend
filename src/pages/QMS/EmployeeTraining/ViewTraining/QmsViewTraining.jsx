import React, { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import "./qmsviewtraining.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteTrainingConfirmModal from "../Modals/DeleteTrainingConfirmModal";
import DeleteTrainingSuccessModal from "../Modals/DeleteTrainingSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewTraining = () => {
  const [training, setTraining] = useState({
    training_title: "",
    type_of_training: "",
    expected_results: "",
    actual_results: "",
    training_attendees: [],
    status: "",
    requested_by: null,
    date_planned: "",
    date_conducted: "",
    start_time: "",
    end_time: "",
    venue: "",
    attachment: null,
    training_evaluation: "",
    evaluation_date: "",
    evaluation_by: null,
    is_draft: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteTrainingSuccessModal, setShowDeleteTrainingSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const [hours, minutes] = timeString.split(":");
      return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return timeString;
    }
  };

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/qms/training-get/${id}/`);
        setTraining(response.data);
        setLoading(false);
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
        setLoading(false);
        console.error("Error fetching training data:", err);
      }
    };

    if (id) {
      fetchTrainingData();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/list-training");
  };

  const handleEdit = (id) => {
    navigate(`/company/qms/edit-training/${id}`);
  };

  // Delete training handlers
  const initiateDeleteTraining = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteTraining = async () => {
    try {
      setShowDeleteModal(false);
      await axios.delete(`${BASE_URL}/qms/training-get/${id}/`);
      setShowDeleteTrainingSuccessModal(true);
      setTimeout(() => {
        setShowDeleteTrainingSuccessModal(false);
        navigate("/company/qms/list-training");
      }, 2000);
    } catch (err) {
      console.error("Error deleting training:", err);
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
    }
  };

  const cancelDeleteTraining = () => {
    setShowDeleteModal(false);
  };

  return (
    <div>
      <div className="bg-[#1C1C24] text-white rounded-lg w-full p-5">
        <div className="flex justify-between items-center border-b border-[#383840] pb-5">
          <h2 className="training-info-head">Training Information</h2>
          <button
            onClick={handleClose}
            className="text-white bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
          >
            <X size={24} />
          </button>
        </div>

        <div className="pt-5 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-[40px] border-r border-[#383840]">
            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Training Title
              </p>
              <p className="text-white view-training-data">
                {training.training_title}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Expected Results
              </p>
              <p className="text-white view-training-data">
                {training.expected_results || "None specified"}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Training Attendees
              </p>
              <div className="text-white view-training-data">
                {training.training_attendees &&
                training.training_attendees.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {training.training_attendees.map((attendee, index) => (
                      <li key={index}>
                        {attendee.first_name} {attendee.last_name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>None specified</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Requested By
              </p>
              <p className="text-white view-training-data">
                {training.requested_by
                  ? `${training.requested_by.first_name} ${training.requested_by.last_name}`
                  : "None specified"}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Date Conducted
              </p>
              <p className="text-white view-training-data">
                {formatDate(training.date_conducted)}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                End Time
              </p>
              <p className="text-white view-training-data">
                {formatTime(training.end_time)}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Attachment
              </p>
              {training.attachment ? (
                <button
                  onClick={() => window.open(training.attachment, "_blank")}
                  className="text-[#1E84AF] flex items-center gap-2 click-view-file-btn !text-[18px]"
                >
                  Click to view file{" "}
                  <Eye size={20} className="text-[#1E84AF]" />
                </button>
              ) : (
                <p className="text-white view-training-data">No attachment</p>
              )}
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Evaluation Date
              </p>
              <p className="text-white view-training-data">
                {formatDate(training.evaluation_date) || "Not evaluated yet"}
              </p>
            </div>
          </div>

          <div className="space-y-[40px] ml-5">
            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Type of Training
              </p>
              <p className="text-white view-training-data">
                {training.type_of_training}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Actual Results
              </p>
              <p className="text-white view-training-data">
                {training.actual_results || "None specified"}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Status
              </p>
              <p className="text-white view-training-data">
                <span
                  className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${
                    training.status === "Completed"
                      ? "bg-[#36DDAE11] text-[#36DDAE]"
                      : training.status === "Cancelled"
                      ? "bg-[#FF000011] text-[#FF0000]"
                      : "bg-[#ddd23611] text-[#ddd236]"
                  }`}
                >
                  {training.status}
                </span>
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Date Planned
              </p>
              <p className="text-white view-training-data">
                {formatDate(training.date_planned)}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Start Time
              </p>
              <p className="text-white view-training-data">
                {formatTime(training.start_time)}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Venue
              </p>
              <p className="text-white view-training-data">{training.venue}</p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Training Evaluation
              </p>
              <p className="text-white view-training-data">
                {training.training_evaluation || "Not evaluated yet"}
              </p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                  Evaluation By
                </p>
                <p className="text-white view-training-data">
                  {training.evaluation_by
                    ? `${training.evaluation_by.first_name} ${training.evaluation_by.last_name}`
                    : "None specified"}
                </p>
              </div>
              <div className="flex gap-10">
                <button
                  onClick={() => handleEdit(id)}
                  className="flex flex-col gap-2 items-center justify-center edit-btn"
                >
                  Edit
                  <img
                    src={edits}
                    alt="Edit Icon"
                    className="w-[18px] h-[18px]"
                  />
                </button>

                <button
                  onClick={initiateDeleteTraining}
                  className="flex flex-col gap-2 items-center justify-center delete-btn"
                >
                  Delete
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
      <DeleteTrainingConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDeleteTraining}
        onCancel={cancelDeleteTraining}
      />

      {/* Success Modal */}
      <DeleteTrainingSuccessModal
        showDeleteTrainingSuccessModal={showDeleteTrainingSuccessModal}
        onClose={() => setShowDeleteTrainingSuccessModal(false)}
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

export default QmsViewTraining;
