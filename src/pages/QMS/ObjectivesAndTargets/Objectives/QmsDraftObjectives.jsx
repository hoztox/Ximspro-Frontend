import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsDraftObjectives = () => {
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

  const companyId = getUserCompanyId();

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

  const userId = getRelevantUserId();

  useEffect(() => {
    fetchDraftObjectives();
  }, []);

  const fetchDraftObjectives = async () => {
    if (!userId) {
      setError("User/Company ID not found");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/qms/objectives-draft/${userId}`
      );

      if (Array.isArray(response.data)) {
        setObjectives(response.data);
      } else {
        setObjectives([]);
        console.error("Unexpected response format:", response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching draft objectives:", error);
      let errorMsg = error.message;

      if (error.response) {
        if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
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

  const handleClose = () => {
    navigate("/company/qms/list-objectives");
  };

  const handleQmsViewObjectives = (id) => {
    navigate(`/company/qms/view-draft-objectives/${id}`);
  };

  const handleQmsEditObjectives = (id) => {
    navigate(`/company/qms/edit-draft-objectives/${id}`);
  };

  // Open delete confirmation modal
  const openDeleteModal = (objective) => {
    setObjectiveToDelete(objective);
    setShowDeleteModal(true);
    setDeleteMessage("Draft Objective");
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
  };

  // Handle delete confirmation
  const handleDeleteObjectives = async () => {
    if (!objectiveToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/objectives-get/${objectiveToDelete.id}/`);
      setObjectives(objectives.filter((objective) => objective.id !== objectiveToDelete.id));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setSuccessMessage("Draft Objective Deleted Successfully");
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting draft objective:", error);
      let errorMsg = error.message;

      if (error.response) {
        if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setError(errorMsg);
      setShowErrorModal(true);
      setShowDeleteModal(false);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">Draft Objectives</h1>
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
          <button onClick={handleClose} className="bg-[#24242D] p-2 rounded-md">
            <X className="text-white" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-4 not-found">
          Loading draft objectives...
        </div>
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
                  <th className="px-2 text-left add-manual-theads">Action</th>
                  <th className="px-2 text-center add-manual-theads">View</th>
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
                      <td className="px-2 add-manual-datas">
                        <button
                          onClick={() => handleQmsEditObjectives(objective.id)}
                          className="text-[#1E84AF]"
                        >
                          Click to Continue
                        </button>
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
                          onClick={() => openDeleteModal(objective)}
                        >
                          <img src={deleteIcon} alt="Delete Icon" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4 not-found"
                    >
                      No draft objectives found
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
        onConfirm={handleDeleteObjectives}
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

export default QmsDraftObjectives; 