import React, { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const ViewQmsDraftProcesses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const handleClose = () => {
    navigate("/company/qms/processes");
  };
  const handleDelete = () => {
    setFormData(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/qms/processes-get/${id}/`
        );
        setFormData(response.data);
        console.log("Process data:", response.data);
      } catch (error) {
        console.error("Failed to fetch process data", error);
      }
    };
    fetchData();
  }, [id]);
  if (!formData) return <div className="text-center not-found p-4">Loading Processes...</div>;
  return (
    <div className="bg-[#1C1C24] text-white rounded-lg w-full">
      <div className="flex justify-between items-center py-5 mx-5 border-b border-[#383840]">
        <h2 className="view-interested-parties-head">Processess Information</h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X size={23} className="text-white" />
        </button>
      </div>
      <div className="p-4 space-y-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-6 space-y-[40px]">
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Name/Title
              </label>
              <div className="text-white view-interested-parties-data">
                {formData.name}
              </div>
            </div>
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Process Type
              </label>
              <div className="text-white view-interested-parties-data">
                {formData.type}
              </div>
            </div>
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Browse File
              </label>
              <div className="flex items-center view-interested-parties-data">
                {formData.file ? (
                  <a
                    href={formData.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E84AF] flex items-center"
                  >
                    Click to view file <Eye size={18} className="ml-1" />
                  </a>
                ) : (
                  <span className="text-gray-400">No file uploaded</span>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block w-px bg-[#383840] mx-0"></div>
          <div className="md:w-1/2 md:pl-6 space-y-[40px] mt-6 md:mt-0">
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Process No/Identification
              </label>
              <div className="text-white view-interested-parties-data">
                {formData.no || "Anonymous"}
              </div>
            </div>
            <div>
              <label className="block view-interested-parties-label mb-[6px]">Related Procedure</label>
             <div className="text-white view-interested-parties-data">
  {formData.legal_requirement_details && formData.legal_requirement_details.length > 0 ? (
    <ol className="list-decimal pl-5">
      {formData.legal_requirement_details.map(req => (
        <li key={req.id}>{req.title}</li>
      ))}
    </ol>
  ) : formData.custom_legal_requirements ? (
    formData.custom_legal_requirements
  ) : (
    "No related procedures"
  )}
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQmsDraftProcesses;