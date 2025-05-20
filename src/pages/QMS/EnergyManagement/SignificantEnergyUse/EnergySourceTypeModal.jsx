import React, { useState, useEffect } from 'react';
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';
import DeleteConfimModal from '../Modals/DeleteConfimModal';

const EnergySourceTypeModal = ({ isOpen, onClose, onAddEnergySource }) => {
    const [animateClass, setAnimateClass] = useState('');
    const [energySource, setEnergySource] = useState([]);
    const [newEnergySourceTitle, setNewEnergySourceTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("Energy Source");

    // Animation effect when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setAnimateClass('opacity-100 scale-100');
            fetchEnergySource();
        } else {
            setAnimateClass('opacity-0 scale-95');
        }
    }, [isOpen]);

    const fetchEnergySource = async () => {
        setLoading(true);
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/source-type/company/${companyId}/`);
            setEnergySource(response.data);
        } catch (error) {
            console.error('Error fetching energySource:', error);
            setError('Failed to load energySource. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get company ID from local storage
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
    const openDeleteModal = (id) => {
        const item = energySource.find(item => item.id === id);
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    // Handle delete confirmation
    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/source-type/${itemToDelete.id}/`);
            setEnergySource(energySource.filter(item => item.id !== itemToDelete.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Energy Source Deleted Successfully");
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } catch (error) {
            console.error('Error deleting energy source:', error);
            setError('Failed to delete energy source. Please try again.');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    // Validate form
    const validateForm = () => {
        if (!newEnergySourceTitle.trim()) {
            setFormError('Energy Source Title is required');
            return false;
        }
        return true;
    };

    // Handle save new cause
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

            const response = await axios.post(`${BASE_URL}/qms/source-type/create/`, {
                company: companyId,
                title: newEnergySourceTitle.trim()
            });

            setEnergySource([...energySource, response.data]);

            if (onAddEnergySource && typeof onAddEnergySource === 'function') {
                onAddEnergySource(response.data);
            }

            setNewEnergySourceTitle('');
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);
            setSuccessMessage("Energy Source Added Successfully");

        } catch (error) {
            console.error('Error adding energy source:', error);
            setError('Failed to add energy source. Please try again.');
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        } finally {
            setIsAdding(false);
        }
    };

    // Handle input change and clear error
    const handleInputChange = (e) => {
        setNewEnergySourceTitle(e.target.value);
        setFormError('');
    };

    const handleSelectCause = (cause) => {
        if (onAddEnergySource && typeof onAddEnergySource === 'function') {
            onAddEnergySource(cause);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className={`bg-[#13131A] text-white rounded-[4px] w-[563px] p-5 transform transition-all duration-300 ${animateClass}`}>

                <SuccessModal
                    showSuccessModal={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    successMessage={successMessage}
                />

                <ErrorModal
                    showErrorModal={showErrorModal}
                    onClose={() => setShowErrorModal(false)}
                    error={error}
                />
 
                <DeleteConfimModal
                    showDeleteModal={showDeleteModal}
                    onConfirm={confirmDelete}
                    onCancel={closeAllModals}
                    deleteMessage={deleteMessage}
                />

                {/* Energy Source List Section */}
                <div className="bg-[#1C1C24] rounded-[4px] p-5 mb-6 max-h-[350px]">
                    <h2 className="agenda-list-head pb-5">Energy Source List</h2>

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
                                    {energySource.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 not-found">No Energy Source Found</td>
                                        </tr>
                                    ) : (
                                        energySource.map((item, index) => (
                                            <tr key={item.id} className="border-b border-[#383840] h-[42px]">
                                                <td className="px-3 agenda-data w-[10%]">{index + 1}</td>
                                                <td className="px-3 agenda-data w-[60%]">{item.title}</td>
                                                <td className="px-3 agenda-data text-center w-[15%]">
                                                    <div className="flex items-center justify-center h-[42px]">
                                                        <button onClick={() => openDeleteModal(item.id)}>
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

                {/* Add Energy Source Section */}
                <div className="bg-[#1C1C24] rounded-[4px]">
                    <h3 className="agenda-list-head border-b border-[#383840] px-5 py-6">Add Energy Source</h3>

                    <div className="mb-4 px-5">
                        <label className="block mb-3 agenda-list-label">
                            Energy Source <span className="text-[#F9291F]">*</span>
                        </label>
                        <input
                            type="text"
                            value={newEnergySourceTitle}
                            onChange={handleInputChange}
                            className="w-full add-agenda-inputs bg-[#24242D] h-[49px] border-none px-5 outline-none"
                            placeholder="Enter Energy Source"
                        />
                        {formError && (
                            <p className="text-red-500 text-sm mt-1">{formError}</p>
                        )}
                    </div>

                    <div className="flex gap-5 justify-end pb-5 px-5">
                        <button
                            onClick={onClose}
                            className="cancel-btn"
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

export default EnergySourceTypeModal;