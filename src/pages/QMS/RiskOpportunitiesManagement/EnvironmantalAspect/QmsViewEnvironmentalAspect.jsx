import React, { useState, useEffect } from "react";
import { X, Eye, AlertCircle } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import historys from "../../../../assets/images/Company Documentation/history.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import ManualCorrectionSuccessModal from "./Modals/ManualCorrectionSuccessModal";
import ManualCorrectionErrorModal from "./Modals/ManualCorrectionErrorModal";
import ReviewSubmitSuccessModal from "./Modals/ReviewSubmitSuccessModal";
import ReviewSubmitErrorModal from "./Modals/ReviewSubmitErrorModal";

const QmsViewEnvironmentalAspect = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    aspect_source: "",
    title: "",
    aspect_no: "",
    process_activity: { name: "" },
    legal_requirement: "",
    description: "",
    action: "",
    written_by: null,
    approved_by: null,
    checked_by: null,
    date: "",
    level_of_impact: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [corrections, setCorrections] = useState([]);
  const [highlightedCorrection, setHighlightedCorrection] = useState(null);
  const [historyCorrections, setHistoryCorrections] = useState([]);
  const [showSentCorrectionSuccessModal, setShowSentCorrectionSuccessModal] =
    useState(false);
  const [showSentCorrectionErrorModal, setShowSentCorrectionErrorModal] =
    useState(false);
  const [showSubmitManualSuccessModal, setShowSubmitManualSuccessModal] =
    useState(false);
  const [showSubmitManualErrorModal, setShowSubmitManualErrorModal] =
    useState(false);
  const [correctionRequest, setCorrectionRequest] = useState({
    isOpen: false,
    text: "",
  });

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

  const fetchAspectDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/qms/aspect-detail/${id}/`
      );
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching aspect details:", err);
      setError("Failed to load environmental aspect details");
      setLoading(false);
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

  const fetchAspectCorrections = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/qms/aspect/${id}/corrections/`
      );
      const allCorrections = response.data;
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
      console.error("Error fetching aspect corrections:", error);
    }
  };

  useEffect(() => {
    fetchAspectDetails();
    fetchAspectCorrections();
  }, [id]);

  const getUserName = (user) => {
    if (!user) return "N/A";
    if (typeof user === "object" && user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (typeof user === "string" && user.includes("@")) {
      return user;
    }
    return "N/A";
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

  const handleClose = () => {
    navigate("/company/qms/list-environmantal-aspect");
  };

  const handleCorrectionSubmit = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("User not authenticated");
        return;
      }
      const requestData = {
        aspect_id: id,
        correction: correctionRequest.text,
        from_user: currentUser.user_id,
      };
      await axios.post(
        `${BASE_URL}/qms/aspect/submit-correction/`,
        requestData
      );
      handleCloseCorrectionRequest();
      setShowSentCorrectionSuccessModal(true);
      const storageKey = `viewed_corrections_${id}_${localStorage.getItem(
        "user_id"
      )}`;
      localStorage.removeItem(storageKey);
      await fetchAspectDetails();
      await fetchAspectCorrections();
      setTimeout(() => {
        setShowSentCorrectionSuccessModal(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting correction:", error);
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

  const handleEdit = () => {
    handleMoveToHistory();
    navigate(`/company/qms/edit-environmental-aspect/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/qms/aspect-detail/${id}/`);
      navigate("/company/qms/list-environmental-aspect");
    } catch (error) {
      console.error("Error deleting aspect:", error);
    }
  };

  const currentUserId = Number(localStorage.getItem("user_id"));
  const isCurrentUserWrittenBy =
    formData.written_by && currentUserId === formData.written_by.id;

  const canReview = (() => {
    if (isCurrentUserWrittenBy) {
      return true;
    }
    if (formData.status === "Pending for Review/Checking") {
      return formData.checked_by && currentUserId === formData.checked_by.id;
    }
    if (formData.status === "Correction Requested") {
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
    if (formData.status === "Reviewed,Pending for Approval") {
      return formData.approved_by && currentUserId === formData.approved_by.id;
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
        aspect_id: id,
        current_user_id: currentUser.user_id,
      };
      await axios.post(
        `${BASE_URL}/qms/aspect-review/`,
        requestData
      );
      setShowSubmitManualSuccessModal(true);
      setTimeout(() => {
        setShowSubmitManualSuccessModal(false);
        navigate("/company/qms/list-environmantal-aspect");
      }, 1500);
      fetchAspectDetails();
      fetchAspectCorrections();
    } catch (error) {
      console.error("Error submitting review:", error);
      setShowSubmitManualErrorModal(true);
      setTimeout(() => {
        setShowSubmitManualErrorModal(false);
      }, 3000);
    }
  };

  const correctionVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
      },
    },
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

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!formData)
    return <div className="text-white">No aspect details found</div>;

  return (
    <div className="bg-[#1C1C24] text-white rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-[#383840] pb-5">
        <h2 className="view-employee-head">Environmental Aspect Information</h2>
        <ManualCorrectionSuccessModal
          showSentCorrectionSuccessModal={showSentCorrectionSuccessModal}
          onClose={() => setShowSentCorrectionSuccessModal(false)}
        />
        <ManualCorrectionErrorModal
          showSentCorrectionErrorModal={showSentCorrectionErrorModal}
          onClose={() => setShowSentCorrectionErrorModal(false)}
        />
        <ReviewSubmitSuccessModal
          showSubmitManualSuccessModal={showSubmitManualSuccessModal}
          onClose={() => setShowSubmitManualSuccessModal(false)}
        />
        <ReviewSubmitErrorModal
          showSubmitManualErrorModal={showSubmitManualErrorModal}
          onClose={() => setShowSubmitManualErrorModal(false)}
        />
        <button
          onClick={handleClose}
          className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
        >
          <X className="text-white" />
        </button>
      </div>
      <div className="p-5 relative ">
        <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
          <div>
            <label className="block view-employee-label mb-[6px]">
              Aspect Source
            </label>
            <div className="view-employee-data">
              {formData.aspect_source || "N/A"}
            </div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Aspect Name/Title
            </label>
            <div className="view-employee-data">{formData.title || "N/A"}</div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Aspect No
            </label>
            <div className="view-employee-data">
              {formData.aspect_no || "N/A"}
            </div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Process/Activity
            </label>
            <div className="view-employee-data">
              {formData.process_activity?.title || "N/A"}
            </div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Legal Requirement
            </label>
            <div className="view-employee-data">
              {formData.legal_requirement || "N/A"}
            </div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Description
            </label>
            <div className="view-employee-data">
              {formData.description || "N/A"}
            </div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Action or Corrections
            </label>
            <div className="view-employee-data">{formData.action || "N/A"}</div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Written/Prepared By
            </label>
            <div className="view-employee-data">
              {getUserName(formData.written_by)}
            </div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Approved By
            </label>
            <div className="view-employee-data">
              {getUserName(formData.approved_by)}
            </div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">
              Checked/Reviewed By
            </label>
            <div className="view-employee-data">
              {getUserName(formData.checked_by)}
            </div>
          </div>
          <div>
            <label className="block view-employee-label mb-[6px]">Date</label>
            <div className="view-employee-data">
              {formatDate(formData.date)}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <label className="block view-employee-label mb-[6px]">
                Level of Impact
              </label>
              <div className="view-employee-data">
                {formData.level_of_impact || "N/A"}
              </div>
            </div>
            {isCurrentUserWrittenBy && (
              <div className="flex space-x-10 justify-end">
                <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                  Edit
                  <button onClick={handleEdit}>
                    <img
                      src={edits}
                      alt="Edit Icon"
                      className="w-[18px] h-[18px]"
                    />
                  </button>
                </div>
                <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                  Delete
                  <button onClick={handleDelete}>
                    <img
                      src={deletes}
                      alt="Delete Icon"
                      className="w-[18px] h-[18px]"
                    />
                  </button>
                </div>
              </div>
            )}

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
                {formData.status === "Reviewed,Pending for Approval" ? (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default QmsViewEnvironmentalAspect;
