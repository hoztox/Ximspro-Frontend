import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewDraftEnvironmentalImpact = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [corrections, setCorrections] = useState([]);
    const [formData, setFormData] = useState({
        source: "",
        eia_no: "",
        revision: "",
        document_type: "",
        review_frequency: "",
        relate_document: "",
        written_by: "",
        approved_by: "",
        checked_by: "",
        date: "",
        upload_attachment: "",
    });

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

    const fetchUsers = async () => {
        try {
            if (!companyId) return;
            const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
                setError("Unable to load users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users. Please check your connection and try again.");
        }
    };

    const fetchImpactDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/qms/impact-detail/${id}/`);
            const data = response.data;

            const writtenByUser = users.find(user => user.id === data.written_by?.id);
            const checkedByUser = users.find(user => user.id === data.checked_by?.id);
            const approvedByUser = users.find(user => user.id === data.approved_by?.id);

            setFormData({
                source: data.title || "",
                eia_no: data.number || "",
                revision: data.rivision || "",
                document_type: data.document_type || "",
                review_frequency: data.review_frequency_year || data.review_frequency_month
                    ? `${data.review_frequency_year || 0} Years, ${data.review_frequency_month || 0} Months`
                    : "",
                relate_document: data.related_record || "",
                written_by: writtenByUser ? `${writtenByUser.first_name} ${writtenByUser.last_name}` : "",
                approved_by: approvedByUser ? `${approvedByUser.first_name} ${approvedByUser.last_name}` : "",
                checked_by: checkedByUser ? `${checkedByUser.first_name} ${checkedByUser.last_name}` : "",
                date: data.date
                    ? new Date(data.date)
                        .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        .replace(/\//g, "-")
                    : "N/A",
                upload_attachment: data.upload_attachment || "",
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching environmental impact details:", err);
            setError("Failed to load environmental impact data");
            setLoading(false);
        }
    };



    useEffect(() => {
        if (companyId && id) {
            fetchUsers();
            fetchImpactDetails();
        }
    }, [companyId, id]);

    useEffect(() => {
        if (users.length > 0 && formData.written_by === "") {
            fetchImpactDetails();
        }
    }, [users]);

    const handleClose = () => {
        navigate("/company/qms/draft-environmantal-impact");
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Environmental Impact Assessment Information</h2>
                <button
                    onClick={handleClose}
                    className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                >
                    <X className="text-white" />
                </button>
            </div>

            {error && (
                <div className="mx-[18px] px-[104px] mt-4 p-2 bg-red-500 rounded text-white">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading environmental impact data...</p>
                </div>
            ) : (
                <div className="p-5 relative">
                    {/* Vertical divider line */}
                    <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Environmental Impact Assessment Name/Title
                            </label>
                            <div className="view-employee-data">{formData.source}</div>
                        </div>

                        <div className="flex justify-between">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Written/Prepare By
                                </label>
                                <div className="view-employee-data">{formData.written_by}</div>
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Environmental Impact Assessment Number
                            </label>
                            <div className="view-employee-data">{formData.eia_no}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Checked/Reviewed By
                            </label>
                            <div className="view-employee-data">{formData.checked_by}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Revision
                            </label>
                            <div className="view-employee-data">{formData.revision}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Approved By
                            </label>
                            <div className="view-employee-data">{formData.approved_by}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Document Type
                            </label>
                            <div className="view-employee-data">{formData.document_type}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Date
                            </label>
                            <div className="view-employee-data">{formData.date}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Attach Document
                            </label>
                            {formData.upload_attachment ? (
                                <button
                                    onClick={() => window.open(formData.upload_attachment, '_blank')}
                                    className="flex items-center gap-2 click-view-file-btn text-[#1E84AF]"
                                >
                                    Click to view file <Eye size={17} />
                                </button>
                            ) : (
                                <div className="view-employee-data">No file attached</div>
                            )}
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Review Frequency
                            </label>
                            <div className="view-employee-data">{formData.review_frequency}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Relate Document/ Document
                            </label>
                            <div className="view-employee-data">{formData.relate_document}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QmsViewDraftEnvironmentalImpact;