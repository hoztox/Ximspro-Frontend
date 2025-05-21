import React, { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import QmsDeleteComplinaceConfirmModal from "./Modals/QmsDeleteComplinaceConfirmModal";
import QmsDeleteComplianceSuccessModal from "./Modals/QmsDeleteComplianceSuccessModal";
import QmsDeleteComplianceErrorModal from "./Modals/QmsDeleteComplianceErrorModal";

const QmsViewCompliance = () => {
  const [compliance, setCompliance] = useState({
    compliance_name: "",
    compliance_no: "",
    compliance_type: "",
    date: "",
    attach_document: "",
    relate_business_process: "",
    compliance_remarks: "",
    relate_document: "",
    rivision: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [
    showDeleteComplianceSuccessModal,
    setShowDeleteComplianceSuccessModal,
  ] = useState(false);
  const [showDeleteComplianceErrorModal, setShowDeleteComplianceErrorModal] =
    useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Get compliance ID from URL

  useEffect(() => {
    // Fetch compliance data when component mounts
    const fetchComplianceData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/qms/compliances-get/${id}/`,
          {}
        );
        setCompliance(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load compliance data");
        setLoading(false);
        console.error("Error fetching compliance data:", err);
      }
    };

    if (id) {
      fetchComplianceData();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/list-compliance");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edit-compliance/${id}`);
  };

  const initiateDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/compliances-get/${id}/`);
      setShowDeleteModal(false);
      setShowDeleteComplianceSuccessModal(true);
      setTimeout(() => {
        navigate("/company/qms/list-compliance");
      }, 2000);
    } catch (err) {
      console.error("Error deleting compliance:", err);
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
      setShowDeleteComplianceErrorModal(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

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

  // Get file name from path
  const getFileName = (path) => {
    if (!path) return "";
    return path.split("/").pop();
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] rounded-lg p-5 flex justify-center items-center h-96">
        <div className="not-found">Loading compliance data...</div> 
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">
          Compliance / Obligation Information
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
              Compliance/Obligation Name/Title
            </label>
            <div className="view-employee-data">
              {compliance.compliance_name || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Compliance/Obligation Number
            </label>
            <div className="view-employee-data">
              {compliance.compliance_no || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Compliance/Obligation Type
            </label>
            <div className="view-employee-data">
              {compliance.compliance_type || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Date</label>
            <div className="view-employee-data">
              {formatDate(compliance.date) || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Attach Document
            </label>
            {compliance.attach_document ? (
              <a
                href={compliance.attach_document}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 view-employee-data !text-[#1E84AF]"
              >
                {getFileName(compliance.attach_document)}
                <Eye size={17} />
              </a>
            ) : (
              <div className="view-employee-data">No document attached</div>
            )}
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Related Business Processes
            </label>
            <div className="view-employee-data">
              {compliance.relate_business_process || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Compliance/Obligation Remarks
            </label>
            <div className="view-employee-data">
              {compliance.compliance_remarks || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Related Document/Process
            </label>
            <div className="view-employee-data">
              {compliance.relate_document || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Revision
            </label>
            <div className="view-employee-data">
              {compliance.rivision || "N/A"}
            </div>
          </div>

          <div className="flex justify-end items-end space-x-10">
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
              <button onClick={initiateDelete}>
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
      <QmsDeleteComplinaceConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />

      {/* Success Modal */}
      <QmsDeleteComplianceSuccessModal
        showDeleteComplianceSuccessModal={showDeleteComplianceSuccessModal}
        onClose={() => setShowDeleteComplianceSuccessModal(false)}
      />

      {/* Error Modal */}
      <QmsDeleteComplianceErrorModal
        showDeleteComplianceErrorModal={showDeleteComplianceErrorModal}
        onClose={() => setShowDeleteComplianceErrorModal(false)}
        error={error}
      />
    </div>
  );
};

export default QmsViewCompliance;
