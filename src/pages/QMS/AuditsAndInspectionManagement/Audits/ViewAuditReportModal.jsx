import React from 'react'
import { X } from 'lucide-react';

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
            <h2 className="view-employee-head">Audit Report</h2>
            <button
                onClick={onClose}
                className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
            >
                <X className="text-white" />
            </button>
        </div>
         <div>

          Audit Report
         </div>
    </div>
</div>
);
};
export default ViewAuditReportModal
