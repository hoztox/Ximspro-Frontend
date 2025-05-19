import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewDraftCorrectionActions = () => {
    const [formData, setFormData] = useState({
        source: "",
        title: "",
        action_no: "",
        root_cause: "",
        executor: "",
        description: "",
        action_or_corrections: "",
        date_raised: "",
        date_completed: "",
        status: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchDraftCarNumber = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/car-numbers/${id}/`);
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load draft data");
                setLoading(false);
                console.error("Error fetching draft car number data:", err);
            }
        };

        if (id) {
            fetchDraftCarNumber();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/draft-correction-actions");
    };

    if (loading) return (
        <div className="bg-[#1C1C24] text-white p-8 rounded-lg flex justify-center items-center">
            <p>Loading...</p>
        </div>
    );

    // Format dates for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date)) return "N/A"; // handle invalid date formats
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Draft Correction/Corrective Action Information</h2>
                <button
                    onClick={handleClose}
                    className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                >
                    <X className="text-white" />
                </button>
            </div>

            <div className="pt-5 relative">
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
                            Title
                        </label>
                        <div className="view-employee-data">{formData.title || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action No
                        </label>
                        <div className="view-employee-data">{formData.action_no || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Root Cause
                        </label>
                        <div className="view-employee-data">
                            {formData.root_cause?.title || "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Executor
                        </label>
                        <div className="view-employee-data">
                            {formData.executor?.first_name ?
                                `${formData.executor.first_name} ${formData.executor.last_name}` :
                                "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Description
                        </label>
                        <div className="view-employee-data">{formData.description || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Action or Corrections
                        </label>
                        <div className="view-employee-data">{formData.action_or_corrections || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date Raised
                        </label>
                        <div className="view-employee-data">{formatDate(formData.date_raised || "N/A")}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Complete By
                        </label>
                        <div className="view-employee-data">{formatDate(formData.date_completed || "N/A")}</div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{formData.status}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QmsViewDraftCorrectionActions;