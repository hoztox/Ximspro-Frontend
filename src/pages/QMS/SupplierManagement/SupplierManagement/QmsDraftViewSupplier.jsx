import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from '../../../../Utils/Config';
import axios from "axios";

const QmsDraftViewSupplier = () => {
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    console.log('draft supplier id', id);

    useEffect(() => {
        const fetchDraftSupplierData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/draft-suppliers/${id}/`);
                setSupplier(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching draft supplier data:", err);
                setError("Failed to load draft supplier data");
                setLoading(false);
            }
        };

        if (id) {
            fetchDraftSupplierData();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/draft-supplier");
    };

    const handleViewDocument = (url) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            alert("No document available");
        }
    };

    if (loading) return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-96">
            Loading draft supplier data...
        </div>
    );

    if (error) return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-96">
            {error}
        </div>
    );

    if (!supplier) return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5 flex justify-center items-center h-96">
            Draft supplier not found
        </div>
    );

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Supplier Information (Draft)</h2>
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
                        <div className="view-employee-data">{supplier.company_name}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Web Site
                        </label>
                        <div className="view-employee-data">{supplier.website}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Email
                        </label>
                        <div className="view-employee-data">{supplier.email}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            City
                        </label>
                        <div className="view-employee-data">{supplier.city}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Address
                        </label>
                        <div className="view-employee-data">{supplier.address}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            State
                        </label>
                        <div className="view-employee-data">{supplier.state}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Postal Code
                        </label>
                        <div className="view-employee-data">{supplier.postal_code}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Country
                        </label>
                        <div className="view-employee-data">{supplier.country}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Phone
                            </label>
                            <div className="view-employee-data">{supplier.phone}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Alternate Phone
                            </label>
                            <div className="view-employee-data">{supplier.alternate_phone}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Fax
                            </label>
                            <div className="view-employee-data">{supplier.fax}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Contact Person
                            </label>
                            <div className="view-employee-data">{supplier.contact_person}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Qualified To Supply
                            </label>
                            <div className="view-employee-data">{supplier.qualified_to_supply || supplier.qualified_supply}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Notes
                            </label>
                            <div className="view-employee-data">{supplier.notes}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Approved By
                            </label>
                            <div className="view-employee-data">{supplier.approved_by}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{supplier.status}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Selection Criteria
                            </label>
                            <div className="view-employee-data">{supplier.selection_criteria}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Approval Date
                            </label>
                            <div className="view-employee-data">{supplier.approved_date || supplier.approval_date}</div>
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

                    <div>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QmsDraftViewSupplier;