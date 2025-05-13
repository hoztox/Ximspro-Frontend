import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import axios from "axios";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewTargets = () => {
    const [formData, setFormData] = useState({
        target: "",
        title: "",
        associative_objective: "",
        programs: [],
        results: "",
        target_date: "",
        reminder_date: "",
        responsible: "",
        status: "",
        upload_attachment: null,
        is_draft: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); // Get target ID from URL

    // Fetch target data
    const fetchTarget = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/qms/targets-get/${id}/`);
            const data = response.data.data; // Assuming { success: true, data: {...} }
            setFormData({
                target: data.target || data.title || "No Title",
                title: data.title || "",
                associative_objective: data.associative_objective || "",
                programs: data.programs || [],
                results: data.results || "",
                target_date: data.target_date || "",
                reminder_date: data.reminder_date || "",
                responsible: data.responsible || "Pending",
                status: data.status || "On Going",
                upload_attachment: data.upload_attachment || null,
                is_draft: data.is_draft || false
            });
            setError(null);
        } catch (err) {
            setError("Failed to fetch target data. Please try again.");
            console.error("Error fetching target:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        if (id) {
            fetchTarget();
        } else {
            setError("Invalid target ID.");
            setLoading(false);
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/list-targets");
    };

    const handleEdit = (id) => {
        navigate(`/company/qms/edit-targets/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this target?")) {
            try {
                await axios.delete(`${BASE_URL}/qms/targets-get/${id}/`);
                navigate("/company/qms/list-targets");
            } catch (err) {
                setError("Failed to delete target. Please try again.");
                console.error("Error deleting target:", err);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Targets and Programs Information</h2>
                <button
                    onClick={handleClose}
                    className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                >
                    <X className="text-white" />
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-500 p-5">{error}</div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center p-5">Loading...</div>
            )}

            {/* Content */}
            {!loading && !error && (
                <div className="p-5 relative">
                    {/* Vertical divider line */}
                    <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Target
                            </label>
                            <div className="view-employee-data">{formData.target}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Associative Objective
                            </label>
                            <div className="view-employee-data">{formData.associative_objective || 'N/A'}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Program(s)
                            </label>
                            <div className="view-employee-data">
                                {formData.programs.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {formData.programs.map((p, index) => (
                                            <li key={index}>{p.title}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    '-'
                                )}
                            </div>
                        </div>


                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Results
                            </label>
                            <div className="view-employee-data">{formData.results || 'N/A'}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Target Date
                            </label>
                            <div className="view-employee-data">{formatDate(formData.target_date || 'N/A')}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Responsible
                            </label>
                            <div className="view-employee-data">{formData.responsible?.first_name} {formData.responsible?.last_name || 'N/A'}</div>
                        </div>


                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{formData.status}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Reminder Notification
                            </label>
                            <div className="view-employee-data">{formatDate(formData.reminder_date || 'N/A')}</div>
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

                        <div className="flex space-x-10 justify-end">
                            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                                Edit
                                <button onClick={() => handleEdit(id)}>
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
            )}
        </div>
    );
};

export default QmsViewTargets;