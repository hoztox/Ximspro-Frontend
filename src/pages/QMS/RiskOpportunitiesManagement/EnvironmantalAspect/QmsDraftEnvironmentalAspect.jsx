import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteQmsManualDraftConfirmModal from "./Modals/DeleteQmsManualDraftConfirmModal";
import DeleteQmsManualDraftSucessModal from "./Modals/DeleteQmsManualDraftSucessModal";
import DeleteQmsManualDraftErrorModal from "./Modals/DeleteQmsManualDraftErrorModal";

const QmsDraftEnvironmentalAspect = () => {
  const [environmentalAspects, setEnvironmentalAspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aspectToDelete, setAspectToDelete] = useState(null);
  const [
    showDeleteDraftManualSuccessModal,
    setShowDeleteDraftManualSuccessModal,
  ] = useState(false);
  const [showDeleteDraftManualErrorModal, setShowDeleteDraftManualErrorModal] =
    useState(false);

  const itemsPerPage = 10;
  const totalItems = environmentalAspects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  const fetchEnvironmentalAspects = async () => {
    try {
      setLoading(true);
      const id = getRelevantUserId();
      if (!id) {
        setError("User or company ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `${BASE_URL}/qms/aspect-draft/${id}/`
      );
      setEnvironmentalAspects(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching environmental aspects:", err);
      setError("Failed to load environmental aspects. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironmentalAspects();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (id) => {
    setAspectToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (aspectToDelete) {
      try {
        await axios.delete(
          `${BASE_URL}/qms/aspect-detail/${aspectToDelete}/`
        );
        setEnvironmentalAspects(
          environmentalAspects.filter((aspect) => aspect.id !== aspectToDelete)
        );
        setShowDeleteDraftManualSuccessModal(true);
        setTimeout(() => {
          setShowDeleteDraftManualSuccessModal(false);
        }, 1500);
        console.log("Environmental aspect deleted successfully");
      } catch (error) {
        setShowDeleteDraftManualErrorModal(true);
        setTimeout(() => {
          setShowDeleteDraftManualErrorModal(false);
        }, 1500);
        console.error("Error deleting environmental aspect:", error);
      }
    }
    setShowDeleteModal(false);
    setAspectToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setAspectToDelete(null);
  };

  const filteredEnvironmentalAspects = environmentalAspects.filter(
    (environmentalAspect) =>
      (environmentalAspect.title?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (environmentalAspect.aspect_source?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (environmentalAspect.aspect_no?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (environmentalAspect.legal_requirement?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedAspects = filteredEnvironmentalAspects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleClose = () => {
    navigate("/company/qms/list-environmantal-aspect");
  };

  const handleQmsViewDraftEnvironmentalAspect = (id) => {
    navigate(`/company/qms/view-draft-environmantal-aspect/${id}`);
  };

  const handleQmsEditDraftEnvironmentalAspect = (id) => {
    navigate(`/company/qms/edit-draft-environmantal-aspect/${id}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">Draft Environmental Aspect</h1>
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

      {/* Modals */}
      <DeleteQmsManualDraftConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <DeleteQmsManualDraftSucessModal
        showDeleteDraftManualSuccessModal={showDeleteDraftManualSuccessModal}
        onClose={() => setShowDeleteDraftManualSuccessModal(false)}
      />
      <DeleteQmsManualDraftErrorModal
        showDeleteDraftManualErrorModal={showDeleteDraftManualErrorModal}
        onClose={() => setShowDeleteDraftManualErrorModal(false)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4 text-white">
            Loading environmental aspects...
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">Title</th>
                <th className="px-2 text-left add-manual-theads">
                  Aspect Source
                </th>
                <th className="px-2 text-left add-manual-theads">Aspect No</th>
                <th className="px-2 text-left add-manual-theads">
                  Legal Requirement
                </th>
                <th className="px-2 text-left add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="pr-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAspects.length > 0 ? (
                paginatedAspects.map((environmentalAspect, index) => (
                  <tr
                    key={environmentalAspect.id}
                    className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                  >
                    <td className="pl-5 pr-2 add-manual-datas">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {environmentalAspect.title || "N/A"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {environmentalAspect.aspect_source || "N/A"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {environmentalAspect.aspect_no || "N/A"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {environmentalAspect.legal_requirement || "N/A"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      <button
                        onClick={() =>
                          handleQmsEditDraftEnvironmentalAspect(
                            environmentalAspect.id
                          )
                        }
                        className="text-[#1E84AF]"
                      >
                        Click to Continue
                      </button>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button
                        onClick={() =>
                          handleQmsViewDraftEnvironmentalAspect(
                            environmentalAspect.id
                          )
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
                          handleDeleteClick(environmentalAspect.id)
                        }
                      >
                        <img src={deleteIcon} alt="Delete Icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 not-found">
                    No Environmental Aspects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-white total-text">
          Total-{filteredEnvironmentalAspects.length}
        </div>
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`${
                currentPage === number ? "pagin-active" : "pagin-inactive"
              }`}
            >
              {number}
            </button>
          ))}
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

export default QmsDraftEnvironmentalAspect;
