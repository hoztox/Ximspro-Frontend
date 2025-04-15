import React, { useState } from 'react';
import { X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const QmsDraftViewLegalRequirements = () => {
    const [formData, setFormData] = useState({
        title: 'Anonymous',
        no: 'Anonymous',
        type: 'Anonymous',
        date: '20-03-2024',
        document: '',
        relate_record_format: 'Anonymous',
        revision: 'Anonymous'
    });
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/company/qms/draft-legal-requirements')
    };

    return (
        <div className="bg-[#1C1C24] text-white rounded-lg p-5">
            <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                <h2 className="view-employee-head">Legal and Other Requirements Information</h2>
                <button onClick={handleClose} className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md">
                    <X className='text-white' />
                </button>
            </div>

            <div className="p-5 relative">
                {/* Vertical divider line */}
                <div className="hidden md:block absolute top-[20px] bottom-[20px] left-1/2 border-l border-[#383840]"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
                    <div>
                        <label className="block view-employee-label mb-[6px]">Legal / Law Name / Title</label>
                        <div className="view-employee-data">{formData.title}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">Legal / Law Number</label>
                        <div className="view-employee-data">{formData.no}</div>
                    </div>

                    <div>
                        <label className="block view-employee-label mb-[6px]">Document Type</label>
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
                            <Eye size={17} />
                            {formData.document}
                        </button>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">Relate Record Format</label>
                        <div className="view-employee-data">{formData.relate_record_format}</div>
                    </div>
                    <div>
                        <label className="block view-employee-label mb-[6px]">Revision</label>
                        <div className="view-employee-data">{formData.revision}</div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default QmsDraftViewLegalRequirements
