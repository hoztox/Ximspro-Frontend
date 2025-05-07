import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsViewEnergyAction = () => {
  const [formData, setFormData] = useState({
    eap_no: "Anonymous",
    title: "Test",
    associated_objective: "Test",
    programs: "Test",
    associated_legal_requirements: "Test",
    means: "Test",
    date: "02-02-2025",
    responsible: "Test",
    energy_improvement: "Test",
    result_verification: "Test",
  });
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/company/qms/list-energy-action-plan");
  };

  const handleEdit = () => {
    navigate("/company/qms/edit-energy-action-plan");
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
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
            <div className="view-employee-data">{formData.eap_no}</div>
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
            <div className="view-employee-data">
              {formData.associated_objective}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Attached Document
            </label>
            <button className="flex gap-2 click-view-file-btn text-[#1E84AF] items-center">
              Click to view file <Eye size={17} />
            </button>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
            Program(s)
            </label>
            <div className="view-employee-data">
              {formData.programs}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
            Associated Legal Requirements
            </label>
            <div className="view-employee-data">{formData.associated_legal_requirements}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
            Means/Method
            </label>
            <div className="view-employee-data">{formData.means}</div>
          </div>

          <div>
            <div>
              <label className="block view-employee-label mb-[6px]">
                Target Date
              </label>
              <div className="view-employee-data">{formData.date}</div>
            </div>
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
            <div className="view-employee-data">{formData.energy_improvement}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
            Statement on Result Verification
            </label>
            <div className="view-employee-data">{formData.result_verification}</div>
          </div>

          <div className="flex space-x-10 justify-end">
            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
              Edit
              <button onClick={handleEdit}>
                <img
                  src={edits}
                  alt="Edit Iocn"
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
    </div>
  );
};
export default QmsViewEnergyAction;
