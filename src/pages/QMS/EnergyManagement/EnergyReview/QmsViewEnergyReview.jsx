import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewEnergyReview = () => {
    const [formData, setFormData] = useState({
        energy_name: "",
        review_no: "",
        review_type: "",
        date: "",
        upload_attachment: null,
        relate_business_process: "",
        remarks: "",
        relate_document_process: "",
        revision: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

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
        fetchEnergyReview();
    }, [id]);

    const fetchEnergyReview = async () => {
        setLoading(true);
        setError("");
        try {
            if (!companyId) {
                setError("Company ID not found. Please log in again.");
                return;
            }
            if (!id) {
                setError("Energy review ID not provided.");
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/energy-review/${id}/`);
            const data = response.data;

            setFormData({
                energy_name: data.energy_name || "",
                review_no: data.review_no || "",
                review_type: data.review_type?.name || data.review_type || "",
                date: data.date || "",
                upload_attachment: data.upload_attachment || null,
                relate_business_process: data.relate_business_process || "",
                remarks: data.remarks || "",
                relate_document_process: data.relate_document_process || "",
                revision: data.revision || ""
            });
        } catch (error) {
            console.error("Error fetching energy review:", error);
            setError("Failed to load energy review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        navigate("/company/qms/list-energy-review");
    };

    const handleEdit = () => {
        navigate(`/company/qms/edit-energy-review/${id}`);
    };

    const handleDelete = async () => {
        setLoading(true);
        setError("");
        try {
            await axios.delete(`${BASE_URL}/qms/energy-review/${id}/`);
            navigate("/company/qms/list-energy-review");
        } catch (error) {
            console.error("Error deleting energy review:", error);
            setError("Failed to delete energy review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleViewFile = () => {
        if (formData.upload_attachment) {
            window.open(`${formData.upload_attachment}`, "_blank");
        }
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Energy Review Information</h2>
                <button
                    onClick={handleClose}
                    className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                >
                    <X className="text-white" />
                </button>
            </div>

            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-2 my-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center text-[#AAAAAA] p-5">Loading energy review...</div>
            ) : (
                <div className="pt-5 relative">
                    {/* Vertical divider line */}
                    <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Energy Review Name/Title
                            </label>
                            <div className="view-employee-data">{formData.energy_name}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Energy Review Number
                            </label>
                            <div className="view-employee-data">{formData.review_no}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Review Type
                            </label>
                            <div className="view-employee-data">{formData.review_type.title}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Date
                            </label>
                            <div className="view-employee-data">{formatDate(formData.date)}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Attach Document
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
                                Relate Business Process
                            </label>
                            <div className="view-employee-data">{formData.relate_business_process}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Energy Remarks
                            </label>
                            <div className="view-employee-data">{formData.remarks}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Relate Document/Process
                            </label>
                            <div className="view-employee-data">{formData.relate_document_process}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Revision
                            </label>
                            <div className="view-employee-data">{formData.revision}</div>
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
                                <button onClick={handleDelete} disabled={loading}>
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
        </div>
    );
};

export default QmsViewEnergyReview;