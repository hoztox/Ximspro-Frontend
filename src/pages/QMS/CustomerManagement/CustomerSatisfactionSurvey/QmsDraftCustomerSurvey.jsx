import React, { useState, useEffect } from "react";
import { Search, X, AlertCircle, CheckCircle } from "lucide-react";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteEmployeeSatisfactionConfirmModal from "../Modals/DeleteEmployeeSatisfactionConfirmModal";
import DeleteEmployeeSatisfactionSuccessModal from "../Modals/DeleteEmployeeSatisfactionSuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsDraftCustomerSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [satisfactionToDelete, setSatisfactionToDelete] = useState(null);
  const [
    showDeleteEmployeeSatisfactionSuccessModal,
    setShowDeleteEmployeeSatisfactionSuccessModal,
  ] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // State for data management
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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
    const fetchSurveyData = async () => {
      try {
        const id = getRelevantUserId();
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/customer/survey-draft/${id}/`
        );

        setSurveyData(response.data);
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
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
        console.error(
          "Error fetching draft customer satisfaction survey data:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter survey data based on search term
  const filteredSurveyData = surveyData.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseDraftCustomerSurvey = () => {
    navigate("/company/qms/list-customer-survey");
  };

  const handleView = (id) => {
    navigate(`/company/qms/view-draft-customer-survey/${id}`);
  };

  // Edit survey
  const handleEditDraft = (id) => {
    navigate(`/company/qms/edit-draft-customer-survey/${id}`);
  };

  // Open delete confirmation modal
  const openDeleteModal = (survey) => {
    setSatisfactionToDelete(survey);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSatisfactionToDelete(null);
  };

  // Delete customer satisfaction survey
  const confirmDelete = async () => {
    if (!satisfactionToDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/qms/customer/survey/${satisfactionToDelete.id}/update/`
      );
      // Remove the deleted item from state
      setSurveyData(
        surveyData.filter((item) => item.id !== satisfactionToDelete.id)
      );
      // Close delete modal and show success modal
      setShowDeleteModal(false);
      setShowDeleteEmployeeSatisfactionSuccessModal(true);
      setTimeout(() => {
        setShowDeleteEmployeeSatisfactionSuccessModal(false);
      }, 2000);
    } catch (err) {
      // Close delete modal and show error modal
      setShowDeleteModal(false);
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
      }, 2000);
    }
  };

  // Pagination
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSurveyData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSurveyData.length / itemsPerPage);

  // Format date function
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

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center pb-5">
        <h1 className="employee-performance-head">
          Draft Customer Satisfaction Survey
        </h1>

        <div className="flex w-full md:w-auto gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[180px] border border-[#383840] outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>
          <button
            className="text-white bg-[#24242D] px-2 rounded-md"
            onClick={handleCloseDraftCustomerSurvey}
          >
            <X className="text-white" />
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4 not-found">Loading...</div>}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">Title</th>
                <th className="px-2 text-left add-manual-theads">Valid Till</th>
                <th className="px-2 text-left add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                  >
                    <td className="pl-5 pr-2 add-manual-datas">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {item.title || "Untitled"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {formatDate(item.valid_till)}
                    </td>
                    <td className="px-2 add-manual-datas !text-left !text-[#1E84AF]">
                      <button onClick={() => handleEditDraft(item.id)}>
                        Click to Continue
                      </button>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button onClick={() => handleView(item.id)}>
                        <img
                          src={viewIcon}
                          alt="View Icon"
                          className="action-btn"
                        />
                      </button>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button onClick={() => openDeleteModal(item)}>
                        <img
                          src={deleteIcon}
                          alt="Delete Icon"
                          className="action-btn"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-[#383840]">
                  <td colSpan="6" className="py-4 text-center not-found">
                    No draft customer satisfaction survey found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && filteredSurveyData.length > 0 && (
        <div className="flex justify-between items-center mt-3">
          <div className="text-white total-text">
            Total-{filteredSurveyData.length}
          </div>
          <div className="flex items-center gap-5">
            <button
              className={`cursor-pointer swipe-text ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
              // Show pages around current page
              const pageToShow =
                currentPage <= 2
                  ? i + 1
                  : currentPage >= totalPages - 1
                  ? totalPages - 3 + i
                  : currentPage - 2 + i;

              if (pageToShow <= totalPages) {
                return (
                  <button
                    key={pageToShow}
                    className={`${
                      currentPage === pageToShow
                        ? "pagin-active"
                        : "pagin-inactive"
                    }`}
                    onClick={() => setCurrentPage(pageToShow)}
                  >
                    {pageToShow}
                  </button>
                );
              }
              return null;
            })}

            <button
              className={`cursor-pointer swipe-text ${
                currentPage === totalPages ? "opacity-50" : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteEmployeeSatisfactionConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* Success Modal */}
      <DeleteEmployeeSatisfactionSuccessModal
        showDeleteEmployeeSatisfactionSuccessModal={
          showDeleteEmployeeSatisfactionSuccessModal
        }
        onClose={() => setShowDeleteEmployeeSatisfactionSuccessModal(false)}
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

export default QmsDraftCustomerSurvey;
