import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { motion, AnimatePresence } from 'framer-motion';
import "./qmsemployeeperformance.css"
import { useNavigate } from 'react-router-dom';

// Modal Components
const EvaluationModal = ({ isOpen, onClose, employee }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-[#24242D] rounded-lg w-full max-w-lg mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-[#383840]">
                <h2 className="text-xl font-medium text-white">Employee Evaluation</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg text-white mb-2">Employee: {employee?.title}</h3>
                  <p className="text-gray-300 mb-4">Valid till: {employee?.validTill}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Performance Rating</label>
                    <select className="w-full bg-[#1C1C24] text-white p-3 rounded-md border border-[#383840] outline-none">
                      <option value="">Select rating</option>
                      <option value="5">Excellent (5)</option>
                      <option value="4">Good (4)</option>
                      <option value="3">Average (3)</option>
                      <option value="2">Fair (2)</option>
                      <option value="1">Poor (1)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Comments</label>
                    <textarea 
                      className="w-full bg-[#1C1C24] text-white p-3 rounded-md border border-[#383840] outline-none min-h-32"
                      placeholder="Enter your evaluation comments..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-transparent border border-[#858585] text-[#858585] rounded-md hover:bg-[#858585] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-[#1E84AF] text-white rounded-md hover:bg-[#176d8e] transition-colors"
                  >
                    Submit Evaluation
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

const QuestionsModal = ({ isOpen, onClose, employee }) => {
  const [questions, setQuestions] = useState([
    { id: 1, question: "", weight: 1 }
  ]);
  
  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, question: "", weight: 1 }]);
  };
  
  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };
  
  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-[#24242D] rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-[#383840] sticky top-0 bg-[#24242D]">
              <h2 className="text-xl font-medium text-white">Add Evaluation Questions</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg text-white">Employee: {employee?.title}</h3>
              </div>
              
              <div className="space-y-6">
                {questions.map((q, index) => (
                  <motion.div 
                    key={q.id} 
                    className="p-4 border border-[#383840] rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-medium">Question {index + 1}</h4>
                      <button 
                        onClick={() => removeQuestion(q.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        disabled={questions.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Question Text</label>
                        <textarea 
                          className="w-full bg-[#1C1C24] text-white p-3 rounded-md border border-[#383840] outline-none"
                          placeholder="Enter question text..."
                          value={q.question}
                          onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Question Weight</label>
                        <select 
                          className="w-full bg-[#1C1C24] text-white p-3 rounded-md border border-[#383840] outline-none"
                          value={q.weight}
                          onChange={(e) => updateQuestion(q.id, 'weight', parseInt(e.target.value))}
                        >
                          <option value="1">1 - Low</option>
                          <option value="2">2 - Medium</option>
                          <option value="3">3 - High</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.button 
                  onClick={addQuestion}
                  className="flex items-center justify-center w-full p-3 border border-dashed border-[#858585] text-[#858585] rounded-lg hover:bg-[#31313a] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">Add Question</span>
                  <span>+</span>
                </motion.button>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-transparent border border-[#858585] text-[#858585] rounded-md hover:bg-[#858585] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <motion.button 
                  className="px-4 py-2 bg-[#1E84AF] text-white rounded-md hover:bg-[#176d8e] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Questions
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const QmsEmployeePerformance = () => {
    const initialData = [
        { id: 1, title: 'Anonymous', validTill: '03-12-2024', email: 'employee1@company.com' },
        { id: 2, title: 'Anonymous', validTill: '03-12-2024', email: 'employee2@company.com' },
    ];

    // State for data management
    const [employees, setEmployees] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    // Modal states
    const [evaluationModal, setEvaluationModal] = useState({ isOpen: false, employee: null });
    const [questionsModal, setQuestionsModal] = useState({ isOpen: false, employee: null });

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter employees based on search term
    const filteredEmployees = employees.filter(employee =>
        employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add new employee
    const handleAddEmployee = (e) => {
        navigate('/company/qms/add-employee-performance')
    };

    const handleView = () => {
        navigate('/company/qms/view-employee-performance')
    }

    // Edit employee
    const handleEdit = () => {
        navigate('/company/qms/edit-employee-performance')
    };

    // Delete employee
    const handleDelete = (id) => {
        // Implementation
    };
    
    // Open evaluation modal
    const openEvaluationModal = (employee) => {
        setEvaluationModal({ isOpen: true, employee });
    };
    
    // Open questions modal
    const openQuestionsModal = (employee) => {
        setQuestionsModal({ isOpen: true, employee });
    };

    // Pagination
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center pb-5">
                <h1 className="employee-performance-head">List Employee Performance Evaluation</h1>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[180px] border border-[#383840] outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <div className='absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>

                    <button
                        className="flex items-center justify-center !px-[5px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleAddEmployee}
                    >
                        <span>Add Employee Performance Evaluation</span>
                        <img src={plusIcon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className="h-[48px]">
                            <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                            <th className="px-2 text-left add-manual-theads">Title</th>
                            <th className="px-2 text-left add-manual-theads">Valid Till</th>
                            <th className="px-2 text-left add-manual-theads">Email</th>
                            <th className="px-2 text-left add-manual-theads">Evaluation</th>
                            <th className="px-2 text-left add-manual-theads">See Result Graph</th>
                            <th className="px-2 text-left add-manual-theads">Add Questions</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="px-2 text-center add-manual-theads">Edit</th>
                            <th className="px-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((employee) => (
                            <tr key={employee.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{employee.id}</td>
                                <td className="px-2 add-manual-datas">{employee.title}</td>
                                <td className="px-2 add-manual-datas">{employee.validTill}</td>
                                <td className="px-2 add-manual-datas">
                                    <button className="text-[#1E84AF]">Send Mail</button>
                                </td>
                                <td className="px-2 add-manual-datas">
                                    <button 
                                      className="text-[#1E84AF] hover:text-[#176d8e] transition-colors"
                                      onClick={() => openEvaluationModal(employee)}
                                    >
                                      Click to Evaluate
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas">
                                    <button className="text-[#1E84AF]">See Result Graph</button>
                                </td>
                                <td className="px-2 add-manual-datas">
                                    <button 
                                      className="text-[#1E84AF] hover:text-[#176d8e] transition-colors"
                                      onClick={() => openQuestionsModal(employee)}
                                    >
                                      Add Questions
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleView()}>
                                      <img src={viewIcon} alt="View Icon" className='action-btn' />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleEdit()}>
                                       <img src={editIcon} alt="Edit Icon" className='action-btn' />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleDelete(employee.id)}>
                                        <img src={deleteIcon} alt="Delete Icon" className='action-btn' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-3">
                <div className='text-white total-text'>Total-{filteredEmployees.length}</div>
                <div className="flex items-center gap-5">
                    <button
                       className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                        // Show pages around current page
                        const pageToShow = currentPage <= 2 ? i + 1 :
                            currentPage >= totalPages - 1 ? totalPages - 3 + i :
                                currentPage - 2 + i;

                        if (pageToShow <= totalPages) {
                            return (
                                <button
                                    key={pageToShow}
                                    className={`${currentPage === pageToShow ? 'pagin-active' : 'pagin-inactive'
                                    }`}
                                    onClick={() => setCurrentPage(pageToShow)}
                                >
                                    {pageToShow}
                                </button>
                            );
                        }
                        return null;
                    })}

                    <button
                      className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
            
            {/* Modals */}
            <EvaluationModal 
                isOpen={evaluationModal.isOpen} 
                onClose={() => setEvaluationModal({ isOpen: false, employee: null })} 
                employee={evaluationModal.employee} 
            />
            
            <QuestionsModal 
                isOpen={questionsModal.isOpen} 
                onClose={() => setQuestionsModal({ isOpen: false, employee: null })} 
                employee={questionsModal.employee} 
            />
        </div>
    );
};

export default QmsEmployeePerformance;