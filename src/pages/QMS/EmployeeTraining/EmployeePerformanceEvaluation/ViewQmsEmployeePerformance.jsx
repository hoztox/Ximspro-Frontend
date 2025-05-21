import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import "./viewqmsemployeeperformance.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteEmployeePerformanceConfirmModal from "../Modals/DeleteEmployeePerformanceConfirmModal";
import DeleteEmployeePerformanceSuccessModal from "../Modals/DeleteEmployeePerformanceSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const ViewQmsEmployeePerformance = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [
    showDeleteEmployeePerformanceSuccessModal,
    setShowDeleteEmployeePerformanceSuccessModal,
  ] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/performance-get/${id}/`
        );
        setPerformanceData(response.data);
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
        console.error("Error fetching employee performance data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPerformanceData();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/employee-performance");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edit-employee-performance/${id}`);
  };

  // Open delete confirmation modal
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowDeleteEmployeePerformanceSuccessModal(false);
    setShowErrorModal(false);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/performance/${id}/update/`);
      setShowDeleteModal(false);
      setShowDeleteEmployeePerformanceSuccessModal(true);
      setTimeout(() => {
        setShowDeleteEmployeePerformanceSuccessModal(false);
        navigate("/company/qms/employee-performance");
      }, 1500);
    } catch (err) {
      console.error("Error deleting performance evaluation:", err);
      let errorMsg =  err.message;

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
      setShowDeleteModal(false);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
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
      <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-64">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-64">
        <p className="text-xl">No data found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">
          Employee Performance Evaluation Information
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
              Evaluation Title
            </label>
            <div className="view-employee-data">
              {performanceData.evaluation_title || "Anonymous"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Evaluation Description
            </label>
            <div className="view-employee-data">
              {performanceData.description || "No description provided"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Valid Till
            </label>
            <div className="view-employee-data">
              {formatDate(performanceData.valid_till)}
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
      <DeleteEmployeePerformanceConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeAllModals}
      />

      {/* Success Modal */}
      <DeleteEmployeePerformanceSuccessModal
        showDeleteEmployeePerformanceSuccessModal={
          showDeleteEmployeePerformanceSuccessModal
        }
        onClose={() => setShowDeleteEmployeePerformanceSuccessModal(false)}
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

export default ViewQmsEmployeePerformance;
