import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import { useNavigate } from 'react-router-dom';
import AddAuditReportModal from './AddAuditReportModal';
import ViewAuditReportModal from './ViewAuditReportModal';
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsListAudit = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [draftCount, setDraftCount] = useState(0);

    // Modal states
    const [addAuditReport, setAddAuditReport] = useState(false);
    const [viewAuditReport, setViewAuditReport] = useState(false);
    const [selectedAudit, setSelectedAudit] = useState(null);

    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [auditToDelete, setAuditToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);

    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const itemsPerPage = 10;

    const getUserCompanyId = () => {
        const role = localStorage.getItem("role");
        if (role === "company") {
            return localStorage.getItem("company_id");
        } else if (role === "user") {
            try {
                const userCompanyId = localStorage.getItem("user_company_id");
                return userCompanyId ? JSON.parse(userCompanyId) : null;
            } catch (err) {
                console.error("Error parsing user company ID:", err);
                setShowErrorModal(true);
                setTimeout(() => {
                    setShowErrorModal(false);
                }, 3000);
                return null;
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

    const fetchAudits = async () => {
        setLoading(true);
        try {
            const companyId = getUserCompanyId();
            const userId = getRelevantUserId();
            const response = await axios.get(`${BASE_URL}/qms/audit/company/${companyId}/`);
            setAudits(response.data);

            const draftResponse = await axios.get(
                `${BASE_URL}/qms/audit/drafts-count/${userId}/`
            );
            setDraftCount(draftResponse.data.count);

            setError(null);
        } catch (err) {
            console.error("Error fetching audits:", err);
            let errorMsg = "Failed to fetch audits";

            if (err.response) {
                // Check for field-specific errors first
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                // Check for non-field errors
                else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }

            setError(errorMsg);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            setAudits([]);
        } finally {
            setLoading(false);
        }
    };



    const formatDate = (dateString) => {
        if (!dateString) return null;
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Open delete confirmation modal
    const openDeleteModal = (audit) => {
        setAuditToDelete(audit);
        setShowDeleteModal(true);
        setDeleteMessage('Audit');
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    // Handle delete confirmation
    const confirmDelete = async () => {
        if (!auditToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/audit-get/${auditToDelete.id}/`);
            setAudits(audits.filter(item => item.id !== auditToDelete.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
            setSuccessMessage("Audit Deleted Succesfully")
        } catch (error) {
            console.error("Error deleting audit:", error);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
            let errorMsg = 'Failed to delete audit. Please try again.';

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
            setShowDeleteModal(false);
        }
    };

    useEffect(() => {
        fetchAudits();
    }, []);

    const filteredItems = audits.filter(audit =>
    (audit.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.audit_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.area?.toLowerCase().includes(searchQuery.toLowerCase()))
    );


    // Pagination
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddAudit = () => {
        navigate('/company/qms/add-audit');
    };

    const handleDraftAudit = () => {
        navigate('/company/qms/draft-audit');
    };

    const handleEditAudit = (id) => {
        navigate(`/company/qms/edit-audit/${id}`);
    };

    const handleViewAudit = (id) => {
        navigate(`/company/qms/view-audit/${id}`);
    };

    // Modal handlers
    const openAddAuditReportModal = (audit) => {
        setSelectedAudit(audit);
        setAddAuditReport(true);
    };

    const openViewAuditReportModal = (audit) => {
        setSelectedAudit(audit);
        setViewAuditReport(true);
    };

    const closeAddAuditReportModal = () => {
        setAddAuditReport(false);
    };

    const closeViewAuditReportModal = () => {
        setViewAuditReport(false);
    };

    if (loading) {
        return <div className="bg-[#1C1C24] not-found p-5 rounded-lg text-center">Loading audits...</div>;
    }

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-awareness-training-head">Audits</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[333px] border border-[#383840] outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className='absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>
                    <button
                        className="flex items-center justify-center !w-[100px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleDraftAudit}
                    >
                        <span>Draft</span>
                        {draftCount > 0 && (
                            <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[115px] right-[175px]">
                                {draftCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="flex items-center justify-center !px-[20px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleAddAudit}
                    >
                        <span>Add Audit</span>
                        <img src={plusIcon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
                    </button>
                </div>
            </div>
            <div className="overflow-hidden">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className='h-[48px]'>
                            <th className="px-3 text-left list-awareness-training-thead">No</th>
                            <th className="px-3 text-left list-awareness-training-thead">Title</th>
                            <th className="px-3 text-left list-awareness-training-thead">Audit Type</th>
                            <th className="px-3 text-left list-awareness-training-thead">Date Planned</th>
                            <th className="px-3 text-left list-awareness-training-thead">Area/Function</th>
                            <th className="px-3 text-left list-awareness-training-thead">Date Conducted</th>
                            <th className="px-3 text-center list-awareness-training-thead">Add/View Reports</th>
                            <th className="px-3 text-center list-awareness-training-thead">View</th>
                            <th className="px-3 text-center list-awareness-training-thead">Edit</th>
                            <th className="px-3 text-center list-awareness-training-thead">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((audit, index) => (
                                <tr key={audit.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                    <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-3 list-awareness-training-datas">{audit.title || 'N/A'}</td>
                                    <td className="px-3 list-awareness-training-datas">{audit.audit_type || 'N/A'}</td>
                                    <td className="px-3 list-awareness-training-datas">{formatDate(audit.proposed_date) || 'N/A'}</td>
                                    <td className="px-3 list-awareness-training-datas">{audit.area || 'N/A'}</td>
                                    <td className="px-3 list-awareness-training-datas">{formatDate(audit.date_conducted) || 'N/A'}</td>
                                    <td className="px-3 list-awareness-training-datas text-center flex items-center justify-center gap-6 h-[53px] text-[#1E84AF]">
                                        <button
                                            onClick={() => openAddAuditReportModal(audit)}
                                            className="hover:text-blue-400 transition-colors duration-200"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => openViewAuditReportModal(audit)}
                                            className="hover:text-blue-400 transition-colors duration-200"
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center ">
                                        <div className='flex justify-center items-center h-[50px]'>
                                            <button onClick={() => handleViewAudit(audit.id)}>
                                                <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <div className='flex justify-center items-center h-[50px]'>
                                            <button onClick={() => handleEditAudit(audit.id)}>
                                                <img src={edits} alt="Edit Icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <div className='flex justify-center items-center h-[50px]'>
                                            <button onClick={() => openDeleteModal(audit)}>
                                                <img src={deletes} alt="Delete Icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-4 text-center not-found">
                                    No audits found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalItems > 0 && (
                <div className="flex justify-between items-center mt-3">
                    <div className='text-white total-text'>Total: {totalItems}</div>
                    <div className="flex items-center gap-5">
                        <button
                            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                className={`w-8 h-8 rounded-md ${currentPage === number ? 'pagin-active' : 'pagin-inactive'}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
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

            <AddAuditReportModal
                isVisible={addAuditReport}
                selectedAudit={selectedAudit}
                onClose={closeAddAuditReportModal}
                onSave={fetchAudits} // Refresh the list after saving
            />

            <ViewAuditReportModal
                isVisible={viewAuditReport}
                selectedAudit={selectedAudit}
                onClose={closeViewAuditReportModal}
            />
        </div>
    );
};

export default QmsListAudit;