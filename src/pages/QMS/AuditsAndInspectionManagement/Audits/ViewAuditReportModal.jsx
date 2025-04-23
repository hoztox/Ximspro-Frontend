import React from 'react'
import { X, Eye } from 'lucide-react';

const ViewAuditReportModal = ({
    isVisible,
    onClose,
    isExiting,
    isAnimating
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className={`absolute inset-0 bg-black transition-opacity ${isExiting ? 'bg-opacity-0' : 'bg-opacity-50'}`}
                onClick={onClose}
            ></div>
            <div className={`bg-[#1C1C24] rounded-lg shadow-xl relative w-[1014px] p-6 transform transition-all duration-300 ease-in-out ${isAnimating ? 'modal-enter' : ''} ${isExiting ? 'modal-exit' : ''}`}>
                <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                    <h2 className="view-employee-head">Audit Report Information</h2>
                    <button
                        onClick={onClose}
                        className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                    >
                        <X className="text-white" />
                    </button>
                </div>
                <div>
                    <div className="grid grid-cols-2">
                        <div className='border-r border-[#383840] mt-5'>
                            <label className="block view-employee-label mb-[6px]">
                                Audit Report
                            </label>
                            <button className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn">
                                Click to view file <Eye size={18} />
                            </button>
                        </div>

                        <div className='mt-5 ml-5'>
                            <label className="block view-employee-label mb-[6px]">
                                Non conformities
                            </label>
                            <button className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn">
                                Click to view file <Eye size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ViewAuditReportModal
