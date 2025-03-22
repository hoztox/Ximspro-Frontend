import React from 'react'
import "./subscriptiondeleteerror.css";
import errors from "../../../assets/images/Modal/errors.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '../../../ThemeContext';

const SubscriptionDeleteErrorModal = ({ showDeleteSubscriptionErrorModal, onClose }) => {
    const { theme } = useTheme();

    if (!showDeleteSubscriptionErrorModal) return null;
    return (
      <AnimatePresence>
        {showDeleteSubscriptionErrorModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`modal ${theme === "dark" ? "dark" : "light"}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`modal-content flex flex-col items-center justify-center ${theme === "dark" ? "dark" : "light"}`}>
                <img src={errors} alt="" className="w-12" />
                <h1 className="messegehead">An error occurred!</h1>
                <p className="messege">Please try again</p>
                <button onClick={onClose} className="deleteclosebtns duration-200">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

export default SubscriptionDeleteErrorModal
