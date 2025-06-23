import React from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./view.css"

const QmsViewEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const employeeDetails = {
    id: id,
    name: "Test",
    dob: "22/01/2003",
    email: "test@gmail.com",
    status: "Active",
    gender: "Male",
    phone: "998877455",
    department: "abcd",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  const handleCloseViewPage = () => {
    navigate("/company/qms/list-employee");
  };

  const handleEditAssessment = () => {
    navigate(`/company/qms/edit-employee/${id}`);
  };

  const handleDeleteAssessment = () => {
    alert("Are you sure you want to delete this employee?");
  };

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
      <div className="mt-5">
        <div className="grid grid-cols-2 pb-5">
          <div className="grid grid-cols-1 gap-[36px]">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Name</label>
              <p className="viewdatas">
                {employeeDetails.name || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">DOB</label>
              <p className="viewdatas">
                {employeeDetails.dob || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Email</label>
              <p className="viewdatas">
                {employeeDetails.email || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Status</label>
              <p className="viewdatas">
                  {employeeDetails.status || "N/A"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[36px] pl-10">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Gender</label>
              <p className="viewdatas">
                {employeeDetails.gender}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Phone</label>
              <p className="viewdatas">
                {employeeDetails.phone}
              </p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2B32]">
              <label className="viewlabels">Department / Division</label>
              <p className="viewdatas">
                {employeeDetails.department}
              </p>
            </div>
            <div className="flex justify-end items-center">
                <div className="flex gap-5">
                  <div className="flex flex-col justify-center items-center">
                    <button
                    className="border border-[#F9291F] rounded w-[148px] h-[41px] text-[#F9291F] hover:bg-[#F9291F] hover:text-white duration-200 buttons"
                    onClick={handleDeleteAssessment}>
                      Delete
                    </button>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <button 
                    className="border border-[#1E84AF] rounded w-[148px] h-[41px] text-[#1E84AF] hover:bg-[#1E84AF] hover:text-white duration-200 buttons"
                    onClick={handleEditAssessment}>
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
