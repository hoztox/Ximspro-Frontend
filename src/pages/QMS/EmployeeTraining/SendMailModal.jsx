import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import "./sendmail.css"
// import axios from "axios";
// import { BASE_URL } from "../../../../Utils/Config";

const SendMailModal = ({ isOpen, onClose, performanceId }) => {
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock data - replace with your actual data
  const managers = [
    { id: 1, name: "Manager 1" },
    { id: 2, name: "Manager 2" },
    { id: 3, name: "Manager 3" },
  ];

  const employees = [
    { id: 1, name: "Useadadsdar 123" },
    { id: 2, name: "User 456" },
    { id: 3, name: "User 789" },
    { id: 4, name: "User 101" },
    { id: 5, name: "User 102" },
    { id: 6, name: "User 103" },
  ];

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    try {
      // Replace with your actual API endpoint for sending email
      // await axios.post(`${BASE_URL}/qms/performance/${performanceId}/send-mail/`, {
      //   managerId: selectedManager,
      //   employeeIds: selectedEmployees.map(emp => emp.id),
      // });
      setSelectedManager("");
      setSelectedEmployees([]);
      setError("");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error sending email:", err);
      let errorMsg = err.message;
      if (err.response) {
        if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
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
                          ? managers.find((m) => m.id === selectedManager)?.name
                          : "Select Manager"}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isManagerDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    {isManagerDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 bg-[#24242D] add-question-inputs rounded-md mt-1 z-10">
                        {managers.map((manager) => (
                          <button
                            key={manager.id}
                            type="button"
                            onClick={() => {
                              setSelectedManager(manager.id);
                              setIsManagerDropdownOpen(false);
                            }}
                            className="w-full text-left p-3 hover:bg-[#383840] text-white"
                          >
                            {manager.name}
                          </button>
                        ))}
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
                  <div className="flex flex-wrap gap-[6px] mb-[10px] bg-[#24242D] h-[49px] rounded-md px-4 items-center">
                    {selectedEmployees.slice(0, 4).map((employee) => (
                      <div
                        key={employee.id}
                        className="bg-[#1C1C24] text-white px-2 h-[34px] rounded add-question-label !text-[14px] flex items-center gap-2 w-[105px] whitespace-nowrap"
                      >
                        <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                          {employee.name}
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
                        +{selectedEmployees.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="border border-[#5B5B5B] rounded-md px-4 py-[18px]">
                    {/* Search Input */}
                    <div className="relative mb-3">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1C1C24] border border-[#5B5B5B] rounded-md px-4 py-[10px]  text-white outline-none add-question-inputs"
                        placeholder="Search Users..."
                      />
                      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] w-5 h-5" />
                    </div>

                    <div className=" max-h-[176px] overflow-y-auto">
                      {/* Employee List */}
                      <div className="grid grid-cols-2 gap-0">
                        {filteredEmployees.map((employee) => {
                          const isSelected = selectedEmployees.find(
                            (emp) => emp.id === employee.id
                          );
                          return (
                            <label
                              key={employee.id}
                              className="flex items-center p-3 cursor-pointer gap-3 send-mail-label"
                            >
                              <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={() => handleEmployeeToggle(employee)}
                                className="form-checkboxes"
                              />
                              <span>
                                {employee.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

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
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendMailModal;
