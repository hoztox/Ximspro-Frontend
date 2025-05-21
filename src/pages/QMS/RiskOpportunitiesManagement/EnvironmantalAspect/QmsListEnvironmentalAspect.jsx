import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import publishIcon from "../../../../assets/images/Modal/publish.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteQmsManualConfirmModal from "./Modals/DeleteQmsManualConfirmModal";
import DeleteQmsManualsuccessModal from "./Modals/DeleteQmsManualsuccessModal";
import DeleteQmsManualErrorModal from "./Modals/DeleteQmsManualErrorModal";
import PublishSuccessModal from "./Modals/PublishSuccessModal";
import PublishErrorModal from "./Modals/PublishErrorModal";

const QmsListEnvironmentalAspect = () => {
  // State
  const [environmentalAspects, setEnvironmentalAspects] = useState([]);
  const [corrections, setCorrections] = useState({});
  const [draftCount, setDraftCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const itemsPerPage = 10;

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedAspectId, setSelectedAspectId] = useState(null);
  const [sendNotification, setSendNotification] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aspectToDelete, setAspectToDelete] = useState(null);
  const [showDeleteManualSuccessModal, setShowDeleteManualSuccessModal] = useState(false);
  const [showDeleteManualErrorModal, setShowDeleteManualErrorModal] = useState(false);

  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);
  const [showPublishErrorModal, setShowPublishErrorModal] = useState(false);

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

  // Get current user
  const getCurrentUser = () => {
    const role = localStorage.getItem("role");
    try {
      if (role === "company") {
        const companyData = {};
        Object.keys(localStorage)
          .filter((key) => key.startsWith("company_"))
          .forEach((key) => {
            const cleanKey = key.replace("company_", "");
            try {
              companyData[cleanKey] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
              companyData[cleanKey] = localStorage.getItem(key);
            }
          });
        companyData.role = role;
        companyData.company_id = localStorage.getItem("company_id");
        companyData.company_name = localStorage.getItem("company_name");
        companyData.email_address = localStorage.getItem("email_address");
        return companyData;
      } else if (role === "user") {
        const userData = {};
        Object.keys(localStorage)
          .filter((key) => key.startsWith("user_"))
          .forEach((key) => {
            const cleanKey = key.replace("user_", "");
            try {
              userData[cleanKey] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
              userData[cleanKey] = localStorage.getItem(key);
            }
          });
        userData.role = role;
        userData.user_id = localStorage.getItem("user_id");
        return userData;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  };

  // Get company ID
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

  // Check if user is involved with an aspect
  const isUserInvolvedWithAspect = (aspect) => {
    const currentUserId = Number(localStorage.getItem("user_id"));
    return (
      (aspect.written_by && aspect.written_by.id === currentUserId) ||
      (aspect.checked_by && aspect.checked_by.id === currentUserId) ||
      (aspect.approved_by && aspect.approved_by.id === currentUserId)
    );
  };

  // Filter aspects by visibility
  const filterAspectsByVisibility = (aspectsData) => {
    const role = localStorage.getItem("role");
    return aspectsData.filter((aspect) => {
      if (aspect.status === "Published") {
        return true;
      }
      if (role === "company") {
        return true;
      }
      return isUserInvolvedWithAspect(aspect);
    });
  };

  // Fetch environmental aspects
  const fetchEnvironmentalAspects = async () => {
    try {
      setLoading(true);
      const companyId = getUserCompanyId();
      const response = await axios.get(
        `${BASE_URL}/qms/aspect/${companyId}/`
      );
      const filteredAspects = filterAspectsByVisibility(response.data);
      const sortedAspects = filteredAspects.sort((a, b) => a.id - b.id);
      setEnvironmentalAspects(sortedAspects);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching environmental aspects:", err);
      let errorMsg = err.message;

      if (err.response) {
        // Check for field-specific errors first
        if (err.response.data.date) {
          errorMsg = err.response.data.date[0];
        }
        // Check for non-field errors
        else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        }
        else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const companyId = getUserCompanyId();
        const aspectsResponse = await axios.get(
          `${BASE_URL}/qms/aspect/${companyId}/`
        );
        const filteredAspects = filterAspectsByVisibility(aspectsResponse.data);
        const sortedAspects = filteredAspects.sort((a, b) => a.id - b.id);
        setEnvironmentalAspects(sortedAspects);

        // Fetch corrections for visible aspects
        const correctionsPromises = sortedAspects.map(async (aspect) => {
          try {
            const correctionResponse = await axios.get(
              `${BASE_URL}/qms/aspect/${aspect.id}/corrections/`
            );
            return {
              aspectId: aspect.id,
              corrections: correctionResponse.data,
            };
          } catch (correctionError) {
            console.error(
              `Error fetching corrections for aspect ${aspect.id}:`,
              correctionError
            );
            return { aspectId: aspect.id, corrections: [] };
          }
        });

        // Process all corrections
        const correctionResults = await Promise.all(correctionsPromises);
        const correctionsByAspect = correctionResults.reduce((acc, result) => {
          acc[result.aspectId] = result.corrections;
          return acc;
        }, {});

        setCorrections(correctionsByAspect);

        const id = getRelevantUserId();
        const draftResponse = await axios.get(
          `${BASE_URL}/qms/aspect/drafts-count/${id}/`
        );
        setDraftCount(draftResponse.data.count);

        setCurrentUser(getCurrentUser());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Get relevant user ID
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

  // Handle search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const filteredEnvironmentalAspects = environmentalAspects.filter(
    (aspect) =>
      aspect.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aspect.aspect_source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aspect.aspect_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aspect.legal_requirement?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredEnvironmentalAspects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnvironmentalAspects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo(0, 0);
  };
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // Navigation handlers
  const handleAddEnvironmentalAspect = () => {
    navigate("/company/qms/add-environmantal-aspect");
  };

  const handleDraftEnvironmentalAspect = () => {
    navigate("/company/qms/draft-environmantal-aspect");
  };

  const handleQmsViewEnvironmentalAspect = (id) => {
    navigate(`/company/qms/view-environmantal-aspect/${id}`);
  };

  const handleQmsEditEnvironmentalAspect = (id) => {
    navigate(`/company/qms/edit-environmantal-aspect/${id}`);
  };

  // Delete handlers
  const handleDeleteEnvironmentalAspect = (id) => {
    setAspectToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (aspectToDelete) {
      try {
        await axios.delete(
          `${BASE_URL}/qms/aspect-detail/${aspectToDelete}/`
        );
        setShowDeleteModal(false);
        setShowDeleteManualSuccessModal(true);
        setTimeout(() => {
          setShowDeleteManualSuccessModal(false);
          fetchEnvironmentalAspects();
        }, 2000);
      } catch (err) {
        console.error("Error deleting environmental aspect:", err);
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
          }
          else if (err.response.data.message) {
            errorMsg = err.response.data.message;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }

        setError(errorMsg);
        setShowDeleteManualErrorModal(true);
        setTimeout(() => {
          setShowDeleteManualErrorModal(false);
        }, 2000);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Publish handlers
  const handlePublish = (aspect) => {
    setSelectedAspectId(aspect.id);
    setShowPublishModal(true);
    setSendNotification(false);
  };

  const closePublishModal = () => {
    fetchEnvironmentalAspects();
    setShowPublishModal(false);
    setIsPublishing(false);
  };

  const handlePublishSave = async () => {
    try {
      if (!selectedAspectId) {
        alert("No environmental aspect selected for publishing");
        return;
      }
      setIsPublishing(true);
      const userId = localStorage.getItem("user_id");
      const companyId = localStorage.getItem("company_id");
      const publisherId = userId || companyId;
      if (!publisherId) {
        alert("User information not found. Please log in again.");
        setIsPublishing(false);
        return;
      }
      await axios.post(
        `${BASE_URL}/qms/aspect/${selectedAspectId}/publish-notification/`,
        {
          company_id: getUserCompanyId(),
          published_by: userId,
          send_notification: sendNotification,
        }
      );
      setShowPublishSuccessModal(true);
      setTimeout(() => {
        setShowPublishSuccessModal(false);
        closePublishModal();
        fetchEnvironmentalAspects();
        navigate("/company/qms/list-environmantal-aspect");
        setIsPublishing(false);
      }, 1500);
    } catch (error) {
      console.error("Error publishing environmental aspect:", error);
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
      setShowPublishErrorModal(true);
      setIsPublishing(false);
      setTimeout(() => {
        setShowPublishErrorModal(false);
      }, 3000);
    }
  };

  // Check if user can review
  const canReview = (aspect) => {
    const currentUserId = Number(localStorage.getItem("user_id"));
    const aspectCorrections = corrections[aspect.id] || [];

    if (aspect.status === "Pending for Review/Checking") {
      return currentUserId === aspect.checked_by?.id;
    }

    if (aspect.status === "Correction Requested") {
      return aspectCorrections.some(
        (correction) => correction.to_user.id === currentUserId
      );
    }

    if (aspect.status === "Reviewed,Pending for Approval") {
      return currentUserId === aspect.approved_by?.id;
    }

    return false;
  };

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Environmental Aspect</h1>
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
            className="flex items-center justify-center add-draft-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white relative"
            onClick={handleDraftEnvironmentalAspect}
          >
            <span>Drafts</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[-10px] right-[-10px]">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={() => handleAddEnvironmentalAspect()}
          >
            <span>Add Environmental Aspect</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

      {/* Modals */}
      <DeleteQmsManualConfirmModal
        showDeleteModal={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <DeleteQmsManualsuccessModal
        showDeleteManualSuccessModal={showDeleteManualSuccessModal}
        onClose={() => setShowDeleteManualSuccessModal(false)}
      />
      <DeleteQmsManualErrorModal
        showDeleteManualErrorModal={showDeleteManualErrorModal}
        onClose={() => setShowDeleteManualErrorModal(false)}
        error={error}
      />
      <PublishSuccessModal
        showPublishSuccessModal={showPublishSuccessModal}
        onClose={() => setShowPublishSuccessModal(false)}
      />
      <PublishErrorModal
        showPublishErrorModal={showPublishErrorModal}
        onClose={() => setShowPublishErrorModal(false)}
        error={error}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4 not-found">
            Loading...
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">Title</th>
                <th className="px-2 text-left add-manual-theads">Source</th>
                <th className="px-2 text-left add-manual-theads">Aspect No</th>
                {/* <th className="px-2 text-left add-manual-theads">Applicable Legal Requirement</th> */}
                <th className="px-2 text-left add-manual-theads">Date Raised</th>
                <th className="px-2 text-left add-manual-theads">Level of Impact</th>
                <th className="px-2 text-left add-manual-theads">Status</th>
                <th className="px-2 text-left add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Edit</th>
                <th className="pr-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((aspect, index) => {
                  const canApprove = canReview(aspect);
                  return (
                    <tr
                      key={aspect.id}
                      className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                    >
                      <td className="pl-5 pr-2 add-manual-datas">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {aspect.title || "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {aspect.aspect_source || "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {aspect.aspect_no || "N/A"}
                      </td>
                      {/* <td className="px-2 add-manual-datas">
                        {aspect.legal_requirement || "N/A"}
                      </td> */}
                      <td className="px-2 add-manual-datas">
                        {formatDate(aspect.date)}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {aspect.level_of_impact || "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {aspect.status || "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {aspect.status === "Pending for Publish" ? (
                          <button
                            className="text-[#36DDAE]"
                            onClick={() => handlePublish(aspect)}
                          >
                            Click to Publish
                          </button>
                        ) : canApprove ? (
                          <button
                            onClick={() =>
                              handleQmsViewEnvironmentalAspect(aspect.id)
                            }
                            className="text-[#1E84AF]"
                          >
                            {aspect.status === "Pending for Review/Checking"
                              ? "Review"
                              : aspect.status === "Correction Requested"
                                ? "Correct"
                                : "Click to Approve"}
                          </button>
                        ) : (
                          <span className="text-[#858585]">
                            No Action Required
                          </span>
                        )}
                      </td>
                      <td className="px-2 add-manual-datas !text-center">
                        <button
                          onClick={() =>
                            handleQmsViewEnvironmentalAspect(aspect.id)
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
                            handleQmsEditEnvironmentalAspect(aspect.id)
                          }
                        >
                          <img src={editIcon} alt="Edit Icon" />
                        </button>
                      </td>
                      <td className="px-2 add-manual-datas !text-center">
                        <button
                          onClick={() =>
                            handleDeleteEnvironmentalAspect(aspect.id)
                          }
                        >
                          <img src={deleteIcon} alt="Delete Icon" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-4 not-found">
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`${currentPage === number ? "pagin-active" : "pagin-inactive"
                }`}
            >
              {number}
            </button>
          ))}
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

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="bg-[#1C1C24] rounded-md shadow-xl w-auto h-auto relative"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div className="p-6">
                <div className="flex flex-col justify-center items-center space-y-7">
                  <img src={publishIcon} alt="Publish Icon" className="mt-3" />
                  <div className="flex gap-[113px] mb-5">
                    <div className="flex items-center">
                      <span className="mr-3 add-qms-manual-label">
                        Send Notification?
                      </span>
                      <input
                        type="checkbox"
                        className="qms-manual-form-checkbox"
                        checked={sendNotification}
                        onChange={() => setSendNotification(!sendNotification)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <button
                      onClick={closePublishModal}
                      className="cancel-btn duration-200 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublishSave}
                      className="save-btn duration-200 text-white"
                      disabled={isPublishing}
                    >
                      {isPublishing ? "Publishing..." : "Publish"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QmsListEnvironmentalAspect;