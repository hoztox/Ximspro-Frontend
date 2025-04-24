import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";


const QmsViewComplaints = () => {
    const [formData, setFormData] = useState({
        name: "Anonymous",
        category: "Anonymous",
        details: "test",
        immediate_action: "test",
        executer: "test",
        date: "test",
        corrective_action: "test",
        solved: "test",
        

    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/list-complaints");
    };

    const handleEdit = () => {
        navigate("/company/qms/edit-complaints");
    };

    const handleDelete = () => {
        console.log("Delete button clicked");
    };



    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Complaints and Feedbacks Information</h2>
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
                            Name
                        </label>
                        <div className="view-employee-data">{formData.name}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Category
                        </label>
                        <div className="view-employee-data">{formData.category}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Details
                        </label>
                        <div className="view-employee-data">{formData.details}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                        Immediate Action
                        </label>
                        <div className="view-employee-data">{formData.immediate_action}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                        Executer
                        </label>
                        <div className="view-employee-data">{formData.executer}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                        Date
                        </label>
                        <div className="view-employee-data">{formData.date}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                        Solved After Action?
                        </label>
                        <div className="view-employee-data">{formData.solved}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                        Corrective Action Needed?
                        </label>
                        <div className="view-employee-data">{formData.corrective_action}</div>
                    </div>
                     
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Document
                            </label>
                            <button className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn">
                                Click to view file <Eye size={18} />
                            </button>
                        </div>
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
export default QmsViewComplaints
