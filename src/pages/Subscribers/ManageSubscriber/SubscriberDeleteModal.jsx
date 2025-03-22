import React from 'react'
import "./subscriberdeletemodal.css";
import { useTheme } from '../../../ThemeContext';
import { motion, AnimatePresence } from "framer-motion";

const SubscriberDeleteModal = ({ showDeleteSubscriberModal, onConfirm, onCancel }) => {
    const { theme } = useTheme();

    return (
      <AnimatePresence>
        {showDeleteSubscriberModal && (
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
                  Are you sure you want to
                  <br />
                  delete this subscriber?
                </h3>
                <div className="modal-actions gap-3">
                  <button onClick={onCancel} className="btn-cancel duration-200">
                    Cancel
                  </button>
                  <button onClick={onConfirm} className="btn-confirm duration-200">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

export default SubscriberDeleteModal
