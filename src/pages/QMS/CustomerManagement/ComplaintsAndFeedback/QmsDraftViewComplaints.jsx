import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsDraftViewComplaints = () => {
    const [complaint, setComplaint] = useState({
        customer: null,
        category: [],
        details: "",
        immediate_action: "", 
        executor: null,
        date: "",
        corrective_action_need: "",
        solved_after_action: "",
        no_car: null,
        upload_attachment: null
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/complaints/${id}/`);
                console.log('Draft complaint data:', response.data);
                setComplaint(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch draft complaint data");
                setLoading(false);
                console.error("Error fetching draft complaint:", err);
            }
        };

        if (id) {
            fetchComplaint();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/draft-complaints");
    };

    const handleViewAttachment = () => {
        if (complaint.upload_attachment) {
            window.open(complaint.upload_attachment, "_blank");
        }
    };

    if (loading) return <div className="not-found text-center p-5">Loading...</div>;

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Draft Complaints and Feedbacks Information</h2>
                <button
                    onClick={handleClose}
                    className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                >
                    <X className="text-white" />
                </button>
            </div>

            <div className="p-5 relative">
                <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Customer
                        </label>
                        <div className="view-employee-data">
                            {complaint.customer?.name || "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Category
                        </label>
                        <div className="view-employee-data">
                            {complaint.category && complaint.category.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {complaint.category.map((cat, index) => (
                                        <li key={index}>
                                            {typeof cat === 'object' ? cat.title : 'N/A'}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                "N/A"
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Details
                        </label>
                        <div className="view-employee-data">
                            {complaint.details || "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Immediate Action
                        </label>
                        <div className="view-employee-data">
                            {complaint.immediate_action || "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Executor
                        </label>
                        <div className="view-employee-data">
                            {complaint.executor 
                                ? `${complaint.executor.first_name || ''} ${complaint.executor.last_name || ''}`.trim() 
                                : "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date
                        </label>
                        <div className="view-employee-data">
                            {complaint.date 
                                ? new Date(complaint.date).toLocaleDateString() 
                                : "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Solved After Action?
                        </label>
                        <div className="view-employee-data">
                            {complaint.solved_after_action || "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Corrective Action Needed?
                        </label>
                        <div className="view-employee-data">
                            {complaint.corrective_action_need || "N/A"}
                        </div>
                    </div>

                    {complaint.corrective_action_need === 'Yes' && (
                        <>
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Corrections
                                </label>
                                <div className="view-employee-data">
                                    {complaint.corrections || "N/A"}
                                </div>
                            </div>

                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    CAR Number
                                </label>
                                <div className="view-employee-data">
                                    {complaint.no_car?.action_no || "N/A"}
                                </div>
                            </div>
                        </>
                    )}

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
                </div>
            </div>
        </div>
    );
};

export default QmsDraftViewComplaints;