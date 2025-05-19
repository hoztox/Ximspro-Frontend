import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../../Utils/Config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteConfimModal from "../DeleteConfimModal";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const QmsDraftPreventiveActions = () => {
  // State
  const [preventives, setPreventives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preventiveToDelete, setPreventiveToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Fetch preventive actions data
  useEffect(() => {
    fetchPreventiveActions();
  }, []);

  const fetchPreventiveActions = async () => {
    if (!userId) {
      handleError(new Error("User/Company ID not found"), "User/Company ID not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/qms/preventive-draft/${userId}/`
      );

      if (response.data) {
        setPreventives(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching preventive actions:", err);
      handleError(err, "Failed to load preventive actions");
      setLoading(false);
    }
  };

  const handleError = (error, defaultMessage) => {
    let errorMsg = defaultMessage || error.message;

    if (error.response) {
      if (error.response.data.date) {
        errorMsg = error.response.data.date[0];
      } else if (error.response.data.detail) {
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
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Delete preventive action
  const handleDeletePreventiveAction = (preventive) => {
    setPreventiveToDelete(preventive);
    setShowDeleteModal(true);
    setDeleteMessage("Draft Preventive Action");
  };

  const confirmDelete = async () => {
    if (!preventiveToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/preventive-get/${preventiveToDelete.id}/`);
      setPreventives(preventives.filter((preventive) => preventive.id !== preventiveToDelete.id));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setSuccessMessage("Draft Preventive Action Deleted Successfully");
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      console.error("Error deleting preventive action:", err);
      handleError(err, "Failed to delete preventive action");
      setShowDeleteModal(false);
    }
  };

  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  const handleClose = () => {
    navigate("/company/qms/list-preventive-actions");
  };

  const handleQmsViewDraftPreventiveAction = (id) => {
    navigate(`/company/qms/view-draft-preventive-actions/${id}`);
  };

  const handleQmsEditDraftPreventiveAction = (id) => {
    navigate(`/company/qms/edit-draft-preventive-actions/${id}`);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = preventives.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Search functionality
  const filteredPreventives = preventives
    .filter(
      (preventive) =>
        (preventive.title &&
          preventive.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (preventive.executor &&
          `${preventive.executor.first_name} ${preventive.executor.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  if (loading)
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg">Loading...</div>
    );

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">Draft Preventive Action</h1>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#24242D]">
            <tr className="h-[48px]">
              <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
              <th className="px-2 text-left add-manual-theads">Title</th>
              <th className="px-2 text-left add-manual-theads">Action</th>
              <th className="px-2 text-left add-manual-theads">Executor</th>
              <th className="px-2 text-left add-manual-theads">Date Raised</th>
              <th className="px-2 text-left add-manual-theads">Action</th>
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="pr-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredPreventives.length > 0 ? (
              filteredPreventives.map((preventive, index) => (
                <tr
                  key={preventive.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {preventive.title || "N/A"}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {preventive.action || "N/A"}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {preventive.executor
                      ? `${preventive.executor.first_name} ${preventive.executor.last_name}`
                      : "N/A"}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {formatDate(preventive.date_raised)}
                  </td>
                  <td className="px-2 add-manual-datas">
                    <button
                      onClick={() =>
                        handleQmsEditDraftPreventiveAction(preventive.id)
                      }
                      className="text-[#1E84AF]"
                    >
                      Click to Continue
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                      onClick={() =>
                        handleQmsViewDraftPreventiveAction(preventive.id)
                      }
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
                      onClick={() => handleDeletePreventiveAction(preventive)}
                    >
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-[#383840] h-[50px]">
                <td colSpan="8" className="text-center py-4 not-found">
                  No draft preventive actions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {preventives.length > 0 && (
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

export default QmsDraftPreventiveActions;