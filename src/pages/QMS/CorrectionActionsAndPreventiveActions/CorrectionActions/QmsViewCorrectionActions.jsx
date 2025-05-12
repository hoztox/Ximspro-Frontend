import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewCorrectionActions = () => {
  const [formData, setFormData] = useState({
    source: "",
    title: "",
    action_no: "",
    root_cause: "",
    executor: "",
    description: "",
    action_or_corrections: "",
    date_raised: "",
    date_completed: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCarNumber = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/qms/car-numbers/${id}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
        console.error("Error fetching car number data:", err);
      }
    };

    if (id) {
      fetchCarNumber();
    }
  }, [id]);

  const handleClose = () => {
    navigate("/company/qms/list-correction-actions");
  };

  const handleEdit = (id) => {
    navigate(`/company/qms/edit-correction-actions/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${BASE_URL}/qms/car-numbers/${id}/`);
        navigate("/company/qms/list-correction-actions");
      } catch (err) {
        console.error("Error deleting car number:", err);
        alert("Failed to delete item");
      }
    }
  };

  if (loading)
    return (
      <div className="bg-[#1C1C24] text-white p-8 rounded-lg flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-[#1C1C24] text-white p-8 rounded-lg">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 bg-blue-600 px-4 py-2 rounded-md"
          onClick={() => navigate("/company/qms/list-correction-actions")}
        >
          Back to List
        </button>
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
          Correction/Corrective Action Information
        </h2>
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>

      <div className="pt-5 relative">
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
            <label className="block view-employee-label mb-[6px]">
              Action No
            </label>
            <div className="view-employee-data">
              {formData.action_no || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Root Cause
            </label>
            <div className="view-employee-data">
              {formData.root_cause?.title}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Executor
            </label>
            <div className="view-employee-data">
              {formData.executor?.first_name} {formData.executor?.last_name}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Description
            </label>
            <div className="view-employee-data">
              {formData.description || "N/A"}
            </div>
          </div>

          <div>
            <label className="block view-employee-label mb-[6px]">
              Action or Corrections
            </label>
            <div className="view-employee-data">
              {formData.action_or_corrections || "N/A"}
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
            <div className="flex space-x-10 justify-end">
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
  );
};

export default QmsViewCorrectionActions;
