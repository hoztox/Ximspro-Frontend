import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import publish from "../../../../assets/images/Modal/publish.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteQmsManualConfirmModal from "./Modals/DeleteQmsManualConfirmModal";
import DeleteQmsManualErrorModal from "./Modals/DeleteQmsManualErrorModal";
import PublishSuccessModal from "./Modals/PublishSuccessModal";
import PublishErrorModal from "./Modals/PublishErrorModal";
import DeleteQmsManualsuccessModal from "./Modals/DeleteQmsManualsuccessModal";

const QmsListEnvironmentalImpact = () => {
  const [environmentalImpacts, setEnvironmentalImpacts] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [corrections, setCorrections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const itemsPerPage = 10;

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedImpactId, setSelectedImpactId] = useState(null);
  const [sendNotification, setSendNotification] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [impactToDelete, setImpactToDelete] = useState(null);
  const [showDeleteManualSuccessModal, setShowDeleteManualSuccessModal] = useState(false);
  const [showDeleteManualErrorModal, setShowDeleteManualErrorModal] = useState(false);

  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);
  const [showPublishErrorModal, setShowPublishErrorModal] = useState(false);

  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

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

  const isUserInvolvedWithImpact = (impact) => {
    const currentUserId = Number(localStorage.getItem("user_id"));
    return (
      (impact.written_by && impact.written_by.id === currentUserId) ||
      (impact.checked_by && impact.checked_by.id === currentUserId) ||
      (impact.approved_by && impact.approved_by.id === currentUserId)
    );
  };

  const filterImpactsByVisibility = (impactsData) => {
    const role = localStorage.getItem("role");
    return impactsData.filter((impact) => {
      if (impact.status === "Published") {
        return true;
      }
      if (role === "company") {
        return true;
      }
      return isUserInvolvedWithImpact(impact);
    });
  };

  const fetchEnvironmentalImpacts = async () => {
    try {
      setLoading(true);
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${BASE_URL}/qms/impact/${companyId}/`);
      const filteredImpacts = filterImpactsByVisibility(response.data);
      const sortedImpacts = filteredImpacts.sort((a, b) => {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      });
      setEnvironmentalImpacts(sortedImpacts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching environmental impacts:", err);
      setError("Failed to load environmental impacts. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          setError("Company ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch environmental impacts
        const impactsResponse = await axios.get(`${BASE_URL}/qms/impact/${companyId}/`);
        const filteredImpacts = filterImpactsByVisibility(impactsResponse.data);
        const sortedImpacts = filteredImpacts.sort((a, b) => {
          return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        });
        setEnvironmentalImpacts(sortedImpacts);

        // Fetch corrections for each impact
        const correctionsPromises = sortedImpacts.map(async (impact) => {
          try {
            const correctionResponse = await axios.get(
              `${BASE_URL}/qms/impact/${impact.id}/corrections/`
            );
            return { impactId: impact.id, corrections: correctionResponse.data };
          } catch (correctionError) {
            console.error(`Error fetching corrections for impact ${impact.id}:`, correctionError);
            return { impactId: impact.id, corrections: [] };
          }
        });

        const correctionResults = await Promise.all(correctionsPromises);
        const correctionsByImpact = correctionResults.reduce((acc, result) => {
          acc[result.impactId] = result.corrections;
          return acc;
        }, {});
        setCorrections(correctionsByImpact);

        // Fetch draft count
        const id = getRelevantUserId();
        if (id) {
          const draftResponse = await axios.get(
            `${BASE_URL}/qms/impact/drafts-count/${id}/`
          );
          setDraftCount(draftResponse.data.count || 0);
        }

        setCurrentUser(getCurrentUser());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sortOrder]); // Add sortOrder to the dependency array

  const handleClickApprove = (id) => {
    navigate(`/company/qms/view-environmantal-impact/${id}`);
  };

  const handleDeleteEnvironmentalImpact = (id) => {
    setImpactToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (impactToDelete) {
      try {
        await axios.delete(`${BASE_URL}/qms/impact-detail/${impactToDelete}/`);
        setShowDeleteModal(false);
        setShowDeleteManualSuccessModal(true);
        setTimeout(() => {
          setShowDeleteManualSuccessModal(false);
          fetchEnvironmentalImpacts();
        }, 1500);
      } catch (err) {
        console.error("Error deleting environmental impact:", err);
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
        }, 1500);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setImpactToDelete(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleAddEnvironmentalImpact = () => {
    navigate("/company/qms/add-environmantal-impact");
  };

  const handleDraftEnvironmentalImpact = () => {
    navigate("/company/qms/draft-environmantal-impact");
  };

  const handleQmsViewEnvironmentalImpact = (id) => {
    navigate(`/company/qms/view-environmantal-impact/${id}`);
  };

  const handleQmsEditEnvironmentalImpact = (id) => {
    navigate(`/company/qms/edit-environmantal-impact/${id}`);
  };

  const handlePublish = (impact) => {
    setSelectedImpactId(impact.id);
    setShowPublishModal(true);
    setSendNotification(impact.send_notification || false);
  };

  const closePublishModal = () => {
    setShowPublishModal(false);
    setSelectedImpactId(null);
    setIsPublishing(false);
  };

  const handlePublishSave = async () => {
    try {
      if (!selectedImpactId) {
        setError("No environmental impact selected for publishing");
        setIsPublishing(false);
        return;
      }
      setIsPublishing(true);
      const userId = localStorage.getItem("user_id");
      const companyId = localStorage.getItem("company_id");
      const publisherId = userId || companyId;
      if (!publisherId) {
        setError("User information not found. Please log in again.");
        setIsPublishing(false);
        return;
      }
      await axios.post(
        `${BASE_URL}/qms/impact/${selectedImpactId}/publish-notification/`,
        {
          company_id: getUserCompanyId(),
          published_by: publisherId,
          send_notification: sendNotification,
        }
      );
      setShowPublishSuccessModal(true);
      setTimeout(() => {
        setShowPublishSuccessModal(false);
        closePublishModal();
        fetchEnvironmentalImpacts();
      }, 1500);
    } catch (error) {
      console.error("Error publishing environmental impact:", error);
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
      setTimeout(() => {
        setShowPublishErrorModal(false);
      }, 1500);
    } finally {
      setIsPublishing(false);
    }
  };

  const canReview = (impact) => {
    const currentUserId = Number(localStorage.getItem("user_id"));
    const impactCorrections = corrections[impact.id] || [];
    if (impact.status === "Pending for Review/Checking") {
      return currentUserId === impact.checked_by?.id;
    }
    if (impact.status === "Correction Requested") {
      return impactCorrections.some(
        (correction) => correction.to_user?.id === currentUserId
      );
    }
    if (impact.status === "Reviewed,Pending for Approval") {
      return currentUserId === impact.approved_by?.id;
    }
    return false;
  };

  const filteredEnvironmentalImpacts = environmentalImpacts.filter(
    (impact) =>
      (impact.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (impact.number?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (impact.approved_by?.first_name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (formatDate(impact.date)?.replace(/^0+/, "") || "").includes(
        searchQuery.replace(/^0+/, "")
      )
  );

  const totalItems = filteredEnvironmentalImpacts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnvironmentalImpacts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Environmental Impact Assessments</h1>
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
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[100px] relative"
            onClick={handleDraftEnvironmentalImpact}
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
            onClick={handleAddEnvironmentalImpact}
          >
            <span>Add Environmental Impact Assessment</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

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

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4 not-found">Loading environmental impacts...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">Title</th>
                <th className="px-2 text-left add-manual-theads">Impact Assessment No</th>
                <th className="px-2 text-left add-manual-theads">Approved By</th>
                <th className="px-2 text-left add-manual-theads">Date</th>
                <th className="px-2 text-left add-manual-theads">Status</th>
                <th className="px-2 text-left add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Edit</th>
                <th className="px-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((impact, index) => {
                  const canApprove = canReview(impact);
                  return (
                    <tr
                      key={impact.id}
                      className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px]"
                    >
                      <td className="pl-5 pr-2 add-manual-datas">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-2 add-manual-datas">{impact.title || "N/A"}</td>
                      <td className="px-2 add-manual-datas">{impact.number || "N/A"}</td>
                      <td className="px-2 add-manual-datas">
                        {impact.approved_by
                          ? `${impact.approved_by.first_name} ${impact.approved_by.last_name}`
                          : "N/A"}
                      </td>
                      <td className="px-2 add-manual-datas">{formatDate(impact.date)}</td>
                      <td className="px-2 add-manual-datas">{impact.status || "N/A"}</td>
                      <td className="px-2 add-manual-datas">
                        {impact.status === "Pending for Publish" ? (
                          <button
                            className="text-[#36DDAE]"
                            onClick={() => handlePublish(impact)}
                          >
                            Click to Publish
                          </button>
                        ) : canApprove ? (
                          <button
                            onClick={() => handleClickApprove(impact.id)}
                            className="text-[#1E84AF]"
                          >
                            {impact.status === "Pending for Review/Checking"
                              ? "Review"
                              : impact.status === "Correction Requested"
                                ? "Correct"
                                : "Approve"}
                          </button>
                        ) : (
                          <span className="text-[#858585]">No Action Required</span>
                        )}
                      </td>
                      <td className="px-2 add-manual-datas text-center">
                        <button onClick={() => handleQmsViewEnvironmentalImpact(impact.id)}>
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
                      <td className="px-2 add-manual-datas text-center">
                        <button onClick={() => handleQmsEditEnvironmentalImpact(impact.id)}>
                          <img src={editIcon} alt="Edit Icon" />
                        </button>
                      </td>
                      <td className="px-2 add-manual-datas text-center">
                        <button onClick={() => handleDeleteEnvironmentalImpact(impact.id)}>
                          <img src={deleteIcon} alt="Delete Icon" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 not-found">
                    No Environmental Impact Assessments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-white total-text">Total: {totalItems}</div>
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
                  <img src={publish} alt="Publish Icon" className="mt-3" />
                  <div className="flex items-center mb-5">
                    <span className="mr-3 add-qms-manual-label">Send Notification?</span>
                    <input
                      type="checkbox"
                      className="qms-manual-form-checkbox"
                      checked={sendNotification}
                      onChange={() => setSendNotification(!sendNotification)}
                    />
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

export default QmsListEnvironmentalImpact;