import React, { useState, useEffect } from 'react';
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import historys from "../../../../assets/images/Company Documentation/history.svg";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// Import axios but we'll use demo data instead
import axios from 'axios';
// import { BASE_URL } from "../../../../Utils/Config";

const ViewQmsRecordFormat = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false); // Set to false since we're using demo data
    const [error, setError] = useState(null);

    // Demo data for Record Format details
    const [recordFormatDetails, setRecordFormatDetails] = useState({
        id: 1,
        title: "Quality Management Process",
        no: "QMS-001",
        rivision: "1.0",
        document_type: "Procedure",
        upload_attachment: "https://example.com/document.pdf",
        written_by: {
            id: 1,
            first_name: "John",
            last_name: "Doe"
        },
        checked_by: {
            id: 2,
            first_name: "Jane",
            last_name: "Smith"
        },
        approved_by: {
            id: 3,
            first_name: "Robert",
            last_name: "Johnson"
        },
        date: "2025-04-01T00:00:00Z",
        review_frequency_year: 1,
        review_frequency_month: 6,
        status: "Pending for Review/Checking",
        retention_period: "abc"
    });

    // Demo data for corrections
    const [corrections, setCorrections] = useState([
        {
            id: 1,
            recordFormat_id: 1,
            correction: "Please revise section 3.2 to include updated ISO standards reference.",
            from_user: {
                id: 2,
                first_name: "Jane",
                last_name: "Smith"
            },
            to_user: {
                id: 1,
                first_name: "John",
                last_name: "Doe"
            },
            created_at: "2025-04-04T09:30:00Z"
        },
        {
            id: 2,
            recordFormat_id: 1,
            correction: "Update the process flow diagram to match our current practices.",
            from_user: {
                id: 3,
                first_name: "Robert",
                last_name: "Johnson"
            },
            to_user: {
                id: 1,
                first_name: "John",
                last_name: "Doe"
            },
            created_at: "2025-04-05T10:15:00Z"
        }
    ]);

    // Demo data for correction history messages
    const [messages, setMessages] = useState([
        {
            id: 1,
            from: 'Jane Smith',
            to: 'John Doe',
            content: 'Please update the document to include the latest regulatory requirements from ISO 9001:2024.',
            timestamp: '05-04-2025, 10:15 am'
        },
        {
            id: 2,
            from: 'Robert Johnson',
            to: 'John Doe',
            content: 'The risk assessment section needs more detail on mitigation strategies.',
            timestamp: '04-04-2025, 02:30 pm'
        },
        {
            id: 3,
            from: 'John Doe',
            to: 'Jane Smith',
            content: 'I have updated the document with the requested changes to ISO references.',
            timestamp: '05-04-2025, 04:45 pm'
        },
        {
            id: 4,
            from: 'Sarah Williams',
            to: 'John Doe',
            content: 'The approval workflow needs to be updated to reflect the new organizational structure.',
            timestamp: '03-04-2025, 11:20 am'
        },
    ]);

    /**
     * Function to fetch message history (commented out as we're using demo data)
     */
    const fetchMessages = () => {
        // In a real application, you would fetch data here
        console.log('Fetching messages...');
        // Actual implementation would be:
        // const response = await axios.get(`${BASE_URL}/qms/recordFormat-messages/${id}/`);
        // setMessages(response.data);
    };

    /**
     * Function to reload message history
     */
    const reloadHistory = () => {
        fetchMessages();
        console.log('History reloaded');
    };

    // State for correction request modal
    const [correctionRequest, setCorrectionRequest] = useState({
        isOpen: false,
        text: ''
    });

    /**
     * Function to get current user data from localStorage
     * @returns {Object} User data object
     */
    const getCurrentUser = () => {
        // For demo purposes, we'll return a mock user
        return {
            user_id: 2,
            first_name: "Jane",
            last_name: "Smith",
            role: "user",
            email: "jane.smith@example.com"
        };

        // Original function commented below:
        /*
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
        */
    };

    /**
     * Function to get user's company ID
     * @returns {string|null} Company ID
     */
    const getUserCompanyId = () => {
        // For demo purposes, return a mock company ID
        return "COMP-001";

        // Original function commented below:
        /*
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
        */
    };

    /**
     * Function to fetch recordFormat details from API (commented out as we're using demo data)
     */
    const fetchProcedureDetails = async () => {
        console.log('Fetching Record Format details...');
        // Original implementation commented below:
        /*
        try {
            const response = await axios.get(`${BASE_URL}/qms/recordFormat-detail/${id}/`);
            setProcedureDetails(response.data);
            console.log("Procedure Details:", response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching Record Format details:", err);
            setLoading(false);
        }
        */
    };

    /**
     * Function to fetch Record Format corrections from API (commented out as we're using demo data)
     */
    const fetchProcedureCorrections = async () => {
        console.log('Fetching Record Format corrections...');
        // Original implementation commented below:
        /*
        try {
            const response = await axios.get(`${BASE_URL}/qms/recordFormat/${id}/corrections/`);
            setCorrections(response.data);
            console.log("Fetched Procedure Corrections:", response.data);
        } catch (error) {
            console.error("Error fetching Procedure corrections:", error);
        }
        */
    };

    // Load demo data on component mount
    useEffect(() => {
        // Setting a brief timeout to simulate API call
        setTimeout(() => {
            console.log("Demo data loaded");
            setLoading(false);
        }, 500);

        // Original API calls commented out:
        // fetchProcedureDetails();
        // fetchProcedureCorrections();
    }, [id]);

    /**
     * Function to open correction request modal
     */
    const handleCorrectionRequest = () => {
        setCorrectionRequest(prev => ({
            ...prev,
            isOpen: true
        }));
    };

    /**
     * Function to close correction request modal
     */
    const handleCloseCorrectionRequest = () => {
        setCorrectionRequest({
            isOpen: false,
            text: ''
        });
    };

    /**
     * Function to navigate back to recordFormat list
     */
    const handleCloseViewPage = () => {
        navigate('/company/qms/record-format');
    };

    /**
     * Function to submit correction request (simulated for demo)
     */
    const handleCorrectionSubmit = async () => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('User not authenticated');
                return;
            }

            // Log the request data that would be sent
            const requestData = {
                recordFormat_id: id,
                correction: correctionRequest.text,
                from_user: currentUser.user_id
            };

            console.log('Submitting correction request:', requestData);

            // Simulate successful API response
            setTimeout(() => {
                // Add the new correction to our demo data
                const newCorrection = {
                    id: corrections.length + 1,
                    recordFormat_id: parseInt(id),
                    correction: correctionRequest.text,
                    from_user: {
                        id: currentUser.user_id,
                        first_name: currentUser.first_name,
                        last_name: currentUser.last_name
                    },
                    to_user: recordFormatDetails.written_by,
                    created_at: new Date().toISOString()
                };

                setCorrections([...corrections, newCorrection]);

                // Add to messages history
                const newMessage = {
                    id: messages.length + 1,
                    from: `${currentUser.first_name} ${currentUser.last_name}`,
                    to: `${recordFormatDetails.written_by.first_name} ${recordFormatDetails.written_by.last_name}`,
                    content: correctionRequest.text,
                    timestamp: new Date().toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).replace(/\//g, '-').replace(',', '')
                };

                setMessages([newMessage, ...messages]);

                alert('Correction submitted successfully');
                handleCloseCorrectionRequest();
            }, 500);

            // Original API call commented out:
            /*
            const response = await axios.post(`${BASE_URL}/qms/submit-correction/`, requestData);
            console.log('Correction response:', response.data);
            alert('Correction submitted successfully');
            handleCloseCorrectionRequest();
            fetchProcedureDetails();
            fetchProcedureCorrections();
            */
        } catch (error) {
            console.error('Error submitting correction:', error);
            alert('Failed to submit correction');
        }
    };

    /**
     * Function to format ISO date to DD-MM-YYYY
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date string
     */
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    /**
     * Function to format date to "X time ago" format
     * @param {string} dateString - ISO date string
     * @returns {string} Relative time string
     */
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

    // Show loading state
    if (loading) return <div className="text-white">Loading...</div>;
    // Show error state
    if (error) return <div className="text-red-500">{error}</div>;

    // Demo user ID for testing
    const currentUserId = 2; // Jane Smith (checkUser)
    // const currentUserId = Number(localStorage.getItem('user_id'));

    // Check if current user is the author
    const isCurrentUserWrittenBy = currentUserId === recordFormatDetails.written_by?.id;

    /**
     * Determine if current user can review the Record Format
     * @returns {boolean} Whether current user can review
     */
    const canReview = (() => {
        // For demo purposes - assume user with ID 2 can review
        if (currentUserId === 2) {
            return true;
        }

        // Original logic commented below:
        /*
        // Exclude the written_by user from requesting corrections
        if (isCurrentUserWrittenBy) {
            return false;
        }
 
        if (recordFormatDetails.status === "Pending for Review/Checking") {
            return currentUserId === recordFormatDetails.checked_by?.id;
        }
 
        if (recordFormatDetails.status === "Correction Requested") {
            return corrections.some(correction => correction.to_user?.id === currentUserId);
        }
 
        if (recordFormatDetails.status === "Reviewed,Pending for Approval") {
            return currentUserId === recordFormatDetails.approved_by?.id;
        }
 
        return false;
        */
    })();

    /**
     * Function to submit review (simulated for demo)
     */
    const handleReviewAndSubmit = async () => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('User not authenticated');
                return;
            }

            // Log what would be sent to API
            const requestData = {
                recordFormat_id: id,
                current_user_id: currentUser.user_id
            };

            console.log('Submitting review:', requestData);

            // Simulate successful API response
            setTimeout(() => {
                // Update Record Format status
                setRecordFormatDetails({
                    ...recordFormatDetails,
                    status: "Reviewed,Pending for Approval"
                });

                alert('Procedure reviewed successfully');
            }, 500);

            // Original API call commented out:
            /*
            const response = await axios.post(
                `${BASE_URL}/qms/recordFormat-review/`,
                requestData
            );
 
            alert(response.data.message);
            fetchProcedureDetails();
            fetchProcedureCorrections();
            */
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    };

    // Animation variants for correction request panel
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

    /**
     * Function to render corrections specific to current user
     * @returns {JSX.Element|null} User-specific corrections or null
     */
    const renderUserCorrections = () => {
        // For demo - filter corrections for current user
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
                <h1 className='viewmanualhead'>Record Formats Information</h1>
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
                                <p className="viewmanuasdata">{recordFormatDetails.title || 'N/A'}</p>
                            </div>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Record Number</label>
                            <p className="viewmanuasdata">{recordFormatDetails.no || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Revision</label>
                            <p className="viewmanuasdata">{recordFormatDetails.rivision || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Document Type</label>
                            <p className="viewmanuasdata">{recordFormatDetails.document_type || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Document</label>
                            <div
                                className='flex items-center cursor-pointer gap-[8px]'
                                onClick={() => {
                                    if (recordFormatDetails.upload_attachment) {
                                        window.open(recordFormatDetails.upload_attachment, '_blank');
                                    }
                                }}
                            >
                                <p className="click-view-file-text">
                                    {recordFormatDetails.upload_attachment ? 'Click to view file' : 'No file attached'}
                                </p>
                                {recordFormatDetails.upload_attachment && (
                                    <Eye size={20} className='text-[#1E84AF]' />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Retention Period</label>
                            <p className="viewmanuasdata">{recordFormatDetails.retention_period || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-[40px] pl-5">
                        <div>
                            <label className="viewmanuallabels">Written/Prepare By</label>
                            <p className="viewmanuasdata">
                                {recordFormatDetails.written_by
                                    ? `${recordFormatDetails.written_by.first_name} ${recordFormatDetails.written_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Checked/Reviewed By</label>
                            <p className="viewmanuasdata">
                                {recordFormatDetails.checked_by
                                    ? `${recordFormatDetails.checked_by.first_name} ${recordFormatDetails.checked_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Approved By</label>
                            <p className="viewmanuasdata">
                                {recordFormatDetails.approved_by
                                    ? `${recordFormatDetails.approved_by.first_name} ${recordFormatDetails.approved_by.last_name}`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Date</label>
                            <p className="viewmanuasdata">{formatDate(recordFormatDetails.date)}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div>
                                <label className="viewmanuallabels">Review Frequency</label>
                                <p className="viewmanuasdata">
                                    {recordFormatDetails.review_frequency_year
                                        ? `${recordFormatDetails.review_frequency_year} years, ${recordFormatDetails.review_frequency_month || 0} months`
                                        : 'N/A'}
                                </p>
                            </div>
                            {/* {isCurrentUserWrittenBy && ( */}
                            <div className='flex gap-10'>
                                <div className='flex flex-col justify-center items-center'>
                                    <label className="viewmanuallabels">Edit</label>
                                    <button onClick={() => navigate(`/company/qms/editrecordformat`)}>
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
                            {/* )} */}

                        </div>
                        <div className='h-[51.5px]'></div>
                    </div>
                </div>

                {/* Render user-specific corrections */}
                {renderUserCorrections()}

                {canReview && (
                    <div className="flex flex-wrap justify-between mt-5">
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
            <div className="bg-[#24242D] text-white p-5 rounded-md w-full mt-5 max-h-[380px] flex flex-col">
                <div className="flex justify-start items-center gap-[6px] mb-6">
                    <h1 className="history-head">Correction History</h1>
                    <img src={historys} alt="History Icon" />
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className="bg-[#1C1C24] px-4 py-5 rounded-md">
                                <div className="flex justify-between text-[#AAAAAA] from-to-time mb-2">
                                    <div>From: {message.from}, To: {message.to}</div>
                                    <div>{message.timestamp}</div>
                                </div>
                                <div className="text-white history-content">{message.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewQmsRecordFormat
