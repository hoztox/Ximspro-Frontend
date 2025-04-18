import React, { useState } from "react";
import { X, Eye } from "lucide-react";

const ViewMinutesModal = ({
    isVisible,
    onClose,
    isExiting,
    isAnimating
}) => {
    if (!isVisible) return null;

    const [formData, setFormData] = useState({
        date: "10-04-2025",
        meetingType: "Normal",
        venue: "Test",
        start: "09:30",
        end: "10:30",
        minutes: "",

    });

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className={`absolute inset-0 bg-black transition-opacity ${isExiting ? 'bg-opacity-0' : 'bg-opacity-50'}`}
                onClick={onClose}
            ></div>
            <div className={`bg-[#1C1C24] rounded-lg shadow-xl relative w-[1014px] p-6 transform transition-all duration-300 ease-in-out ${isAnimating ? 'modal-enter' : ''} ${isExiting ? 'modal-exit' : ''}`}>
                <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                    <h2 className="view-employee-head">Meeting Minutes Information</h2>
                    <button
                        onClick={onClose}
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
                                Date
                            </label>
                            <div className="view-employee-data">{formData.date}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Meeting Type
                            </label>
                            <div className="view-employee-data">{formData.meetingType}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Venue
                            </label>
                            <div className="view-employee-data">{formData.venue}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Start
                            </label>
                            <div className="view-employee-data">{formData.start}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                End
                            </label>
                            <div className="view-employee-data">{formData.end}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Minutes
                            </label>
                            <div className="view-employee-data">{formData.minutes}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Minutes Attached
                            </label>
                            <button className="flex items-center gap-2 click-view-file-btn !text-[18px] text-[#1E84AF]">
                                Click to view file <Eye size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewMinutesModal;