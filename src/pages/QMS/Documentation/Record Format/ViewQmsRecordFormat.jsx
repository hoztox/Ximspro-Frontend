import React, { useState, useEffect } from "react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import historys from "../../../../assets/images/Company Documentation/history.svg";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, AlertCircle, UserPlus, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import ManualCorrectionSuccessModal from "./Modals/ManualCorrectionSuccessModal";
import ManualCorrectionErrorModal from "./Modals/ManualCorrectionErrorModal";
import ReviewSubmitSuccessModal from "./Modals/ReviewSubmitSuccessModal";
import ReviewSubmitErrorModal from "./Modals/ReviewSubmitErrorModal";
import DeleteQmsManualConfirmModal from "./Modals/DeleteQmsManualConfirmModal";
import DeleteQmsManualsuccessModal from "./Modals/DeleteQmsManualsuccessModal";
import DeleteQmsManualErrorModal from "./Modals/DeleteQmsManualErrorModal";
import SuccessModal from "./Modals/SuccessModal";

const ViewQmsRecordFormat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [manualDetails, setManualDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [corrections, setCorrections] = useState([]);
  const [highlightedCorrection, setHighlightedCorrection] = useState(null);
  const [historyCorrections, setHistoryCorrections] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [showSentCorrectionSuccessModal, setShowSentCorrectionSuccessModal] =
    useState(false);
  const [showSentCorrectionErrorModal, setShowSentCorrectionErrorModal] =
    useState(false);
  const [showSubmitManualSuccessModal, setShowSubmitManualSuccessModal] =
    useState(false);
  const [showSubmitManualErrorModal, setShowSubmitManualErrorModal] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteManualSuccessModal, setShowDeleteManualSuccessModal] =
    useState(false);
  const [showDeleteManualErrorModal, setShowDeleteManualErrorModal] =
    useState(false);
  const [correctionRequest, setCorrectionRequest] = useState({
    isOpen: false,
    text: "",
  });
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [approveError, setApproveError] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

        console.log("Company User Data:", companyData);
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

  const fetchManualDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/qms/record-detail/${id}/`);
      setManualDetails(response.data);
      console.log("Record Format Details:", response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching record format details:", err);
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
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        throw new Error("Company ID not found");
      }
      const response = await axios.get(
        `${BASE_URL}/company/users-active/${companyId}/`
      );
      setUsers(response.data);
      console.log("Fetched Users:", response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setApproveError(err.message || "Failed to fetch users");
    }
  };

  const handleUpdateApprovedBy = async () => {
    try {
      if (!selectedUserId) {
        setApproveError("Please select a user");
        return;
      }

      const response = await axios.put( `${BASE_URL}/qms/record/${id}/update/`, {
        approved_by: selectedUserId,
      });

      setManualDetails(response.data);
      setShowSuccessModal(true);
      setSuccessMessage("Approver Added Successfully");
      setShowApproveModal(false);
      setSelectedUserId("");
      setApproveError(null);
      await fetchManualDetails();
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);
    } catch (err) {
      console.error("Error updating approved by:", err);
      let errorMsg = err.message;

      if (err.response) {
        if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      }

      setApproveError(errorMsg);
    }
  };

  const getViewedCorrections = () => {
    const storageKey = `viewed_corrections_${id}_${localStorage.getItem(
      "user_id"
    )}`;
    const viewedCorrections = localStorage.getItem(storageKey);
    return viewedCorrections ? JSON.parse(viewedCorrections) : [];
  };

  const saveViewedCorrection = (correctionId) => {
    const storageKey = `viewed_corrections_${id}_${localStorage.getItem(
      "user_id"
    )}`;
    const viewedCorrections = getViewedCorrections();
    if (!viewedCorrections.includes(correctionId)) {
      viewedCorrections.push(correctionId);
      localStorage.setItem(storageKey, JSON.stringify(viewedCorrections));
    }
  };

  const fetchManualCorrections = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/qms/record/${id}/corrections/`
      );
      const allCorrections = response.data;
      console.log("Fetched Record Format Corrections:", allCorrections);

      const viewedCorrections = getViewedCorrections();
      setCorrections(allCorrections);

      const sortedCorrections = [...allCorrections].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      if (sortedCorrections.length > 0) {
        const mostRecent = sortedCorrections[0];
        if (!viewedCorrections.includes(mostRecent.id)) {
          setHighlightedCorrection(mostRecent);
          setHistoryCorrections(sortedCorrections.slice(1));
        } else {
          setHighlightedCorrection(null);
          setHistoryCorrections(sortedCorrections);
        }
      } else {
        setHighlightedCorrection(null);
        setHistoryCorrections([]);
      }
    } catch (error) {
      console.error("Error fetching record format corrections:", error);
    }
  };

  useEffect(() => {
    fetchManualDetails();
    fetchManualCorrections();
    fetchUsers();
  }, [id]);

  const getUserName = (user) => {
    if (!user) return "N/A";

    if (typeof user === "object" && user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }

    if (typeof user === "number" && usersData[user]) {
      return `${usersData[user].first_name} ${usersData[user].last_name}`;
    }

    if (typeof user === "string" && user.includes("@")) {
      return user;
    }

    if (
      user === highlightedCorrection?.to_user &&
      highlightedCorrection?.to_user_email
    ) {
      return highlightedCorrection.to_user_email;
    }

    return `User ${user}`;
  };

  const handleCorrectionRequest = () => {
    setCorrectionRequest((prev) => ({
      ...prev,
      isOpen: true,
    }));
  };

  const handleCloseCorrectionRequest = () => {
    setCorrectionRequest({
      isOpen: false,
      text: "",
    });
  };

  const handleCloseViewPage = () => {
    navigate("/company/qms/record-format");
  };

  const handleCorrectionSubmit = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("User not authenticated");
        return;
      }

      const requestData = {
        manual_id: id,
        correction: correctionRequest.text,
        from_user: currentUser.user_id,
      };

      console.log("Submitting correction request:", requestData);

      const response = await axios.post(
        `${BASE_URL}/qms/record/submit-correction/`,
        requestData
      );

      console.log("Correction response:", response.data);

      handleCloseCorrectionRequest();
      setShowSentCorrectionSuccessModal(true);

      const storageKey = `viewed_corrections_${id}_${localStorage.getItem(
        "user_id"
      )}`;
      localStorage.removeItem(storageKey);

      await fetchManualDetails();
      await fetchManualCorrections();

      setTimeout(() => {
        setShowSentCorrectionSuccessModal(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting correction:", error);
      let errorMsg = error.message;

      if (error.response) {
        if (error.response.data.date) {
          errorMsg = error.response.data.date[0];
        } else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
      setShowSentCorrectionErrorModal(true);
      setTimeout(() => {
        setShowSentCorrectionErrorModal(false);
      }, 3000);
    }
  };

  const handleMoveToHistory = () => {
    if (highlightedCorrection) {
      saveViewedCorrection(highlightedCorrection.id);
      setHistoryCorrections((prev) => [highlightedCorrection, ...prev]);
      setHighlightedCorrection(null);
    }
  };

  const handleDeleteRecordFormat = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/record-detail/${id}/`);
      setShowDeleteModal(false);
      setShowDeleteManualSuccessModal(true);
      setTimeout(() => {
        setShowDeleteManualSuccessModal(false);
        navigate("/company/qms/record-format");
      }, 2000);
    } catch (error) {
      console.error("Error deleting record format:", error);
      setShowDeleteModal(false);
      setShowDeleteManualErrorModal(true);
      setTimeout(() => {
        setShowDeleteManualErrorModal(false);
      }, 2000);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
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

  const formatCorrectionDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, "0");
    return `${day}-${month}-${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  const correctionVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  if (loading)
    return (
      <div className="text-center not-found">
        Loading Record Format Details...
      </div>
    );
  if (!manualDetails)
    return (
      <div className="text-center not-found">
        No Record Format Details Found
      </div>
    );

  const currentUserId = Number(localStorage.getItem("user_id"));
  const isCurrentUserWrittenBy = currentUserId === manualDetails.written_by?.id;

  const canReview = (() => {
    if (isCurrentUserWrittenBy) {
      return true;
    }

    if (manualDetails.status === "Pending for Review/Checking") {
      return currentUserId === manualDetails.checked_by?.id;
    }

    if (manualDetails.status === "Correction Requested") {
      const hasSentCorrections = corrections.some(
        (correction) =>
          correction.from_user?.id === currentUserId && !correction.is_addressed
      );

      if (hasSentCorrections) {
        return false;
      }

      return corrections.some(
        (correction) => correction.to_user?.id === currentUserId
      );
    }

    if (manualDetails.status === "Reviewed,Pending for Approval") {
      return currentUserId === manualDetails.approved_by?.id;
    }

    return false;
  })();

  const handleReviewAndSubmit = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("User not authenticated");
        return;
      }

      const requestData = {
        record_id: id,
        current_user_id: currentUser.user_id,
      };

      const response = await axios.post(
        `${BASE_URL}/qms/record-review/`,
        requestData
      );

      setShowSubmitManualSuccessModal(true);
      setTimeout(() => {
        setShowSubmitManualSuccessModal(false);
        navigate("/company/qms/record-format");
      }, 1500);
      fetchManualDetails();
      fetchManualCorrections();
    } catch (error) {
      console.error("Error submitting review:", error);
      let errorMsg;

      if (error.response) {
        const data = error.response.data;
        errorMsg =
          data?.error || data?.message || data?.detail || JSON.stringify(data);
      } else if (error.request) {
        errorMsg = "No response received from server.";
      } else {
        errorMsg = error.message || "An unknown error occurred.";
      }

      setError(errorMsg);
      setShowSubmitManualErrorModal(true);
      setTimeout(() => {
        setShowSubmitManualErrorModal(false);
      }, 3000);
    }
  };

  const renderHighlightedCorrection = () => {
    if (!highlightedCorrection) return null;

    return (
      <div className="mt-5 bg-[#1F2937] p-4 rounded-md border-l-4 border-[#3B82F6]">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-[#3B82F6]" />
            <h2 className="text-white font-medium">
              Latest Correction Request
            </h2>
          </div>
          <button
            onClick={handleMoveToHistory}
            className="text-[#AAAAAA] hover:text-white text-sm"
          >
            Move to history
          </button>
        </div>
        <div className="bg-[#24242D] p-5 rounded-md mt-3">
          <div className="flex justify-between items-center mb-2">
            <div className="from-to-time text-[#AAAAAA]">
              From: {getUserName(highlightedCorrection.from_user)}
            </div>
            <div className="from-to-time text-[#AAAAAA]">
              {formatCorrectionDate(highlightedCorrection.created_at)}
            </div>
          </div>
          <p className="text-white history-content">
            {highlightedCorrection.correction}
          </p>
        </div>
      </div>
    );
  };

  const renderCorrectionHistory = () => {
    if (historyCorrections.length === 0) return null;

    return (
      <div className="mt-5 bg-[#1C1C24] p-4 pt-0 rounded-md max-h-[356px] overflow-auto custom-scrollbar">
        <div className="sticky -top-0 bg-[#1C1C24] flex items-center text-white mb-5 gap-[6px] pb-2">
          <h2 className="history-head">Correction History</h2>
          <img src={historys} alt="History" />
        </div>
        {historyCorrections.map((correction, index) => (
          <div
            key={correction.id}
            className={`bg-[#24242D] p-5 rounded-md mb-5 ${
              index < historyCorrections.length - 1 ? "mb-5" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="from-to-time text-[#AAAAAA]">
                From: {getUserName(correction.from_user)}
              </div>
              <div className="from-to-time text-[#AAAAAA]">
                {formatCorrectionDate(correction.created_at)}
              </div>
            </div>
            <p className="text-white history-content">
              {correction.correction}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#1C1C24] p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
        <h1 className="viewmanualhead">Record Format Information</h1>
        <button
          className="text-white bg-[#24242D] p-1 rounded-md"
          onClick={handleCloseViewPage}
        >
          <X size={22} />
        </button>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-2 divide-x divide-[#383840] border-b border-[#383840] pb-5">
          <div className="grid grid-cols-1 gap-[40px]">
            <div>
              <label className="viewmanuallabels">Record Name/Title</label>
              <div className="flex justify-between items-center">
                <p className="viewmanuasdata">{manualDetails.title || "N/A"}</p>
              </div>
            </div>
            <div>
              <label className="viewmanuallabels">Record Number</label>
              <p className="viewmanuasdata">{manualDetails.no || "N/A"}</p>
            </div>
            <div>
              <label className="viewmanuallabels">Revision</label>
              <p className="viewmanuasdata">
                {manualDetails.rivision || "N/A"}
              </p>
            </div>
            <div>
              <label className="viewmanuallabels">Document Type</label>
              <p className="viewmanuasdata">
                {manualDetails.document_type || "N/A"}
              </p>
            </div>
            <div>
              <label className="viewmanuallabels">Document</label>
              <div
                className="flex items-center cursor-pointer gap-[8px]"
                onClick={() => {
                  if (manualDetails.upload_attachment) {
                    window.open(manualDetails.upload_attachment, "_blank");
                  }
                }}
              >
                <p className="click-view-file-text">
                  {manualDetails.upload_attachment
                    ? "Click to view file"
                    : "No file attached"}
                </p>
                {manualDetails.upload_attachment && (
                  <Eye size={20} className="text-[#1E84AF]" />
                )}
              </div>
            </div>
            <div>
              <label className="viewmanuallabels">Retention Period</label>
              <p className="viewmanuasdata">
                {manualDetails.retention_period || "N/A"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[40px] pl-5">
            <div>
              <label className="viewmanuallabels">Written/Prepare By</label>
              <p className="viewmanuasdata">
                {manualDetails.written_by
                  ? `${manualDetails.written_by.first_name} ${manualDetails.written_by.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="viewmanuallabels">Checked/Reviewed By</label>
              <p className="viewmanuasdata">
                {manualDetails.checked_by
                  ? `${manualDetails.checked_by.first_name} ${manualDetails.checked_by.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="viewmanuallabels">Approved By</label>
              <div className="flex items-center gap-24">
                <p className="viewmanuasdata">
                  {manualDetails.approved_by
                    ? `${manualDetails.approved_by.first_name} ${manualDetails.approved_by.last_name}`
                    : "N/A"}
                </p>
                {(!manualDetails.approved_by ||
                  manualDetails.approved_by === "N/A") &&
                  isCurrentUserWrittenBy && (
                    <button
                      onClick={() => setShowApproveModal(true)}
                      className="save-btn text-white flex items-center gap-2 !w-[12rem] duration-200"
                      title="Assign Approver"
                    >
                      <UserPlus size={20} />
                      Select Approver
                    </button>
                  )}
              </div>
            </div>
            <div>
              <label className="viewmanuallabels">Date</label>
              <p className="viewmanuasdata">{formatDate(manualDetails.date)}</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <label className="viewmanuallabels">Review Frequency</label>
                <p className="viewmanuasdata">
                  {manualDetails.review_frequency_year
                    ? `${manualDetails.review_frequency_year} years, ${
                        manualDetails.review_frequency_month || 0
                      } months`
                    : "N/A"}
                </p>
              </div>
              {isCurrentUserWrittenBy && (
                <div className="flex gap-10">
                  <div className="flex flex-col justify-center items-center">
                    <label className="viewmanuallabels">Edit</label>
                    <button
                      onClick={() => {
                        handleMoveToHistory();
                        navigate(`/company/qms/editrecordformat/${id}`);
                      }}
                    >
                      <img src={edits} alt="Edit Icon" />
                    </button>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <label className="viewmanuallabels">Delete</label>
                    <button onClick={handleDeleteRecordFormat}>
                      <img src={deletes} alt="Delete Icon" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-[51.5px]"></div>
          </div>
        </div>
        {renderHighlightedCorrection()}
        {renderCorrectionHistory()}
        {canReview && (
          <div className="flex flex-wrap justify-between mt-5">
            {!correctionRequest.isOpen && (
              <>
                <button
                  onClick={() => {
                    handleMoveToHistory();
                    handleCorrectionRequest();
                  }}
                  className="request-correction-btn duration-200"
                >
                  Request For Correction
                </button>
                {manualDetails.status === "Reviewed,Pending for Approval" ? (
                  <button
                    onClick={() => {
                      handleReviewAndSubmit();
                      handleMoveToHistory();
                    }}
                    className="review-submit-btn bg-[#1E84AF] p-5 rounded-md duration-200"
                    disabled={!canReview}
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleReviewAndSubmit();
                      handleMoveToHistory();
                    }}
                    className="review-submit-btn bg-[#1E84AF] p-5 rounded-md duration-200"
                    disabled={!canReview}
                  >
                    Review and Submit
                  </button>
                )}
              </>
            )}
            <AnimatePresence>
              {correctionRequest.isOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={correctionVariants}
                  className="mt-4 overflow-hidden w-full"
                >
                  <div className="flex justify-end mb-5">
                    <button
                      onClick={handleCloseCorrectionRequest}
                      className="text-white bg-[#24242D] p-1 rounded-md"
                    >
                      <X size={22} />
                    </button>
                  </div>
                  <textarea
                    value={correctionRequest.text}
                    onChange={(e) =>
                      setCorrectionRequest((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    placeholder="Enter Correction"
                    className="w-full h-32 bg-[#24242D] text-white px-5 py-[14px] rounded-md resize-none focus:outline-none correction-inputs"
                  />
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={handleCorrectionSubmit}
                      className="save-btn duration-200 text-white"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {showApproveModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={modalVariants}
                  className="bg-[#1C1C24] p-6 rounded-lg w-full max-w-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="viewmanuallabels">Select Approver</h2>
                    <button
                      onClick={() => {
                        setShowApproveModal(false);
                        setSelectedUserId("");
                        setApproveError(null);
                      }}
                      className="text-white bg-[#24242D] p-2 rounded-md"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedUserId}
                      onChange={(e) => {
                        setSelectedUserId(e.target.value);
                        setIsDropdownOpen(false);
                      }}
                      onFocus={() => {
                        setIsSelectFocused(true);
                        setIsDropdownOpen(true);
                      }}
                      onBlur={() => {
                        setIsSelectFocused(false);
                        setIsDropdownOpen(false);
                      }}
                      onMouseDown={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="add-qms-manual-inputs mb-4 appearance-none pr-8"
                    >
                      <option value="">Select Approver</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-[28px] text-[#AAAAAA] pointer-events-none transition-transform duration-200"
                      style={{
                        transform: isDropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </div>
                  {approveError && (
                    <p className="text-red-500 text-sm mb-4">{approveError}</p>
                  )}
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setShowApproveModal(false);
                        setSelectedUserId("");
                        setApproveError(null);
                      }}
                      className="cancel-btn duration-200 text-white cursor-pointer !w-[118px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateApprovedBy}
                      className="save-btn duration-200 text-white cursor-pointer !w-[118px]"
                      disabled={!selectedUserId}
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
      <ManualCorrectionSuccessModal
        showSentCorrectionSuccessModal={showSentCorrectionSuccessModal}
        onClose={() => setShowSentCorrectionSuccessModal(false)}
      />
      <ManualCorrectionErrorModal
        showSentCorrectionErrorModal={showSentCorrectionErrorModal}
        onClose={() => setShowSentCorrectionErrorModal(false)}
        error={error}
      />
      <ReviewSubmitSuccessModal
        showSubmitManualSuccessModal={showSubmitManualSuccessModal}
        onClose={() => setShowSubmitManualSuccessModal(false)}
      />
      <ReviewSubmitErrorModal
        showSubmitManualErrorModal={showSubmitManualErrorModal}
        onClose={() => setShowSubmitManualErrorModal(false)}
        error={error}
      />
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
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        successMessage={successMessage}
      />
    </div>
  );
};

export default ViewQmsRecordFormat;
