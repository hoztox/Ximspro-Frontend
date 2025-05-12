import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Config";

const QmsViewDraftNonConformity = () => {
  const [formData, setFormData] = useState({
    source: "",
    title: "",
    ncr: "",
    root_cause: { title: "" },
    executor: { first_name: "", last_name: "" },
    description: "",
    resolution: "",
    date_raised: "",
    date_completed: "",
    status: "",
    supplier: { company_name: "" },
    is_draft: false,
    send_notification: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDraftNonConformity = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/qms/conformity/${id}/`);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load draft data");
        setLoading(false);
        console.error("Error fetching draft Non Conformity data:", err);
      }
    };

    if (id) {
      fetchDraftNonConformity();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/draft-nonconformity");
  };

  if (loading)
    return (
      <div className="bg-[#1C1C24] text-white p-8 rounded-lg flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-[#1C1C24] text-white p-8 rounded-lg flex justify-center items-center">
        <p>{error}</p>
      </div>
    );

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Draft Non Conformity Information</h2>
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
            <label className="block view-employee-label mb-[6px]">Source</label>
            <div className="view-employee-data">{formData.source || "N/A"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Title</label>
            <div className="view-employee-data">{formData.title || "N/A"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">NCR No</label>
            <div className="view-employee-data">{formData.ncr || "N/A"}</div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Root Cause
            </label>
            <div className="view-employee-data">
              {formData.root_cause?.title || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Executor
            </label>
            <div className="view-employee-data">
              {formData.executor?.first_name
                ? `${formData.executor.first_name} ${formData.executor.last_name}`
                : "N/A"}
            </div>
          </div>

          {/* <div>
            <label className="block view-employee-label mb-[6px]">
              Supplier
            </label>
            <div className="view-employee-data">
              {formData.supplier?.company_name || "N/A"}
            </div>
          </div> */}

          <div>
            <label className="block view-employee-label mb-[6px]">
              Non Conformity Description
            </label>
            <div className="view-employee-data">
              {formData.description || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Resolution Details
            </label>
            <div className="view-employee-data">
              {formData.resolution || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Date Raised
            </label>
            <div className="view-employee-data">
              {formatDate(formData.date_raised)}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Complete By
            </label>
            <div className="view-employee-data">
              {formatDate(formData.date_completed)}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">Status</label>
            <div className="view-employee-data">{formData.status || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsViewDraftNonConformity;
