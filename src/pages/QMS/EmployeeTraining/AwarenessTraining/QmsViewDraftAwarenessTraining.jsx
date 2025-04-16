import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QmsViewDraftAwarenessTraining = () => {
    const [formData, setFormData] = useState({
        title: "Anonymous",
        chooseCategory: "Anonymous",
        description: "test",
        youtube_link: "www.youtube.com/watch?v=exampl",
        isModalOpen: true,
    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-awareness-training");
    };

    if (!formData.isModalOpen) return null;

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Awareness Training Information</h2>
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
                            Title
                        </label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Choose Category
                        </label>
                        <div className="view-employee-data">{formData.chooseCategory}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Description
                        </label>
                        <div className="view-employee-data">{formData.description}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                YouTube Link
                            </label>
                            <div className="view-employee-data">{formData.youtube_link}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default QmsViewDraftAwarenessTraining
