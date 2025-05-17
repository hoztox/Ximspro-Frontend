import React, { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import axios from "axios";
import { BASE_URL } from "../../../../Utils/Config";
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../Modals/SuccessModal';
import ErrorModal from '../Modals/ErrorModal';
import { motion, AnimatePresence } from 'framer-motion';

const AddAuditReportModal = ({
  isVisible,
  onClose,
  onSave,
  selectedAudit
}) => {
  const [formData, setFormData] = useState({
    upload_audit_report: '',
    upload_non_coformities_report: '',
  });

  const [fileURLs, setFileURLs] = useState({
    audit_report: '',
    non_conformities_report: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = new FormData();

      if (formData.audit_report instanceof File) {
        submissionData.append('upload_audit_report', formData.audit_report);
      }

      if (formData.non_conformities_report instanceof File) {
        submissionData.append('upload_non_coformities_report', formData.non_conformities_report);
      }

      if (!selectedAudit || !selectedAudit.id) {
        throw new Error('No audit selected or audit ID is missing');
      }

      const response = await axios.post(
        `${BASE_URL}/qms/audits/${selectedAudit.id}/upload-reports/`,
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Audit updated successfully:', response.data);
      onSave && onSave(response.data);
      setShowSuccessModal(true);
      setSuccessMessage("Report Uploaded Successfully");

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/company/qms/list-audit');
      }, 1500);
    } catch (error) {
      console.error('Error updating audit:', error);
      let errorMsg = 'Failed to upload files';

      if (error.response) {
        // Check for field-specific errors first
        if (error.response.data.date) {
          errorMsg = error.response.data.date[0];
        }
        // Check for non-field errors
        else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        }
        else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      setError(errorMsg);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (fileURLs.audit_report) URL.revokeObjectURL(fileURLs.audit_report);
      if (fileURLs.non_conformities_report) URL.revokeObjectURL(fileURLs.non_conformities_report);
    };
  }, [fileURLs]);

  const handleFileChange = (e, fieldName) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (fileURLs[fieldName]) {
        URL.revokeObjectURL(fileURLs[fieldName]);
      }

      const fileURL = URL.createObjectURL(selectedFile);

      setFormData({
        ...formData,
        [fieldName]: selectedFile
      });

      setFileURLs({
        ...fileURLs,
        [fieldName]: fileURL
      });
    }
  };

  const handleViewFile = (fieldName, e) => {
    e.preventDefault();
    if (fileURLs[fieldName]) {
      window.open(fileURLs[fieldName], '_blank');
    }
  };

  const truncateFileName = (fileName, maxLength = 20) => {
    if (!fileName) return "";
    if (fileName.length <= maxLength) return fileName;

    const extension = fileName.split('.').pop();
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
    return `${nameWithoutExtension.substring(0, maxLength - 5)}...${extension}`;
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
            className="bg-[#1C1C24] rounded-lg shadow-xl relative w-[1014px] p-5"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center px-[102px] border-b border-[#383840] pt-5">
              <h3 className="list-awareness-training-head">Add Audit Report</h3>

              <SuccessModal
                showSuccessModal={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                successMessage={successMessage}
              />

              <ErrorModal
                showErrorModal={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={error}
              />

              <motion.button
                onClick={onClose}
                className="bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="text-white" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit}>
              <motion.div
                className='px-[102px] flex justify-between gap-5'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-col gap-3 mt-5 w-full">
                  <label className="add-training-label">Upload Audit Report</label>
                  <div className="flex">
                    <input
                      type="file"
                      id="audit-report-upload"
                      onChange={(e) => handleFileChange(e, 'audit_report')}
                      className="hidden"
                    />
                    <motion.label
                      htmlFor="audit-report-upload"
                      className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="text-[#AAAAAA] choose-file">Choose File</span>
                      <img src={file} alt="" />
                    </motion.label>
                  </div>

                  <div className='flex items-center justify-between'>
                    <motion.button
                      onClick={(e) => handleViewFile('audit_report', e)}
                      disabled={!fileURLs.audit_report}
                      className='flex items-center gap-2 click-view-file-btn text-[#1E84AF] cursor-pointer'
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Click to view file <Eye size={17} />
                    </motion.button>
                    {formData.audit_report && (
                      <p className="no-file !text-white flex justify-end !mt-0" title={formData.audit_report.name}>
                        {truncateFileName(formData.audit_report.name)}
                      </p>
                    )}
                    {!formData.audit_report && (
                      <p className="no-file !text-white flex justify-end !mt-0">No file chosen</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-5 w-full">
                  <label className="add-training-label">Upload Non Conformities Report</label>
                  <div className="flex">
                    <input
                      type="file"
                      id="non-conformities-upload"
                      onChange={(e) => handleFileChange(e, 'non_conformities_report')}
                      className="hidden"
                    />
                    <motion.label
                      htmlFor="non-conformities-upload"
                      className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="text-[#AAAAAA] choose-file">Choose File</span>
                      <img src={file} alt="" />
                    </motion.label>
                  </div>

                  <div className='flex items-center justify-between'>
                    <motion.button
                      onClick={(e) => handleViewFile('non_conformities_report', e)}
                      disabled={!fileURLs.non_conformities_report}
                      className='flex items-center gap-2 click-view-file-btn text-[#1E84AF] cursor-pointer'
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Click to view file <Eye size={17} />
                    </motion.button>
                    {formData.non_conformities_report && (
                      <p className="no-file !text-white flex justify-end !mt-0" title={formData.non_conformities_report.name}>
                        {truncateFileName(formData.non_conformities_report.name)}
                      </p>
                    )}
                    {!formData.non_conformities_report && (
                      <p className="no-file !text-white flex justify-end !mt-0">No file chosen</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  className="text-red-500 mt-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                className="flex justify-end gap-5 mt-8 px-[102px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="cancel-btn duration-200"
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="save-btn duration-200"
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAuditReportModal; 