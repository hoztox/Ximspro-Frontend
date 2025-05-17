import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteInternalConfirmModal from "../Modals/DeleteInternalConfirmModal";
import DeleteInternalSuccessModal from "../Modals/DeleteInternalSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewInternalProblems = () => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Delete modal states (updated to match QmsListInternalProblems)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteInternalSuccessModal, setShowDeleteInternalSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchProblemData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/qms/internal-problems/${id}/`
        );
        setProblem(response.data);
        setLoading(false);
        console.log("Data loaded:", response.data);
      } catch (err) {
        console.error("Error fetching internal problem:", err);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 2000);
        let errorMsg = 'Failed to fetch internal problem data.';

        if (err.response) {
          // Check for field-specific errors first
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          }
          // Check for non-field errors
          else if (err.response.data.detail) {
            errorMsg = err.response.data.detail;
          }
          else if (err.response.data.message) {
            errorMsg = err.response.data.message;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }

        setError(errorMsg);
        setLoading(false);
      }
    };

    if (id) {
      fetchProblemData();
    }
  }, [id]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleClose = () => {
    navigate("/company/qms/list-internal-problem");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edit-internal-problem/${id}`);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/internal-problems/${id}/`);
      setShowDeleteModal(false);
      setShowDeleteInternalSuccessModal(true);
      setTimeout(() => {
        setShowDeleteInternalSuccessModal(false);
        navigate("/company/qms/list-internal-problem");
      }, 3000);
    } catch (error) {
      console.error("Error deleting internal problem:", error);
      let errorMsg = "Failed to delete internal problem. Please try again.";

      if (error.response) {
        if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
      setShowDeleteModal(false);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowDeleteInternalSuccessModal(false);
  };

  if (!problem) {
    return (
      <div className="bg-[#1C1C24] rounded-lg p-5 min-h-[300px] flex justify-center items-center">
        <div className="not-found">
          No data found for this internal problem.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />

      {/* Delete confirmation modal */}
      <DeleteInternalConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={closeAllModals}
      />

      {/* Success modal */}
      <DeleteInternalSuccessModal
        showDeletetInternalSuccessModal={showDeleteInternalSuccessModal}
        onClose={() => setShowDeleteInternalSuccessModal(false)}
      />

      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">
          Internal Problems and Observations Information
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
              Select Causes / Root Cause
            </label>
            <div className="view-employee-data">
              {problem.cause ? problem.cause.title : "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Problem/ Observation Description
            </label>
            <div className="view-employee-data">{problem.problem || "N/A"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Immediate Action Taken
            </label>
            <div className="view-employee-data">
              {problem.immediate_action || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Executor
            </label>
            <div className="view-employee-data">
              {problem.executor
                ? `${problem.executor.first_name} ${problem.executor.last_name}`
                : "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Solved After Action?
            </label>
            <div className="view-employee-data">
              {problem.solve_after_action || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Date Problem
            </label>
            <div className="view-employee-data">{formatDate(problem.date)}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Corrective Action Needed?
            </label>
            <div className="view-employee-data">
              {problem.corrective_action || "N/A"}
            </div>
          </div>

          {problem.car_no && (
            <div>
              <label className="block view-employee-label mb-[6px]">
                CAR Number
              </label>
              <div className="view-employee-data">
                {problem.car_no.action_no || "N/A"}
              </div>
            </div>
          )}

          {problem.correction && (
            <div className="md:col-span-1">
              <label className="block view-employee-label mb-[6px]">
                Correction
              </label>
              <div className="view-employee-data">{problem.correction}</div>
            </div>
          )}

          <div className="md:col-span-1 flex justify-end">
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
    </div>
  );
};

export default QmsViewInternalProblems;
