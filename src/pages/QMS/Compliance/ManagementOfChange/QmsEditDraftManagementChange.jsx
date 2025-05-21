import React, { useState, useEffect } from "react";
import { ChevronDown, Eye } from "lucide-react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import QmsEditDraftManagementSuccessModal from "./Modals/QmsEditDraftManagementSuccessModal";
import QmsEditDraftManagementErrorModal from "./Modals/QmsEditDraftManagementErrorModal";

const QmsEditDraftManagementChange = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [
    showDraftEditManagementSuccessModal,
    setShowDraftEditManagementSuccessModal,
  ] = useState(false);
  const [
    showDraftEditManagementErrorModal,
    setShowDraftEditManagementErrorModal,
  ] = useState(false);
  const [errors, setErrors] = useState({
    moc_title: "",
  });

  const [formData, setFormData] = useState({
    moc_title: "",
    moc_no: "",
    moc_type: "",
    day: "",
    month: "",
    year: "",
    attach_document: null,
    related_record_format: "",
    rivision: "",
    purpose_of_chnage: "",
    resources_required: "",
    potential_cosequences: "",
    impact_on_process: "",
    moc_remarks: "",
    send_notification: false,
  });

  const [dropdowns, setDropdowns] = useState({
    moc_type: false,
    day: false,
    month: false,
    year: false,
  });

  useEffect(() => {
    const fetchManagementChangeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/qms/changes-get/${id}/`);
        const data = response.data;

        console.log("API Response:", data); // Debug log

        let day = "",
          month = "",
          year = "";
        if (data.date) {
          const dateObj = new Date(data.date);
          day = dateObj.getDate().toString();
          month = (dateObj.getMonth() + 1).toString();
          year = dateObj.getFullYear().toString();
        }

        setFormData({
          moc_title: data.moc_title || "",
          moc_no: data.moc_no || "",
          moc_type: data.moc_type || "",
          day,
          month,
          year,
          related_record_format: data.related_record_format || "",
          rivision: data.rivision || "",
          purpose_of_chnage: data.purpose_of_chnage || "",
          resources_required: data.resources_required || "",
          potential_cosequences: data.potential_cosequences || "",
          impact_on_process: data.impact_on_process || "",
          moc_remarks: data.moc_remarks || "",
          send_notification: data.send_notification || false,
        });

        if (data.attach_document) {
          setSelectedFile(data.attach_document.split("/").pop());
          setFileUrl(data.attach_document);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load management change data");
        setLoading(false);
        console.error("Error fetching management change data:", err);
      }
    };

    if (id) {
      fetchManagementChangeData();
    }
  }, [id]);

  const handleDropdownFocus = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: true }));
  };

  const handleDropdownBlur = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: false }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "moc_title" && value.trim()) {
      setErrors({ moc_title: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      setFormData({
        ...formData,
        attach_document: file,
      });
      setFileUrl(null); // Clear the existing file URL since we're uploading a new file
    } else {
      setSelectedFile(null);
      setFormData({
        ...formData,
        attach_document: null,
      });
    }
  };

  const handleViewFile = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.moc_title.trim()) {
      setErrors({
        moc_title: "MOC Name / Title is required",
      });
      return;
    }

    setErrors({ moc_title: "" });

    const submitData = new FormData();

    if (formData.day && formData.month && formData.year) {
      const formattedDate = `${formData.year}-${formData.month.padStart(
        2,
        "0"
      )}-${formData.day.padStart(2, "0")}`;
      submitData.append("date", formattedDate);
    }

    Object.keys(formData).forEach((key) => {
      if (!["day", "month", "year"].includes(key) && formData[key] !== null) {
        if (key === "attach_document" && typeof formData[key] === "object") {
          submitData.append(key, formData[key]);
        } else if (typeof formData[key] !== "object") {
          submitData.append(key, formData[key]);
        }
      }
    });

    try {
      const response = await axios.put(
        `${BASE_URL}/qms/changes/create/${id}/`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Management change updated successfully:", response.data);
      setShowDraftEditManagementSuccessModal(true);
      setTimeout(() => {
        setShowDraftEditManagementSuccessModal(false);
        navigate("/company/qms/draft-management-change");
      }, 1500);
    } catch (err) {
      console.error("Error updating management change:", err);
      let errorMsg = err.message;

      if (err.response) {
        // Check for field-specific errors first
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
        // Check for non-field errors
        else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      setShowDraftEditManagementErrorModal(true);
      setTimeout(() => {
        setShowDraftEditManagementErrorModal(false);
      }, 3000);
    }
  };

  const handleListManagementChange = () => {
    navigate("/company/qms/draft-management-change");
  };

  const handleCancel = () => {
    navigate("/company/qms/draft-management-change");
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex justify-center items-center h-64">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center mb-5 px-[122px] pb-5 border-b border-[#383840]">
        <h2 className="add-compliance-head">Edit Draft Management of Change</h2>
        <QmsEditDraftManagementSuccessModal
          showDraftEditManagementSuccessModal={
            showDraftEditManagementSuccessModal
          }
          onClose={() => setShowDraftEditManagementSuccessModal(false)}
        />
        <QmsEditDraftManagementErrorModal
          showDraftEditManagementErrorModal={showDraftEditManagementErrorModal}
          onClose={() => setShowDraftEditManagementErrorModal(false)}
          error={error}
        />
        <button
          className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
          onClick={handleListManagementChange}
        >
          <span>List Draft Management of Change</span>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="px-[122px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="add-compliance-label">
              MOC Name / Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="moc_title"
              value={formData.moc_title}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs"
            />
            {errors.moc_title && (
              <p className="text-red-500 text-sm mt-1">{errors.moc_title}</p>
            )}
          </div>
          <div>
            <label className="add-compliance-label">
              MOC Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="moc_no"
              value={formData.moc_no}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs cursor-not-allowed"
              readOnly 
            />
          </div>
          <div>
            <label className="add-compliance-label">MOC Type</label>
            <div className="relative">
              <select
                name="moc_type"
                value={formData.moc_type}
                onChange={handleInputChange}
                onFocus={() => handleDropdownFocus("moc_type")}
                onBlur={() => handleDropdownBlur("moc_type")}
                className="appearance-none w-full add-compliance-inputs cursor-pointer"
              >
                <option value="">Select MOC Type</option>
                <option value="Manual/Procedure">Manual/Procedure</option>
                <option value="Guideline/Policy">Guideline/Policy</option>
                <option value="Specification/Standards">
                  Specification/Standards
                </option>
                <option value="Facility/Equipment">Facility/Equipment</option>
                <option value="System/Process">System/Process</option>
              </select>
              <div
                className={`pointer-events-none absolute inset-y-0 right-0 top-[12px] flex items-center px-2 text-[#AAAAAA] transition-transform duration-300 ${
                  dropdowns.moc_type ? "rotate-180" : ""
                }`}
              >
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
          <div>
            <label className="add-compliance-label">Date</label>
            <div className="grid grid-cols-3 gap-5">
              <div className="relative">
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  onFocus={() => handleDropdownFocus("day")}
                  onBlur={() => handleDropdownBlur("day")}
                  className="appearance-none w-full add-compliance-inputs cursor-pointer"
                >
                  <option value="">dd</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <div
                  className={`pointer-events-none absolute inset-y-0 top-[12px] right-0 flex items-center px-2 text-[#AAAAAA] transition-transform duration-300 ${
                    dropdowns.day ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={20} />
                </div>
              </div>
              <div className="relative">
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  onFocus={() => handleDropdownFocus("month")}
                  onBlur={() => handleDropdownBlur("month")}
                  className="appearance-none w-full add-compliance-inputs cursor-pointer"
                >
                  <option value="">mm</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <div
                  className={`pointer-events-none absolute inset-y-0 right-0 top-[12px] flex items-center px-2 text-[#AAAAAA] transition-transform duration-300 ${
                    dropdowns.month ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={20} />
                </div>
              </div>
              <div className="relative">
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  onFocus={() => handleDropdownFocus("year")}
                  onBlur={() => handleDropdownBlur("year")}
                  className="appearance-none w-full add-compliance-inputs cursor-pointer"
                >
                  <option value="">yyyy</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={2020 + i} value={2020 + i}>
                      {2020 + i}
                    </option>
                  ))}
                </select>
                <div
                  className={`pointer-events-none absolute inset-y-0 right-0 top-[12px] flex items-center px-2 text-[#AAAAAA] transition-transform duration-300 ${
                    dropdowns.year ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="add-compliance-label">Attach Document</label>
            <div className="relative">
              <input
                type="file"
                id="document"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="w-full add-qmsmanual-attach"
                onClick={() => document.getElementById("document").click()}
              >
                <span className="file-input">
                  {selectedFile ? selectedFile : "Choose File"}
                </span>
                <img src={file} alt="File Icon" />
              </button>
              <div className="flex items-center justify-between">
                {selectedFile && fileUrl && (
                  <button
                    type="button"
                    onClick={handleViewFile}
                    className="flex items-center gap-2 mt-[10.65px] text-[#1E84AF] click-view-file-text !text-[14px]"
                  >
                    Click to view file <Eye size={17} />
                  </button>
                )}
                {!selectedFile && (
                  <p className="text-right no-file">No file chosen</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="add-compliance-label">
              Related Record Format
            </label>
            <input
              type="text"
              name="related_record_format"
              value={formData.related_record_format}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs"
            />
          </div>
          <div>
            <label className="add-compliance-label">Purpose of Change</label>
            <input
              type="text"
              name="purpose_of_chnage"
              value={formData.purpose_of_chnage}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs"
            />
          </div>
          <div>
            <label className="add-compliance-label">Resources Required</label>
            <input
              type="text"
              name="resources_required"
              value={formData.resources_required}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs"
            />
          </div>
          <div>
            <label className="add-compliance-label">
              Potential Consequences of Change
            </label>
            <input
              type="text"
              name="potential_cosequences"
              value={formData.potential_cosequences}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs"
            />
          </div>
          <div>
            <label className="add-compliance-label">
              Impact on Processes/Activity
            </label>
            <input
              type="text"
              name="impact_on_process"
              value={formData.impact_on_process}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs"
            />
          </div>
          <div>
            <label className="add-compliance-label">MOC Remarks</label>
            <textarea
              name="moc_remarks"
              value={formData.moc_remarks}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs !h-[95px]"
            />
          </div>
          <div>
            <label className="add-compliance-label">Revision</label>
            <textarea
              name="rivision"
              value={formData.rivision}
              onChange={handleInputChange}
              className="w-full add-compliance-inputs !h-[95px]"
            />
          </div>
          <div></div>
          <div className="flex items-end justify-end mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="send_notification"
                className="mr-2 form-checkboxes"
                checked={formData.send_notification}
                onChange={handleInputChange}
              />
              <span className="permissions-texts cursor-pointer">
                Send Notification
              </span>
            </label>
          </div>
          <div></div>
          <div className="flex items-end gap-5">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200 !w-full"
            >
              Cancel
            </button>
            <button type="submit" className="save-btn duration-200 !w-full">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QmsEditDraftManagementChange;
