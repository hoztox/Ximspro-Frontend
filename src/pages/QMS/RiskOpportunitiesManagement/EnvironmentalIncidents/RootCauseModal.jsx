import React, { useState, useEffect } from 'react';
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';
import DeleteConfimModal from '../Modals/DeleteConfimModal';

const RootCauseModal = ({ isOpen, onClose, onAddCause }) => {
    const [animateClass, setAnimateClass] = useState('');
    const [causes, setCauses] = useState([]);
    const [newCauseTitle, setNewCauseTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [causeToDelete, setCauseToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");

    useEffect(() => {
        if (isOpen) {
            setAnimateClass('opacity-100 scale-100');
            fetchCauses();
        } else {
            setAnimateClass('opacity-0 scale-95');
            setFormError('');
        }
    }, [isOpen]);

    const fetchCauses = async () => {
        setLoading(true);
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                setShowErrorModal(true);
                setTimeout(() => {
                    setShowErrorModal(false);
                }, 3000);
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/incident-root/company/${companyId}/`);
            setCauses(response.data);
        } catch (error) {
            console.error('Error fetching causes:', error);
            setError('Failed to load causes. Please try again.');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

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

    // Open delete confirmation modal
    const openDeleteModal = (cause) => {
        setCauseToDelete(cause);
        setShowDeleteModal(true);
        setDeleteMessage("Root Cause");
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    const handleDelete = async () => {
        if (!causeToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/incident-root/${causeToDelete.id}/`);
            setCauses(causes.filter(item => item.id !== causeToDelete.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Root Cause Deleted Successfully");
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } catch (error) {
            console.error('Error deleting cause:', error);
            setError('Failed to delete cause. Please try again.');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    const validateForm = () => {
        if (!newCauseTitle.trim()) {
            setFormError('Cause Title is required');
            return false;
        }
        setFormError('');
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsAdding(true);
        try {
            const companyId = getUserCompanyId();

            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                setIsAdding(false);
                return;
            }

            const response = await axios.post(`${BASE_URL}/qms/incident-root/create/`, {
                company: companyId,
                title: newCauseTitle.trim()
            });

            setCauses([...causes, response.data]);

            if (onAddCause && typeof onAddCause === 'function') {
                onAddCause(response.data);
            }
 
            setNewCauseTitle('');
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);
            setSuccessMessage("Root Cause Added Successfully")

        } catch (error) {
            console.error('Error adding cause:', error);
            setError('Failed to add cause. Please try again.');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsAdding(false);
        }
    };

    const handleSelectCause = (cause) => {
        if (onAddCause && typeof onAddCause === 'function') {
            onAddCause(cause);
            onClose();
        }
    };

    const handleInputChange = (e) => {
        setNewCauseTitle(e.target.value);
        setFormError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className={`bg-[#13131A] text-white rounded-[4px] w-[563px] p-5 transform transition-all duration-300 ${animateClass}`}>

                {/* Success Modal */}
                <SuccessModal
                    showSuccessModal={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    successMessage={successMessage}
                />

                {/* Error Modal */}
                <ErrorModal
                    showErrorModal={showErrorModal}
                    onClose={() => setShowErrorModal(false)}
                    error={error}
                />

                {/* Delete Confirmation Modal */}
                <DeleteConfimModal
                    showDeleteModal={showDeleteModal}
                    onConfirm={handleDelete}
                    onCancel={closeAllModals}
                    deleteMessage={deleteMessage}
                />

                <div className="bg-[#1C1C24] rounded-[4px] p-5 mb-6 max-h-[350px]">
                    <h2 className="agenda-list-head pb-5">Root Causes List</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-400">
                            <thead className="bg-[#24242D] h-[48px]">
                                <tr className="rounded-[4px]">
                                    <th className="px-3 w-[10%] agenda-thead">No</th>
                                    <th className="px-3 w-[60%] agenda-thead">Title</th>
                                    <th className="px-3 text-center w-[15%] agenda-thead">Delete</th>
                                </tr>
                            </thead>
                        </table>
                        <div className="max-h-[230px] overflow-y-auto">
                            <table className="w-full text-left text-gray-400">
                                <tbody>
                                    {causes.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">No causes found</td>
                                        </tr>
                                    ) : (
                                        causes.map((item, index) => (
                                            <tr key={item.id} className="border-b border-[#383840] h-[42px] hover:bg-[#24242D] cursor-pointer" onClick={() => handleSelectCause(item)}>
                                                <td className="px-3 agenda-data w-[10%]">{index + 1}</td>
                                                <td className="px-3 agenda-data w-[60%]">{item.title}</td>
                                                <td className="px-3 agenda-data text-center w-[15%]">
                                                    <div className="flex items-center justify-center h-[42px]">
                                                        <button onClick={(e) => { e.stopPropagation(); openDeleteModal(item); }}>
                                                            <img src={deletes} alt="Delete Icon" className="w-[16px] h-[16px]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                <div className="bg-[#1C1C24] rounded-[4px]">
                    <h3 className="agenda-list-head border-b border-[#383840] px-5 py-6">Add Root Cause</h3>

                    <div className="mb-4 px-5">
                        <label className="block mb-3 agenda-list-label">
                            Cause Title <span className="text-[#F9291F]">*</span>
                        </label>
                        <input
                            type="text"
                            value={newCauseTitle}
                            onChange={handleInputChange}
                            className="w-full add-agenda-inputs bg-[#24242D] h-[49px] px-5 outline-none border-none"
                            placeholder="Enter cause title"
                        />
                        {formError && (
                            <p className="text-red-500 text-sm mt-1">{formError}</p>
                        )}
                    </div>

                    <div className="flex gap-5 justify-end pb-5 px-5">
                        <button
                            onClick={onClose}
                            className="cancel-btn"
                            disabled={isAdding}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="save-btn"
                            disabled={isAdding}
                        >
                            {isAdding ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RootCauseModal;