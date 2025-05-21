import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewEnergyAction = () => {
  const [formData, setFormData] = useState({
    action_plan: "",
    title: "",
    associative_objective: "",
    legal_requirements: "",
    means: "",
    date: "",
    responsible: "",
    energy_improvements: "",
    statement: "",
    upload_attachment: null
  });
  const [programFields, setProgramFields] = useState([{ id: 1, value: "" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [responsibleUser, setResponsibleUser] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();


  // Format date to display in DD-MM-YYYY format
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

 
  const fetchEnergyAction = async () => {
    try {
      setIsLoading(true);
      // Fetch the energy action details
      const response = await axios.get(`${BASE_URL}/qms/energy-action/${id}/`);
      
      // Set form data based on the response
      setFormData({
        action_plan: response.data.action_plan || "",
        title: response.data.title || "",
        associative_objective: response.data.associative_objective || "",
        legal_requirements: response.data.legal_requirements || "",
        means: response.data.means || "",
        date: response.data.date || "",
        responsible: response.data.responsible || "",
        energy_improvements: response.data.energy_improvements || "",
        statement: response.data.statement || "",
        upload_attachment: response.data.upload_attachment || null,
      });
          console.log("sssssssss",response.data)
      // Handle programs from response
      if (response.data.programs && Array.isArray(response.data.programs)) {
        const programs = response.data.programs.map((program, index) => ({
          id: index + 1,
          value: program.Program || ""
        }));
        setProgramFields(programs.length > 0 ? programs : [{ id: 1, value: "" }]);
      } else {
        setProgramFields([{ id: 1, value: "" }]);
      }

      if (response.data.upload_attachment) {
        setExistingAttachment(response.data.upload_attachment);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching energy action:", error);
      setError("Failed to load energy action data. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEnergyAction();
    } else {
      setIsLoading(false);
      setError("No energy action ID provided");
    }
  }, [id]);

 

  const handleClose = () => {
    navigate("/company/qms/list-energy-action-plan");
  };

  const handleEdit = () => {
    navigate(`/company/qms/edit-energy-action-plan/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/energy-action/${id}/`);
      setShowDeleteModal(false);
      navigate("/company/qms/list-energy-action-plan", { 
        state: { message: "Energy Action Plan deleted successfully" } 
      });
    } catch (error) {
      console.error("Error deleting energy action:", error);
      setError("Failed to delete energy action. Please try again.");
      setShowDeleteModal(false);
    }
  };

  const openAttachment = () => {
    if (existingAttachment) {
      window.open(existingAttachment, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-64">
        <div className="text-xl">Loading energy action plan data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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
            <div className="view-employee-data">{formData.action_plan || "Not specified"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Action Plan Title/Name
            </label>
            <div className="view-employee-data">{formData.title || "Not specified"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Associated Objective
            </label>
            <div className="view-employee-data">
              {formData.associative_objective || "Not specified"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Attached Document
            </label>
            {existingAttachment ? (
              <button 
                className="flex gap-2 click-view-file-btn text-[#1E84AF] items-center"
                onClick={openAttachment}
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
              {programFields.length > 0 ? (
                <ul className="list-disc pl-4">
                  {programFields.map((program, index) => (
                    <li key={program.id}>{program.value || "Not specified"}</li>
                  ))}
                </ul>
              ) : (
                "No programs specified"
              )}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Associated Legal Requirements
            </label>
            <div className="view-employee-data">{formData.legal_requirements || "Not specified"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Means/Method
            </label>
            <div className="view-employee-data">{formData.means || "Not specified"}</div>
          </div>

          <div>
            <div>
              <label className="block view-employee-label mb-[6px]">
                Target Date
              </label>
              <div className="view-employee-data">{formatDate(formData.date)}</div>
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Responsible
            </label>
            <div className="view-employee-data">{formData.responsible?.first_name} {formData.responsible?.last_name}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Statement on Energy Improvement Performance 
            </label>
            <div className="view-employee-data">{formData.energy_improvements || "Not specified"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Statement on Result Verification
            </label>
            <div className="view-employee-data">{formData.statement || "Not specified"}</div>
          </div>

          <div className="flex space-x-10 justify-end md:col-span-2">
            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
              Edit
              <button onClick={handleEdit}>
                <img
                  src={edits}
                  alt="Edit Icon"
                  className="w-[18px] h-[18px]"
                />
              </button>
            </div>

            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
              Delete
              <button onClick={handleDelete}>
                <img
                  src={deletes}
                  alt="Delete Icon"
                  className="w-[18px] h-[18px]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1C1C24] text-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this Energy Action Plan?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-[#24242D] rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QmsViewEnergyAction;