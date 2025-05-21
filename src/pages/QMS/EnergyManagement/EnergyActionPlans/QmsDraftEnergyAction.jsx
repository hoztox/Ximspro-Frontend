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

const QmsDraftEnergyAction = () => {
  const navigate = useNavigate();
  const [energyActions, setEnergyActions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [energyActionToDelete, setEnergyActionToDelete] = useState(null);
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

  // Fetch draft energy actions from the API
  useEffect(() => {
    const fetchDraftEnergyActions = async () => {
      try {
        setIsLoading(true);
        const userId = getRelevantUserId();
        const response = await axios.get(`${BASE_URL}/qms/energy-action-draft/${userId}/`);
        setEnergyActions(response.data);
        setIsLoading(false);
      } catch (err) {
        let errorMsg = err.message;
        if (err.response) {
          if (err.response.data.detail) {
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
        setIsLoading(false);
      }
    };
    fetchDraftEnergyActions();
  }, []);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = energyActions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = energyActions.slice(indexOfFirstItem, indexOfLastItem);

  // Filter data based on search query
  const filteredEnergyActions = currentItems.filter(
    (energyAction) =>
      energyAction.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      energyAction.statement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      energyAction.responsible_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle navigation
  const handleClose = () => {
    navigate("/company/qms/list-energy-action-plan");
  };

  const handleQmsViewDraftEnergyAction = (id) => {
    navigate(`/company/qms/view-draft-energy-action-plan/${id}`);
  };

  const handleQmsEditDraftEnergyAction = (id) => {
    navigate(`/company/qms/edit-draft-energy-action-plan/${id}`);
  };

  // Open delete confirmation modal
  const openDeleteModal = (energyAction) => {
    setEnergyActionToDelete(energyAction);
    setShowDeleteModal(true);
    setDeleteMessage("Draft Energy Action Plan");
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
  };

  // Delete energy action
  const confirmDelete = async () => {
    if (!energyActionToDelete) return;

    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URL}/qms/energy-action/${energyActionToDelete.id}/`);
      setEnergyActions(energyActions.filter((action) => action.id !== energyActionToDelete.id));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setSuccessMessage("Draft Energy Action Plan deleted successfully");
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      let errorMsg = err.message;
      if (err.response) {
        if (err.response.data.detail) {
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
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">Draft Energy Action Plans</h1>
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
              <th className="px-2 text-left add-manual-theads">
                Statement on Energy Improvement Performance
              </th>
              <th className="px-2 text-left add-manual-theads">Action</th>
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="pr-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnergyActions.map((energyAction, index) => (
              <tr
                key={energyAction.id}
                className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
              >
                <td className="pl-5 pr-2 add-manual-datas">{indexOfFirstItem + index + 1}</td> 
                <td className="px-2 add-manual-datas">{energyAction.title}</td>
                <td className="px-2 add-manual-datas">{energyAction.statement}</td>
                <td className="px-2 add-manual-datas">
                  <button
                    onClick={() => handleQmsEditDraftEnergyAction(energyAction.id)}
                    className="text-[#1E84AF]"
                  >
                    Click to Continue
                  </button>
                </td>
                <td className="px-2 add-manual-datas !text-center">
                  <button onClick={() => handleQmsViewDraftEnergyAction(energyAction.id)}>
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
                  <button onClick={() => openDeleteModal(energyAction)}>
                    <img src={deleteIcon} alt="Delete Icon" />
                  </button>
                </td>
              </tr>
            ))}
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
            className={`cursor-pointer swipe-text ${currentPage === 1 ? "opacity-50" : ""}`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`${currentPage === number ? "pagin-active" : "pagin-inactive"}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`cursor-pointer swipe-text ${currentPage === totalPages ? "opacity-50" : ""}`}
          >
            Next
          </button>
        </div>
      </div>

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

export default QmsDraftEnergyAction;