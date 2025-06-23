import React from "react";
import { X, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const QmsViewOpportunityAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Static sample data for demonstration (replace with actual data later)
  const assessmentDetails = {
    id: id,
    activity: "Welding",
    opportunity: "Anonymous",
    action_party: "25",
    due_date: "H",
    remarks: "https://example.com/sample.pdf",
    potential_opportunity: { id: 1, first_name: "John", last_name: "Doe" },
    opportunity_action_plan: { id: 2, first_name: "Jane", last_name: "Smith" },
    approved_by: null,
    status: "Pending for Review/Checking",
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

  const handleCloseViewPage = () => {
    navigate("/company/qms/list-opportunity-assessment");
  };

  const handleEditAssessment = () => {
    navigate(`/company/qms/edit-opportunity-assessment/${id}`);
  };

  const handleDeleteAssessment = () => {
    // Placeholder for delete action (to be implemented later)
    console.log("Delete assessment:", id);
    navigate("/company/qms/list-opportunity-assessment");
  };

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
      <div className="mt-5">
        <div className="grid grid-cols-2 pb-5">
          <div className="grid grid-cols-1 gap-[36px]">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Activity/Process:</label>
              <p className="viewdatas">{assessmentDetails.activity || "N/A"}</p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Opportunity:</label>
              <p className="viewdatas">{assessmentDetails.opportunity || "N/A"}</p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Owner(s)/Action Party:</label>
              <p className="viewdatas">{assessmentDetails.action_party || "N/A"}</p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Ranking</label>
              <p className="viewdatas">
                <span
                  className={`inline-block rounded-[4px] px-[15px] py-[5px] text-xs ${
                    assessmentDetails.due_date === "H"
                      ? "bg-[#dd363611] text-[#dd3636]"
                      : "bg-[#36DDAE11] text-[#36DDAE]"
                  }`}
                >
                  {assessmentDetails.due_date || "N/A"}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Attach Document</label>
              <div
                className="flex items-center cursor-pointer gap-[8px]"
                onClick={() => {
                  if (assessmentDetails.remarks) {
                    window.open(assessmentDetails.remarks, "_blank");
                  }
                }}
              >
                <p className="viewdatas">
                  {assessmentDetails.remarks ? "Click to view file" : "No file attached"}
                </p>
                {assessmentDetails.remarks && (
                  <Eye size={20} className="text-[#1E84AF]" />
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[36px] pl-10">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Written/Prepared By</label>
              <p className="viewdatas">
                {assessmentDetails.potential_opportunity
                  ? `${assessmentDetails.potential_opportunity.first_name} ${assessmentDetails.potential_opportunity.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Checked/Reviewed By</label>
              <p className="viewdatas">
                {assessmentDetails.opportunity_action_plan
                  ? `${assessmentDetails.opportunity_action_plan.first_name} ${assessmentDetails.opportunity_action_plan.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Approved By</label>
              <p className="viewdatas">
                {assessmentDetails.approved_by
                  ? `${assessmentDetails.approved_by.first_name} ${assessmentDetails.approved_by.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Due Date</label>
              <p className="viewdatas">{formatDate(assessmentDetails.due_date)}</p>
            </div>
            <div className="flex justify-end items-center">
                <div className="flex gap-5">
                  <div className="flex flex-col justify-center items-center">
                    <button
                      className="border border-[#F9291F] rounded w-[148px] h-[41px] text-[#F9291F] hover:bg-[#F9291F] hover:text-white duration-200 buttons"
                      onClick={handleDeleteAssessment}
                    >
                      Delete
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
      </div>
    </div>
  );
};

export default QmsViewOpportunityAssessment;