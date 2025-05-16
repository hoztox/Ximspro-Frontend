import React, { useEffect, useState } from "react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { ChevronDown, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsAddEnergyAction = () => {
  const [nextActionNo, setNextActionNo] = useState("EAP-1");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [programFields, setProgramFields] = useState([{ id: 1, value: "" }]);
  const [focusedDropdown, setFocusedDropdown] = useState(null);
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

  // const companyId = getUserCompanyId();
  // const userId = getRelevantUserId();

  const fetchNextActionNumber = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setNextActionNo("");
        setFormData((prev) => ({ ...prev, action_plan: "" }));
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/qms/energy-action/next-action/${companyId}/`
      );

      if (response.data?.next_action_plan) {
        const actionNumber = `${response.data.next_action_plan}`;
        setNextActionNo(actionNumber);
        setFormData((prev) => ({ ...prev, action_plan: actionNumber }));
      } else {
        setNextActionNo();
        setFormData((prev) => ({ ...prev, action_plan: "" }));
      }
    } catch (error) {
      console.error("Error fetching next action number:", error);
      setNextActionNo("EAP-1");
      setFormData((prev) => ({ ...prev, action_plan: "EAP-1" }));
    }
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

  useEffect(() => {
    fetchUsers();
    fetchNextActionNumber();
  }, []);



  const [formData, setFormData] = useState({
    action_plan: '',
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

  const handleListEnergyAction = () => {
    navigate("/company/qms/list-energy-action-plan");
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      upload_attachment: e.target.files[0],
    });
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
    if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  };

  const prepareSubmissionData = (isDraft) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    const programs = programFields
      .filter((field) => field.value.trim() !== "")
      .map((field) => ({ Program: field.value }));

    const date = formatDate(formData.date);

    return {
      company: companyId,
      user: userId,
      is_draft: isDraft,
      action_plan: formData.action_plan,
      title: formData.title,
      associative_objective: formData.associative_objective,
      legal_requirements: formData.legal_requirements,
      means: formData.means,
      date: date,
      responsible: formData.responsible,
      energy_improvements: formData.energy_improvements,
      statement: formData.statement,
      programs: programs,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
        const submissionData = prepareSubmissionData(false);
      const formDataToSend = new FormData();

      if (formData.upload_attachment) {
        formDataToSend.append("upload_attachment", formData.upload_attachment);
      }

      const response = await axios.post(
        `${BASE_URL}/qms/energy-action/create/`, 
        formDataToSend,
        submissionData,
         {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Added Energy Action:", response.data);
      navigate("/company/qms/list-energy-action-plan");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to save. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const submissionData = prepareSubmissionData(true);

      const formDataToSend = new FormData();
      for (const key in submissionData) {
        if (key === "programs") {
          formDataToSend.append(key, JSON.stringify(submissionData[key]));
        } else if (submissionData[key] !== null && submissionData[key] !== undefined) {
          formDataToSend.append(key, submissionData[key]);
        }
      }

      if (formData.upload_attachment) {
        formDataToSend.append("upload_attachment", formData.upload_attachment);
      }

      const response = await axios.post(
        `${BASE_URL}/qms/energy-action/draft-create/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Saved Energy Action as Draft:", response.data);
      navigate("/company/qms/list-energy-action-plan");
    } catch (error) {
      console.error("Error saving draft:", error);
      setError("Failed to save draft. Please check your inputs and try again.");
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
        <h1 className="add-training-head">Add Energy Action Plans</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={() => handleListEnergyAction()}
        >
          List Energy Action Plans
        </button>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-300 px-[104px] py-2 my-2">
          {error}
        </div>
      )}

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
            onChange={handleChange}
            className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
            readOnly
            required
            title="Auto-generated EAP number"
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
          {formData.upload_attachment && (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              {formData.upload_attachment.name}
            </p>
          )}
          {!formData.upload_attachment && (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              No file chosen
            </p>
          )}
        </div>

        {programFields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 justify-between last:pr-[57px]">
              <label className="add-training-label">
                Program(s)
              </label>
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
          <label className="add-training-label">
            Associated Legal Requirements
          </label>
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
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                 ${focusedDropdown === "date.day"
                    ? "rotate-180"
                    : ""
                  }`}
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
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                 ${focusedDropdown === "date.month"
                    ? "rotate-180"
                    : ""
                  }`}
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
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                                 ${focusedDropdown === "date.year"
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
            className={`absolute right-3 top-[60%] transform transition-transform duration-300
                         ${focusedDropdown === "responsible" ? "rotate-180" : ""
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
            name="energy_improvements"
            value={formData.energy_improvements}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Statement on Result Verification
          </label>
          <textarea
            name="statement"
            value={formData.statement}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="md:col-span-2 flex gap-4 justify-between">
          <div>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="request-correction-btn duration-200"
            >
              Save as Draft
            </button>
          </div>
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleListEnergyAction}
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
    </div>
  );
};

export default QmsAddEnergyAction;