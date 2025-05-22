import React, { useState, useEffect } from 'react';
import historys from '../../../../assets/images/Company Documentation/history.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import ManualCorrectionSuccessModal from './Modals/ManualCorrectionSuccessModal';
import ManualCorrectionErrorModal from './Modals/ManualCorrectionErrorModal';
import ReviewSubmitSuccessModal from './Modals/ReviewSubmitSuccessModal';
import ReviewSubmitErrorModal from './Modals/ReviewSubmitErrorModal';

const QmsDraftViewHealthSafetyHazards = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [hazardDetails, setHazardDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [corrections, setCorrections] = useState([]);
    const [highlightedCorrection, setHighlightedCorrection] = useState(null);
    const [historyCorrections, setHistoryCorrections] = useState([]);
    const [usersData, setUsersData] = useState({});

    const [showSentCorrectionSuccessModal, setShowSentCorrectionSuccessModal] = useState(false);
    const [showSentCorrectionErrorModal, setShowSentCorrectionErrorModal] = useState(false);
    const [showSubmitHazardSuccessModal, setShowSubmitHazardSuccessModal] = useState(false);
    const [showSubmitHazardErrorModal, setShowSubmitHazardErrorModal] = useState(false);

    const [correctionRequest, setCorrectionRequest] = useState({
        isOpen: false,
        text: ''
    });

    const getCurrentUser = () => {
        const role = localStorage.getItem('role');

        try {
            if (role === 'company') {
                const companyData = {};
                Object.keys(localStorage)
                    .filter(key => key.startsWith('company_'))
                    .forEach(key => {
                        const cleanKey = key.replace('company_', '');
                        try {
                            companyData[cleanKey] = JSON.parse(localStorage.getItem(key));
                        } catch (e) {
                            companyData[cleanKey] = localStorage.getItem(key);
                        }
                    });

                companyData.role = role;
                companyData.company_id = localStorage.getItem('company_id');
                companyData.company_name = localStorage.getItem('company_name');
                companyData.email_address = localStorage.getItem('email_address');

                console.log("Company User Data:", companyData);
                return companyData;
            } else if (role === 'user') {
                const userData = {};
                Object.keys(localStorage)
                    .filter(key => key.startsWith('user_'))
                    .forEach(key => {
                        const cleanKey = key.replace('user_', '');
                        try {
                            userData[cleanKey] = JSON.parse(localStorage.getItem(key));
                        } catch (e) {
                            userData[cleanKey] = localStorage.getItem(key);
                        }
                    });

                userData.role = role;
                userData.user_id = localStorage.getItem('user_id');

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

    const fetchHazardDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/health-detail/${id}/`);
            setHazardDetails(response.data);
            console.log("Hazard Details:", response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching hazard details:", err);
            setError("Failed to load health and safety hazard details");
            setLoading(false);
        }
    };

    const getViewedCorrections = () => {
        const storageKey = `viewed_corrections_${id}_${localStorage.getItem('user_id')}`;
        const viewedCorrections = localStorage.getItem(storageKey);
        return viewedCorrections ? JSON.parse(viewedCorrections) : [];
    };

    const saveViewedCorrection = (correctionId) => {
        const storageKey = `viewed_corrections_${id}_${localStorage.getItem('user_id')}`;
        const viewedCorrections = getViewedCorrections();
        if (!viewedCorrections.includes(correctionId)) {
            viewedCorrections.push(correctionId);
            localStorage.setItem(storageKey, JSON.stringify(viewedCorrections));
        }
    };

    const fetchHazardCorrections = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/health/${id}/corrections/`);
            const allCorrections = response.data;
            console.log("Fetched Hazard Corrections:", allCorrections);

            const viewedCorrections = getViewedCorrections();

            setCorrections(allCorrections);

            const userIds = new Set();
            allCorrections.forEach(correction => {
                if (correction.from_user && typeof correction.from_user === 'number')
                    userIds.add(correction.from_user);
                if (correction.to_user && typeof correction.to_user === 'number')
                    userIds.add(correction.to_user);
            });

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
            console.error("Error fetching hazard corrections:", error);
        }
    };

    useEffect(() => {
        fetchHazardDetails();
        fetchHazardCorrections();
    }, [id]);

    const getUserName = (user) => {
        if (!user) return "N/A";

        if (typeof user === 'object' && user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }

        if (typeof user === 'number' && usersData[user]) {
            return `${usersData[user].first_name} ${usersData[user].last_name}`;
        }

        if (typeof user === 'string' && user.includes('@')) {
            return user;
        }

        if (user === highlightedCorrection?.to_user && highlightedCorrection?.to_user_email) {
            return highlightedCorrection.to_user_email;
        }

        return `User ${user}`;
    };

    const handleCorrectionRequest = () => {
        setCorrectionRequest(prev => ({
            ...prev,
            isOpen: true
        }));
    };

    const handleCloseCorrectionRequest = () => {
        setCorrectionRequest({
            isOpen: false,
            text: ''
        });
    };

    const handleCloseViewPage = () => {
        navigate('/company/qms/draft-health-safety-hazards');
    };

    const handleCorrectionSubmit = async () => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('User not authenticated');
                return;
            }

            const requestData = {
                hazard_id: id,
                correction: correctionRequest.text,
                from_user: currentUser.user_id
            };

            console.log('Submitting correction request:', requestData);

            const response = await axios.post(`${BASE_URL}/qms/health/submit-correction/`, requestData);

            console.log('Correction response:', response.data);

            handleCloseCorrectionRequest();
            setShowSentCorrectionSuccessModal(true);

            const storageKey = `viewed_corrections_${id}_${localStorage.getItem('user_id')}`;
            localStorage.removeItem(storageKey);

            await fetchHazardDetails();
            await fetchHazardCorrections();

            setTimeout(() => {
                setShowSentCorrectionSuccessModal(false);
            }, 1500);

        } catch (error) {
            console.error('Error submitting correction:', error);
            setShowSentCorrectionErrorModal(true);
            setTimeout(() => {
                setShowSentCorrectionErrorModal(false);
            }, 3000);
        }
    };

    const handleMoveToHistory = () => {
        if (highlightedCorrection) {
            saveViewedCorrection(highlightedCorrection.id);
            setHistoryCorrections(prev => [highlightedCorrection, ...prev]);
            setHighlightedCorrection(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '/');
    };

    const formatCorrectionDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHours = String(hours).padStart(2, '0');
        return `${day}-${month}-${year}, ${formattedHours}:${minutes} ${ampm}`;
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!hazardDetails) return <div className="text-white">No hazard details found</div>;

    const currentUserId = Number(localStorage.getItem('user_id'));
    const isCurrentUserWrittenBy = currentUserId === hazardDetails.written_by?.id;

    const canReview = (() => {
        if (isCurrentUserWrittenBy) {
            return false;
        }

        if (hazardDetails.status === "Pending for Review/Checking") {
            return currentUserId === hazardDetails.checked_by?.id;
        }

        if (hazardDetails.status === "Correction Requested") {
            const hasSentCorrections = corrections.some(correction =>
                correction.from_user?.id === currentUserId &&
                !correction.is_addressed
            );

            if (hasSentCorrections) {
                return false;
            }

            return corrections.some(correction => correction.to_user?.id === currentUserId);
        }

        if (hazardDetails.status === "Reviewed,Pending for Approval") {
            return currentUserId === hazardDetails.approved_by?.id;
        }

        return false;
    })();

    const handleReviewAndSubmit = async () => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('User not authenticated');
                return;
            }

            const requestData = {
                record_id: id,
                current_user_id: currentUser.user_id
            };

            const response = await axios.post(
                `${BASE_URL}/qms/health-safety-hazards-review/`,
                requestData
            );

            setShowSubmitHazardSuccessModal(true);
            setTimeout(() => {
                setShowSubmitHazardSuccessModal(false);
                navigate("/company/qms/list-health-safety-hazards");
            }, 1500);
            fetchHazardDetails();
            fetchHazardCorrections();
        } catch (error) {
            console.error('Error submitting review:', error);
            setShowSubmitHazardErrorModal(true);
            setTimeout(() => {
                setShowSubmitHazardErrorModal(false);
            }, 3000);
        }
    };

    const correctionVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3
            }
        },
        visible: {
            opacity: 1,
            height: 'auto',
            transition: {
                duration: 0.3
            }
        }
    };

    const renderHighlightedCorrection = () => {
        if (!highlightedCorrection) return null;

        return (
            <div className="mt-5 bg-[#1F2937] p-4 rounded-md border-l-4 border-[#3B82F6]">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={18} className="text-[#3B82F6]" />
                        <h2 className="text-white font-medium">Latest Correction Request</h2>
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
                    <p className="text-white history-content">{highlightedCorrection.correction}</p>
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
                        className={`bg-[#24242D] p-5 rounded-md mb-5 ${index < historyCorrections.length - 1 ? 'mb-5' : ''}`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="from-to-time text-[#AAAAAA]">
                                From: {getUserName(correction.from_user)}
                            </div>
                            <div className="from-to-time text-[#AAAAAA]">
                                {formatCorrectionDate(correction.created_at)}
                            </div>
                        </div>
                        <p className="text-white history-content">{correction.correction}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#1C1C24] p-5 rounded-lg">
            <div className='flex justify-between items-center border-b border-[#383840] pb-[26px]'>
                <h1 className='viewmanualhead'>Draft Health and Safety Hazard Information</h1>

                <ManualCorrectionSuccessModal
                    showSentCorrectionSuccessModal={showSentCorrectionSuccessModal}
                    onClose={() => { setShowSentCorrectionSuccessModal(false) }}
                />

                <ManualCorrectionErrorModal
                    showSentCorrectionErrorModal={showSentCorrectionErrorModal}
                    onClose={() => { setShowSentCorrectionErrorModal(false) }}
                />

                <ReviewSubmitSuccessModal
                    showSubmitManualSuccessModal={showSubmitHazardSuccessModal}
                    onClose={() => { setShowSubmitHazardSuccessModal(false) }}
                />

                <ReviewSubmitErrorModal
                    showSubmitManualErrorModal={showSubmitHazardErrorModal}
                    onClose={() => { setShowSubmitHazardErrorModal(false) }}
                />

                <button
                    className="text-white bg-[#24242D] p-1 rounded-md"
                    onClick={handleCloseViewPage}
                >
                    <X size={22} />
                </button>
            </div>
            <div className="mt-5">
                <div className="grid grid-cols-2 divide-x divide-[#383840] pb-5">
                    <div className="grid grid-cols-1 gap-[40px]">
                        <div>
                            <label className="viewmanuallabels">Hazard Name/Title</label>
                            <p className="viewmanuasdata">{hazardDetails.title || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Hazard No</label>
                            <p className="viewmanuasdata">{hazardDetails.hazard_no || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Hazard Source</label>
                            <p className="viewmanuasdata">{hazardDetails.hazard_source || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Applicable Legal Requirement</label>
                            <p className="viewmanuasdata">{hazardDetails.legal_requirement || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Hazard Description</label>
                            <p className="viewmanuasdata">{hazardDetails.description || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Action or Corrections</label>
                            <p className="viewmanuasdata">{hazardDetails.action || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-[40px] pl-5">
                        <div>
                            <label className="viewmanuallabels">Written/Prepare By</label>
                            <p className="viewmanuasdata">
                                {hazardDetails.written_by
                                    ? `${hazardDetails.written_by.first_name} ${hazardDetails.written_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Checked/Reviewed By</label>
                            <p className="viewmanuasdata">
                                {hazardDetails.checked_by
                                    ? `${hazardDetails.checked_by.first_name} ${hazardDetails.checked_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Approved By</label>
                            <p className="viewmanuasdata">
                                {hazardDetails.approved_by
                                    ? `${hazardDetails.approved_by.first_name} ${hazardDetails.approved_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Date Entered</label>
                            <p className="viewmanuasdata">{formatDate(hazardDetails.date)}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Level of Risk</label>
                            <p className="viewmanuasdata">{hazardDetails.level_of_risk || 'N/A'}</p> 
                        </div>
                        <div>
                            <label className="viewmanuallabels">Related Process/ Activity</label>
                            <p className="viewmanuasdata">{hazardDetails.process_activity?.title || 'N/A'}</p>
                        </div>
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
                                    <div className='flex justify-end mb-5'>
                                        <button
                                            onClick={handleCloseCorrectionRequest}
                                            className="text-white bg-[#24242D] p-1 rounded-md"
                                        >
                                            <X size={22} />
                                        </button>
                                    </div>

                                    <textarea
                                        value={correctionRequest.text}
                                        onChange={(e) => setCorrectionRequest(prev => ({
                                            ...prev,
                                            text: e.target.value
                                        }))}
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
export default QmsDraftViewHealthSafetyHazards
