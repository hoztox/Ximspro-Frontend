import React, { useState } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";


const QmsViewDraftCorrectionActions = () => {
    const [formData, setFormData] = useState({
        source: "Anonymous",
        title: "Anonymous",
        action_no: "test",
        root_case: "test",
        executor: "test",
        problem_description: "test",
        corrective_action: "test",
        actions: "test",
        date_raised: "test",
        completed_by: "test",
        status: "Solved",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-correction-actions");
    };


    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Correction/Corrective Action Information</h2>
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
                            Source
                        </label>
                        <div className="view-employee-data">{formData.source}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Title
                        </label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action No
                        </label>
                        <div className="view-employee-data">{formData.action_no}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Root Case
                        </label>
                        <div className="view-employee-data">{formData.root_case}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Executor
                        </label>
                        <div className="view-employee-data">{formData.executor}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Problem Description
                        </label>
                        <div className="view-employee-data">{formData.problem_description}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action or Corrections
                        </label>
                        <div className="view-employee-data">{formData.actions}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date Raised
                        </label>
                        <div className="view-employee-data">{formData.date_raised}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Complete By
                            </label>
                            <div className="view-employee-data">{formData.completed_by}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{formData.status}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsViewDraftCorrectionActions
