import React, { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import QmsDeleteConfirmLegalModal from "./Modals/QmsDeleteConfirmLegalModal";
import QmsDeleteLegalSuccessModal from "./Modals/QmsDeleteLegalSuccessModal";
import QmsDeleteLegalErrorModal from "./Modals/QmsDeleteLegalErrorModal";

const QmsViewLegalRequirements = () => {
  const [legalRequirement, setLegalRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteLegalSuccessModal, setShowDeleteLegalSuccessModal] =
    useState(false);
  const [showDeleteLegalErrorModal, setShowDeleteLegalErrorModal] =
    useState(false);

  useEffect(() => {
    const fetchLegalData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/qms/legal-get/${id}/`);
        setLegalRequirement(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load legal requirement data");
        setLoading(false);
        console.error("Error fetching legal requirement data:", err);
      }
    };

    if (id) {
      fetchLegalData();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/list-legal-requirements");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edit-legal-requirements/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/legal-get/${id}/`);
      setShowDeleteModal(false);
      setShowDeleteLegalSuccessModal(true);
      setTimeout(() => {
        setShowDeleteLegalSuccessModal(false);
        navigate("/company/qms/list-legal-requirements");
      }, 2000);
    } catch (err) {
      console.error("Error deleting legal requirement:", err);
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
      setShowDeleteModal(false);
      setShowDeleteLegalErrorModal(true);
    }
  };

  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowDeleteLegalSuccessModal(false);
    setShowDeleteLegalErrorModal(false);
  };

  const handleViewFile = () => {
    if (legalRequirement?.attach_document) {
      window.open(legalRequirement.attach_document, "_blank");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD-MM-YYYY format
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found rounded-lg p-5">
        <div className="flex justify-center items-center h-64">
          <p>Loading legal requirement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">
          Legal and Other Requirements Information
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
              Legal / Law Name / Title
            </label>
            <div className="view-employee-data">
              {legalRequirement?.legal_name || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Legal / Law Number
            </label>
            <div className="view-employee-data">
              {legalRequirement?.legal_no || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Document Type
            </label>
            <div className="view-employee-data">
              {legalRequirement?.document_type || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Date</label>
            <div className="view-employee-data">
              {formatDate(legalRequirement?.date)}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Attach Document
            </label>
            {legalRequirement?.attach_document ? (
              <button
                onClick={handleViewFile}
                className="flex items-center gap-2 view-employee-data !text-[#1E84AF] cursor-pointer"
              >
                Click to view file
                <Eye size={17} />
              </button>
            ) : (
              <div className="view-employee-data">No document attached</div>
            )}
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Related Record Format
            </label>
            <div className="view-employee-data">
              {legalRequirement?.related_record_format || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Revision
            </label>
            <div className="view-employee-data">
              {legalRequirement?.rivision || "N/A"}
            </div>
          </div>

          <div className="flex justify-end items-end space-x-10">
            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
              Edit
              <button onClick={handleEdit}>
                <img
                  src={edits}
                  alt="Edit Icon"
                  className="w-[16px] h-[16px]"
                />
              </button>
            </div>

            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
              Delete
              <button onClick={handleDelete}>
                <img
                  src={deletes}
                  alt="Delete Icon"
                  className="w-[16px] h-[16px]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <QmsDeleteConfirmLegalModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeAllModals}
      />

      {/* Delete Success Modal */}
      <QmsDeleteLegalSuccessModal
        showDeleteLegalSuccessModal={showDeleteLegalSuccessModal}
        onClose={() => setShowDeleteLegalSuccessModal(false)}
      />

      {/* Delete Error Modal */}
      <QmsDeleteLegalErrorModal
        showDeleteLegalErrorModal={showDeleteLegalErrorModal}
        onClose={() => setShowDeleteLegalErrorModal(false)}
        error={error}
      />
    </div>
  );
};

export default QmsViewLegalRequirements;
