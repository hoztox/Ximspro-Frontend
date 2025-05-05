import React, { useState } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsViewObjectives = () => {
    const [formData, setFormData] = useState({
        objective: "Anonymous",
        indicator: "Test",
        performance_measure: "Test",
        target_date: "02-02-2025",
        responsible: "Test",
        status: "Pending",
        reminder_notification: "02-02-2025",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/list-objectives");
    };

    const handleEdit = () => {
        navigate("/company/qms/edit-objectives");
    };

    const handleDelete = () => {
        console.log("Delete button clicked");
    };



    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Objectives Information</h2>
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
                            Objective
                        </label>
                        <div className="view-employee-data">{formData.objective}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Indicator
                        </label>
                        <div className="view-employee-data">{formData.indicator}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Performance Measure
                        </label>
                        <div className="view-employee-data">{formData.performance_measure}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Target Date
                        </label>
                        <div className="view-employee-data">{formData.target_date}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Responsible
                        </label>
                        <div className="view-employee-data">{formData.responsible}</div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{formData.status}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Reminder Notification
                        </label>
                        <div className="view-employee-data">{formData.reminder_notification}</div>
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

export default QmsViewObjectives
