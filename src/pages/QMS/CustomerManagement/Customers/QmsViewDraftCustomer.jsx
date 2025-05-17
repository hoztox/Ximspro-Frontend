import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from '../../../../Utils/Config';
import axios from "axios";

const QmsViewDraftCustomer = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        const fetchDraftCustomerData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/customer/${id}/`);
                setCustomer(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching draft customer data:", err);
                setError("Failed to load draft customer data");
                setLoading(false);
            }
        };

        if (id) {
            fetchDraftCustomerData();
        }
    }, [id]);

    const handleClose = () => {
        navigate("/company/qms/draft-customer");
    };

    const handleViewDocument = (url) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            alert("No document available");
        }
    };

    if (loading) return (
        <div className="bg-[#1C1C24] not-found rounded-lg p-5 flex justify-center items-center h-96">
            Loading draft customer data...
        </div>
    );

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Draft Customer Information</h2>
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
                            Address
                        </label>
                        <div className="view-employee-data">{customer.address}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            City
                        </label>
                        <div className="view-employee-data">{customer.city}</div>
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
                                Alternate Phone
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
                </div>
            </div>
        </div>
    );
};

export default QmsViewDraftCustomer;