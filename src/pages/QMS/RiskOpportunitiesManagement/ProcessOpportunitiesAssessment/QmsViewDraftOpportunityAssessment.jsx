import React from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const QmsViewDraftOpportunityAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Static sample data for demonstration (replace with actual data later)
  const assessmentDetails = {
    id: id,
    activity: "Welding",
    probability: "5",
    benefit: "5",
    opportunity_score: "25",
    action_party: "Test",
    due_date: "2023-03-15",
    opportunity_score_status: "H",
    remarks: "Test",
    potential_opportunity: "Test",
    // Updated to an array for opportunity_action_plan with more data
    opportunity_action_plan: ["Action 1", "Action 2"], // Example list with more items
    approved_by: "Test",
    status: "Cancelled",
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

  const handleCloseViewDraftPage = () => {
    navigate("/company/qms/draft-opportunity-assessment");
  };


  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
        <h1 className="viewhead">Opportunity Assessment Information</h1>
        <button
          className="text-white bg-[#24242D] p-2 rounded-md"
          onClick={handleCloseViewDraftPage}
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
                  Probability: {assessmentDetails.probability || "N/A"}
                </span>
                <span className="whitespace-nowrap">
                  Benefit: {assessmentDetails.benefit || "N/A"}
                </span>
                <span className="whitespace-nowrap">
                  Opportunity Score:{" "}
                  {assessmentDetails.opportunity_score || "N/A"}
                </span>
                <span
                  className={`rounded flex items-center justify-center px-3 h-[21px] ${
                    assessmentDetails.opportunity_score_status === "H"
                      ? "bg-[#dd363611] text-[#dd3636]"
                      : "bg-[#36DDAE11] text-[#36DDAE]"
                  }`}
                >
                  {assessmentDetails.opportunity_score_status || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Opportunity Action Plan:</label>
            <div className="viewdatas">
              {Array.isArray(assessmentDetails.opportunity_action_plan) &&
              assessmentDetails.opportunity_action_plan.length > 0 ? (
                <ol className="list-decimal pl-5 flex flex-col items-end">
                  {assessmentDetails.opportunity_action_plan.map(
                    (action, index) => (
                      <li key={index} className="mb-2">
                        {action}
                      </li>
                    )
                  )}
                </ol>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            {/* Row 3: Owner(s)/Action Party and Approved By */}
            <label className="viewlabels pr-4">Owner(s)/Action Party:</label>
            <p className="viewdatas text-right">
              {assessmentDetails.action_party || "N/A"}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Approved By:</label>
            <p className="viewdatas text-right">
              {assessmentDetails.approved_by || "N/A"}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            {/* Row 4: Due Date and Status */}
            <label className="viewlabels pr-4">Due Date:</label>
            <p className="viewdatas text-right">
              {formatDate(assessmentDetails.due_date) || "N/A"}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Status:</label>
            <p className="viewdatas text-right">
              {assessmentDetails.status || "N/A"}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            {/* Row 5: Remarks and Buttons */}
            <label className="viewlabels pr-4">Remarks:</label>
            <p className="viewdatas text-right">
              {assessmentDetails.remarks || "N/A"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
export default QmsViewDraftOpportunityAssessment;
