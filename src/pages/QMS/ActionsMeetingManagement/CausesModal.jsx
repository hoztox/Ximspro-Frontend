import React, { useState, useEffect } from "react";
import deletes from "../../../assets/images/Company Documentation/delete.svg";
import "./causesmodal.css";
import { BASE_URL } from "../../../Utils/Config";
import axios from "axios";
import AddAgendaSuccessModal from "./Modals/AddAgendaSuccessModal";
import ErrorModal from "./Modals/ErrorModal";
import DeleteAgendaSuccessModal from "./Modals/DeleteAgendaSuccessModal";
import DeleteAgendaConfirmModal from "./Modals/DeleteAgendaConfirmModal";

const AgendaModal = ({ isOpen, onClose, onAddCause }) => {
  const [animateClass, setAnimateClass] = useState("");
  const [agendaItems, setAgendaItems] = useState([]);
  const [newAgendaTitle, setNewAgendaTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [showAddAgendaSuccessModal, setShowAddAgendaSuccessModal] =
    useState(false);
  const [agendaToDelete, setAgendaToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAgendaSuccessModal, setShowDeleteAgendaSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Animation effect when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAnimateClass("opacity-100 scale-100");
      fetchAgendaItems();
    } else {
      setAnimateClass("opacity-0 scale-95");
    }
  }, [isOpen]);

  const fetchAgendaItems = async () => {
    setLoading(true);
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/qms/agenda/company/${companyId}/`
      );
      setAgendaItems(response.data);
    } catch (error) {
      console.error("Error fetching agenda items:", error);
      let errorMsg = error.message;

      if (error.response) {
        // Check for field-specific errors first
        if (error.response.data.date) {
          errorMsg = error.response.data.date[0];
        }
        // Check for non-field errors
        else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Get company ID from local storage
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

  // Get user ID from local storage
  const getRelevantUserId = () => {
    const userRole = localStorage.getItem("role");

    if (userRole === "user") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }

    return null;
  };

  // Show delete confirmation modal
  const confirmDelete = (agendaId) => {
    setAgendaToDelete(agendaId);
    setShowDeleteModal(true);
  };

  // Handle delete agenda item after confirmation
  const handleDelete = async () => {
    if (!agendaToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/agenda/${agendaToDelete}/`);
      const updatedAgendas = agendaItems.filter(
        (item) => item.id !== agendaToDelete
      );
      setAgendaItems(updatedAgendas);

      // Notify parent (QmsEditDraftMeeting)
      if (onAddCause) {
        onAddCause(null, agendaToDelete); // Pass deleted agenda ID
      }

      setShowDeleteModal(false);
      setShowDeleteAgendaSuccessModal(true);
      setTimeout(() => setShowDeleteAgendaSuccessModal(false), 1500);
    } catch (error) {
      console.error("Error deleting agenda item:", error);
      let errorMsg = error.message;

      if (error.response) {
        // Check for field-specific errors first
        if (error.response.data.date) {
          errorMsg = error.response.data.date[0];
        }
        // Check for non-field errors
        else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setAgendaToDelete(null);
    }
  };

  // Handle cancel delete
  const cancelDelete = () => {
    setAgendaToDelete(null);
    setShowDeleteModal(false);
  };

  // Handle save new agenda item
  const handleSave = async () => {
    if (!newAgendaTitle.trim()) return;

    setIsAdding(true);
    try {
      const response = await axios.post(`${BASE_URL}/qms/agenda/create/`, {
        company: getUserCompanyId(),
        user: getRelevantUserId(),
        title: newAgendaTitle.trim(),
      });

      const newAgendaItem = response.data;
      setAgendaItems([...agendaItems, newAgendaItem]);
      setNewAgendaTitle("");

      // Notify parent (QmsEditDraftMeeting)
      if (onAddCause) {
        onAddCause(newAgendaItem, null); // Pass new agenda, no deletion
      }

      setShowAddAgendaSuccessModal(true);
      setTimeout(() => {
        setShowAddAgendaSuccessModal(false);
        // onClose();
      }, 1500);
    } catch (error) {
      console.error("Error adding agenda item:", error);
      let errorMsg = error.message;

      if (error.response) {
        // Check for field-specific errors first
        if (error.response.data.date) {
          errorMsg = error.response.data.date[0];
        }
        // Check for non-field errors
        else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setIsAdding(false);
    }
  };

  // Handle selecting an agenda item
  const handleSelectAgenda = (agenda) => {
    if (onAddCause && typeof onAddCause === "function") {
      onAddCause(agenda);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div
        className={`bg-[#13131A] text-white rounded-[4px] w-[563px] p-5 transform transition-all duration-300 ${animateClass}`}
      >
        {/* Success or error messages */}
        <AddAgendaSuccessModal
          showAddAgendaSuccessModal={showAddAgendaSuccessModal}
          onClose={() => {
            setShowAddAgendaSuccessModal(false);
          }}
        />

        <DeleteAgendaSuccessModal
          showDeleteAgendaSuccessModal={showDeleteAgendaSuccessModal}
          onClose={() => {
            setShowDeleteAgendaSuccessModal(false);
          }}
        />

        <DeleteAgendaConfirmModal
          showDeleteModal={showDeleteModal}
          onConfirm={handleDelete}
          onCancel={cancelDelete}
        />

        <ErrorModal
          showErrorModal={showErrorModal}
          onClose={() => {
            setShowErrorModal(false);
          }}
          error={error}
        />

        {/* Agenda List Section */}
        <div className="bg-[#1C1C24] rounded-[4px] p-5 mb-6 max-h-[350px]">
          <h2 className="agenda-list-head pb-5">Agenda List</h2>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-400">
                <thead className="bg-[#24242D] h-[48px]">
                  <tr className="rounded-[4px]">
                    <th className="px-3 w-[10%] agenda-thead">No</th>
                    <th className="px-3 w-[60%] agenda-thead">Title</th>
                    <th className="px-3 text-center w-[15%] agenda-thead">
                      Delete
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="max-h-[230px] overflow-y-auto">
                <table className="w-full text-left text-gray-400">
                  <tbody>
                    {agendaItems.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 not-found">
                          No agenda items found
                        </td>
                      </tr>
                    ) : (
                      agendaItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-[#383840] h-[42px]"
                        >
                          <td className="px-3 agenda-data w-[10%]">
                            {index + 1}
                          </td>
                          <td className="px-3 agenda-data w-[60%]">
                            {item.title}
                          </td>
                          <td className="px-3 agenda-data text-center w-[15%]">
                            <div className="flex items-center justify-center h-[42px]">
                              <button onClick={() => confirmDelete(item.id)}>
                                <img
                                  src={deletes}
                                  alt="Delete Icon"
                                  className="w-[16px] h-[16px]"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Add Agenda Section */}
        <div className="bg-[#1C1C24] rounded-[4px]">
          <h3 className="agenda-list-head border-b border-[#383840] px-5 py-6">
            Add Agenda
          </h3>

          <div className="mb-4 px-5">
            <label className="block mb-3 agenda-list-label">
              Agenda Title <span className="text-[#F9291F]">*</span>
            </label>
            <input
              type="text"
              value={newAgendaTitle}
              onChange={(e) => setNewAgendaTitle(e.target.value)}
              className="w-full add-agenda-inputs bg-[#24242D] h-[49px] px-5 border-none outline-none"
              placeholder="Enter Agenda Title" 
            />
          </div>

          <div className="flex gap-5 justify-end pb-5 px-5">
            <button onClick={onClose} className="cancel-btn duration-200">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="save-btn duration-200 cursor-pointer"
              disabled={!newAgendaTitle.trim() || isAdding}
            >
              {isAdding ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaModal;
