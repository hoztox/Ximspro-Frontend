import React, { useState } from 'react';
import { X, Eye } from 'lucide-react';
import edits from "../../../assets/images/Company Documentation/edit.svg"
import deletes from '../../../assets/images/Company Documentation/delete.svg'
import { useNavigate } from 'react-router-dom';

const QmsViewCompliance = () => {
    const [formData, setFormData] = useState({
        title: 'Anonymous',
        no: 'Anonymous',
        type: 'Anonymous',
        date: '20-03-2024',
        document: '',
        related_business_process: 'Anonymous',
        remarks: 'Anonymous',
        related_document_process: 'Anonymous',
        revision: 'Anonymous'
    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/company/qms/list-compliance')
    };

    const handleEdit = () => {
        navigate('/company/qms/edit-compliance')
    };

    const handleDelete = () => {
        console.log('Delete button clicked');
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Compliance / Obligation Information</h2>
                <button onClick={handleClose} className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md">
                    <X className='text-white' />
                </button>
            </div>

            <div className="p-5 relative">
                {/* Vertical divider line */}
                <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                    <div>
                        <label className="block view-employee-label mb-[6px]">Compliance/Obligation Name/Title</label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">Compliance/Obligation Number</label>
                        <div className="view-employee-data">{formData.no}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">Compliance/Obligation Type</label>
                        <div className="view-employee-data">{formData.type}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">Date</label>
                        <div className="view-employee-data">{formData.date}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">Attach Document</label>
                        <button className="flex  items-center gap-2 view-employee-data !text-[#1E84AF]">
                            Click to view file 
                            <Eye size={17}/>
                            {formData.document}
                        </button>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">Related Business Processes</label>
                        <div className="view-employee-data">{formData.related_business_process}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">Compliance/Obligation Remarks</label>
                        <div className="view-employee-data">{formData.remarks}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">Related Document/Process</label>
                        <div className="view-employee-data">{formData.related_document_process}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">Revision</label>
                        <div className="view-employee-data">{formData.revision}</div>
                    </div>
                    <div className="flex justify-end items-end space-x-10">
                        <div className='flex flex-col justify-center items-center gap-[8px] view-employee-label'>
                            Edit
                            <button
                                onClick={handleEdit}
                            >
                                <img src={edits} alt="Edit Iocn" className='w-[18px] h-[18px]' />
                            </button>
                        </div>

                        <div className='flex flex-col justify-center items-center gap-[8px] view-employee-label'>
                            Delete
                            <button
                                onClick={handleDelete}
                            >
                                <img src={deletes} alt="Delete Icon" className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default QmsViewCompliance
