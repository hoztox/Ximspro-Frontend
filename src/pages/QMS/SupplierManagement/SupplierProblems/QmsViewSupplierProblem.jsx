import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import axios from "axios";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewSupplierProblem = () => {
  const [formData, setFormData] = useState({
    supplier: {},
    date: "",
    problem: "",
    immediate_action: "",
    executor: "",
    solved: "",
    corrective_action_need: "",
    no_car: null,
    corrections: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("Supplier Problem");

  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from URL params

  // Fetch supplier problem data when component mounts
  useEffect(() => {
    const fetchSupplierProblem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/supplier-problems/${id}/`
        );
        console.log("viewwww", response);

        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching supplier problem data:", err);
        let errorMsg = err.message;

        if (err.response) {
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          } else if (err.response.data.detail) {
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
        setLoading(false);
      }
    };

    if (id) {
      fetchSupplierProblem();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/supplier-problem-log");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edits-supplier-problem/${id}`);
  };

  // Open delete confirmation modal
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/supplier-problems/${id}/`);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setSuccessMessage("Supplier problem deleted successfully");
      setTimeout(() => {
        navigate("/company/qms/supplier-problem-log");
      }, 2000);
    } catch (err) {
      console.error("Error deleting supplier problem:", err);
      let errorMsg = "Failed to delete supplier problem";

      if (err.response) {
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        } else if (err.response.data.detail) {
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
      setShowDeleteModal(false);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found rounded-lg p-5 flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Supplier Problem Information</h2>
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
              Supplier Name
            </label>
            <div className="view-employee-data">
              {formData.supplier && formData.supplier.company_name
                ? formData.supplier.company_name
                : "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Date</label>
            <div className="view-employee-data">{formData.date || "N/A"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Problem
            </label>
            <div className="view-employee-data">
              {formData.problem || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Immediate Action
            </label>
            <div className="view-employee-data">
              {formData.immediate_action || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Executor
            </label>
            <div className="view-employee-data">
              {typeof formData.executor === "object" &&
              formData.executor !== null
                ? formData.executor.name ||
                  formData.executor.username ||
                  formData.executor.id
                : formData.executor || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Solved</label>
            <div className="view-employee-data">{formData.solved || "N/A"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Corrective Action Needed?
            </label>
            <div className="view-employee-data">
              {formData.corrective_action_need || "N/A"}
            </div>
          </div>

          {formData.no_car && (
            <div>
              <label className="block view-employee-label mb-[6px]">
                CAR Number
              </label>
              <div className="view-employee-data">
                {formData.no_car.title ? formData.no_car.action_no : "N/A"}
              </div>
            </div>
          )}

          {formData.corrections && (
            <div>
              <label className="block view-employee-label mb-[6px]">
                Corrections
              </label>
              <div className="view-employee-data">{formData.corrections}</div>
            </div>
          )}

          <div className="flex space-x-10 justify-end md:col-span-2">
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
      <DeleteConfimModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeAllModals}
        deleteMessage={deleteMessage}
      />

      {/* Success Modal */}
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/company/qms/supplier-problem-log");
        }}
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

export default QmsViewSupplierProblem;
