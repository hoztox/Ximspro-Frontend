import React, { useState } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsViewDraftAudit = () => {
    const [formData, setFormData] = useState({
        title: "Anonymous",
        certificate_body: "Anonymous",
        audit_from: "test",
        audit_type: "test",
        area: "test",
        procedures: "test",
        corrective_action: "test",
        proposed_date: "test",
        date_conducted: "test",
        notes: "test",

    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-audit");
    };



    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Audit Information</h2>
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
                            Audit Title
                        </label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Certificate Body
                        </label>
                        <div className="view-employee-data">{formData.certificate_body}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Audit From
                        </label>
                        <div className="view-employee-data">{formData.audit_from}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Audit Type
                        </label>
                        <div className="view-employee-data">{formData.audit_type}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Area / Function
                        </label>
                        <div className="view-employee-data">{formData.area}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Procedures
                        </label>
                        <div className="view-employee-data">{formData.procedures}</div>
                    </div>
                    
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Proposed Date for Audit
                        </label>
                        <div className="view-employee-data">{formData.proposed_date}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date Conducted
                        </label>
                        <div className="view-employee-data">{formData.date_conducted}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Notes
                            </label>
                            <div className="view-employee-data">{formData.notes}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsViewDraftAudit
