import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import views from "../../../../assets/images/Companies/view.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import DeleteQmsManualDraftConfirmModal from './Modals/DeleteQmsManualDraftConfirmModal';
import DeleteQmsManualDraftSucessModal from './Modals/DeleteQmsManualDraftSucessModal';
import DeleteQmsManualDraftErrorModal from './Modals/DeleteQmsManualDraftErrorModal';

const QmsDraftEnvironmentalWasteManagement = () => {
    const [manuals, setManuals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const manualPerPage = 10;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [manualToDelete, setManualToDelete] = useState(null);
    const [showDeleteDraftManualSuccessModal, setShowDeleteDraftManualSuccessModal] = useState(false);
    const [showDeleteDraftManualErrorModal, setShowDeleteDraftManualErrorModal] = useState(false);

    const handleDeleteClick = (id) => {
        setManualToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (manualToDelete) {
            axios
                .delete(`${BASE_URL}/qms/waste-detail/${manualToDelete}/`)
                .then((response) => {
                    setManuals(manuals.filter((manual) => manual.id !== manualToDelete));
                    setShowDeleteDraftManualSuccessModal(true);
                    setTimeout(() => {
                        setShowDeleteDraftManualSuccessModal(false);
                    }, 3000);
                    console.log("Environmental Waste Management deleted successfully:", response.data);
                })
                .catch((error) => {
                    let errorMsg = error.message;

                    if (error.response) {
                        // Check for field-specific errors first
                        if (error.response.data.date) {
                            errorMsg = error.response.data.date[0];
                        }
                        // Check for non-field errors
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
                    setShowDeleteDraftManualErrorModal(true);
                    setTimeout(() => {
                        setShowDeleteDraftManualErrorModal(false);
                    }, 3000);
                    console.error("Error deleting manual:", error);
                });
        }
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
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

    const companyId = getUserCompanyId();
    console.log("Stored Company ID:", companyId);

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

    const fetchManuals = async () => {
        try {
            setLoading(true);
            const id = getRelevantUserId();
            const response = await axios.get(`${BASE_URL}/qms/waste-draft/${id}/`);
            setManuals(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching Waste Management drafts:", err);
            // setError("Failed to load Waste Management drafts. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManuals();
    }, []);

    const filteredManual = manuals.filter(manual =>
        (manual.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (manual.no?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (manual.approved_by?.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredManual.length / manualPerPage);
    const paginatedManual = filteredManual.slice((currentPage - 1) * manualPerPage, currentPage * manualPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleCloseEnvironmentalWasteManagementDraft = () => {
        navigate('/company/qms/list-environmantal-waste-management');
    };

    const handleView = (id) => {
        navigate(`/company/qms/view-draft-environmantal-waste-management/${id}`);
    };

    const handleEditDraft = (id) => {
        navigate(`/company/qms/edit-draft-environmantal-waste-management/${id}`);
    };

    return (
        <div className="bg-[#1C1C24] list-manual-main">
            <div className="flex items-center justify-between px-[14px] pt-[24px]">
                <h1 className="list-manual-head">Draft Environmental Waste Management</h1>

                <DeleteQmsManualDraftConfirmModal
                    showDeleteModal={showDeleteModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
                <DeleteQmsManualDraftSucessModal
                    showDeleteDraftManualSuccessModal={showDeleteDraftManualSuccessModal}
                    onClose={() => setShowDeleteDraftManualSuccessModal(false)}
                />
                <DeleteQmsManualDraftErrorModal
                    showDeleteDraftManualErrorModal={showDeleteDraftManualErrorModal}
                    onClose={() => setShowDeleteDraftManualErrorModal(false)}
                    error={error}
                />

                <div className="flex space-x-5 items-center">
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
                    <button
                        className="text-white bg-[#24242D] p-1 rounded-md"
                        onClick={handleCloseEnvironmentalWasteManagementDraft}
                    >
                        <X className='text-white' />
                    </button>
                </div>
            </div>

            <div className="p-5 overflow-hidden">
                {loading ? (
                    <div className="text-center py-4 not-found">Loading Environmental Waste Management drafts...</div>
                ) : (
                    <table className="w-full">
                        <thead className='bg-[#24242D]'>
                            <tr className="h-[48px]">
                                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                                <th className="px-2 text-left add-manual-theads">Location</th>
                                <th className="px-2 text-left add-manual-theads">WMP No</th>
                                <th className="px-2 text-left add-manual-theads">Approved By</th>
                                <th className="px-2 text-left add-manual-theads">Action</th>
                                <th className="px-2 text-center add-manual-theads">View</th>
                                <th className="pl-2 pr-4 text-center add-manual-theads">Delete</th>
                            </tr>
                        </thead>
                        <tbody key={currentPage}>
                            {paginatedManual.length > 0 ? (
                                paginatedManual.map((manual, index) => (
                                    <tr key={manual.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[46px]">
                                        <td className="pl-5 pr-2 add-manual-datas">{(currentPage - 1) * manualPerPage + index + 1}</td>
                                        <td className="px-2 add-manual-datas">{manual.location || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">{manual.wmp || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">
                                            {manual.approved_by ?
                                                `${manual.approved_by.first_name} ${manual.approved_by.last_name}` :
                                                'N/A'}
                                        </td>
                                        <td className='px-2 add-manual-datas'>
                                            <button
                                                className='text-[#1E84AF]'
                                                onClick={() => handleEditDraft(manual.id)}
                                            >
                                                Click to Continue
                                            </button>
                                        </td>
                                        <td className="px-2 add-manual-datas text-center">
                                            <button
                                                onClick={() => handleView(manual.id)}
                                                title="View"
                                            >
                                                <img src={views} alt="View Icon" />
                                            </button>
                                        </td>
                                        <td className="pl-2 pr-4 add-manual-datas text-center">
                                            <button
                                                onClick={() => handleDeleteClick(manual.id)}
                                                title="Delete"
                                            >
                                                <img src={deletes} alt="Delete Icon" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center py-4 not-found">No Draft Waste Management records found.</td></tr>
                            )}
                            <tr>
                                <td colSpan="8" className="pt-[15px] border-t border-[#383840]">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-white total-text">Total-{filteredManual.length}</div>
                                        <div className="flex items-center gap-5">
                                            <button
                                                onClick={handlePrevious}
                                                disabled={currentPage === 1}
                                                className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                                            >
                                                Previous
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageClick(page)}
                                                    className={`${currentPage === page ? 'pagin-active' : 'pagin-inactive'}`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={handleNext}
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                className={`cursor-pointer swipe-text ${currentPage === totalPages || totalPages === 0 ? 'opacity-50' : ''}`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default QmsDraftEnvironmentalWasteManagement;