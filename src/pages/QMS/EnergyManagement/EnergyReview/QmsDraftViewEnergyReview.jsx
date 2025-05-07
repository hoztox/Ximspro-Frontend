import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QmsDraftViewEnergyReview = () => {
    const [formData, setFormData] = useState({
        title: "Anonymous",
        review_number: "Test",
        review_type: "Test",
        date: "02-02-2025",
        relate_business_process: "Test",
        energy_remarks: "Test",
        relate_document: "Test",
        revision: "Test",


    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-energy-review");
    };


    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Energy Review Information</h2>
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
                            Energy Review Name/Title
                        </label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Energy Review Number
                        </label>
                        <div className="view-employee-data">{formData.review_number}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Review Type
                        </label>
                        <div className="view-employee-data">{formData.review_type}</div>
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
                        <button className="flex gap-2 click-view-file-btn text-[#1E84AF] items-center">
                            Click to view file <Eye size={17} />
                        </button>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Relate Business Process
                        </label>
                        <div className="view-employee-data">{formData.relate_business_process}</div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Energy Remarks
                            </label>
                            <div className="view-employee-data">{formData.energy_remarks}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Relate Document/ Process
                        </label>
                        <div className="view-employee-data">{formData.relate_document}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Revision
                        </label>
                        <div className="view-employee-data">{formData.revision}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsDraftViewEnergyReview
