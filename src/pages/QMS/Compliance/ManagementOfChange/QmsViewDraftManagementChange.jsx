import React, { useState } from "react";
import { X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QmsViewDraftManagementChange = () => {
  const [formData, setFormData] = useState({
    title: "Test",
    type: "Test",
    document: " ",
    purpose: "Internal",
    potential_change: "Test",
    remarks: "Internal",
    moc_no: "Test",
    date: "Test",
    relate_record_format: "Test",
    resourses: "Test",
    impact: "Test",
    evaluationBy: "Test",
  });

  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/company/qms/draft-management-change");
  };

  return (
    <div>
      <div className="bg-[#1C1C24] text-white rounded-lg w-full p-5">
        <div className="flex justify-between items-center border-b border-[#383840] pb-5">
          <h2 className="training-info-head">
            Management of Change Information
          </h2>
          <button
            onClick={handleClose}
            className="text-white bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
          >
            <X size={24} />
          </button>
        </div>

        <div className="pt-5 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-[40px] border-r border-[#383840]">
            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                MOC Name/Title
              </p>
              <p className="text-white view-training-data">{formData.title}</p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                MOC Type
              </p>
              <p className="text-white view-training-data">{formData.type}</p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Attach Document
              </p>
              <button className="text-[#1E84AF] flex items-center gap-2 click-view-file-btn !text-[18px]">
                Click to view file <Eye size={20} className="text-[#1E84AF]" />
                {formData.document}
              </button>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Purpose of Change
              </p>
              <p className="text-white view-training-data">
                {formData.purpose}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Potential Consequences of Change
              </p>
              <p className="text-white view-training-data">
                {formData.potential_change}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                MOC Remarks{" "}
              </p>
              <p className="text-white view-training-data">
                {formData.remarks}
              </p>
            </div>
          </div>

          <div className="space-y-[40px] ml-5">
            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                MOC Number
              </p>
              <p className="text-white view-training-data">{formData.moc_no}</p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Date
              </p>
              <p className="text-white view-training-data">{formData.date}</p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Relate Record Format
              </p>
              <p className="text-white view-training-data">
                {formData.relate_record_format}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Resourses Required
              </p>
              <p className="text-white view-training-data">
                {formData.resourses}
              </p>
            </div>

            <div>
              <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                Impact on Processes/Activity{" "}
              </p>
              <p className="text-white view-training-data">{formData.impact}</p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-[#AAAAAA] view-training-label mb-[6px]">
                  Evaluation By
                </p>
                <p className="text-white view-training-data">
                  {formData.evaluationBy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsViewDraftManagementChange;
