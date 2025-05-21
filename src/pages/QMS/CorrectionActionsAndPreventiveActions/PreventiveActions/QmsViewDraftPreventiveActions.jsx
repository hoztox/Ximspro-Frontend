import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsViewDraftPreventiveActions = () => {
  const [preventiveAction, setPreventiveAction] = useState({
    title: "",
    executor: null,
    description: "",
    action: "",
    date_raised: "",
    date_completed: "",
    status: "",
    is_draft: false,
    send_notification: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams(); // Get the id from URL parameters

  useEffect(() => {
    const fetchPreventiveAction = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/preventive-get/${id}/`
        );
        setPreventiveAction(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch preventive action details");
        setLoading(false);
        console.error("Error fetching preventive action:", err);
      }
    };

    if (id) {
      fetchPreventiveAction();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/draft-preventive-actions");
  };

  // Format date to display in readable format
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
  if (loading)
    return (
      <div className="bg-[#1C1C24] not-found rounded-lg p-5">Loading...</div>
    );

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Preventive Action Information</h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>

      <div className="pt-5 relative">
        {/* Vertical divider line */}
        <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
          <div>
            <label className="block view-employee-label mb-[6px]">Title</label>
            <div className="view-employee-data">
              {preventiveAction.title || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Executor
            </label>
            <div className="view-employee-data">
              {preventiveAction.executor
                ? `${preventiveAction.executor.first_name || ""} ${
                    preventiveAction.executor.last_name || ""
                  }`.trim() || preventiveAction.executor.username
                : "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Problem Description
            </label>
            <div className="view-employee-data">
              {preventiveAction.description || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Action No
            </label>
            <div className="view-employee-data">
              {preventiveAction.action || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Date Raised
            </label>
            <div className="view-employee-data">
              {formatDate(preventiveAction.date_raised)}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Completed By
            </label>
            <div className="view-employee-data">
              {formatDate(preventiveAction.date_completed)}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Status</label>
            <div className="view-employee-data">
              {preventiveAction.status || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsViewDraftPreventiveActions;
