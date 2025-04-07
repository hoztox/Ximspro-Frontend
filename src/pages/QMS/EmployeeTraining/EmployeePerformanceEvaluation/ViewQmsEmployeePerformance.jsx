import React, { useState } from 'react';
import { X } from 'lucide-react';
import edits from "../../../../assets/images/Company Documentation/edit.svg"
import deletes from '../../../../assets/images/Company Documentation/delete.svg'
import "./viewqmsemployeeperformance.css";
import { useNavigate } from 'react-router-dom';

const ViewQmsEmployeePerformance = () => {
    const [formData, setFormData] = useState({
        evaluationTitle: 'Anonymous',
        evaluationDescription: 'Anonymous',
        validTill: '20-03-2024',
        isModalOpen: true
    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/company/qms/employee-performance')
    };

    const handleEdit = () => {
        navigate('/company/qms/edit-employee-performance')
    };

    const handleDelete = () => {
        console.log('Delete button clicked');
    };

    if (!formData.isModalOpen) return null;

    return (

        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Employee Performance Evaluation Information</h2>
                <button onClick={handleClose} className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md">
                    <X className='text-white' />
                </button>
            </div>

            <div className="p-5 relative">
                {/* Vertical divider line */}
                <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                    <div>
                        <label className="block view-employee-label mb-[6px]">Evaluation Title</label>
                        <div className="view-employee-data">{formData.evaluationTitle}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">Evaluation Description</label>
                        <div className="view-employee-data">{formData.evaluationDescription}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">Valid Till</label>
                        <div className="view-employee-data">{formData.validTill}</div>
                    </div>
                    <div className="flex justify-end items-end space-x-10">
                        <div className='flex flex-col justify-center items-center gap-[8px] view-employee-label'>
                            Edit
                            <button
                                onClick={handleEdit}
                            >
                                <img src={edits} alt="Edit Iocn" className='w-[18px] h-[18px]'/>
                            </button>
                        </div>

                        <div className='flex flex-col justify-center items-center gap-[8px] view-employee-label'>
                            Delete
                            <button
                                onClick={handleDelete}
                            >
                                <img src={deletes} alt="Delete Icon" className='w-[18px] h-[18px]'/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ViewQmsEmployeePerformance;