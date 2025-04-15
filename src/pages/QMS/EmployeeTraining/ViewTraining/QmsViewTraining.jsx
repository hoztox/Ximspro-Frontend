
import React, { useState } from 'react';
import { X, Eye } from 'lucide-react';
import edits from '../../../../assets/images/Company Documentation/edit.svg'
import deletes from '../../../../assets/images/Company Documentation/delete.svg'
import "./qmsviewtraining.css";
import { useNavigate } from 'react-router-dom';

const QmsViewTraining = () => {
    const [formData, setFormData] = useState({
        trainingTitle: 'Anonymous',
        typeOfTraining: 'Internal',
        expectedResults: 'Test',
        actualResults: 'Test',
        trainingAttendees: 'Internal',
        status: 'Active',
        requestedBy: 'Anonymous',
        datePlanned: '20-03-2024',
        dateConducted: '20-03-2024',
        start: '1 hour, 10 minute',
        end: '1 hour, 10 minute',
        venue: 'Test',
        document: ' ',
        trainingEvaluation: 'Test',
        evaluationDate: '20-03-2024',
        evaluationBy: 'Test'
    });

    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/company/qms/list-training')
    };

    const handleEdit = () => {   
        navigate('/company/qms/edit-training')
    };

    const handleDelete = () => {
        console.log('Delete clicked');
    };

    return (
        <div>
            <div className="bg-[#1C1C24] text-white rounded-lg w-full p-5">
                <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                    <h2 className="training-info-head">Training Information</h2>
                    <button onClick={handleClose} className="text-white bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md">
                        <X size={24} />
                    </button>
                </div>

                <div className="pt-5 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-[40px] border-r border-[#383840]">
                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Training Title</p>
                            <p className="text-white view-training-data">{formData.trainingTitle}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Expected Results</p>
                            <p className="text-white view-training-data">{formData.expectedResults}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Training Attendees</p>
                            <p className="text-white view-training-data">{formData.trainingAttendees}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Requested By</p>
                            <p className="text-white view-training-data">{formData.requestedBy}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Date Conducted</p>
                            <p className="text-white view-training-data">{formData.dateConducted}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">End</p>
                            <p className="text-white view-training-data">{formData.end}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Document</p>
                            <button className="text-[#1E84AF] flex items-center gap-2 click-view-file-btn !text-[18px]">
                                 Click to view file <Eye size={20} className='text-[#1E84AF]' />
                                 {formData.document}
                            </button>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Evaluation Date</p>
                            <p className="text-white view-training-data">{formData.evaluationDate}</p>
                        </div>
                    </div>

                    <div className="space-y-[40px] ml-5">
                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Type of Training</p>
                            <p className="text-white view-training-data">{formData.typeOfTraining}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Actual Results</p>
                            <p className="text-white view-training-data">{formData.actualResults}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Status</p>
                            <p className="text-white view-training-data">{formData.status}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Date Planned</p>
                            <p className="text-white view-training-data">{formData.datePlanned}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Start</p>
                            <p className="text-white view-training-data">{formData.start}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Venue</p>
                            <p className="text-white view-training-data">{formData.venue}</p>
                        </div>

                        <div>
                            <p className="text-[#AAAAAA] view-training-label mb-[6px]">Training Evaluation</p>
                            <p className="text-white view-training-data">{formData.trainingEvaluation}</p>
                        </div>

                        <div className='flex justify-between'>
                            <div>
                                <p className="text-[#AAAAAA] view-training-label mb-[6px]">Evaluation By</p>
                                <p className="text-white view-training-data">{formData.evaluationBy}</p>
                            </div>
                            <div className="flex gap-10">
                                <button
                                    onClick={handleEdit}
                                    className="flex flex-col gap-2 items-center justify-center edit-btn"
                                >
                                    Edit
                                    <img src={edits} alt="Edit Icon" className='w-[18px] h-[18px]' />
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="flex flex-col gap-2 items-center justify-center delete-btn"
                                >
                                    Delete
                                    <img src={deletes} alt="Delete Icon" className='w-[18px] h-[18px]'/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default QmsViewTraining
