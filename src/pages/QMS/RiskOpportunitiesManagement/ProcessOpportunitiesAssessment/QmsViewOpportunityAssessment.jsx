import React from "react";
import { X, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";

const QmsViewOpportunityAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Static sample data for demonstration (replace with actual data later)
  const assessmentDetails = {
    id: id,
    activity: "Welding",
    potential_opportunity: "Anonymous",
    opportunity_score: "25",
    ranking: "H",
    upload_attachment: "https://example.com/sample.pdf",
    written_by: { id: 1, first_name: "John", last_name: "Doe" },
    checked_by: { id: 2, first_name: "Jane", last_name: "Smith" },
    approved_by: null,
    due_date: "2025-03-12",
    status: "Pending for Review/Checking",
  };

  const currentUserId = 1; // Static user ID for demo (replace with localStorage.getItem("user_id") later)
  const isCurrentUserWrittenBy = currentUserId === assessmentDetails.written_by?.id;

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
        <h1 className="viewmanualhead">Opportunity Assessment Information</h1>
        <button
          className="text-white bg-[#24242D] p-1 rounded-md"
          onClick={handleCloseViewPage}
        >
          <X size={22} />
        </button>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-2 divide-x divide-[#383840] border-b border-[#383840] pb-5">
          <div className="grid grid-cols-1 gap-[40px]">
            <div>
              <label className="viewmanuallabels">Activity/Process</label>
              <p className="viewmanuasdata">{assessmentDetails.activity || "N/A"}</p>
            </div>
            <div>
              <label className="viewmanuallabels">Potential Opportunity</label>
              <p className="viewmanuasdata">{assessmentDetails.potential_opportunity || "N/A"}</p>
            </div>
            <div>
              <label className="viewmanuallabels">Opportunity Score</label>
              <p className="viewmanuasdata">{assessmentDetails.opportunity_score || "N/A"}</p>
            </div>
            <div>
              <label className="viewmanuallabels">Ranking</label>
              <p className="viewmanuasdata">
                <span
                  className={`inline-block rounded-[4px] px-[15px] py-[5px] text-xs ${
                    assessmentDetails.ranking === "H"
                      ? "bg-[#dd363611] text-[#dd3636]"
                      : "bg-[#36DDAE11] text-[#36DDAE]"
                  }`}
                >
                  {assessmentDetails.ranking || "N/A"}
                </span>
              </p>
            </div>
            <div>
              <label className="viewmanuallabels">Attach Document</label>
              <div
                className="flex items-center cursor-pointer gap-[8px]"
                onClick={() => {
                  if (assessmentDetails.upload_attachment) {
                    window.open(assessmentDetails.upload_attachment, "_blank");
                  }
                }}
              >
                <p className="click-view-file-text">
                  {assessmentDetails.upload_attachment ? "Click to view file" : "No file attached"}
                </p>
                {assessmentDetails.upload_attachment && (
                  <Eye size={20} className="text-[#1E84AF]" />
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[40px] pl-5">
            <div>
              <label className="viewmanuallabels">Written/Prepared By</label>
              <p className="viewmanuasdata">
                {assessmentDetails.written_by
                  ? `${assessmentDetails.written_by.first_name} ${assessmentDetails.written_by.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="viewmanuallabels">Checked/Reviewed By</label>
              <p className="viewmanuasdata">
                {assessmentDetails.checked_by
                  ? `${assessmentDetails.checked_by.first_name} ${assessmentDetails.checked_by.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="viewmanuallabels">Approved By</label>
              <p className="viewmanuasdata">
                {assessmentDetails.approved_by
                  ? `${assessmentDetails.approved_by.first_name} ${assessmentDetails.approved_by.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="viewmanuallabels">Due Date</label>
              <p className="viewmanuasdata">{formatDate(assessmentDetails.due_date)}</p>
            </div>
            <div className="flex justify-end items-center">
              {isCurrentUserWrittenBy && (
                <div className="flex gap-10">
                  <div className="flex flex-col justify-center items-center">
                    <label className="viewmanuallabels">Edit</label>
                    <button onClick={handleEditAssessment}>
                      <img src={edits} alt="Edit Icon" />
                    </button>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <label className="viewmanuallabels">Delete</label>
                    <button onClick={handleDeleteAssessment}>
                      <img src={deletes} alt="Delete Icon" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsViewOpportunityAssessment;