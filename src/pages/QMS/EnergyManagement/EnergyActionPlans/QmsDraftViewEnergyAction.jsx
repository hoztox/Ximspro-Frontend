import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsDraftViewEnergyAction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    action_plan: "",
    title: "",
    associative_objective: "",
    programs: [],
    legal_requirements: "",
    means: "",
    date: "",
    responsible: "",
    energy_improvements: "",
    statement: "",
    upload_attachment: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch energy action data
  useEffect(() => {
    const fetchEnergyAction = async () => {
      if (!id) {
        setError("No energy action ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/qms/energy-action/${id}/`);
        setFormData({
          action_plan: response.data.action_plan || "Anonymous",
          title: response.data.title || "N/A",
          associative_objective: response.data.associative_objective || "N/A",
          programs: Array.isArray(response.data.programs)
            ? response.data.programs
            : [],
          legal_requirements: response.data.legal_requirements || "N/A",
          means: response.data.means || "N/A",
          date: response.data.date || "N/A",
          responsible: response.data.responsible_name || "N/A",
          energy_improvements: response.data.energy_improvements || "N/A",
          statement: response.data.statement || "N/A",
          upload_attachment: response.data.upload_attachment || null,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching energy action:", error);
        setError("Failed to load energy action data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchEnergyAction();
  }, [id]);

  // Handle close button
  const handleClose = () => {
    navigate("/company/qms/draft-energy-action-plan");
  };

  // Handle file view
  const handleViewFile = () => {
    if (formData.upload_attachment) {
      window.open(formData.upload_attachment, "_blank");
    }
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
   

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Energy Action Plans Information</h2>
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
              Energy Action Plan No
            </label>
            <div className="view-employee-data">{formData.action_plan}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Action Plan Title/Name
            </label>
            <div className="view-employee-data">{formData.title}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Associated Objective
            </label>
            <div className="view-employee-data">{formData.associative_objective}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Attached Document
            </label>
            {formData.upload_attachment ? (
              <button
                onClick={handleViewFile}
                className="flex gap-2 click-view-file-btn text-[#1E84AF] items-center"
              >
                Click to view file <Eye size={17} />
              </button>
            ) : (
              <div className="view-employee-data">No attachment</div>
            )}
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Program(s)
            </label>
            <div className="view-employee-data">
              {formData.programs && formData.programs.length > 0 ? (
                <ol className="list-decimal pl-5">
                  {formData.programs.map((program, index) => (
                    <li key={index}>{program.Program || "N/A"}</li>
                  ))}
                </ol>
              ) : (
                "N/A"
              )}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Associated Legal Requirements
            </label>
            <div className="view-employee-data">{formData.legal_requirements}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Means/Method
            </label>
            <div className="view-employee-data">{formData.means}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Target Date
            </label>
            <div className="view-employee-data">{formatDate(formData.date)}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Responsible
            </label>
            <div className="view-employee-data">{formData.responsible}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Statement on Energy Improvement Performance
            </label>
            <div className="view-employee-data">{formData.energy_improvements}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Statement on Result Verification
            </label>
            <div className="view-employee-data">{formData.statement}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsDraftViewEnergyAction; 