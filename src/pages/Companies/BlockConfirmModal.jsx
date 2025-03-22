import React from 'react'
import "./blockconfirmmodal.css"
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../ThemeContext";

const BlockConfirmModal = ({ showBlockConfirmModal,actionType, onConfirm, onCancel }) => {
    const { theme } = useTheme();

    const modalMessage =
    actionType === "block"
      ? "Are you sure you want to block this company?"
      : "Are you sure you want to unblock this company?";

      const confirmButtonLabel = actionType === "block" ? "Block" : "Unblock";
  return (
    <AnimatePresence>
      {showBlockConfirmModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`modal ${
                theme === "dark" ? "dark" : "light"
              }`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`modal-content space-y-6 ${
                theme === "dark" ? "dark" : "light"
              }`}
            >
              <h3 className="confirmation">
              {modalMessage}
              </h3>
              <div className="modal-actions gap-3 ">
                <button onClick={onCancel} className="btn-cancel duration-200">
                  Cancel
                </button>
                <button onClick={onConfirm} className="btn-confirm duration-200">
                  {confirmButtonLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlockConfirmModal
