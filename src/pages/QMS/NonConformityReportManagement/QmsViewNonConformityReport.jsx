import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../Utils/Config";
import axios from "axios";

const QmsViewNonConformityReport = () => {
  const [formData, setFormData] = useState({
    source: "",
    title: "",
    ncr: null,
    root_cause: null,
    executor: null,
    description: "",
    resolution: "",
    date_raised: "",
    date_completed: "",
    status: "",
    supplier: null,
    user: null,
    company: null,
    is_draft: false,
    send_notification: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNcrData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/qms/conformity/${id}/`);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
        console.error("Error fetching conformity report data:", err);
      }
    };

    if (id) {
      fetchNcrData();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/list-nonconformity");
  };

  const handleEdit = (id) => {
    navigate(`/company/qms/edit-nonconformity/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${BASE_URL}/qms/conformity/${id}/`);
        navigate("/company/qms/list-nonconformity");
      } catch (err) {
        console.error("Error deleting conformity report:", err);
        alert("Failed to delete item");
      }
    }
  };

  if (loading)
    return (
      <div className="bg-[#1C1C24] text-white p-8 rounded-lg flex justify-center items-center">
        <p className="not-found">Loading...</p>
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
        <h2 className="view-employee-head">
          Non Conformity Reports Information
        </h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>

      <div className="relative pt-5">
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

          {/* {formData.supplier && (
            <div>
              <label className="block view-employee-label mb-[6px]">
                Supplier
              </label>
              <div className="view-employee-data">
                {formData.supplier.company_name || "N/A"}
              </div>
            </div>
          )} */}

          <div>
            <label className="block view-employee-label mb-[6px]">
              Executor
            </label>
            <div className="view-employee-data">
              {formData.executor
                ? `${formData.executor.first_name} ${formData.executor.last_name}`
                : "N/A"}
            </div>
          </div>

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

          <div className="flex justify-between">
            <div>
              <label className="block view-employee-label mb-[6px]">
                Status
              </label>
              <div className="view-employee-data">
                {formData.status || "N/A"}
              </div>
            </div>

            <div className="col-span-2 flex justify-end">
              <div className="flex space-x-10">
                <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                  Edit
                  <button onClick={() => handleEdit(id)}>
                    <img src={edits} alt="Edit Icon" />
                  </button>
                </div>

                <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                  Delete
                  <button onClick={() => handleDelete(id)}>
                    <img src={deletes} alt="Delete Icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsViewNonConformityReport;
