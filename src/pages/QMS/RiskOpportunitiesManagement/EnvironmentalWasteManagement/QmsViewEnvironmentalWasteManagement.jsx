import React, { useState, useEffect } from 'react';
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
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

const QmsViewEnvironmentalWasteManagement = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [manualDetails, setManualDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [corrections, setCorrections] = useState([]);
    const [highlightedCorrection, setHighlightedCorrection] = useState(null);
    const [historyCorrections, setHistoryCorrections] = useState([]);
    const [usersData, setUsersData] = useState({});

    const [showSentCorrectionSuccessModal, setShowSentCorrectionSuccessModal] = useState(false);
    const [showSentCorrectionErrorModal, setShowSentCorrectionErrorModal] = useState(false);
    const [showSubmitManualSuccessModal, setShowSubmitManualSuccessModal] = useState(false);
    const [showSubmitManualErrorModal, setShowSubmitManualErrorModal] = useState(false);

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

    const fetchManualDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/waste-detail/${id}/`);
            setManualDetails(response.data);
            console.log("Manual Details:", response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching waste management details:", err);
            // setError("Failed to load waste management details");
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

    const fetchManualCorrections = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/waste/${id}/corrections/`);
            const allCorrections = response.data;
            console.log("Fetched Waste Management Corrections:", allCorrections);

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
            console.error("Error fetching waste management corrections:", error);
        }
    };

    useEffect(() => {
        fetchManualDetails();
        fetchManualCorrections();
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
        navigate('/company/qms/list-environmantal-waste-management');
    };

    const handleCorrectionSubmit = async () => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('User not authenticated');
                return;
            }

            const requestData = {
                waste_id: id,
                correction: correctionRequest.text,
                from_user: currentUser.user_id
            };

            console.log('Submitting correction request:', requestData);

            const response = await axios.post(`${BASE_URL}/qms/waste/submit-correction/`, requestData);

            console.log('Correction response:', response.data);

            handleCloseCorrectionRequest();
            setShowSentCorrectionSuccessModal(true);

            const storageKey = `viewed_corrections_${id}_${localStorage.getItem('user_id')}`;
            localStorage.removeItem(storageKey);

            await fetchManualDetails();
            await fetchManualCorrections();

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

    const handleDeleteProcedure = (recordId) => {
        console.log("Delete record with ID:", recordId);
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!manualDetails) return <div className="text-white">No waste management details found</div>;

    const currentUserId = Number(localStorage.getItem('user_id'));
    const isCurrentUserWrittenBy = currentUserId === manualDetails.written_by?.id;

    const canReview = (() => {
        if (isCurrentUserWrittenBy) {
            return true;
        }

        if (manualDetails.status === "Pending for Review/Checking") {
            return currentUserId === manualDetails.checked_by?.id;
        }

        if (manualDetails.status === "Correction Requested") {
            const hasSentCorrections = corrections.some(correction =>
                correction.from_user?.id === currentUserId &&
                !correction.is_addressed
            );

            if (hasSentCorrections) {
                return false;
            }

            return corrections.some(correction => correction.to_user?.id === currentUserId);
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
                alert('User not authenticated');
                return;
            }

            const requestData = {
                waste_id: id,
                current_user_id: currentUser.user_id
            };

            const response = await axios.post(
                `${BASE_URL}/qms/waste-review/`,
                requestData
            );

            setShowSubmitManualSuccessModal(true);
            setTimeout(() => {
                setShowSubmitManualSuccessModal(false);
                navigate("/company/qms/list-environmantal-waste-management");
            }, 1500);
            fetchManualDetails();
            fetchManualCorrections();
        } catch (error) {
            console.error('Error submitting review:', error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to submit review';
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
                <h1 className='viewmanualhead'>Environmental Waste Management Information</h1>

                <ManualCorrectionSuccessModal
                    showSentCorrectionSuccessModal={showSentCorrectionSuccessModal}
                    onClose={() => { setShowSentCorrectionSuccessModal(false) }}
                />

                <ManualCorrectionErrorModal
                    showSentCorrectionErrorModal={showSentCorrectionErrorModal}
                    onClose={() => { setShowSentCorrectionErrorModal(false) }}
                />

                <ReviewSubmitSuccessModal
                    showSubmitManualSuccessModal={showSubmitManualSuccessModal}
                    onClose={() => { setShowSubmitManualSuccessModal(false) }}
                />

                <ReviewSubmitErrorModal
                    showSubmitManualErrorModal={showSubmitManualErrorModal}
                    onClose={() => { setShowSubmitManualErrorModal(false) }}
                />

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
                            <label className="viewmanuallabels">Location/Site Name</label>
                            <p className="viewmanuasdata">{manualDetails.location || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">WMP No</label>
                            <p className="viewmanuasdata">{manualDetails.wmp || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Waste Category</label>
                            <p className="viewmanuasdata">{manualDetails.waste_category || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Waste Handling</label>
                            <p className="viewmanuasdata">{manualDetails.waste_handling || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Originator</label>
                            <p className="viewmanuasdata">{manualDetails.originator || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Waste Type</label>
                            <p className="viewmanuasdata">{manualDetails.waste_type || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Waste Quantity (Daily/Monthly)</label>
                            <p className="viewmanuasdata">{manualDetails.waste_quantity || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-[40px] pl-5">
                        <div>
                            <label className="viewmanuallabels">Written/Prepare By</label>
                            <p className="viewmanuasdata">
                                {manualDetails.written_by
                                    ? `${manualDetails.written_by.first_name} ${manualDetails.written_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Checked/Reviewed By</label>
                            <p className="viewmanuasdata">
                                {manualDetails.checked_by
                                    ? `${manualDetails.checked_by.first_name} ${manualDetails.checked_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Approved By</label>
                            <p className="viewmanuasdata">
                                {manualDetails.approved_by
                                    ? `${manualDetails.approved_by.first_name} ${manualDetails.approved_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Waste Minimization</label>
                            <p className="viewmanuasdata">{manualDetails.waste_minimization || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Responsible Party</label>
                            <p className="viewmanuasdata">{manualDetails.responsible_party || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Applicable Legal Requirement</label>
                            <p className="viewmanuasdata">{manualDetails.legal_requirement || 'N/A'}</p>
                        </div>

                        <div className='flex justify-between items-center'>
                            <div>
                                <label className="viewmanuallabels">Remark</label>
                                <p className="viewmanuasdata">{manualDetails.remark || 'N/A'}</p>
                            </div>
                            {isCurrentUserWrittenBy && (
                                <div className='flex gap-10'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <label className="viewmanuallabels">Edit</label>
                                        <button
                                            onClick={() => {
                                                handleMoveToHistory();
                                                navigate(`/company/qms/edit-environmantal-waste-management/${id}`);
                                            }}
                                        >
                                            <img src={edits} alt="Edit Icon" />
                                        </button>
                                    </div>
                                    <div className='flex flex-col justify-center items-center'>
                                        <label className="viewmanuallabels">Delete</label>
                                        <button
                                            onClick={() => {
                                                handleDeleteProcedure(id);
                                            }}
                                        >
                                            <img src={deletes} alt="Delete Icon" />
                                        </button>
                                    </div>
                                </div>
                            )}
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

export default QmsViewEnvironmentalWasteManagement;