import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewDraftCustomerSurvey = () => {
    const [surveyData, setSurveyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/customer/survey/-get/${id}/`);
                setSurveyData(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to load customer satisfaction survey data");
                console.error("Error fetching customer satisfaction survey data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSurveyData();
        }
    }, [id]);

    const handleClose = () => {
        navigate('/company/qms/drafts-customer-survey');
    };

    // Format date function
    const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Customer Satisfaction Survey Information</h2>
                <button onClick={handleClose} className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md">
                    <X className='text-white' />
                </button>
            </div>

            {loading && (
                <div className="flex justify-center items-center p-10 not-found">
                    <p>Loading...</p>
                </div>
            )}

            {!loading && !error && surveyData && (
                <div className="p-5 relative">
                    {/* Vertical divider line */}
                    <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                        <div>
                            <label className="block view-employee-label mb-[6px]">Survey Title</label>
                            <div className="view-employee-data">
                                {surveyData.title || 'No title provided'}
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">Valid Till</label>
                            <div className="view-employee-data">
                                {formatDate(surveyData.valid_till)}
                            </div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">Survey Description</label>
                            <div className="view-employee-data">
                                {surveyData.description || 'No description provided'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QmsViewDraftCustomerSurvey;