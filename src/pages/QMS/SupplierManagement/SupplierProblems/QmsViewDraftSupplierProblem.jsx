import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";


const QmsViewDraftSupplierProblem = () => {
    const [formData, setFormData] = useState({
        supplier: {},
        date: "",
        problem: "",
        immediate_action: "",
        executor: "",
        solved: "",
        corrective_action_need: "",
        no_car: null,
        corrections: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from URL params
 
    // Fetch supplier problem data when component mounts
    useEffect(() => {
        const fetchSupplierProblem = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/supplier-problems/${id}/`);
                console.log('viewwww', response);

                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching supplier problem data:", err);
                setError("Failed to load supplier problem data");
                setLoading(false);
            }
        };

        if (id) {
            fetchSupplierProblem();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/drafts-supplier-problem");
    };

    if (loading) {
        return (
            <div className="bg-[#1C1C24] not-found rounded-lg p-5 flex justify-center items-center h-64">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Supplier Problem Information</h2>
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
                            Supplier Name
                        </label>
                        <div className="view-employee-data">
                            {formData.supplier && formData.supplier.company_name ? formData.supplier.company_name : "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Date
                        </label>
                        <div className="view-employee-data">{formData.date || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Problem
                        </label>
                        <div className="view-employee-data">{formData.problem || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Immediate Action
                        </label>
                        <div className="view-employee-data">{formData.immediate_action || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Executor
                        </label>
                        <div className="view-employee-data">
                            {typeof formData.executor === 'object' && formData.executor !== null
                                ? (formData.executor.name || formData.executor.username || formData.executor.id)
                                : formData.executor || "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Solved
                        </label>
                        <div className="view-employee-data">{formData.solved || "N/A"}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Corrective Action Needed?
                        </label>
                        <div className="view-employee-data">{formData.corrective_action_need || "N/A"}</div>
                    </div>

                    {formData.no_car && (
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                CAR Number
                            </label>
                            <div className="view-employee-data">
                                {formData.no_car.title ? formData.no_car.action_no : "N/A"}
                            </div>
                        </div>
                    )}

                    {formData.corrections && (
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Corrections
                            </label>
                            <div className="view-employee-data">{formData.corrections}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default QmsViewDraftSupplierProblem
