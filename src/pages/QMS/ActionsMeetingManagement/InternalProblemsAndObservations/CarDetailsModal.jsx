import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import ErrorModal from "../Modals/ErrorModal";

const CarDetailsModal = ({ isOpen, onClose, carDetails }) => {
  const [animationState, setAnimationState] = useState("closed");
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Modal animation handler
  useEffect(() => {
    if (isOpen) {
      setAnimationState("opening");
      const timer = setTimeout(() => setAnimationState("open"), 10);
      return () => clearTimeout(timer);
    } else if (animationState === "open") {
      setAnimationState("closing");
      const timer = setTimeout(() => setAnimationState("closed"), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle case where carDetails is not provided
  useEffect(() => {
    if (isOpen && !carDetails) {
      setError("No CAR details available");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
    }
  }, [isOpen, carDetails]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (animationState === "closed") return null;

  return (
    <div
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${
        animationState === "opening" || animationState === "closing" ? "bg-opacity-0" : "bg-opacity-50"
      }`}
      onClick={handleBackdropClick}
    >
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />

      <div
        className={`bg-[#1C1C24] text-white rounded-lg w-full max-w-3xl transition-all duration-300 ease-in-out ${
          animationState === "opening" || animationState === "closing" ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="flex justify-between items-center m-6 pb-6 border-b border-[#383840]">
          <h2 className="view-employee-head">Correction/Corrective Action Information</h2>
          <button
            onClick={onClose}
             className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
          >
            <X />
          </button>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] px-6 pb-6">
            {/* Source */}
            <div>
              <label className="block view-employee-label mb-[6px]">Source</label>
              <div className="view-employee-data">{carDetails?.source || "N/A"}</div>
            </div>

            {/* Title */}
            <div>
              <label className="block view-employee-label mb-[6px]">Title</label>
              <div className="view-employee-data">{carDetails?.title || "N/A"}</div>
            </div>

            {/* Action No */}
            <div>
              <label className="block view-employee-label mb-[6px]">Action No</label>
              <div className="view-employee-data">{carDetails?.action_no || "N/A"}</div>
            </div>

            {/* Root Cause */}
            <div>
              <label className="block view-employee-label mb-[6px]">Root Cause</label>
              <div className="view-employee-data">{carDetails?.root_cause?.title || "N/A"}</div>
            </div>

            {/* Executor */}
            <div>
              <label className="block view-employee-label mb-[6px]">Executor</label>
              <div className="view-employee-data">
                {`${carDetails?.executor?.first_name || ""} ${carDetails?.executor?.last_name || ""}`.trim() || "N/A"}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block view-employee-label mb-[6px]">Description</label>
              <div className="view-employee-data">{carDetails?.description || "N/A"}</div>
            </div>

            {/* Action or Corrections */}
            <div>
              <label className="block view-employee-label mb-[6px]">Action or Corrections</label>
              <div className="view-employee-data">{carDetails?.action_or_corrections || "N/A"}</div>
            </div>

            {/* Date Raised */}
            <div>
              <label className="block view-employee-label mb-[6px]">Date Raised</label>
              <div className="view-employee-data">{formatDate(carDetails?.date_raised)}</div>
            </div>

            {/* Complete By */}
            <div>
              <label className="block view-employee-label mb-[6px]">Complete By</label>
              <div className="view-employee-data">{formatDate(carDetails?.date_completed)}</div>
            </div>

            {/* Status */}
            <div>
              <label className="block view-employee-label mb-[6px]">Status</label>
              <div className="view-employee-data">{carDetails?.status || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;