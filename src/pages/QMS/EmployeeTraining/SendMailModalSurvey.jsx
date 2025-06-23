import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import "./sendmail.css"
import axios from "axios";
import { BASE_URL } from "../../../Utils/Config";

const SendMailModal = ({ isOpen, onClose, performanceId }) => {
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Dynamic data states
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [company, setCompany] = useState(null);
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
  // Fetch managers and employees when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
     const companyId = getUserCompanyId();
      const managersResponse = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
      setManagers(managersResponse.data);

      // Fetch employees
      const employeesResponse = await axios.get(`${BASE_URL}/company/employees-active/${companyId}/`);
      setEmployees(employeesResponse.data);



    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoadingData(false);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleRemoveEmployee = (employeeId) => {
    setSelectedEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
  };
 
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
      return;
    }
    if (selectedEmployees.length === 0) {
      setError("At least one employee must be selected");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
 const companyId = getUserCompanyId();
  const userId = getRelevantUserId();
      const payload = {
        user:userId,
        company:companyId,
        manager: selectedManager,
        employee: selectedEmployees.map(emp => emp.id),
       
       
      };

      await axios.post(`${BASE_URL}/qms/send-survey-email/`, payload);
      
      // Success feedback
      setError("");
      alert("Email sent successfully!");
      
      // Reset form
      setSelectedManager("");
      setSelectedEmployees([]);
      setSearchTerm("");
      
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (err) {
      console.error("Error sending email:", err);
      let errorMsg = "Failed to send email. Please try again.";
      
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === 'object') {
          // Handle field-specific errors
          const errors = Object.values(err.response.data).flat();
          errorMsg = errors.join(', ');
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear all form data
    setSelectedManager("");
    setSelectedEmployees([]);
    setSearchTerm("");
    setIsManagerDropdownOpen(false);
    setError("");
    onClose();
  };

  const getEmployeeName = (employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  };

  const getManagerName = (manager) => {
    return `${manager.first_name} ${manager.last_name}` ;
  };

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
              <div className=" pt-5 pb-6 border-b border-[#383840] mx-5">
                <p className="evaluate-modal-head !text-[20px]">Send Mail</p>
              </div>
              
              {loadingData ? (
                <div className="p-5 text-center">
                  <p className="text-[#AAAAAA]">Loading data...</p>
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
                        onClick={() =>
                          setIsManagerDropdownOpen(!isManagerDropdownOpen)
                        }
                        className="w-full bg-[#24242D] rounded-md p-3 text-left text-[#AAAAAA] outline-none add-question-inputs flex items-center justify-between"
                      >
                        <span>
                          {selectedManager
                            ? getManagerName(managers.find((m) => m.id === selectedManager))
                            : "Select Manager"}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isManagerDropdownOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                      {isManagerDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 bg-[#24242D] add-question-inputs rounded-md mt-1 z-10 max-h-48 overflow-y-auto">
                          {managers.length > 0 ? (
                            managers.map((manager) => (
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

                  {/* Employee Selection */}
                  <div>
                    <label className="block mb-3 add-question-label">
                      Select Employee
                    </label>

                    {/* Selected Employee Tags */}
                    <div className="flex flex-wrap gap-[6px] mb-[10px] bg-[#24242D] min-h-[49px] rounded-md px-4 py-2">
                      {selectedEmployees.length === 0 ? (
                        <div className="flex items-center text-[#AAAAAA] text-sm">
                          No employees selected
                        </div>
                      ) : (
                        <>
                          {selectedEmployees.slice(0, 4).map((employee) => (
                            <div
                              key={employee.id}
                              className="bg-[#1C1C24] text-white px-2 h-[34px] rounded add-question-label !text-[14px] flex items-center gap-2 max-w-[150px]"
                            >
                              <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                                {getEmployeeName(employee)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveEmployee(employee.id)}
                                className="text-[#AAAAAA] hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {selectedEmployees.length > 4 && (
                            <div className="bg-[#1C1C24] text-white px-3 h-[34px] rounded add-question-label !text-[14px] items-center flex">
                              +{selectedEmployees.length - 4} more
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="border border-[#5B5B5B] rounded-md px-4 py-[18px]">
                      {/* Search Input */}
                      <div className="relative mb-3">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-[#1C1C24] border border-[#5B5B5B] rounded-md px-4 py-[10px] text-white outline-none add-question-inputs"
                          placeholder="Search employees by name or email..."
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] w-5 h-5" />
                      </div>

                      <div className="max-h-[176px] overflow-y-auto">
                        {/* Employee List */}
                        <div className="grid grid-cols-2 gap-0">
                          {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => {
                              const isSelected = selectedEmployees.find(
                                (emp) => emp.id === employee.id
                              );
                              return (
                                <label
                                  key={employee.id}
                                  className="flex items-start p-3 cursor-pointer gap-3 send-mail-label hover:bg-[#2A2A32]"
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!isSelected}
                                    onChange={() => handleEmployeeToggle(employee)}
                                    className="form-checkboxes mt-1"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-white">
                                      {getEmployeeName(employee)}
                                    </div>
                                     
                                  </div>
                                </label>
                              );
                            })
                          ) : (
                            <div className="col-span-2 p-3 text-[#AAAAAA] text-center">
                              {searchTerm ? 'No employees found matching your search' : 'No employees available'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="cancel-btn duration-200"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="save-btn duration-200"
                      disabled={loading || selectedEmployees.length === 0 || !selectedManager}
                    >
                      {loading ? "Sending..." : "Send Email"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendMailModal;