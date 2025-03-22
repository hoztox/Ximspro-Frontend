import React from 'react'
import "./subscriptiondeletesuccess.css";
import { motion, AnimatePresence } from "framer-motion";
import check from "../../../assets/images/Modal/success.svg";;
import { useTheme } from '../../../ThemeContext';

const SubscriptionDeleteSuccess = ({ showDeleteSubscriptionSuccesssModal, onClose }) => {
    const { theme } = useTheme();

    if (!showDeleteSubscriptionSuccesssModal) return null;
    return (
      <AnimatePresence>
        {showDeleteSubscriptionSuccesssModal && (
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
                <img src={check} alt="" className="w-12" />
                <h1 className="messegehead">Success!</h1>
                <p className="messege">Subscription Deleted Successfully!</p>
                <button onClick={onClose} className="successclosebtn duration-200">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

export default SubscriptionDeleteSuccess
