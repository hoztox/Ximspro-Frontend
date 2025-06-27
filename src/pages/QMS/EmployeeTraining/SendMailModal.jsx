import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import "./sendmail.css";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Config";
import SuccessModal from "../../../components/Modals/SuccessModal";
import ErrorModal from "../../../components/Modals/ErrorModal";

const SendMailModal = ({ isOpen, onClose, performanceId }) => {
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const getUserCompanyId = () => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) return storedCompanyId;

    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      const userData = localStorage.getItem("user_company_id");
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error("Error parsing user company ID:", e);
          return null;
        }
      }
    }
    return null;
  };

  const getCurrentUserId = () => {
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      return localStorage.getItem("user_id");
    }
    return localStorage.getItem("company_id");
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        throw new Error("Company ID not found. Please log in again.");
      }

      const [managersResponse, employeesResponse, usersResponse] = await Promise.all([
        axios.get(`${BASE_URL}/company/users-active/${companyId}/`),
        axios.get(`${BASE_URL}/company/employees-active/${companyId}/`),
        axios.get(`${BASE_URL}/company/users-active/${companyId}/`),
      ]);

      setManagers(managersResponse.data);
      setEmployees(employeesResponse.data);
      setUsers(usersResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data. Please try again.");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
    } finally {
      setLoadingData(false);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    (`${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUsers = users.filter((user) => {
    const currentUserId = getCurrentUserId();
    return user.id !== selectedManager &&
           user.id.toString() !== currentUserId?.toString() &&
           (`${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const filteredManagers = managers.filter((manager) => {
    const currentUserId = getCurrentUserId();
    return manager.id.toString() !== currentUserId?.toString();
  });

  const handleEmployeeToggle = (employee) => {
    setSelectedEmployees((prev) => {
      const isSelected = prev.find((emp) => emp.id === employee.id);
      if (isSelected) {
        return prev.filter((emp) => emp.id !== employee.id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const handleUserToggle = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.find((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleRemoveEmployee = (employeeId) => {
    setSelectedEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  useEffect(() => {
    if (selectedManager) {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== selectedManager));
    }
  }, [selectedManager]);

  const getRelevantUserId = () => {
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }
    const companyId = localStorage.getItem("company_id");
    if (companyId) return companyId;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedManager) {
      setError("Manager is required");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      return;
    }
    if (selectedEmployees.length === 0 && selectedUsers.length === 0) {
      setError("At least one employee or user must be selected");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();
      if (!companyId || !userId) {
        throw new Error("Authentication data missing. Please log in again.");
      }

      const payload = {
        user: userId,
        company: companyId,
        manager: selectedManager,
        employee: selectedEmployees.map(emp => emp.id),
        users: selectedUsers.map(user => user.id),
        EmployeePerformance: performanceId,
      };

      await axios.post(`${BASE_URL}/qms/send-performance-email/`, payload);

      setSuccessMessage("Email Sent Successfully");
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedManager("");
        setSelectedEmployees([]);
        setSelectedUsers([]);
        setSearchTerm("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error sending email:", err);
      let errorMsg = "Failed to send email. Please try again.";
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === "object") {
          const errors = Object.values(err.response.data).flat();
          errorMsg = errors.join(", ");
        }
      }
      setError(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedManager("");
    setSelectedEmployees([]);
    setSelectedUsers([]);
    setSearchTerm("");
    setIsManagerDropdownOpen(false);
    setError("");
    setShowErrorModal(false);
    setShowSuccessModal(false);
    onClose();
  };

  const getEmployeeName = (employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  };

  const getUserName = (user) => {
    return `${user.first_name} ${user.last_name}`;
  };

  const getManagerName = (manager) => {
    return `${manager.first_name} ${manager.last_name}`;
  };

  const allSelectedRecipients = [
    ...selectedEmployees.map(emp => ({ ...emp, type: 'employee' })),
    ...selectedUsers.map(user => ({ ...user, type: 'user' }))
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="rounded-lg w-[600px] p-5"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-[#1C1C24] text-white rounded-lg">
              <div className="pt-5 pb-6 border-b border-[#383840] mx-5">
                <p className="evaluate-modal-head !text-[20px]">Send Mail</p>
              </div>

              {loadingData ? (
                <div className="p-5 text-center">
                  <p className="not-found">Loading data...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-6">
                  {/* Manager Selection */}
                  <div>
                    <label className="block mb-3 add-question-label">
                      Select Manager
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsManagerDropdownOpen(!isManagerDropdownOpen)}
                        className="w-full bg-[#24242D] rounded-md p-3 text-left text-[#AAAAAA] outline-none add-question-inputs flex items-center justify-between"
                        aria-label="Select Manager"
                      >
                        <span>
                          {selectedManager
                            ? getManagerName(filteredManagers.find((m) => m.id === selectedManager) || managers.find((m) => m.id === selectedManager))
                            : "Select Manager"}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${isManagerDropdownOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>
                      {isManagerDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 bg-[#24242D] add-question-inputs rounded-md mt-1 z-10 max-h-48 overflow-y-auto">
                          {filteredManagers.length > 0 ? (
                            filteredManagers.map((manager) => (
                              <button
                                key={manager.id}
                                type="button"
                                onClick={() => {
                                  setSelectedManager(manager.id);
                                  setIsManagerDropdownOpen(false);
                                }}
                                className="w-full text-left p-3 hover:bg-[#383840] text-white"
                              >
                                {getManagerName(manager)}
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-[#AAAAAA]">No managers available</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipients Selection */}
                  <div>
                    <label className="block mb-3 add-question-label">
                      Select Recipients (Employees & Users)
                    </label>

                    {/* Selected Recipients Tags */}
                    <div className="flex flex-wrap gap-[6px] mb-[10px] bg-[#24242D] min-h-[49px] rounded-md px-4 py-2">
                      {allSelectedRecipients.length === 0 ? (
                        <div className="flex items-center add-question-label !text-[#AAAAAA]">
                          No recipients selected
                        </div>
                      ) : (
                        <>
                          {allSelectedRecipients.slice(0, 4).map((recipient) => (
                            <div
                              key={`${recipient.type}-${recipient.id}`}
                              className="bg-[#1C1C24] text-white px-2 h-[34px] rounded add-question-label !text-[14px] flex items-center gap-2 max-w-[150px]"
                            >
                              <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                                {recipient.type === 'employee' ? getEmployeeName(recipient) : getUserName(recipient)}
                                <span className="text-[#AAAAAA] text-xs ml-1">
                                  ({recipient.type === 'employee' ? 'E' : 'U'})
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => 
                                  recipient.type === 'employee' 
                                    ? handleRemoveEmployee(recipient.id)
                                    : handleRemoveUser(recipient.id)
                                }
                                className="text-[#AAAAAA] hover:text-red-600"
                                aria-label={`Remove ${recipient.type === 'employee' ? getEmployeeName(recipient) : getUserName(recipient)}`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {allSelectedRecipients.length > 4 && (
                            <div className="bg-[#1C1C24] text-white px-3 h-[34px] rounded add-question-label !text-[14px] items-center flex">
                              +{allSelectedRecipients.length - 4} more
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="border border-[#5B5B5B] rounded-md px-4 py-[18px]">
                      <div className="relative mb-3">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-[#1C1C24] border border-[#5B5B5B] rounded-md px-4 py-[10px] text-white outline-none add-question-inputs"
                          placeholder="Search employees and users by name or email..."
                          aria-label="Search employees and users"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] w-5 h-5" />
                      </div>

                      <div className="max-h-[176px] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-0">
                          {filteredEmployees.length > 0 && (
                            <>
                              <div className="col-span-2 px-3 py-2 add-question-label !text-[#AAAAAA] border-b border-[#383840]">
                                Employees
                              </div>
                              {filteredEmployees.map((employee) => {
                                const isSelected = selectedEmployees.find(
                                  (emp) => emp.id === employee.id
                                );
                                return (
                                  <label
                                    key={`employee-${employee.id}`}
                                    className="flex items-center p-3 cursor-pointer gap-3 send-mail-label hover:bg-[#2A2A32]"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!isSelected}
                                      onChange={() => handleEmployeeToggle(employee)}
                                      className="form-checkboxes"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-white">
                                        {getEmployeeName(employee)}
                                      </div>
                                    </div>
                                  </label>
                                );
                              })}
                            </>
                          )}

                          {filteredUsers.length > 0 && (
                            <>
                              <div className="col-span-2 px-3 py-2 add-question-label !text-[#AAAAAA] border-b border-[#383840]">
                                Users
                              </div>
                              {filteredUsers.map((user) => {
                                const isSelected = selectedUsers.find(
                                  (u) => u.id === user.id
                                );
                                return (
                                  <label
                                    key={`user-${user.id}`}
                                    className="flex items-center p-3 cursor-pointer gap-3 send-mail-label hover:bg-[#2A2A32]"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!isSelected}
                                      onChange={() => handleUserToggle(user)}
                                      className="form-checkboxes"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-white">
                                        {getUserName(user)}
                                      </div>
                                    </div>
                                  </label>
                                );
                              })}
                            </>
                          )}

                          {filteredEmployees.length === 0 && filteredUsers.length === 0 && (
                            <div className="col-span-2 p-3 not-found text-center">
                              {searchTerm ? 'No employees or users found matching your search' : 'No employees or users available'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="cancel-btn duration-200"
                      disabled={loading}
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="save-btn duration-200 cursor-pointer"
                      disabled={loading || (selectedEmployees.length === 0 && selectedUsers.length === 0) || !selectedManager}
                      aria-label="Send Email"
                    >
                      {loading ? "Sending..." : "Send Email"}
                    </button>
                  </div>
                </form>
              )}
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendMailModal;