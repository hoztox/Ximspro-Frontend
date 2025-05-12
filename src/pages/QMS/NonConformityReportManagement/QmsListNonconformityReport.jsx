import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../assets/images/Companies/view.svg";
import editIcon from "../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../Utils/Config";
import axios from "axios";

const QmsListNonconformityReport = () => {
  // State
  const [nonConformity, setNonConformity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Get company ID from localStorage
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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) {
        setError("Company ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/conformity/company/${companyId}/`
        );
        setNonConformity(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching nonconformity reports:", err);
        setError("Failed to fetch nonconformity reports");
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = nonConformity.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Search functionality
  const filteredNonConformity = nonConformity
    .filter(
      (report) =>
        (report.title
          ? report.title.toLowerCase().includes(searchQuery.toLowerCase())
          : false) ||
        (report.source
          ? report.source.toLowerCase().includes(searchQuery.toLowerCase())
          : false) ||
        (report.executor && report.executor.username
          ? report.executor.username
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : false) ||
        (report.executor &&
          (report.executor.first_name + " " + report.executor.last_name)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const handleAddNonConformity = () => {
    navigate("/company/qms/add-nonconformity");
  };

  const handleDraftNonConformity = () => {
    navigate("/company/qms/draft-nonconformity");
  };

  const handleQmsViewNonconformity = (id) => {
    navigate(`/company/qms/view-nonconformity/${id}`);
  };

  const handleQmsEditNonConformity = (id) => {
    navigate(`/company/qms/edit-nonconformity/${id}`);
  };

  const handleDeleteNonConformity = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this nonconformity report?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/qms/conformity/${id}/`); 
      setNonConformity(nonConformity.filter((report) => report.id !== id));
    } catch (err) {
      console.error("Error deleting nonconformity report:", err);
      alert("Failed to delete the nonconformity report");
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="not-found">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-white">Error: {error}</div>
      </div>
    );

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Non Conformity Reports</h1>
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
            onClick={handleDraftNonConformity}
          >
            <span>Drafts</span>
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddNonConformity}
          >
            <span>Add Non Conformity Reports</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
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
              <th className="px-2 text-left add-manual-theads">Source</th>
              <th className="px-2 text-left add-manual-theads">NCR</th>
              <th className="px-2 text-left add-manual-theads">Executor</th>
              <th className="px-2 text-left add-manual-theads">Date Raised</th>
              <th className="px-2 text-left add-manual-theads">Completed By</th>
              <th className="px-2 text-center add-manual-theads">Status</th>
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="px-2 text-center add-manual-theads">Edit</th>
              <th className="pr-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredNonConformity.length > 0 ? (
              filteredNonConformity.map((report, index) => (
                <tr
                  key={report.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {report.title || "No Title"}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {report.source || "N/A"}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {report.ncr || "N/A"}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {report.executor
                      ? `${report.executor.first_name} ${report.executor.last_name}`
                      : "N/A"}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {formatDate(report.date_raised)}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {formatDate(report.date_completed)}
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <span
                      className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${
                        report.status === "Completed"
                          ? "bg-[#36DDAE11] text-[#36DDAE]"
                          : report.status === "Pending"
                          ? "bg-[#1E84AF11] text-[#1E84AF]"
                          : "bg-[#dd363611] text-[#dd3636]"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                      onClick={() => handleQmsViewNonconformity(report.id)}
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
                      onClick={() => handleQmsEditNonConformity(report.id)}
                    >
                      <img src={editIcon} alt="Edit Icon" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                      onClick={() => handleDeleteNonConformity(report.id)}
                    >
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4 not-found">
                  No Non Conformity Reports Found
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
            className={`cursor-pointer swipe-text ${
              currentPage === 1 ? "opacity-50" : ""
            }`}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else {
              if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
            }
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`${
                  currentPage === pageNumber ? "pagin-active" : "pagin-inactive"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

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
    </div>
  );
};

export default QmsListNonconformityReport;
