import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";


const QmsViewDraftCustomer = () => {
    const [formData, setFormData] = useState({
        name: "Anonymous",
        city: "Anonymous",
        street_address: "test",
        state: "test",
        zip_code: "test",
        country: "test",
        corrective_action: "test",
        email: "test@gamil.com",
        contact_person: "test",
        phone: "0987456",
        alternative_phone: "0987456",
        fax: 'test',
        notes: 'test',

    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/draft-customer");
    };


    return (
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
                        <div className="view-employee-data">{formData.name}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            City
                        </label>
                        <div className="view-employee-data">{formData.city}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Street Address
                        </label>
                        <div className="view-employee-data">{formData.street_address}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            State
                        </label>
                        <div className="view-employee-data">{formData.state}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Zip Code
                        </label>
                        <div className="view-employee-data">{formData.zip_code}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Country
                        </label>
                        <div className="view-employee-data">{formData.country}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Email
                        </label>
                        <div className="view-employee-data">{formData.email}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Contact Person
                        </label>
                        <div className="view-employee-data">{formData.contact_person}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Phone
                            </label>
                            <div className="view-employee-data">{formData.phone}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Alternative Phone
                            </label>
                            <div className="view-employee-data">{formData.alternative_phone}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Fax
                            </label>
                            <div className="view-employee-data">{formData.fax}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Notes
                            </label>
                            <div className="view-employee-data">{formData.notes}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Document
                            </label>
                            <button className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn">
                                Click to view file <Eye size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QmsViewDraftCustomer
