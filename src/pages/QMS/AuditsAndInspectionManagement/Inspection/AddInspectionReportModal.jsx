import React from 'react'

const AddInspectionReportModal = ({ 
  isVisible, 
  onClose, 
  onSave,
  isExiting,
  isAnimating
}) => {

   
  const handleSave = () => {
    onSave(minutesData);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`absolute inset-0 bg-black transition-opacity ${isExiting ? 'bg-opacity-0' : 'bg-opacity-50'}`}
      ></div>
      <div className={`bg-[#1C1C24] rounded-lg shadow-xl relative w-[1014px] p-5 transform transition-all duration-300 ease-in-out ${isAnimating ? 'modal-enter' : ''} ${isExiting ? 'modal-exit' : ''}`}>
        <div className="flex justify-between items-center px-[102px] border-b border-[#383840] pt-5">
          <h3 className="list-awareness-training-head">Add Inspection Report</h3>
        </div>
         Add Inspection Report
      </div>
    </div>
  );
};

export default AddInspectionReportModal
