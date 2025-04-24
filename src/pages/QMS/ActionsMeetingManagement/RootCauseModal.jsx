import React, { useState, useEffect } from 'react';
import deletes from "../../../assets/images/Company Documentation/delete.svg"
import "./causesmodal.css"


const RootCauseModal = ({ isOpen, onClose }) => {
    const [animateClass, setAnimateClass] = useState('');
    useEffect(() => {
        if (isOpen) {
            setAnimateClass('opacity-100 scale-100');
        } else {
            setAnimateClass('opacity-0 scale-95');
        }
    }, [isOpen]);

    const [rootCausesItems, setRootCausesItems] = useState([
        { id: 1, title: "Anonymous" },
        { id: 2, title: "Anonymous" },
        { id: 3, title: "Anonymous" },
        { id: 4, title: "Anonymous" }
    ]);

    const [newRootCauseCausesTitle, setNewRootCausesTitle] = useState("");
    const [isAddingRootCauses, setIsAddingRootCauses] = useState(false);
    const [nextId, setNextId] = useState(5);

    const handleDelete = (id) => {
        setRootCausesItems(rootCausesItems.filter(item => item.id !== id));
    };

    const handleSave = () => {
        if (newRootCauseCausesTitle.trim()) {
            setRootCausesItems([...rootCausesItems, { id: nextId, title: newRootCauseCausesTitle }]);
            setNextId(nextId + 1);
            setNewRootCausesTitle("");
            setIsAddingRootCauses(false);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className={`bg-[#13131A] text-white rounded-[4px] w-[563px] p-5 transform transition-all duration-300 ${animateClass}`}>
                <div className="bg-[#1C1C24] rounded-[4px] p-5 mb-6 max-h-[350px]">
                    <h2 className="agenda-list-head pb-5">Root Causes List</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-400">
                            <thead className="bg-[#24242D] h-[48px]">
                                <tr className="rounded-[4px]">
                                    <th className="px-3 w-[10%] agenda-thead">No</th>
                                    <th className="px-3 w-[70%] agenda-thead">Title</th>
                                    <th className="px-3 text-center w-[20%] agenda-thead">Delete</th>
                                </tr>
                            </thead>
                        </table>
                        <div className="max-h-[230px] overflow-y-auto">
                            <table className="w-full text-left text-gray-400">
                                <tbody>
                                    {rootCausesItems.map((item, index) => (
                                        <tr key={item.id} className="border-b border-[#383840] h-[42px]">
                                            <td className="px-3 agenda-data w-[10%]">{index + 1}</td>
                                            <td className="px-3 agenda-data w-[70%]">{item.title}</td>
                                            <td className="px-3 agenda-data text-center w-[20%]">
                                                <div className="flex items-center justify-center h-[42px]">
                                                    <button onClick={() => handleDelete(item.id)}>
                                                        <img src={deletes} alt="Delete Icon" className="w-[16px] h-[16px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1C1C24] rounded-[4px]">
                    <h3 className="agenda-list-head border-b border-[#383840] px-5 py-6">Add Root Causes</h3>

                    <div className="mb-4 px-5">
                        <label className="block mb-3 agenda-list-label">
                            Root Causes Title <span className="text-[#F9291F]">*</span>
                        </label>
                        <input
                            type="text"
                            value={newRootCauseCausesTitle}
                            onChange={(e) => setNewRootCausesTitle(e.target.value)}
                            className="w-full add-agenda-inputs bg-[#24242D] h-[49px] px-5 border-none outline-none"
                        />
                    </div>

                    <div className="flex gap-5 justify-end pb-5 px-5">
                        <button
                            onClick={onClose}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="save-btn"
                            disabled={!newRootCauseCausesTitle.trim()}
                        >
                            Save
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RootCauseModal
