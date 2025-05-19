import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../../ThemeContext";
import blocks from "../../../../assets/images/Modal/blockillustrate.png";

const BlockConfirmModal = ({ showBlockModal, onConfirm, onCancel, blockMessage, currentAction }) => {
  const { theme } = useTheme();

  // Determine text and button labels based on the action
  const isBlocking = currentAction === 'block';
  const actionText = isBlocking ? 'block' : 'unblock';
  const actionButtonText = isBlocking ? 'Block' : 'Unblock';

  return (
    <AnimatePresence>
      {showBlockModal && (
        <motion.div
          className="modal-overlays"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`modals ${theme === "dark" ? "dark" : "light"}`}
            style={{ maxWidth: "calc(100vw - 40px)" }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`modal-contents space-y-6 ${
                theme === "dark" ? "dark" : "light"
              }`}
            >
              <div className="flex justify-center">
                <img
                  src={blocks}
                  alt="Block"
                  className="w-[168px] h-[147px]"
                />
              </div>
              <h3 className="confirmations">
                Are you sure you want to {actionText}
                <br />
                this {blockMessage || "Supplier"}?
              </h3>
              <div
                className="modal-actionss gap-3"
                style={{ maxWidth: "calc(100vw - 80px)" }}
              >
                <button
                  onClick={onCancel}
                  className="btn-cancels duration-200 w-[176px] h-[49px]"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="btn-confirms duration-200 w-[176px] h-[49px]"
                >
                  {actionButtonText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlockConfirmModal; 