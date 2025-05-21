import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewComplaints = () => {
    const [complaint, setComplaint] = useState({
        customer: [],
        category: '',
        details: "",
        immediate_action: "",
        executor: '',
        date: "",
        corrective_action_need: "",
        solved_after_action: "",
        no_car: '',
        upload_attachment: null
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/complaints/${id}/`);
                console.log('view complaint:', response.data);

                setComplaint(response.data);
                setLoading(false);
            } catch (err) {
                let errorMsg = err.message;

                if (err.response) {
                    if (err.response.data.date) {
                        errorMsg = err.response.data.date[0];
                    }
                    else if (err.response.data.detail) {
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
                setLoading(false);
            }
        };

        if (id) {
            fetchComplaint();
        }
    }, [id]);

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

    const handleClose = () => {
        navigate("/company/qms/list-complaints");
    };

    const handleEdit = () => {
        navigate(`/company/qms/edit-complaints/${id}`);
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setDeleteMessage('Complaint');
    };

    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/qms/complaints/${id}/`);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Complaint deleted successfully");
            setTimeout(() => {
                navigate("/company/qms/list-complaints");
            }, 2000);
        } catch (err) {
            console.error("Error deleting complaint:", err);
            let errorMsg = err.message;

            if (err.response) {
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                else if (err.response.data.detail) {
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

    const handleViewAttachment = () => {
        if (complaint.upload_attachment) {
            window.open(complaint.upload_attachment, "_blank");
        } else {
            setError("No attachment available");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    if (loading) return <div className="text-white text-center p-5">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-5">{error}</div>;

    return (
        <>
            <div className="bg-[#1C1C24] text-white rounded-lg p-5">
                <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                    <h2 className="view-employee-head">Complaints and Feedbacks Information</h2>
                    <button
                        onClick={handleClose}
                        className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                    >
                        <X className="text-white" />
                    </button>
                </div>

                <div className="p-5 relative">
                    {/* Vertical divider line */}
                    <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Customer
                            </label>
                            <div className="view-employee-data">
                                {complaint.customer && typeof complaint.customer === 'object'
                                    ? complaint.customer.name || "N/A"
                                    : "N/A"}
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Category
                            </label>
                            <div className="view-employee-data text-white">
                                {complaint.category && Array.isArray(complaint.category) && complaint.category.length > 0 ? (
                                    <ol className="list-decimal pl-5 space-y-1">
                                        {complaint.category.map((cat, index) => (
                                            <li key={index}>
                                                {cat.title || "N/A"}
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    "N/A"
                                )}
                            </div>

                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Details
                            </label>
                            <div className="view-employee-data">{complaint.details || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Immediate Action
                            </label>
                            <div className="view-employee-data">{complaint.immediate_action || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Executor
                            </label>
                            <div className="view-employee-data">
                                {complaint.executor && typeof complaint.executor === 'object'
                                    ? `${complaint.executor.first_name || ''} ${complaint.executor.last_name || ''}`.trim() || "N/A"
                                    : "N/A"}
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Date
                            </label>
                            <div className="view-employee-data">
                                {formatDate(complaint.date || "N/A")}
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Solved After Action?
                            </label>
                            <div className="view-employee-data">{complaint.solved_after_action || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Corrective Action Needed?
                            </label>
                            <div className="view-employee-data">{complaint.corrective_action_need || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                CAR Number
                            </label>
                            <div className="view-employee-data">
                                {complaint.no_car && typeof complaint.no_car === 'object'
                                    ? complaint.no_car.action_no || "N/A"
                                    : "N/A"}
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Corrections
                            </label>
                            <div className="view-employee-data">{complaint.corrections || "N/A"}</div>
                        </div>

                        <div className="flex justify-between">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Document
                                </label>
                                {complaint.upload_attachment ? (
                                    <button
                                        onClick={handleViewAttachment}
                                        className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn"
                                    >
                                        Click to view file <Eye size={18} />
                                    </button>
                                ) : (
                                    <div className="view-employee-data">No attachment</div>
                                )}
                            </div>
                        </div>

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
                                <button onClick={openDeleteModal}>
                                    <img
                                        src={deletes}
                                        alt="Delete Icon"
                                        className="w-[18px] h-[18px]"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfimModal
                showDeleteModal={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={closeAllModals}
                deleteMessage={deleteMessage}
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
        </>
    );
};

export default QmsViewComplaints;