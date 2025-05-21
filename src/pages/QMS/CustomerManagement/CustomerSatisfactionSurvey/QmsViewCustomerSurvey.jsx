import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteEmployeeSatisfactionConfirmModal from "../Modals/DeleteEmployeeSatisfactionConfirmModal";
import DeleteEmployeeSatisfactionSuccessModal from "../Modals/DeleteEmployeeSatisfactionSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewCustomerSurvey = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/customer/survey/-get/${id}/`
        );
        setSurveyData(response.data);
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
        console.error("Error fetching customer survey data:", err);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSurveyData();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/list-customer-survey");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edits-customer-survey/${id}`);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/customer/survey/${id}/update/`);
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      setTimeout(() => {
        setShowDeleteSuccessModal(false);
        navigate("/company/qms/list-customer-survey");
      }, 2000);
    } catch (err) {
      console.error("Error deleting customer survey:", err);
      setShowDeleteModal(false);
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

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Format date from YYYY-MM-DD to DD-MM-YYYY
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

  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found rounded-lg p-5 flex justify-center items-center h-64">
        <p className="text-ms not-found">Loading...</p>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="bg-[#1C1C24] not-found rounded-lg p-5 flex justify-center items-center h-64">
        <p className="text-ms not-found">No data found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">
          Customer Satisfaction Survey Information
        </h2>
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
            <label className="block view-employee-label mb-[6px]">
              Survey Title
            </label>
            <div className="view-employee-data">
              {surveyData.title || "No title provided"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Valid Till
            </label>
            <div className="view-employee-data">
              {formatDate(surveyData.valid_till)}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Survey Description
            </label>
            <div className="view-employee-data">
              {surveyData.description || "No description provided"}
            </div>
          </div>

          <div className="flex justify-end items-end space-x-10 md:col-start-2">
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

      {/* Delete Confirmation Modal */}
      <DeleteEmployeeSatisfactionConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />

      {/* Delete Success Modal */}
      <DeleteEmployeeSatisfactionSuccessModal
        showDeleteEmployeeSatisfactionSuccessModal={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
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

export default QmsViewCustomerSurvey;
