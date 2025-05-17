import React, { useState, useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import { motion, AnimatePresence } from 'framer-motion';

const ViewInspectionReportModal = ({
    isVisible,
    onClose,
    selectedInspection
}) => {
    const [reportData, setReportData] = useState({
        inspection_report: null,
        non_conformities_report: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isVisible && selectedInspection && selectedInspection.id) {
            fetchInspectionReports();
        }
    }, [isVisible, selectedInspection]);

    const fetchInspectionReports = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/qms/inspection/${selectedInspection.id}/report/`);
            setReportData({
                inspection_report: response.data.data.upload_inspection_report,
                non_conformities_report: response.data.data.upload_non_coformities_report
            });
            setError(null);
        } catch (err) {
            console.error("Error fetching inspection reports:", err);
            setError("Failed to load inspection reports");
        } finally {
            setLoading(false);
        }
    };

    const handleViewFile = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="bg-[#1C1C24] rounded-lg shadow-xl relative w-[1014px] p-6"
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="flex justify-between items-center border-b border-[#383840] pb-5">
                            <h2 className="view-employee-head">Inspection Report Information</h2>
                            <motion.button
                                onClick={onClose}
                                className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                            >
                                <X className="text-white" />
                            </motion.button>
                        </div>

                        {loading ? (
                            <motion.div
                                className="flex justify-center items-center py-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-white">Loading inspection reports...</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                className="flex justify-center items-center py-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-red-500">{error}</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="grid grid-cols-2">
                                    <div className='border-r border-[#383840] mt-5'>
                                        <label className="block view-employee-label mb-[6px]">
                                            Inspection Report
                                        </label>
                                        {reportData.inspection_report ? (
                                            <motion.button
                                                className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn"
                                                onClick={() => handleViewFile(reportData.inspection_report)}
                                            >
                                                Click to view file <Eye size={18} />
                                            </motion.button>
                                        ) : (
                                            <p className="text-center not-found">No inspection report available</p>
                                        )}
                                    </div>

                                    <div className='mt-5 ml-5'>
                                        <label className="block view-employee-label mb-[6px]">
                                            Non Conformities Report
                                        </label>
                                        {reportData.non_conformities_report ? (
                                            <motion.button
                                                className="flex items-center gap-2 !text-[18px] text-[#1E84AF] click-view-file-btn"
                                                onClick={() => handleViewFile(reportData.non_conformities_report)}
                                            >
                                                Click to view file <Eye size={18} />
                                            </motion.button>
                                        ) : (
                                            <p className="text-center not-found">No non-conformities report available</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ViewInspectionReportModal;