import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import plusicon from "../../../assets/images/Company User Management/plus icon.svg";
import views from "../../../assets/images/Companies/view.svg";
import edits from "../../../assets/images/Company User Management/edits.svg";
import deletes from "../../../assets/images/Company User Management/deletes.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../Utils/Config";
import DeleteConfimModal from '../../../components/Modals/DeleteConfimModal';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';
import BlockConfirmModal from '../../../components/Modals/BlockConfirmModal';

const QmsListEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const employeesPerPage = 10;

  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToBlock, setEmployeeToBlock] = useState(null);
  const [showBlockConfirmModal, setShowBlockConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState({});
  const [currentStatus, setCurrentStatus] = useState("");
  const [actionType, setActionType] = useState("");

  const navigate = useNavigate();

  const getCompanyId = () => {
    const role = localStorage.getItem("role");
    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        if (!userCompanyId) return null;
        
        // Check if it's already a plain string/number or needs parsing
        try {
          return JSON.parse(userCompanyId);
        } catch {
          // If parsing fails, return the value as is (might be a plain string)
          return userCompanyId;
        }
      } catch (e) {
        console.error("Error parsing company ID:", e);
        return null;
      }
    }
    return null;
  };

  const fetchEmployees = async () => {
    try {
      const companyId = getCompanyId();
      if (!companyId) {
        console.warn("No company ID found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/company/employees/company/${companyId}/`, {
        params: {
          search: searchQuery,
          page: currentPage,
          limit: employeesPerPage,
        },
      });

      let employeesList = [];
      if (Array.isArray(response.data)) {
        employeesList = response.data;
        setTotalPages(1);
      } else if (response.data && response.data.employees) {
        employeesList = response.data.employees;
        setTotalPages(response.data.total_pages || 1);
      }

      // Ensure all employees have required properties
      const processedEmployees = employeesList.map(employee => ({
        ...employee,
        status: employee.status || 'active', // Default status
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || ''
      }));

      const sortedEmployees = processedEmployees.sort((a, b) => a.id - b.id);
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddEmployee = () => {
    navigate('/company/qms/add-employee');
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/company/qms/edit-employee/${employeeId}`);
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/company/qms/view-employee/${employeeId}`);
  };

  const handleDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await axios.delete(`${BASE_URL}/company/employees/${employeeToDelete}/`);
        setEmployees(employees.filter(employee => employee.id !== employeeToDelete));
        setSuccessMessage("Employee Deleted Successfully!");
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } catch (error) {
        console.error("Error deleting employee:", error);
        let errorMsg = error.message;
        if (error.response && error.response.data) {
          if (error.response.data.detail) {
            errorMsg = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          }
        }
        setError(errorMsg);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      }
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleToggleStatus = (employeeId, currentStatus) => {
    setEmployeeToBlock(employeeId);
    setCurrentStatus(currentStatus);
    const newAction = currentStatus && currentStatus.toLowerCase() === "active" ? "block" : "unblock";
    setActionType(newAction);
    setShowBlockConfirmModal(true);
  };

  const handleConfirmBlock = async () => {
    if (employeeToBlock) {
      setStatusLoading(prev => ({ ...prev, [employeeToBlock]: true }));
      try {
        const newStatus = currentStatus && currentStatus.toLowerCase() === "active" ? "blocked" : "active";
        const companyId = getCompanyId();
        if (!companyId) {
          setError('Company ID not found. Please log in again.');
          setShowErrorModal(true);
          setTimeout(() => {
            setShowErrorModal(false);
          }, 3000);
          return;
        }

        await axios.put(`${BASE_URL}/company/employees/update/${employeeToBlock}/`, {
          status: newStatus,
          company_id: companyId
        });

        setEmployees(prevEmployees =>
          prevEmployees.map(employee =>
            employee.id === employeeToBlock
              ? { ...employee, status: newStatus }
              : employee
          )
        );

        const message = newStatus === "blocked"
          ? "Employee Blocked Successfully!"
          : "Employee Unblocked Successfully!";
        setSuccessMessage(message);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } catch (error) {
        console.error("Error updating employee status:", error);
        let errorMsg = error.message;
        if (error.response && error.response.data) {
          if (error.response.data.detail) {
            errorMsg = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          }
        }
        setError(errorMsg);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      } finally {
        setStatusLoading(prev => ({ ...prev, [employeeToBlock]: false }));
      }
    }
    setShowBlockConfirmModal(false);
  };

  const handleCancelBlock = () => {
    setShowBlockConfirmModal(false);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getBlockModalMessage = () => {
    return actionType === "block"
      ? "Are you sure you want to block this Employee?"
      : "Are you sure you want to unblock this Employee?";
  };

  // Safe status display function
  const getStatusDisplay = (status) => {
    if (!status) return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-[#1C1C24] list-users-main">
      <div className="flex items-center justify-between px-[20px] pt-[24px]">
        <h1 className="list-users-head">List Employee</h1>

        <DeleteConfimModal
          showDeleteModal={showDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          deleteMessage="Employee"
        />
        <BlockConfirmModal
          showBlockConfirmModal={showBlockConfirmModal}
          actionType={actionType}
          onConfirm={handleConfirmBlock}
          onCancel={handleCancelBlock}
          modalMessage={getBlockModalMessage()}
        />
        <SuccessModal
          showSuccessModal={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          successMessage={successMessage}
        />
        <ErrorModal
          showErrorModal={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          error={error}
        />

        <div className="flex space-x-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="serach-input focus:outline-none bg-transparent"
            />
            <div className='absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center add-user-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white whitespace-nowrap"
            onClick={handleAddEmployee}
          >
            <span>Add Employee</span>
            <img src={plusicon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
          </button>
        </div>
      </div>

      <div className="p-5 overflow-hidden">
        <table className="w-full">
          <thead className='bg-[#24242D]'>
            <tr className="list-users-tr h-[48px]">
              <th className="px-5 text-left add-user-theads">No</th>
              <th className="px-5 text-left add-user-theads">Employee Name</th>
              <th className="px-5 text-left add-user-theads">Email</th>
              <th className="px-5 text-left add-user-theads">Status</th>
              <th className="px-5 text-center add-user-theads">View</th>
              <th className="px-5 text-center add-user-theads">Edit</th>
              <th className="px-5 text-center add-user-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee.id} className="border-b border-[#383840] hover:bg-[#1a1a20] cursor-pointer h-[46px]">
                  <td className="px-[23px] add-user-datas">{(currentPage - 1) * employeesPerPage + index + 1}</td>
                  <td className="px-5 add-user-datas">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-5 add-user-datas">{employee.email}</td>
                  <td className="px-5 add-user-datas">
                    <span className={`px-2 py-1 rounded text-xs ${
                      employee.status === 'active' 
                        ? 'bg-[#36DDAE11] text-[#36DDAE]' 
                        : 'bg-[#dd363642] text-red-500'
                    }`}>
                      {getStatusDisplay(employee.status)}
                    </span>
                  </td>
                  <td className="px-4 add-user-datas text-center">
                    <button onClick={() => handleViewEmployee(employee.id)}>
                      <img src={views} alt="View" />
                    </button>
                  </td>
                  <td className="px-4 add-user-datas text-center">
                    <button onClick={() => handleEditEmployee(employee.id)}>
                      <img src={edits} alt="Edit" className='w-[16px] h-[16px]' />
                    </button>
                  </td>
                  <td className="px-4 add-user-datas text-center">
                    <button onClick={() => handleDeleteClick(employee.id)}>
                      <img src={deletes} alt="Delete" className='w-[16px] h-[16px]' />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 not-found">No employees found.</td>
              </tr>
            )}
            <tr>
              <td colSpan="7" className="pt-[15px] border-t border-[#383840]">
                <div className="flex items-center justify-between">
                  <div className="text-white total-text">
                    Total-{employees.length}
                  </div>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="cursor-pointer swipe-text"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`${currentPage === page ? 'pagin-active' : 'pagin-inactive'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer swipe-text"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QmsListEmployee;