import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QmsDraftViewEnvironmentalIncidents = () => {
    const [formData, setFormData] = useState({
        source: "Anonymous",
        title: "Test",
        incident_no: "Test",
        status: "Test",
        root_cause: "Test",
        report_by: "Test",
        description: "Pending",
        action: "Test",
        date_raised: "02-02-2025",
        completed_by: "02-02-2025",
        remarks: "Test",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-environmantal-incident");
    };


    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Environmental Incidents Information</h2>
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
                            Incident Title
                        </label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Incident No
                        </label>
                        <div className="view-employee-data">{formData.incident_no}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Status
                        </label>
                        <div className="view-employee-data">{formData.status}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Root Case
                        </label>
                        <div className="view-employee-data">{formData.root_cause}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Report By
                        </label>
                        <div className="view-employee-data">{formData.report_by}</div>
                    </div>

                    <div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Incident Description
                            </label>
                            <div className="view-employee-data">{formData.description}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action or Corrections
                        </label>
                        <div className="view-employee-data">{formData.action}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date Raised
                        </label>
                        <div className="view-employee-data">{formData.date_raised}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Complete By
                        </label>
                        <div className="view-employee-data">{formData.completed_by}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Remarks
                        </label>
                        <div className="view-employee-data">{formData.remarks}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsDraftViewEnvironmentalIncidents
