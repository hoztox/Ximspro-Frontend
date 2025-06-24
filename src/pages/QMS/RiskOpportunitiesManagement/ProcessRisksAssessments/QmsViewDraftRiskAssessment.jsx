import React from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const QmsViewDraftRiskAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Static sample data for demonstration (replace with actual data later)
  const riskAssessmentDetails = {
    id: id,
    activity: "Welding",
    hazard: "Test",
    risks: ["Risk 1", "Risk 2"],
    probability: "5",
    benefit: "5",
    risk_score: "25",
    risk_score_status: "H",
    action_owner: "Test",
    control_measures: ["Control Measure 1", "Control Measure 2"],
    required_control_measures: [
      "Required Control Measure 1",
      "Required Control Measure 2",
    ],
    residual_probability: "5",
    residual_benefit: "5",
    residual_risk_score: "25",
    residual_risk_score_status: "H",
    review_date: "2023-03-15",
    remarks: "Test",
  };

  const formatReviewDate = (dateString) => {
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

  const navigateToRiskAssessmentList = () => {
    navigate("/company/qms/draft-process-risks-assessments");
  };

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
        <h1 className="viewhead">Risk Assessment Information</h1>
        <button
          className="text-white bg-[#24242D] p-2 rounded-md"
          onClick={navigateToRiskAssessmentList}
        >
          <X size={22} />
        </button>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-x-10 gap-y-[36px] pb-5">
          {/* Row 1: Activity and Hazard */}
          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Activity:</label>
            <p className="viewdatas text-right">
              {riskAssessmentDetails.activity || "N/A"}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Hazard:</label>
            <p className="viewdatas text-right">
              {riskAssessmentDetails.hazard || "N/A"}
            </p>
          </div>

          {/* Row 2: Risks and Risk Assessment */}
          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Risk(s):</label>
            <div className="viewdatas">
              {Array.isArray(riskAssessmentDetails.risks) &&
              riskAssessmentDetails.risks.length > 0 ? (
                <ol className="list-decimal pl-5 flex flex-col items-end">
                  {riskAssessmentDetails.risks.map((risk, index) => (
                    <li key={index} className="mb-2">
                      {risk}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3 h-[33.8px]">
            <label className="viewlabels pr-4">Risk Assessment:</label>
            <div className="relative">
              <p className="viewdatas flex gap-3 absolute right-0">
                <span className="whitespace-nowrap">
                  Probability: {riskAssessmentDetails.probability || "N/A"}
                </span>
                <span className="whitespace-nowrap">
                  Benefit: {riskAssessmentDetails.benefit || "N/A"}
                </span>
                <span className="whitespace-nowrap">
                  Risk Score: {riskAssessmentDetails.risk_score || "N/A"}
                </span>
                <span
                  className={`rounded flex items-center justify-center px-3 h-[21px] whitespace-nowrap ${
                    riskAssessmentDetails.risk_score_status === "H"
                      ? "bg-[#dd363611] text-[#dd3636]"
                      : "bg-[#36DDAE11] text-[#36DDAE]"
                  }`}
                >
                  {riskAssessmentDetails.risk_score_status || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Row 3: Control Measures and Required Control Measures */}
          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Control Measures:</label>
            <div className="viewdatas">
              {Array.isArray(riskAssessmentDetails.control_measures) &&
              riskAssessmentDetails.control_measures.length > 0 ? (
                <ol className="list-decimal pl-5 flex flex-col items-end">
                  {riskAssessmentDetails.control_measures.map(
                    (measure, index) => (
                      <li key={index} className="mb-2">
                        {measure}
                      </li>
                    )
                  )}
                </ol>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">
              Required Control Measures:
            </label>
            <div className="viewdatas">
              {Array.isArray(riskAssessmentDetails.required_control_measures) &&
              riskAssessmentDetails.required_control_measures.length > 0 ? (
                <ol className="list-decimal pl-5 flex flex-col items-end">
                  {riskAssessmentDetails.required_control_measures.map(
                    (measure, index) => (
                      <li key={index} className="mb-2">
                        {measure}
                      </li>
                    )
                  )}
                </ol>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>

          {/* Row 4: Action Owner and Residual Risk */}
          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Action Owner:</label>
            <p className="viewdatas text-right">
              {riskAssessmentDetails.action_owner || "N/A"}
            </p>
          </div>

          <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3 h-[33.8px]">
            <label className="viewlabels pr-4">Residual Risk:</label>
            <div className="relative">
              <p className="viewdatas flex gap-3 absolute right-0">
                <span className="whitespace-nowrap">
                  Probability:{" "}
                  {riskAssessmentDetails.residual_probability || "N/A"}
                </span>
                <span className="whitespace-nowrap">
                  Benefit: {riskAssessmentDetails.residual_benefit || "N/A"}
                </span>
                <span className="whitespace-nowrap">
                  Risk Score:{" "}
                  {riskAssessmentDetails.residual_risk_score || "N/A"}
                </span>
                <span
                  className={`rounded flex items-center justify-center px-3 h-[21px] whitespace-nowrap ${
                    riskAssessmentDetails.residual_risk_score_status === "H"
                      ? "bg-[#dd363611] text-[#dd3636]"
                      : "bg-[#36DDAE11] text-[#36DDAE]"
                  }`}
                >
                  {riskAssessmentDetails.residual_risk_score_status || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Row 5: Review Date and Remarks */}
          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Review Date:</label>
            <p className="viewdatas text-right">
              {formatReviewDate(riskAssessmentDetails.review_date) || "N/A"}
            </p>
          </div>

          <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
            <label className="viewlabels pr-4">Remarks:</label>
            <p className="viewdatas text-right">
              {riskAssessmentDetails.remarks || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QmsViewDraftRiskAssessment;
