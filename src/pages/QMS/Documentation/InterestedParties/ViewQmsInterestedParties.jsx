import React, { useState, useEffect, useRef } from "react";
import "./viewqmsinterestedparties.css";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import prints from "../../../../assets/images/Company Documentation/newprint.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { X, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import DeleteQmsInterestedConfirmModal from "./Modals/DeleteQmsInterestedConfirmModal";
import DeleteQmsInterestedSuccessModal from "./Modals/DeleteQmsInterestedSuccessModal";
import DeleteQmsInterestedErrorModal from "./Modals/DeleteQmsInterestedErrorModal";

const ViewQmsInterestedParties = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const printRef = useRef(null);
    
    // State for delete modals
    const [showDeleteInterestedModal, setShowDeleteInterestedModal] = useState(false);
    const [interestedToDelete, setInterestedToDelete] = useState(null);
    const [showDeleteInterestedSuccessModal, setShowDeleteInterestedSuccessModal] = useState(false);
    const [showDeleteInterestedErrorModal, setShowDeleteInterestedErrorModal] = useState(false);

    const handleClose = () => {
        navigate('/company/qms/interested-parties');
    };

    const handleEdit = (id) => {
        navigate(`/company/qms/edit-interested-parties/${id}`);
    };

    const handleDelete = () => {
        setInterestedToDelete(id);
        setShowDeleteInterestedModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/qms/interested-parties-get/${interestedToDelete}/`);
            setShowDeleteInterestedModal(false);
            setShowDeleteInterestedSuccessModal(true);
            
            // Auto-navigate after success
            setTimeout(() => {
                setShowDeleteInterestedSuccessModal(false);
                navigate('/company/qms/interested-parties');
            }, 2000);
        } catch (err) {
            console.error("Error deleting interested party:", err);
            setError("Failed to delete interested party. Please try again.");
            setShowDeleteInterestedModal(false);
            setShowDeleteInterestedErrorModal(true);
            
            // Auto-close error modal after 2 seconds
            setTimeout(() => {
                setShowDeleteInterestedErrorModal(false);
            }, 2000);
        }
    };

    const cancelDelete = () => {
        setShowDeleteInterestedModal(false);
        setInterestedToDelete(null);
    };

    // Function to handle printing to PDF
    const handlePrint = () => {
        // Store the original page title
        const originalTitle = document.title;

        // Change the document title to be used as the PDF filename
        document.title = `Interested Parties - ${formData?.name || 'Details'}`;

        // Create a style element for print-specific styles
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                .print-container, .print-container * {
                    visibility: visible;
                }
                .print-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    background-color: white !important;
                    color: black !important;
                }
                .print-container .view-interested-parties-label {
                    color: #555 !important;
                    font-weight: bold !important;
                }
                .print-container .view-interested-parties-data {
                    color: #000 !important;
                }
                .non-printable {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Trigger the print dialog
        window.print();

        // Clean up after printing
        document.title = originalTitle;
        document.head.removeChild(style);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/qms/interested-parties-get/${id}/`);
                setFormData(response.data);
                console.log('resoneeeee', response.data);

            } catch (error) {
                console.error("Failed to fetch interested party data", error);
                setError("Failed to fetch interested party data");
            }
        };
        fetchData();
    }, [id]);

    if (!formData) return <div className="text-center not-found p-4">Loading Interested Parties...</div>;

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg w-full">
            {/* Delete confirmation modal */}
            <DeleteQmsInterestedConfirmModal
                showDeleteInterestedModal={showDeleteInterestedModal}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            {/* Delete success modal */}
            <DeleteQmsInterestedSuccessModal
                showDeleteInterestedSuccessModal={showDeleteInterestedSuccessModal}
                onClose={() => setShowDeleteInterestedSuccessModal(false)}
            />

            {/* Delete error modal */}
            <DeleteQmsInterestedErrorModal
                showDeleteInterestedErrorModal={showDeleteInterestedErrorModal}
                onClose={() => setShowDeleteInterestedErrorModal(false)}
                error={error}
            />

            <div className="flex justify-between items-center py-5 mx-5 border-b border-[#383840] non-printable">
                <h2 className="view-interested-parties-head">Interested Parties Information</h2>
                <button onClick={handleClose} className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md">
                    <X size={23} className="text-white" />
                </button>
            </div>

            {/* Printable content container */}
            <div className="print-container" ref={printRef}>
                <div className="p-4 space-y-6">
                    {/* Title for print view - only visible when printing */}
                    <h1 className="text-2xl font-bold text-center mb-6 hidden print:block print:text-black">
                        Interested Parties: {formData.name}
                    </h1>

                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 md:pr-6 space-y-[40px]">
                            {/* Left column content */}
                            <div>
                                <label className="block view-interested-parties-label mb-[6px]">Name</label>
                                <div className="text-white view-interested-parties-data">{formData.name}</div>
                            </div>
                            <div>
                                <label className="block view-interested-parties-label mb-[6px]">Needs</label>
                                <ul className="text-white view-interested-parties-data list-disc pl-5">
                                    {formData.needs.map((item) => (
                                        <li key={item.id}>{item.needs}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <label className="block view-interested-parties-label mb-[6px]">Special Requirements</label>
                                <div className="text-white view-interested-parties-data">{formData.special_requirements}</div>
                            </div>
                            <div className="non-printable">
                                <label className="block view-interested-parties-label mb-[6px]">Browse File</label>
                                <div className="flex items-center view-interested-parties-data">
                                    {formData.file ? (
                                        <a href={formData.file} target="_blank" rel="noopener noreferrer" className="text-[#1E84AF] flex items-center">
                                            Click to view file <Eye size={18} className="ml-1" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">No file uploaded</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block w-px bg-[#383840] mx-0 non-printable"></div>
                        <div className="md:w-1/2 md:pl-6 space-y-[40px] mt-6 md:mt-0">
                            {/* Right column content */}
                            <div>
                                <label className="block view-interested-parties-label mb-[6px]">Category</label>
                                <div className="text-white view-interested-parties-data">{formData.category}</div>
                            </div>
                            <div>
                                <label className="block view-interested-parties-label mb-[6px]">Expectations</label>
                                <ul className="text-white view-interested-parties-data list-disc pl-5">
                                    {formData.needs.map((item) => (
                                        <li key={item.id}>{item.expectation}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <label className="block view-interested-parties-label mb-[6px]">Applicable Legal/Regulatory Requirements</label>
                                <div className="text-white view-interested-parties-data">
                                    {formData.legal_requirements === 'N/A'
                                        ? formData.custom_legal_requirements
                                        : formData.legal_requirements}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <label className="block view-interested-parties-label mb-[6px]">Type</label>
                                    <div className="text-white view-interested-parties-data">
                                        {formData.type && formData.type.title ? formData.type.title : 'N/A'}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-10 non-printable">
                                    <button
                                        onClick={handlePrint}
                                        className="flex flex-col items-center view-interested-parties-label gap-[8px]"
                                    >
                                        <span>Print</span>
                                        <img src={prints} alt="Print Icon" className="w-[20px] h-[20px]" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(id)}
                                        className="flex flex-col items-center view-interested-parties-label gap-[8px]"
                                    >
                                        <span>Edit</span>
                                        <img src={edits} alt="Edit Icon" className="w-[18px] h-[18px]" />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex flex-col items-center view-interested-parties-label gap-[8px]"
                                    >
                                        <span>Delete</span>
                                        <img src={deletes} alt="Delete Icon" className="w-[18px] h-[18px]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewQmsInterestedParties;