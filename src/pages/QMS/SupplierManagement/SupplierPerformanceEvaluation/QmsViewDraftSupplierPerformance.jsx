import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from '../../../../assets/images/Company Documentation/delete.svg';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewDraftSupplierPerformance = () => {
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/supplier/evaluation-get/${id}/`);
                setPerformanceData(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to load supplier evaluation data");
                console.error("Error fetching supplier evaluation data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPerformanceData();
        }
    }, [id]);

    const handleClose = () => {
        navigate('/company/qms/drafts-supplier-evaluation');
    };

    // Format date from YYYY-MM-DD to DD-MM-YYYY
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    if (loading) {
        return (
            <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-64">
                <p className="not-found">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-64">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    if (!performanceData) {
        return (
            <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-64">
                <p className="text-xl">No data found</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Supplier Evaluation Information</h2>
                <button onClick={handleClose} className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md">
                    <X className='text-white' />
                </button>
            </div>

            <div className="p-5 relative">
                {/* Vertical divider line */}
                <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                    <div>
                        <label className="block view-employee-label mb-[6px]">Evaluation Title</label>
                        <div className="view-employee-data">
                            {performanceData.title || 'No title provided'}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">Valid Till</label>
                        <div className="view-employee-data">
                            {formatDate(performanceData.valid_till)}
                        </div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">Description</label>
                        <div className="view-employee-data">
                            {performanceData.description || 'No description provided'}
                        </div>
                    </div>
 
                </div>
            </div>
        </div>
    );
};

export default QmsViewDraftSupplierPerformance;