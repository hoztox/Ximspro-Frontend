import React, { useState, useEffect } from "react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { Eye, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsComposeSystemMessaging = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    to_user: [],
    subject: "",
    file: null,
    message: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserNames, setSelectedUserNames] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

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
    const userId = localStorage.getItem("user_id");

    if (userId) {
      setCurrentUserId(userId);
      return userId;
    }
    return null;
  };

  useEffect(() => {
    // Set current user ID when component mounts
    getRelevantUserId();

    const fetchUsers = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          setError("Company ID not found");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/company/users-active/${companyId}/`
        );

        // Filter out the current user from the users list
        const currentId = getRelevantUserId();
        const filteredUsers = response.data.filter(user =>
          user.id.toString() !== currentId?.toString()
        );

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleInbox = () => {
    navigate("/company/qms/list-inbox");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const toggleUserSelection = (userId) => {
    const user = users.find((u) => u.id === userId);
    const userName = user ? `${user.first_name} ${user.last_name}` : "";

    setFormData((prev) => {
      if (prev.to_user.includes(userId)) {
        // Remove user
        const updatedUsers = prev.to_user.filter((id) => id !== userId);

        // Update selected user names
        const newSelectedNames = { ...selectedUserNames };
        delete newSelectedNames[userId];
        setSelectedUserNames(newSelectedNames);

        return {
          ...prev,
          to_user: updatedUsers,
        };
      } else {
        // Add user
        setSelectedUserNames({
          ...selectedUserNames,
          [userId]: userName,
        });

        return {
          ...prev,
          to_user: [...prev.to_user, userId],
        };
      }
    });

    // Clear the search term after selection
    setSearchTerm("");
  };

  const removeSelectedUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      to_user: prev.to_user.filter((id) => id !== userId),
    }));

    const newSelectedNames = { ...selectedUserNames };
    delete newSelectedNames[userId];
    setSelectedUserNames(newSelectedNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.to_user.length === 0) {
      setError("Please select at least one recipient");
      setLoading(false);
      return;
    }

    try {
      const companyId = getUserCompanyId();
      const fromUserId = getRelevantUserId();

      if (!companyId || !fromUserId) {
        throw new Error("Missing required user information");
      }

      const formDataToSend = new FormData();

      formDataToSend.append("company", companyId);
      formDataToSend.append("from_user", fromUserId);

      formData.to_user.forEach((userId) => {
        formDataToSend.append("to_user", userId);
      });

      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      const response = await axios.post(
        `${BASE_URL}/qms/messages/create/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/company/qms/list-inbox");
      }, 1500);
      setSuccessMessage("Message Sent Successfully")
    } catch (error) {
      console.error("Error submitting message:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();
    setDraftLoading(true);
    setError(null);

    try {
      const companyId = getUserCompanyId();
      const fromUserId = getRelevantUserId();

      if (!companyId || !fromUserId) {
        throw new Error("Missing required user information");
      }

      const formDataToSend = new FormData();

      formDataToSend.append("company", companyId);
      formDataToSend.append("from_user", fromUserId);

      // Append each user ID individually for to_user
      formData.to_user.forEach((userId) => {
        formDataToSend.append("to_user", userId);
      });

      formDataToSend.append("subject", formData.subject || "(No Subject)");
      formDataToSend.append("message", formData.message || "");
      formDataToSend.append("is_draft", "true");

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      const response = await axios.post(
        `${BASE_URL}/qms/messages/draft/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.message === "Draft saved successfully.") {

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/company/qms/list-draft");
        }, 1500);
        setSuccessMessage("Message Drafted Successfully")
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setError("Failed to save draft");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setDraftLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/list-inbox");
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleContainerClick = (e) => {
    if (e.target.tagName !== "INPUT") {
      const inputElement = e.currentTarget.querySelector("input");
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Compose Message</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
          onClick={handleInbox}
        >
          Inbox
        </button>
      </div>

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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5"
      >
        {/* To Field */}
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            To <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div
              className="add-training-inputs flex flex-wrap items-center p-2 min-h-10 cursor-text overflow-y-scroll"
              onClick={handleContainerClick}
            >
              {formData.to_user.map((userId) => (
                <div
                  key={userId}
                  className="flex items-center bg-[#1C1C24] text-white text-sm rounded px-2 py-1 mr-1 mb-1"
                >
                  <span>{selectedUserNames[userId]}</span>
                  <X
                    size={14}
                    className="ml-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedUser(userId);
                    }}
                  />
                </div>
              ))}
              <input
                type="text"
                placeholder={
                  formData.to_user.length > 0 ? "" : "Search users..."
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="border-none bg-transparent outline-none flex-grow min-w-[100px] p-0"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
          <div className="border border-[#383840] rounded-md p-2 max-h-[130px] overflow-y-auto mt-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center py-2 last:border-0"
                >
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={formData.to_user.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="mr-2 form-checkboxes"
                  />
                  <label
                    htmlFor={`user-${user.id}`}
                    className="text-sm text-[#AAAAAA] cursor-pointer"
                  >
                    {user.first_name} {user.last_name}
                  </label>
                </div>
              ))
            ) : (
              <div className="not-found py-2">No users found</div>
            )}
          </div>
        </div>
        <div></div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
            required
          />
        </div>
        <div></div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Attach Document</label>
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
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                className="flex click-view-file-btn items-center gap-2 text-[#1E84AF]"
                disabled={!formData.file}
              >
                Click to view file <Eye size={17} />
              </button>
            </div>
            {formData.file && (
              <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                {formData.file.name}
              </p>
            )}
            {!formData.file && (
              <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                No file chosen
              </p>
            )}
          </div>
        </div>
        <div></div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="add-training-inputs !h-[151px]"
            required
          />
        </div>
        <div></div>

        <div className="flex justify-between">
          <div>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="request-correction-btn duration-200 w-full !p-[8px]"
              disabled={draftLoading}
            >
              {draftLoading ? "Saving..." : "Save as Draft"}
            </button>
          </div>
          <div className="flex gap-5 w-[65%] justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
              disabled={loading || draftLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn duration-200"
              disabled={loading || draftLoading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QmsComposeSystemMessaging; 