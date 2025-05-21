import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsListObjectives = () => {
  const navigate = useNavigate();
  const [objectives, setObjectives] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [draftCount, setDraftCount] = useState(0);

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

  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();

  useEffect(() => {
    fetchObjectives();
  }, []);

  const fetchObjectives = async () => {
  try {
    setIsLoading(true);
    const response = await axios.get(
      `${BASE_URL}/qms/objectives/${companyId}`
    );

    let objectivesData = [];
    if (Array.isArray(response.data)) {
      // Sort by id in ascending order
      objectivesData = response.data.sort((a, b) => a.id - b.id);
    } else {
      console.error("Unexpected response format:", response.data);
    }

    setObjectives(objectivesData);

    const draftResponse = await axios.get(
      `${BASE_URL}/qms/objectives/drafts-count/${userId}/`
    );
    setDraftCount(draftResponse.data.count);

    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching objectives:", error);
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
    setIsLoading(false);
  }
}; 

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
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

  // Open delete confirmation modal
  const openDeleteModal = (objective) => {
    setObjectiveToDelete(objective);
    setShowDeleteModal(true);
    setDeleteMessage('Objective');
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!objectiveToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/objectives-get/${objectiveToDelete.id}/`);
      setObjectives(objectives.filter((objective) => objective.id !== objectiveToDelete.id));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      setSuccessMessage("Objective Deleted Successfully");
    } catch (error) {
      console.error("Error deleting objective:", error);

      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      let errorMsg = error.message;

      if (error.response) {
        // Check for field-specific errors first
        if (error.response.data.date) {
          errorMsg = error.response.data.date[0];
        }
        // Check for non-field errors
        else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        }
        else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
      setShowDeleteModal(false);
    }
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = objectives.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = objectives.slice(indexOfFirstItem, indexOfLastItem);

  // Search functionality
  const filteredObjectives = currentItems.filter(
    (objective) =>
      objective.objective?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      "" ||
      objective.responsible?.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      "" ||
      objective.responsible?.last_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      ""
  );

  const handleAddObjectives = () => {
    navigate("/company/qms/add-objectives");
  };

  const handleDraftObjectives = () => {
    navigate("/company/qms/draft-objectives");
  };

  const handleQmsViewObjectives = (id) => {
    navigate(`/company/qms/view-objectives/${id}`);
  };

  const handleQmsEditObjectives = (id) => {
    navigate(`/company/qms/edit-objectives/${id}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Objectives</h1>
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
            onClick={handleDraftObjectives}
          >
            <span>Drafts</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[115px] right-[189px]">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddObjectives}
          >
            <span>Add Objectives</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-4 not-found">Loading objectives...</div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#24242D]">
                <tr className="h-[48px]">
                  <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                  <th className="px-2 text-left add-manual-theads">
                    Objectives
                  </th>
                  <th className="px-2 text-left add-manual-theads">
                    Target Date
                  </th>
                  <th className="px-2 text-left add-manual-theads">
                    Responsible
                  </th>
                  <th className="px-2 text-center add-manual-theads">Status</th>
                  <th className="px-2 text-center add-manual-theads">View</th>
                  <th className="px-2 text-center add-manual-theads">Edit</th>
                  <th className="pr-2 text-center add-manual-theads">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredObjectives.length > 0 ? (
                  filteredObjectives.map((objective, index) => (
                    <tr
                      key={objective.id}
                      className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                    >
                      <td className="pl-5 pr-2 add-manual-datas">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {objective.objective}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {objective.target_date ? formatDate(objective.target_date) : 'N/A'}
                      </td>

                      <td className="px-2 add-manual-datas">
                        {objective.responsible
                          ? `${objective.responsible.first_name} ${objective.responsible.last_name || ""
                          }`
                          : "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas !text-center">
                        <span
                          className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${objective.status === "Achieved"
                            ? "bg-[#36DDAE11] text-[#36DDAE]"
                            : objective.status === "On Going"
                              ? "bg-[#1E84AF11] text-[#1E84AF]"
                              : objective.status === "Not Achieved"
                                ? "bg-[#dd363611] text-[#dd3636]"
                                : "bg-[#FFA50011] text-[#FFA500]" // Modified status
                            }`}
                        >
                          {objective.status}
                        </span>
                      </td>
                      <td className="px-2 add-manual-datas !text-center">
                        <button
                          onClick={() => handleQmsViewObjectives(objective.id)}
                        >
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
                        <button
                          onClick={() => handleQmsEditObjectives(objective.id)}
                        >
                          <img src={editIcon} alt="Edit Icon" />
                        </button>
                      </td>
                      <td className="px-2 add-manual-datas !text-center">
                        <button onClick={() => openDeleteModal(objective)}>
                          <img src={deleteIcon} alt="Delete Icon" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 not-found">
                      No objectives found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <div className="text-white total-text">Total-{totalItems}</div>
            <div className="flex items-center gap-5">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`cursor-pointer swipe-text ${currentPage === 1 ? "opacity-50" : ""
                  }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`${currentPage === number ? "pagin-active" : "pagin-inactive"
                      }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`cursor-pointer swipe-text ${currentPage === totalPages ? "opacity-50" : ""
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfimModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeAllModals}
        deleteMessage={deleteMessage}
      />

      {/* Success Modal */}
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        successMessage={successMessage}
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

export default QmsListObjectives;