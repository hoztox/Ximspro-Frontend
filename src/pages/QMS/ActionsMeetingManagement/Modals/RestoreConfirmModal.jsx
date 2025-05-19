import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../../ThemeContext";
import restores from "../../../../assets/images/Modal/restore.png"

const RestoreConfirmModal = ({ showRestoreModal, onConfirm, onCancel, restoreMessage }) => {
    const { theme } = useTheme();

    return (
        <AnimatePresence>
            {showRestoreModal && (
                <motion.div
                    className="modal-overlays"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className={`modals ${theme === "dark" ? "dark" : "light"
                            }`}
                        style={{ maxWidth: 'calc(100vw - 40px)' }}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className={`modal-contents space-y-6 ${theme === "dark" ? "dark" : "light"
                                }`}
                        >
                            <div className="flex justify-center">
                                <img src={restores} alt="Delete" className="w-[167px] h-[147px]" />
                            </div>
                            <h3 className="confirmations">
                                Are you sure you want to
                                <br />
                               restore this {restoreMessage || "Page"}?
                            </h3>
                            <div className="modal-actionss gap-3"
                                style={{ maxWidth: 'calc(100vw - 80px)' }}
                            >
                                <button onClick={onCancel} className="btn-cancels duration-200 w-[176px] h-[49px]">
                                    Cancel
                                </button>
                                <button onClick={onConfirm} className="btn-restores duration-200 w-[176px] h-[49px]">
                                    Restore
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RestoreConfirmModal
