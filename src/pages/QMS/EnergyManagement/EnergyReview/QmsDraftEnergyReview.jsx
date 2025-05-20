import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import viewIcon from "../../../../assets/images/Company Documentation/view.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsDraftEnergyReview = () => {
  // State
  const [energyReviews, setEnergyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [energyReviewToDelete, setEnergyReviewToDelete] = useState(null);
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

  // Fetch draft energy reviews
  useEffect(() => {
    const fetchEnergyReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/energy-review/draft/${userId}/`
        );
        setEnergyReviews(response.data);
        setLoading(false);
      } catch (err) {
        let errorMsg = err.message;
        if (err.response) {
          if (err.response.data.date) {
            errorMsg = err.response.data.date[0];
          } else if (err.response.data.detail) {
            errorMsg = err.response.data.detail;
          } else if (err.response.data.message) {
            errorMsg = err.response.data.message;
          }
        }
        setError(errorMsg);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
        setLoading(false);
      }
    };

    fetchEnergyReviews();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = energyReviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = energyReviews.slice(indexOfFirstItem, indexOfLastItem);

  // Search functionality
  const filteredEnergyReviews = currentItems.filter(
    (energyReview) =>
      energyReview.energy_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      energyReview.review_no
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (energyReview.remarks || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    navigate("/company/qms/list-energy-review");
  };

  const handleQmsViewDraftEnergyReview = (id) => {
    navigate(`/company/qms/view-draft-energy-review/${id}`);
  };

  const handleQmsDraftEditEnergyReview = (id) => {
    navigate(`/company/qms/edit-draft-energy-review/${id}`);
  };

  // Open delete confirmation modal
  const openDeleteModal = (energyReview) => {
    setEnergyReviewToDelete(energyReview);
    setShowDeleteModal(true);
    setDeleteMessage('Draft Energy Review');
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!energyReviewToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/energy-review/${energyReviewToDelete.id}/`);
      setEnergyReviews(energyReviews.filter(item => item.id !== energyReviewToDelete.id));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      setSuccessMessage("Draft Energy Review Deleted Successfully");
    } catch (err) {
      console.error('Error deleting energy review:', err);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
      let errorMsg = err.message;

      if (err.response) {
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
        <h1 className="list-manual-head">Draft Energy Review</h1>
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

      {/* Loading and Error States */}
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">Title</th>
                <th className="px-2 text-left add-manual-theads">
                  Energy Review No
                </th>
                <th className="px-2 text-left add-manual-theads">Date</th>
                <th className="px-2 text-left add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="pr-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnergyReviews.map((energyReview, index) => (
                <tr
                  key={energyReview.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {energyReview.energy_name}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {energyReview.review_no}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {formatDate(energyReview.date)}
                  </td>
                  <td className="px-2 add-manual-datas">
                    <button
                      onClick={() => handleQmsDraftEditEnergyReview(energyReview.id)}
                      className="text-[#1E84AF]"
                    >
                      Click to Continue
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleQmsViewDraftEnergyReview(energyReview.id)}>
                      <img
                        src={viewIcon}
                        alt="View Icon"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)",
                        }}
                        className="w-[16px] h-[16px]"
                      />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                      onClick={() => openDeleteModal(energyReview)}
                    >
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
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

export default QmsDraftEnergyReview;