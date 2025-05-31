import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "../../../../Utils/Config";
import DeleteTrainingConfirmModal from "../Modals/DeleteTrainingConfirmModal";
import DeleteTrainingSuccessModal from "../Modals/DeleteTrainingSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsListTraining = () => {
  // State
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);
  const [showDeleteTrainingSuccessModal, setShowDeleteTrainingSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role");
    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
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
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  useEffect(() => {
    const fetchTrainingData = async () => {
      setIsLoading(true);
      try {
        const companyId = getUserCompanyId();
        const userId = getRelevantUserId();
        const response = await axios.get(
          `${BASE_URL}/qms/training/${companyId}/`
        );
        const formattedData = response.data.map((item) => ({
          id: item.id,
          title: item.training_title,
          type: item.type_of_training,
          venue: item.venue,
          datePlanned: formatDate(item.date_planned),
          status: item.status,
          isDraft: item.is_draft,
        }));
        // Sort by id in ascending order
        const sortedData = formattedData.sort((a, b) => a.id - b.id);
        const draftResponse = await axios.get(
          `${BASE_URL}/qms/training/drafts-count/${userId}/`
        );
        setDraftCount(draftResponse.data.count);
        setTrainings(sortedData); // Use sorted data
        setError(null);
      } catch (err) {
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
        console.error("Error fetching training data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleMarkAsCompleted = (id) => {
    navigate(`/company/qms/review-training/${id}`);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = trainings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trainings.slice(indexOfFirstItem, indexOfLastItem);

  // Search functionality
  const filteredTrainings = currentItems.filter(
    (training) =>
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQmsAddTraining = () => {
    navigate("/company/qms/add-training");
  };

  const handleDraftTraining = () => {
    navigate("/company/qms/draft-training");
  };

  const handleQmsViewTraining = (id) => {
    navigate(`/company/qms/view-training/${id}`);
  };

  const handleQmsEditTraining = (id) => {
    navigate(`/company/qms/edit-training/${id}`);
  };

  // Delete training handlers
  const initiateDeleteTraining = (training) => {
    setTrainingToDelete(training);
    setShowDeleteModal(true);
  };

  const confirmDeleteTraining = async () => {
    if (!trainingToDelete) return;

    try {
      setShowDeleteModal(false);
      await axios.delete(
        `${BASE_URL}/qms/training-get/${trainingToDelete.id}/`
      );
      setTrainings(
        trainings.filter((training) => training.id !== trainingToDelete.id)
      );
      setShowDeleteTrainingSuccessModal(true);
      setTimeout(() => {
        setShowDeleteTrainingSuccessModal(false);
      }, 2000);
    } catch (err) {
      console.error("Error deleting training:", err);
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
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  const cancelDeleteTraining = () => {
    setShowDeleteModal(false);
    setTrainingToDelete(null);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Training</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="serach-input-manual focus:outline-none bg-transparent"
            />
            <div className="absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[100px]"
            onClick={handleDraftTraining}
          >
            <span>Drafts</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[120px] right-[184px]">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[140px]"
            onClick={handleQmsAddTraining}
          >
            <span>Add Training</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center not-found py-4">
          Loading Training Data...
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">
                  Training Title
                </th>
                <th className="px-2 text-left add-manual-theads">Type</th>
                <th className="px-2 text-left add-manual-theads">Venue</th>
                <th className="px-2 text-left add-manual-theads">
                  Date Planned
                </th>
                <th className="px-2 text-center add-manual-theads">Status</th>
                <th className="px-2 text-center add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Edit</th>
                <th className="pr-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainings.map((training, index) => (
                <tr
                  key={training.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="px-2 add-manual-datas">{training.title}</td>
                  <td className="px-2 add-manual-datas">{training.type}</td>
                  <td className="px-2 add-manual-datas">{training.venue}</td>
                  <td className="px-2 add-manual-datas">
                    {training.datePlanned}
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <span
                      className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${
                        training.status === "Completed"
                          ? "bg-[#36DDAE11] text-[#36DDAE]"
                          : training.status === "Cancelled"
                          ? "bg-[#FF000011] text-[#FF0000]"
                          : "bg-[#ddd23611] text-[#ddd236]"
                      }`}
                    >
                      {training.status}
                    </span>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                      onClick={() => handleMarkAsCompleted(training.id)}
                      className="text-[#1E84AF] text-xs py-1 px-2 rounded"
                    >
                      Change Status
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleQmsViewTraining(training.id)}>
                      <img
                        src={viewIcon}
                        alt="View Icon"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)",
                        }}
                      />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleQmsEditTraining(training.id)}>
                      <img src={editIcon} alt="Edit Icon" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => initiateDeleteTraining(training)}>
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTrainings.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-4 not-found">
                    No Training Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && trainings.length > 0 && (
        <div className="flex justify-between items-center mt-6 text-sm">
          <div className="text-white total-text">Total-{totalItems}</div>
          <div className="flex items-center gap-5">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`cursor-pointer swipe-text ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`${
                    currentPage === number ? "pagin-active" : "pagin-inactive"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`cursor-pointer swipe-text ${
                currentPage === totalPages ? "opacity-50" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteTrainingConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDeleteTraining}
        onCancel={cancelDeleteTraining}
      />

      {/* Success Modal */}
      <DeleteTrainingSuccessModal
        showDeleteTrainingSuccessModal={showDeleteTrainingSuccessModal}
        onClose={() => setShowDeleteTrainingSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />
    </div>
  );
};

export default QmsListTraining;