import React, { useEffect, useState } from "react";
import { ChevronDown, Eye, Plus, X } from "lucide-react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsDraftEditEnergyAction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [programFields, setProgramFields] = useState([{ id: 1, value: "" }]);
  const [focusedDropdown, setFocusedDropdown] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);

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
      if (!companyId) {
        setError("Company ID not found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
        setError("Unexpected response format for users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please check your connection and try again.");
    }
  };

  const [formData, setFormData] = useState({
    action_plan: "",
    title: "",
    associative_objective: "",
    upload_attachment: null,
    legal_requirements: "",
    means: "",
    date: {
      day: "",
      month: "",
      year: "",
    },
    responsible: "",
    energy_improvements: "",
    statement: "",
  });

  const fetchEnergyAction = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/qms/energy-action/${id}/`);

      const dateParts = response.data.date
        ? response.data.date.split("-")
        : ["", "", ""];

      setFormData({
        action_plan: response.data.action_plan || "",
        title: response.data.title || "",
        associative_objective: response.data.associative_objective || "",
        legal_requirements: response.data.legal_requirements || "",
        means: response.data.means || "",
        date: {
          day: dateParts[2] || "",
          month: dateParts[1] || "",
          year: dateParts[0] || "",
        },
        responsible: response.data.responsible || "",
        energy_improvements: response.data.energy_improvements || "",
        statement: response.data.statement || "",
        upload_attachment: response.data.upload_attachment || null,
      });

      if (response.data.programs && Array.isArray(response.data.programs)) {
        const programs = response.data.programs.map((program, index) => ({
          id: index + 1,
          value: program.Program || ""
        }));
        setProgramFields(programs.length > 0 ? programs : [{ id: 1, value: "" }]);
      } else {
        setProgramFields([{ id: 1, value: "" }]);
      }

      if (response.data.upload_attachment) {
        setExistingAttachment(response.data.upload_attachment);
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

  const handleListDraftEnergyAction = () => {
    navigate("/company/qms/draft-energy-action-plan");
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      upload_attachment: e.target.files[0],
    });
    setExistingAttachment(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "action_plan") return;

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
    if (!dateObj.year || !dateObj.month || !dateObj.day) return "";
    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  };

  const handleViewFile = () => {
    if (existingAttachment) {
      window.open(existingAttachment, "_blank");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found");
        setIsLoading(false);
        return;
      }

      const programs = programFields
        .filter(field => field.value.trim() !== "")
        .map(field => ({ Program: field.value }));

      const date = formatDate(formData.date);

      const submissionData = new FormData();
      console.log('rrrrrrrrrrrrrrrrrr', formData);

      submissionData.append("company", companyId);
      submissionData.append("title", formData.title);
      submissionData.append("associative_objective", formData.associative_objective);

      submissionData.append("legal_requirements", formData.legal_requirements);
      submissionData.append("means", formData.means);
      if (date) submissionData.append("date", date);
      submissionData.append("responsible", formData.responsible.id || "");
      submissionData.append("energy_improvements", formData.energy_improvements);
      submissionData.append("statement", formData.statement);


      if (formData.upload_attachment instanceof File) {
        submissionData.append("upload_attachment", formData.upload_attachment);
      }

      submissionData.append("programs", JSON.stringify(programs));

      const response = await axios.put(
        `${BASE_URL}/qms/energy-action/${id}/`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated Energy Action:", response.data);
      navigate("/company/qms/draft-energy-action-plan");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to update. Please check your inputs and try again.");
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
          onClick={handleListDraftEnergyAction}
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
              name="action_plan"
              value={formData.action_plan}
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
              name="associative_objective"
              value={formData.associative_objective}
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
              {existingAttachment && (
                <button
                  type="button"
                  onClick={handleViewFile}
                  className="click-view-file-btn flex items-center gap-2 text-[#1E84AF]"
                >
                  Click to view file <Eye size={17} />
                </button>
              )}
              <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                {formData.upload_attachment instanceof File
                  ? formData.upload_attachment.name
                  : existingAttachment
                    ? existingAttachment.split("/").pop()
                    : "No file chosen"}
              </p>
            </div>
          </div>

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
                  onChange={(e) => handleProgramChange(field.id, e.target.value)}
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
            <label className="add-training-label">Associated Legal Requirements</label>
            <input
              type="text"
              name="legal_requirements"
              value={formData.legal_requirements}
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
              <div className="relative">
                <select
                  name="date.day"
                  value={formData.date.day}
                  onChange={handleChange}
                  onFocus={() => setFocusedDropdown("date.day")}
                  onBlur={() => setFocusedDropdown(null)}
                  className="add-training-inputs appearance-none pr-10 cursor-pointer"
                >
                  <option value="" disabled>dd</option>
                  {generateOptions(1, 31)}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-[35%] transform transition-transform duration-300
                    ${focusedDropdown === "date.day" ? "rotate-180" : ""}`}
                  size={20}
                  color="#AAAAAA"
                />
              </div>
              <div className="relative">
                <select
                  name="date.month"
                  value={formData.date.month}
                  onChange={handleChange}
                  onFocus={() => setFocusedDropdown("date.month")}
                  onBlur={() => setFocusedDropdown(null)}
                  className="add-training-inputs appearance-none pr-10 cursor-pointer"
                >
                  <option value="" disabled>mm</option>
                  {generateOptions(1, 12)}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-[35%] transform transition-transform duration-300
                    ${focusedDropdown === "date.month" ? "rotate-180" : ""}`}
                  size={20}
                  color="#AAAAAA"
                />
              </div>
              <div className="relative">
                <select
                  name="date.year"
                  value={formData.date.year}
                  onChange={handleChange}
                  onFocus={() => setFocusedDropdown("date.year")}
                  onBlur={() => setFocusedDropdown(null)}
                  className="add-training-inputs appearance-none pr-10 cursor-pointer"
                >
                  <option value="" disabled>yyyy</option>
                  {generateOptions(2023, 2030)}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-[35%] transform transition-transform duration-300
                    ${focusedDropdown === "date.year" ? "rotate-180" : ""}`}
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
                    {user.full_name || user.username}
                  </option>
                ))
                : !isLoading && (
                  <option value="" disabled>No users found</option>
                )}
            </select>
            <ChevronDown
              className={`absolute right-3 top-[38%] transform transition-transform duration-300
                ${focusedDropdown === "responsible" ? "rotate-180" : ""}`}
              size={20}
              color="#AAAAAA"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">Statement on Energy Improvement Performance</label>
            <textarea
              name="energy_improvements"
              value={formData.energy_improvements}
              onChange={handleChange}
              className="add-training-inputs focus:outline-none !h-[98px]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">Statement on Result Verification</label>
            <textarea
              name="statement"
              value={formData.statement}
              onChange={handleChange}
              className="add-training-inputs focus:outline-none !h-[98px]"
            />
          </div>

          <div className="md:col-span-2 flex gap-4 justify-end">
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
        </form>
      )}
    </div>
  );
};

export default QmsDraftEditEnergyAction;