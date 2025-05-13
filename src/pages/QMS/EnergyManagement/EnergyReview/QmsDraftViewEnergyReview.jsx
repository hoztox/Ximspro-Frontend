import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsDraftViewEnergyReview = () => {
  const [energyReview, setEnergyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch energy review data
  useEffect(() => {
    const fetchEnergyReview = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/energy-review/${id}/`
        );
        if (response.data.is_draft) {
          setEnergyReview(response.data);
        } else {
          setError("This energy review is not a draft.");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch energy review. Please try again later.");
        setLoading(false);
      }
    };

    fetchEnergyReview();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
        {/* Loading and Error States */}
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {/* Data Display */}
        {!loading && !error && energyReview && (
          <>
            {/* Vertical divider line */}
            <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
              <div>
                <label className="block view-employee-label mb-[6px]">
                  Energy Review Name/Title
                </label>
                <div className="view-employee-data">
                  {energyReview.energy_name || "N/A"}
                </div>
              </div>

              <div>
                <label className="block view-employee-label mb-[6px]">
                  Energy Review Number
                </label>
                <div className="view-employee-data">
                  {energyReview.review_no || "N/A"}
                </div>
              </div>

              <div>
                <label className="block view-employee-label mb-[6px]">
                  Review Type
                </label>
                <div className="view-employee-data">
                  {energyReview.review_type?.title || "N/A"}
                </div>
              </div>

              <div>
                <label className="block view-employee-label mb-[6px]">
                  Date
                </label>
                <div className="view-employee-data">
                  {formatDate(energyReview.date || "N/A")}
                </div>
              </div>

              <div>
                <label className="block view-employee-label mb-[6px]">
                  Attach Document
                </label>
                {energyReview.upload_attachment ? (
                  <a
                    href={energyReview.upload_attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 click-view-file-btn text-[#1E84AF] items-center"
                  >
                    Click to view file <Eye size={17} />
                  </a>
                ) : (
                  <div className="view-employee-data">No attachment</div>
                )}
              </div>

              <div>
                <label className="block view-employee-label mb-[6px]">
                  Relate Business Process
                </label>
                <div className="view-employee-data">
                  {energyReview.relate_business_process || "N/A"}
                </div>
              </div>

              <div>
                <label className="block view-employee-label mb-[6px]">
                  Energy Remarks
                </label>
                <div className="view-employee-data">
                  {energyReview.remarks || "N/A"}
                </div>
              </div>

              <div>
                <label className="block view-employee-label mb-[6px]">
                  Relate Document/Process
                </label>
                <div className="view-employee-data">
                  {energyReview.relate_document_process || "N/A"}
                </div>
              </div>

              <div>
                <label className="block view-employee-label mb-[6px]">
                  Revision
                </label>
                <div className="view-employee-data">
                  {energyReview.revision || "N/A"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QmsDraftViewEnergyReview;
