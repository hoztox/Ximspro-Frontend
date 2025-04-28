import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from '../../../../Utils/Config';
import axios from "axios";

const QmsViewSupplier = () => {
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    console.log('supplier id', id);

    useEffect(() => {
        const fetchSupplierData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/suppliers/${id}/`);
                setSupplier(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching supplier data:", err);
                setError("Failed to load supplier data");
                setLoading(false);
            }
        };

        if (id) {
            fetchSupplierData();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/list-supplier");
    };

    const handleEdit = (id) => {
        navigate(`/company/qms/edit-supplier/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                await axios.delete(`${BASE_URL}/qms/suppliers/${id}/`);
                alert("Supplier deleted successfully");
                navigate("/company/qms/list-supplier");
            } catch (err) {
                console.error("Error deleting supplier:", err);
                alert("Failed to delete supplier");
            }
        }
    };

    const handleViewDocument = (url) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            alert("No document available");
        }
    };

    // Helper function to safely render field values
    const renderFieldValue = (value) => {
        if (value === null || value === undefined) return "N/A";
        if (typeof value === 'object') return JSON.stringify(value);
        return value;
    };

    if (loading) return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-96">
            Loading supplier data...
        </div>
    );

    if (error) return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-96">
            {error}
        </div>
    );

    if (!supplier) return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-96">
            Supplier not found
        </div>
    );

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Supplier Information</h2>
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
                            Company Name
                        </label>
                        <div className="view-employee-data">{renderFieldValue(supplier.company_name)}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Web Site
                        </label>
                        <div className="view-employee-data">{renderFieldValue(supplier.website)}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Email
                        </label>
                        <div className="view-employee-data">{renderFieldValue(supplier.email)}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            City
                        </label>
                        <div className="view-employee-data">{renderFieldValue(supplier.city)}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Address
                        </label>
                        <div className="view-employee-data">{renderFieldValue(supplier.address)}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            State
                        </label>
                        <div className="view-employee-data">{renderFieldValue(supplier.state)}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Postal Code
                        </label>
                        <div className="view-employee-data">{renderFieldValue(supplier.postal_code)}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Country
                        </label>
                        <div className="view-employee-data">{renderFieldValue(supplier.country)}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Phone
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.phone)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Alternate Phone
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.alternate_phone)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Fax
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.fax)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Contact Person
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.contact_person)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Qualified To Supply
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.qualified_to_supply)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Notes
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.notes)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Approved By
                            </label>
                            <div className="view-employee-data">
                                {renderFieldValue(`${supplier.approved_by.first_name} ${supplier.approved_by.last_name}`)}
                            </div>

                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.status)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Selection Criteria
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.selection_criteria)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Approval Date
                            </label>
                            <div className="view-employee-data">{renderFieldValue(supplier.approved_date)}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Pre Qualification
                            </label>
                            <button
                                onClick={() => handleViewDocument(supplier.pre_qualification)}
                                className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn"
                            >
                                Click to view file <Eye size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Upload Document
                            </label>
                            <button
                                onClick={() => handleViewDocument(supplier.documents)}
                                className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn"
                            >
                                Click to view file <Eye size={18} />
                            </button>
                        </div>
                        <div className="flex space-x-10">
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
                                <button onClick={() => handleDelete(id)}>
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
        </div>
    );
};

export default QmsViewSupplier;