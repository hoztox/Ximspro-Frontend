import React, { useEffect, useState } from "react";
import { ChevronDown, Eye, Plus, X } from "lucide-react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsDraftEditEnergyAction = () => {
  const { id } = useParams(); // Get the EAP ID from URL
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [programFields, setProgramFields] = useState([{ id: 1, value: "" }]);
  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const navigate = useNavigate();

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

  const fetchUsers = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) return;

      const response = await axios.get(
        `${BASE_URL}/company/users-active/${companyId}/`
      );

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(
        "Failed to load users. Please check your connection and try again."
      );
    }
  };

  const fetchEnergyAction = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/qms/targets/${id}/`);

      // Parse the date from the response
      const dateParts = response.data.date
        ? response.data.date.split("-")
        : ["", "", ""];

      // Parse programs if they exist
      const programs = response.data.programs
        ? response.data.programs
            .split(",")
            .map((p, i) => ({ id: i + 1, value: p.trim() }))
        : [{ id: 1, value: "" }];

      setFormData({
        eap_no: `EAP-${response.data.eap_no}`,
        title: response.data.title || "",
        associated_objective: response.data.associated_objective || "",
        associated_legal_requirements:
          response.data.associated_legal_requirements || "",
        means: response.data.means || "",
        date: {
          day: dateParts[2] || "",
          month: dateParts[1] || "",
          year: dateParts[0] || "",
        },
        responsible: response.data.responsible || "",
        energy_improvement: response.data.energy_improvement || "",
        result_verification: response.data.result_verification || "",
        attachment: response.data.attachment || "",
      });

      setProgramFields(programs);

      if (response.data.attachment) {
        setExistingAttachment(response.data.attachment);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching energy action:", error);
      setError("Failed to load energy action data. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchEnergyAction();
  }, [id]);

  const companyId = getUserCompanyId();

  const [formData, setFormData] = useState({
    eap_no: "",
    title: "",
    associated_objective: "",
    attachment: null,
    associated_legal_requirements: "",
    means: "",
    date: {
      day: "",
      month: "",
      year: "",
    },
    responsible: "",
    energy_improvement: "",
    result_verification: "",
  });

  const handleListDraftEnergyAction = () => {
    navigate("/company/qms/draft-energy-action-plan");
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      attachment: e.target.files[0],
    });
    setExistingAttachment(null); // Clear existing attachment when new file is selected
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent manual editing of eap_no
    if (name === "eap_no") return;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleProgramChange = (id, value) => {
    setProgramFields(
      programFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const addProgramField = () => {
    const newId =
      programFields.length > 0
        ? Math.max(...programFields.map((f) => f.id)) + 1
        : 1;
    setProgramFields([...programFields, { id: newId, value: "" }]);
  };

  const removeProgramField = (id) => {
    if (programFields.length > 1) {
      setProgramFields(programFields.filter((field) => field.id !== id));
    }
  };

  const formatDate = (dateObj) => {
    if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");
      const companyId = getUserCompanyId();

      const programs = programFields
        .map((field) => field.value)
        .filter(Boolean)
        .join(", ");

      const date = formatDate(formData.date);

      const submissionData = new FormData();
      submissionData.append("company", companyId);
      submissionData.append("eap_no", formData.eap_no.replace("EAP-", ""));
      submissionData.append("title", formData.title);
      submissionData.append(
        "associated_objective",
        formData.associated_objective
      );
      submissionData.append("programs", programs);
      submissionData.append(
        "associated_legal_requirements",
        formData.associated_legal_requirements
      );
      submissionData.append("means", formData.means);
      submissionData.append("date", date);
      submissionData.append("responsible", formData.responsible);
      submissionData.append("energy_improvement", formData.energy_improvement);
      submissionData.append(
        "result_verification",
        formData.result_verification
      );

      // Only append new attachment if one was selected
      if (formData.attachment instanceof File) {
        submissionData.append("attachment", formData.attachment);
      } else if (existingAttachment) {
        // Keep existing attachment if no new one was selected
        submissionData.append("attachment", existingAttachment);
      }

      const response = await axios.put(
        `${BASE_URL}/qms/targets/${id}/`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated Energy Action:", response.data);
      navigate("/company/qms/list-energy-action-plan");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to update. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateOptions = (start, end, prefix = "") => {
    const options = [];
    for (let i = start; i <= end; i++) {
      const value = i < 10 ? `0${i}` : `${i}`;
      options.push(
        <option key={i} value={value}>
          {prefix}
          {value}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Draft Energy Action Plans</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={() => handleListDraftEnergyAction()}
        >
          List Draft Energy Action Plans
        </button>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-300 px-[104px] py-2 my-2">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="px-[104px] py-5">Loading...</div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5"
        >
          <div className="flex flex-col gap-3">
            <label className="add-training-label">
              Energy Action Plan No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="eap_no"
              value={formData.eap_no}
              className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
              readOnly
              title="Existing EAP number"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">
              Action Plan Title/Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="add-training-inputs focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">Associated Objective</label>
            <input
              type="text"
              name="associated_objective"
              value={formData.associated_objective}
              onChange={handleChange}
              className="add-training-inputs focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">Upload Attachment</label>
            <div className="flex">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
              >
                <span className="text-[#AAAAAA] choose-file">Choose File</span>
                <img src={file} alt="" />
              </label>
            </div>
            <div className="flex justify-between items-center">
              <button className="click-view-file-btn flex items-center gap-2 text-[#1E84AF]">
                Click to view file <Eye size={17} />
              </button>
              {formData.attachment instanceof File ? (
                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                  {formData.attachment.name}
                </p>
              ) : existingAttachment ? (
                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                  Current file: {existingAttachment.split("/").pop()}
                </p>
              ) : (
                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                  No file chosen
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Program Fields */}
          {programFields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 justify-between last:pr-[57px]">
                <label className="add-training-label">Program(s)</label>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeProgramField(field.id)}
                    className="text-red-500 text-xs"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    handleProgramChange(field.id, e.target.value)
                  }
                  className="add-training-inputs focus:outline-none flex-1"
                />
                {index === programFields.length - 1 && (
                  <button
                    type="button"
                    onClick={addProgramField}
                    className="bg-[#24242D] h-[49px] w-[49px] flex justify-center items-center rounded-md"
                  >
                    <Plus className="text-white" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <label className="add-training-label">
              Associated Legal Requirements
            </label>
            <input
              type="text"
              name="associated_legal_requirements"
              value={formData.associated_legal_requirements}
              onChange={handleChange}
              className="add-training-inputs focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">Means/Method</label>
            <input
              type="text"
              name="means"
              value={formData.means}
              onChange={handleChange}
              className="add-training-inputs focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">Target Date</label>
            <div className="grid grid-cols-3 gap-5">
              {/* Day */}
              <div className="relative">
                <select
                  name="date.day"
                  value={formData.date.day}
                  onChange={handleChange}
                  onFocus={() => setFocusedDropdown("date.day")}
                  onBlur={() => setFocusedDropdown(null)}
                  className="add-training-inputs appearance-none pr-10 cursor-pointer"
                >
                  <option value="" disabled>
                    dd
                  </option>
                  {generateOptions(1, 31)}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                   ${
                                     focusedDropdown === "date.day"
                                       ? "rotate-180"
                                       : ""
                                   }`}
                  size={20}
                  color="#AAAAAA"
                />
              </div>

              {/* Month */}
              <div className="relative">
                <select
                  name="date.month"
                  value={formData.date.month}
                  onChange={handleChange}
                  onFocus={() => setFocusedDropdown("date.month")}
                  onBlur={() => setFocusedDropdown(null)}
                  className="add-training-inputs appearance-none pr-10 cursor-pointer"
                >
                  <option value="" disabled>
                    mm
                  </option>
                  {generateOptions(1, 12)}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                   ${
                                     focusedDropdown === "date.month"
                                       ? "rotate-180"
                                       : ""
                                   }`}
                  size={20}
                  color="#AAAAAA"
                />
              </div>

              {/* Year */}
              <div className="relative">
                <select
                  name="date.year"
                  value={formData.date.year}
                  onChange={handleChange}
                  onFocus={() => setFocusedDropdown("date.year")}
                  onBlur={() => setFocusedDropdown(null)}
                  className="add-training-inputs appearance-none pr-10 cursor-pointer"
                >
                  <option value="" disabled>
                    yyyy
                  </option>
                  {generateOptions(2023, 2030)}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                   ${
                                     focusedDropdown === "date.year"
                                       ? "rotate-180"
                                       : ""
                                   }`}
                  size={20}
                  color="#AAAAAA"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 relative">
            <label className="add-training-label">
              Responsible <span className="text-red-500">*</span>
            </label>
            <select
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("responsible")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
              required
            >
              <option value="" disabled>
                {isLoading ? "Loading..." : "Select Responsible"}
              </option>
              {users && users.length > 0
                ? users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name || ""}
                    </option>
                  ))
                : !isLoading && (
                    <option value="" disabled>
                      No users found
                    </option>
                  )}
            </select>
            <ChevronDown
              className={`absolute right-3 top-[38%] transform transition-transform duration-300
                           ${
                             focusedDropdown === "responsible"
                               ? "rotate-180"
                               : ""
                           }`}
              size={20}
              color="#AAAAAA"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">
              Statement on Energy Improvement Performance
            </label>
            <textarea
              name="energy_improvement"
              value={formData.energy_improvement}
              onChange={handleChange}
              className="add-training-inputs focus:outline-none !h-[98px]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">
              Statement on Result Verification
            </label>
            <textarea
              name="result_verification"
              value={formData.result_verification}
              onChange={handleChange}
              className="add-training-inputs focus:outline-none !h-[98px]"
            />
          </div>

          <div className="md:col-span-2 flex gap-4 justify-end">
            <div className="flex gap-5">
              <button
                type="button"
                onClick={handleListDraftEnergyAction}
                className="cancel-btn duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default QmsDraftEditEnergyAction;
