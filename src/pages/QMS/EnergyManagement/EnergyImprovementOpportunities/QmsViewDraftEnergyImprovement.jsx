import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewDraftEnergyImprovement = () => {
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
            if (!data.is_draft) {
                setError("This is not a draft improvement.");
                setIsLoading(false);
                return;
            }
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
        } catch (error) {
            console.error("Error fetching draft improvement:", error);
            setError("Failed to load draft energy improvement details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImprovement();
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/draft-energy-improvement-opportunities");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
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
                    Draft Energy Improvement Opportunities Information {formData.is_draft ? "(Draft)" : ""}
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
                            <div className="view-employee-data">{formData.eio || "-"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                EIO Title
                            </label>
                            <div className="view-employee-data">{formData.eio_title || "-"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Target
                            </label>
                            <div className="view-employee-data">{formData.target || "-"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Associated Objective
                            </label>
                            <div className="view-employee-data">{formData.associated_objective || "-"}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Results
                            </label>
                            <div className="view-employee-data">{formData.results || "-"}</div>
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
                                    ? `${formData.responsible.first_name} ${formData.responsible.last_name || ""}`
                                    : "-"}
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{formData.status || "-"}</div>
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
                                <div className="view-employee-data">-</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QmsViewDraftEnergyImprovement;