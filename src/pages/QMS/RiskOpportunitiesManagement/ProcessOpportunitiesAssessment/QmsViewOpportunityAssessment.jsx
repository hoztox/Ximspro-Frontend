import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import DeleteConfimModal from "../../../../components/Modals/DeleteConfimModal";
import SuccessModal from "../../../../components/Modals/SuccessModal";
import ErrorModal from "../../../../components/Modals/ErrorModal";

const QmsViewOpportunityAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [assessmentDetails, setAssessmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  const fetchAssessmentDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${BASE_URL}/qms/risk-opportunity/${id}/`);
      setAssessmentDetails(response.data);
      console.log("Fetched assessment details:", response.data);
    } catch (error) {
      console.error("Error fetching assessment details:", error);
      setError("Failed to load opportunity assessment details");
      setModalErrorMessage("Failed to load opportunity assessment details");
      setShowErrorModal(true);

      if (error.response?.status === 404) {
        navigate("/company/qms/list-opportunity-assessment");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAssessmentDetails();
    } else {
      setError("Invalid assessment ID");
      setModalErrorMessage("Invalid assessment ID");
      setShowErrorModal(true);
      setLoading(false);
    }
  }, [id]);

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

  const formatUserName = (user) => {
    if (!user) return "N/A";
    if (typeof user === "string") return user;

    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    const username = user.username || "";

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else if (username) {
      return username;
    }

    return "N/A";
  };

  const formatOwners = (owners) => {
    if (!owners || !Array.isArray(owners)) return null;
    return owners.map((owner) => formatUserName(owner));
  };

  const formatActions = (actions) => {
    if (!actions || !Array.isArray(actions)) return "N/A";
    return actions.map((action) => action.action || action).join(", ");
  };

  const getRiskRanking = (score) => {
    if (!score) return "N/A";
    const numScore = parseInt(score);
    if (numScore >= 15) return "VH";
    if (numScore >= 8) return "H";
    if (numScore >= 4) return "M";
    if (numScore >= 1) return "L";
    return "N/A";
  };

  const getRankingColor = (ranking) => {
    switch (ranking) {
      case "VH":
        return "bg-[#dd363611] text-[#dd3636]";
      case "H":
        return "bg-[#DD6B0611] text-[#DD6B06]";
      case "M":
        return "bg-[#FFD70011] text-[#FFD700]";
      case "L":
        return "bg-[#36DDAE11] text-[#36DDAE]";
      default:
        return "bg-[#85858550] text-[#858585]";
    }
  };

  const handleCloseViewPage = () => {
    navigate("/company/qms/list-opportunity-assessment");
  };

  const handleEditAssessment = () => {
    navigate(`/company/qms/edit-opportunity-assessment/${id}`);
  };

  const handleDeleteAssessment = () => {
    if (!assessmentDetails) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setShowDeleteModal(false);

      await axios.delete(`${BASE_URL}/qms/risk-opportunity/${id}/`);

      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/company/qms/list-opportunity-assessment");
      }, 2000);
    } catch (error) {
      console.error("Error deleting assessment:", error);
      setModalErrorMessage("Failed to delete assessment. Please try again.");
      setShowErrorModal(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] p-5 rounded-lg flex justify-center items-center">
        <p className="not-found">Loading Opportunity Assessment...</p>
      </div>
    );
  }

  if (error && !assessmentDetails) {
    return (
      <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
        <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
          <h1 className="viewhead">Opportunity Assessment Information</h1>
          <button
            className="text-white bg-[#24242D] p-2 rounded-md"
            onClick={handleCloseViewPage}
          >
            <X size={22} />
          </button>
        </div>
        <div className="text-red-500 text-center mt-8 mb-4">{error}</div>
        <div className="text-center">
          <button
            onClick={fetchAssessmentDetails}
            className="border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white duration-200 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
        <ErrorModal
          showErrorModal={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          error={modalErrorMessage}
        />
      </div>
    );
  }

  if (!assessmentDetails) {
    return null;
  }

  const opportunityRanking = getRiskRanking(assessmentDetails.opportunity_score);

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
        <h1 className="viewhead">Opportunity Assessment Information</h1>
        <button
          className="text-white bg-[#24242D] p-2 rounded-md"
          onClick={handleCloseViewPage}
        >
          <X size={22} />
        </button>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-x-10 gap-y-[36px] pb-5">
          {/* Row 1: Activity/Process and Potential Opportunity */}
          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Activity/Process:</label>
            <p className="viewdatas text-right">
              {assessmentDetails.activity || "N/A"}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Potential Opportunity:</label>
            <p className="viewdatas text-right">
              {assessmentDetails.potential_opportunity || "N/A"}
            </p>
          </div>

          {/* Row 2: Opportunity and Opportunity Action Plan */}
          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3 h-[33.8px]">
            <label className="viewlabels pr-4">Opportunity:</label>
            <div className="relative">
              <p className="viewdatas flex gap-3 absolute right-0">
                <span className="whitespace-nowrap">
                  Probability: {assessmentDetails.probability || assessmentDetails.opportunity || "N/A"}
                </span>
                <span className="whitespace-nowrap">
                  Benefit: {assessmentDetails.benefit || "N/A"}
                </span>
                <span className="whitespace-nowrap">
                  Opportunity Score: {assessmentDetails.opportunity_score || "N/A"}
                </span>
                <span
                  className={`rounded flex items-center justify-center px-3 h-[21px] whitespace-nowrap ${getRankingColor(opportunityRanking)}`}
                >
                  {opportunityRanking}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Opportunity Action Plan:</label>
            <div className="viewdatas">
              {assessmentDetails.opportunity_action_plan || assessmentDetails.actions ? (
                <div className="text-right">
                  {assessmentDetails.opportunity_action_plan ? (
                    Array.isArray(assessmentDetails.opportunity_action_plan) ? (
                      <ol className="list-decimal pl-5 flex flex-col items-end">
                        {assessmentDetails.opportunity_action_plan.map((action, index) => (
                          <li key={index} className="mb-2">
                            {action}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>{assessmentDetails.opportunity_action_plan}</p>
                    )
                  ) : assessmentDetails.actions ? (
                    <div className="text-right">
                      {assessmentDetails.actions.map((actionObj, index) => (
                        <div key={index} className="mb-2">
                          {actionObj.action || actionObj}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>

          {/* Row 3: Owner(s)/Action Party and Approved By */}
          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Owner(s)/Action Party:</label>
            <div className="viewdatas">
              {assessmentDetails.action_party ? (
                <p className="text-right">{assessmentDetails.action_party}</p>
              ) : formatOwners(assessmentDetails.owners) ? (
                <div className="text-right">
                  {formatOwners(assessmentDetails.owners).map((owner, index) => (
                    <div key={index} className="mb-2">
                      {owner}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-right">N/A</p>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Approved By:</label>
            <p className="viewdatas text-right">
              {formatUserName(assessmentDetails.approved_by)}
            </p>
          </div>

          {/* Row 4: Due Date and Status */}
          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Due Date:</label>
            <p className="viewdatas text-right">
              {formatDate(assessmentDetails.date || assessmentDetails.due_date)}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Status:</label>
            <p className="viewdatas text-right">
              <span
                className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${
                  assessmentDetails.status === "Achieved"
                    ? "bg-[#36DDAE11] text-[#36DDAE]"
                    : assessmentDetails.status === "Not Achieved"
                    ? "bg-[#dd363611] text-[#dd3636]"
                    : assessmentDetails.status === "Cancelled"
                    ? "bg-[#1E84AF11] text-[#1E84AF]"
                    : "bg-[#FFD70011] text-[#FFD700]"
                }`}
              >
                {assessmentDetails.status || "N/A"}
              </span>
            </p>
          </div>

          {/* Row 5: Remarks and Buttons */}
          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Remarks:</label>
            <p className="viewdatas text-right">
              {assessmentDetails.remarks || "N/A"}
            </p>
          </div>

          <div className="flex justify-end items-center">
            <div className="flex gap-5">
              <div className="flex flex-col justify-center items-center">
                <button
                  className="border border-[#F9291F] rounded w-[148px] h-[41px] text-[#F9291F] hover:bg-[#F9291F] hover:text-white duration-200 buttons disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeleteAssessment}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
              <div className="flex flex-col justify-center items-center">
                <button
                  className="border border-[#1E84AF] rounded w-[148px] h-[41px] text-[#1E84AF] hover:bg-[#1E84AF] hover:text-white duration-200 buttons"
                  onClick={handleEditAssessment}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfimModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        deleteMessage={"Opportunity Assessment"}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        successMessage="Opportunity Assessment Deleted Successfully!"
      />
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={modalErrorMessage}
      />
    </div>
  );
};

export default QmsViewOpportunityAssessment;