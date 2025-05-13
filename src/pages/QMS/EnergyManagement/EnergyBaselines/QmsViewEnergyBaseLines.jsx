import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const QmsViewEnergyBaseLines = () => {
    const [formData, setFormData] = useState({
        basline_title: '',
        established_basline: '',
        remarks: '',
        date: '',
        responsible: { first_name: '', last_name: '' },
        energy_review: { title: '' },
        enpis: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchBaseline = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.get(`${BASE_URL}/qms/baselines/${id}/`);
            setFormData({
                basline_title: response.data.basline_title || '',
                established_basline: response.data.established_basline || '',
                remarks: response.data.remarks || '',
                date: response.data.date || '',
                responsible: response.data.responsible || { first_name: '', last_name: '' },
                energy_review: response.data.energy_review || { title: '' },
                enpis: response.data.enpis || []
            });
            console.log('response', response.data);

        } catch (error) {
            console.error("Error fetching baseline:", error);
            setError("Failed to load baseline. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchBaseline();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/list-energy-baselines");
    };

    const handleEdit = () => {
        navigate(`/company/qms/edit-energy-baselines/${id}`);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            setError('');
            await axios.delete(`${BASE_URL}/qms/baselines/${id}/`);
            navigate("/company/qms/list-energy-baselines");
        } catch (error) {
            console.error("Error deleting baseline:", error);
            setError("Failed to delete baseline. Please try again.");
        } finally {
            setIsLoading(false);
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

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Base Line Information</h2>
                <button
                    onClick={handleClose}
                    className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                    disabled={isLoading}
                >
                    <X className="text-white" />
                </button>
            </div>

            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-2 my-4 rounded">
                    {error}
                </div>
            )}

            <div className="p-5 relative">
                {isLoading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <>
                        {/* Vertical divider line */}
                        <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Baseline Title
                                </label>
                                <div className="view-employee-data">{formData.basline_title || 'No Title'}</div>
                            </div>

                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Established Baseline
                                </label>
                                <div className="view-employee-data">{formData.established_basline || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Baseline Performance Measure/Remarks
                                </label>
                                <div className="view-employee-data">{formData.remarks || 'N/A'}</div>
                            </div>

                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Date
                                </label>
                                <div className="view-employee-data">{formatDate(formData.date || 'N/A')}</div>
                            </div>

                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Responsible
                                </label>
                                <div className="view-employee-data">
                                    {formData.responsible.first_name} {formData.responsible.last_name || ''}
                                </div>
                            </div>

                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Related Energy Review
                                </label>
                                <div className="view-employee-data">{formData.energy_review.title || 'None'}</div>
                            </div>

                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Associated EnPI(s)
                                </label>
                                <div className="view-employee-data">
                                    {formData.enpis.length > 0 ? (
                                        <ul className="list-disc list-inside">
                                            {formData.enpis.map((enpi, index) => (
                                                <li key={index}>{enpi.enpi}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        'None'
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-10 justify-end">
                                <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                                    Edit
                                    <button onClick={handleEdit} disabled={isLoading}>
                                        <img
                                            src={edits}
                                            alt="Edit Icon"
                                            className="w-[18px] h-[18px]"
                                        />
                                    </button>
                                </div>

                                <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                                    Delete
                                    <button onClick={handleDelete} disabled={isLoading}>
                                        <img
                                            src={deletes}
                                            alt="Delete Icon"
                                            className="w-[18px] h-[18px]"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QmsViewEnergyBaseLines;