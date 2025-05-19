import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewDraftObjectives = () => {
  const { id } = useParams(); // Get objective ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    objective: "",
    indicator: "",
    performance: "",
    target_date: "",
    responsible: "",
    status: "",
    reminder_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchObjective();
  }, []);

  const fetchObjective = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/qms/objectives-get/${id}/`);

      const data = response.data;
      setFormData({
        objective: data.objective || "",
        indicator: data.indicator || "",
        performance: data.performance || "",
        target_date: data.target_date || "N/A",
        responsible: data.responsible
          ? `${data.responsible.first_name} ${data.responsible.last_name || ""}`
          : "N/A",
        status: data.status || "On Going",
        reminder_date: data.reminder_date || "N/A",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching draft objective:", error);
      setError("Failed to load draft objective. Please try again.");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/company/qms/draft-objectives");
  };

  const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return "N/A"; // handle invalid date formats
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Draft Objectives Information</h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading Draft Objectives...</div>
      ) : (
        <div className="pt-5 relative">
          <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
            <div>
              <label className="block view-employee-label mb-[6px]">
                Objective
              </label>
              <div className="view-employee-data">{formData.objective}</div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Indicator
              </label>
              <div className="view-employee-data">{formData.indicator}</div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Performance Measure
              </label>
              <div className="view-employee-data">{formData.performance}</div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Target Date
              </label>
              <div className="view-employee-data">
                {formatDate(formData.target_date)}
              </div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Responsible
              </label>
              <div className="view-employee-data">{formData.responsible}</div>
            </div>

            <div className="flex justify-between">
              <div>
                <label className="block view-employee-label mb-[6px]">
                  Status
                </label>
                <div className="view-employee-data">{formData.status}</div>
              </div>
            </div>

            <div>
              <label className="block view-employee-label mb-[6px]">
                Reminder Notification
              </label>
              <div className="view-employee-data">
                {formatDate(formData.reminder_date)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QmsViewDraftObjectives;
