import React, { useState, useEffect } from "react";
import { X, Eye, ChevronDown } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";
import DeleteTrainingConfirmModal from "../Modals/DeleteTrainingConfirmModal";
import DeleteTrainingSuccessModal from "../Modals/DeleteTrainingSuccessModal";

const QmsReviewTraining = () => {
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
    send_notification: false,
  });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedDropdown, setFocusedDropdown] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteTrainingSuccessModal, setShowDeleteTrainingSuccessModal] = useState(false);

  const { id } = useParams(); // Get training ID from URL
  const navigate = useNavigate();

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setTraining({
        ...training,
        [name]: checked,
      });
      return;
    }

    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setTraining({
        ...training,
        [parent]: {
          ...training[parent],
          [child]: value,
        },
      });
    } else {
      setTraining({
        ...training,
        [name]: value,
      });
    }
  };

  // Function to get user company ID from localStorage
  const getUserCompanyId = () => {
    return localStorage.getItem("company_id") || "";
  };

  // Format time from HH:MM:SS to readable format
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours} hour${hours !== "1" ? "s" : ""}, ${minutes} minute${minutes !== "1" ? "s" : ""
      }`;
  };

  useEffect(() => {
    // Fetch training data when component mounts
    const fetchTrainingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/qms/training-get/${id}/`);
        setTraining(response.data);
        setSelectedStatus(response.data.status); // Initialize selected status
        setLoading(false);
        console.log("Training data loaded:", response.data);
      } catch (err) {
        setError("Failed to load training data");
        setLoading(false);
        console.error("Error fetching training data:", err);
      }
    };

    if (id) {
      fetchTrainingData();
    }
  }, [id]);

  const handleStatusUpdate = async () => {
    // If the status hasn't changed, don't do anything
    if (selectedStatus === training.status) {
      alert("Status unchanged");
      return;
    }

    try {
      if (!id) {
        alert("Training ID not found");
        return;
      }

      setIsProcessing(true);

      const userId = localStorage.getItem("user_id");
      const companyId = localStorage.getItem("company_id");
      const publisherId = userId || companyId;

      if (!publisherId) {
        alert("User information not found. Please log in again.");
        setIsProcessing(false);
        return;
      }

      if (selectedStatus === "Completed") {
        await axios.post(`${BASE_URL}/qms/training/${id}/complete/`, {
          company_id: getUserCompanyId(),
          published_by: userId,
          send_notification: training.send_notification,
        });

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/company/qms/list-training");
        }, 1500);
        setSuccessMessage("Training marked as completed")
      } else if (selectedStatus === "Cancelled") {
        await axios.post(`${BASE_URL}/qms/training/${id}/cancel/`, {
          company_id: getUserCompanyId(),
          cancelled_by: userId,
        });
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/company/qms/list-training");
        }, 1500);
        setSuccessMessage("Training marked as cancelled")
      }

      setTimeout(() => {
        setIsProcessing(false);
        // Update the status
        setTraining({
          ...training,
          status: selectedStatus,
        });
      }, 1500);
    } catch (error) {
      console.error(
        `Error updating training status to ${selectedStatus}:`,
        error
      );
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

      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleClose = () => {
    navigate("/company/qms/list-training");
  };

  const handleEdit = () => {
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
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
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
              <p className="text-white view-training-data">
                {training.training_attendees &&
                  training.training_attendees.length > 0
                  ? training.training_attendees
                    .map(
                      (attendee) =>
                        `${attendee.first_name} ${attendee.last_name}`
                    )
                    .join(", ")
                  : "None specified"}
              </p>
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
                {formatDate(training.date_conducted) || "N/A"}
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
                  className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${training.status === "Completed"
                    ? "bg-[#36DDAE11] text-[#36DDAE]"
                    : training.status === "Cancelled"
                      ? "bg-[#FF4D4F11] text-[#FF4D4F]"
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
                {formatDate(training.date_planned) || "N/A"}
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
                  Update Status
                </p>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      onFocus={() => setFocusedDropdown("selectedStatus")}
                      onBlur={() => setFocusedDropdown(null)}
                      disabled={isProcessing}
                      className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      {training.status !== "Completed" &&
                        training.status !== "Cancelled" && (
                          <option value={training.status}>
                            {training.status}
                          </option>
                        )}
                    </select>
                    <ChevronDown
                      className={`absolute right-2 top-1/3 transform transition-transform duration-300
  ${focusedDropdown === "selectedStatus" ? "rotate-180" : ""}`}
                      size={20}
                      color="#AAAAAA"
                    />
                  </div>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={
                      isProcessing || selectedStatus === training.status
                    }
                    className={`request-correction-btn duration-200 ${isProcessing || selectedStatus === training.status
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-[#176b8f]"
                      }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        Updating...
                      </div>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-10">
                <button
                  onClick={handleEdit}
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

      {/* Delete Success Modal */}
      <DeleteTrainingSuccessModal
        showDeleteTrainingSuccessModal={showDeleteTrainingSuccessModal}
        onClose={() => setShowDeleteTrainingSuccessModal(false)}
      />
    </div>
  );
};

export default QmsReviewTraining;