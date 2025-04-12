import React, { useState } from "react";
import "./viewqmsinterestedparties.css"
import { X, Eye, Edit, Trash } from "lucide-react";
const ViewQmsInterestedParties = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
     
      <div className="bg-[#1C1C24] text-white rounded-lg w-full ">
        <div className="flex justify-between items-center py-5 mx-5 border-b border-[#383840]">
          <h2 className="view-interested-parties-head">
            Interested Parties Information
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
          >
            <X size={23}  className="text-white"/>
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <div className="text-white">{formData.name}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Category
              </label>
              <div className="text-white">{formData.category}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Needs</label>
              <div className="text-white">{formData.needs}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Expectations
              </label>
              <div className="text-white">{formData.expectations}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Special Requirements
              </label>
              <div className="text-white">{formData.specialRequirements}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Applicable Legal/Regulatory Requirements
              </label>
              <div className="text-white">{formData.legalRequirements}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Browse File
            </label>
            <div className="flex items-center">
              <span className="text-blue-400 hover:underline flex items-center cursor-pointer">
                Click to view file <Eye size={16} className="ml-1" />
              </span>

              <div className="ml-auto flex space-x-4">
                <button
                  className="flex items-center text-gray-400 hover:text-blue-400"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <Edit size={18} />
                  <span className="ml-1">Edit</span>
                </button>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <button
                  className="flex items-center text-gray-400 hover:text-red-400"
                  onClick={handleDelete}
                >
                  <Trash size={18} />
                  <span className="ml-1">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default ViewQmsInterestedParties;
