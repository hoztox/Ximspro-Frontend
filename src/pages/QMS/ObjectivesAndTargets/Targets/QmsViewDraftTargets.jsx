import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
const QmsViewDraftTargets = () => {
    const [formData, setFormData] = useState({
        target: "Anonymous",
        associated_objective: "Test",
        programs: "Test",
        results: "Test",
        target_date: "02-02-2025",
        responsible: "Pending",
        status: "02-02-2025",
        reminder_notification: "02-02-2025",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-targets");
    };

 


    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Targets and Programs Information</h2>
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
                            Target
                        </label>
                        <div className="view-employee-data">{formData.target}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Associated Objective
                        </label>
                        <div className="view-employee-data">{formData.associated_objective}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Program(s)
                        </label>
                        <div className="view-employee-data">{formData.programs}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Results
                        </label>
                        <div className="view-employee-data">{formData.results}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Target Date
                        </label>
                        <div className="view-employee-data">{formData.target_date}</div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Responsible
                            </label>
                            <div className="view-employee-data">{formData.responsible}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Status
                        </label>
                        <div className="view-employee-data">{formData.status}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Reminder Notification
                        </label>
                        <div className="view-employee-data">{formData.reminder_notification}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Upload Attachment
                        </label>
                        <button className="flex gap-2 click-view-file-btn text-[#1E84AF]">
                            Click to view file <Eye />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsViewDraftTargets
