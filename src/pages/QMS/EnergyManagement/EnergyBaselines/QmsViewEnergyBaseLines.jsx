import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

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

    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
            setShowErrorModal(true);
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

    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setDeleteMessage('Energy Baseline');
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
        setShowErrorModal(false);
    };

    const confirmDelete = async () => {
        try {
            setIsLoading(true);
            setError('');
            await axios.delete(`${BASE_URL}/qms/baselines/${id}/`);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Energy Baseline Deleted Successfully");
            setTimeout(() => {
                navigate("/company/qms/list-energy-baselines");
            }, 2000);
        } catch (error) {
            console.error("Error deleting baseline:", error);
            let errorMsg = "Failed to delete baseline. Please try again.";

            if (error.response) {
                if (error.response.data.date) {
                    errorMsg = error.response.data.date[0];
                }
                else if (error.response.data.detail) {
                    errorMsg = error.response.data.detail;
                }
                else if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }

            setError(errorMsg);
            setShowDeleteModal(false);
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

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
                <h2 className="view-employee-head">Base Line Information</h2>
                <button
                    onClick={handleClose}
                    className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                    disabled={isLoading}
                >
                    <X className="text-white" />
                </button>
            </div>

            <div className="p-5 relative">
                {isLoading ? (
                    <div className="text-center py-4 not-found">Loading...</div>
                ) : (
                    <>
                        {/* Vertical divider line */}
                        <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Baseline Title
                                </label>
                                <div className="view-employee-data">{formData.basline_title || 'N/A'}</div>
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
                                    {formData.responsible.first_name} {formData.responsible.last_name || 'N/A'}
                                </div>
                            </div>

                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Related Energy Review
                                </label>
                                <div className="view-employee-data">{formData.energy_review.title || 'N/A'}</div>
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
                                        'N/A'
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
                                    <button onClick={openDeleteModal} disabled={isLoading}>
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

            {/* Delete Confirmation Modal */}
            <DeleteConfimModal
                showDeleteModal={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={closeAllModals}
                deleteMessage={deleteMessage}
            />

            {/* Success Modal */}
            <SuccessModal
                showSuccessModal={showSuccessModal}
                onClose={closeAllModals}
                successMessage={successMessage}
            />

            {/* Error Modal */}
            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={closeAllModals}
                error={error}
            />
        </div>
    );
};

export default QmsViewEnergyBaseLines;