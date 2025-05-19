import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from '../../../../Utils/Config';
import axios from "axios";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsViewCustomer = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/customer/${id}/`);
                setCustomer(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching customer data:", err);
                let errorMsg = err.message;

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
                setLoading(false);
            }
        };

        if (id) {
            fetchCustomerData();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/list-customer");
    };

    const handleEdit = (id) => {
        navigate(`/company/qms/edit-customer/${id}`);
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setDeleteMessage('Customer');
    };

    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/qms/customer/${id}/`);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Customer deleted successfully");
            setTimeout(() => {
                navigate("/company/qms/list-customer");
            }, 2000);
        } catch (err) {
            console.error("Error deleting customer:", err);
            let errorMsg = err.message;

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
            setShowDeleteModal(false);
        }
    };

    const handleViewDocument = (url) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            setError("No document available");
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    if (loading) return (
        <div className="bg-[#1C1C24] not-found rounded-lg p-5 flex justify-center items-center h-96">
            Loading customer data...
        </div>
    );

    return (
        <>
            <div className="bg-[#1C1C24] text-white rounded-lg p-5">
                <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                    <h2 className="view-employee-head">Customer Information</h2>
                    <button
                        onClick={handleClose}
                        className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                    >
                        <X className="text-white" />
                    </button>
                </div>

                <div className="p-5 relative">
                    {/* Vertical divider line */}
                    <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Name
                            </label>
                            <div className="view-employee-data">{customer.name}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                City
                            </label>
                            <div className="view-employee-data">{customer.city}</div>
                        </div>

                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Address
                            </label>
                            <div className="view-employee-data">{customer.address}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                State
                            </label>
                            <div className="view-employee-data">{customer.state}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Zipcode
                            </label>
                            <div className="view-employee-data">{customer.zipcode}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Country
                            </label>
                            <div className="view-employee-data">{customer.country}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Email
                            </label>
                            <div className="view-employee-data">{customer.email}</div>
                        </div>
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Contact Person
                            </label>
                            <div className="view-employee-data">{customer.contact_person}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Phone
                                </label>
                                <div className="view-employee-data">{customer.phone}</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Alternative Phone
                                </label>
                                <div className="view-employee-data">{customer.alternate_phone}</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Fax
                                </label>
                                <div className="view-employee-data">{customer.fax}</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Notes
                                </label>
                                <div className="view-employee-data">{customer.notes}</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Document
                                </label>
                                <button
                                    onClick={() => handleViewDocument(customer.upload_attachment)}
                                    className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn"
                                >
                                    Click to view file <Eye size={18} />
                                </button>
                            </div>
                        </div>

                        {customer.is_draft && (
                            <div>
                                <label className="block view-employee-label mb-[6px]">
                                    Status
                                </label>
                                <div className="view-employee-data">Draft</div>
                            </div>
                        )}

                        <div className="flex space-x-10 justify-end">
                            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                                Edit
                                <button onClick={() => handleEdit(id)}>
                                    <img
                                        src={edits}
                                        alt="Edit Icon"
                                        className="w-[18px] h-[18px]"
                                    />
                                </button>
                            </div>

                            <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                                Delete
                                <button onClick={openDeleteModal}>
                                    <img
                                        src={deletes}
                                        alt="Delete Icon"
                                        className="w-[18px] h-[18px]"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
                onClose={() => setShowSuccessModal(false)}
                successMessage={successMessage}
            />

            {/* Error Modal */}
            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={error}
            />
        </>
    );
};

export default QmsViewCustomer;