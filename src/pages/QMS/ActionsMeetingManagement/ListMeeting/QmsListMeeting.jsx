import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import "./qmslistawarenesstraining.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import AddMinutesModal from "./AddMinutesModal";
import ViewMinutesModal from "./ViewMinutesModal";
import ErrorModal from "../Modals/ErrorModal";
import DeleteMeetingConfirmModal from "../Modals/DeleteMeetingConfirmModal";
import DeleteMeetingSuccessModal from "../Modals/DeleteMeetingSuccessModal";

const QmsListMeeting = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addMinutesVisible, setAddMinutesVisible] = useState(false);
  const [viewMinutesVisible, setViewMinutesVisible] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [addMinutesAnimating, setAddMinutesAnimating] = useState(false);
  const [viewMinutesAnimating, setViewMinutesAnimating] = useState(false);
  const [addMinutesExiting, setAddMinutesExiting] = useState(false);
  const [viewMinutesExiting, setViewMinutesExiting] = useState(false);
  const itemsPerPage = 10;
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [draftCount, setDraftCount] = useState(0);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [showDeleteMeetingSuccessModal, setShowDeleteMeetingSuccessModal] =
    useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const companyId = getCompanyId();
        const userId = getRelevantUserId();
        const response = await axios.get(
          `${BASE_URL}/qms/meeting/company/${companyId}/`
        );
        // Sort meetings by id in ascending order
        const sortedMeetings = response.data.sort((a, b) => a.id - b.id);
        setMeetings(sortedMeetings);

        const draftResponse = await axios.get(
          `${BASE_URL}/qms/meeting/drafts-count/${userId}/`
        );
        setDraftCount(draftResponse.data.count);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        let errorMsg = error.message;

        if (error.response) {
          if (error.response.data.date) {
            errorMsg = error.response.data.date[0];
          } else if (error.response.data.detail) {
            errorMsg = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          }
        } else if (error.message) {
          errorMsg = error.message;
        }

        setError(errorMsg);
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const getCompanyId = () => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };


  // Filter meetings based on search query
  const filteredItems = meetings.filter(
    (meeting) =>
      meeting.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meeting.called_by?.first_name + " " + meeting.called_by?.last_name)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      formatDate(meeting.date)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Open delete confirmation modal
  const openDeleteModal = (meeting) => {
    setMeetingToDelete(meeting);
    setShowDeleteModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowDeleteMeetingSuccessModal(false);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!meetingToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/meeting-get/${meetingToDelete.id}/`);
      setMeetings(meetings.filter((item) => item.id !== meetingToDelete.id));
      setShowDeleteModal(false);
      setShowDeleteMeetingSuccessModal(true);
      setTimeout(() => {
        setShowDeleteMeetingSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting meeting:", error);
      let errorMsg = error.message;

      if (error.response) {
        if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
      setShowDeleteModal(false);
    }
  };

  const handleAddMeeting = () => {
    navigate("/company/qms/add-meeting");
  };

  const handleDraftMeeting = () => {
    navigate("/company/qms/draft-meeting");
  };

  const handleEditMeeting = (id) => {
    navigate(`/company/qms/edit-meeting/${id}`);
  };

  const handleViewMeeting = (id) => {
    navigate(`/company/qms/view-meeting/${id}`);
  };

  const openAddMinutesModal = (meeting) => {
    setSelectedMeeting(meeting);
    setAddMinutesVisible(true);
    setAddMinutesAnimating(true);
    setTimeout(() => setAddMinutesAnimating(false));
  };

  const openViewMinutesModal = (meeting) => {
    setSelectedMeeting(meeting);
    setViewMinutesVisible(true);
    setViewMinutesAnimating(true);
    setTimeout(() => setViewMinutesAnimating(false));
  };

  const closeAddMinutesModal = () => {
    setAddMinutesExiting(true);
    setTimeout(() => {
      setAddMinutesVisible(false);
      setAddMinutesExiting(false);
    }, 300);
  };

  const closeViewMinutesModal = () => {
    setViewMinutesExiting(true);
    setTimeout(() => {
      setViewMinutesVisible(false);
      setViewMinutesExiting(false);
    }, 300);
  };

  const handleSaveMinutes = async (formData) => {
    if (selectedMeeting) {
      try {
        await axios.put(
          `${BASE_URL}/qms/meeting/${selectedMeeting.id}/edit/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedMeetings = meetings.map((meeting) => {
          if (meeting.id === selectedMeeting.id) {
            return {
              ...meeting,
              minutes: formData.get("minutes"),
            };
          }
          return meeting;
        });

        setMeetings(updatedMeetings);
        closeAddMinutesModal();
      } catch (error) {
        console.error("Error saving minutes:", error);
        let errorMsg = error.message;

        if (error.response) {
          if (error.response.data.detail) {
            errorMsg = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          }
        } else if (error.message) {
          errorMsg = error.message;
        }

        setError(errorMsg);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg">
        <div className="flex justify-center items-center h-64">
          <p>Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-awareness-training-head">List Meeting</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[333px] border border-[#383840] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center !w-[100px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleDraftMeeting}
          >
            <span>Draft</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[115px] right-[193px]">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center !px-[20px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddMeeting}
          >
            <span>Add Meeting</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#24242D]">
            <tr className="h-[48px]">
              <th className="px-3 text-left list-awareness-training-thead">
                No
              </th>
              <th className="px-3 text-left list-awareness-training-thead">
                Meeting Title
              </th>
              <th className="px-3 text-left list-awareness-training-thead">
                Called By
              </th>
              <th className="px-3 text-left list-awareness-training-thead">
                Date
              </th>
              <th className="px-3 text-center list-awareness-training-thead">
                Minutes
              </th>
              <th className="px-3 text-center list-awareness-training-thead">
                View
              </th>
              <th className="px-3 text-center list-awareness-training-thead">
                Edit
              </th>
              <th className="px-3 text-center list-awareness-training-thead">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((meeting, index) => (
                <tr
                  key={meeting.id}
                  className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]"
                >
                  <td className="px-3 list-awareness-training-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-3 list-awareness-training-datas">
                    {meeting.title || "N/A"}
                  </td>
                  <td className="px-3 list-awareness-training-datas">
                    {meeting.called_by
                      ? `${meeting.called_by.first_name} ${meeting.called_by.last_name}`
                      : "N/A"}
                  </td>
                  <td className="px-3 list-awareness-training-datas">
                    {formatDate(meeting.date)}
                  </td>
                  <td className="px-3 list-awareness-training-datas text-center flex items-center justify-center gap-6 h-[53px] text-[#1E84AF]">
                    <button
                      onClick={() => openAddMinutesModal(meeting)}
                      className="hover:text-blue-400 transition-colors duration-200"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => openViewMinutesModal(meeting)}
                      className="hover:text-blue-400 transition-colors duration-200"
                    >
                      View
                    </button>
                  </td>
                  <td className="list-awareness-training-datas text-center">
                    <div className="flex justify-center items-center h-[50px]">
                      <button onClick={() => handleViewMeeting(meeting.id)}>
                        <img
                          src={view}
                          alt="View Icon"
                          className="w-[16px] h-[16px]"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="list-awareness-training-datas text-center">
                    <div className="flex justify-center items-center h-[50px]">
                      <button onClick={() => handleEditMeeting(meeting.id)}>
                        <img
                          src={edits}
                          alt="Edit Icon"
                          className="w-[16px] h-[16px]"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="list-awareness-training-datas text-center">
                    <div className="flex justify-center items-center h-[50px]">
                      <button onClick={() => openDeleteModal(meeting)}>
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
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 not-found">
                  No Meetings Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="flex justify-between items-center mt-3">
          <div className="text-white total-text">Total: {totalItems}</div>
          <div className="flex items-center gap-5">
            <button
              className={`cursor-pointer swipe-text ${currentPage === 1 ? "opacity-50" : ""
                }`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  className={`w-8 h-8 rounded-md ${currentPage === number ? "pagin-active" : "pagin-inactive"
                    }`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              )
            )}

            <button
              className={`cursor-pointer swipe-text ${currentPage === totalPages ? "opacity-50" : ""
                }`}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteMeetingConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeAllModals}
      />

      {/* Success Modal */}
      <DeleteMeetingSuccessModal
        showDeleteMeetingSuccessModal={showDeleteMeetingSuccessModal}
        onClose={() => setShowDeleteMeetingSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={!!error}
        onClose={() => setError(null)}
        error={error}
      />

      {/* Minutes Modals */}
      <AddMinutesModal
        isVisible={addMinutesVisible}
        isExiting={addMinutesExiting}
        isAnimating={addMinutesAnimating}
        selectedMeeting={selectedMeeting}
        onClose={closeAddMinutesModal}
        onSave={handleSaveMinutes}
      />

      <ViewMinutesModal
        isVisible={viewMinutesVisible}
        isExiting={viewMinutesExiting}
        isAnimating={viewMinutesAnimating}
        selectedMeeting={selectedMeeting}
        onClose={closeViewMinutesModal}
      />
    </div>
  );
};

export default QmsListMeeting;
