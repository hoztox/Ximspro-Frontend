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

const QmsDraftEnvironmentalImpact = () => {
    const [impacts, setImpacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const impactsPerPage = 10;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [impactToDelete, setImpactToDelete] = useState(null);
    const [showDeleteDraftSuccessModal, setShowDeleteDraftSuccessModal] = useState(false);
    const [showDeleteDraftErrorModal, setShowDeleteDraftErrorModal] = useState(false);

    const handleDeleteClick = (id) => {
        setImpactToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (impactToDelete) {
            try {
                await axios.delete(`${BASE_URL}/qms/impact-detail/${impactToDelete}/`);
                setImpacts(impacts.filter((impact) => impact.id !== impactToDelete));
                setShowDeleteDraftSuccessModal(true);
                setTimeout(() => {
                    setShowDeleteDraftSuccessModal(false);
                }, 1500);
            } catch (error) {
                console.error("Error deleting environmental impact:", error);
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
                setShowDeleteDraftErrorModal(true);
                setTimeout(() => {
                    setShowDeleteDraftErrorModal(false);
                }, 1500);
            }
        }
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    const handleEditDraft = (id) => {
        navigate(`/company/qms/edit-draft-environmantal-impact/${id}`);
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

    const fetchImpacts = async () => {
        try {
            setLoading(true);
            const id = getRelevantUserId();
            if (!id) {
                throw new Error("No valid user or company ID found");
            }
            const response = await axios.get(`${BASE_URL}/qms/impact-draft/${id}/`);
            setImpacts(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching environmental impacts:", err);
            setError("Failed to load draft environmental impacts. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImpacts();
    }, []);

    const filteredImpacts = impacts.filter(impact =>
        (impact.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (impact.number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (impact.approved_by?.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (impact.rivision?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (formatDate(impact.date)?.replace(/^0+/, '') || '').includes(searchQuery.replace(/^0+/, ''))
    );

    const totalPages = Math.ceil(filteredImpacts.length / impactsPerPage);
    const paginatedImpacts = filteredImpacts.slice(
        (currentPage - 1) * impactsPerPage,
        currentPage * impactsPerPage
    );

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

    const handleCloseDraft = () => {
        navigate('/company/qms/list-environmantal-impact');
    };

    const handleView = (id) => {
        navigate(`/company/qms/view-draft-environmantal-impact/${id}`);
    };

    return (
        <div className="bg-[#1C1C24] list-manual-main">
            <div className="flex items-center justify-between px-[14px] pt-[24px]">
                <h1 className="list-manual-head">Draft Environmental Impact Assessments</h1>
                <DeleteQmsManualDraftConfirmModal
                    showDeleteModal={showDeleteModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
                <DeleteQmsManualDraftSucessModal
                    showDeleteDraftManualSuccessModal={showDeleteDraftSuccessModal}
                    onClose={() => setShowDeleteDraftSuccessModal(false)}
                />
                <DeleteQmsManualDraftErrorModal
                    showDeleteDraftManualErrorModal={showDeleteDraftErrorModal}
                    onClose={() => setShowDeleteDraftErrorModal(false)}
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
                        onClick={handleCloseDraft}
                    >
                        <X className='text-white' />
                    </button>
                </div>
            </div>
            <div className="p-5 overflow-hidden">
                {loading ? (
                    <div className="text-center py-4 text-white">Loading drafts...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">{error}</div>
                ) : (
                    <table className="w-full">
                        <thead className='bg-[#24242D]'>
                            <tr className="h-[48px]">
                                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                                <th className="px-2 text-left add-manual-theads">Title</th>
                                <th className="px-2 text-left add-manual-theads">Impact Assessment No</th>
                                <th className="px-2 text-left add-manual-theads">Approved By</th>
                                <th className="px-2 text-left add-manual-theads">Revision</th>
                                <th className="px-2 text-left add-manual-theads">Date</th>
                                <th className="px-2 text-left add-manual-theads">Action</th>
                                <th className="px-2 text-center add-manual-theads">View</th>
                                <th className="pl-2 pr-4 text-center add-manual-theads">Delete</th>
                            </tr>
                        </thead>
                        <tbody key={currentPage}>
                            {paginatedImpacts.length > 0 ? (
                                paginatedImpacts.map((impact, index) => (
                                    <tr key={impact.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[46px]">
                                        <td className="pl-5 pr-2 add-manual-datas">{(currentPage - 1) * impactsPerPage + index + 1}</td>
                                        <td className="px-2 add-manual-datas">{impact.title || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">{impact.number || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">
                                            {impact.approved_by
                                                ? `${impact.approved_by.first_name} ${impact.approved_by.last_name}`
                                                : 'N/A'}
                                        </td>
                                        <td className="px-2 add-manual-datas">{impact.rivision || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">{formatDate(impact.date)}</td>
                                        <td className='px-2 add-manual-datas'>
                                            <button
                                                className='text-[#1E84AF]'
                                                onClick={() => handleEditDraft(impact.id)}
                                            >
                                                Click to Continue
                                            </button>
                                        </td>
                                        <td className="px-2 add-manual-datas text-center">
                                            <button
                                                onClick={() => handleView(impact.id)}
                                                title="View"
                                            >
                                                <img src={views} alt="View" />
                                            </button>
                                        </td>
                                        <td className="pl-2 pr-4 add-manual-datas text-center">
                                            <button
                                                onClick={() => handleDeleteClick(impact.id)}
                                                title="Delete"
                                            >
                                                <img src={deletes} alt="Delete" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-4 not-found">No draft environmental impacts found.</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan="9" className="pt-[15px] border-t border-[#383840]">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-white total-text">Total: {filteredImpacts.length}</div>
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

export default QmsDraftEnvironmentalImpact;