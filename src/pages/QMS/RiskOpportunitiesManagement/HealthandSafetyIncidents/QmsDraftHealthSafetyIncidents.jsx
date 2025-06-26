import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import viewIcon from "../../../../assets/images/Companies/view.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';
import DeleteConfimModal from "../../../../components/Modals/DeleteConfimModal";
import SuccessModal from "../../../../components/Modals/SuccessModal";
import ErrorModal from "../../../../components/Modals/ErrorModal";

const QmsDraftHealthSafetyIncidents = () => {
    const getRelevantUserId = () => {
        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            const userId = localStorage.getItem("user_id");
            if (userId) return userId;
        }
        const companyId = localStorage.getItem("company_id");
        if (companyId) return companyId;
        return null;
    };

    // State
    const [incident, setIncident] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [incidentToDelete, setIncidentToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch draft nonConformity from API
    const fetchDraftIncident = async () => {
        try {
            const userId = getRelevantUserId();
            const response = await axios.get(`${BASE_URL}/qms/safety_incidents/draft/${userId}/`);
            console.log('Draft Non Conformity:', response.data);
            setIncident(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching draft Non Conformity:", err);
            setError("Failed to load draft Non Conformity");
            setLoading(false);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    useEffect(() => {
        fetchDraftIncident();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentPage(1);
    };

    // Pagination
    const itemsPerPage = 10;
    const totalItems = incident.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = incident.slice(indexOfFirstItem, indexOfLastItem);

    // Search functionality
    const filteredIncident = currentItems.filter(incidents =>
        (incidents.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (incidents.source?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (incidents.hsi_no?.toString() || '').includes(searchQuery.toLowerCase()) ||
        (incidents.report_by?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    // Navigation handlers
    const handleClose = () => {
        navigate('/company/qms/list-health-safety-incidents');
    };

    const handleQmsViewDraftIncident = (id) => {
        navigate(`/company/qms/view-draft-health-safety-incidents/${id}`);
    };

    const handleQmsEditDraftIncident = (id) => {
        navigate(`/company/qms/edit-draft-health-safety-incidents/${id}`);
    };

    // Open delete confirmation modal
    const openDeleteModal = (incident) => {
        setIncidentToDelete(incident);
        setShowDeleteModal(true);
        setDeleteMessage("Draft Health and Safety Incident");
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    // Delete draft non Conformities
    const confirmDelete = async () => {
        if (!incidentToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/safety_incidents/${incidentToDelete.id}/`);
            setIncident(incident.filter(incidents => incidents.id !== incidentToDelete.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Draft Health and Safety Incident Deleted Successfully");
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } catch (err) {
            console.error("Error deleting draft incident:", err);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg = err.message;

            if (err.response) {
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                } else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }

            setError(errorMsg);
            setShowDeleteModal(false);
        }
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    if (loading) return <div className="not-found text-center p-5">Loading...</div>;

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">Draft Health and Safety Incidents</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="serach-input-manual focus:outline-none bg-transparent"
                        />
                        <div className='absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>

                    <button onClick={handleClose} className="bg-[#24242D] p-2 rounded-md">
                        <X className="text-white" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className='bg-[#24242D]'>
                        <tr className="h-[48px]">
                            <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                            <th className="px-2 text-left add-manual-theads">Title</th>
                            <th className="px-2 text-left add-manual-theads">Source</th>
                            <th className="px-2 text-left add-manual-theads">Incident No</th>
                            <th className="px-2 text-left add-manual-theads">Report By</th>
                            <th className="px-2 text-left add-manual-theads">Action</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="pr-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncident.length > 0 ? (
                            filteredIncident.map((incidents, index) => (
                                <tr key={incidents.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                    <td className="pl-5 pr-2 add-manual-datas">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="px-2 add-manual-datas">{incidents.title || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{incidents.source || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{incidents.incident_no || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">
                                        {incidents.reported_by
                                            ? `${incidents.reported_by.first_name} ${incidents.reported_by.last_name}`
                                            : "N/A"}
                                    </td>

                                    <td className="px-2 add-manual-datas">
                                        <button
                                            onClick={() => handleQmsEditDraftIncident(incidents.id)}
                                            className='text-[#1E84AF]'
                                        >
                                            Click to Continue
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsViewDraftIncident(incidents.id)}>
                                            <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => openDeleteModal(incidents)}>
                                            <img src={deleteIcon} alt="Delete Icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4 not-found">No Draft Health Safety Incidents Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
                <div className="flex justify-between items-center mt-6 text-sm">
                    <div className='text-white total-text'>Total-{totalItems}</div>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`${currentPage === number ? 'pagin-active' : 'pagin-inactive'}`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

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
                onClose={() => setShowSuccessModal(false)}
                successMessage={successMessage}
            />

            {/* Error Modal */}
            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={error}
            />
        </div>
    );
};

export default QmsDraftHealthSafetyIncidents;