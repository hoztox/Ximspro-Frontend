import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

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
    

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/complaints/${id}/`);
                console.log('view complaint:', response.data);

                setComplaint(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch complaint data");
                setLoading(false);
                console.error("Error fetching complaint:", err);
            }
        };

        if (id) {
            fetchComplaint();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/list-complaints");
    };

    const handleEdit = () => {
        navigate(`/company/qms/edit-complaints/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this complaint?")) {
            try {
                await axios.delete(`${BASE_URL}/qms/complaints/${id}/`);
                navigate("/company/qms/list-complaints");
            } catch (err) {
                console.error("Error deleting complaint:", err);
                alert("Failed to delete complaint");
            }
        }
    };

    const handleViewAttachment = () => {
        if (complaint.upload_attachment) {
            window.open(complaint.upload_attachment, "_blank");
        }
    };

    if (loading) return <div className="text-white text-center p-5">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-5">{error}</div>;

    return (
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
                        <div className="view-employee-data">
                        {complaint.category && Array.isArray(complaint.category) && complaint.category.length > 0
            ? complaint.category[0].title
            : "N/A"}
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
                            {complaint.date ? new Date(complaint.date).toLocaleDateString() : "N/A"}
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
                            <button onClick={handleDelete}>
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
    );
};

export default QmsViewComplaints;