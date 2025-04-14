import React, { useState } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsViewAwarenessTraining = () => {
  const [formData, setFormData] = useState({
    title: "Anonymous",
    chooseCategory: "Anonymous",
    description: "test",
    youtube_link: "www.youtube.com/watch?v=exampl",
    isModalOpen: true,
  });
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/company/qms/list-awareness-training");
  };

  const handleEdit = () => {
    navigate("/company/qms/edit-awareness-training");
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
  };

  if (!formData.isModalOpen) return null;

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Awareness Training Information</h2>
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
            Title
            </label>
            <div className="view-employee-data">{formData.title}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Choose Category
            </label>
            <div className="view-employee-data">{formData.chooseCategory}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Description
            </label>
            <div className="view-employee-data">{formData.description}</div>
          </div>
          <div className="flex justify-between">
          <div>
            <label className="block view-employee-label mb-[6px]">
              YouTube Link
            </label>
            <div className="view-employee-data">{formData.youtube_link}</div>
          </div>
            <div className="flex space-x-10">
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
    </div>
  );
};

export default QmsViewAwarenessTraining;
