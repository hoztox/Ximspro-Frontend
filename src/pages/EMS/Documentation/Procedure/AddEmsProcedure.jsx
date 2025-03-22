import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate } from "react-router-dom";

const AddEmsProcedure = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear();

  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    procedureName: "12345566",
    writtenBy: "",
    procedureNumber: "12345566",
    checkedBy: "",
    revision: "12345566",
    approvedBy: "",
    documentType: "Internal",
    date: {
      day: currentDay,
      month: currentMonth,
      year: currentYear,
    },
    years: "",
    months: "",
    recordFormat: "",
    publish: false,
    sendNotification: false,
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    writtenBy: false,
    checkedBy: false,
    approvedBy: false,
    documentType: false,
    day: false,
    month: false,
    year: false,
  });

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(formData.date.month, formData.date.year) },
    (_, i) => i + 1
  );

  // Generate months (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate years (current year - 10 to current year + 10)
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name); // Store the file name
    }
  };

  const handleDropdownChange = (e, dropdown) => {
    const value = e.target.value;

    setFormData((prev) => {
      if (["day", "month", "year"].includes(dropdown)) {
        return {
          ...prev,
          date: {
            ...prev.date,
            [dropdown]: parseInt(value, 10),
          },
        };
      }
      return {
        ...prev,
        [dropdown]: value,
      };
    });

    setOpenDropdowns((prev) => ({ ...prev, [dropdown]: false })); // Close dropdown
  };

  const handleCancelClick = () => {
    navigate("/company/ems/procedure");
  };

  // Get month name from number
  const getMonthName = (monthNum) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNum - 1];
  };

  return (
    <div className="bg-[#1C1C24] rounded-lg text-white">
      <div>
        <h1 className="add-manual-sections">Add Procedures</h1>

        <div className="border-t border-[#383840] mx-[18px] pt-[22px] px-[104px]">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="add-qms-manual-label">
                Procedure Name/Title
              </label>
              <input
                type="text"
                name="procedureName"
                value={formData.procedureName}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
            </div>

            <div>
              <label className="add-qms-manual-label">
                Written/Prepare By <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  onFocus={() => toggleDropdown("writtenBy")} // Open dropdown
                  onChange={(e) => handleDropdownChange(e, "writtenBy")} // Handle selection and close
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({ ...prev, writtenBy: false }))
                  } // Close when clicking outside
                >
                  <option>Internal</option>
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.writtenBy ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="add-qms-manual-label">
                Procedure Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="procedureNumber"
                value={formData.procedureNumber}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
            </div>

            <div>
              <label className="add-qms-manual-label">
                Checked by <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  onFocus={() => toggleDropdown("checkedBy")} // Open dropdown
                  onChange={(e) => handleDropdownChange(e, "checkedBy")} // Handle selection and close
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({ ...prev, checkedBy: false }))
                  } // Close when clicking outside
                >
                  <option>Internal</option>
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.checkedBy ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="add-qms-manual-label">Revision</label>
              <input
                type="text"
                name="revision"
                value={formData.revision}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
            </div>

            <div>
              <label className="add-qms-manual-label">
                Approved by <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  onFocus={() => toggleDropdown("approvedBy")} // Open dropdown
                  onChange={(e) => handleDropdownChange(e, "approvedBy")} // Handle selection and close
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({ ...prev, approvedBy: false }))
                  } // Close when clicking outside
                >
                  <option>Internal</option>
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.approvedBy ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="add-qms-manual-label">Document Type</label>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  onFocus={() => toggleDropdown("documentType")} // Open dropdown
                  onChange={(e) => handleDropdownChange(e, "documentType")} // Handle selection and close
                  onBlur={() =>
                    setOpenDropdowns((prev) => ({
                      ...prev,
                      documentType: false,
                    }))
                  } // Close when clicking outside
                >
                  <option>Internal</option>
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                    openDropdowns.documentType ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="add-qms-manual-label">Date</label>
              <div className="flex space-x-5">
                <div className="relative w-1/3">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    value={formData.date.day}
                    onFocus={() => toggleDropdown("day")}
                    onChange={(e) => handleDropdownChange(e, "day")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, day: false }))
                    }
                  >
                    {days.map((day) => (
                      <option key={`day-${day}`} value={day}>
                        {day < 10 ? `0${day}` : day}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.day ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div className="relative w-1/3">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    value={formData.date.month}
                    onFocus={() => toggleDropdown("month")}
                    onChange={(e) => handleDropdownChange(e, "month")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, month: false }))
                    }
                  >
                    {months.map((month) => (
                      <option key={`month-${month}`} value={month}>
                        {month < 10 ? `0${month}` : month} -{" "}
                        {getMonthName(month).substring(0, 3)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.month ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <div className="relative w-1/3">
                  <select
                    className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                    value={formData.date.year}
                    onFocus={() => toggleDropdown("year")}
                    onChange={(e) => handleDropdownChange(e, "year")}
                    onBlur={() =>
                      setOpenDropdowns((prev) => ({ ...prev, year: false }))
                    }
                  >
                    {years.map((year) => (
                      <option key={`year-${year}`} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      openDropdowns.year ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="add-qms-manual-label">Attach Document</label>
              <div className="relative">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  className="w-full add-qmsmanual-attach"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <span className="file-input">
                    {selectedFile ? selectedFile : "Choose File"}
                  </span>
                  <img src={file} alt="File Icon" />
                </button>
                {!selectedFile && (
                  <p className="text-right no-file">No file chosen</p>
                )}
              </div>
            </div>

            <div>
              <label className="add-qms-manual-label">Review Frequency</label>
              <div className="flex space-x-5">
                <input
                  type="text"
                  name="years"
                  placeholder="Years"
                  value={formData.years}
                  onChange={handleChange}
                  className="w-full add-qms-manual-inputs"
                />
                <input
                  type="text"
                  name="months"
                  placeholder="Months"
                  value={formData.months}
                  onChange={handleChange}
                  className="w-full add-qms-manual-inputs"
                />
              </div>
            </div>

            <div>
              <label className="add-qms-manual-label">
                Relate Record Format
              </label>
              <input
                type="text"
                name="recordFormat"
                value={formData.recordFormat}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
            </div>

            <div className="flex flex-col items-end mt-[55px] justify-center">
              <div className="flex gap-[113px] mb-5">
                <div className="flex items-center">
                  <span className="mr-3 add-qms-manual-label">Publish?</span>
                  <input
                    type="checkbox"
                    className="qms-manual-form-checkbox"
                    checked={formData.publish}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        publish: !prev.publish,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  <span className="mr-3 add-qms-manual-label">
                    Send Notification?
                  </span>
                  <input
                    type="checkbox"
                    className="qms-manual-form-checkbox"
                    checked={formData.sendNotification}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        sendNotification: !prev.sendNotification,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-[22px] mb-6">
                <button
                  className="cancel-btn duration-200"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button className="save-btn duration-200">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmsProcedure;
