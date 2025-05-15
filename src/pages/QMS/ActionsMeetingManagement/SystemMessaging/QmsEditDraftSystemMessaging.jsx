  const handleInbox = () => {
    navigate("/company/qms/list-inbox");
  };import React, { useState, useEffect } from "react";
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { Eye, Search, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsEditDraftSystemMessaging = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get message ID from URL for editing draft
  const [formData, setFormData] = useState({
    to_users: [],
    subject: "",
    file: null,
    message: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserNames, setSelectedUserNames] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

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

  // Get current user ID on component mount
  useEffect(() => {
    const userId = getRelevantUserId();
    // Ensure it's stored as a string for consistent comparison
    setCurrentUserId(userId ? userId.toString() : null);
    console.log("Setting current user ID:", userId);
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          setError("Company ID not found");
          return;
        }
        
        const userId = getRelevantUserId();
        const currentUserIdStr = userId ? userId.toString() : null;
        
        const response = await axios.get(
          `${BASE_URL}/company/users-active/${companyId}/`
        );
        
        // Filter out the current user from the users list
        const filteredUsers = response.data.filter(user => {
          const userIdStr = user.id ? user.id.toString() : null;
          return userIdStr !== currentUserIdStr;
        });
        
        console.log("Current User ID:", currentUserIdStr);
        console.log("Filtered users count:", filteredUsers.length);
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Fetch draft message if editing
  useEffect(() => {
    if (id) {
      const fetchDraftMessage = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${BASE_URL}/qms/messages/${id}/`);
          const message = response.data;
          console.log('Response from API:', message);
          
          if (message.is_draft) {
            // Handle to_user as array of objects with id property
            const toUserIds = Array.isArray(message.to_user) 
              ? message.to_user.map(user => user.id) 
              : [];
            
            // Get current user ID for filtering
            const currentId = getRelevantUserId();
            const currentIdStr = currentId ? currentId.toString() : null;
            
            // Filter out current user from recipients
            const filteredUserIds = toUserIds.filter(id => 
              id.toString() !== currentIdStr
            );
            
            // Create mapping of usernames
            const userNames = {};
            if (Array.isArray(message.to_user)) {
              message.to_user.forEach((user) => {
                // Skip current user
                if (user.id.toString() !== currentIdStr) {
                  userNames[user.id] = `${user.first_name} ${user.last_name}`;
                }
              });
            }
            
            setFormData({
              to_users: filteredUserIds,
              subject: message.subject || "",
              file: message.file ? { name: message.file.split('/').pop() } : null,
              message: message.message || "",
            });
            setSelectedUserNames(userNames);
            console.log('Processed to_users:', filteredUserIds);
            console.log('Selected user names:', userNames);
          } else {
            setError("Message is not a draft");
          }
        } catch (error) {
          console.error("Error fetching draft message:", error);
          setError("Failed to fetch draft message");
        } finally {
          setLoading(false);
        }
      };
      fetchDraftMessage();
    }
  }, [id, currentUserId]);

  // Remove isCurrentUser debug function that was added temporarily


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
      if (prev.to_users.includes(userId)) {
        const updatedUsers = prev.to_users.filter((id) => id !== userId);
        const newSelectedNames = { ...selectedUserNames };
        delete newSelectedNames[userId];
        setSelectedUserNames(newSelectedNames);
        return {
          ...prev,
          to_users: updatedUsers,
        };
      } else {
        setSelectedUserNames({
          ...selectedUserNames,
          [userId]: userName,
        });
        return {
          ...prev,
          to_users: [...prev.to_users, userId],
        };
      }
    });
    setSearchTerm("");
  };

  const removeSelectedUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      to_users: prev.to_users.filter((id) => id !== userId),
    }));
    const newSelectedNames = { ...selectedUserNames };
    delete newSelectedNames[userId];
    setSelectedUserNames(newSelectedNames);
  };

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (formData.to_users.length === 0) {
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
      
      // Make sure we're not including the current user in to_user
      const currentUserIdStr = fromUserId.toString();
      formData.to_users.forEach((userId) => {
        if (userId.toString() !== currentUserIdStr) {
          formDataToSend.append("to_user", userId);
        }
      });
      
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);
      if (formData.file instanceof File) {
        formDataToSend.append("file", formData.file);
      }
      if (id) {
        formDataToSend.append("id", id); // Include ID to update draft to sent
      }
      
      console.log("Sending message to users:", formData.to_users.filter(id => 
        id.toString() !== currentUserIdStr));
      
      const response = await axios.post(
        `${BASE_URL}/qms/message-draft/edit/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/company/qms/list-outbox");
    } catch (error) {
      console.error("Error submitting message:", error);
      setError(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/qms/list-draft");
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

      {error && <div className="px-[104px] py-2 text-red-500">{error}</div>}

      {loading && <div className="px-[104px] py-2 text-blue-500">Loading...</div>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5"
      >
        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            To <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div
              className="add-training-inputs flex flex-wrap items-center p-2 min-h-10 cursor-text overflow-y-scroll"
              onClick={handleContainerClick}
            >
              {formData.to_users.map((userId) => (
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
                  formData.to_users.length > 0 ? "" : "Search users..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    checked={formData.to_users.includes(user.id)}
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
              <button className="flex click-view-file-btn items-center gap-2 text-[#1E84AF]">
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

        <div className="flex gap-5 w-full justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn duration-200 !w-full"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="save-btn duration-200 !w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QmsEditDraftSystemMessaging;