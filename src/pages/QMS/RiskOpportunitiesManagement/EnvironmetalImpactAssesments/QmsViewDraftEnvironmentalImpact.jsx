import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QmsViewDraftEnvironmentalImpact = () => {
    const [formData, setFormData] = useState({
        source: "Anonymous",
        eia_no: "Test",
        revision: "Test",
        document_type: "Test",
        legal_requirement: "Test",
        review_frequency: "Test",
        relate_document: "Test",
        written_by: "Test",
        approved_by: "Test",
        checked_by: "Test",
        date: "02-02-2025",
        impact: "Test",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-environmantal-impact");
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Environmental Impact Assessment Information</h2>
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
                            Environmental Impact Assessment Name/Title
                        </label>
                        <div className="view-employee-data">{formData.source}</div>
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
                            Environmental Impact Assessment Number
                        </label>
                        <div className="view-employee-data">{formData.eia_no}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Checked/Reviewed By
                        </label>
                        <div className="view-employee-data">{formData.checked_by}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Revision
                        </label>
                        <div className="view-employee-data">{formData.revision}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Approved By
                        </label>
                        <div className="view-employee-data">{formData.approved_by}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Document Type
                        </label>
                        <div className="view-employee-data">{formData.document_type}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date
                        </label>
                        <div className="view-employee-data">{formData.date}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                        Attach Document
                        </label>
                        <button className="flex items-center gap-2 click-view-file-btn text-[#1E84AF]">
                            Click to view file <Eye size={17}/>
                        </button>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                        Review Frequency
                        </label>
                        <div className="view-employee-data">{formData.review_frequency}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                        Relate Document/ Document 
                        </label>
                        <div className="view-employee-data">{formData.relate_document}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsViewDraftEnvironmentalImpact
