import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusicon from "../../../../assets/images/Company Documentation/plus icon.svg";
import views from "../../../../assets/images/Companies/view.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import publish from "../../../../assets/images/Modal/publish.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import "./qmsmanual.css";
import DeleteQmsManualConfirmModal from "./Modals/DeleteQmsManualConfirmModal";
import DeleteQmsManualsuccessModal from "./Modals/DeleteQmsManualsuccessModal";
import DeleteQmsManualErrorModal from "./Modals/DeleteQmsManualErrorModal";
import PublishSuccessModal from "./Modals/PublishSuccessModal";
import PublishErrorModal from "./Modals/PublishErrorModal";

const QmsManual = () => {
  const [manuals, setManuals] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [corrections, setCorrections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const manualPerPage = 10;

  const [showPublishModal, setShowPublishModal] = useState(false);
  // const [publishSuccess, setPublishSuccess] = useState(false);
  const [selectedManualId, setSelectedManualId] = useState(null);
  const [sendNotification, setSendNotification] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [manualToDelete, setManualToDelete] = useState(null);
  const [showDeleteManualSuccessModal, setShowDeleteManualSuccessModal] =
    useState(false);
  const [showDeleteManualErrorModal, setShowDeleteManualErrorModal] =
    useState(false);

  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);
  const [showPublishErrorModal, setShowPublishErrorModal] = useState(false);

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

  const getCurrentUser = () => {
    const role = localStorage.getItem("role");

    try {
      if (role === "company") {
        // Retrieve company user data
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

        // Add additional fields from localStorage
        companyData.role = role;
        companyData.company_id = localStorage.getItem("company_id");
        companyData.company_name = localStorage.getItem("company_name");
        companyData.email_address = localStorage.getItem("email_address");

        console.log("Company User Data:", companyData);
        return companyData;
      } else if (role === "user") {
        // Retrieve regular user data
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

        // Add additional fields from localStorage
        userData.role = role;
        userData.user_id = localStorage.getItem("user_id");

        console.log("Regular User Data:", userData);
        return userData;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  };

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

  const isUserInvolvedWithManual = (manual) => {
    const currentUserId = Number(localStorage.getItem("user_id"));

    return (
      (manual.written_by && manual.written_by.id === currentUserId) ||
      (manual.checked_by && manual.checked_by.id === currentUserId) ||
      (manual.approved_by && manual.approved_by.id === currentUserId)
    );
  };

  // New function to check if current user can edit/delete the manual
  const canEditOrDelete = (manual) => {
    const currentUserId = Number(localStorage.getItem("user_id"));
    const role = localStorage.getItem("role");
    
    // Company role can always edit/delete
    if (role === "company") {
      return true;
    }
    
    // For regular users, only allow if they are the writer
    return manual.written_by && manual.written_by.id === currentUserId;
  };

  const filterManualsByVisibility = (manualsData) => {
    const role = localStorage.getItem("role");

    return manualsData.filter((manual) => {
      // If manual is published, show to everyone
      if (manual.status === "Published") {
        return true;
      }

      if (role === "company") {
        return true;
      }

      return isUserInvolvedWithManual(manual);
    });
  };

  const fetchManuals = async () => {
    try {
      setLoading(true);
      const companyId = getUserCompanyId();
      const response = await axios.get(`${BASE_URL}/qms/manuals/${companyId}/`);
      const filteredManuals = filterManualsByVisibility(response.data);

      // Sort manuals by id in ascending order (oldest first), with fallback to written_at
      const sortedManuals = filteredManuals.sort((a, b) => {
        if (a.id && b.id) {
          return a.id - b.id;
        }
        // Fallback to sorting by written_at if id is unavailable
        return new Date(a.written_at) - new Date(b.written_at);
      });

      setManuals(sortedManuals);
      console.log("Sorted Manuals Data:", sortedManuals);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching manuals:", err);
      let errorMsg =  err.message;

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
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const companyId = getUserCompanyId();
        const manualsResponse = await axios.get(
          `${BASE_URL}/qms/manuals/${companyId}/`
        );

        // Sort manuals by id in ascending order (oldest first), with fallback to written_at
        const filteredManuals = filterManualsByVisibility(manualsResponse.data);
        const sortedManuals = filteredManuals.sort((a, b) => {
          if (a.id && b.id) {
            return a.id - b.id;
          }
          // Fallback to sorting by written_at if id is unavailable
          return new Date(a.written_at) - new Date(b.written_at);
        });

        setManuals(sortedManuals);

        const correctionsPromises = sortedManuals.map(async (manual) => {
          try {
            const correctionResponse = await axios.get(
              `${BASE_URL}/qms/manuals/${manual.id}/corrections/`
            );
            return {
              manualId: manual.id,
              corrections: correctionResponse.data,
            };
          } catch (correctionError) {
            console.error(
              `Error fetching corrections for manual ${manual.id}:`,
              correctionError
            );
            return { manualId: manual.id, corrections: [] };
          }
        });

        const correctionResults = await Promise.all(correctionsPromises);
        const correctionsByManual = correctionResults.reduce((acc, result) => {
          acc[result.manualId] = result.corrections;
          return acc;
        }, {});

        setCorrections(correctionsByManual);

        const id = getRelevantUserId();
        const draftResponse = await axios.get(
          `${BASE_URL}/qms/manuals/drafts-count/${id}/`
        );
        setDraftCount(draftResponse.data.count);

        setCurrentUser(getCurrentUser());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        let errorMsg = error.message;

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

    fetchAllData();
  }, []);

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

  const handleClickApprove = (id) => {
    navigate(`/company/qms/viewmanual/${id}`);
  };

  // Delete manual
  const handleDelete = (id) => {
    setManualToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (manualToDelete) {
      try {
        await axios.delete(`${BASE_URL}/qms/manual-detail/${manualToDelete}/`);
        setShowDeleteModal(false);
        setShowDeleteManualSuccessModal(true);
        setTimeout(() => {
          setShowDeleteManualSuccessModal(false);
          fetchManuals(); // Refresh the list after deletion
        }, 2000);
      } catch (err) {
        console.error("Error deleting manual:", err);
        setShowDeleteModal(false);
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

  const filteredManual = manuals.filter(
    (manual) =>
      (manual.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (manual.no?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (manual.approved_by?.first_name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (manual.rivision?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (formatDate(manual.date)?.replace(/^0+/, "") || "").includes(
        searchQuery.replace(/^0+/, "")
      )
  );

  const totalPages = Math.ceil(filteredManual.length / manualPerPage);
  const paginatedManual = filteredManual.slice(
    (currentPage - 1) * manualPerPage,
    currentPage * manualPerPage
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleQMSAddManual = () => {
    navigate("/company/qms/addmanual");
  };

  const handleEdit = (id) => {
    navigate(`/company/qms/editmanual/${id}`);
  };

  const handleView = (id) => {
    navigate(`/company/qms/viewmanual/${id}`);
  };

  const handleManualDraft = () => {
    navigate("/company/qms/draftmanual");
  };

  const handlePublish = (manual) => {
    setSelectedManualId(manual.id);
    setShowPublishModal(true);
    // setPublishSuccess(false);
    setSendNotification(false);
  };

  const closePublishModal = () => {
    fetchManuals();
    setShowPublishModal(false);
    setIsPublishing(false); // Reset publishing state when modal is closed
    setTimeout(() => {
      // setPublishSuccess(false);
    }, 300);
  };

  const handlePublishSave = async () => {
    try {
      if (!selectedManualId) {
        alert("No manual selected for publishing");
        return;
      }
      // Set isPublishing to true at the start of the operation
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
        `${BASE_URL}/qms/manuals/${selectedManualId}/publish-notification/`,
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
        fetchManuals(); // Refresh the list
        navigate("/company/qms/manual");
        setIsPublishing(false); // Reset the publishing state after success
      }, 1500);
    } catch (error) {
      console.error("Error publishing manual:", error);
      setShowPublishErrorModal(true);
      setIsPublishing(false); // Reset if there's an error
      setTimeout(() => {
        setShowPublishErrorModal(false);
      }, 3000);
    }
  };
  const canReview = (manual) => {
    const currentUserId = Number(localStorage.getItem("user_id"));
    const manualCorrections = corrections[manual.id] || [];
    console.log("Reviewing Conditions Debug:", {
      currentUserId,
      checkedById: manual.checked_by?.id,
      status: manual.status,
      corrections: manualCorrections,
      toUserId:
        manualCorrections.length > 0 ? manualCorrections[0].to_user?.id : null,
    });
    if (manual.status === "Pending for Review/Checking") {
      return currentUserId === manual.checked_by?.id;
    }
    if (manual.status === "Correction Requested") {
      return manualCorrections.some(
        (correction) =>
          correction.to_user?.id === currentUserId &&
          currentUserId === correction.to_user?.id
      );
    }
    if (manual.status === "Reviewed,Pending for Approval") {
      return currentUserId === manual.approved_by?.id;
    }
    return false;
  };

  return (
    <div className="bg-[#1C1C24] list-manual-main">
      <div className="flex items-center justify-between px-[14px] pt-[24px]">
        <h1 className="list-manual-head">List Manual Sections</h1>

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
          onClose={() => {
            setShowPublishSuccessModal(false);
          }}
        />
        <PublishErrorModal
          showPublishErrorModal={showPublishErrorModal}
          onClose={() => {
            setShowPublishErrorModal(false);
          }}
          error={error}
        />

        <div className="flex space-x-5">
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
            className="flex items-center justify-center add-draft-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleManualDraft}
          >
            <span>Drafts</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[120px] right-56">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleQMSAddManual}
          >
            <span>Add Manual Sections</span>
            <img
              src={plusicon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

      <div className="p-5 overflow-hidden">
        {loading ? (
          <div className="text-center py-4 not-found">Loading Manuals...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">
                  Section Title
                </th>
                <th className="px-2 text-left add-manual-theads">Section No</th>
                <th className="px-2 text-left add-manual-theads">
                  Approved by
                </th>
                <th className="px-2 text-left add-manual-theads">Revision</th>
                <th className="px-2 text-left add-manual-theads">Date</th>
                <th className="px-2 text-left add-manual-theads">Status</th>
                <th className="px-2 text-left add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Edit</th>
                <th className="pl-2 pr-4 text-center add-manual-theads">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody key={currentPage}>
              {paginatedManual.length > 0 ? (
                paginatedManual.map((manual, index) => {
                  const canApprove = canReview(manual);
                  const canEditDelete = canEditOrDelete(manual);

                  return (
                    <tr
                      key={manual.id}
                      className="border-b border-[#383840] hover:bg-[#1a1a20] h-[46px]"
                    >
                      <td className="pl-5 pr-2 add-manual-datas">
                        {(currentPage - 1) * manualPerPage + index + 1}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {manual.title || "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {manual.no || "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {manual.approved_by
                          ? `${manual.approved_by.first_name} ${manual.approved_by.last_name}`
                          : "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {manual.rivision || "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">
                        {formatDate(manual.date)}
                      </td>
                      <td className="px-2 add-manual-datas">{manual.status}</td>
                      <td className="px-2 add-manual-datas">
                        {manual.status === "Pending for Publish" ? (
                          <button
                            className="text-[#36DDAE]"
                            onClick={() => handlePublish(manual)}
                          >
                            Click to Publish
                          </button>
                        ) : canApprove ? (
                          <button
                            onClick={() => handleClickApprove(manual.id)}
                            className="text-[#1E84AF]"
                          >
                            {manual.status === "Pending for Review/Checking"
                              ? "Review"
                              : manual.status === "Correction Requested"
                              ? "Click to Correct"
                              : "Click to Corrcet"}
                          </button>
                        ) : (
                          <span className="text-[#858585]">
                            Not Action Required
                          </span>
                        )}
                      </td>
                      <td className="px-2 add-manual-datas text-center">
                        <button
                          onClick={() => handleView(manual.id)}
                          title="View"
                        >
                          <img src={views} alt="" />
                        </button>
                      </td>
                      <td className="px-2 add-manual-datas text-center">
                        {canEditDelete ? (
                          <button
                            onClick={() => handleEdit(manual.id)}
                            title="Edit"
                          >
                            <img src={edits} alt="" />
                          </button>
                        ) : (
                          <span className="text-[#858585] text-xs">-</span>
                        )}
                      </td>

                      <td className="pl-2 pr-4 add-manual-datas text-center">
                        {canEditDelete ? (
                          <button
                            onClick={() => handleDelete(manual.id)}
                            title="Delete"
                          >
                            <img src={deletes} alt="" />
                          </button>
                        ) : (
                          <span className="text-[#858585] text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4 not-found">
                    No Manuals found.
                  </td>
                </tr>
              )}
              <tr>
                <td
                  colSpan="11"
                  className="pt-[15px] border-t border-[#383840]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="text-white total-text">
                      Total-{filteredManual.length}
                    </div>
                    <div className="flex items-center gap-5">
                      <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`cursor-pointer swipe-text ${
                          currentPage === 1 ? "opacity-50" : ""
                        }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`${
                              currentPage === page
                                ? "pagin-active"
                                : "pagin-inactive"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={handleNext}
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                        className={`cursor-pointer swipe-text ${
                          currentPage === totalPages || totalPages === 0
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay with animation */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Modal with animation */}
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
                  <img src={publish} alt="Publish Icon" className="mt-3" />
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
                  {/* {publishSuccess && (
                    <div className="text-green-500 mb-3">Manual published successfully!</div>
                  )} */}
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

export default QmsManual;