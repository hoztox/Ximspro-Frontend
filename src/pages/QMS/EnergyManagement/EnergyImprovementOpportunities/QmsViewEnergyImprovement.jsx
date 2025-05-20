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

const QmsViewEnergyImprovement = () => {
    const [formData, setFormData] = useState({
        eio: "", 
        eio_title: "",
        target: "",
        associated_objective: "",
        results: "",
        date: "",
        responsible: null,
        status: "",
        upload_attachment: null,
        is_draft: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    // Delete modal states
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

    const fetchImprovement = async () => {
        if (!companyId || !id) {
            setError("Invalid company or improvement ID.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const response = await axios.get(`${BASE_URL}/qms/energy-improvements/${id}/`, {
                params: { company_id: companyId },
            });
            const data = response.data;
            setFormData({
                eio: data.eio || "",
                eio_title: data.eio_title || "",
                target: data.target || "",
                associated_objective: data.associated_objective || "",
                results: data.results || "",
                date: data.date || "",
                responsible: data.responsible || null,
                status: data.status || "",
                upload_attachment: data.upload_attachment || null,
                is_draft: data.is_draft || false,
            });
            console.log('eeeeeee', response.data);
            
        } catch (error) {
            console.error("Error fetching improvement:", error);
            setError("Failed to load energy improvement details. Please try again.");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImprovement();
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/list-energy-improvement-opportunities");
    };

    const handleEdit = (id) => {
        navigate(`/company/qms/edit-energy-improvement-opportunities/${id}`);
    };

    // Open delete confirmation modal
    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setDeleteMessage('Energy Improvement Opportunity');
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
            await axios.delete(`${BASE_URL}/qms/energy-improvements/${id}/`);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Energy Improvement Opportunity Deleted Successfully");
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate("/company/qms/list-energy-improvement-opportunities");
            }, 3000);
        } catch (error) {
            console.error("Error deleting improvement:", error);
            setShowDeleteModal(false);
            setShowErrorModal(true);
            
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
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).split("/").join("-");
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">
                    Energy Improvement Opportunities Information {formData.is_draft ? "(Draft)" : ""}
                </h2>
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
                                EIO Number
                            </label>
                            <div className="view-employee-data">{formData.eio || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                EIO Title
                            </label>
                            <div className="view-employee-data">{formData.eio_title || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Target
                            </label>
                            <div className="view-employee-data">{formData.target || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Associated Objective
                            </label>
                            <div className="view-employee-data">{formData.associated_objective || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Results
                            </label>
                            <div className="view-employee-data">{formData.results || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Target Date
                            </label>
                            <div className="view-employee-data">{formatDate(formData.date)}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Responsible
                            </label>
                            <div className="view-employee-data">
                                {formData.responsible
                                    ? `${formData.responsible.first_name} ${formData.responsible.last_name || "N/A"}`
                                    : "-"}
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{formData.status || "N/A"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Attached Document
                            </label>
                            {formData.upload_attachment ? (
                                <a
                                    href={formData.upload_attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 click-view-file-btn text-[#1E84AF] items-center"
                                >
                                    Click to view file <Eye size={17} />
                                </a>
                            ) : (
                                <div className="view-employee-data">N/A</div>
                            )}
                        </div>

                        <div className="flex space-x-10 justify-end">
                            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                                Edit
                                <button onClick={()=>handleEdit(id)}>
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
            )}

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
        </div>
    );
};

export default QmsViewEnergyImprovement;