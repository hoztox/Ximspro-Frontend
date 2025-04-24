import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsViewSupplier = () => {
    const [formData, setFormData] = useState({
        company_name: "test",
        website: "test",
        email: "test",
        city: "test",
        address: "test",
        state: "test",
        postal_code: "test",
        country: "test@gamil.com",
        phone: "0987456",
        alternate_phone: "0987456",
        fax: 'test',
        contact_person: "test",
        qualified_supply: 'test',
        notes: 'test',
        approved_by: 'test',
        status: 'test',
        selection_criteria: 'test',
        approval_date: 'test',

    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/company/qms/list-supplier");
    };

    const handleEdit = () => {
        navigate("/company/qms/edit-supplier");
    };

    const handleDelete = () => {
        console.log("Delete button clicked");
    };



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
                            Company  Name
                        </label>
                        <div className="view-employee-data">{formData.company_name}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Web Site
                        </label>
                        <div className="view-employee-data">{formData.website}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Email
                        </label>
                        <div className="view-employee-data">{formData.email}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            City
                        </label>
                        <div className="view-employee-data">{formData.city}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Address
                        </label>
                        <div className="view-employee-data">{formData.address}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            State
                        </label>
                        <div className="view-employee-data">{formData.state}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Postal Code
                        </label>
                        <div className="view-employee-data">{formData.postal_code}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">
                            Country
                        </label>
                        <div className="view-employee-data">{formData.country}</div>
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
                                Alternate Phone
                            </label>
                            <div className="view-employee-data">{formData.alternate_phone}</div>
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
                                Contact Person
                            </label>
                            <div className="view-employee-data">{formData.contact_person}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Qualified To Supply
                            </label>
                            <div className="view-employee-data">{formData.qualified_supply}</div>
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
                                Approved By
                            </label>
                            <div className="view-employee-data">{formData.approved_by}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Status
                            </label>
                            <div className="view-employee-data">{formData.status}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Selection Criteria
                            </label>
                            <div className="view-employee-data">{formData.selection_criteria}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Approval Date
                            </label>
                            <div className="view-employee-data">{formData.approval_date}</div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Pre Qualification
                            </label>
                            <button className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn">
                                Click to view file <Eye size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label className="block view-employee-label mb-[6px]">
                                Upload Document
                            </label>
                            <button className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn">
                                Click to view file <Eye size={18} />
                            </button>
                        </div>
                    <div className="flex space-x-10">
                        <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                            Edit
                            <button onClick={handleEdit}>
                                <img
                                    src={edits}
                                    alt="Edit Iocn"
                                    className="w-[18px] h-[18px]"
                                />
                            </button>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-[8px] view-employee-label">
                            Delete
                            <button onClick={handleDelete}>
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
export default QmsViewSupplier
