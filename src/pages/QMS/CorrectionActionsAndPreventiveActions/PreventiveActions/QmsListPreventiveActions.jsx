import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config"; 

const QmsListPreventiveActions = () => {
  // State
  const [preventiveActions, setPreventiveActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Get company ID from local storage
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

  // Fetch preventive actions from backend
  useEffect(() => {
    const fetchPreventiveActions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/preventive/${companyId}/`
        );
        setPreventiveActions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching preventive actions:", err);
        setError("Failed to load preventive actions");
        setLoading(false);
      }
    };

    if (companyId) {
      fetchPreventiveActions();
    } else {
      setError("Company ID not found");
      setLoading(false);
    }
  }, [companyId]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = preventiveActions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = preventiveActions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Search functionality
  const filteredPreventiveActions = currentItems.filter(
    (preventive) =>
      preventive.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preventive.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preventive.executor?.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      preventive.executor?.last_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleAddPreventiveActions = () => {
    navigate("/company/qms/add-preventive-actions");
  };

  const handleDraftPreventiveActions = () => {
    navigate("/company/qms/draft-preventive-actions");
  };

  const handleQmsViewPreventiveAction = (id) => {
    navigate(`/company/qms/view-preventive-actions/${id}`);
  };

  const handleQmsEditPreventiveAction = (id) => {
    navigate(`/company/qms/edit-preventive-actions/${id}`);
  };

  // Delete preventive action
  const handleDeletePreventiveAction = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/qms/preventive-actions/${id}/edit/`);
      // Update state after successful deletion
      setPreventiveActions(
        preventiveActions.filter((preventive) => preventive.id !== id)
      );
    } catch (err) {
      console.error("Error deleting preventive action:", err);
      // Handle error (could add a notification system here)
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get executor name
  const getExecutorName = (executor) => {
    if (!executor) return "-";
    return (
      `${executor.first_name || ""} ${executor.last_name || ""}`.trim() ||
      executor.username
    );
  };

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Preventive Action</h1>
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
            onClick={handleDraftPreventiveActions}
          >
            <span>Drafts</span>
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddPreventiveActions}
          >
            <span> Add Preventive Action</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-4">Loading preventive actions...</div>
      )}
      {error && <div className="text-center py-4 text-red-400">{error}</div>}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">Title</th>
                <th className="px-2 text-left add-manual-theads">Action</th>
                <th className="px-2 text-left add-manual-theads">Executor</th>
                <th className="px-2 text-left add-manual-theads">
                  Date Raised
                </th>
                <th className="px-2 text-left add-manual-theads">
                  Complete By
                </th>
                <th className="px-2 text-center add-manual-theads">Status</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Edit</th>
                <th className="pr-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredPreventiveActions.length > 0 ? (
                filteredPreventiveActions.map((preventive, index) => (
                  <tr
                    key={preventive.id}
                    className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                  >
                    <td className="pl-5 pr-2 add-manual-datas">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {preventive.title || "-"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {preventive.action || "-"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {getExecutorName(preventive.executor)}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {formatDate(preventive.date_raised)}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {formatDate(preventive.date_completed)}
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <span
                        className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${
                          preventive.status === "Completed"
                            ? "bg-[#36DDAE11] text-[#36DDAE]"
                            : preventive.status === "Pending"
                            ? "bg-[#1E84AF11] text-[#1E84AF]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {preventive.status}
                      </span>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button
                        onClick={() =>
                          handleQmsViewPreventiveAction(preventive.id)
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
                        onClick={() =>
                          handleQmsEditPreventiveAction(preventive.id)
                        }
                      >
                        <img src={editIcon} alt="Edit Icon" />
                      </button>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button
                        onClick={() =>
                          handleDeletePreventiveAction(preventive.id)
                        }
                      >
                        <img src={deleteIcon} alt="Delete Icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No preventive actions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && preventiveActions.length > 0 && (
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
    </div>
  );
};

export default QmsListPreventiveActions;
