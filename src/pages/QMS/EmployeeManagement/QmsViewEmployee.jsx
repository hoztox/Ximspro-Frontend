import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Config";
import DeleteConfimModal from '../../../components/Modals/DeleteConfimModal';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';
import "./view.css";

const QmsViewEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Get company ID from localStorage
  const getCompanyId = () => {
    const role = localStorage.getItem("role");
    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        if (!userCompanyId) return null;
        
        try {
          return JSON.parse(userCompanyId);
        } catch {
          return userCompanyId;
        }
      } catch (e) {
        console.error("Error parsing company ID:", e);
        return null;
      }
    }
    return null;
  };

  // Fetch employee details
  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/company/employees/${id}/`);
      setEmployeeDetails(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      let errorMsg = "Failed to fetch employee details";
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Navigation handlers
  const handleCloseViewPage = () => {
    navigate("/company/qms/list-employee");
  };

  const handleEditEmployee = () => {
    navigate(`/company/qms/edit-employee/${id}`);
  };

  // Delete handlers
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/company/employees/${id}/`);
      setSuccessMessage("Employee deleted successfully!");
      setShowSuccessModal(true);
      
      // Navigate back to list after successful deletion
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-employee");
      }, 2000);
    } catch (error) {
      console.error("Error deleting employee:", error);
      let errorMsg = "Failed to delete employee";
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#1C1C24] p-5 rounded-lg flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#1C1C24] p-5 rounded-lg">
        <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
          <h1 className="viewhead">Employee Information</h1>
          <button
            className="text-white bg-[#24242D] p-2 rounded-md"
            onClick={handleCloseViewPage}
          >
            <X size={22} />
          </button>
        </div>
        <div className="mt-5 text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={fetchEmployeeDetails}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No employee data
  if (!employeeDetails) {
    return (
      <div className="bg-[#1C1C24] p-5 rounded-lg">
        <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
          <h1 className="viewhead">Employee Information</h1>
          <button
            className="text-white bg-[#24242D] p-2 rounded-md"
            onClick={handleCloseViewPage}
          >
            <X size={22} />
          </button>
        </div>
        <div className="mt-5 text-center text-gray-400">
          <p>Employee not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg">
      {/* Modals */}
      <DeleteConfimModal
        showDeleteModal={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        deleteMessage="Employee"
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        successMessage={successMessage}
      />
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={errorMessage}
      />

      <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
        <h1 className="viewhead">Employee Information</h1>
        <button
          className="text-white bg-[#24242D] p-2 rounded-md"
          onClick={handleCloseViewPage}
        >
          <X size={22} />
        </button>
      </div>
      
      <div className="mt-5">
        <div className="grid grid-cols-2 pb-5">
          <div className="grid grid-cols-1 gap-[36px]">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Employee ID</label>
              <p className="viewdatas">
                {employeeDetails.employee_id || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">First Name</label>
              <p className="viewdatas">
                {employeeDetails.first_name || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Last Name</label>
              <p className="viewdatas">
                {employeeDetails.last_name || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">DOB</label>
              <p className="viewdatas">
                {formatDate(employeeDetails.date_of_birth)}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Email</label>
              <p className="viewdatas">
                {employeeDetails.email || "N/A"}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-[36px] pl-10">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Gender</label>
              <p className="viewdatas">
                {employeeDetails.gender || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Phone</label>
              <p className="viewdatas">
                {employeeDetails.phone || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Department</label>
              <p className="viewdatas">
                {employeeDetails.department || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Employment Status</label>
              <p className="viewdatas">
                <span className={`px-2 py-1 rounded text-xs ${
                  employeeDetails.employment_status === 'Active' 
                    ? 'bg-[#36DDAE11] text-[#36DDAE]' 
                    : 'bg-[#dd363642] text-red-500'
                }`}>
                  {employeeDetails.employment_status || "N/A"}
                </span>
              </p>
            </div>
            <div className="flex justify-end items-center">
              <div className="flex gap-5">
                <div className="flex flex-col justify-center items-center">
                  <button
                    className="border border-[#F9291F] rounded w-[148px] h-[41px] text-[#F9291F] hover:bg-[#F9291F] hover:text-white duration-200 buttons"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <button 
                    className="border border-[#1E84AF] rounded w-[148px] h-[41px] text-[#1E84AF] hover:bg-[#1E84AF] hover:text-white duration-200 buttons"
                    onClick={handleEditEmployee}
                  >
                    Edit
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

export default QmsViewEmployee;