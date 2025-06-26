import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";
import DeleteConfimModal from "../../../../components/Modals/DeleteConfimModal";
import SuccessModal from "../../../../components/Modals/SuccessModal";
import ErrorModal from "../../../../components/Modals/ErrorModal";

const QmsViewHealthSafetyIncidents = () => {
    const [formData, setFormData] = useState({
        source: "",
        title: "",
        ncr_no: "",
        root_cause: "",
        executor: "",
        description: "",
        resolution_details: "",
        date_raised: "",
        date_completed: "",
        remarks: "",
        status: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchNcrNumber = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/qms/safety_incidents/${id}/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setFormData(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load data");
                setLoading(false);
                console.error("Error fetching ncr number data:", err);
            }
        };

        if (id) {
            fetchNcrNumber();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/list-health-safety-incidents");
    };

    const handleEdit = (id) => {
        navigate(`/company/qms/edit-health-safety-incidents/${id}`);
    };

    // Open delete confirmation modal
    const openDeleteModal = () => {
        setDeleteMessage("Health and Safety Incident");
        setShowDeleteModal(true);
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
        setShowErrorModal(false);
    };

    // Handle delete confirmation
    const confirmDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/qms/safety_incidents/${id}/`);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Health and Safety Incident Deleted Successfully");

            // Redirect after a short delay to show success message
            setTimeout(() => {
                navigate("/company/qms/list-health-safety-incidents");
            }, 1500);
        } catch (err) {
            console.error("Error deleting incident:", err);
            setShowErrorModal(true);
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
            setShowDeleteModal(false);
        }
    };

    if (error) return (
        <div className="bg-[#1C1C24] text-white p-8 rounded-lg">
            <p className="text-red-500">{error}</p>
            <button
                className="mt-4 bg-blue-600 px-4 py-2 rounded-md"
                onClick={() => navigate("/company/qms/list-correction-actions")}
            >
                Back to List
            </button>
        </div>
    );

    // Format dates for display
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

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Health and Safety Incidents Information</h2>
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
                            Source
                        </label>
                        <div className="view-employee-data">{formData.source || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Incident Title
                        </label>
                        <div className="view-employee-data">{formData.title || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Incident No
                        </label>
                        <div className="view-employee-data">{formData.incident_no || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Status
                        </label>
                        <div className="view-employee-data">{formData.status || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Root Cause
                        </label>
                        <div className="view-employee-data">
                            {formData.root_cause?.title}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Report By
                        </label>
                        <div className="view-employee-data">
                            {formData.reported_by?.first_name} {formData.reported_by?.last_name}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Incident Description
                        </label>
                        <div className="view-employee-data">{formData.description || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action or Corrections
                        </label>
                        <div className="view-employee-data">{formData.action || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date Raised
                        </label>
                        <div className="view-employee-data">{formatDate(formData.date_raised)}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Complete By
                        </label>
                        <div className="view-employee-data">{formatDate(formData.date_completed)}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Remarks
                        </label>
                        <div className="view-employee-data">{formData.remarks}</div>
                    </div>

                    <div className="flex space-x-10 justify-end">
                        <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                            Edit
                            <button onClick={() => handleEdit(id)}>
                                <img src={edits} alt="Edit Icon" />
                            </button>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                            Delete
                            <button onClick={openDeleteModal}>
                                <img src={deletes} alt="Delete Icon" />
                            </button>
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
                onClose={closeAllModals}
                successMessage={successMessage}
            />

            {/* Error Modal */}
            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={closeAllModals}
                error={error}
            />
        </div>
    );
};
export default QmsViewHealthSafetyIncidents;