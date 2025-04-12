import React, { useState } from "react";
import "./viewqmsinterestedparties.css"
import edits from "../../../../assets/images/Company Documentation/edit.svg"
import deletes from "../../../../assets/images/Company Documentation/delete.svg"
import { X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewQmsInterestedParties = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Anonymous",
    category: "Anonymous",
    needs: "Lorem ipsum dolor sit amet, consectetur sit adipiscing elit.",
    expectations: "Anonymous",
    specialRequirements:
      "Lorem ipsum dolor sit amet, consectetur sit adipiscing elit.",
    legalRequirements: "Anonymous",
    file: null,
  });

  const [isOpen, setIsOpen] = useState(true);

   const handleClose = () => {
    navigate('/company/qms/interested-parties')
   }

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files[0],
      }));
    }
  };

  const handleDelete = () => {
    setFormData({
      name: "",
      category: "",
      needs: "",
      expectations: "",
      specialRequirements: "",
      legalRequirements: "",
      file: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg w-full">
      <div className="flex justify-between items-center py-5 mx-5 border-b border-[#383840]">
        <h2 className="view-interested-parties-head">
          Interested Parties Information
        </h2>
        <button
          onClick={() => handleClose()}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X size={23} className="text-white" />
        </button>
      </div>

      {/* Use flex instead of grid to create a single vertical border */}
      <div className="p-4 space-y-6">
        <div className="flex flex-col md:flex-row">
          {/* Left column */}
          <div className="md:w-1/2 md:pr-6 space-y-[40px]">
            <div>
              <label className="block view-interested-parties-label mb-[6px]">Name</label>
              <div className="text-white view-interested-parties-data">{formData.name}</div>
            </div>
            <div>
              <label className="block view-interested-parties-label mb-[6px]">Needs</label>
              <div className="text-white view-interested-parties-data">{formData.needs}</div>
            </div>
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Special Requirements
              </label>
              <div className="text-white view-interested-parties-data">{formData.specialRequirements}</div>
            </div>
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Browse File
              </label>
              <div className="flex items-center view-interested-parties-data">
                <span className="text-[#1E84AF] flex items-center cursor-pointer">
                  Click to view file <Eye size={18} className="ml-1" />
                </span>
              </div>


            </div>
          </div>

          {/* Vertical border */}
          <div className="hidden md:block w-px bg-[#383840] mx-0"></div>

          {/* Right column */}
          <div className="md:w-1/2 md:pl-6 space-y-[40px] mt-6 md:mt-0">
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Category
              </label>
              <div className="text-white view-interested-parties-data">{formData.category}</div>
            </div>
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Expectations
              </label>
              <div className="text-white view-interested-parties-data">{formData.expectations}</div>
            </div>
            <div>
              <label className="block view-interested-parties-label mb-[6px]">
                Applicable Legal/Regulatory Requirements
              </label>
              <div className="text-white view-interested-parties-data">{formData.legalRequirements}</div>
            </div>
            <div className="flex justify-end space-x-10">
              <button
                className="flex flex-col items-center view-interested-parties-label gap-[8px]"
              >
                <span>Edit</span>
                <img src={edits} alt="Edit Icon" className="w-[18px] h-[18px]"/>
              </button>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                 className="flex flex-col items-center view-interested-parties-label gap-[8px]"
                onClick={handleDelete}
              >
                <span>Delete</span>
                <img src={deletes} alt="Delete Icon" className="w-[18px] h-[18px]"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQmsInterestedParties;