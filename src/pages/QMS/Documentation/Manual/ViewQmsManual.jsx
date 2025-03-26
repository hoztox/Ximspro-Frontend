import React, { useState } from 'react';
import edits from "../../../../assets/images/Company Documentation/edit.svg"
import deletes from "../../../../assets/images/Company Documentation/delete.svg"
import { motion, AnimatePresence } from 'framer-motion';
import "./viewqmsmanual.css"
import { X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewQmsManual = () => {
    const navigate = useNavigate();
    const [correctionRequest, setCorrectionRequest] = useState({
        isOpen: false,
        text: ''
    });

    const sectionDetails = {
        sectionName: 'Anonymous',
        preparedBy: 'Anonymous',
        sectionNumber: 'A87595C',
        checkedBy: 'Anonymous',
        revision: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        approvedBy: 'Anonymous',
        documentType: 'Internal',
        date: '20-03-2024',
        reviewFrequency: '2 years, 4 months'
    };

    const handleCorrectionRequest = () => {
        setCorrectionRequest(prev => ({
            ...prev,
            isOpen: true
        }));
    };

    const handleCloseCorrectionRequest = () => {
        setCorrectionRequest({
            isOpen: false,
            text: ''
        });
    };

    const handleCloseViewPage = () => {
        navigate('/company/qms/manual')
    }

    const handleCorrectionSubmit = () => {
        console.log('Correction submitted:', correctionRequest.text);
        handleCloseCorrectionRequest();
    };

    //Animation
    const correctionVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3
            }
        },
        visible: {
            opacity: 1,
            height: 'auto',
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <div className="bg-[#1C1C24] p-5 rounded-lg">
            <div className='flex justify-between items-center border-b border-[#383840] pb-[26px]'>
                <h1 className='viewmanualhead'>Review Manual Section</h1>
                <button
                    className="text-white bg-[#24242D] p-1 rounded-md"
                    onClick={handleCloseViewPage}
                >
                    <X size={22} />
                </button>
            </div>
            <div className="mt-5">
                <div className="grid grid-cols-2 divide-x divide-[#383840] border-b border-[#383840] pb-5">
                    <div className="grid grid-cols-1 gap-[40px]">
                        <div>
                            <label className="viewmanuallabels">Section Name/Title</label>
                            <div className="flex justify-between items-center">
                                <p className="viewmanuasdata">{sectionDetails.sectionName}</p>
                            </div>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Section Number</label>
                            <p className="viewmanuasdata">{sectionDetails.sectionNumber}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Revision</label>
                            <p className="viewmanuasdata">{sectionDetails.revision}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Document Type</label>
                            <p className="viewmanuasdata">{sectionDetails.documentType}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Document</label>
                            <div className='flex items-center cursor-pointer gap-[8px]'>
                                <p className="click-view-file-text">Click to view file</p>
                                <Eye size={20} className='text-[#1E84AF]' />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-[40px] pl-5">
                        <div>
                            <label className="viewmanuallabels">Written/Prepare By</label>
                            <p className="viewmanuasdata">{sectionDetails.preparedBy}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Checked By</label>
                            <p className="viewmanuasdata">{sectionDetails.checkedBy}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Approved By</label>
                            <p className="viewmanuasdata">{sectionDetails.approvedBy}</p>
                        </div>
                        <div>
                            <label className="viewmanuallabels">Date</label>
                            <p className="viewmanuasdata">{sectionDetails.date}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div>
                                <label className="viewmanuallabels">Review Frequency</label>
                                <p className="viewmanuasdata">{sectionDetails.reviewFrequency}</p>
                            </div>
                            <div className='flex gap-10'>
                                <div className='flex flex-col justify-center items-center'>
                                    <label className="viewmanuallabels">Edit</label>
                                    <button>
                                        <img src={edits} alt="Edit Icon" />
                                    </button>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <label className="viewmanuallabels">Delete</label>
                                    <button>
                                        <img src={deletes} alt="Delete Icon" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-5">
                    {!correctionRequest.isOpen && (
                        <>
                            <button
                                onClick={handleCorrectionRequest}
                                className="request-correction-btn duration-200"
                            >
                                Request For Correction
                            </button>
                            <button
                                className="review-submit-btn bg-[#1E84AF] p-5 rounded-md duration-200"
                            >
                                Review and Submit
                            </button>
                        </>
                    )}
                </div>

                <AnimatePresence>
                    {correctionRequest.isOpen && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={correctionVariants}
                            className="mt-4 overflow-hidden"
                        >
                            <div className='flex justify-end mb-5'>
                                <button
                                    onClick={handleCloseCorrectionRequest}
                                    className="text-white bg-[#24242D] p-1 rounded-md"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <textarea
                                value={correctionRequest.text}
                                onChange={(e) => setCorrectionRequest(prev => ({
                                    ...prev,
                                    text: e.target.value
                                }))}
                                placeholder="Enter Correction"
                                className="w-full h-32 bg-[#24242D] text-white px-5 py-[14px] rounded-md resize-none focus:outline-none correction-inputs"
                            />
                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={handleCorrectionSubmit}
                                    className="save-btn duration-200 text-white"
                                >
                                    Save
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ViewQmsManual