import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import ErrorModal from "../Modals/ErrorModal";
import DeleteInternalConfirmModal from "../Modals/DeleteInternalConfirmModal";
import DeleteInternalSuccessModal from "../Modals/DeleteInternalSuccessModal";
import CarDetailsModal from "./CarDetailsModal";

const QmsListInternalProblems = () => {
  const navigate = useNavigate();

  // State management
  const [internalProblems, setInternalProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeletetInternalSuccessModal, setShowDeletetInternalSuccessModal] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // CAR Details Modal state
  const [showCarModal, setShowCarModal] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);

  // Get user company ID from local storage
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

  // Fetch internal problems
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchInternalProblems = async () => {
        setLoading(true);
        setError(null);
        try {
          const companyId = getUserCompanyId();
          const userId = getRelevantUserId();
          if (!companyId) {
            setError("Company ID not found. Please log in again.");
            setLoading(false);
            return;
          }

          // Add parameters for filtering and pagination if needed
          const response = await axios.get(
            `${BASE_URL}/qms/internal-problems/company/${companyId}/`,
            {
              params: {
                search: searchTerm,
                page: currentPage,
                is_draft: false, // Exclude drafts from main list
              },
            }
          );

          const draftResponse = await axios.get(
            `${BASE_URL}/qms/internal-problems/drafts-count/${userId}/`
          );
          setDraftCount(draftResponse.data.count);

          // Process the response data
          if (response.data.results) {
            // If API returns paginated response
            const sortedProblems = response.data.results.sort((a, b) => a.id - b.id);
            setInternalProblems(sortedProblems);
            setTotalItems(response.data.count);
          } else {
            // If API returns simple array
            const sortedProblems = response.data.sort((a, b) => a.id - b.id);
            setInternalProblems(sortedProblems);
            setTotalItems(response.data.length);
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching internal problems:", error);
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
          setShowErrorModal(true);
          setTimeout(() => {
            setShowErrorModal(false);
          }, 2000);
          setLoading(false);
        }
      };

      fetchInternalProblems();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Navigation handlers
  const handleAddInternalProblems = () => {
    navigate("/company/qms/add-internal-problem");
  };

  const handleDraftProblems = () => {
    navigate("/company/qms/draft-internal-problem");
  };

  const handleViewProblem = (id) => {
    navigate(`/company/qms/view-internal-problem/${id}`);
  };

  const handleEditProblem = (id) => {
    navigate(`/company/qms/edit-internal-problem/${id}`);
  };

  // Delete handlers
  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteProblem = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/qms/internal-problems/${itemToDelete}/`);
      setShowDeleteModal(false);
      setShowDeletetInternalSuccessModal(true);

      // Refresh the list after successful deletion
      const companyId = getUserCompanyId();
      const response = await axios.get(
        `${BASE_URL}/qms/internal-problems/company/${companyId}/`,
        {
          params: {
            search: searchTerm,
            page: currentPage,
            is_draft: false,
          },
        }
      );

      if (response.data.results) {
        const sortedProblems = response.data.results.sort((a, b) => a.id - b.id);
        setInternalProblems(sortedProblems);
        setTotalItems(response.data.count);
      } else {
        const sortedProblems = response.data.sort((a, b) => a.id - b.id);
        setInternalProblems(sortedProblems);
        setTotalItems(response.data.length);
      }

      setTimeout(() => {
        setShowDeletetInternalSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting internal problem:", error);
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
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
      setShowDeleteModal(false);
    }
  };

  // Handle CAR details modal
  const handleCarClick = async (carNo) => {
    if (!carNo) return;

    try {
      // Fetch CAR details from API
      const response = await axios.get(`${BASE_URL}/qms/car-numbers/${carNo.id}/`);
      console.log('clicked car', response.data);
      
      setSelectedCarDetails(response.data);
      setShowCarModal(true);
    } catch (error) {
      console.error("Error fetching CAR details:", error);
      setShowCarModal(true);
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowDeletetInternalSuccessModal(false);
    setShowCarModal(false);
  };

  // Pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <ErrorModal
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
      />

      {/* Delete confirmation modal */}
      <DeleteInternalConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={handleDeleteProblem}
        onCancel={closeAllModals}
      />

      {/* Success modal */}
      <DeleteInternalSuccessModal
        showDeletetInternalSuccessModal={showDeletetInternalSuccessModal}
        onClose={() => setShowDeletetInternalSuccessModal(false)}
      />

      {/* CAR Details Modal */}
      <CarDetailsModal
        isOpen={showCarModal}
        onClose={() => setShowCarModal(false)}
        carDetails={selectedCarDetails}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">Internal Problems and Observations</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="serach-input-manual focus:outline-none bg-transparent"
            />
            <div className="absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[100px]"
            onClick={handleDraftProblems}
          >
            <span>Drafts</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[115px] right-[307px]">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddInternalProblems}
          >
            <span>Add Internal Problem/Observation</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads w-[35%]">
                  Description
                </th>
                <th className="px-2 text-left add-manual-theads">Cause</th>
                <th className="px-2 text-left add-manual-theads">
                  Date
                </th>
                <th className="px-2 text-left add-manual-theads">CAR</th>
                <th className="px-2 text-center add-manual-theads">Status</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Edit</th>
                <th className="pr-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {internalProblems.length > 0 ? (
                internalProblems.map((problem, index) => (
                  <tr
                    key={problem.id}
                    className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                  >
                    <td className="pl-5 pr-2 add-manual-datas">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {problem.problem
                        ? problem.problem.substring(0, 100) +
                        (problem.problem.length > 100 ? "..." : "")
                        : "N/A"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {problem.cause?.title || "N/A"}
                    </td>

                    <td className="px-2 add-manual-datas">
                      {formatDate(problem.date)}
                    </td>
                    <td
                      className={`px-2 add-manual-datas  ${problem.car_no ? "!text-[#1E84AF] cursor-pointer" : "cursor-not-allowed"}`}
                      onClick={() => problem.car_no && handleCarClick(problem.car_no)}
                    >
                      {problem.car_no?.action_no || "N/A"}
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <span
                        className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${problem.solve_after_action === "Yes"
                          ? "bg-[#36DDAE11] text-[#36DDAE]"
                          : "bg-[#dd363611] text-[#dd3636]"
                          }`}
                      >
                        {problem.solve_after_action === "Yes"
                          ? "Solved"
                          : "Not Solved"}
                      </span>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button onClick={() => handleViewProblem(problem.id)}>
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
                      <button onClick={() => handleEditProblem(problem.id)}>
                        <img src={editIcon} alt="Edit Icon" />
                      </button>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button onClick={() => openDeleteModal(problem.id)}>
                        <img src={deleteIcon} alt="Delete Icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-[#383840]">
                  <td colSpan="9" className="py-4 text-center not-found">
                    No internal problems found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="flex justify-between items-center mt-6 text-sm">
          <div className="text-white total-text">Total - {totalItems}</div>
          <div className="flex items-center gap-5">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`cursor-pointer swipe-text ${currentPage === 1 ? "opacity-50" : ""
                }`}
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show at most 5 page numbers centered around the current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                let start = Math.max(1, currentPage - 2);
                let end = Math.min(totalPages, currentPage + 2);

                // Adjust start and end if needed
                if (end - start < 4) {
                  if (start === 1) {
                    end = Math.min(5, totalPages);
                  } else {
                    start = Math.max(1, end - 4);
                  }
                }

                pageNum = start + i;
                if (pageNum > end) return null;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`${currentPage === pageNum ? "pagin-active" : "pagin-inactive"
                    }`}
                >
                  {pageNum}
                </button>
              );
            }).filter(Boolean)}

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
    </div>
  );
};

export default QmsListInternalProblems; 