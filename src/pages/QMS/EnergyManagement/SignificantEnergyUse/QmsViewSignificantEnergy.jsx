import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsViewSignificantEnergy = () => {
    const [formData, setFormData] = useState({
        title: "Anonymous",
        energy_no: "Test",
        energy_source_type: "Test",
        date: "02-02-2025",
        facility: "Test",
        consumption: "Test",
        action: "Test",
        consequences: "Test",
        impact: "Test",
        remarks: "Test",
        revision: "Test",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/list-significant-energy");
    };

    const handleEdit = () => {
        navigate("/company/qms/edit-significant-energy");
    };

    const handleDelete = () => {
        console.log("Delete button clicked");
    };



    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head"> Significant Energy Use Information</h2>
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
                            Significant Energy Use Name/Title
                        </label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Significant Energy Use  Number
                        </label>
                        <div className="view-employee-data">{formData.energy_no}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Energy Source Type
                        </label>
                        <div className="view-employee-data">{formData.energy_source_type}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date
                        </label>
                        <div className="view-employee-data">{formData.date}</div>
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
                            Facility/Process/ Activity
                        </label>
                        <div className="view-employee-data">{formData.facility}</div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Average Consumption
                            </label>
                            <div className="view-employee-data">{formData.consumption}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action Required
                        </label>
                        <div className="view-employee-data">{formData.action}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Potential Consequences of Energy Use
                        </label>
                        <div className="view-employee-data">{formData.consequences}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Impact on Processes/Activity/Cost
                        </label>
                        <div className="view-employee-data">{formData.impact}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Significant Energy Use Remarks
                        </label>
                        <div className="view-employee-data">{formData.remarks}</div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Revision
                            </label>
                            <div className="view-employee-data">{formData.revision}</div>
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
export default QmsViewSignificantEnergy
