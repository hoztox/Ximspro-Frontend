import React, { useState, useEffect } from 'react';
import edits from "../../../../assets/images/Company Documentation/edit.svg"
import deletes from "../../../../assets/images/Company Documentation/delete.svg"
import { motion, AnimatePresence } from 'framer-motion';
import "./viewqmsmanual.css"
import { X, Eye, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const ViewQmsManual = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [manualDetails, setManualDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [corrections, setCorrections] = useState([]);

    const [correctionRequest, setCorrectionRequest] = useState({
        isOpen: false,
        text: ''
    });

    const getCurrentUser = () => {
        const role = localStorage.getItem('role');

        try {
            if (role === 'company') {
                // Retrieve company user data
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

                // Add additional fields from localStorage
                companyData.role = role;
                companyData.company_id = localStorage.getItem('company_id');
                companyData.company_name = localStorage.getItem('company_name');
                companyData.email_address = localStorage.getItem('email_address');

                console.log("Company User Data:", companyData);
                return companyData;
            } else if (role === 'user') {
                // Retrieve regular user data
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

                // Add additional fields from localStorage
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
            // Try to get company ID for user
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

    // Fetch manual details
    const fetchManualDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/manual-detail/${id}/`);
            setManualDetails(response.data);
            console.log("Manual Details:", response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching manual details:", err);
            setError("Failed to load manual details");
            setLoading(false);
        }
    };
    const fetchManualCorrections = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/manuals/${id}/corrections/`);
            setCorrections(response.data);
            console.log("Fetched Manual Corrections:", response.data);
        } catch (error) {
            console.error("Error fetching manual corrections:", error);
        }
    };
    useEffect(() => {
        fetchManualDetails();
        fetchManualCorrections()
    }, [id]);

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
        navigate('/company/qms/manual')
    }

    const handleCorrectionSubmit = async () => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
               alert('User not authenticated');
                return;
            }
    
            const requestData = {
                manual_id: id,
                correction: correctionRequest.text,
                from_user: currentUser.user_id
                
            };
    
            console.log('Submitting correction request:', requestData);
    
            const response = await axios.post(`${BASE_URL}/qms/submit-correction/`, requestData);
    
            console.log('Correction response:', response.data);
    
            alert('Correction submitted successfully');
            handleCloseCorrectionRequest();
    
            // Refresh data
            fetchManualDetails();
            fetchManualCorrections();
        } catch (error) {
            console.error('Error submitting correction:', error);
            alert(error.response?.data?.error || 'Failed to submit correction');
        }
    };

    // Format date from ISO to DD-MM-YYYY
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    // Format date to display how long ago the correction was made
    const formatCorrectionDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

    // Render loading or error states
    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!manualDetails) return <div className="text-white">No manual details found</div>;

    // Check if current user can review
    const currentUserId = Number(localStorage.getItem('user_id'));
    const isCurrentUserWrittenBy = currentUserId === manualDetails.written_by?.id;

    const canReview = (() => {
        // Exclude the written_by user from requesting corrections
        // if (isCurrentUserWrittenBy) {
        //     return false;
        // }

        if (manualDetails.status === "Pending for Review/Checking") {
            return currentUserId === manualDetails.checked_by?.id;
        }

        if (manualDetails.status === "Correction Requested") {
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
                manual_id: id,
                current_user_id: currentUser.user_id
            };
    
            const response = await axios.post(
                `${BASE_URL}/qms/manual-review/`,
                requestData
            );
    
            alert(response.data.message);
            fetchManualDetails();
            fetchManualCorrections();
        } catch (error) {
            console.error('Error submitting review:', error);
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to submit review';
            alert(errorMessage);
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

    // Render corrections specific to the current user
    const renderUserCorrections = () => {
        const userSpecificCorrections = corrections.filter(
            correction => correction.to_user?.id === currentUserId
        );

        if (userSpecificCorrections.length === 0) return null;

        return (
            <div className="mt-5 bg-[#24242D] p-4 rounded-md">
                <div className="flex items-center text-[#FFA500] mb-3">
                    <AlertCircle className="mr-2" />
                    <h2 className="text-lg font-semibold">Correction Requests</h2>
                </div>
                {userSpecificCorrections.map((correction, index) => (
                    <div 
                        key={correction.id} 
                        className={`bg-[#383840] p-3 rounded-md mb-3 ${index < userSpecificCorrections.length - 1 ? 'mb-3' : ''}`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-gray-400">
                                From: {correction.from_user?.first_name} {correction.from_user?.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatCorrectionDate(correction.created_at)}
                            </div>
                        </div>
                        <p className="text-white">{correction.correction}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#1C1C24] p-5 rounded-lg">
            <div className='flex justify-between items-center border-b border-[#383840] pb-[26px]'>
                <h1 className='viewmanualhead'>Review Manual Section</h1>
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
                            <label className="viewmanuallabels">Section Name/Title</label>
                            <div className="flex justify-between items-center">
                                <p className="viewmanuasdata">{manualDetails.title || 'N/A'}</p>
                            </div>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Section Number</label>
                            <p className="viewmanuasdata">{manualDetails.no || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Revision</label>
                            <p className="viewmanuasdata">{manualDetails.rivision || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Document Type</label>
                            <p className="viewmanuasdata">{manualDetails.document_type || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Document</label>
                            <div
                                className='flex items-center cursor-pointer gap-[8px]'
                                onClick={() => {
                                    if (manualDetails.upload_attachment) {
                                        window.open(manualDetails.upload_attachment, '_blank');
                                    }
                                }}
                            >
                                <p className="click-view-file-text">
                                    {manualDetails.upload_attachment ? 'Click to view file' : 'No file attached'}
                                </p>
                                {manualDetails.upload_attachment && (
                                    <Eye size={20} className='text-[#1E84AF]' />
                                )}
                            </div>
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
                            <label className="viewmanuallabels">Checked By</label>
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
                            <label className="viewmanuallabels">Date</label>
                            <p className="viewmanuasdata">{formatDate(manualDetails.date)}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div>
                                <label className="viewmanuallabels">Review Frequency</label>
                                <p className="viewmanuasdata">
                                    {manualDetails.review_frequency_year
                                        ? `${manualDetails.review_frequency_year} years, ${manualDetails.review_frequency_month || 0} months`
                                        : 'N/A'}
                                </p>
                            </div>
                            {isCurrentUserWrittenBy && (
                                <div className='flex gap-10'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <label className="viewmanuallabels">Edit</label>
                                        <button onClick={() => navigate(`/company/qms/editmanual/${id}`)}>
                                            <img src={edits} alt="Edit Icon" />
                                        </button>
                                    </div>
                                    <div className='flex flex-col justify-center items-center'>
                                        <label className="viewmanuallabels">Delete</label>
                                        <button>
                                            <img src={deletes} alt="Delete Icon" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Render user-specific corrections */}
                {renderUserCorrections()}

                {canReview && (
                    <div className="flex justify-between mt-5">
                        {!correctionRequest.isOpen && (
                            <>
                                <button
                                    onClick={handleCorrectionRequest}
                                    className="request-correction-btn duration-200"
                                    
                                >
                                    Request For Correction
                                </button>
                                <button
                                    onClick={handleReviewAndSubmit}
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

export default ViewQmsManual;