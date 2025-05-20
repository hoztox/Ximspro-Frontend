import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewSignificantEnergy = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        significant: "",
        source_type: "",
        date: "",
        facility: "",
        consumption: "",
        action: "",
        consequences: "",
        impact: "",
        remarks: "",
        revision: "",
        upload_attachment: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const getUserCompanyId = () => {
        const storedCompanyId = localStorage.getItem("company_id");
        if (storedCompanyId) return storedCompanyId;

        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            const userData = localStorage.getItem("user_company_id");
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch (e) {
                    console.error("Error parsing user company ID:", e);
                    return null;
                }
            }
        }
        return null;
    };

    const companyId = getUserCompanyId();

    useEffect(() => {
        fetchSignificantEnergy();
    }, [id]);

    const fetchSignificantEnergy = async () => {
        setIsLoading(true);
        setError("");
        try {
            if (!companyId || !id) {
                setError("Company ID or record ID not found. Please try again.");
                return;
            }
            const response = await axios.get(`${BASE_URL}/qms/significant/${id}/`);
            const data = response.data;
            // Format date as DD-MM-YYYY
            const formattedDate = data.date
                ? new Date(data.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }).split("/").join("-")
                : "";
            setFormData({
                title: data.title || "",
                significant: data.significant || "",
                source_type: data.source_type?.title || data.source_type || "",
                date: formattedDate,
                facility: data.facility || "",
                consumption: data.consumption || "",
                action: data.action || "",
                consequences: data.consequences || "",
                impact: data.impact || "",
                remarks: data.remarks || "",
                revision: data.revision || "",
                upload_attachment: data.upload_attachment || null,
            });
        } catch (error) {
            console.error("Error fetching significant energy:", error);
            let errorMsg = error.message;

            if (error.response) {
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
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
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        navigate("/company/qms/list-significant-energy");
    };

    const handleEdit = () => {
        navigate(`/company/qms/edit-significant-energy/${id}`);
    };

    const openDeleteModal = () => {
        setDeleteMessage("Significant Energy Use");
        setShowDeleteModal(true);
    };

    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
        setShowErrorModal(false);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`${BASE_URL}/qms/significant/${id}/`);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Significant Energy Use Deleted Successfully");
            setTimeout(() => {
                navigate("/company/qms/list-significant-energy");
            }, 2000);
        } catch (error) {
            console.error("Error deleting significant energy:", error);
            let errorMsg = error.message;

            if (error.response) {
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
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
            setShowDeleteModal(false);
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewFile = () => {
        if (formData.upload_attachment) {
            window.open(formData.upload_attachment, "_blank");
        } else {
            setError("No file attached to this record.");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Significant Energy Use Information</h2>
                <button
                    onClick={handleClose}
                    className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                >
                    <X className="text-white" />
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-4 not-found">Loading...</div>
            ) : (
                <div className="p-5 relative">
                    {/* Vertical divider line */}
                    <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Significant Energy Use Name/Title
                            </label>
                            <div className="view-employee-data">{formData.title || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Significant Energy Use Number
                            </label>
                            <div className="view-employee-data">{formData.significant || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Energy Source Type
                            </label>
                            <div className="view-employee-data">{formData.source_type || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Date
                            </label>
                            <div className="view-employee-data">{formData.date || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Attached Document
                            </label>
                            {formData.upload_attachment ? (
                                <button
                                    onClick={handleViewFile}
                                    className="flex gap-2 click-view-file-btn text-[#1E84AF] items-center"
                                >
                                    Click to view file <Eye size={17} />
                                </button>
                            ) : (
                                <div className="view-employee-data">No file attached</div>
                            )}
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Facility/Process/Activity
                            </label>
                            <div className="view-employee-data">{formData.facility || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Average Consumption
                            </label>
                            <div className="view-employee-data">{formData.consumption || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Action Required
                            </label>
                            <div className="view-employee-data">{formData.action || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Potential Consequences of Energy Use
                            </label>
                            <div className="view-employee-data">{formData.consequences || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Impact on Processes/Activity/Cost
                            </label>
                            <div className="view-employee-data">{formData.impact || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Significant Energy Use Remarks
                            </label>
                            <div className="view-employee-data">{formData.remarks || "N/A"}</div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Revision
                                </label>
                                <div className="view-employee-data">{formData.revision || "N/A"}</div>
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
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfimModal
                showDeleteModal={showDeleteModal}
                onConfirm={handleDelete}
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

export default QmsViewSignificantEnergy;