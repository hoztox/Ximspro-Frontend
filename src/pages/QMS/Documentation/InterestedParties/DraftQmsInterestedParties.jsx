import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import views from "../../../../assets/images/Company Documentation/view.svg";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import DeleteQmsDraftInterestedConfirmModal from "./Modals/DeleteQmsDraftInterestedConfirmModal";
import DeleteQmsDraftInterestedSuccessModal from "./Modals/DeleteQmsDraftInterestedSuccessModal";
import DeleteQmsDraftInterestedErrorModal from "./Modals/DeleteQmsDraftInterestedErrorModal";

const DraftQmsInterestedParties = ({ userId }) => {
  const [formData, setFormData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteInterestedDraftModal, setShowDeleteInterestedDraftModal] =
    useState(false);
  const [interestedDraftToDelete, setInterestedDraftToDelete] = useState(null);
  const [
    showDeleteInterestedDraftSuccessModal,
    setShowDeleteInterestedDraftSuccessModal,
  ] = useState(false);
  const [
    showDeleteInterestedDraftErrorModal,
    setShowDeleteInterestedDraftErrorModal,
  ] = useState(false);

  const navigate = useNavigate();
  const recordsPerPage = 10;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = getRelevantUserId();
        const response = await axios.get(
          `${BASE_URL}/qms/interst-draft/${id}/`
        );
        const data = response.data;
        if (Array.isArray(data)) {
          setFormData(data);
        } else if (Array.isArray(data?.data)) {
          setFormData(data.data);
        } else {
          setFormData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch draft interested parties:", error);
        let errorMsg =  error.message;

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
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Updated delete functionality to use modals
  const showDeleteConfirmation = (id) => {
    setInterestedDraftToDelete(id);
    setShowDeleteInterestedDraftModal(true);
  };

  const handleDelete = async () => {
    if (!interestedDraftToDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/qms/interested-parties-get/${interestedDraftToDelete}/`
      );
      setFormData((prev) =>
        prev.filter((item) => item.id !== interestedDraftToDelete)
      );
      setShowDeleteInterestedDraftModal(false);
      setShowDeleteInterestedDraftSuccessModal(true);

      // Auto close success modal after 3 seconds
      setTimeout(() => {
        setShowDeleteInterestedDraftSuccessModal(false);
      }, 3000);
    } catch (err) {
      console.error("Error deleting interested party:", err);
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
      setShowDeleteInterestedDraftModal(false);
      setShowDeleteInterestedDraftErrorModal(true);

      // Auto close error modal after 3 seconds
      setTimeout(() => {
        setShowDeleteInterestedDraftErrorModal(false);
      }, 3000);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteInterestedDraftModal(false);
    setInterestedDraftToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/company/qms/edit-draft-interested-parties/${id}`);
  };

  const handleView = (id) => {
    navigate(`/company/qms/view-draft-interested-parties/${id}`);
  };

  const handleClose = () => {
    navigate("/company/qms/interested-parties");
  };

  const filteredData = formData.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    }
  };

  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <div className="text-center not-found">Loading Interested Parties...</div>
    );
  }

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg text-white">
      <div className="flex justify-between items-center mb-5">
        <h2 className="interested-parties-head">Draft Interested Parties</h2>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#24242D] text-left">
            <tr className="h-[48px]">
              <th className="px-4 qms-interested-parties-thead text-left">
                No
              </th>
              <th className="px-4 qms-interested-parties-thead text-left">
                Name
              </th>
              <th className="px-4 qms-interested-parties-thead text-left">
                Category
              </th>
              <th className="px-4 qms-interested-parties-thead text-left">
                Entered By
              </th>
              <th className="px-4 qms-interested-parties-thead text-left">
                Date
              </th>
              <th className="px-4 qms-interested-parties-thead text-left">
                Actions
              </th>
              <th className="px-4 qms-interested-parties-thead text-center">
                View
              </th>
              <th className="px-4 qms-interested-parties-thead text-center">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-[#2D2D35] h-[48px]"
                >
                  <td className="px-4 qms-interested-parties-data">
                    {(currentPage - 1) * recordsPerPage + index + 1}
                  </td>
                  <td className="px-4 qms-interested-parties-data">
                    {item.name}
                  </td>
                  <td className="px-4 qms-interested-parties-data">
                    {item.category}
                  </td>
                  <td className="px-4 qms-interested-parties-data">
                    {item.user.first_name} {item.user.last_name}
                  </td>
                  <td className="px-4 qms-interested-parties-data">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 qms-interested-parties-data">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-[#1E84AF]"
                    >
                      Click to Continue
                    </button>
                  </td>
                  <td className="text-center">
                    <button onClick={() => handleView(item.id)}>
                      <img src={views} alt="View" className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="text-center">
                    <button onClick={() => showDeleteConfirmation(item.id)}>
                      <img src={deletes} alt="Delete" className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center not-found py-4">
                  No draft interested parties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-white total-text">
          Total: {filteredData.length}
        </div>
        <div className="flex items-center space-x-5">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`cursor-pointer swipe-text ${
              currentPage === 1 ? "opacity-50" : ""
            }`}
          >
            <span>Previous</span>
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`${
                currentPage === page ? "pagin-active" : "pagin-inactive"
              }`}
            >
              {page}
            </button>
          ))}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-1">...</span>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                className="px-3 py-1 rounded pagin-inactive"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`cursor-pointer swipe-text ${
              currentPage === totalPages || totalPages === 0 ? "opacity-50" : ""
            }`}
          >
            <span>Next</span>
          </button>
        </div>
      </div>

      <DeleteQmsDraftInterestedConfirmModal
        showDeleteInterestedDraftModal={showDeleteInterestedDraftModal}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />

      <DeleteQmsDraftInterestedSuccessModal
        showDeleteInterestedDraftSuccessModal={
          showDeleteInterestedDraftSuccessModal
        }
        onClose={() => setShowDeleteInterestedDraftSuccessModal(false)}
      />

      <DeleteQmsDraftInterestedErrorModal
        showDeleteDraftInterestedErrorModal={
          showDeleteInterestedDraftErrorModal
        }
        onClose={() => setShowDeleteInterestedDraftErrorModal(false)}
        error={error}
      />
    </div>
  );
};

export default DraftQmsInterestedParties;
