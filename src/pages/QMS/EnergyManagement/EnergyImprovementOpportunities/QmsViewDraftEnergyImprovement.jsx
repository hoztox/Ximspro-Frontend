import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QmsViewDraftEnergyImprovement = () => {
    const [formData, setFormData] = useState({
        eio_no: "Anonymous",
        eio_title: "Test",
        target: "Test",
        associated_objective: "Test",
        results: "Test",
        target_date: "02-02-2025",
        responsible: "Test",
        action: "Test",
        remarks: "Test",
        status: "OnGoing",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-energy-improvement-opportunities");
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Energy Improvement Opportunities Information</h2>
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
                            EIO Number
                        </label>
                        <div className="view-employee-data">{formData.eio_no}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            EIO Title
                        </label>
                        <div className="view-employee-data">{formData.eio_title}</div>
                    </div>

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
                            Results
                        </label>
                        <div className="view-employee-data">{formData.results}</div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Target Date
                            </label>
                            <div className="view-employee-data">{formData.target_date}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Responsible
                        </label>
                        <div className="view-employee-data">{formData.responsible}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action Required
                        </label>
                        <div className="view-employee-data">{formData.action}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Significant Energy Use Remarks
                        </label>
                        <div className="view-employee-data">{formData.remarks}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Status
                        </label>
                        <div className="view-employee-data">{formData.status}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Attached Document
                        </label>
                        <button className="flex gap-2 click-view-file-btn text-[#1E84AF] items-center">
                            Click to view file <Eye size={17} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsViewDraftEnergyImprovement
