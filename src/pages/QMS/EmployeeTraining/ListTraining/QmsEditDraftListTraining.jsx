import React, { useState, useEffect } from "react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { ChevronDown, Search } from "lucide-react"; // Add Search to the imports
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import EditDraftTrainingSuccessModal from "../Modals/EditDraftTrainingSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsEditDraftListTraining = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [
    showEditDraftTrainingSuccessModal,
    setShowEditDraftTrainingSuccessModal,
  ] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [attendeeSearchTerm, setAttendeeSearchTerm] = useState('');
  const [filteredAttendees, setFilteredAttendees] = useState([]);


  const validateForm = () => {
    const newErrors = {};

    // Validate mandatory fields
    if (!formData.training_title.trim()) {
      newErrors.training_title = "Training Title is Required";
    }
    if (!formData.expected_results.trim()) {
      newErrors.expected_results = "Expected Results is Required";
    }
    if (!formData.date_planned.day || !formData.date_planned.month || !formData.date_planned.year) {
      newErrors.date_planned = "Date Planned is Required";
    }
    if (!formData.start_time.hour || !formData.start_time.min) {
      newErrors.start_time = "Start Time is Required";
    }
    if (!formData.end_time.hour || !formData.end_time.min) {
      newErrors.end_time = "End Time is Required";
    }
    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is Required";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };


  const [users, setUsers] = useState([]);

  // Initial form state structure
  const [formData, setFormData] = useState({
    training_title: "",
    type_of_training: "Internal",
    expected_results: "",
    actual_results: "",
    training_attendees: [],
    status: "",
    requested_by: "",
    date_planned: {
      day: "",
      month: "",
      year: "",
    },
    date_conducted: {
      day: "",
      month: "",
      year: "",
    },
    start_time: {
      hour: "",
      min: "",
    },
    end_time: {
      hour: "",
      min: "",
    },
    venue: "",
    attachment: null,
    training_evaluation: "",
    evaluation_date: "",
    evaluation_by: "",
    send_notification: false,
    is_draft: false,
  });
  const getUserCompanyId = () => {
    // First check if company_id is stored directly
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) return storedCompanyId;

    // If user data exists with company_id
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      // Try to get company_id from user data that was stored during login
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

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(attendeeSearchTerm.toLowerCase())
      );
      setFilteredAttendees(filtered);
    }
  }, [attendeeSearchTerm, users]);


  // Get all users for dropdown selections
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const companyId = getUserCompanyId();
        const response = await axios.get(
          `${BASE_URL}/company/users-active/${companyId}/`
        );
        setUsers(response.data);
        console.log("Users fetched successfully:", response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch training data
  // In your useEffect where you fetch the training data, add this:
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/qms/training-get/${id}/`);
        const data = response.data;
        console.log('before response', data);


        // Parse dates
        let plannedDateObj = { day: "", month: "", year: "" };
        let conductedDateObj = { day: "", month: "", year: "" };
        let evaluationDateObj = { day: "", month: "", year: "" }; // Initialize with empty values

        if (data.date_planned) {
          const plannedDate = new Date(data.date_planned);
          plannedDateObj = {
            day: String(plannedDate.getDate()).padStart(2, "0"),
            month: String(plannedDate.getMonth() + 1).padStart(2, "0"),
            year: String(plannedDate.getFullYear()),
          };
        }

        if (data.date_conducted) {
          const conductedDate = new Date(data.date_conducted);
          conductedDateObj = {
            day: String(conductedDate.getDate()).padStart(2, "0"),
            month: String(conductedDate.getMonth() + 1).padStart(2, "0"),
            year: String(conductedDate.getFullYear()),
          };
        }

        // Add this block to handle evaluation_date
        if (data.evaluation_date) {
          const evaluationDate = new Date(data.evaluation_date);
          evaluationDateObj = {
            day: String(evaluationDate.getDate()).padStart(2, "0"),
            month: String(evaluationDate.getMonth() + 1).padStart(2, "0"),
            year: String(evaluationDate.getFullYear()),
          };
        }

        // Format times
        const startTime = data.start_time
          ? data.start_time.split(":")
          : ["", ""];
        const endTime = data.end_time ? data.end_time.split(":") : ["", ""];

        setFormData({
          ...data,
          requested_by: data.requested_by ? data.requested_by.id : "",
          evaluation_by: data.evaluation_by ? data.evaluation_by.id : "",
          training_attendees: data.training_attendees
            ? data.training_attendees.map((attendee) => attendee.id)
            : [],
          date_planned: plannedDateObj,
          date_conducted: conductedDateObj,
          evaluation_date: evaluationDateObj, // Use the processed object
          start_time: {
            hour: startTime[0],
            min: startTime[1],
          },
          end_time: {
            hour: endTime[0],
            min: endTime[1],
          },
        });

        if (data.attachment) {
          setSelectedFile(data.attachment.split("/").pop());
        }

        setLoading(false);
        console.log("Training data fetched successfully:", response.data);
      } catch (err) {
        setError("Failed to load training data");
        setLoading(false);
        console.error("Error fetching training data:", err);
      }
    };

    if (id) {
      fetchTrainingData();
    }
  }, [id]);

  const [focusedDropdown, setFocusedDropdown] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "training_attendees") {
      // Handle multi-select for attendees
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({
        ...formData,
        training_attendees: selectedOptions,
      });
    } else if (name.includes(".")) {
      // Handle nested objects like start_time.hour
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else if (type === "checkbox") {
      // Handle checkboxes
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      // Handle regular inputs
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        attachment: e.target.files[0],
      });
      setSelectedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     
    if (!validateForm()) {
      return;
    }

    // Create FormData object for file upload
    const submitData = new FormData();
    console.log('formData', formData);


    // Format dates correctly (YYYY-MM-DD)
    const formattedDatePlanned =
      formData.date_planned.year &&
        formData.date_planned.month &&
        formData.date_planned.day
        ? `${formData.date_planned.year}-${formData.date_planned.month}-${formData.date_planned.day}`
        : "";

    const formattedDateConducted =
      formData.date_conducted.year &&
        formData.date_conducted.month &&
        formData.date_conducted.day
        ? `${formData.date_conducted.year}-${formData.date_conducted.month}-${formData.date_conducted.day}`
        : "";

    const formattedEvaluationDate =
      formData.evaluation_date.year &&
        formData.evaluation_date.month &&
        formData.evaluation_date.day
        ? `${formData.evaluation_date.year}-${formData.evaluation_date.month}-${formData.evaluation_date.day}`
        : "";

    // Format time fields - only if hour and minute are both provided
    const formattedStartTime =
      formData.start_time.hour && formData.start_time.min
        ? `${formData.start_time.hour}:${formData.start_time.min}:00`
        : "";

    const formattedEndTime =
      formData.end_time.hour && formData.end_time.min
        ? `${formData.end_time.hour}:${formData.end_time.min}:00`
        : "";

    // Add regular fields
    submitData.append("training_title", formData.training_title);
    submitData.append("type_of_training", formData.type_of_training);
    submitData.append("expected_results", formData.expected_results);
    submitData.append("actual_results", formData.actual_results || "");
    submitData.append("status", formData.status || "Requested"); // Provide a default value

    // Only append fields if they have valid values
    if (formData.requested_by)
      submitData.append("requested_by", formData.requested_by);

    // Append the formatted date strings
    if (formattedDatePlanned)
      submitData.append("date_planned", formattedDatePlanned);
    if (formattedDateConducted)
      submitData.append("date_conducted", formattedDateConducted);
    if (formattedEvaluationDate)
      submitData.append("evaluation_date", formattedEvaluationDate);

    // Only append time fields if they have valid values
    if (formattedStartTime) submitData.append("start_time", formattedStartTime);
    if (formattedEndTime) submitData.append("end_time", formattedEndTime);

    submitData.append("venue", formData.venue);
    submitData.append(
      "training_evaluation",
      formData.training_evaluation || ""
    );

    if (formData.evaluation_by)
      submitData.append("evaluation_by", formData.evaluation_by);

    // Convert boolean to string values for backend
    submitData.append(
      "send_notification",
      formData.send_notification ? "true" : "false"
    );
    submitData.append("is_draft", "false"); // Always set to false when updating

    // Handle attendees (many-to-many field)
    if (formData.training_attendees && formData.training_attendees.length > 0) {
      formData.training_attendees.forEach((attendee) => {
        submitData.append("training_attendees", attendee);
      });
    }

    // Handle file attachment
    if (formData.attachment && typeof formData.attachment === "object") {
      submitData.append("attachment", formData.attachment);
    }

    try {
      // Debug what's being sent
      console.log("Submitting data:", Object.fromEntries(submitData.entries()));

      const response = await axios.put(
        `${BASE_URL}/qms/training/create/${id}/`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Training updated successfully:", response.data);
      setShowEditDraftTrainingSuccessModal(true);
      setTimeout(() => {
        setShowEditDraftTrainingSuccessModal(false);
        navigate("/company/qms/list-training");
      }, 1500);
    } catch (err) {
      console.error("Error updating training:", err);
      if (err.response && err.response.data) {
        // Display specific validation errors
        console.error("Validation errors:", err.response.data);
        setError(
          `Failed to update training: ${JSON.stringify(err.response.data)}`
        );
      } else {
        setError("Failed to update training");
      }
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
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

  const handleListTraining = () => {
    navigate("/company/qms/draft-training");
  };

  const handleCancel = () => {
    navigate("/company/qms/draft-training");
  };

  // Format date from ISO string to YYYY-MM-DD for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.substring(0, 10); // Get YYYY-MM-DD part
  };

  if (loading)
    return <div className="not-found text-center py-10">Loading...</div>;
  // if (error)
  //   return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Draft Training</h1>
        <button
          onClick={handleListTraining}
          className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
        >
          List Draft Training
        </button>
      </div>

      <EditDraftTrainingSuccessModal
        showEditDraftTrainingSuccessModal={showEditDraftTrainingSuccessModal}
        onClose={() => {
          setShowEditDraftTrainingSuccessModal(false);
        }}
      />

      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
        }}
        error = {error}
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5"
      >
        {/* Training Title */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Training Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="training_title"
            value={formData.training_title}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
          />
          {fieldErrors.training_title && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.training_title}</p>
          )}
        </div>

        {/* Type of Training */}
        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Type of Training</label>
          <div className="relative">
            <select
              name="type_of_training"
              value={formData.type_of_training}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("type_of_training")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
            >
              <option value="Internal">Internal</option>
              <option value="External">External</option>
              <option value="Legal/Regulatory">Legal/Regulatory</option>
              <option value="Client">Client</option>
              <option value="Online">Online</option>
            </select>
            <ChevronDown
              className={`absolute right-3 top-1/3 transform transition-transform duration-300 
                            ${focusedDropdown === "type_of_training"
                  ? "rotate-180"
                  : ""
                }`}
              size={20}
              color="#AAAAAA"
            />
          </div>
        </div>

        {/* Expected Results */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Expected Results <span className="text-red-500">*</span>
          </label>
          <textarea
            name="expected_results"
            value={formData.expected_results}
            onChange={handleChange}
            className="add-training-inputs !h-[109px]"
          />
           {fieldErrors.expected_results && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.expected_results}</p>
          )}
        </div>

        {/* Actual Results */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">Actual Results</label>
          <textarea
            name="actual_results"
            value={formData.actual_results}
            onChange={handleChange}
            className="add-training-inputs !h-[109px]"
          />
        </div>

        {/* Training Attendees - Multiple Select */}
        {/* Training Attendees */}
        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Training Attendees</label>
          <div className="relative">
            <div className="flex items-center mb-2 border border-[#383840] rounded-md">
              <input
                type="text"
                placeholder="Search attendees..."
                value={attendeeSearchTerm}
                onChange={(e) => setAttendeeSearchTerm(e.target.value)}
                className="add-training-inputs !pr-10"
              />
              <Search
                className="absolute right-3"
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>

          <div className="border border-[#383840] rounded-md p-2 max-h-[130px] overflow-y-auto">
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map(user => (
                <div key={user.id} className="flex items-center py-2 last:border-0">
                  <input
                    type="checkbox"
                    id={`attendee-${user.id}`}
                    checked={formData.training_attendees.includes(user.id)}
                    onChange={() => {
                      const updatedAttendees = [...formData.training_attendees];
                      const index = updatedAttendees.indexOf(user.id);

                      if (index > -1) {
                        updatedAttendees.splice(index, 1);
                      } else {
                        updatedAttendees.push(user.id);
                      }

                      setFormData({
                        ...formData,
                        training_attendees: updatedAttendees
                      });
                    }}
                    className="mr-2 form-checkboxes"
                  />
                  <label
                    htmlFor={`attendee-${user.id}`}
                    className="text-sm text-[#AAAAAA] cursor-pointer"
                  >
                    {user.first_name} {user.last_name}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-sm text-[#AAAAAA] p-2">No attendees found</div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-5">
          {/* <div className='flex flex-col gap-3 relative'>
                        <label className="add-training-label">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("status")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="read-only add-training-inputs appearance-none pr-10 cursor-pointer"
                            required
                        >
                            <option value="" disabled>Select</option>
                            <option value="Requested">Requested</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                            ${focusedDropdown === "status" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div> */}

          <div className="flex flex-col gap-3 relative">
            <label className="add-training-label">Requested By</label>
            <select
              name="requested_by"
              value={formData.requested_by}
              onChange={handleChange}
              onFocus={() => setFocusedDropdown("requested_by")}
              onBlur={() => setFocusedDropdown(null)}
              className="add-training-inputs appearance-none pr-10 cursor-pointer"
            >
              <option value="" disabled>
                Select
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                            ${focusedDropdown === "requested_by"
                  ? "rotate-180"
                  : ""
                }`}
              size={20}
              color="#AAAAAA"
            />
          </div>
        </div>

        {/* Date Planned */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Date Planned <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-5">
            {/* Day */}
            <div className="relative">
              <select
                name="date_planned.day"
                value={formData.date_planned.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_planned.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                          ${focusedDropdown ===
                    "date_planned.day"
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
                name="date_planned.month"
                value={formData.date_planned.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_planned.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                          ${focusedDropdown ===
                    "date_planned.month"
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
                name="date_planned.year"
                value={formData.date_planned.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_planned.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                          ${focusedDropdown ===
                    "date_planned.year"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
           {fieldErrors.date_planned && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.date_planned}</p>
          )}
        </div>

        {/* Date Conducted */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Date Conducted
          </label>
          <div className="grid grid-cols-3 gap-5">
            {/* Day */}
            <div className="relative">
              <select
                name="date_conducted.day"
                value={formData.date_conducted.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_conducted.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"

              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                          ${focusedDropdown ===
                    "date_conducted.day"
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
                name="date_conducted.month"
                value={formData.date_conducted.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_conducted.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"

              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                          ${focusedDropdown ===
                    "date_conducted.month"
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
                name="date_conducted.year"
                value={formData.date_conducted.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("date_conducted.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"

              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                          ${focusedDropdown ===
                    "date_conducted.year"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
        </div>

        {/* Start Time */}
        <div className="flex flex-col gap-3 w-[65.5%]">
          <label className="add-training-label">Start <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-5">
            {/* Hour */}
            <div className="relative">
              <select
                name="start_time.hour"
                value={formData.start_time.hour}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("start_time.hour")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"

              >
                <option value="" disabled>
                  Hour
                </option>
                {Array.from({ length: 24 }, (_, i) => {
                  const val = i < 10 ? `0${i}` : `${i}`;
                  return (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "start_time.hour"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Minute */}
            <div className="relative">
              <select
                name="start_time.min"
                value={formData.start_time.min}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("start_time.min")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"

              >
                <option value="" disabled>
                  Min
                </option>
                {Array.from({ length: 60 }, (_, i) => {
                  const val = i < 10 ? `0${i}` : `${i}`;
                  return (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "start_time.min"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
          {fieldErrors.start_time && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.start_time}</p>
          )}
        </div>

        {/* End Time */}
        <div className="flex flex-col gap-3 w-[65.5%]">
          <label className="add-training-label">End <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-5">
            {/* Hour */}
            <div className="relative">
              <select
                name="end_time.hour"
                value={formData.end_time.hour}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("end_time.hour")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"

              >
                <option value="" disabled>
                  Hour
                </option>
                {Array.from({ length: 24 }, (_, i) => {
                  const val = i < 10 ? `0${i}` : `${i}`;
                  return (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "end_time.hour"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Minute */}
            <div className="relative">
              <select
                name="end_time.min"
                value={formData.end_time.min}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("end_time.min")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  Min
                </option>
                {Array.from({ length: 60 }, (_, i) => {
                  const val = i < 10 ? `0${i}` : `${i}`;
                  return (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "end_time.min"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
          {fieldErrors.end_time && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.end_time}</p>
          )}
        </div>

        {/* Venue */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Venue <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="add-training-inputs"
          />
          {fieldErrors.venue && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.venue}</p>
          )}
        </div>

        {/* Upload Attachments */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">Upload Attachments</label>
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
              <img src={file} alt="File icon" />
            </label>
          </div>
          {selectedFile && (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              {selectedFile}
            </p>
          )}
          {!selectedFile && (
            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
              No file chosen
            </p>
          )}
        </div>

        {/* Training Evaluation */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">Training Evaluation</label>
          <textarea
            name="training_evaluation"
            value={formData.training_evaluation}
            onChange={handleChange}
            className="add-training-inputs !h-[151px]"
          />
        </div>

        {/* Evaluation Date */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <label className="add-training-label">
                Evaluation Date
              </label>
              <div className="grid grid-cols-3 gap-5">
                {/* Day */}
                <div className="relative">
                  <select
                    name="evaluation_date.day"
                    value={formData.evaluation_date.day}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("evaluation_date.day")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"

                  >
                    <option value="" disabled>
                      dd
                    </option>
                    {generateOptions(1, 31)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                                  ${focusedDropdown ===
                        "evaluation_date.day"
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
                    name="evaluation_date.month"
                    value={formData.evaluation_date.month}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("evaluation_date.month")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"

                  >
                    <option value="" disabled>
                      mm
                    </option>
                    {generateOptions(1, 12)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                                  ${focusedDropdown ===
                        "evaluation_date.month"
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
                    name="evaluation_date.year"
                    value={formData.evaluation_date.year}
                    onChange={handleChange}
                    onFocus={() => setFocusedDropdown("evaluation_date.year")}
                    onBlur={() => setFocusedDropdown(null)}
                    className="add-training-inputs appearance-none pr-10 cursor-pointer"

                  >
                    <option value="" disabled>
                      yyyy
                    </option>
                    {generateOptions(2023, 2030)}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                                  ${focusedDropdown ===
                        "evaluation_date.year"
                        ? "rotate-180"
                        : ""
                      }`}
                    size={20}
                    color="#AAAAAA"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="add-training-label">Evaluation By</label>
            <div className="relative">
              <select
                name="evaluation_by"
                value={formData.evaluation_by}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("evaluation_by")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  Select
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                ${focusedDropdown === "evaluation_by"
                    ? "rotate-180"
                    : ""
                  }`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
        </div>

        <div></div>
        <div className="flex items-end justify-end mt-5">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="send_notification"
              className="mr-2 form-checkboxes"
              checked={formData.send_notification}
              onChange={handleChange}
            />
            <span className="permissions-texts cursor-pointer">
              Send Notification
            </span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn duration-200"
          >
            Cancel
          </button>
          <button type="submit" className="save-btn duration-200">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default QmsEditDraftListTraining;
