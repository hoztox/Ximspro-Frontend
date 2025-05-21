import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";
import BlockConfirmModal from "../Modals/BlockConfirmModal"; // Import the BlockConfirmModal

const QmsListSupplier = () => {
  // State
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Block modal states
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [supplierToBlock, setSupplierToBlock] = useState(null);
  const [blockMessage, setBlockMessage] = useState("");
  const [currentAction, setCurrentAction] = useState(""); // 'block' or 'unblock'
  const [draftCount, setDraftCount] = useState(0);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role");

    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
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

  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();

  // Fetch suppliers data
  useEffect(() => {
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/qms/suppliers/company/${companyId}/`
      );
      // Sort suppliers by supplier_id in ascending order
      const sortedData = response.data
        .map((supplier, index) => ({
          id: index + 1, // Display index
          supplier_id: supplier.id,
          supplier_name: supplier.company_name || "Anonymous",
          product: supplier.qualified_to_supply || "Anonymous",
          date: supplier.approved_date || "N/A",
          status: supplier.status || "Not Approved",
          active: supplier.active === "active",
        }))
        .sort((a, b) => a.supplier_id - b.supplier_id); // Sort by supplier_id
      setSuppliers(sortedData);

      const draftResponse = await axios.get(
        `${BASE_URL}/qms/suppliers/drafts-count/${userId}/`
      );
      setDraftCount(draftResponse.data.count);

      setError(null);
      console.log("suppliers", response);
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
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      console.error("Error fetching suppliers:", err);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  fetchSuppliers();
}, [companyId]);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Open block confirmation modal
  const openBlockModal = (supplier, action) => {
    setSupplierToBlock(supplier);
    setCurrentAction(action);
    setBlockMessage("Supplier");
    setShowBlockModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
    setShowBlockModal(false);
  };

  // Handle block/unblock confirmation
  const confirmBlock = async () => {
    if (!supplierToBlock) return;

    try {
      const newStatus = currentAction === "block" ? "blocked" : "active";

      await axios.put(
        `${BASE_URL}/qms/suppliers/${supplierToBlock.supplier_id}/`,
        {
          active: newStatus,
        }
      );

      // Update the state locally
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.supplier_id === supplierToBlock.supplier_id
            ? { ...supplier, active: newStatus === "active" }
            : supplier
        )
      );

      setShowBlockModal(false);
      setShowSuccessModal(true);
      setSuccessMessage(
        `Supplier ${
          currentAction === "block" ? "Blocked" : "Unblocked"
        } Successfully`
      );
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating supplier status:", err);
      let errorMsg = err.message;

      if (err.response) {
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        } else if (err.response.data.detail) {
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
      setShowBlockModal(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteModal(true);
    setDeleteMessage("Supplier");
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!supplierToDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/qms/suppliers/${supplierToDelete.supplier_id}/`
      );
      setSuppliers(
        suppliers.filter(
          (supplier) => supplier.supplier_id !== supplierToDelete.supplier_id
        )
      );
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      setSuccessMessage("Supplier Deleted Successfully");
    } catch (err) {
      console.error("Error deleting supplier:", err);
      let errorMsg = err.message;

      if (err.response) {
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        } else if (err.response.data.detail) {
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
      setShowDeleteModal(false);
    }
  };

  // Navigation handlers
  const handleAddSupplier = () => {
    navigate("/company/qms/add-supplier");
  };

  const handleDraftSupplier = () => {
    navigate("/company/qms/draft-supplier");
  };

  const handleViewSupplier = (supplierId) => {
    navigate(`/company/qms/view-supplier/${supplierId}`);
  };

  const handleEditSupplier = (supplierId) => {
    navigate(`/company/qms/edit-supplier/${supplierId}`);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = suppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Search and filter
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.supplier_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      supplier.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentItems = filteredSuppliers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[#36DDAE11] text-[#36DDAE]";
      case "Not Approved":
        return "bg-[#dd363611] text-[#dd3636]";
      case "Provisional":
        return "bg-[#f5a62311] text-[#f5a623]";
      default:
        return "bg-[#36DDAE11] text-[#36DDAE]";
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

  // Pagination handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 not-found">
        Loading suppliers...
      </div>
    );

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Supplier</h1>
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
            onClick={handleDraftSupplier}
          >
            <span>Drafts</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[115px] right-[174px]">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddSupplier}
          >
            <span>Add Supplier</span>
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
              <th className="px-2 text-left add-manual-theads w-[10%]">Supplier</th>
              <th className="px-2 text-left add-manual-theads w-[32%]">
                Product / Service
              </th>
              <th className="px-2 text-left add-manual-theads">Date</th>
              <th className="px-2 text-center add-manual-theads">Status</th>
              <th className="px-2 text-center add-manual-theads">Block</th>
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="px-2 text-center add-manual-theads">Edit</th>
              <th className="pr-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((supplier, index) => (
                <tr
                  key={supplier.supplier_id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {supplier.supplier_name}
                  </td>
                 <td className="px-2 add-manual-datas">
  {supplier.product 
    ? supplier.product.substring(0, 100) + 
      (supplier.product.length > 100 ? "..." : "")
    : "N/A"}
</td>
                  <td className="px-2 add-manual-datas">{formatDate(supplier.date)}</td>
                  <td className="px-2 add-manual-datas !text-center">
                    <span
                      className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${getStatusColor(
                        supplier.status
                      )}`}
                    >
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-5 add-user-datas text-center">
                    <div className="flex justify-center items-center w-full">
                      <button
                        className={`items-center rounded-full p-1 toggle ${
                          supplier.active ? "toggleactive" : "toggleblock"
                        }`}
                        onClick={() =>
                          openBlockModal(
                            supplier,
                            supplier.active ? "block" : "unblock"
                          )
                        }
                      >
                        <div
                          className={`rounded-full transform transition-transform bar ${
                            supplier.active ? "translate-x-0" : "translate-x-2"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                      onClick={() => handleViewSupplier(supplier.supplier_id)}
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
                      onClick={() => handleEditSupplier(supplier.supplier_id)}
                    >
                      <img src={editIcon} alt="Edit Icon" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => openDeleteModal(supplier)}>
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 not-found">
                  No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
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

      {/* Block Confirmation Modal */}
      <BlockConfirmModal
        showBlockModal={showBlockModal}
        onConfirm={confirmBlock}
        onCancel={closeAllModals}
        blockMessage={blockMessage}
        currentAction={currentAction}
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

export default QmsListSupplier;
