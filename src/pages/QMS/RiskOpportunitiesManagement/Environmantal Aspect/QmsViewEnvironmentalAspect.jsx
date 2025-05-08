import React, { useState } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsViewEnvironmentalAspect = () => {
    const [formData, setFormData] = useState({
        source: "Anonymous",
        title: "Test",
        aspect_no: "Test",
        related_process: "Test",
        legal_requirement: "Test",
        aspect_description: "Test",
        correction: "Test",
        written_by: "Test",
        approved_by: "Test",
        checked_by: "Test",
        date: "02-02-2025",
        impact: "Test",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/list-environmantal-aspect");
    };

    const handleEdit = () => {
        navigate("/company/qms/edit-environmantal-aspect");
    };

    const handleDelete = () => {
        console.log("Delete button clicked");
    };



    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Environmental Aspect Information</h2>
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
                            Aspect Source
                        </label>
                        <div className="view-employee-data">{formData.source}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Aspect Name/Title
                        </label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Aspect No
                        </label>
                        <div className="view-employee-data">{formData.aspect_no}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Related Process/ Activity
                        </label>
                        <div className="view-employee-data">{formData.related_process}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Applicable Legal Requirement
                        </label>
                        <div className="view-employee-data">{formData.legal_requirement}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Aspect Description
                        </label>
                        <div className="view-employee-data">{formData.aspect_description}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action or Corrections
                        </label>
                        <div className="view-employee-data">{formData.correction}</div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Written/Prepare By
                            </label>
                            <div className="view-employee-data">{formData.written_by}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Approved By
                        </label>
                        <div className="view-employee-data">{formData.approved_by}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Checked/Reviewed By
                        </label>
                        <div className="view-employee-data">{formData.checked_by}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date
                        </label>
                        <div className="view-employee-data">{formData.date}</div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Level of Impact
                            </label>
                            <div className="view-employee-data">{formData.impact}</div>
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
        </div>
    );
};
export default QmsViewEnvironmentalAspect
