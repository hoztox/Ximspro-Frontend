import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewDraftEnvironmentalAspect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aspect_source: "",
    title: "",
    aspect_no: "",
    process_activity: "",
    legal_requirement: "",
    description: "",
    action: "",
    written_by: "",
    approved_by: "",
    checked_by: "",
    date: "",
    level_of_impact: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnvironmentalAspect = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/qms/aspect-detail/${id}/`
      );
      const data = response.data;
      console.log('uuuuuuuuuu', response.data);
      

      // Fetch corrections
      const correctionsResponse = await axios.get(
        `${BASE_URL}/qms/aspect/${id}/corrections/`
      );
      const corrections = correctionsResponse.data;
      const latestCorrection =
        corrections.length > 0
          ? corrections.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )[0].correction
          : data.action || "";

      // Format user names and process activity
      const formatUserName = (user) =>
        user ? `${user.first_name} ${user.last_name}` : "N/A";

      setFormData({
        aspect_source: data.aspect_source || "N/A",
        title: data.title || "N/A",
        aspect_no: data.aspect_no || "N/A",
        process_activity: data.process_activity || {},
        legal_requirement: data.legal_requirement || "N/A",
        description: data.description || "N/A",
        action: latestCorrection,
        written_by: formatUserName(data.written_by),
        approved_by: formatUserName(data.approved_by),
        checked_by: formatUserName(data.checked_by),
        date: data.date
          ? new Date(data.date)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "/")
          : "N/A",
        level_of_impact: data.level_of_impact || "N/A",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching environmental aspect:", err);
      setError(
        "Failed to load environmental aspect details. Please try again."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEnvironmentalAspect();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/draft-environmantal-aspect");
  };

  if (loading) {
    return (
      <div className="text-center py-4 not-found">
        Loading environmental aspect...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Environmental Aspect Information</h2>
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
              Aspect Source
            </label>
            <div className="view-employee-data">{formData.aspect_source}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Aspect Name/Title
            </label>
            <div className="view-employee-data">{formData.title}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Aspect No
            </label>
            <div className="view-employee-data">{formData.aspect_no}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Process/Activity
            </label>
            <div className="view-employee-data">
              {formData.process_activity && formData.process_activity.title ? 
                formData.process_activity.title : "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Legal Requirement
            </label>
            <div className="view-employee-data">
              {formData.legal_requirement}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Description
            </label>
            <div className="view-employee-data">{formData.description}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Action or Corrections
            </label>
            <div className="view-employee-data">{formData.action}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Written/Prepared By
            </label>
            <div className="view-employee-data">{formData.written_by}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Approved By
            </label>
            <div className="view-employee-data">{formData.approved_by}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Checked/Reviewed By
            </label>
            <div className="view-employee-data">{formData.checked_by}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Date</label>
            <div className="view-employee-data">{formData.date}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Level of Impact
            </label>
            <div className="view-employee-data">{formData.level_of_impact}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsViewDraftEnvironmentalAspect;
