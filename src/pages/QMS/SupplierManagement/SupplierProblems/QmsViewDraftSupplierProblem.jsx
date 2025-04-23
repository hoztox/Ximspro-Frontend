import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";


const QmsViewDraftSupplierProblem = () => {
    const [formData, setFormData] = useState({
        supplier_name: "Anonymous",
        date: "Anonymous",
        problem: "test",
        immediate_action: "test",
        executor: "test",
        solved: "test",
        corrective_action: "test",

    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/drafts-supplier-problem");
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Supplier Problem Information</h2>
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
                            Supplier Name
                        </label>
                        <div className="view-employee-data">{formData.supplier_name}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date
                        </label>
                        <div className="view-employee-data">{formData.date}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Problem
                        </label>
                        <div className="view-employee-data">{formData.problem}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Immediate Action
                        </label>
                        <div className="view-employee-data">{formData.immediate_action}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Executor
                        </label>
                        <div className="view-employee-data">{formData.executor}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Solved
                        </label>
                        <div className="view-employee-data">{formData.solved}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Corrective Action Needed?
                        </label>
                        <div className="view-employee-data">{formData.corrective_action}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsViewDraftSupplierProblem
